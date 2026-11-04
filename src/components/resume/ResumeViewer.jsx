"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";

import { site } from "@/data/site";
import { cn } from "@/lib/cn";
import { useBackToClose } from "@/hooks/useBackToClose";
import { Icon } from "@/components/ui/Icon";

const OPEN_EVENT = "resume-viewer:open";

/** Opens the viewer from anywhere — a button, the command palette, a link. */
export function openResumeViewer() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

/**
 * pdf.js and its worker come to roughly 400KB. Loading it eagerly would tax
 * every visitor to pay for a document most of them will never open, so the
 * whole renderer sits behind a dynamic import that only resolves once the
 * dialog is actually mounted. `ssr: false` because pdf.js needs a DOM.
 */
const ResumeDocument = dynamic(
  () => import("@/components/resume/ResumeDocument").then((mod) => mod.ResumeDocument),
  { ssr: false, loading: () => <BootSkeleton /> },
);

/* Discrete steps rather than free zooming: every stop lands on a width that
   still renders crisply, and there is no way to end up at 103%. */
const ZOOM_STEPS = [0.75, 0.9, 1, 1.25, 1.5, 2];
const DEFAULT_ZOOM = 2; // index of 1.0

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Resume viewer.
 *
 * A first-party PDF reader: the document is rendered to canvas by pdf.js inside
 * a dialog styled like the rest of the site, rather than handed off to the
 * browser's or Google's viewer with their own toolbars, branding and download
 * affordances.
 *
 * Read-only by construction — there is no download, print or edit control in
 * here, and the annotation layer is off. That is a matter of presentation, not
 * security: the PDF is served from a public URL, and saving a copy is what the
 * "Download Resume" button next to this one is for.
 *
 * Mounted once in the root layout; opened via `openResumeViewer()`.
 */
export function ResumeViewer() {
  const reduceMotion = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const dialogRef = useRef(null);
  const restoreFocusRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);
  useBackToClose(open, close);

  /* ---- Open / close ------------------------------------------------------ */

  useEffect(() => {
    const onOpenRequest = () => {
      restoreFocusRef.current = document.activeElement;
      // Reset here rather than in an effect: the viewer should always open at
      // page one and 100%, however it was left last time.
      setZoomIndex(DEFAULT_ZOOM);
      setCurrentPage(1);
      setNumPages(0);
      setOpen(true);
    };

    window.addEventListener(OPEN_EVENT, onOpenRequest);
    return () => window.removeEventListener(OPEN_EVENT, onOpenRequest);
  }, []);

  useEffect(() => {
    if (!open) {
      if (restoreFocusRef.current instanceof HTMLElement) {
        restoreFocusRef.current.focus({ preventScroll: true });
      }
      return;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    // Focus the dialog itself, not a control inside it, so assistive tech reads
    // the dialog's label before its toolbar.
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  /* ---- Keyboard ---------------------------------------------------------- */

  const zoomIn = useCallback(
    () => setZoomIndex((i) => Math.min(i + 1, ZOOM_STEPS.length - 1)),
    [],
  );
  const zoomOut = useCallback(() => setZoomIndex((i) => Math.max(i - 1, 0)), []);
  const zoomReset = useCallback(() => setZoomIndex(DEFAULT_ZOOM), []);

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === "Tab") {
      // Focus trap. Without it, Tab walks off into the page behind the scrim,
      // where a keyboard user cannot see what they have landed on.
      const focusable = dialogRef.current?.querySelectorAll(FOCUSABLE);
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
      return;
    }

    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      zoomIn();
      return;
    }

    if (event.key === "-" || event.key === "_") {
      event.preventDefault();
      zoomOut();
      return;
    }

    if (event.key === "0") {
      event.preventDefault();
      zoomReset();
    }
  };

  /* ---- Render ------------------------------------------------------------ */

  const zoom = ZOOM_STEPS[zoomIndex];
  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12, scale: 0.99 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 12, scale: 0.99 },
        transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
        >
          {/* Scrim. A button so a pointer user can dismiss by clicking away,
              hidden from assistive tech because Escape already covers it. */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={close}
            className="absolute inset-0 cursor-default bg-[color-mix(in_oklab,var(--bg)_80%,transparent)] backdrop-blur-sm"
          />

          <m.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-viewer-title"
            tabIndex={-1}
            onKeyDown={onKeyDown}
            {...motionProps}
            className="relative flex h-full max-h-[min(96svh,64rem)] w-full max-w-[58rem] flex-col overflow-hidden rounded-lg border border-line bg-surface-1 shadow-e2 outline-none"
          >
            {/* Toolbar */}
            <header className="flex shrink-0 items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
              <Icon
                name="FileText"
                size={16}
                className="hidden shrink-0 text-accent-ink sm:block"
              />

              <div className="min-w-0 flex-1">
                <h2
                  id="resume-viewer-title"
                  className="truncate text-[0.9375rem] font-medium text-text"
                >
                  {site.name} — Resume
                </h2>
                <p className="label-mono truncate text-faint">
                  {numPages > 0
                    ? `Page ${currentPage} of ${numPages} · View only`
                    : "PDF · View only"}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <ToolbarButton
                  label="Zoom out"
                  icon="ZoomOut"
                  onClick={zoomOut}
                  disabled={zoomIndex === 0}
                />

                {/* Also the reset control — the percentage is the affordance. */}
                <button
                  type="button"
                  onClick={zoomReset}
                  title="Reset zoom"
                  className="label-mono hidden h-9 min-w-14 cursor-pointer items-center justify-center rounded-md px-2 text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-text sm:inline-flex"
                >
                  {Math.round(zoom * 100)}%
                  <span className="sr-only"> — reset zoom to 100%</span>
                </button>

                <ToolbarButton
                  label="Zoom in"
                  icon="ZoomIn"
                  onClick={zoomIn}
                  disabled={zoomIndex === ZOOM_STEPS.length - 1}
                />

                <span aria-hidden="true" className="mx-1 h-5 w-px bg-line" />

                <ToolbarButton label="Close resume" icon="X" onClick={close} />
              </div>
            </header>

            {/* Document */}
            <div className="min-h-0 flex-1">
              <ResumeDocument
                file={site.links.resume}
                zoom={zoom}
                onLoadSuccess={(pdf) => setNumPages(pdf.numPages)}
                onPageChange={setCurrentPage}
              />
            </div>

            {/* Legend */}
            <footer className="hidden shrink-0 items-center gap-4 border-t border-line px-5 py-2.5 sm:flex">
              <Legend keys={["+", "−"]} label="Zoom" />
              <Legend keys={["0"]} label="Reset" />
              <Legend keys={["esc"]} label="Close" />
              <span className="label-mono ml-auto text-faint">
                Read-only preview
              </span>
            </footer>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

function ToolbarButton({ label, icon, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-md text-muted transition-colors duration-200",
        disabled
          ? "cursor-not-allowed opacity-35"
          : "cursor-pointer hover:bg-surface-2 hover:text-text",
      )}
    >
      <Icon name={icon} size={16} label={label} />
    </button>
  );
}

/** Shown while the pdf.js chunk itself is still downloading. */
function BootSkeleton() {
  return (
    <div className="grid h-full place-items-center bg-surface-2">
      <span className="flex items-center gap-2.5 text-muted">
        <Icon
          name="LoaderCircle"
          size={16}
          className="animate-spin motion-reduce:animate-none"
        />
        <span className="label-mono">Loading viewer</span>
      </span>
    </div>
  );
}

function Legend({ keys, label }) {
  return (
    <span className="flex items-center gap-1.5">
      {keys.map((key) => (
        <kbd
          key={key}
          className="label-mono grid h-5 min-w-5 place-items-center rounded border border-line bg-surface-2 px-1 text-faint"
        >
          {key}
        </kbd>
      ))}
      <span className="label-mono text-faint">{label}</span>
    </span>
  );
}
