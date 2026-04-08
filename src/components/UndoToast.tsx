import { useUndoStore } from '../stores/undoStore';

export default function UndoToast() {
  const stack = useUndoStore(s => s.stack);
  const handleUndo = useUndoStore(s => s.handleUndo);
  const dismissUndo = useUndoStore(s => s.dismissUndo);

  if (stack.length === 0) return null;
  const item = stack[stack.length - 1];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[95] bg-ef-card border border-ef-line rounded-xl px-4 py-2.5 shadow-2xl flex items-center gap-3 animate-slide-up">
      <span className="text-sm text-ef-ink-2">{item.label}</span>
      <button onClick={() => handleUndo(item.id)}
        className="px-3 py-1 bg-ef-gold hover:bg-ef-gold-2 rounded-lg text-xs font-medium cursor-pointer transition-colors text-white">
        復原
      </button>
      <button onClick={() => dismissUndo(item.id)} className="text-ef-ink-4 hover:text-ef-ink text-xs cursor-pointer">✕</button>
    </div>
  );
}
