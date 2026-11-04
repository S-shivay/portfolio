"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/cn";
import { useBackToClose } from "@/hooks/useBackToClose";
import { Icon } from "@/components/ui/Icon";

/**
 * Tile geometry, keyed by the `size` field on each gallery entry.
 *
 * Written as complete literal class strings rather than composed at runtime,
 * because Tailwind scans source text — a template literal like
 * `sm:col-span-${n}` produces a class that exists in the DOM but never in the
 * stylesheet.
 *
 * On narrow screens every tile drops to a single column and takes its height
 * from an aspect ratio. The row-span composition only applies from `sm` up,
 * where there is enough width for a mosaic to read as one arrangement rather
 * than as six unrelated boxes.
 */
const TILE = {
  feature: {
    grid: "aspect-[16/9] sm:aspect-auto sm:col-span-12 sm:row-span-4",
    /* The 900px floor is not padding. Rows are a fixed 5.5rem, so this tile
       stops getting shorter once the viewport narrows — below roughly a
       1000px viewport the slot is shorter-and-wider than the source, and
       `object-cover` starts scaling to *height* instead. From there the
       rendered image width sticks at ~900px however narrow the column gets,
       so a plain `95vw` would ask for a source half the size it draws. */
    sizes:
      "(max-width: 639px) 100vw, (min-width: 1240px) 1160px, (min-width: 1000px) 95vw, 900px",
  },
  tall: {
    grid: "aspect-[3/4] sm:aspect-auto sm:col-span-4 sm:row-span-6",
    sizes: "(max-width: 639px) 100vw, (min-width: 1240px) 430px, 36vw",
  },
  wide: {
    grid: "aspect-[16/9] sm:aspect-auto sm:col-span-8 sm:row-span-3",
    sizes: "(max-width: 639px) 100vw, (min-width: 1240px) 780px, 64vw",
  },
  half: {
    grid: "aspect-[16/9] sm:aspect-auto sm:col-span-6 sm:row-span-3",
    sizes: "(max-width: 639px) 100vw, (min-width: 1240px) 700px, 58vw",
  },

  /* ---- Landscape-only compositions --------------------------------------
   * `tall` assumes a portrait source. When every shot in a gallery is the
   * same wide aspect — a 16:9 browser window, say — a portrait tile crops
   * away most of the frame and shows a vertical sliver of a sidebar. These
   * three split the row into landscape shapes instead: 7/5 for an asymmetric
   * pair, and 4/4/4 for a trio.
   *
   * All three are shorter than their source is wide at that height, so
   * `object-cover` always scales to height and the rendered image width is
   * the same at every viewport — which is why `sizes` is a fixed px value
   * rather than a vw expression.
   */
  major: {
    grid: "aspect-[16/9] sm:aspect-auto sm:col-span-7 sm:row-span-3",
    sizes: "(max-width: 639px) 100vw, 690px",
  },
  minor: {
    grid: "aspect-[16/9] sm:aspect-auto sm:col-span-5 sm:row-span-3",
    sizes: "(max-width: 639px) 100vw, 680px",
  },
  third: {
    grid: "aspect-[16/9] sm:aspect-auto sm:col-span-4 sm:row-span-2",
    sizes: "(max-width: 639px) 100vw, 450px",
  },
};

/**
 * Screenshots are the worst case for lossy compression: 11px UI text on flat
 * fills is exactly what a low quality setting smears. The default 75 is tuned
 * for photographs, where the same artefacts are invisible.
 */
const SCREENSHOT_QUALITY = 92;

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Project screenshot mosaic.
 *
 * Tiles are a designed crop — different sizes so the composition has a focal
 * point instead of reading as a uniform stack. Cropping loses detail, so every
 * tile opens a lightbox showing the shot uncropped at its natural proportions.
 * That is the trade made deliberately: an arrangement worth looking at on the
 * page, and the full image one click away.
 */
export function ProjectGallery({ items = [], projectName }) {
  const reduceMotion = useReducedMotion();

  const [openIndex, setOpenIndex] = useState(null);
  const dialogRef = useRef(null);
  const restoreFocusRef = useRef(null);

  const isOpen = openIndex !== null;
  const active = isOpen ? items[openIndex] : null;

  const open = (index) => {
    restoreFocusRef.current = document.activeElement;
    setOpenIndex(index);
  };

  const close = useCallback(() => setOpenIndex(null), []);
  useBackToClose(isOpen, close);

  const step = useCallback(
    (delta) =>
      setOpenIndex((current) =>
        current === null ? null : (current + delta + items.length) % items.length,
      ),
    [items.length],
  );

  useEffect(() => {
    if (!isOpen) {
      if (restoreFocusRef.current instanceof HTMLElement) {
        restoreFocusRef.current.focus({ preventScroll: true });
      }
      return;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
      return;
    }

    if (event.key !== "Tab") return;

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
  };

  if (items.length === 0) return null;

  return (
    <>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:auto-rows-[5.5rem] sm:gap-4">
        {items.map((shot, index) => {
          const tile = TILE[shot.size] ?? TILE.half;
          return (
          <li
            key={shot.src}
            /* `gallery-tile` wipes the tile open as it scrolls in — CSS
               scroll-driven, see CASE STUDY MOTION in globals.css. */
            className={cn("gallery-tile relative min-w-0", tile.grid)}
          >
            <button
              type="button"
              onClick={() => open(index)}
              data-cursor="view"
              data-cursor-label="View"
              className="group/tile absolute inset-0 h-full w-full cursor-pointer overflow-hidden rounded-md border border-line bg-surface-2 text-left transition-colors duration-200 hover:border-line-strong"
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                quality={SCREENSHOT_QUALITY}
                /* `sizes` must describe the width this tile actually renders
                   at, including the overflow `object-cover` introduces. Get it
                   wrong and the browser picks a smaller source than the slot,
                   then upscales it — which is what soft screenshots in a grid
                   almost always turn out to be. */
                sizes={tile.sizes}
                /* Anchored to the top: on an interface screenshot the header,
                   nav and primary content live there, so a bottom crop loses
                   far less than a centred one. A full-page capture can name a
                   `position` instead, to frame the part worth showing. Inline
                   rather than a class, since the value is per-shot data. */
                style={shot.position ? { objectPosition: shot.position } : undefined}
                className={cn(
                  "object-cover object-top",
                  !reduceMotion &&
                    "transition-transform duration-[600ms] ease-[var(--ease-out)] group-hover/tile:scale-[1.03]",
                )}
              />
              <span className="sr-only">View larger</span>

              {/* Legibility scrim — only as strong as the label needs. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[rgb(0_0_0/0.72)] to-transparent opacity-90"
              />

              {shot.label && (
                <span
                  aria-hidden="true"
                  className="label-mono pointer-events-none absolute bottom-3 left-3 right-12 truncate text-white"
                >
                  {shot.label}
                </span>
              )}

              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-2.5 right-2.5 grid size-8 place-items-center rounded-md border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover/tile:opacity-100 group-focus-visible/tile:opacity-100"
              >
                <Icon name="Maximize2" size={14} />
              </span>
            </button>
          </li>
          );
        })}
      </ul>

      {/* ---- Lightbox ------------------------------------------------------ */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          >
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onClick={close}
              className="absolute inset-0 cursor-default bg-[color-mix(in_oklab,var(--bg)_85%,transparent)] backdrop-blur-sm"
            />

            <m.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={`${projectName} interface, image ${openIndex + 1} of ${items.length}`}
              tabIndex={-1}
              onKeyDown={onKeyDown}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex h-full max-h-[min(94svh,60rem)] w-full max-w-[64rem] flex-col overflow-hidden rounded-lg border border-line bg-surface-1 shadow-e2 outline-none"
            >
              <header className="flex shrink-0 items-center gap-3 border-b border-line px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.9375rem] font-medium text-text">
                    {active.label ?? projectName}
                  </p>
                  <p className="label-mono text-faint">
                    {openIndex + 1} / {items.length}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <LightboxButton
                    label="Previous image"
                    icon="ChevronLeft"
                    onClick={() => step(-1)}
                    disabled={items.length < 2}
                  />
                  <LightboxButton
                    label="Next image"
                    icon="ChevronRight"
                    onClick={() => step(1)}
                    disabled={items.length < 2}
                  />
                  <span aria-hidden="true" className="mx-1 h-5 w-px bg-line" />
                  <LightboxButton label="Close" icon="X" onClick={close} />
                </div>
              </header>

              {/* Scrolls rather than shrinks: the permission matrix is over
                  2000px tall, and fitting it to the viewport would render it
                  unreadable. */}
              <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-surface-2 p-3 sm:p-5">
                <Image
                  key={active.src}
                  src={active.src}
                  alt={active.alt}
                  width={active.width}
                  height={active.height}
                  quality={SCREENSHOT_QUALITY}
                  sizes={
                    active.displayWidth
                      ? `${active.displayWidth}px`
                      : "(max-width: 1023px) 100vw, 62rem"
                  }
                  /* A phone capture is drawn at the phone's width, not
                     stretched across a desktop dialog — at 1000px wide a 390px
                     screen reads as a poster rather than a device. */
                  style={active.displayWidth ? { maxWidth: active.displayWidth } : undefined}
                  className="mx-auto h-auto w-full max-w-full rounded-sm border border-line bg-white"
                />
              </div>

              {active.caption && (
                <footer className="shrink-0 border-t border-line px-4 py-3.5">
                  <p className="text-sm leading-relaxed text-muted">
                    {active.caption}
                  </p>
                </footer>
              )}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

function LightboxButton({ label, icon, onClick, disabled }) {
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
