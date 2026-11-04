/**
 * Intrinsic dimensions of a certificate file, read from its bytes.
 *
 * The certificate section needs every document's real aspect ratio before
 * anything renders: a portrait scan and a landscape PDF have to be framed
 * differently, and reserving the right box up front is what stops the grid
 * from jumping as previews load. Asking the author to type width and height
 * into the data file would work until the first time a number was wrong, so
 * the header of each file is read instead.
 *
 * A dependency would do this, but the formats that matter here each keep their
 * size at a fixed, documented offset, and ~150 lines is cheaper than a package.
 *
 * Returns `{ width, height }` in display orientation, or null when the format
 * is unrecognised or the header is damaged. Null is not an error: the UI falls
 * back to a neutral frame and takes the real size from the browser on load.
 */

export function readImageSize(buffer) {
  try {
    return png(buffer) ?? jpeg(buffer) ?? webp(buffer) ?? gif(buffer) ?? heif(buffer) ?? svg(buffer);
  } catch {
    return null;
  }
}

/**
 * Page size of a PDF's first page, in points, with `/Rotate` applied.
 *
 * Reads the first `/MediaBox` in the file. That is the first page's box for
 * the ordinary single-page PDFs certificate platforms export. It fails, and
 * returns null, for PDFs whose page dictionaries sit inside compressed object
 * streams. That case is handled on the client, where pdf.js reports the true
 * page size once the document opens.
 */
export function readPdfSize(buffer) {
  try {
    const text = buffer.toString("latin1");
    const box = text.match(
      /\/MediaBox\s*\[\s*(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s*\]/,
    );
    if (!box) return null;

    const [x0, y0, x1, y1] = box.slice(1).map(Number);
    let width = Math.abs(x1 - x0);
    let height = Math.abs(y1 - y0);
    if (!width || !height) return null;

    const rotate = text.match(/\/Rotate\s+(-?\d+)/);
    if (rotate && Math.abs(Number(rotate[1])) % 180 === 90) {
      [width, height] = [height, width];
    }

    return { width: Math.round(width), height: Math.round(height) };
  } catch {
    return null;
  }
}

/* ---- Formats ------------------------------------------------------------- */

function png(b) {
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function gif(b) {
  if (b.length < 10 || b.toString("ascii", 0, 3) !== "GIF") return null;
  return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
}

function webp(b) {
  if (
    b.length < 30 ||
    b.toString("ascii", 0, 4) !== "RIFF" ||
    b.toString("ascii", 8, 12) !== "WEBP"
  ) {
    return null;
  }

  const chunk = b.toString("ascii", 12, 16);
  if (chunk === "VP8 ") {
    return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === "VP8L") {
    const bits = b.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8X") {
    return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
  }
  return null;
}

/* AVIF and HEIC: the `ispe` property box carries the image extent. */
function heif(b) {
  if (b.length < 16 || b.toString("ascii", 4, 8) !== "ftyp") return null;
  const at = b.indexOf("ispe");
  if (at < 0 || at + 16 > b.length) return null;
  return { width: b.readUInt32BE(at + 8), height: b.readUInt32BE(at + 12) };
}

function svg(b) {
  const head = b.toString("utf8", 0, Math.min(b.length, 4096));
  const tag = head.match(/<svg\b[^>]*>/i)?.[0];
  if (!tag) return null;

  const attr = (name) => {
    const value = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([\\d.]+)(px)?["']`, "i"));
    return value ? Number(value[1]) : null;
  };

  const width = attr("width");
  const height = attr("height");
  if (width && height) return { width, height };

  const viewBox = tag.match(/viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  if (viewBox) return { width: Number(viewBox[1]), height: Number(viewBox[2]) };
  return null;
}

/**
 * JPEG, with EXIF orientation applied.
 *
 * A phone photo of a paper certificate is usually stored sideways with an
 * orientation flag telling viewers to rotate it. The image optimizer honours
 * that flag, so the picture the browser receives is upright. The raw frame
 * size read from the file is not, and reporting it unrotated would frame a
 * portrait certificate as landscape.
 */
function jpeg(b) {
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return null;

  let orientation = 1;
  let offset = 2;

  while (offset + 9 < b.length) {
    if (b[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = b[offset + 1];
    // Fill bytes, and markers that carry no length field.
    if (marker === 0xff) {
      offset += 1;
      continue;
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) {
      offset += 2;
      continue;
    }

    const length = b.readUInt16BE(offset + 2);

    if (marker === 0xe1) {
      orientation = exifOrientation(b, offset + 4, length - 2) ?? orientation;
    }

    // SOF0–SOF15, excluding DHT (C4), JPG (C8) and DAC (CC).
    if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc
    ) {
      const height = b.readUInt16BE(offset + 5);
      const width = b.readUInt16BE(offset + 7);
      // Orientations 5–8 are the ones that turn the image a quarter.
      return orientation >= 5
        ? { width: height, height: width }
        : { width, height };
    }

    offset += 2 + length;
  }

  return null;
}

function exifOrientation(b, start, length) {
  if (b.toString("ascii", start, start + 6) !== "Exif\0\0") return null;

  const tiff = start + 6;
  const little = b.toString("ascii", tiff, tiff + 2) === "II";
  const u16 = (at) => (little ? b.readUInt16LE(at) : b.readUInt16BE(at));
  const u32 = (at) => (little ? b.readUInt32LE(at) : b.readUInt32BE(at));

  const ifd = tiff + u32(tiff + 4);
  const end = start + length;
  if (ifd + 2 > end) return null;

  const entries = u16(ifd);
  for (let i = 0; i < entries; i += 1) {
    const entry = ifd + 2 + i * 12;
    if (entry + 12 > end) break;
    if (u16(entry) === 0x0112) return u16(entry + 8);
  }
  return null;
}
