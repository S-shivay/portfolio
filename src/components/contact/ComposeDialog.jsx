"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";

import { site } from "@/data/site";
import { buildComposeLinks, DEFAULT_SUBJECT } from "@/lib/mailto";
import { cn } from "@/lib/cn";
import { useBackToClose } from "@/hooks/useBackToClose";
import { Icon } from "@/components/ui/Icon";

const OPEN_EVENT = "compose:open";

/** Opens the compose chooser from anywhere. */
export function openCompose(options = {}) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: options }));
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Email compose chooser.
 *
 * Clicking an email address should never be a click that does nothing. On a
 * machine with no registered `mailto:` handler — a browser-only Gmail user, a
 * fresh Windows install, a locked-down work laptop — that is exactly what
 * happens, silently.
 *
 * This dialog removes that failure: the default mail app stays the first and
 * most prominent option, with webmail compose links behind it and the raw
 * address one click from the clipboard. Every route arrives at a new message
 * addressed to the same place.
 *
 * Mounted once in the root layout; opened via `openCompose()`.
 */
export function ComposeDialog() {
  const reduceMotion = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [copied, setCopied] = useState(false);

  const dialogRef = useRef(null);
  const restoreFocusRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);
  useBackToClose(open, close);

  useEffect(() => {
    const onOpenRequest = (event) => {
      restoreFocusRef.current = document.activeElement;
      setSubject(event.detail?.subject ?? DEFAULT_SUBJECT);
      setCopied(false);
      setOpen(true);
    };

    window.addEventListener(OPEN_EVENT, onOpenRequest);
    return () => window.removeEventListener(OPEN_EVENT, onOpenRequest);
  }, []);

  useEffect(() => {
    if (!open) {
      if (restoreFocusRef.current instanceof HTMLElement) {
        restoreFocusRef.current.focus({ preventScroll: true });
      }
      return;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(timer);
  }, [copied]);

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = dialogRef.current?.querySelectorAll(FOCUSABLE);
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const links = buildComposeLinks({ to: site.email, subject });

  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 10, scale: 0.99 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 10, scale: 0.99 },
        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={close}
            className="absolute inset-0 cursor-default bg-[color-mix(in_oklab,var(--bg)_78%,transparent)] backdrop-blur-sm"
          />

          <m.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="compose-title"
            tabIndex={-1}
            onKeyDown={onKeyDown}
            {...motionProps}
            className="relative w-full max-w-[26rem] overflow-hidden rounded-lg border border-line bg-surface-1 shadow-e2 outline-none"
          >
            <header className="flex items-start gap-3 border-b border-line px-5 py-4">
              <div className="min-w-0 flex-1">
                <h2
                  id="compose-title"
                  className="text-[0.9375rem] font-medium text-text"
                >
                  Write to me
                </h2>
                <p className="mt-1 truncate text-sm text-muted">{site.email}</p>
              </div>

              <button
                type="button"
                onClick={close}
                title="Close"
                className="-mr-1.5 -mt-1 grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-md text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-text"
              >
                <Icon name="X" size={16} label="Close" />
              </button>
            </header>

            <div className="p-3">
              <ComposeOption
                href={links.mailto}
                icon="Mail"
                title="Default mail app"
                hint="Outlook, Apple Mail, Thunderbird"
                primary
                onClick={close}
              />

              <p className="label-mono px-3 pb-1.5 pt-4 text-faint">
                Or in the browser
              </p>

              <ComposeOption
                href={links.gmail}
                icon="Globe"
                title="Gmail"
                external
                onClick={close}
              />
              <ComposeOption
                href={links.outlook}
                icon="Globe"
                title="Outlook.com"
                external
                onClick={close}
              />
              <ComposeOption
                href={links.yahoo}
                icon="Globe"
                title="Yahoo Mail"
                external
                onClick={close}
              />

              <span aria-hidden="true" className="my-2 block h-px bg-line" />

              <button
                type="button"
                onClick={copyAddress}
                className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors duration-200 hover:bg-surface-2"
              >
                <Icon
                  name={copied ? "Check" : "Copy"}
                  size={16}
                  className={cn(
                    "shrink-0",
                    copied ? "text-positive" : "text-faint",
                  )}
                />
                <span className="text-[0.9375rem] text-text">
                  {copied ? "Address copied" : "Copy address"}
                </span>
              </button>
            </div>
          </m.div>

          {/* Announced without stealing focus from the dialog. */}
          <div aria-live="polite" className="sr-only">
            {copied ? "Email address copied to clipboard" : ""}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

function ComposeOption({ href, icon, title, hint, primary, external, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors duration-200",
        primary
          ? "border border-line bg-surface-2 hover:border-line-strong"
          : "hover:bg-surface-2",
      )}
    >
      <Icon
        name={icon}
        size={16}
        className={cn("shrink-0", primary ? "text-accent-ink" : "text-faint")}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-[0.9375rem] text-text">{title}</span>
        {hint && <span className="block text-[0.8125rem] text-faint">{hint}</span>}
      </span>
      <Icon name="ArrowUpRight" size={15} className="shrink-0 text-faint" />
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  );
}
