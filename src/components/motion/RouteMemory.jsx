"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

import { commitRoute, installRouteHistory } from "@/lib/route-history";

/**
 * Connects the history layer to React. The layout effect on `pathname` runs in
 * the same commit as the page swap, before paint and before the view transition
 * takes its snapshot, which is what lets a Back land already in place.
 */
export function RouteMemory() {
  const pathname = usePathname();

  useLayoutEffect(() => installRouteHistory(), []);

  useLayoutEffect(() => {
    commitRoute(pathname);
  }, [pathname]);

  return null;
}
