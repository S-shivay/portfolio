"use client";

import { useState } from "react";

import "react-pdf/dist/Page/TextLayer.css";
import { Document, Page } from "@/components/certificates/pdf";

/* Largest canvas worth drawing, in pixels. iOS Safari refuses canvases above
   ~16.7 million pixels outright, and a sharper page than this is detail no
   screen can show at the viewer's maximum zoom. */
const MAX_CANVAS_AREA = 12_000_000;
const STEP = 512;

/**
 * A PDF certificate inside the viewer: every page, stacked, at the size the
 * stage asks for.
 *
 * Zooming does not re-render the page. Each page is drawn once to a canvas at
 * a resolution comfortably above what is on screen, then scaled with a CSS
 * transform. The canvas is only redrawn when the zoom climbs past the detail
 * it already holds, and never when zooming out. Redrawing at every step would
 * blank the page for a frame each time, because resizing a canvas clears it.
 *
 * The text layer stays on: it is what a screen reader reads, and it lets a
 * recruiter select and copy a credential ID straight off the document. It
 * scales with the canvas because both sit inside the same transform.
 */
export default function PdfPages({
  src,
  width,
  height,
  pages,
  gap,
  ratio,
  label,
  onInfo,
  onReady,
  onFailed,
}) {
  const dpr = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
  const ceiling = Math.floor(Math.sqrt(MAX_CANVAS_AREA * ratio));
  const needed = Math.min(ceiling, Math.ceil((width * dpr) / STEP) * STEP);

  // Grows with zoom, never shrinks: see above.
  const [renderWidth, setRenderWidth] = useState(needed);
  if (needed > renderWidth) setRenderWidth(needed);

  const scale = width / renderWidth;

  return (
    <Document
      file={src}
      loading={null}
      error={null}
      noData={null}
      onLoadSuccess={async (pdf) => {
        try {
          const first = await pdf.getPage(1);
          const viewport = first.getViewport({ scale: 1 });
          onInfo?.({ pages: pdf.numPages, ratio: viewport.width / viewport.height });
        } catch {
          onInfo?.({ pages: pdf.numPages, ratio });
        }
      }}
      onLoadError={onFailed}
      onSourceError={onFailed}
      className="flex flex-col items-center"
    >
      <div className="flex flex-col items-center" style={{ gap }}>
        {Array.from({ length: pages }, (_, index) => (
          /* No role="img" here, although it would be the obvious label: an
             image role makes its children presentational, and that would hide
             the text layer from the screen reader it exists for. */
          <div
            key={index}
            aria-label={pages > 1 ? `${label}, page ${index + 1} of ${pages}` : undefined}
            role={pages > 1 ? "group" : undefined}
            className="cert-paper relative shrink-0 overflow-hidden"
            style={{ width, height }}
          >
            <div
              style={{
                width: renderWidth,
                transform: `scale(${scale})`,
                transformOrigin: "0 0",
              }}
            >
              <Page
                pageNumber={index + 1}
                width={renderWidth}
                devicePixelRatio={1}
                renderTextLayer
                renderAnnotationLayer={false}
                loading={null}
                error={null}
                canvasProps={{ "aria-hidden": true }}
                onRenderSuccess={index === 0 ? onReady : undefined}
                onRenderError={index === 0 ? onFailed : undefined}
              />
            </div>
          </div>
        ))}
      </div>
    </Document>
  );
}
