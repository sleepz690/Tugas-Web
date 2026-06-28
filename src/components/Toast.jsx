import { Undo2, X } from "lucide-react";

/**
 * Toast — a single undo notification.
 * Renders only when `data` is provided. Handlers come via props.
 */
export default function Toast({ data, onUndo, onDismiss }) {
  if (!data) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl bg-zinc-900 py-2 pl-4 pr-2 shadow-lg shadow-zinc-900/20 animate-slide-up motion-reduce:animate-none dark:bg-zinc-100">
        <span className="text-sm text-white dark:text-zinc-900">{data.label}</span>
        <button
          type="button"
          onClick={onUndo}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-sm font-medium text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white dark:bg-zinc-900/10 dark:text-zinc-900 dark:hover:bg-zinc-900/20 dark:focus-visible:ring-zinc-900"
        >
          <Undo2 className="size-3.5" aria-hidden="true" />
          Urungkan
        </button>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Tutup"
          className="flex size-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white dark:hover:bg-zinc-900/10 dark:hover:text-zinc-900 dark:focus-visible:ring-zinc-900"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
