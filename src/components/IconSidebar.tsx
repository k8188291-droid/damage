interface Props {
  visibleSections: Record<string, boolean>;
  onToggle: (key: string) => void;
}

const SECTIONS = [
  { key: 'presets', icon: '🗄️', label: '檔案庫' },
  { key: 'characters', icon: '👤', label: '角色' },
  { key: 'buffs', icon: '✨', label: 'Buff' },
  { key: 'skills', icon: '⚔️', label: '技能' },
] as const;

export default function IconSidebar({ visibleSections, onToggle }: Props) {
  return (
    <aside className="w-12 bg-gray-900/80 border-r border-gray-800 flex flex-col items-center py-3 gap-1 shrink-0">
      {SECTIONS.map(s => {
        const active = visibleSections[s.key] !== false;
        return (
          <button
            key={s.key}
            onClick={() => onToggle(s.key)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-base cursor-pointer transition-colors ${active ? 'bg-indigo-600/20 text-indigo-400' : 'text-gray-600 hover:text-gray-400 hover:bg-gray-800'}`}
            title={s.label}
          >
            {s.icon}
          </button>
        );
      })}
      <div className="mt-auto">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 text-sm">
          ⚙
        </div>
      </div>
    </aside>
  );
}
