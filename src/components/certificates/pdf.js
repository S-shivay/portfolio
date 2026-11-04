"use client";

import { Document, Page, pdfjs } from "react-pdf";

/**
 * pdf.js, configured once for the certificate components.
 *
 * Only ever reached through a dynamic import, so the ~400KB renderer is not
 * part of the page bundle: it loads when a PDF card first nears the viewport
 * or a PDF is opened in the viewer. It is the same chunk the resume viewer
 * uses, so a visitor who opens both downloads it once.
 *
 * The worker is referenced through `new URL(..., import.meta.url)` for the
 * reason given in ResumeDocument: the bundler then ships the worker that
 * matches the installed pdfjs-dist, instead of a copy in /public that silently
 * goes stale on the next upgrade.
 */
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export { Document, Page };
