import { CheckCircle2, Inbox, ListChecks } from "lucide-react";

const MESSAGES = {
  all: {
    icon: Inbox,
    title: "Belum ada tugas",
    description: "Tambahkan tugas pertamamu di kolom atas.",
  },
  active: {
    icon: CheckCircle2,
    title: "Semua beres",
    description: "Tidak ada tugas yang tersisa.",
  },
  completed: {
    icon: ListChecks,
    title: "Belum ada yang selesai",
    description: "Tugas yang kamu tandai selesai akan muncul di sini.",
  },
};

/**
 * EmptyState — quiet, directive placeholder.
 * The variant is chosen by the active `filter` prop.
 */
export default function EmptyState({ filter }) {
  const { icon: Icon, title, description } = MESSAGES[filter] ?? MESSAGES.all;

  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center animate-fade-in motion-reduce:animate-none">
      <Icon className="size-7 text-zinc-300 dark:text-zinc-600" aria-hidden="true" />
      <p className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-200">
        {title}
      </p>
      <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">{description}</p>
    </div>
  );
}
