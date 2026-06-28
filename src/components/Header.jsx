import { Check, Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle.jsx";

// Detect the right modifier symbol for the keyboard hint.
const MOD_KEY =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent)
    ? "⌘"
    : "Ctrl";

/**
 * Header — wordmark + command palette trigger + theme toggle.
 * `theme`, `onToggleTheme`, and `onOpenPalette` come from props.
 */
export default function Header({ theme, onToggleTheme, onOpenPalette }) {
  return (
    <header className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-lg bg-zinc-900 dark:bg-white">
          <Check
            className="size-5 text-white dark:text-zinc-900"
            strokeWidth={2.75}
            aria-hidden="true"
          />
        </span>
        <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
          Tuntas
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Desktop: tombol cari dengan hint shortcut */}
        <button
          type="button"
          onClick={onOpenPalette}
          className="hidden items-center gap-2 rounded-lg border border-zinc-200 py-1.5 pl-2.5 pr-1.5 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 sm:inline-flex dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950"
        >
          <Search className="size-3.5" aria-hidden="true" />
          <span>Cari</span>
          <kbd className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] font-medium text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500">
            {MOD_KEY}K
          </kbd>
        </button>

        {/* Mobile: ikon cari */}
        <button
          type="button"
          onClick={onOpenPalette}
          aria-label="Cari perintah atau tugas"
          className="inline-flex size-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 sm:hidden dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950"
        >
          <Search className="size-[18px]" aria-hidden="true" />
        </button>

        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
