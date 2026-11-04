"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";

const RECENT_LIMIT = 5;
const HINT =
  "Use the arrow keys and Enter, or click a command. Recently used commands move to the top.";

/**
 * A working copy of Job24's command palette, sitting in the page rather than
 * floating over it. Ctrl K is left to the site's own palette, and the theme
 * command reports what it does in the app rather than repainting this page.
 *
 * The list keeps a fixed height, so ticking a permission never moves the page.
 * Everything renders on the server, so without JavaScript it is still a readable
 * list of the commands.
 */
export function CaseStudyCommandDemo({ keys, presets, commands }) {
  const [held, setHeld] = useState(keys);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [recents, setRecents] = useState([]);
  const [output, setOutput] = useState(HINT);
  const listRef = useRef(null);

  const allowed = commands.filter(
    (command) =>
      (!command.superAdminOnly || held.includes("SUPER_ADMIN")) &&
      (!command.permission || held.includes(command.permission)),
  );

  const term = query.trim().toLowerCase();
  let results;
  if (term) {
    results = allowed.filter(
      (command) =>
        command.label.toLowerCase().includes(term) ||
        command.group.toLowerCase().includes(term) ||
        command.keywords.includes(term),
    );
  } else {
    const recent = recents
      .map((id) => allowed.find((command) => command.id === id))
      .filter(Boolean);
    results = [...recent, ...allowed.filter((command) => !recent.includes(command))];
  }

  const current = active < results.length ? active : 0;

  const applyPreset = (preset) => {
    setHeld(preset.keys ?? keys);
    setActive(0);
  };

  const toggleKey = (key) => {
    setHeld((value) =>
      value.includes(key) ? value.filter((item) => item !== key) : [...value, key],
    );
    setActive(0);
  };

  const run = (command) => {
    setRecents((value) =>
      [command.id, ...value.filter((id) => id !== command.id)].slice(0, RECENT_LIMIT),
    );
    setOutput(
      command.theme
        ? "In the app, this switches between the light and dark themes."
        : `In the app, this opens ${command.route}`,
    );
    setQuery("");
    setActive(0);
  };

  /* Moves the list's own scroll only: scrollIntoView would also move the page. */
  const moveTo = (index) => {
    setActive(index);
    const list = listRef.current;
    const row = list?.children[index];
    if (!row) return;
    if (row.offsetTop < list.scrollTop) {
      list.scrollTop = row.offsetTop;
    } else if (row.offsetTop + row.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = row.offsetTop + row.offsetHeight - list.clientHeight;
    }
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      setQuery("");
      setActive(0);
      return;
    }
    if (results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveTo((current + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveTo((current - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(results[current]);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
      <fieldset className="rounded-md border border-line bg-surface-1 p-5">
        <legend className="sr-only">Permissions the signed-in user holds</legend>
        <p aria-hidden="true" className="label-mono text-faint">
          Signed-in user holds
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              className="rounded-full border border-line bg-surface-2 px-3 py-1.5 text-xs text-text transition-colors duration-200 hover:border-line-accent hover:bg-accent-soft"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-1 border-t border-line pt-3">
          {keys.map((key) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2.5 rounded-sm py-1.5 font-mono text-xs text-muted transition-colors duration-200 hover:text-text"
            >
              <input
                type="checkbox"
                checked={held.includes(key)}
                onChange={() => toggleKey(key)}
                className="size-4 shrink-0 accent-[var(--accent)]"
              />
              <span className="min-w-0 [overflow-wrap:anywhere]">{key}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex min-w-0 flex-col overflow-hidden rounded-md border border-line bg-surface-1 shadow-e2">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Icon name="Search" size={16} className="shrink-0 text-faint" />
          <input
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            autoComplete="off"
            placeholder="Search pages and actions"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-demo-list"
            aria-activedescendant={
              results.length > 0 ? `command-demo-${results[current].id}` : undefined
            }
            aria-label="Search commands"
            className="h-12 min-w-0 flex-1 bg-transparent text-[0.9375rem] text-text outline-none placeholder:text-faint"
          />
          <kbd className="label-mono hidden shrink-0 rounded-sm border border-line bg-surface-2 px-1.5 py-0.5 text-faint sm:block">
            Ctrl K
          </kbd>
        </div>

        <ul
          ref={listRef}
          id="command-demo-list"
          role="listbox"
          aria-label="Commands"
          data-lenis-prevent=""
          className="relative h-80 overflow-y-auto overscroll-contain p-2"
        >
          {results.length === 0 && (
            <li className="flex h-full items-center justify-center px-4 text-center text-sm text-muted">
              {term
                ? "No commands match. Try “talent” or “theme”."
                : "No commands available."}
            </li>
          )}
          {results.map((command, i) => (
            <li
              key={command.id}
              id={`command-demo-${command.id}`}
              role="option"
              aria-selected={i === current}
              onMouseEnter={() => setActive(i)}
              onClick={() => run(command)}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors duration-150",
                i === current ? "bg-accent-soft text-text" : "text-muted",
              )}
            >
              <Icon
                name={command.icon}
                size={16}
                className={cn("shrink-0", i === current ? "text-accent-ink" : "text-faint")}
              />
              <span className="min-w-0 flex-1 truncate">{command.label}</span>
              <small className="label-mono shrink-0 text-faint">
                {recents.includes(command.id) && !term ? "Recent" : command.group}
              </small>
            </li>
          ))}
        </ul>

        <p
          aria-live="polite"
          className="border-t border-line bg-surface-2/60 px-4 py-3 text-sm text-muted [overflow-wrap:anywhere]"
        >
          {output}
        </p>
      </div>
    </div>
  );
}
