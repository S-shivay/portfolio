"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";

import { site, navItems } from "@/data/site";
import { featuredProjects } from "@/data/projects";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { openResumeViewer } from "@/components/resume/ResumeViewer";
import { openCompose } from "@/components/contact/ComposeDialog";
import { useBackToClose } from "@/hooks/useBackToClose";
import { goToHash, markNavigating } from "@/lib/route-history";

const OPEN_EVENT = "command-palette:open";

/** Opens the palette from anywhere — the nav button, the playground, a link. */
export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

const isPlaceholder = (value) =>
  !value || typeof value !== "string" || value.startsWith("[");

export function CommandPalette() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [toast, setToast] = useState(null);

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const restoreFocusRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);
  useBackToClose(open, close);

  const openPalette = useCallback(() => {
    restoreFocusRef.current = document.activeElement;
    setQuery("");
    setActiveIndex(0);
    setOpen(true);
  }, []);

  /* ---- Command registry -------------------------------------------------- */

  const commands = useMemo(() => {
    const list = [];

    for (const item of navItems) {
      list.push({
        id: `go-${item.id}`,
        group: "Navigate",
        label: item.label,
        hint: `Jump to the ${item.label.toLowerCase()} section`,
        icon: "CornerDownLeft",
        keywords: ["go", "section", item.id],
        run: () => {
          markNavigating();
          close();
          /* The sections live on the home page. From a case study this used to
             look for an element that is not there and write the hash onto the
             wrong URL, so "Skills" did nothing at all. */
          if (window.location.pathname === "/") {
            goToHash(`#${item.id}`);
          } else {
            router.push(`/#${item.id}`, { transitionTypes: ["nav-back"] });
          }
        },
      });
    }

    for (const project of featuredProjects) {
      list.push({
        id: `project-${project.slug}`,
        group: "Case studies",
        label: project.name,
        hint: project.tagline,
        icon: "ArrowUpRight",
        keywords: ["project", "work", "case study", ...project.stack],
        run: () => {
          const href = `/work/${project.slug}`;
          if (window.location.pathname === href) {
            close();
            return;
          }
          markNavigating();
          close();
          router.push(href, { transitionTypes: ["nav-forward"] });
        },
      });
    }

    list.push({
      id: "theme",
      group: "Preferences",
      label: theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
      hint: "Applies immediately and is remembered",
      icon: theme === "dark" ? "Palette" : "Palette",
      keywords: ["theme", "dark", "light", "appearance", "mode"],
      run: () => setTheme(theme === "dark" ? "light" : "dark"),
    });

    if (!isPlaceholder(site.email)) {
      list.push({
        id: "copy-email",
        group: "Contact",
        label: "Copy email address",
        hint: site.email,
        icon: "Copy",
        keywords: ["email", "mail", "contact", "copy"],
        run: async () => {
          try {
            await navigator.clipboard.writeText(site.email);
            setToast("Email copied");
          } catch {
            setToast("Could not copy — clipboard unavailable");
          }
        },
      });

      list.push({
        id: "email",
        group: "Contact",
        label: "Send an email",
        hint: site.email,
        icon: "Mail",
        keywords: ["email", "mail", "contact", "write"],
        run: () => {
          close();
          openCompose();
        },
      });
    }

    if (!isPlaceholder(site.links.resume)) {
      list.push({
        id: "resume-view",
        group: "Contact",
        label: "View resume",
        hint: "Opens the PDF here, without leaving the page",
        icon: "FileText",
        keywords: ["resume", "cv", "pdf", "read", "view"],
        run: () => {
          close();
          openResumeViewer();
        },
      });

      list.push({
        id: "resume-download",
        group: "Contact",
        label: "Download resume",
        hint: "Saves the PDF to your device",
        icon: "Download",
        keywords: ["resume", "cv", "pdf", "download", "save"],
        run: () => {
          close();
          // A transient anchor rather than window.open: `download` is what makes
          // the browser save the file instead of rendering it in a new tab.
          const anchor = document.createElement("a");
          anchor.href = site.links.resume;
          anchor.download = "";
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
        },
      });
    }

    for (const [key, label, icon] of [
      ["github", "Open GitHub profile", "ExternalLink"],
      ["linkedin", "Open LinkedIn profile", "ExternalLink"],
    ]) {
      const url = site.links[key];
      if (isPlaceholder(url)) continue;

      list.push({
        id: key,
        group: "Elsewhere",
        label,
        hint: url,
        icon,
        keywords: [key, "profile", "social"],
        run: () => {
          close();
          window.open(url, "_blank", "noopener,noreferrer");
        },
      });
    }

    return list;
  }, [close, router, setTheme, theme]);

  /* ---- Filtering --------------------------------------------------------- */

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;

    return commands.filter((command) => {
      const haystack = [command.label, command.hint, command.group, ...(command.keywords ?? [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [commands, query]);

  /* Grouped for display, while `results` stays flat for keyboard indexing. */
  const groups = useMemo(() => {
    const map = new Map();
    results.forEach((command, index) => {
      if (!map.has(command.group)) map.set(command.group, []);
      map.get(command.group).push({ ...command, index });
    });
    return [...map.entries()];
  }, [results]);

  /* ---- Global shortcut --------------------------------------------------- */

  useEffect(() => {
    const onKeyDown = (event) => {
      const isShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (!isShortcut) return;

      event.preventDefault();
      setOpen((current) => {
        if (current) return false;
        restoreFocusRef.current = document.activeElement;
        setQuery("");
        setActiveIndex(0);
        return true;
      });
    };

    const onOpenRequest = () => openPalette();

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_EVENT, onOpenRequest);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_EVENT, onOpenRequest);
    };
  }, [openPalette]);

  /* ---- Open/close side effects ------------------------------------------- */

  useEffect(() => {
    if (!open) {
      // Restore focus to whatever opened the palette.
      if (restoreFocusRef.current instanceof HTMLElement) {
        restoreFocusRef.current.focus({ preventScroll: true });
      }
      return;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  /* Keep the highlighted row in view when navigating by keyboard. */
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  /* ---- Keyboard handling within the palette ------------------------------ */

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) =>
        results.length ? (i - 1 + results.length) % results.length : 0,
      );
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(Math.max(0, results.length - 1));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      results[activeIndex]?.run();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]"
        >
          {/* Scrim. A button so a pointer user can dismiss by clicking away,
              hidden from assistive tech because Escape already covers it. */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={close}
            className="absolute inset-0 cursor-default bg-[color-mix(in_oklab,var(--bg)_72%,transparent)] backdrop-blur-sm"
          />

          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            initial={{ opacity: 0, y: -8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[36rem] overflow-hidden rounded-lg border border-line bg-surface-1 shadow-e2"
          >
            {/* Search field */}
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Icon name="Search" size={16} className="shrink-0 text-faint" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onKeyDown}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls="command-list"
                aria-autocomplete="list"
                aria-activedescendant={
                  results[activeIndex] ? `command-${results[activeIndex].id}` : undefined
                }
                placeholder="Search sections, projects and actions…"
                autoComplete="off"
                spellCheck="false"
                className="h-14 w-full bg-transparent text-[0.9375rem] text-text outline-none"
              />
              <kbd className="label-mono shrink-0 rounded border border-line bg-surface-2 px-1.5 py-1 text-faint">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              id="command-list"
              role="listbox"
              aria-label="Commands"
              className="max-h-[min(24rem,50vh)] overflow-y-auto overscroll-contain p-2"
            >
              {results.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-muted">
                  No matches for{" "}
                  <span className="text-text">“{query}”</span>
                </p>
              ) : (
                groups.map(([group, items]) => (
                  <div key={group} className="mb-1 last:mb-0">
                    <p className="label-mono px-3 pb-1.5 pt-3 text-faint">
                      {group}
                    </p>
                    {items.map((command) => {
                      const isActive = command.index === activeIndex;
                      return (
                        <div
                          key={command.id}
                          id={`command-${command.id}`}
                          role="option"
                          aria-selected={isActive}
                          data-active={isActive}
                          onClick={() => command.run()}
                          onMouseMove={() => setActiveIndex(command.index)}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 transition-colors duration-100",
                            isActive ? "bg-surface-2" : "bg-transparent",
                          )}
                        >
                          <Icon
                            name={command.icon}
                            size={15}
                            className={cn(
                              "shrink-0",
                              isActive ? "text-accent-ink" : "text-faint",
                            )}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[0.9375rem] text-text">
                              {command.label}
                            </span>
                            {command.hint && (
                              <span className="block truncate text-[0.8125rem] text-faint">
                                {command.hint}
                              </span>
                            )}
                          </span>
                          {isActive && (
                            <Icon
                              name="CornerDownLeft"
                              size={14}
                              className="shrink-0 text-faint"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer legend */}
            <div className="flex items-center gap-4 border-t border-line px-4 py-2.5">
              <Legend keys={["↑", "↓"]} label="Navigate" />
              <Legend keys={["↵"]} label="Select" />
              <Legend keys={["esc"]} label="Close" />
            </div>
          </m.div>

          {/* Action feedback, announced politely rather than stealing focus. */}
          <div aria-live="polite" className="sr-only">
            {toast}
          </div>
          <AnimatePresence>
            {toast && (
              <m.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="pointer-events-none fixed bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-line bg-surface-2 px-4 py-2 text-sm text-text shadow-e2"
              >
                {toast}
              </m.p>
            )}
          </AnimatePresence>
        </m.div>
      )}
    </AnimatePresence>
  );
}

function Legend({ keys, label }) {
  return (
    <span className="flex items-center gap-1.5">
      {keys.map((key) => (
        <kbd
          key={key}
          className="label-mono grid h-5 min-w-5 place-items-center rounded border border-line bg-surface-2 px-1 text-faint"
        >
          {key}
        </kbd>
      ))}
      <span className="label-mono text-faint">{label}</span>
    </span>
  );
}
