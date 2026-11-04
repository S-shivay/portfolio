"use client";

import { useEffect, useRef, useState } from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { useTheme } from "@/hooks/useTheme";
import { openCommandPalette } from "@/components/ui/CommandPalette";

/**
 * Playground.
 *
 * Two of these are not demonstrations at all — the command palette and the
 * theme switch are the components this site genuinely runs on. A working
 * control proves more than a mock of one, and it means the section cannot rot
 * away from the real implementation.
 *
 * The viewport-resizer and the "unoptimised vs optimised rendering" demo were
 * deliberately left out: the first duplicates resizing the browser window, and
 * the second would mean shipping intentionally slow code on a page whose whole
 * argument is performance.
 */
export function PlaygroundGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Card
        label="Live component"
        title="Command menu"
        description="The site's real navigation. Arrow keys to move, Enter to run, Escape to close — and it is one keystroke away from anywhere on the page."
      >
        <CommandDemo />
      </Card>

      <Card
        label="Live component"
        title="Theme"
        description="Switches the whole site, persists to localStorage, and is applied by an inline script before first paint so returning visitors never see a flash of the wrong theme."
      >
        <ThemeDemo />
      </Card>

      <Card
        label="Micro-interaction"
        title="Button states"
        description="Every state a real button needs. Press it to run the async cycle: loading locks the control and reserves the label's width, so nothing reflows."
      >
        <ButtonLab />
      </Card>

      <Card
        label="Loading design"
        title="Skeleton to content"
        description="The skeleton matches the final layout's dimensions exactly, so when data lands nothing moves. That is the difference between a loading state and a layout shift."
      >
        <SkeletonDemo />
      </Card>

      <Card
        label="Accessibility"
        title="Keyboard navigation"
        description="Tab through the controls below. Focus is always visible, order follows the visual layout, and the live region reports where you are."
        className="md:col-span-2"
      >
        <KeyboardDemo />
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Shell                                                                      */
/* -------------------------------------------------------------------------- */

function Card({ label, title, description, children, className }) {
  return (
    <section
      data-spotlight=""
      className={cn(
        "relative flex flex-col overflow-hidden rounded-md card-accent border bg-surface-1 shadow-e1",
        className,
      )}
    >
      <div className="border-b border-line px-6 pb-5 pt-6">
        <p className="label-mono text-accent-ink">{label}</p>
        <h3 className="mt-3 text-[1.0625rem] font-medium tracking-tight text-text">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      </div>

      {/* Stage */}
      <div className="relative flex flex-1 items-center justify-center p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 blueprint-grid opacity-70"
          style={{ "--grid-size": "24px" }}
        />
        <div className="relative w-full">{children}</div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 1 — Command menu                                                           */
/* -------------------------------------------------------------------------- */

function CommandDemo() {
  return (
    <button
      type="button"
      onClick={openCommandPalette}
      className="group flex w-full cursor-pointer items-center gap-3 rounded-md border border-line bg-surface-2 px-4 py-3.5 text-left transition-colors duration-200 hover:border-line-accent"
    >
      <Icon name="Search" size={16} className="shrink-0 text-faint" />
      <span className="flex-1 text-sm text-muted">
        Search sections, projects and actions…
      </span>
      <kbd className="label-mono shrink-0 rounded card-accent border bg-surface-1 px-2 py-1.5 text-faint transition-colors duration-200 group-hover:text-accent-ink">
        ⌘K
      </kbd>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* 2 — Theme                                                                  */
/* -------------------------------------------------------------------------- */

function ThemeDemo() {
  const { theme, setTheme } = useTheme();
  const options = [
    { id: "dark", label: "Dark", icon: "Circle" },
    { id: "light", label: "Light", icon: "CircleDot" },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className="flex w-full gap-2 rounded-full border border-line bg-surface-2 p-1.5"
    >
      {options.map((option) => {
        const selected = theme === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setTheme(option.id)}
            className={cn(
              "relative flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full text-sm transition-colors duration-200",
              selected ? "text-accent-fg" : "text-muted hover:text-text",
            )}
          >
            {selected && (
              <m.span
                layoutId="theme-demo-thumb"
                className="absolute inset-0 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3 — Button states                                                          */
/* -------------------------------------------------------------------------- */

function ButtonLab() {
  const [state, setState] = useState("idle");
  const timers = useRef([]);

  // Clear pending timers on unmount so a state update never lands on an
  // unmounted component.
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const run = () => {
    if (state !== "idle") return;
    setState("loading");
    timers.current.push(
      setTimeout(() => setState("success"), 1100),
      setTimeout(() => setState("idle"), 2600),
    );
  };

  const busy = state === "loading";
  const done = state === "success";

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={run}
        disabled={busy}
        aria-busy={busy}
        className={cn(
          "relative flex h-12 w-full cursor-pointer items-center justify-center rounded-full text-[0.9375rem] font-medium",
          "transition-[background-color,box-shadow,opacity] duration-200",
          done
            ? "bg-positive text-[#04140c]"
            : "bg-accent text-accent-fg hover:bg-[color-mix(in_oklab,var(--accent)_88%,white)]",
          busy && "cursor-wait opacity-90",
        )}
      >
        {/* All three labels occupy the same box, so the button's width is
            fixed by its widest state and never jumps mid-transition. */}
        <span className={cn("transition-opacity duration-150", state !== "idle" && "opacity-0")}>
          Save changes
        </span>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center gap-2 transition-opacity duration-150",
            busy ? "opacity-100" : "opacity-0",
          )}
        >
          <Icon name="LoaderCircle" size={17} className="animate-spin" />
          Saving
        </span>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center gap-2 transition-opacity duration-150",
            done ? "opacity-100" : "opacity-0",
          )}
        >
          <Icon name="Check" size={17} />
          Saved
        </span>
      </button>

      <div className="flex flex-wrap gap-2">
        <span className="flex h-9 items-center rounded-full border border-line bg-surface-2 px-4 text-[0.8125rem] text-muted">
          Secondary
        </span>
        <span className="flex h-9 cursor-not-allowed items-center rounded-full border border-line bg-surface-2 px-4 text-[0.8125rem] text-muted opacity-45">
          Disabled
        </span>
        <span className="flex h-9 items-center rounded-full border-2 border-accent bg-surface-2 px-4 text-[0.8125rem] text-text">
          Focus ring
        </span>
      </div>

      <p aria-live="polite" className="label-mono text-faint">
        State: {state}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4 — Skeleton                                                               */
/* -------------------------------------------------------------------------- */

function SkeletonDemo() {
  const [loading, setLoading] = useState(true);
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(timer.current);
  }, []);

  const reload = () => {
    clearTimeout(timer.current);
    setLoading(true);
    timer.current = setTimeout(() => setLoading(false), 1400);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Fixed height: the skeleton and the content occupy identical space. */}
      <div className="min-h-[6.5rem] rounded-md border border-line bg-surface-2 p-4">
        {loading ? (
          <div aria-hidden="true" className="flex gap-3">
            <SkeletonBlock className="size-11 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-2.5 pt-1">
              <SkeletonBlock className="h-3 w-1/3 rounded-full" />
              <SkeletonBlock className="h-3 w-3/4 rounded-full" />
              <SkeletonBlock className="h-3 w-1/2 rounded-full" />
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line-accent bg-accent-soft text-accent-ink">
              <Icon name="Gauge" size={18} />
            </span>
            <div className="flex-1 pt-0.5">
              <p className="text-[0.9375rem] font-medium text-text">
                Content loaded
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Same dimensions as the skeleton, so nothing shifted when it
                arrived.
              </p>
            </div>
          </div>
        )}
      </div>

      <p aria-live="polite" className="sr-only">
        {loading ? "Loading content" : "Content loaded"}
      </p>

      <button
        type="button"
        onClick={reload}
        className="flex h-10 cursor-pointer items-center justify-center gap-2 self-start rounded-full border border-line bg-surface-2 px-4 text-[0.8125rem] text-muted transition-colors duration-200 hover:border-line-strong hover:text-text"
      >
        <Icon name="LoaderCircle" size={14} />
        Replay
      </button>
    </div>
  );
}

function SkeletonBlock({ className }) {
  return (
    <span
      className={cn(
        "relative block overflow-hidden bg-surface-3",
        className,
      )}
    >
      {/* Shimmer is decorative; reduced motion strips the animation and leaves
          a plain block, which still reads as "pending". */}
      <span className="absolute inset-0 motion-safe:animate-[shimmer_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-[color-mix(in_oklab,var(--text)_9%,transparent)] to-transparent" />
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* 5 — Keyboard navigation                                                    */
/* -------------------------------------------------------------------------- */

const KEYBOARD_STEPS = [
  { id: "one", label: "First control", hint: "Tab starts here" },
  { id: "two", label: "Second control", hint: "Tab moves forward" },
  { id: "three", label: "Third control", hint: "Shift+Tab moves back" },
  { id: "four", label: "Fourth control", hint: "Order matches the layout" },
];

function KeyboardDemo() {
  const [focused, setFocused] = useState(null);
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-5">
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {KEYBOARD_STEPS.map((step, index) => (
          <li key={step.id}>
            <button
              type="button"
              onFocus={() => setFocused(step.id)}
              onBlur={() => setFocused(null)}
              className={cn(
                "flex h-full w-full cursor-pointer flex-col items-start gap-1 rounded-md border px-4 py-3.5 text-left transition-colors duration-200",
                focused === step.id
                  ? "border-line-accent bg-accent-soft"
                  : "border-line bg-surface-2 hover:border-line-strong",
              )}
            >
              <span className="label-mono text-faint">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-sm text-text">{step.label}</span>
              <span className="text-[0.8125rem] text-faint">{step.hint}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Focus report. `aria-live` is redundant for a screen reader (which
          already announces focus) but valuable for a sighted keyboard user
          and for anyone watching a demo. */}
      <div className="flex min-h-11 items-center gap-3 rounded-md border border-line bg-surface-2 px-4 py-3">
        <Icon name="Keyboard" size={16} className="shrink-0 text-accent-ink" />
        <AnimatePresence mode="wait" initial={false}>
          <m.p
            key={focused ?? "none"}
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.14 }}
            className="text-sm text-muted"
          >
            {focused
              ? `Focus is on: ${
                  KEYBOARD_STEPS.find((s) => s.id === focused)?.label
                }`
              : "Press Tab to move focus into the controls above."}
          </m.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
