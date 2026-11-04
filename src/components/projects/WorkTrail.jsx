"use client";

import { useEffect, useState } from "react";

import { ImageTrail } from "@/components/ui/image-trail";
import { usePointerFine } from "@/hooks/useActiveSection";

/**
 * The Projects header, with Vengeance UI's image trail behind the pointer.
 *
 * Moving across the header drops a trail of real interface screenshots from
 * the case studies under the cursor, each spinning in and fading out — a
 * preview of the work before the first card, made of the work itself rather
 * than stock imagery (the registry default was Unsplash photos).
 *
 * The images are 384px next/image renditions, and the trail only exists for
 * a fine pointer without reduced motion: on a phone the header is just a
 * header.
 */
const thumb = (src) =>
  `/_next/image?url=${encodeURIComponent(src)}&w=384&q=75`;

export function WorkTrail({ images, children, className }) {
  const fine = usePointerFine();
  const [reduce, setReduce] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <ImageTrail
      images={images.map((image) => ({ src: thumb(image.src), alt: "" }))}
      disabled={!fine || reduce}
      threshold={90}
      maxItems={7}
      duration={900}
      rotationRange={24}
      className={className}
      imageClassName="aspect-[4/3] w-48 rounded-md border border-white/40 object-cover object-top shadow-e2"
    >
      {children}
    </ImageTrail>
  );
}
