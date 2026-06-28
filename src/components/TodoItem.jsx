import { useEffect, useRef, useState } from "react";
import { CalendarClock, Check, Flag, Pencil, Trash2, X } from "lucide-react";
import { PRIORITIES, PRIORITY_CYCLE } from "../constants.js";

// Build a short Indonesian due-date label + urgency tone.
function getDueInfo(dueDate, completed) {
  if (!dueDate) return null;

  const [year, month, day] = dueDate.split("-").map(Number);
  const due = new Date(year, month - 1, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((due - today) / 86400000);
  const short = due.toLocaleDateString("id-ID", { day: "numeric", month: "short" });

  if (completed) return { label: short, tone: "text-zinc-400 dark:text-zinc-500" };
  if (diffDays < 0) return { label: "Terlambat", tone: "text-rose-600 dark:text-rose-400" };
  if (diffDays === 0) return { label: "Hari ini", tone: "text-amber-600 dark:text-amber-400" };
  if (diffDays === 1) return { label: "Besok", tone: "text-zinc-500 dark:text-zinc-400" };
  if (diffDays < 7) return { label: `${diffDays} hari lagi`, tone: "text-zinc-500 dark:text-zinc-400" };
  return { label: short, tone: "text-zinc-400 dark:text-zinc-500" };
}

/**
 * TodoItem — a single task row.
 * Receives the `todo` plus handlers (onToggle, onUpdate, onDelete) via props.
 * Holds only local UI state for inline editing.
 */
export default function TodoItem({ todo, onToggle, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(todo.text);
  const [draftDue, setDraftDue] = useState(todo.dueDate ?? "");
  const inputRef = useRef(null);

  const priority = PRIORITIES[todo.priority] ?? PRIORITIES.medium;
  const dueInfo = getDueInfo(todo.dueDate, todo.completed);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  function startEditing() {
    setDraftText(todo.text);
    setDraftDue(todo.dueDate ?? "");
    setIsEditing(true);
  }

  function saveEditing() {
    const trimmed = draftText.trim();
    if (trimmed === "") {
      cancelEditing();
      return;
    }
    onUpdate(todo.id, { text: trimmed, dueDate: draftDue || null });
    setIsEditing(false);
  }

  function cancelEditing() {
    setIsEditing(false);
    setDraftText(todo.text);
    setDraftDue(todo.dueDate ?? "");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      saveEditing();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancelEditing();
    }
  }

  function cyclePriority() {
    const current = PRIORITY_CYCLE.indexOf(todo.priority);
    const next = PRIORITY_CYCLE[(current + 1) % PRIORITY_CYCLE.length];
    onUpdate(todo.id, { priority: next });
  }

  return (
    <li className="group flex items-center gap-3 px-5 py-2.5 transition-colors animate-fade-up hover:bg-zinc-50 motion-reduce:animate-none sm:px-6 dark:hover:bg-zinc-800/40">
      {/* Checkbox */}
      <button
        type="button"
        role="checkbox"
        aria-checked={todo.completed}
        aria-label={todo.completed ? "Tandai belum selesai" : "Tandai selesai"}
        onClick={() => onToggle(todo.id)}
        className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-90 dark:focus-visible:ring-offset-zinc-900 ${
          todo.completed
            ? "border-emerald-500 bg-emerald-500"
            : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-600 dark:hover:border-zinc-500"
        }`}
      >
        <Check
          className={`size-3 text-white transition-all duration-200 motion-reduce:transition-none ${
            todo.completed ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
          strokeWidth={3}
          aria-hidden="true"
        />
      </button>

      {isEditing ? (
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={draftText}
            maxLength={140}
            onChange={(event) => setDraftText(event.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Ubah teks tugas"
            className="min-w-0 flex-1 rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white dark:focus:ring-white/5"
          />
          <input
            type="date"
            value={draftDue}
            onChange={(event) => setDraftDue(event.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Ubah tenggat"
            className="hidden shrink-0 rounded-md border border-zinc-300 bg-white px-2 py-1.5 font-mono text-xs text-zinc-600 focus:border-zinc-500 focus:outline-none sm:block dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300"
          />
          <button
            type="button"
            onClick={saveEditing}
            aria-label="Simpan"
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-emerald-600 transition-colors hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
          >
            <Check className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={cancelEditing}
            aria-label="Batalkan"
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={cyclePriority}
                title={`Prioritas: ${priority.label} — klik untuk mengubah`}
                aria-label={`Prioritas ${priority.label}, klik untuk mengubah`}
                className="shrink-0 rounded p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
              >
                <Flag
                  className={`size-3.5 ${priority.flag}`}
                  fill={todo.priority === "low" ? "none" : "currentColor"}
                  aria-hidden="true"
                />
              </button>
              <p
                onDoubleClick={startEditing}
                title={todo.text}
                className={`truncate text-sm transition-colors ${
                  todo.completed
                    ? "text-zinc-400 line-through dark:text-zinc-500"
                    : "text-zinc-800 dark:text-zinc-100"
                }`}
              >
                {todo.text}
              </p>
            </div>
            {dueInfo && (
              <div className="mt-0.5 flex items-center gap-1 pl-[22px]">
                <CalendarClock className={`size-3 ${dueInfo.tone}`} aria-hidden="true" />
                <span className={`font-mono text-[11px] ${dueInfo.tone}`}>
                  {dueInfo.label}
                </span>
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={startEditing}
              aria-label="Edit tugas"
              className="flex size-8 items-center justify-center rounded-md text-zinc-400 opacity-0 transition-all hover:bg-zinc-100 hover:text-zinc-700 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 group-hover:opacity-100 max-sm:opacity-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 dark:focus-visible:ring-zinc-100"
            >
              <Pencil className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(todo.id)}
              aria-label="Hapus tugas"
              className="flex size-8 items-center justify-center rounded-md text-zinc-400 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-600 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 group-hover:opacity-100 max-sm:opacity-100 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </div>
        </>
      )}
    </li>
  );
}
