import { Moon, Sun } from "lucide-react";

/**
 * ThemeToggle — minimal light/dark switch.
 * Theme value and toggle handler arrive via props.
 */
export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? "Mode terang" : "Mode gelap"}
      title={isDark ? "Mode terang" : "Mode gelap"}
      className="relative inline-flex size-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950"
    >
      <Sun
        className={`size-[18px] transition-all duration-300 motion-reduce:transition-none ${
          isDark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
        aria-hidden="true"
      />
      <Moon
        className={`absolute size-[18px] transition-all duration-300 motion-reduce:transition-none ${
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"
        }`}
        aria-hidden="true"
      />
    </button>
  );
}
