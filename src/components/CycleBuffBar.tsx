import type { Buff, BuffGroup, DamageZone } from '../types';

interface Props {
  buffs: Buff[];
  buffGroups: BuffGroup[];
  zones: DamageZone[];
  cycleDisabledBuffIds: string[];
  onToggleBuff: (buffId: string) => void;
  onAddBuff?: () => void;
}

export default function CycleBuffBar({ buffs, buffGroups, zones, cycleDisabledBuffIds, onToggleBuff }: Props) {
  // Only show globally enabled buffs
  const enabledBuffs = buffs.filter(b => b.enabled);
  const disabledSet = new Set(cycleDisabledBuffIds);

  return (
    <div className="px-5 py-3 border-b border-gray-800 shrink-0">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-gray-500 text-sm">⚙</span>
        <span className="text-xs font-semibold text-gray-400 tracking-wide">當前循環 BUFF 生效開關</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {enabledBuffs.map(b => {
          const group = buffGroups.find(g => g.id === b.groupId);
          const zone = zones.find(z => z.id === b.zoneId);
          const isDisabled = disabledSet.has(b.id);
          const color = group?.color || '#64748b';

          return (
            <button
              key={b.id}
              onClick={() => onToggleBuff(b.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border transition-all ${
                isDisabled
                  ? 'border-gray-700 text-gray-500 opacity-50'
                  : 'text-white'
              }`}
              style={
                isDisabled
                  ? undefined
                  : { backgroundColor: color + '25', borderColor: color + '80', color }
              }
            >
              {!isDisabled && <span className="text-[10px]">◆</span>}
              {b.icon} {b.name} {b.value}%
              {zone && <span className="opacity-60">· {zone.displayName}</span>}
              {!isDisabled && (
                <span className="ml-0.5 text-[10px] opacity-60 hover:opacity-100">✕</span>
              )}
            </button>
          );
        })}
        {enabledBuffs.length === 0 && (
          <span className="text-xs text-gray-600">尚未設定任何 Buff</span>
        )}
      </div>
    </div>
  );
}
