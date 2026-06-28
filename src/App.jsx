import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCheck,
  CheckCircle2,
  Circle,
  Eraser,
  List,
  Moon,
  Plus,
  Sun,
} from "lucide-react";
import Header from "./components/Header.jsx";
import Overview from "./components/Overview.jsx";
import TodoForm from "./components/TodoForm.jsx";
import TodoFilter from "./components/TodoFilter.jsx";
import TodoList from "./components/TodoList.jsx";
import Footer from "./components/Footer.jsx";
import CommandPalette from "./components/CommandPalette.jsx";
import Toast from "./components/Toast.jsx";
import { usePersistentState } from "./hooks/useLocalStorage.js";

const UNDO_TIMEOUT = 5000;

// Unique id with a safe fallback for older environments.
function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Initial theme from the OS preference (only used on first visit).
function getInitialTheme() {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
}

export default function App() {
  // --- State ---
  const [todos, setTodos] = usePersistentState("tuntas.todos", []);
  const [theme, setTheme] = usePersistentState("tuntas.theme", getInitialTheme);
  const [filter, setFilter] = useState("all");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [pendingUndo, setPendingUndo] = useState(null);

  const addInputRef = useRef(null);
  const undoTimerRef = useRef(null);
  const lastFocusRef = useRef(null);

  // --- Derived data ---
  const activeCount = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos]
  );
  const completedCount = todos.length - activeCount;

  const visibleTodos = useMemo(() => {
    const base =
      filter === "active"
        ? todos.filter((t) => !t.completed)
        : filter === "completed"
        ? todos.filter((t) => t.completed)
        : todos;
    // Completed tasks sink to the bottom (sort is stable).
    return [...base].sort((a, b) => Number(a.completed) - Number(b.completed));
  }, [todos, filter]);

  // --- Effects ---

  // Update page title when the active count changes.
  useEffect(() => {
    document.title = activeCount > 0 ? `(${activeCount}) Tuntas` : "Tuntas";
  }, [activeCount]);

  // Apply the theme class to <html>.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  // Clear any pending undo timer on unmount.
  useEffect(() => () => clearTimeout(undoTimerRef.current), []);

  // Global keyboard shortcuts: ⌘K / Ctrl+K opens the palette, "/" focuses input.
  useEffect(() => {
    function onKeyDown(event) {
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && key === "k") {
        event.preventDefault();
        if (paletteOpen) closePalette();
        else openPalette();
        return;
      }
      if (key === "/" && !paletteOpen) {
        const target = event.target;
        const tag = (target.tagName || "").toLowerCase();
        if (tag !== "input" && tag !== "textarea" && !target.isContentEditable) {
          event.preventDefault();
          addInputRef.current?.focus();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paletteOpen]);

  // --- Palette helpers ---
  function openPalette() {
    lastFocusRef.current = document.activeElement;
    setPaletteOpen(true);
  }
  function closePalette() {
    setPaletteOpen(false);
    const el = lastFocusRef.current;
    if (el && typeof el.focus === "function") {
      requestAnimationFrame(() => el.focus());
    }
  }

  // --- Undo helpers ---
  function queueUndo(items, label) {
    clearTimeout(undoTimerRef.current);
    setPendingUndo({ items, label });
    undoTimerRef.current = setTimeout(() => setPendingUndo(null), UNDO_TIMEOUT);
  }
  function clearUndo() {
    clearTimeout(undoTimerRef.current);
    setPendingUndo(null);
  }
  function undo() {
    if (!pendingUndo) return;
    const items = [...pendingUndo.items].sort((a, b) => a.index - b.index);
    setTodos((prev) => {
      const next = [...prev];
      for (const { todo, index } of items) {
        next.splice(Math.min(index, next.length), 0, todo);
      }
      return next;
    });
    clearUndo();
  }

  // --- Task handlers ---
  function addTodo(text, priority, dueDate) {
    const newTodo = {
      id: createId(),
      text,
      priority,
      dueDate: dueDate ?? null,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  }

  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function updateTodo(id, updates) {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
    );
  }

  function deleteTodo(id) {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index < 0) return;
    const removed = todos[index];
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    queueUndo([{ todo: removed, index }], "Tugas dihapus");
  }

  function clearCompleted() {
    const removed = [];
    todos.forEach((todo, index) => {
      if (todo.completed) removed.push({ todo, index });
    });
    if (removed.length === 0) return;
    setTodos((prev) => prev.filter((todo) => !todo.completed));
    queueUndo(removed, `${removed.length} tugas selesai dihapus`);
  }

  function toggleAll() {
    const shouldCompleteAll = activeCount > 0;
    setTodos((prev) =>
      prev.map((todo) => ({ ...todo, completed: shouldCompleteAll }))
    );
  }

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  // --- Commands for the palette ---
  const commands = [
    {
      id: "add",
      label: "Tambah tugas baru",
      hint: "/",
      icon: Plus,
      run: () => {
        setPaletteOpen(false);
        requestAnimationFrame(() => addInputRef.current?.focus());
      },
    },
    {
      id: "filter-all",
      label: "Tampilkan: Semua",
      icon: List,
      run: () => {
        setFilter("all");
        closePalette();
      },
    },
    {
      id: "filter-active",
      label: "Tampilkan: Aktif",
      icon: Circle,
      run: () => {
        setFilter("active");
        closePalette();
      },
    },
    {
      id: "filter-completed",
      label: "Tampilkan: Selesai",
      icon: CheckCircle2,
      run: () => {
        setFilter("completed");
        closePalette();
      },
    },
    {
      id: "toggle-all",
      label: activeCount > 0 ? "Tandai semua selesai" : "Batalkan semua",
      icon: CheckCheck,
      run: () => {
        toggleAll();
        closePalette();
      },
    },
    ...(completedCount > 0
      ? [
          {
            id: "clear",
            label: "Hapus tugas selesai",
            icon: Eraser,
            run: () => {
              clearCompleted();
              closePalette();
            },
          },
        ]
      : []),
    {
      id: "theme",
      label: theme === "dark" ? "Beralih ke mode terang" : "Beralih ke mode gelap",
      icon: theme === "dark" ? Sun : Moon,
      run: () => {
        toggleTheme();
        closePalette();
      },
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-xl px-4 py-10 sm:py-14">
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenPalette={openPalette}
        />

        <main className="mt-5 overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-sm shadow-zinc-900/[0.03] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
          <Overview
            total={todos.length}
            active={activeCount}
            completed={completedCount}
          />
          <TodoForm onAdd={addTodo} inputRef={addInputRef} />
          <TodoFilter
            current={filter}
            onChange={setFilter}
            counts={{
              all: todos.length,
              active: activeCount,
              completed: completedCount,
            }}
          />
          <TodoList
            todos={visibleTodos}
            filter={filter}
            onToggle={toggleTodo}
            onUpdate={updateTodo}
            onDelete={deleteTodo}
          />
          <Footer
            total={todos.length}
            active={activeCount}
            completed={completedCount}
            onToggleAll={toggleAll}
            onClearCompleted={clearCompleted}
          />
        </main>

        <p className="mt-6 text-center font-mono text-xs text-zinc-400 dark:text-zinc-600">
          Tersimpan otomatis di peramban
        </p>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={closePalette}
        commands={commands}
        todos={todos}
        onToggleTask={toggleTodo}
      />

      <Toast data={pendingUndo} onUndo={undo} onDismiss={clearUndo} />
    </div>
  );
}
