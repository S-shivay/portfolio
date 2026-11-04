"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/cn";
import { useBackToClose } from "@/hooks/useBackToClose";
import { Icon } from "@/components/ui/Icon";
import { IssuerMark } from "@/components/certificates/IssuerMark";
import { CertificateDetails } from "@/components/certificates/CertificateDetails";
import {
  ViewerStage,
  clampZoom,
  MIN_ZOOM,
  MAX_ZOOM,
} from "@/components/certificates/ViewerStage";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

const ZOOM_STEP = 1.25;
const EASE = [0.16, 1, 0.3, 1];

/**
 * The certificate viewer.
 *
 * A large dialog meant to feel like picking the document up: the certificate
 * on a stage that takes most of the screen, its metadata alongside, and
 * controls to zoom into a signature or a credential ID and to step through the
 * rest of the collection without closing.
 *
 * On phones the dialog takes the whole viewport. The details become a sheet
 * that slides over the stage on request, because beside a certificate on a
 * 390px screen they would leave the certificate a thumbnail again.
 *
 * Deliberately no download button. The original can be opened in a new tab,
 * which is what inspecting it needs; saving it is the browser's business.
 */
export function CertificateViewer({ items, index, open, onIndexChange, onClose }) {
  const mounted = useSyncExternalStore(subscribeNever, () => true, () => false);

  /* Portalled to <body>. The section that owns this component is `isolate`
     with a `z-10` content wrapper, so a fixed dialog rendered in place would
     be trapped in that stacking context: the nav and every later section
     would paint over it however high its own z-index. */
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && items[index] && (
        <ViewerPanel
          key="certificate-viewer"
          items={items}
          index={index}
          onIndexChange={onIndexChange}
          onClose={onClose}
        />
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* `useSyncExternalStore` with a server snapshot of false and a client snapshot
   of true: false during SSR and hydration, true afterwards, with no effect
   and no hydration mismatch. */
const subscribeNever = () => () => {};

/* Mounted only while open, so zoom, the details sheet and the fullscreen state
   all start fresh every time the viewer opens, with no reset logic. */
function ViewerPanel({ items, index, onIndexChange, onClose }) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef(null);
  useBackToClose(true, onClose);

  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [direction, setDirection] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const certificate = items[index];
  const count = items.length;

  // Client-only: this component never renders on the server.
  const canFullscreen =
    typeof document !== "undefined" && Boolean(document.fullscreenEnabled);

  /* ---- Lifecycle ------------------------------------------------------ */

  useEffect(() => {
    const trigger = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    // The dialog itself takes focus, not its first button, so a screen reader
    // announces the certificate's name before a toolbar of icons.
    dialogRef.current?.focus();

    const onFullscreenChange = () =>
      setFullscreen(document.fullscreenElement === dialogRef.current);
    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
      if (trigger instanceof HTMLElement) trigger.focus({ preventScroll: true });
    };
  }, []);

  /* ---- Actions -------------------------------------------------------- */

  const go = (delta) => {
    if (count < 2) return;
    setDirection(delta);
    setZoom(MIN_ZOOM);
    onIndexChange((index + delta + count) % count);
  };

  const zoomBy = (factor) => setZoom((value) => clampZoom(value * factor));

  const toggleFullscreen = () => {
    if (!canFullscreen) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      dialogRef.current?.requestFullscreen().catch(() => {});
    }
  };

  const onKeyDown = (event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;

    switch (event.key) {
      case "Escape":
        event.preventDefault();
        if (detailsOpen) setDetailsOpen(false);
        else onClose();
        return;
      case "ArrowRight":
        event.preventDefault();
        go(1);
        return;
      case "ArrowLeft":
        event.preventDefault();
        go(-1);
        return;
      case "+":
      case "=":
        event.preventDefault();
        zoomBy(ZOOM_STEP);
        return;
      case "-":
      case "_":
        event.preventDefault();
        zoomBy(1 / ZOOM_STEP);
        return;
      case "0":
        event.preventDefault();
        setZoom(MIN_ZOOM);
        return;
      case "f":
      case "F":
        event.preventDefault();
        toggleFullscreen();
        return;
      case "Tab":
        trapFocus(event, dialogRef.current);
        return;
      default:
    }
  };

  /* ---- Motion --------------------------------------------------------- */

  /* Opacity, scale and a brief blur that resolves as the dialog arrives. The
     filter is removed outright once the entrance finishes: even a `blur(0)`
     left in place keeps the dialog on a filter layer and makes it the
     containing block for its fixed-position children. */
  const panelMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.97, filter: "blur(8px)" },
        animate: {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          transitionEnd: { filter: "none" },
        },
        exit: { opacity: 0, scale: 0.985, filter: "blur(4px)" },
      };

  const zoomLabel = zoom <= MIN_ZOOM + 0.001 ? "Fit" : `${Math.round(zoom * 100)}%`;
  const isPdf = certificate.document.kind === "pdf";

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
      /* Portalled out of the section, so it re-declares the section's hue. */
      data-tone="certifications"
      className="fixed inset-0 z-50 flex sm:p-4 lg:p-6"
    >
      {/* Scrim. A pointer dismisses by clicking away; hidden from assistive
          tech, which has Escape and the Close button. */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[rgb(8_8_18/0.58)] backdrop-blur-md"
      />

      <m.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="certificate-viewer-title"
        aria-describedby="certificate-viewer-position"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        {...panelMotion}
        transition={{ duration: reduceMotion ? 0 : 0.28, ease: EASE }}
        className={cn(
          "relative mx-auto flex h-full w-full flex-col overflow-hidden bg-surface-1 outline-none",
          fullscreen ? "max-w-none" : "max-w-[92rem] shadow-e2 sm:rounded-lg sm:border sm:border-line",
        )}
      >
        {/* ---- Toolbar ---------------------------------------------------- */}
        <header className="flex shrink-0 items-center gap-3 border-b border-line py-2 pl-4 pr-2 sm:py-2.5 sm:pl-5 sm:pr-3">
          <IssuerMark
            issuer={certificate.issuer}
            logo={certificate.issuerLogo}
            size="sm"
            className="hidden sm:grid"
          />

          <div className="min-w-0 flex-1">
            <h2
              id="certificate-viewer-title"
              className="truncate text-[0.9375rem] font-medium text-text"
            >
              {certificate.title}
            </h2>
            <p id="certificate-viewer-position" className="label-mono mt-1 truncate text-faint">
              {certificate.issuer}
              {count > 1 && (
                <>
                  <span aria-hidden="true"> · </span>
                  <span className="sr-only">, certificate </span>
                  {index + 1}
                  <span aria-hidden="true"> / </span>
                  <span className="sr-only"> of </span>
                  {count}
                </>
              )}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <a
              href={certificate.document.src}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center gap-2 rounded-full px-3.5 text-[0.8125rem] text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-text md:inline-flex"
            >
              <Icon name={isPdf ? "FileText" : "ExternalLink"} size={15} />
              {isPdf ? "Open PDF" : "Open original"}
              <span className="sr-only">(opens in a new tab)</span>
            </a>

            {canFullscreen && (
              <ToolButton
                icon={fullscreen ? "Minimize" : "Maximize"}
                label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
                onClick={toggleFullscreen}
                className="hidden sm:grid"
              />
            )}

            <ToolButton
              icon="Info"
              label={detailsOpen ? "Hide details" : "Show details"}
              pressed={detailsOpen}
              onClick={() => setDetailsOpen((value) => !value)}
              className="lg:hidden"
            />

            <span aria-hidden="true" className="mx-1 h-5 w-px bg-line" />

            <ToolButton icon="X" label="Close" onClick={onClose} />
          </div>
        </header>

        {/* ---- Stage + details ------------------------------------------- */}
        <div className="relative flex min-h-0 flex-1">
          <div className="relative min-w-0 flex-1 overflow-hidden">
            <m.div
              key={certificate.id}
              initial={reduceMotion ? false : { opacity: 0, x: direction * 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.32, ease: EASE }}
              className="absolute inset-0"
            >
              <ViewerStage certificate={certificate} zoom={zoom} onZoom={setZoom} />
            </m.div>
          </div>

          <aside
            aria-label="Certificate details"
            className={cn(
              "overflow-y-auto overscroll-contain bg-surface-1",
              "lg:static lg:w-[23rem] lg:shrink-0 lg:border-l lg:border-line xl:w-[25rem]",
              "max-lg:absolute max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-10 max-lg:max-h-[78%] max-lg:rounded-t-lg max-lg:border-t max-lg:border-line max-lg:shadow-[0_-24px_60px_-30px_rgb(8_8_18/0.55)] max-lg:transition-[transform,visibility] max-lg:duration-300 max-lg:ease-[var(--ease-out)]",
              detailsOpen ? "max-lg:translate-y-0" : "max-lg:invisible max-lg:translate-y-full",
            )}
          >
            <CertificateDetails
              key={certificate.id}
              certificate={certificate}
              onHide={() => setDetailsOpen(false)}
            />
          </aside>
        </div>

        {/* ---- Navigation + zoom ----------------------------------------- */}
        <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-line px-2 py-2 sm:px-4">
          <NavButton direction={-1} onClick={() => go(-1)} disabled={count < 2} />

          <div role="group" aria-label="Zoom" className="flex items-center gap-1">
            <ToolButton
              icon="ZoomOut"
              label="Zoom out"
              onClick={() => zoomBy(1 / ZOOM_STEP)}
              disabled={zoom <= MIN_ZOOM + 0.001}
            />
            <button
              type="button"
              onClick={() => setZoom(MIN_ZOOM)}
              title="Fit to screen"
              className="label-mono inline-flex h-10 min-w-16 cursor-pointer items-center justify-center rounded-md px-2 tabular-nums text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-text pointer-coarse:h-11"
            >
              {zoomLabel}
              <span className="sr-only"> — fit to screen</span>
            </button>
            <ToolButton
              icon="ZoomIn"
              label="Zoom in"
              onClick={() => zoomBy(ZOOM_STEP)}
              disabled={zoom >= MAX_ZOOM - 0.001}
            />
          </div>

          <NavButton direction={1} onClick={() => go(1)} disabled={count < 2} />
        </footer>
      </m.div>
    </m.div>
  );
}

function ToolButton({ icon, label, onClick, disabled, pressed, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      title={label}
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-md transition-colors duration-200 pointer-coarse:size-11",
        disabled
          ? "cursor-not-allowed text-muted opacity-35"
          : "cursor-pointer text-muted hover:bg-surface-2 hover:text-text",
        pressed && "bg-surface-2 text-text",
        className,
      )}
    >
      <Icon name={icon} size={17} label={label} />
    </button>
  );
}

function NavButton({ direction, onClick, disabled }) {
  const next = direction > 0;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group/nav inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm transition-colors duration-200 pointer-coarse:h-11 sm:px-4",
        next && "flex-row-reverse",
        disabled
          ? "cursor-not-allowed text-muted opacity-35"
          : "cursor-pointer text-muted hover:bg-surface-2 hover:text-text",
      )}
    >
      <Icon
        name={next ? "ChevronRight" : "ChevronLeft"}
        size={17}
        className={cn(
          "transition-transform duration-200 ease-[var(--ease-out)]",
          next ? "group-hover/nav:translate-x-0.5" : "group-hover/nav:-translate-x-0.5",
        )}
      />
      <span className="max-sm:sr-only">{next ? "Next" : "Previous"}</span>
      <span className="sr-only"> certificate</span>
    </button>
  );
}

/* Keeps Tab inside the dialog. Only elements that can actually take focus
   count: the details sheet is `visibility: hidden` while closed on small
   screens, and its buttons must not be treated as the first or last stop. */
function trapFocus(event, dialog) {
  if (!dialog) return;
  const focusable = [...dialog.querySelectorAll(FOCUSABLE)].filter(
    (node) => node.getClientRects().length > 0 && getComputedStyle(node).visibility !== "hidden",
  );
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
