// Priority config. Color is reserved for meaning, not decoration:
// high = urgent (rose), medium = amber, low = neutral (no real color).
export const PRIORITIES = {
  low: { value: "low", label: "Rendah", rank: 0, flag: "text-zinc-300 dark:text-zinc-600" },
  medium: { value: "medium", label: "Sedang", rank: 1, flag: "text-amber-500" },
  high: { value: "high", label: "Tinggi", rank: 2, flag: "text-rose-500" },
};

// Order used when cycling priority by clicking the flag.
export const PRIORITY_CYCLE = ["low", "medium", "high"];

// Order used in the form's priority selector.
export const PRIORITY_ORDER = ["high", "medium", "low"];

export const FILTERS = {
  all: { value: "all", label: "Semua" },
  active: { value: "active", label: "Aktif" },
  completed: { value: "completed", label: "Selesai" },
};
