import { create } from 'zustand';

export interface UndoItem {
  id: string;
  label: string;
  restore: () => void;
}

interface UndoState {
  stack: UndoItem[];
  pushUndo: (label: string, restore: () => void) => void;
  handleUndo: (id: string) => void;
  dismissUndo: (id: string) => void;
}

const timers = new Map<string, ReturnType<typeof setTimeout>>();

export const useUndoStore = create<UndoState>()((set) => ({
  stack: [],

  pushUndo: (label, restore) => {
    const id = crypto.randomUUID();
    set(state => ({ stack: [...state.stack, { id, label, restore }] }));
    const timer = setTimeout(() => {
      set(state => ({ stack: state.stack.filter(x => x.id !== id) }));
      timers.delete(id);
    }, 5000);
    timers.set(id, timer);
  },

  handleUndo: (id) => {
    set(state => {
      const item = state.stack.find(x => x.id === id);
      if (item) item.restore();
      return { stack: state.stack.filter(x => x.id !== id) };
    });
    const timer = timers.get(id);
    if (timer) { clearTimeout(timer); timers.delete(id); }
  },

  dismissUndo: (id) => {
    set(state => ({ stack: state.stack.filter(x => x.id !== id) }));
    const timer = timers.get(id);
    if (timer) { clearTimeout(timer); timers.delete(id); }
  },
}));
