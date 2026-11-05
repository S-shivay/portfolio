"use client";

import { Component, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { FALLBACK_RATIO } from "@/components/certificates/CertificatePreview";

const loadPdfPages = () => import("@/components/certificates/PdfPages");

const PdfPages = dynamic(loadPdfPages, {
  ssr: false,
  loading: () => null,
});

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 5;
export const clampZoom = (value) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

const PAGE_GAP = 24;

/* How long the entrance gets to itself before pdf.js starts. Drawing a page
   holds the main thread, which would stutter the animation, and stepping quickly
   through the collection should not parse every document passed on the way. */
const PDF_START_DELAY_MS = 300;

/* A document with nothing else to show gives up after this long and offers the
   file directly, so the loading state can never be the last thing a visitor sees. */
const LOAD_TIMEOUT_MS = 25_000;

/**
 * Called when a pointer or focus reaches a card, so the first frame of the
 * viewer is already in the browser's cache by the time it opens.
 */
export function preloadCertificate(certificate) {
  if (certificate.document?.kind !== "pdf") return;
  loadPdfPages().catch(() => {});
  if (certificate.preview?.kind === "image") {
    new window.Image().src = certificate.preview.src;
  }
}

/**
 * The certificate, on a stage that behaves like a desk under a loupe.
 *
 * Zoom 1 is "fit": the whole document visible, as large as the stage allows
 * in both directions, whatever its orientation. Every other zoom is a multiple
 * of that, so 200% always means twice as large as the document on screen
 * rather than twice some pixel size the visitor never saw.
 *
 * Past fit, the stage scrolls. Pan by scrolling, by dragging with a mouse, or
 * by one finger. Zoom with the toolbar, the keyboard, a double-click,
 * ctrl/⌘ + wheel or a trackpad pinch, and a two-finger pinch on touch. Every
 * zoom keeps the point under the pointer (or the centre, for buttons and keys)
 * where it was, so the thing being inspected does not slide out from under the
 * reader.
 *
 * The full-resolution file is requested here and only here: the card showed a
 * small rendition, and this is the first time the original is worth its
 * weight.
 *
 * A PDF with a WebP beside it opens on the WebP and is swapped for the real
 * document once its first page has been drawn. A scanned certificate can take
 * several seconds to decode, and the visitor came to read it, not to watch that
 * happen. If the PDF never arrives the WebP simply stays, and "Open PDF" in the
 * toolbar still reaches the original.
 *
 * The WebP stays underneath afterwards. Zooming past the detail a canvas holds
 * makes react-pdf hide it while it draws a sharper one, and on those same scans
 * that would otherwise be seconds of blank paper.
 */
export function ViewerStage({ certificate, zoom, onZoom }) {
  const doc = certificate.document;
  const known = doc.width && doc.height ? doc.width / doc.height : null;
  const poster =
    doc.kind === "pdf" && certificate.preview?.kind === "image"
      ? certificate.preview
      : null;

  const [ratio, setRatio] = useState(known ?? FALLBACK_RATIO);
  const [pages, setPages] = useState(1);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [pdfStarted, setPdfStarted] = useState(!poster);
  const [box, setBox] = useState(null);
  const [dragging, setDragging] = useState(false);

  const scrollRef = useRef(null);
  const anchor = useRef({ x: 0.5, y: 0.5, px: null, py: null });
  const drag = useRef(null);

  /* Handlers attached once, reading the latest values through refs. */
  const zoomRef = useRef(zoom);
  const onZoomRef = useRef(onZoom);
  useEffect(() => {
    zoomRef.current = zoom;
    onZoomRef.current = onZoom;
  });

  const showPoster = Boolean(poster) && !posterFailed;

  useEffect(() => {
    if (pdfStarted) return;
    const timer = setTimeout(() => setPdfStarted(true), PDF_START_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pdfStarted]);

  useEffect(() => {
    if (ready || failed || showPoster) return;
    const timer = setTimeout(() => setFailed(true), LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [ready, failed, showPoster]);

  /* With the WebP on screen a PDF failure costs only sharpness, so it is not
     worth interrupting the visitor for. */
  const onPdfFailed = () => {
    if (!showPoster) setFailed(true);
  };

  /* ---- Geometry ------------------------------------------------------- */

  useLayoutEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const observer = new ResizeObserver(() => {
      setBox({ w: node.clientWidth, h: node.clientHeight });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const pad = box && box.w < 640 ? 16 : 40;
  const fitWidth = box
    ? Math.max(120, Math.min(box.w - pad * 2, (box.h - pad * 2) * ratio))
    : 0;
  const docWidth = Math.round(fitWidth * zoom);
  const docHeight = Math.round(docWidth / ratio);
  const contentWidth = box ? Math.max(box.w, docWidth + pad * 2) : 0;
  const contentHeight = box
    ? Math.max(box.h, docHeight * pages + PAGE_GAP * (pages - 1) + pad * 2)
    : 0;

  /* Keep the anchored point where it was after the size changes. */
  useLayoutEffect(() => {
    const node = scrollRef.current;
    if (!node || !box) return;
    const { x, y, px, py } = anchor.current;
    node.scrollLeft = x * node.scrollWidth - (px ?? node.clientWidth / 2);
    node.scrollTop = y * node.scrollHeight - (py ?? node.clientHeight / 2);
  }, [docWidth, box]);

  const onScroll = () => {
    const node = scrollRef.current;
    anchor.current = {
      x: (node.scrollLeft + node.clientWidth / 2) / node.scrollWidth,
      y: (node.scrollTop + node.clientHeight / 2) / node.scrollHeight,
      px: null,
      py: null,
    };
  };

  /* ---- Wheel and pinch ------------------------------------------------ */

  /* Native listeners because both must be able to call preventDefault, and
     React registers wheel and touchmove as passive. */
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const onWheel = (event) => {
      // Plain wheel scrolls. Ctrl/⌘ + wheel, which is also what a trackpad
      // pinch reports, zooms instead of zooming the whole page.
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      anchorAt(node, anchor, event.clientX, event.clientY);
      onZoomRef.current(clampZoom(zoomRef.current * Math.exp(-event.deltaY * 0.01)));
    };

    let pinch = null;
    const spread = (touches) =>
      Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY,
      );

    const onTouchStart = (event) => {
      if (event.touches.length === 2) {
        pinch = { distance: spread(event.touches), zoom: zoomRef.current };
      }
    };

    const onTouchMove = (event) => {
      if (!pinch || event.touches.length !== 2) return;
      event.preventDefault();
      const [a, b] = event.touches;
      anchorAt(node, anchor, (a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2);
      onZoomRef.current(clampZoom((pinch.zoom * spread(event.touches)) / pinch.distance));
    };

    const onTouchEnd = (event) => {
      if (event.touches.length < 2) pinch = null;
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    node.addEventListener("touchstart", onTouchStart, { passive: true });
    node.addEventListener("touchmove", onTouchMove, { passive: false });
    node.addEventListener("touchend", onTouchEnd);
    node.addEventListener("touchcancel", onTouchEnd);

    return () => {
      node.removeEventListener("wheel", onWheel);
      node.removeEventListener("touchstart", onTouchStart);
      node.removeEventListener("touchmove", onTouchMove);
      node.removeEventListener("touchend", onTouchEnd);
      node.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  /* ---- Mouse drag to pan ---------------------------------------------- */

  const pannable = box && (docWidth + pad * 2 > box.w || contentHeight > box.h);

  const onPointerDown = (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0 || !pannable) return;
    const node = scrollRef.current;
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      left: node.scrollLeft,
      top: node.scrollTop,
    };
    node.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const onPointerMove = (event) => {
    if (!drag.current) return;
    const node = scrollRef.current;
    node.scrollLeft = drag.current.left - (event.clientX - drag.current.x);
    node.scrollTop = drag.current.top - (event.clientY - drag.current.y);
  };

  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  /* ---- Render ---------------------------------------------------------- */

  /* The rendition asked for grows in 480px steps with the zoom, so zooming in
     fetches a sharper file, and a pinch does not request a new one per frame. */
  const requestWidth = Math.max(480, Math.ceil(docWidth / 480) * 480);

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDoubleClick={(event) => {
        anchorAt(scrollRef.current, anchor, event.clientX, event.clientY);
        onZoom(zoom > 1 ? 1 : 2.5);
      }}
      className={cn(
        "cert-stage h-full w-full overflow-auto overscroll-contain [touch-action:pan-x_pan-y]",
        pannable && (dragging ? "cursor-grabbing select-none" : "cursor-grab"),
      )}
    >
      {box && !failed && (
        <div
          className="grid place-items-center"
          style={{ width: contentWidth, height: contentHeight, padding: pad }}
        >
          {/* Sized up front: the only other content is absolutely positioned
              until the PDF renderer has loaded, and a box with no size would
              centre its top-left corner on the stage instead of the document. */}
          <div className="relative" style={{ width: docWidth, minHeight: docHeight }}>
            {showPoster && (
              <Image
                src={poster.src}
                /* Once the PDF is up its text layer is what gets read out. */
                alt={ready ? "" : certificate.alt}
                width={poster.width ?? 1600}
                height={poster.height ?? 1131}
                /* Already compressed for this job, and the same file a preload
                   put in the cache. */
                unoptimized
                loading="eager"
                fetchPriority="high"
                /* Painted in the same frame as the layout that sized it, so the
                   white sheet behind it does not flash on opening or zooming. */
                decoding="sync"
                draggable={false}
                onError={() => setPosterFailed(true)}
                className="cert-paper absolute left-0 top-0 block max-w-none"
                style={{ width: docWidth, height: docHeight }}
              />
            )}

            {!ready && !showPoster && (
              <div
                className="cert-paper absolute left-0 top-0 grid place-items-center overflow-hidden"
                style={{ width: docWidth, height: docHeight }}
              >
                <span aria-hidden="true" className="cert-shimmer absolute inset-0" />
                <span
                  role="status"
                  className="relative flex items-center gap-2.5 text-[#4e4e5e]"
                >
                  <Icon
                    name="LoaderCircle"
                    size={16}
                    className="animate-spin motion-reduce:animate-none"
                  />
                  <span className="label-mono">Loading certificate</span>
                </span>
              </div>
            )}

            {doc.kind === "image" ? (
              <Image
                src={doc.src}
                alt={certificate.alt}
                width={doc.width ?? 1414}
                height={doc.height ?? 1000}
                sizes={`${requestWidth}px`}
                quality={92}
                loading="eager"
                unoptimized={doc.vector}
                draggable={false}
                onLoad={(event) => {
                  const img = event.currentTarget;
                  if (!known && img.naturalWidth) {
                    setRatio(img.naturalWidth / img.naturalHeight);
                  }
                  setReady(true);
                }}
                onError={() => setFailed(true)}
                className="cert-paper block max-w-none"
                style={{ width: docWidth, height: docHeight }}
              />
            ) : (
              pdfStarted && (
                /* `relative` so it paints over the absolutely positioned WebP,
                   which would otherwise sit on top of it. */
                <div className="relative">
                  <PdfBoundary onFailed={onPdfFailed}>
                    <PdfPages
                      src={doc.src}
                      width={docWidth}
                      height={docHeight}
                      pages={pages}
                      gap={PAGE_GAP}
                      ratio={ratio}
                      label={certificate.alt}
                      seeThrough={showPoster}
                      onInfo={(info) => {
                        setPages(info.pages);
                        setRatio(info.ratio);
                      }}
                      onReady={() => setReady(true)}
                      onFailed={onPdfFailed}
                    />
                  </PdfBoundary>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {failed && <LoadFailure document={doc} />}
    </div>
  );
}

/**
 * Catches the renderer's chunk failing to load: a tab left open across a
 * deployment, a dropped connection, or a browser too old for pdf.js. Without
 * this, the rejected import would take the whole page down rather than one
 * document.
 */
class PdfBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFailed();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/* Records which point of the document sits under the pointer, as a fraction
   of the scrollable area, so it can be put back under the pointer after the
   document changes size. */
function anchorAt(node, anchor, clientX, clientY) {
  if (!node) return;
  const rect = node.getBoundingClientRect();
  const px = clientX - rect.left;
  const py = clientY - rect.top;
  anchor.current = {
    x: (node.scrollLeft + px) / node.scrollWidth,
    y: (node.scrollTop + py) / node.scrollHeight,
    px,
    py,
  };
}

/**
 * If the document cannot be shown here (a blocked worker, a moved file), the
 * visitor still gets to it rather than to a dead stage.
 */
function LoadFailure({ document }) {
  return (
    <div className="grid h-full place-items-center p-6">
      <div className="flex max-w-sm flex-col items-center gap-4 rounded-md border border-line bg-surface-1 px-8 py-12 text-center shadow-e1">
        <Icon name="TriangleAlert" size={22} className="text-muted" />
        <div>
          <p className="text-[0.9375rem] text-text">
            This certificate could not be displayed here.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            The file itself may still open directly.
          </p>
        </div>
        <a
          href={document.src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface-2 px-4 text-sm text-text transition-colors duration-200 hover:border-line-strong"
        >
          <Icon name="ExternalLink" size={14} />
          Open the file
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
