import { useEffect, useMemo, useRef, useState } from "react";
import { CornerDownLeft, Search } from "lucide-react";

/**
 * CommandPalette — a ⌘K overlay for quick commands and task search.
 * Receives `open`, `onClose`, the `commands` list, the `todos` (for search),
 * and `onToggleTask` via props. Keyboard: ↑/↓ to move, Enter to run, Esc to close.
 */
export default function CommandPalette({ open, onClose, commands, todos, onToggleTask }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Reset and focus when the palette opens.
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setIndex(0);
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    const matchedCommands = (q === ""
      ? commands
      : commands.filter((c) => c.label.toLowerCase().includes(q))
    ).map((c) => ({ kind: "command", id: `c-${c.id}`, command: c }));

    const matchedTasks =
      q === ""
        ? []
        : todos
            .filter((t) => t.text.toLowerCase().includes(q))
            .slice(0, 6)
            .map((t) => ({ kind: "task", id: `t-${t.id}`, todo: t }));

    return [...matchedCommands, ...matchedTasks];
  }, [q, commands, todos]);

  // Keep the selection in range as results change.
  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, results.length - 1)));
  }, [results.length]);

  // Scroll the active row into view.
  useEffect(() => {
    const node = listRef.current?.querySelector(`[data-row="${index}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [index]);

  function runResult(item) {
    if (!item) return;
    if (item.kind === "command") {
      item.command.run();
    } else {
      onToggleTask(item.todo.id);
      onClose();
    }
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      runResult(results[index]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Perintah cepat"
    >
      <div
        className="absolute inset-0 bg-zinc-900/30 backdrop-blur-sm animate-fade-in motion-reduce:animate-none dark:bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 mt-[14vh] w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10 animate-scale-in motion-reduce:animate-none dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/40">
        <div className="flex items-center gap-2.5 border-b border-zinc-100 px-4 dark:border-zinc-800">
          <Search className="size-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Cari perintah atau tugas…"
            aria-label="Cari perintah atau tugas"
            className="w-full bg-transparent py-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-white dark:placeholder:text-zinc-500"
          />
          <kbd className="hidden shrink-0 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 sm:block dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500">
            Esc
          </kbd>
        </div>

        <ul ref={listRef} className="max-h-[min(60vh,20rem)] overflow-y-auto p-1.5">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-zinc-400 dark:text-zinc-500">
              Tidak ada hasil
            </li>
          ) : (
            results.map((item, i) => {
              const selected = i === index;
              return (
                <li key={item.id} data-row={i}>
                  <button
                    type="button"
                    onClick={() => runResult(item)}
                    onMouseMove={() => setIndex(i)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      selected
                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                        : "text-zinc-600 dark:text-zinc-300"
                    }`}
                  >
                    {item.kind === "command" ? (
                      <>
                        <item.command.icon
                          className="size-4 shrink-0 text-zinc-400 dark:text-zinc-500"
                          aria-hidden="true"
                        />
                        <span className="flex-1 truncate">{item.command.label}</span>
                        {item.command.hint && (
                          <kbd className="shrink-0 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500">
                            {item.command.hint}
                          </kbd>
                        )}
                      </>
                    ) : (
                      <>
                        <span
                          className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                            item.todo.completed
                              ? "border-emerald-500 bg-emerald-500"
                              : "border-zinc-300 dark:border-zinc-600"
                          }`}
                          aria-hidden="true"
                        />
                        <span
                          className={`flex-1 truncate ${
                            item.todo.completed
                              ? "text-zinc-400 line-through dark:text-zinc-500"
                              : ""
                          }`}
                        >
                          {item.todo.text}
                        </span>
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-zinc-300 dark:text-zinc-600">
                          tugas
                        </span>
                      </>
                    )}
                    {selected && (
                      <CornerDownLeft
                        className="size-3.5 shrink-0 text-zinc-400 dark:text-zinc-500"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
