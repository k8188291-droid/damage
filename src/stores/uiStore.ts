import { create } from 'zustand';
import type { MouseEvent as ReactMouseEvent } from 'react';

interface UIState {
  // Panel visibility
  rightPanelOpen: boolean;
  visibleSections: Record<string, boolean>;
  collapsedSections: Record<string, boolean>;

  // Panel widths
  leftPanelWidth: number;
  rightPanelWidth: number;

  // Responsive
  isNarrow: boolean;

  // Dark mode
  isDark: boolean;

  // Actions
  setRightPanelOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  toggleSection: (key: string) => void;
  toggleCollapse: (key: string) => void;
  closeOverlays: () => void;
  setIsNarrow: (v: boolean) => void;
  collapseForNarrow: () => void;
  toggleDarkMode: () => void;

  // Resize
  startResize: (e: ReactMouseEvent, side: 'left' | 'right') => void;
  setLeftPanelWidth: (w: number) => void;
  setRightPanelWidth: (w: number) => void;
}

export const useUIStore = create<UIState>()((set, get) => ({
  rightPanelOpen: true,
  visibleSections: { presets: true, characters: true, buffs: true, skills: true },
  collapsedSections: {},
  leftPanelWidth: 360,
  rightPanelWidth: 280,
  isNarrow: false,
  isDark: (() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  })(),

  setRightPanelOpen: (v) => set(state => ({
    rightPanelOpen: typeof v === 'function' ? v(state.rightPanelOpen) : v,
  })),

  toggleSection: (key) => set(state => ({
    visibleSections: { ...state.visibleSections, [key]: !(state.visibleSections[key] !== false) },
  })),

  toggleCollapse: (key) => set(state => ({
    collapsedSections: { ...state.collapsedSections, [key]: !state.collapsedSections[key] },
  })),

  closeOverlays: () => {
    if (get().isNarrow) {
      set({
        rightPanelOpen: false,
        visibleSections: { presets: false, characters: false, buffs: false, skills: false },
      });
    }
  },

  setIsNarrow: (v) => set({ isNarrow: v }),

  toggleDarkMode: () => set(state => ({ isDark: !state.isDark })),

  collapseForNarrow: () => {
    set({
      rightPanelOpen: false,
      visibleSections: { presets: false, characters: false, buffs: false, skills: false },
    });
  },

  startResize: (e, side) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = side === 'left' ? get().leftPanelWidth : get().rightPanelWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (ev: globalThis.MouseEvent) => {
      const delta = side === 'left' ? ev.clientX - startX : startX - ev.clientX;
      const newWidth = Math.min(600, Math.max(200, startWidth + delta));
      if (side === 'left') set({ leftPanelWidth: newWidth });
      else set({ rightPanelWidth: newWidth });
    };

    const onMouseUp = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  },

  setLeftPanelWidth: (w) => set({ leftPanelWidth: w }),
  setRightPanelWidth: (w) => set({ rightPanelWidth: w }),
}));
