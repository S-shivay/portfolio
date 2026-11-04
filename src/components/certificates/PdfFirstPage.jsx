"use client";

import { Document, Page } from "@/components/certificates/pdf";

/**
 * The first page of a PDF, drawn once as a thumbnail.
 *
 * Rendered at a fixed resolution with `devicePixelRatio={1}` and scaled to the
 * card by CSS (`cert-canvas-fit`). 900 device pixels covers a card on a 2x
 * screen; letting pdf.js multiply by the device ratio on top of that would
 * allocate a canvas four times the size for detail the thumbnail cannot show.
 *
 * No text or annotation layer: a card thumbnail is a picture of the document,
 * and its accessible name comes from the card around it.
 */
export default function PdfFirstPage({ src, onSize, onRendered, onFailed }) {
  return (
    <Document
      file={src}
      loading={null}
      error={null}
      noData={null}
      onLoadError={onFailed}
      onSourceError={onFailed}
      className="h-full w-full"
    >
      <Page
        pageNumber={1}
        width={900}
        devicePixelRatio={1}
        renderTextLayer={false}
        renderAnnotationLayer={false}
        loading={null}
        error={null}
        className="cert-canvas-fit"
        canvasProps={{ "aria-hidden": true }}
        onLoadSuccess={(page) => {
          const viewport = page.getViewport({ scale: 1 });
          onSize?.(viewport.width, viewport.height);
        }}
        onRenderSuccess={onRendered}
        onRenderError={onFailed}
      />
    </Document>
  );
}
