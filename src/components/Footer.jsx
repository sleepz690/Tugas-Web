import { CheckCheck, Eraser } from "lucide-react";

/**
 * Footer — summary line plus bulk actions.
 * All counts and handlers come from props.
 */
export default function Footer({
  total,
  active,
  completed,
  onToggleAll,
  onClearCompleted,
}) {
  if (total === 0) return null;

  const allCompleted = active === 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 px-5 py-3 sm:px-6 dark:border-zinc-800">
      <p className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
        <span className="text-zinc-700 tabular-nums dark:text-zinc-200">
          {active}
        </span>{" "}
        tersisa
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onToggleAll}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 dark:focus-visible:ring-zinc-100"
        >
          <CheckCheck className="size-3.5" aria-hidden="true" />
          {allCompleted ? "Batalkan semua" : "Tandai semua"}
        </button>

        <button
          type="button"
          onClick={onClearCompleted}
          disabled={completed === 0}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:cursor-not-allowed disabled:text-zinc-300 disabled:hover:bg-transparent disabled:hover:text-zinc-300 dark:text-zinc-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 dark:disabled:text-zinc-600"
        >
          <Eraser className="size-3.5" aria-hidden="true" />
          Hapus selesai
        </button>
      </div>
    </div>
  );
}
