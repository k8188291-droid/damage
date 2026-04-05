import type { Buff, BuffGroup } from '../types';

interface Props {
  buffs: Buff[];
  buffGroups: BuffGroup[];
  cycleDisabledBuffIds: string[];
  onToggleBuff: (buffId: string) => void;
}

export default function CycleBuffBar({ buffs, buffGroups, cycleDisabledBuffIds, onToggleBuff }: Props) {
  // Only show globally enabled buffs, sorted by group order then position within group
  const enabledBuffs = buffs.filter(b => b.enabled);
  const sortedBuffs = [...enabledBuffs].sort((a, b) => {
    const aGroupIdx = a.groupId ? buffGroups.findIndex(g => g.id === a.groupId) : -1;
    const bGroupIdx = b.groupId ? buffGroups.findIndex(g => g.id === b.groupId) : -1;
    if (aGroupIdx !== bGroupIdx) return aGroupIdx - bGroupIdx;
    return buffs.indexOf(a) - buffs.indexOf(b);
  });
  const disabledSet = new Set(cycleDisabledBuffIds);

  return (
    <div className="px-5 py-3 border-b border-gray-800 shrink-0">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-gray-500 text-sm">⚙</span>
        <span className="text-xs font-semibold text-gray-400 tracking-wide">當前循環 BUFF 生效開關</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sortedBuffs.map(b => {
          const group = buffGroups.find(g => g.id === b.groupId);
          const isDisabled = disabledSet.has(b.id);
          const color = group?.color || '#64748b';

          return (
            <button
              key={b.id}
              onClick={() => onToggleBuff(b.id)}
              title={isDisabled ? '已停用，點擊啟用' : '已啟用，點擊停用'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border transition-all ${
                isDisabled
                  ? 'border-gray-700 text-gray-500 opacity-40 line-through'
                  : 'text-white'
              }`}
              style={
                isDisabled
                  ? undefined
                  : { backgroundColor: color + '25', borderColor: color + '80', color }
              }
            >
              {b.icon} {b.name} {b.value}%
            </button>
          );
        })}
        {sortedBuffs.length === 0 && (
          <span className="text-xs text-gray-600">尚未設定任何 Buff</span>
        )}
      </div>
    </div>
  );
}
