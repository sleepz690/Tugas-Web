/**
 * Overview — a restrained summary line plus a thin progress bar.
 * Replaces the old "big number" stats block. Values come via props.
 */
export default function Overview({ total, active, completed }) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <section className="px-5 pt-5 sm:px-6">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
          <span className="text-sm font-medium text-zinc-900 tabular-nums dark:text-zinc-100">
            {active}
          </span>{" "}
          tersisa
        </p>
        <p className="font-mono text-xs text-zinc-400 tabular-nums dark:text-zinc-500">
          {completed}/{total} · {percent}%
        </p>
      </div>

      <progress
        value={completed}
        max={total === 0 ? 1 : total}
        className="mt-2.5 h-1.5 w-full appearance-none overflow-hidden rounded-full border-0 bg-zinc-100 dark:bg-zinc-800 [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-emerald-500 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-zinc-100 dark:[&::-webkit-progress-bar]:bg-zinc-800 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-emerald-500 [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500"
      >
        {percent}%
      </progress>
    </section>
  );
}
