"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

import { cn } from "@/lib/cn";
import { IssuerMark } from "@/components/certificates/IssuerMark";

const PdfFirstPage = dynamic(() => import("@/components/certificates/PdfFirstPage"), {
  ssr: false,
  loading: () => null,
});

/* A4 landscape, held until a document the server could not measure reports
   its own size. */
export const FALLBACK_RATIO = 1.414;

/**
 * A certificate as a sheet of paper resting on a stage.
 *
 * The sheet is sized from the document's real aspect ratio, measured on the
 * server, so a portrait certificate stands upright and a landscape one lies
 * flat. Neither is ever cropped or stretched, and neither shifts the layout
 * as it loads. The stage is a size container: `min(100cqw, 100cqh × ratio)`
 * is "contain" worked out in CSS for the sheet itself rather than for an image
 * inside a fixed box. That is what lets the sheet's shadow hug the document's
 * real edges instead of the stage's.
 *
 * Images come through next/image at card size, never the full-resolution
 * file. That only loads when the certificate is opened in the viewer.
 */
export function CertificatePreview({ certificate, sizes, className = "relative" }) {
  const asset = certificate.preview;
  const known = asset?.width && asset?.height ? asset.width / asset.height : null;

  const [ratio, setRatio] = useState(known ?? FALLBACK_RATIO);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    /* Positioning comes from the caller: `relative` by default, `absolute`
       inside a card. `cn` concatenates rather than merging, so a hard-coded
       `relative` here would silently beat the card's `absolute` and collapse
       the stage to zero height. */
    <div className={cn("cert-stage overflow-hidden", className)}>
      {asset && !failed ? (
        <div className="absolute inset-[9%] grid place-items-center [container-type:size]">
          <div
            className="cert-paper relative overflow-hidden"
            style={{
              aspectRatio: ratio,
              width: `min(100cqw, 100cqh * ${ratio})`,
            }}
          >
            {!ready && (
              <span aria-hidden="true" className="cert-shimmer absolute inset-0" />
            )}

            {asset.kind === "image" ? (
              <Image
                src={asset.src}
                alt={certificate.alt}
                fill
                sizes={sizes}
                unoptimized={asset.vector}
                className="object-contain"
                onLoad={(event) => {
                  const img = event.currentTarget;
                  if (!known && img.naturalWidth) {
                    setRatio(img.naturalWidth / img.naturalHeight);
                  }
                  setReady(true);
                }}
                onError={() => setFailed(true)}
              />
            ) : (
              <LazyPdf
                src={asset.src}
                label={certificate.alt}
                onSize={(width, height) => {
                  if (!known) setRatio(width / height);
                }}
                onRendered={() => setReady(true)}
                onFailed={() => setFailed(true)}
              />
            )}
          </div>
        </div>
      ) : (
        <Plate certificate={certificate} />
      )}
    </div>
  );
}

/**
 * Defers pdf.js until the card is close to the viewport. A visitor who never
 * scrolls this far never downloads the renderer or the PDF.
 */
function LazyPdf({ src, label, onSize, onRendered, onFailed }) {
  const ref = useRef(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} role="img" aria-label={label} className="absolute inset-0">
      {near && (
        <PdfFirstPage
          src={src}
          onSize={onSize}
          onRendered={onRendered}
          onFailed={onFailed}
        />
      )}
    </div>
  );
}

/**
 * What a certificate with no file shows: the issuer's mark on the stage.
 *
 * Deliberately an emblem and not a mock document. A drawn "certificate" here
 * would read as the real one, and it is not.
 */
function Plate({ certificate }) {
  return (
    /* Hidden from assistive tech: the issuer is already read out in the card
       body, and the emblem carries nothing the body does not. */
    <div aria-hidden="true" className="absolute inset-0 grid place-items-center p-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="grid size-24 place-items-center rounded-full border border-dashed border-line-strong bg-surface-1/70">
          <IssuerMark
            issuer={certificate.issuer}
            logo={certificate.issuerLogo}
            size="lg"
          />
        </span>
        <span className="label-mono max-w-[22ch] leading-snug text-faint">
          {certificate.issuer}
        </span>
      </div>
    </div>
  );
}
