import { useState, useRef, useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import { useAppStore } from '../stores/appStore';

export default function CycleBuffBar() {
  const { buffs, buffGroups, activeRotationId, rotationGroups, toggleCycleBuff } = useAppStore(useShallow(s => ({
    buffs: s.buffs,
    buffGroups: s.buffGroups,
    activeRotationId: s.activeRotationId,
    rotationGroups: s.rotationGroups,
    toggleCycleBuff: s.toggleCycleBuff,
  })));

  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [needsExpand, setNeedsExpand] = useState(false);

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

  // Two rows of chips: each chip ~36px height + 8px gap = ~44px per row, 2 rows ≈ 80px
  const collapsedMaxHeight = 80;

  // Check if content overflows 2 rows when collapsed
  useEffect(() => {
    if (contentRef.current && !expanded) {
      setNeedsExpand(contentRef.current.scrollHeight > collapsedMaxHeight);
    }
  }, [visibleBuffs, expanded]);

  // Also check on expand toggle to detect if expand button is needed
  useEffect(() => {
    if (contentRef.current && expanded) {
      // Re-check with all buffs visible
      const el = contentRef.current;
      setNeedsExpand(el.scrollHeight > collapsedMaxHeight);
    }
  }, [expanded, sortedBuffs]);

  const disabledCount = sortedBuffs.filter(b => disabledSet.has(b.id)).length;

  return (
    <div className="px-5 py-3 border-b border-gray-800 shrink-0">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-gray-500 text-sm">⚙</span>
        <span className="text-xs font-semibold text-gray-400 tracking-wide">當前循環 BUFF 生效開關</span>
        <button
          onClick={() => setExpanded(e => !e)}
          className="ml-auto flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition-colors"
        >
          {!expanded && disabledCount > 0 && (
            <span className="text-gray-600">{disabledCount} 個已停用</span>
          )}
          <span className={`inline-block transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
            ▾
          </span>
          <span>{expanded ? '收合' : '展開'}</span>
        </button>
      </div>
      <div
        ref={contentRef}
        className={`flex flex-wrap gap-2 transition-all duration-200 ${
          !expanded ? 'overflow-y-auto' : ''
        }`}
        style={!expanded ? { maxHeight: collapsedMaxHeight } : undefined}
      >
        {visibleBuffs.map(b => {
          const group = buffGroups.find(g => g.id === b.groupId);
          const isDisabled = disabledSet.has(b.id);
          const color = group?.color || '#64748b';

          return (
            <button
              key={b.id}
              onClick={() => toggleCycleBuff(b.id)}
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
