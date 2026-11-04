"use client";

import { useSyncExternalStore } from "react";

/**
 * Sarang's local time, ticking — a small live signal that a person is on the
 * other end of the page.
 *
 * The server cannot know the visitor's moment, so it renders the static
 * timezone (`fallback`) and the client swaps in the clock after hydration;
 * `useSyncExternalStore` gives the two snapshots without a mismatch warning
 * or a setState-in-effect render.
 */
const format = () =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

function subscribe(onChange) {
  const timer = setInterval(onChange, 15_000);
  return () => clearInterval(timer);
}

export function LocalTime({ fallback, suffix = "IST", className }) {
  const time = useSyncExternalStore(subscribe, format, () => null);

  return <span className={className}>{time ? `${time} ${suffix}` : fallback}</span>;
}
