import { FILTERS } from "../constants.js";

/**
 * TodoFilter — minimal underline tabs that also act as the list header.
 * `current`, `onChange`, and `counts` come via props.
 */
export default function TodoFilter({ current, onChange, counts }) {
  return (
    <div
      role="tablist"
      aria-label="Filter tugas"
      className="mt-4 flex gap-1 border-b border-zinc-200 px-5 sm:px-6 dark:border-zinc-800"
    >
      {Object.values(FILTERS).map((filter) => {
        const isActive = current === filter.value;
        return (
          <button
            key={filter.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter.value)}
            className={`-mb-px flex items-center gap-1.5 border-b-2 px-2.5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-900 ${
              isActive
                ? "border-zinc-900 text-zinc-900 dark:border-white dark:text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            }`}
          >
            {filter.label}
            <span className="font-mono text-[11px] tabular-nums text-zinc-400 dark:text-zinc-500">
              {counts[filter.value]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
