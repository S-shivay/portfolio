"use client";

import { Document, Page, pdfjs } from "react-pdf";

/**
 * pdf.js, configured once for every PDF on the site.
 *
 * Only ever reached through a dynamic import, so the ~400KB renderer is not
 * part of the page bundle: it loads when a PDF card first nears the viewport
 * or a PDF is opened in a viewer. The certificate and resume viewers share this
 * chunk, so a visitor who opens both downloads it once.
 *
 * The worker is referenced through `new URL(..., import.meta.url)` so the
 * bundler ships the worker that matches the installed pdfjs-dist, instead of a
 * copy in /public that silently goes stale on the next upgrade.
 */
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

/**
 * One worker for the whole page, passed to every <Document>.
 *
 * Without it each document starts its own worker, and the browser compiles the
 * 1MB script again every time a certificate opens. A worker passed in this way
 * is not destroyed along with a document, so it stays ready for the next one.
 *
 * A module constant so its identity never changes: react-pdf reloads the
 * document whenever the `options` object it is given is a different one.
 */
export const pdfOptions = { worker: new pdfjs.PDFWorker() };

export { Document, Page };
