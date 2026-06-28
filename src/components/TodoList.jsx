import TodoItem from "./TodoItem.jsx";
import EmptyState from "./EmptyState.jsx";

/**
 * TodoList — renders the visible TodoItem rows.
 * Receives the already-ordered `todos` plus handlers, and passes
 * them down to each TodoItem via props.
 */
export default function TodoList({ todos, filter, onToggle, onUpdate, onDelete }) {
  if (todos.length === 0) {
    return <EmptyState filter={filter} />;
  }

  return (
    <ul className="divide-y divide-zinc-100 py-1 dark:divide-zinc-800/70">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
