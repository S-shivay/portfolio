"use client";

import { useDeferredValue, useState } from "react";

import {
  CertificateFilters,
  CertificateSearch,
} from "@/components/certificates/CertificateFilters";
import { CertificateGrid } from "@/components/certificates/CertificateGrid";
import { CertificateEmptyState } from "@/components/certificates/CertificateEmptyState";
import { CertificateRecords } from "@/components/certificates/CertificateRecords";
import { CertificateTimeline } from "@/components/certificates/CertificateTimeline";
import { CertificateViewer } from "@/components/certificates/CertificateViewer";
import { useRouteState } from "@/hooks/useRouteState";

/**
 * The interactive half of the section: filtering, search, the grid, the
 * timeline and the viewer, sharing one piece of state.
 *
 * It receives certificates already normalised on the server. Its first render
 * (everything, no filter) is exactly what the server sent as HTML, so the grid
 * is fully readable before any JavaScript runs.
 */
export function CertificateExplorer({ certificates }) {
  const [category, setCategory] = useRouteState("certificates-category", "all");
  const [query, setQuery] = useRouteState("certificates-query", "");
  const [viewer, setViewer] = useState(null);

  // Typing stays responsive: the grid re-filters at the input's pace, not
  // on every keystroke's critical path.
  const deferredQuery = useDeferredValue(query);

  const categories = countCategories(certificates);
  const terms = tokenize(deferredQuery);
  const visible = certificates.filter(
    (certificate) =>
      (category === "all" || certificate.category === category) &&
      matches(certificate, terms),
  );

  /* Documents and records are shown differently. A certificate with its file
     earns a card with the document on it; one known only from the CV gets a
     line in a list, rather than a card-sized empty frame that would sit among
     the real documents looking like a missing one. */
  const documents = visible.filter((item) => item.document);
  const records = visible.filter((item) => !item.document);

  const filtered = visible.length !== certificates.length;

  const clear = () => {
    setCategory("all");
    setQuery("");
  };

  /* The viewer steps through what the visitor is currently looking at: the
     filtered grid, in grid order. Opened from the timeline for a certificate
     the filters are hiding, it steps through every certificate instead of
     through a list that doesn't contain the one on screen. */
  const open = (id) => {
    const inView = visible.filter((item) => item.document);
    const sequence = inView.some((item) => item.id === id)
      ? inView
      : certificates.filter((item) => item.document);

    setViewer({
      ids: sequence.map((item) => item.id),
      index: sequence.findIndex((item) => item.id === id),
    });
  };

  const viewerItems = viewer
    ? viewer.ids.map((id) => certificates.find((item) => item.id === id))
    : [];

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <CertificateFilters
          categories={categories}
          active={category}
          total={certificates.length}
          onChange={setCategory}
        />
        <CertificateSearch value={query} onChange={setQuery} />
      </div>

      <p
        role="status"
        className={filtered ? "label-mono mt-5 text-faint" : "sr-only"}
      >
        {filtered
          ? `Showing ${visible.length} of ${certificates.length}`
          : `${certificates.length} certificates`}
      </p>

      <div className="mt-6">
        {visible.length === 0 && (
          <CertificateEmptyState query={deferredQuery.trim()} onClear={clear} />
        )}
        {documents.length > 0 && (
          <CertificateGrid items={documents} onOpen={open} />
        )}
        {records.length > 0 && (
          <CertificateRecords
            items={records}
            className={documents.length > 0 ? "mt-10 sm:mt-12" : undefined}
          />
        )}
      </div>

      <CertificateTimeline certificates={certificates} onOpen={open} />

      <CertificateViewer
        items={viewerItems}
        index={viewer?.index ?? 0}
        open={viewer !== null}
        onIndexChange={(index) =>
          setViewer((current) => (current ? { ...current, index } : current))
        }
        onClose={() => setViewer(null)}
      />
    </>
  );
}

function countCategories(list) {
  const counts = new Map();
  for (const item of list) {
    if (!item.category) continue;
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function tokenize(query) {
  return fold(query).split(/\s+/).filter(Boolean);
}

function matches(certificate, terms) {
  if (terms.length === 0) return true;
  const haystack = fold(
    [
      certificate.title,
      certificate.issuer,
      certificate.category,
      certificate.credentialId,
      ...certificate.skills,
    ]
      .filter(Boolean)
      .join(" "),
  );
  return terms.every((term) => haystack.includes(term));
}

/* Case- and accent-insensitive, so "resume" finds "Résumé". */
function fold(text) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}
