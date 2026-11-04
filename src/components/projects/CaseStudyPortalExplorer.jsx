"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";

const normalize = (item) => (typeof item === "string" ? { name: item } : item);

/** The company features anywhere in a menu, in the order they first appear. */
function flagsIn(menu, found = []) {
  for (const raw of menu) {
    const item = normalize(raw);
    if (item.flag && !found.includes(item.flag)) found.push(item.flag);
    if (item.items) flagsIn(item.items, found);
  }
  return found;
}

function ItemLabel({ item }) {
  return (
    <>
      {item.name}
      {item.adminLevel && <span className="text-faint"> · admin level</span>}
    </>
  );
}

/**
 * Each portal's real sidebar. Pick a role to see its menu, switch a company
 * feature off and the items behind it go, just as the app builds its sidebars
 * from the company settings.
 *
 * The list keeps a fixed height, so switching roles never moves the page, and its
 * first role is server-rendered, so it reads as a menu without JavaScript.
 */
export function CaseStudyPortalExplorer({ roles, flags }) {
  const [roleId, setRoleId] = useState(roles[0].id);
  const [off, setOff] = useState([]);

  const role = roles.find((candidate) => candidate.id === roleId);
  const visible = (item) => !(item.flag && off.includes(item.flag));

  const menu = role.menu
    .map(normalize)
    .filter(visible)
    .map((item) =>
      item.items ? { ...item, items: item.items.map(normalize).filter(visible) } : item,
    );
  const screens = menu.reduce((sum, item) => sum + (item.items ? item.items.length : 1), 0);
  const usedFlags = flagsIn(role.menu);

  const toggleFlag = (flag) => {
    setOff((value) =>
      value.includes(flag) ? value.filter((item) => item !== flag) : [...value, flag],
    );
  };

  return (
    <div className="overflow-hidden rounded-md border border-line bg-surface-1 shadow-e2">
      <div role="group" aria-label="Choose a role" className="flex flex-wrap gap-1.5 border-b border-line bg-surface-2/60 p-3">
        {roles.map((candidate) => (
          <button
            key={candidate.id}
            type="button"
            aria-pressed={candidate.id === roleId}
            onClick={() => setRoleId(candidate.id)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-200",
              candidate.id === roleId
                ? "border-transparent bg-accent text-accent-fg"
                : "border-line bg-surface-1 text-text hover:border-line-accent hover:bg-accent-soft",
            )}
          >
            {candidate.name}
          </button>
        ))}
      </div>

      <div className="border-b border-line p-5">
        <p className="text-[0.9375rem] leading-relaxed text-muted measure">{role.description}</p>
        <div className="mt-4 flex min-h-8 flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          {usedFlags.length === 0 ? (
            <span className="text-faint">No company feature flags affect this menu.</span>
          ) : (
            <>
              <span className="text-faint">Company features:</span>
              {usedFlags.map((flag) => (
                <label key={flag} className="flex cursor-pointer items-center gap-2 text-text">
                  <input
                    type="checkbox"
                    checked={!off.includes(flag)}
                    onChange={() => toggleFlag(flag)}
                    className="size-4 shrink-0 accent-[var(--accent)]"
                  />
                  {flags[flag]}
                </label>
              ))}
            </>
          )}
        </div>
      </div>

      {/* The scroll box is a separate element from the columns: given a height of
          its own, a multi-column list adds columns sideways instead of scrolling. */}
      <div
        role="region"
        aria-label={`${role.name} menu`}
        data-lenis-prevent=""
        tabIndex={0}
        className="h-[26rem] overflow-y-auto overscroll-contain p-5"
      >
        <ul className="text-sm sm:columns-2 sm:gap-8">
          {menu.map((item) => (
            <li key={item.name} className="break-inside-avoid py-1 text-text">
              {item.items ? (
                <>
                  <span className="font-medium">
                    <ItemLabel item={item} />
                  </span>
                  <ul className="mb-1 mt-1 border-l border-line pl-3 text-muted">
                    {item.items.map((sub) => (
                      <li key={sub.name} className="py-0.5">
                        <ItemLabel item={sub} />
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <ItemLabel item={item} />
              )}
            </li>
          ))}
        </ul>
      </div>

      <p aria-live="polite" className="label-mono border-t border-line bg-surface-2/60 px-5 py-3 text-faint tabular-nums">
        {screens} screens in this menu
      </p>
    </div>
  );
}
