"use client";

import { useEffect, useRef } from "react";

import { registerOverlay, releaseOverlay } from "@/lib/route-history";

/**
 * While `open`, the browser's Back closes this overlay instead of leaving the
 * page. Closing it any other way (X, Escape, the backdrop) removes the history
 * step again, so no dead press is left behind.
 */
export function useBackToClose(open, onClose) {
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const id = registerOverlay(() => closeRef.current());
    return () => releaseOverlay(id);
  }, [open]);
}
