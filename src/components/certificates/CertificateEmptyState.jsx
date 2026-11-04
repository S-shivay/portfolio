import { Icon } from "@/components/ui/Icon";

/** Shown when a search or filter matches nothing. */
export function CertificateEmptyState({ query, onClear }) {
  return (
    <div className="cert-stage flex flex-col items-center rounded-md border border-dashed border-line-strong px-6 py-16 text-center sm:py-20">
      <span className="grid size-12 place-items-center rounded-full border border-line bg-surface-1 text-faint shadow-e1">
        <Icon name="SearchX" size={20} />
      </span>

      <h3 className="mt-5 text-[1.0625rem] font-medium tracking-tight text-text">
        No certificates found
      </h3>
      <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-muted">
        {query ? (
          <>
            Nothing matches <span className="text-text">“{query}”</span>. Try
            another keyword or clear your filters.
          </>
        ) : (
          "Try another keyword or clear your filters."
        )}
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-6 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface-1 px-5 text-sm font-medium text-text transition-colors duration-200 hover:border-line-strong hover:bg-surface-2"
      >
        <Icon name="X" size={15} />
        Clear filters
      </button>
    </div>
  );
}
