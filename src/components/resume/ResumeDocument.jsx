"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import { Icon } from "@/components/ui/Icon";

/**
 * pdf.js runs its parser in a web worker so a 300KB document never blocks the
 * main thread. `new URL(..., import.meta.url)` hands the worker file to the
 * bundler as an asset reference, which means the worker version can never drift
 * out of sync with the `pdfjs-dist` version in node_modules — the failure mode
 * you get from copying the worker into /public by hand and forgetting to
 * refresh it after an upgrade.
 */
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

/* Horizontal breathing room inside the scroll area, in px. */
const GUTTER = 48;
/* Beyond this the lines get too long to read comfortably. */
const MAX_PAGE_WIDTH = 820;
const MIN_PAGE_WIDTH = 280;

/**
 * Renders every page of a PDF as a continuous vertical stack.
 *
 * Continuous scroll rather than one-page-at-a-time: a resume is read top to
 * bottom, and paging controls would make a reader click three times to see a
 * document they could have flicked through.
 *
 * The text layer is deliberately left on. A canvas is completely invisible to a
 * screen reader, so without it this component would render a resume that
 * assistive technology reports as an empty box. It also lets a recruiter select
 * and copy an email address. The annotation layer is off: it would turn the
 * document's own hyperlinks into navigation that escapes the dialog.
 */
export function ResumeDocument({
  file,
  zoom,
  onLoadSuccess,
  onLoadError,
  onPageChange,
}) {
  const [numPages, setNumPages] = useState(0);
  const [baseWidth, setBaseWidth] = useState(0);
  const [failed, setFailed] = useState(false);

  const scrollRef = useRef(null);
  const pagesRef = useRef(new Map());

  /* Held in a ref so the observer below depends only on the page count. A
     callback identity change should not tear down and rebuild an observer. */
  const onPageChangeRef = useRef(onPageChange);
  useEffect(() => {
    onPageChangeRef.current = onPageChange;
  });

  /* Page width tracks the available space rather than a fixed value, so the
     document reflows on a phone, on a resized window and on a rotated tablet
     without a media query. */
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      const available = entry.contentRect.width - GUTTER;
      setBaseWidth(
        Math.max(MIN_PAGE_WIDTH, Math.min(MAX_PAGE_WIDTH, Math.floor(available))),
      );
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /* Which page is currently under the reader's eye. The negative margins
     collapse the observer's root down to a thin band across the middle of the
     viewport, so exactly one page is ever intersecting. */
  useEffect(() => {
    const root = scrollRef.current;
    if (!root || numPages === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const page = Number(entry.target.dataset.page);
          if (page) onPageChangeRef.current?.(page);
        }
      },
      { root, rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const node of pagesRef.current.values()) {
      if (node) observer.observe(node);
    }

    return () => observer.disconnect();
  }, [numPages]);

  const handleLoadSuccess = useCallback(
    (pdf) => {
      setNumPages(pdf.numPages);
      setFailed(false);
      onLoadSuccess?.(pdf);
    },
    [onLoadSuccess],
  );

  const handleLoadError = useCallback(
    (error) => {
      setFailed(true);
      onLoadError?.(error);
    },
    [onLoadError],
  );

  const pageWidth = baseWidth > 0 ? Math.round(baseWidth * zoom) : undefined;

  return (
    <div
      ref={scrollRef}
      className="h-full min-h-0 overflow-auto overscroll-contain bg-surface-2"
      /* A soft deterrent against a casual right-click → "Save image as". It is
         not protection: the PDF is served from a public URL and the page has a
         Download button by design. */
      onContextMenu={(event) => event.preventDefault()}
    >
      {/* `w-max min-w-full` keeps the stack centred at rest but lets it grow
          past the container once zoomed in, so the parent scrolls sideways
          instead of clipping the page. */}
      <div className="mx-auto flex w-max min-w-full flex-col items-center gap-6 p-6">
        {failed ? (
          <LoadFailure file={file} />
        ) : (
          <Document
            file={file}
            onLoadSuccess={handleLoadSuccess}
            onLoadError={handleLoadError}
            onSourceError={handleLoadError}
            loading={<PageSkeleton width={pageWidth} />}
            error={<LoadFailure file={file} />}
            noData={<LoadFailure file={file} />}
            className="flex flex-col items-center gap-6"
          >
            {Array.from({ length: numPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <div
                  key={pageNumber}
                  data-page={pageNumber}
                  ref={(node) => {
                    if (node) pagesRef.current.set(pageNumber, node);
                    else pagesRef.current.delete(pageNumber);
                  }}
                  className="overflow-hidden rounded-sm border border-line bg-white shadow-e2"
                >
                  <Page
                    pageNumber={pageNumber}
                    width={pageWidth}
                    renderAnnotationLayer={false}
                    renderTextLayer
                    loading={<PageSkeleton width={pageWidth} />}
                    /* The rendered page is a picture of a document; the text
                       layer above it carries the actual reading content, so the
                       canvas itself is noise to a screen reader. */
                    canvasProps={{ "aria-hidden": true }}
                  />
                </div>
              );
            })}
          </Document>
        )}
      </div>
    </div>
  );
}

/**
 * Occupies the exact footprint the page will take once rendered, so the dialog
 * does not jump when the first page paints.
 */
function PageSkeleton({ width }) {
  const w = width ?? 640;

  return (
    <div
      role="status"
      aria-label="Loading resume"
      style={{ width: w, height: Math.round(w * 1.414) }}
      className="grid max-w-full place-items-center rounded-sm border border-line bg-surface-1"
    >
      <span className="flex items-center gap-2.5 text-muted">
        <Icon
          name="LoaderCircle"
          size={16}
          className="animate-spin motion-reduce:animate-none"
        />
        <span className="label-mono">Rendering</span>
      </span>
    </div>
  );
}

/**
 * Honest fallback. If the renderer cannot run — an ancient browser, a blocked
 * worker, a corrupt file — the reader still gets to the document rather than
 * staring at a dead dialog.
 */
function LoadFailure({ file }) {
  return (
    <div className="grid max-w-md place-items-center gap-4 rounded-md border border-line bg-surface-1 px-8 py-14 text-center">
      <Icon name="TriangleAlert" size={22} className="text-muted" />
      <div>
        <p className="text-[0.9375rem] text-text">
          The resume could not be displayed here.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Your browser may have blocked the renderer. The document itself is
          fine.
        </p>
      </div>
      <a
        href={file}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface-2 px-4 text-sm text-text transition-colors duration-200 hover:border-line-strong"
      >
        <Icon name="ExternalLink" size={14} />
        Open the PDF directly
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
  );
}
