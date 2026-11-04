"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";

import { site, navItems } from "@/data/site";
import { cn } from "@/lib/cn";
import { useActiveSection, useScrolled } from "@/hooks/useActiveSection";
import { useBackToClose } from "@/hooks/useBackToClose";
import { Icon } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AvailabilityPill } from "@/components/ui/Tag";
import { openCommandPalette } from "@/components/ui/CommandPalette";
import { ProgressiveBlur } from "@/components/ui/skiper-ui/skiper41";
import { TextRoll } from "@/components/ui/skiper-ui/skiper58";

const SECTION_IDS = navItems.map((item) => item.id);
const EASE = [0.16, 1, 0.3, 1];

/**
 * Hides the bar while the reader scrolls down into content and brings it back
 * the moment they scroll up — the nav is there when it is reached for and out
 * of the way when it is not. Never hidden near the top of the page.
 */
function useHideOnScroll(enabled) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let last = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      /* A jump this size in one event is a restored position, not a reader
         scrolling, and someone who just pressed Back needs the nav. */
      if (y < 240 || Math.abs(y - last) > 300) setHidden(false);
      else if (y > last + 6) setHidden(true);
      else if (y < last - 6) setHidden(false);
      last = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);

  return enabled && hidden;
}

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const scrolled = useScrolled(24);
  const [activeSection, activateSection] = useActiveSection(SECTION_IDS);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const tucked = useHideOnScroll(!menuOpen);

  const menuId = useId();
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useBackToClose(menuOpen, closeMenu);

  /* Route changes close the menu. Adjusted during render rather than in an
     effect, so the stale-open menu is never committed to the DOM. */
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  /* Mobile menu: escape to close, focus trap, scroll lock, focus restore. */
  useEffect(() => {
    if (!menuOpen) return;

    const previouslyFocused = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") return;

      const focusables = menuRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    menuRef.current?.querySelector("a, button")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus({ preventScroll: true });
    };
  }, [menuOpen, closeMenu]);

  /* On a case-study page the section anchors do not exist, so links point back
     to the home page's fragments — as client navigations tagged "back", so
     leaving a case study plays the page transition. */
  const hrefFor = (id) => (isHome ? `#${id}` : `/#${id}`);
  const SectionLink = isHome ? "a" : Link;
  const sectionLinkProps = isHome ? {} : { transitionTypes: ["nav-back"] };

  return (
    <>
      {/* Skiper 41's progressive blur behind the bar. A sibling of the header,
          not a child: the header carries a `view-transition-name`, which makes
          it a backdrop root, and a backdrop-filter inside it would only see
          the header's own transparent box. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-[19] h-28 transition-[opacity,transform] duration-500 ease-[var(--ease-out)]",
          scrolled && !tucked ? "opacity-100" : "opacity-0",
          tucked && "-translate-y-full",
        )}
      >
        <ProgressiveBlur
          position="top"
          height="7rem"
          blurAmount="10px"
          backgroundColor="color-mix(in oklab, var(--bg) 80%, transparent)"
        />
      </div>

      <header
        style={{ viewTransitionName: "site-header" }}
        className={cn(
          "fixed inset-x-0 top-0 z-20 transition-transform duration-500 ease-[var(--ease-out)]",
          tucked && "-translate-y-[120%]",
        )}
      >
        <nav
          aria-label="Primary"
          className="container-wide flex h-16 items-center justify-between gap-4 md:h-[4.75rem]"
        >
          {/* Wordmark: a seal and the name in italic, full stop in vermilion. */}
          <Link
            href="/"
            transitionTypes={isHome ? undefined : ["nav-back"]}
            data-cursor="link"
            className="tap-target group flex shrink-0 items-center gap-2.5 rounded-sm"
            aria-label={`${site.name}, home`}
          >
            <span
              aria-hidden="true"
              className="grid size-9 place-items-center rounded-full bg-emerald text-ivory transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-[-12deg] group-hover:scale-105"
            >
              <span className="font-display text-[0.9375rem] italic leading-none">
                {initialsOf(site.name)}
              </span>
            </span>
            <span className="font-display text-[1.375rem] italic leading-none tracking-tight text-text">
              {site.shortName}
              <span className="not-italic text-vermilion">.</span>
            </span>
          </Link>

          {/* Desktop links, in a floating pill. One ink capsule slides between
              them (shared layoutId) and the labels roll on hover. */}
          <ul className="nav-pill hidden items-center gap-0.5 rounded-full border border-line p-1 xl:flex">
            {navItems.map((item) => {
              const isActive = isHome && activeSection === item.id;

              return (
                <li key={item.id}>
                  <SectionLink
                    href={hrefFor(item.id)}
                    {...sectionLinkProps}
                    data-cursor="link"
                    onClick={isHome ? () => activateSection(item.id) : undefined}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "group relative isolate flex h-9 items-center rounded-full px-4 text-[0.875rem] transition-colors duration-300",
                      isActive ? "text-bg" : "text-muted hover:text-text",
                    )}
                  >
                    {isActive && (
                      <m.span
                        layoutId="nav-active"
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 rounded-full bg-text"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                    <TextRoll>{item.label}</TextRoll>
                  </SectionLink>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={openCommandPalette}
              className="nav-pill hidden size-10 cursor-pointer place-items-center rounded-full border border-line text-muted transition-colors duration-200 hover:border-line-strong hover:text-text sm:grid"
              aria-label="Open command menu"
              title="Search (⌘K)"
            >
              <Icon name="Search" size={15} />
            </button>

            <ThemeToggle className="nav-pill" />

            <SectionLink
              href={hrefFor("contact")}
              {...sectionLinkProps}
              data-cursor="link"
              onClick={isHome ? () => activateSection("contact") : undefined}
              className="btn group/btn relative isolate hidden h-10 items-center gap-2 overflow-hidden rounded-full bg-vermilion px-4 text-[0.875rem] font-medium text-[#170a05] transition-colors duration-500 hover:text-ivory lg:inline-flex"
            >
              <span aria-hidden="true" className="btn-flood btn-flood-ink" />
              <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
              Let&apos;s talk
            </SectionLink>

            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              /* `tap-target`: this is the button every phone visitor has to
                 hit to navigate at all. */
              className="nav-pill tap-target grid size-10 cursor-pointer place-items-center rounded-full border border-line text-text transition-colors duration-200 hover:border-line-strong xl:hidden"
            >
              <Icon name={menuOpen ? "X" : "Menu"} size={18} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu: an emerald sheet that opens as a circle growing out of
          the menu button, the links rising one after another out of their
          rows. Under reduced motion framer-motion skips the transforms. */}
      <AnimatePresence>
        {menuOpen && (
          <m.div
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            data-surface="ink"
            data-tone="vermilion"
            ref={menuRef}
            initial={{ clipPath: "circle(0% at calc(100% - 2.6rem) 2rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.6rem) 2rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.6rem) 2rem)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-30 flex flex-col overflow-hidden xl:hidden"
          >
            <div aria-hidden="true" className="section-wash" />

            <div className="container-wide relative z-10 flex h-16 items-center justify-between">
              <span className="label-mono text-faint">Menu</span>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
                className="grid size-10 cursor-pointer place-items-center rounded-full border border-line-strong text-text"
              >
                <Icon name="X" size={18} />
              </button>
            </div>

            <div className="container-wide relative z-10 flex flex-1 flex-col justify-between overflow-y-auto pb-10 pt-4">
              <ul className="flex flex-col">
                {navItems.map((item, index) => (
                  <li key={item.id} className="overflow-hidden border-b border-line">
                    <m.div
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.16 + index * 0.05, duration: 0.7, ease: EASE }}
                    >
                      {/* A client navigation on a case study, not a plain `<a>`:
                          that was a full page reload from inside the menu. */}
                      <SectionLink
                        href={hrefFor(item.id)}
                        {...sectionLinkProps}
                        onClick={() => {
                          closeMenu();
                          if (isHome) activateSection(item.id);
                        }}
                        className="group flex items-baseline gap-4 py-4 font-display text-[clamp(2.25rem,11vw,3.5rem)] leading-none tracking-[-0.02em] text-text transition-colors duration-300 hover:text-accent-ink"
                      >
                        <span className="label-mono shrink-0 text-accent-ink">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-2">
                          {item.label}
                        </span>
                      </SectionLink>
                    </m.div>
                  </li>
                ))}
              </ul>

              <m.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
                className="mt-10 flex flex-col gap-4"
              >
                {site.available && (
                  <AvailabilityPill label={site.availabilityLabel} className="self-start" />
                )}
                <a
                  href={site.links.resume}
                  download
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-vermilion text-[0.9375rem] font-medium text-[#170a05]"
                >
                  <Icon name="Download" size={16} />
                  Download Resume
                </a>
              </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** "Ada Lovelace" → "AL". Falls back to the first two characters. */
function initialsOf(name) {
  const cleaned = name.replace(/[[\]]/g, "").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  return cleaned.slice(0, 2).toUpperCase();
}
