import { Archive, User, Sparkles, Swords, Settings, Sun, Moon } from 'lucide-react';
import { useShallow } from 'zustand/shallow';
import { useUIStore } from '../stores/uiStore';

const SECTIONS = [
  { key: 'presets', icon: Archive, label: '檔案庫' },
  { key: 'characters', icon: User, label: '角色' },
  { key: 'buffs', icon: Sparkles, label: 'Buff' },
  { key: 'skills', icon: Swords, label: '技能' },
] as const;

export default function IconSidebar() {
  const { visibleSections, toggleSection, isDark, toggleDarkMode } = useUIStore(useShallow(s => ({
    visibleSections: s.visibleSections,
    toggleSection: s.toggleSection,
    isDark: s.isDark,
    toggleDarkMode: s.toggleDarkMode,
  })));

  return (
    <aside className="w-12 bg-ef-panel border-r border-ef-line flex flex-col items-center py-3 gap-1 shrink-0">
      {SECTIONS.map(s => {
        const active = visibleSections[s.key] !== false;
        const Icon = s.icon;
        return (
          <button
            key={s.key}
            onClick={() => toggleSection(s.key)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${active ? 'bg-ef-gold/12 text-ef-gold' : 'text-ef-ink-4 hover:text-ef-ink-2 hover:bg-black/5'}`}
            title={s.label}
          >
            <Icon size={18} />
          </button>
        );
      })}
      <div className="mt-auto flex flex-col items-center gap-1">
        <button
          onClick={toggleDarkMode}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-ef-ink-4 hover:text-ef-ink-2 hover:bg-black/5 cursor-pointer transition-colors"
          title={isDark ? '切換淺色模式' : '切換深色模式'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-ef-ink-4">
          <Settings size={16} />
        </div>
      </div>
    </aside>
  );
}
