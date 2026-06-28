import { useState } from "react";
import { CalendarPlus, Flag, Plus, X } from "lucide-react";
import { PRIORITIES, PRIORITY_ORDER } from "../constants.js";

/**
 * TodoForm — create a task with text, a priority, and an optional due date.
 * `onAdd` and `inputRef` come from props (inputRef lets "/" focus the field).
 */
export default function TodoForm({ onAdd, inputRef }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [due, setDue] = useState("");
  const [showDue, setShowDue] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = text.trim();
    if (trimmed === "") return;

    onAdd(trimmed, priority, due || null);
    setText("");
    setPriority("medium");
    setDue("");
    setShowDue(false);
  }

  function clearDue() {
    setDue("");
    setShowDue(false);
  }

  return (
    <form onSubmit={handleSubmit} className="px-5 pt-4 sm:px-6">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Tambah tugas…"
          aria-label="Teks tugas baru"
          maxLength={140}
          className="w-full flex-1 rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-white/5"
        />
        <button
          type="submit"
          disabled={text.trim() === ""}
          aria-label="Tambah tugas"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white transition-colors hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-900"
        >
          <Plus className="size-5" aria-hidden="true" />
        </button>
      </div>

      {/* Baris meta: prioritas + tenggat */}
      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-1.5">
          <Flag className="size-3.5 text-zinc-300 dark:text-zinc-600" aria-hidden="true" />
          <div className="flex gap-0.5">
            {PRIORITY_ORDER.map((key) => {
              const config = PRIORITIES[key];
              const isActive = priority === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPriority(key)}
                  aria-pressed={isActive}
                  className={`rounded-md px-2 py-0.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                      : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                  }`}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {showDue || due ? (
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={due}
              onChange={(event) => setDue(event.target.value)}
              aria-label="Tenggat tugas"
              className="rounded-md border border-zinc-200 bg-white px-2 py-1 font-mono text-xs text-zinc-600 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            />
            <button
              type="button"
              onClick={clearDue}
              aria-label="Hapus tenggat"
              className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowDue(true)}
            className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <CalendarPlus className="size-3.5" aria-hidden="true" />
            Tenggat
          </button>
        )}
      </div>
    </form>
  );
}
