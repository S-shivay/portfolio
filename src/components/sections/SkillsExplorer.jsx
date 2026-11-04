"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/cn";
import { useRouteState } from "@/hooks/useRouteState";
import { Icon } from "@/components/ui/Icon";

const isPlaceholder = (value) =>
  !value || typeof value !== "string" || value.startsWith("[");

/**
 * Interactive skills explorer.
 *
 * Accessibility notes, because this is exactly the kind of component that
 * usually ships as hover-only:
 *
 *  - Categories are a real ARIA tablist with roving tabindex and arrow-key
 *    navigation, matching the APG tabs pattern.
 *  - Each skill is a <button>. It responds to hover for pointer users AND to
 *    focus for keyboard users, so the detail panel is reachable without a
 *    mouse.
 *  - The panel is aria-live="polite", so a screen-reader user hears the
 *    description change instead of silently missing it.
 */
export function SkillsExplorer({ categories, projectIndex }) {
  const [categoryId, setCategoryId] = useRouteState("skills-category", categories[0].id);
  const [skillName, setSkillName] = useRouteState("skills-skill", categories[0].skills[0].name);
  const reduceMotion = useReducedMotion();
  const tabRefs = useRef({});

  const category = categories.find((c) => c.id === categoryId) ?? categories[0];

  const skill = useMemo(
    () =>
      category.skills.find((s) => s.name === skillName) ?? category.skills[0],
    [category, skillName],
  );

  const selectCategory = (id) => {
    const next = categories.find((c) => c.id === id);
    setCategoryId(id);
    setSkillName(next.skills[0].name);
  };

  /* APG tabs keyboard model: arrows move, Home/End jump, focus follows. */
  const onTabKeyDown = (event) => {
    const index = categories.findIndex((c) => c.id === categoryId);
    let nextIndex = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % categories.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + categories.length) % categories.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = categories.length - 1;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    const nextId = categories[nextIndex].id;
    selectCategory(nextId);
    tabRefs.current[nextId]?.focus();
  };

  return (
    <div>
      {/* Category tabs */}
      <div
        role="tablist"
        aria-label="Skill categories"
        onKeyDown={onTabKeyDown}
        className="-mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {categories.map((item) => {
          const selected = item.id === categoryId;
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[item.id] = node;
              }}
              role="tab"
              type="button"
              id={`skills-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`skills-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectCategory(item.id)}
              className={cn(
                "relative shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-4 py-2.5 text-sm transition-colors duration-200",
                selected
                  ? "border-line-accent bg-accent-soft text-text"
                  : "border-line bg-surface-1 text-muted hover:border-line-strong hover:text-text",
              )}
            >
              {item.label}
              <span className="ml-2 label-mono text-faint">
                {item.skills.length}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-sm text-muted measure">{category.description}</p>

      <div
        role="tabpanel"
        id={`skills-panel-${category.id}`}
        aria-labelledby={`skills-tab-${category.id}`}
        className="mt-8 grid gap-3 lg:grid-cols-12"
      >
        {/* Skill chips */}
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-2 lg:self-start xl:grid-cols-3">
          {category.skills.map((item) => {
            const active = item.name === skill.name;
            return (
              <li key={item.name}>
                <button
                  type="button"
                  onMouseEnter={() => setSkillName(item.name)}
                  onFocus={() => setSkillName(item.name)}
                  onClick={() => setSkillName(item.name)}
                  aria-pressed={active}
                  className={cn(
                    "flex h-full w-full cursor-pointer items-center gap-2.5 rounded-md border px-3.5 py-3 text-left text-sm transition-colors duration-200",
                    active
                      ? "border-line-accent bg-accent-soft text-text"
                      : "border-line bg-surface-1 text-muted hover:border-line-strong hover:text-text",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-1.5 shrink-0 rounded-full transition-colors duration-200",
                      active ? "bg-accent" : "bg-line-strong",
                    )}
                  />
                  <span className="min-w-0 truncate">{item.name}</span>
                  {item.primary && (
                    <Icon
                      name="Star"
                      size={12}
                      className="ml-auto shrink-0 text-accent-ink"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Detail panel */}
        <div
          aria-live="polite"
          className="relative overflow-hidden rounded-md card-accent border bg-surface-1 p-6 shadow-e1 lg:col-span-5"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 blueprint-grid opacity-60"
            style={{ "--grid-size": "32px" }}
          />

          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={skill.name}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <p className="label-mono text-faint">{category.label}</p>

              <p className="mt-3 text-h3 font-semibold tracking-tight text-text">
                {skill.name}
              </p>

              {skill.years && (
                <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-line-accent bg-accent-soft px-3 py-1.5">
                  <Icon name="Clock" size={12} className="text-accent-ink" />
                  <span className="label-mono text-accent-ink">
                    {skill.years}
                  </span>
                </p>
              )}

              <p className="mt-5 text-sm leading-relaxed text-muted">
                {skill.note}
              </p>

              {skill.projects?.length > 0 && (
                <div className="mt-6 border-t border-line pt-5">
                  <p className="label-mono mb-3 text-faint">Used in</p>
                  <ul className="flex flex-col gap-2">
                    {skill.projects.map((slug) => {
                      const project = projectIndex[slug];
                      if (!project) return null;
                      return (
                        <li key={slug}>
                          <Link
                            href={`/work/${slug}`}
                            transitionTypes={["nav-forward"]}
                            data-cursor="link"
                            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-200 hover:text-text"
                          >
                            {isPlaceholder(project.name)
                              ? project.name
                              : project.name}
                            <Icon
                              name="ArrowUpRight"
                              size={13}
                              className="text-faint"
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
