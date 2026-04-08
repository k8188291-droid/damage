import { useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { useAppStore } from '../stores/appStore';
import { Tooltip } from './ui';

export default function CycleBuffBar() {
  const { buffs, buffGroups, zones, activeRotationId, rotationGroups, toggleCycleBuff } = useAppStore(useShallow(s => ({
    buffs: s.buffs,
    buffGroups: s.buffGroups,
    zones: s.zones,
    activeRotationId: s.activeRotationId,
    rotationGroups: s.rotationGroups,
    toggleCycleBuff: s.toggleCycleBuff,
  })));

  const [expanded, setExpanded] = useState(false);

  const activeRotation = rotationGroups.find(g => g.id === activeRotationId);
  const cycleDisabledBuffIds = activeRotation?.disabledBuffIds || [];

  // Only show globally enabled buffs, sorted by group order then position within group
  const enabledBuffs = buffs.filter(b => b.enabled);
  const sortedBuffs = [...enabledBuffs].sort((a, b) => {
    const aGroupIdx = a.groupId ? buffGroups.findIndex(g => g.id === a.groupId) : -1;
    const bGroupIdx = b.groupId ? buffGroups.findIndex(g => g.id === b.groupId) : -1;
    if (aGroupIdx !== bGroupIdx) return aGroupIdx - bGroupIdx;
    return buffs.indexOf(a) - buffs.indexOf(b);
  });
  const disabledSet = new Set(cycleDisabledBuffIds);

  // When collapsed, filter out disabled buffs
  const visibleBuffs = expanded
    ? sortedBuffs
    : sortedBuffs.filter(b => !disabledSet.has(b.id));

  return (
    <div className="relative px-5 py-3 border-b border-gray-800 shrink-0">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-gray-500 text-sm">⚙</span>
        <span className="text-xs font-semibold text-gray-400 tracking-wide">當前循環 BUFF 生效開關</span>
      </div>
      <div
        className={`flex flex-wrap gap-2 transition-all duration-200 overflow-y-auto`}
        style={{ maxHeight: !expanded ? 70 : 'calc(100vh - 120px)' }}
      >
        {visibleBuffs.map(b => {
          const group = buffGroups.find(g => g.id === b.groupId);
          const isDisabled = disabledSet.has(b.id);
          const color = group?.color || '#64748b';
          const zone = zones.find(z => z.id === b.zoneId);
          const zoneLabel = zone ? `${zone.icon} ${zone.displayName}` : '未設定分區';
          const tooltipLabel = `${zoneLabel}／${group?.name || '未分組'}`;

          return (
            <Tooltip key={b.id} label={tooltipLabel}>
              <button
                onClick={() => toggleCycleBuff(b.id)}
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
            </Tooltip>
          );
        })}
        {sortedBuffs.length === 0 && (
          <span className="text-xs text-gray-600">尚未設定任何 Buff</span>
        )}
      </div>
      <button
        onClick={() => setExpanded(e => !e)}
        className="z-10 absolute cursor-pointer bottom-[-20px] left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gray-800 border border-gray-700 text-gray-500 flex items-center justify-center hover:text-white transition-colors shadow-lg"
        title={expanded ? '收合' : '展開'}
      >
        <span className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>
    </div>
  );
}
