import { readFile } from "node:fs/promises";
import path from "node:path";

import { readImageSize, readPdfSize } from "@/lib/document-size";

/**
 * Turns the authored certificate list into what the UI renders.
 *
 * Runs on the server only (it reads files from /public), once per build for
 * the static home page. Doing the work here rather than in the browser means:
 *
 *   - every document's real aspect ratio is known before the first paint, so
 *     the grid never jumps as previews arrive;
 *   - dates are formatted once, in one locale and one time zone, so the server
 *     HTML and the hydrated client can never disagree about them;
 *   - a typo in a file path is a console warning at build time, not a broken
 *     image in front of a recruiter.
 *
 * The client components receive plain serialisable objects and never touch the
 * raw data file.
 */

const PUBLIC_DIR = path.join(process.cwd(), "public");

/* A4 landscape: the most common certificate shape, and a neutral frame to hold
   while the real size of a document the server could not measure arrives. */
export const FALLBACK_SIZE = { width: 1414, height: 1000 };

const MONTH_YEAR = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const IMAGE_EXTENSIONS = /\.(png|jpe?g|webp|avif|gif|svg|heic)$/i;

export async function getCertificates(source) {
  const list = await Promise.all(source.map(normalize));
  return list.filter(Boolean).sort(byPlacement);
}

/**
 * The header figures, counted from the list rather than typed in, so they can
 * never drift from what the section actually shows. Exact numbers, never
 * rounded down into a "12+": that plus sign would claim credentials that are
 * not on the page.
 */
export function summarize(list) {
  const issuers = new Set(list.map((item) => item.issuer.toLowerCase()));
  const categories = new Set(list.map((item) => item.category).filter(Boolean));
  const years = list.map((item) => item.issued?.year).filter(Boolean);

  return [
    { value: list.length, label: list.length === 1 ? "Credential" : "Credentials" },
    { value: issuers.size, label: issuers.size === 1 ? "Issuer" : "Issuers" },
    /* The earliest dated credential says "continuous" better than a count of
       categories does. Undated entries cannot move it earlier, so it is never
       a claim the documents do not back. */
    years.length > 0
      ? { value: Math.min(...years), label: "Learning since" }
      : categories.size > 1 && { value: categories.size, label: "Skill areas" },
  ].filter(Boolean);
}

/* ---- Normalisation ------------------------------------------------------- */

async function normalize(entry) {
  const title = clean(entry.title);
  const issuer = clean(entry.issuer);

  if (!entry.id || !title || !issuer) {
    warn(`an entry is missing its id, title or issuer and was skipped: ${JSON.stringify(entry)}`);
    return null;
  }

  const [image, pdf] = await Promise.all([
    readAsset(entry.certificateImage, entry.id, "image"),
    readAsset(entry.certificatePdf, entry.id, "pdf"),
  ]);

  /* The viewer shows the PDF when there is one: it is the original, and it
     stays sharp at any zoom. The card shows the image when there is one,
     because rendering a PDF costs the pdf.js download and a canvas draw. */
  const document = pdf ?? image;
  const preview = image ?? pdf;

  const issued = parseDate(entry.issueDate, entry.id, "issueDate");
  const expires = parseDate(entry.expirationDate, entry.id, "expirationDate");

  const href = clean(entry.verificationUrl) || clean(entry.credentialUrl);

  return {
    id: String(entry.id),
    title,
    issuer,
    issuerLogo: clean(entry.issuerLogo) || null,
    category: clean(entry.category) || null,
    level: clean(entry.level) || null,
    duration: clean(entry.duration) || null,
    distinction: clean(entry.distinction) || null,
    credentialId: clean(entry.credentialId) || null,
    description: clean(entry.description) || null,
    skills: Array.isArray(entry.skills) ? entry.skills.map(clean).filter(Boolean) : [],
    featured: Boolean(entry.featured),

    issued: issued && { label: issued.label, year: issued.year, time: issued.time },
    expires: expires && {
      label: expires.label,
      /* Evaluated when the page is built. A static page cannot know today's
         date, so "expired" is only as fresh as the last deploy. */
      past: expires.time < Date.now(),
    },

    /* `verified` is only ever what the author asserted. A link existing proves
       nothing about the credential behind it. */
    link: href ? { href, verified: entry.verified === true } : null,

    document,
    preview,

    alt:
      clean(entry.alt) ||
      `Certificate issued by ${issuer} for ${title}${issued ? `, ${issued.label}` : ""}`,
  };
}

async function readAsset(src, id, expected) {
  const value = clean(src);
  if (!value) return null;

  if (/^https?:\/\//i.test(value)) {
    warn(`"${id}": ${value} is a remote URL. Put the file in /public/certificates instead, so it can be measured and optimised.`);
    return null;
  }

  const kind = /\.pdf$/i.test(value) ? "pdf" : IMAGE_EXTENSIONS.test(value) ? "image" : null;
  if (!kind) {
    warn(`"${id}": ${value} is not a supported format (PDF, PNG, JPG, WebP, AVIF, GIF or SVG).`);
    return null;
  }
  if (kind !== expected) {
    warn(`"${id}": ${value} is in the ${expected === "pdf" ? "certificatePdf" : "certificateImage"} field but is not ${expected === "pdf" ? "a PDF" : "an image"}.`);
  }

  const publicPath = `/${value.replace(/^\/+/, "")}`;
  const file = path.join(PUBLIC_DIR, ...publicPath.split("/"));
  if (!file.startsWith(PUBLIC_DIR + path.sep)) return null;

  try {
    const buffer = await readFile(file);
    const size = kind === "pdf" ? readPdfSize(buffer) : readImageSize(buffer);
    return {
      kind,
      src: encodeURI(publicPath),
      width: size?.width ?? null,
      height: size?.height ?? null,
      /* SVG is served as-is; the optimizer does not rasterise it. */
      vector: kind === "image" && /\.svg$/i.test(value),
    };
  } catch {
    warn(`"${id}": ${publicPath} was not found in /public. The card renders without it.`);
    return null;
  }
}

function parseDate(value, id, field) {
  const text = clean(value);
  if (!text) return null;

  const match = text.match(/^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?$/);
  if (!match) {
    warn(`"${id}": ${field} "${text}" is not in YYYY, YYYY-MM or YYYY-MM-DD form and was ignored.`);
    return null;
  }

  const year = Number(match[1]);
  const month = match[2] ? Number(match[2]) : null;
  const date = new Date(Date.UTC(year, month ? month - 1 : 0, match[3] ? Number(match[3]) : 1));

  return {
    year,
    time: date.getTime(),
    /* A year-only date is shown as a year. Printing "January 2023" for it
       would invent a month. */
    label: month ? MONTH_YEAR.format(date) : String(year),
  };
}

/* Featured first, in the order the data file lists them: which credential
   leads is an editorial choice, not a date. Then newest first. Undated entries
   keep their authored order after the dated ones, since there is nothing to
   sort them by. */
function byPlacement(a, b) {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  if (a.featured) return 0;
  if (a.issued && b.issued) return b.issued.time - a.issued.time;
  if (a.issued) return -1;
  if (b.issued) return 1;
  return 0;
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

/* Server-side only, and always on: `next build` runs with NODE_ENV set to
   production, and the build log is exactly where a mistyped path should show. */
function warn(message) {
  console.warn(`[certificates] ${message}`);
}
