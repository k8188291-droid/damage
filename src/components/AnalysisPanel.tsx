import { useRef } from 'react';
import { useShallow } from 'zustand/shallow';
import { DragDropProvider, type DragEndEvent } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { useAppStore } from '../stores/appStore';
import { arrayMove } from '../utils/arrayMove';
import type { RotationGroup } from '../types';
import type { RotationGroupResult } from '../utils/damage';
import { Tooltip } from './ui';

interface Props {
  groupResults: RotationGroupResult[];
}

function fmt(n: number) { return Math.round(n).toLocaleString(); }

const SKILL_COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#22c55e', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#a855f7'];

function SortableCycleCard({ group, index, result, isActive, maxDamage, diff, excluded, onSelect, onCopy, onRemove, onToggleExclude }: {
  group: RotationGroup;
  index: number;
  result: RotationGroupResult;
  isActive: boolean;
  maxDamage: number;
  diff: string | null;
  excluded: boolean;
  onSelect: () => void;
  onCopy: () => void;
  onRemove: () => void;
  onToggleExclude: () => void;
}) {
  const handleRef = useRef<HTMLSpanElement>(null);
  const { ref, isDragging } = useSortable({ id: group.id, index, handle: handleRef });
  const pct = (result.totalDamage / maxDamage) * 100;

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div
        onClick={onSelect}
        className={`rounded-xl px-3 py-2.5 cursor-pointer transition-colors group ${
          excluded ? 'opacity-50' : ''
        } ${
          isActive
            ? 'bg-indigo-600/20 border border-indigo-500/40'
            : 'bg-gray-800/60 border border-gray-700 hover:border-gray-600'
        }`}
      >
        {/* Name + damage */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span ref={handleRef}
              className="text-gray-600 cursor-grab active:cursor-grabbing text-xs shrink-0 touch-none"
              onClick={e => e.stopPropagation()}>⠿</span>
            <span className={`text-sm truncate min-w-0 ${excluded ? 'text-gray-500 line-through' : 'text-gray-200'}`}>{group.name}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={e => { e.stopPropagation(); onCopy(); }}
                className="text-gray-500 hover:text-indigo-400 text-xs cursor-pointer" title="複製">⧉</button>
              <button onClick={e => { e.stopPropagation(); onRemove(); }}
                className="text-gray-500 hover:text-red-400 text-xs cursor-pointer" title="刪除">✕</button>
            </div>
          </div>
        </div>

        {/* Progress bar vs max damage */}
        <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden mb-1">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isActive ? 'bg-indigo-500' : excluded ? 'bg-gray-600' : 'bg-gray-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className='flex items-center gap-2'>
          <Tooltip label={excluded ? '點擊加入分析' : '點擊排除分析'}>
            <button
              onClick={e => { e.stopPropagation(); onToggleExclude(); }}
              className={`w-3 h-3 rounded-full border-2 cursor-pointer shrink-0 transition-colors ${excluded ? 'border-gray-600 bg-transparent' : 'border-green-500 bg-green-500/30'}`}
            />
          </Tooltip>
          <span className="text-sm font-bold text-gray-100">{fmt(result.totalDamage)}</span>
          {/* Diff vs active */}
          {diff && !excluded && (
            <div className={`text-xs font-mono ${Number(diff) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {Number(diff) >= 0 ? '+' : ''}{diff}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AnalysisPanel({ groupResults }: Props) {
  const {
    rotationGroups, activeRotationId, excludedGroupIds, notes,
    setActiveRotationId, addRotationGroup, removeRotationGroup,
    copyRotationGroup, reorderRotationGroups, toggleExclude, setNotes,
  } = useAppStore(useShallow(s => ({
    rotationGroups: s.rotationGroups,
    activeRotationId: s.activeRotationId,
    excludedGroupIds: s.excludedGroupIds,
    notes: s.notes,
    setActiveRotationId: s.setActiveRotationId,
    addRotationGroup: s.addRotationGroup,
    removeRotationGroup: s.removeRotationGroup,
    copyRotationGroup: s.copyRotationGroup,
    reorderRotationGroups: s.reorderRotationGroups,
    toggleExclude: s.toggleExclude,
    setNotes: s.setNotes,
  })));

  const excludedSet = new Set(excludedGroupIds);

  const activeIdx = rotationGroups.findIndex(g => g.id === activeRotationId);
  const activeResult = activeIdx >= 0 ? groupResults[activeIdx] : null;

  const includedResults = groupResults.filter((_, i) => !excludedSet.has(rotationGroups[i].id));
  const maxDamage = Math.max(...includedResults.map(r => r.totalDamage), 1);

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return;
    const { source, target } = event.operation;
    if (!source || !target || source.id === target.id) return;
    const oldIdx = rotationGroups.findIndex(g => g.id === source.id);
    const newIdx = rotationGroups.findIndex(g => g.id === target.id);
    if (oldIdx < 0 || newIdx < 0) return;
    reorderRotationGroups(arrayMove(rotationGroups, oldIdx, newIdx));
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm">📊</span>
          <span className="text-sm font-semibold text-gray-200 flex-1">數據分析對比</span>
        </div>
      </div>

      {/* Notes block */}
      <div className="px-4 py-3 border-b border-gray-800 shrink-0">
        <div className="text-xs text-gray-500 tracking-wider font-semibold mb-2">NOTES</div>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="輸入此設定的說明..."
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-300 resize-none focus:outline-none focus:border-indigo-500"
          rows={5}
        />
      </div>

      {/* Saved Cycles */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500 tracking-wider font-semibold">SAVED CYCLES</span>
          <button onClick={addRotationGroup}
            className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer">+ 新增</button>
        </div>
        <DragDropProvider onDragEnd={handleDragEnd}>
          <div className="space-y-2">
            {rotationGroups.map((g, i) => {
              const isActive = g.id === activeRotationId;
              const result = groupResults[i];
              const excluded = excludedSet.has(g.id);
              const diff = activeResult && activeResult.totalDamage > 0 && !isActive && !excluded && !excludedSet.has(activeRotationId)
                ? ((result.totalDamage / activeResult.totalDamage - 1) * 100).toFixed(1)
                : null;

              return (
                <SortableCycleCard
                  key={g.id}
                  group={g}
                  index={i}
                  result={result}
                  isActive={isActive}
                  maxDamage={maxDamage}
                  diff={diff}
                  excluded={excluded}
                  onSelect={() => setActiveRotationId(g.id)}
                  onCopy={() => copyRotationGroup(g)}
                  onRemove={() => removeRotationGroup(g.id)}
                  onToggleExclude={() => toggleExclude(g.id)}
                />
              );
            })}
          </div>
        </DragDropProvider>
      </div>

      {activeResult && activeResult.skillResults.length > 0 && (
        <div className="px-4 py-3 flex-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500 tracking-wider font-semibold">DAMAGE BREAKDOWN</span>
          </div>
          <div className="space-y-3">
            {activeResult.skillResults.map(({ result: sr, subtotal }, i) => {
              const pct = activeResult.totalDamage > 0 ? (subtotal / activeResult.totalDamage * 100) : 0;
              const color = SKILL_COLORS[i % SKILL_COLORS.length];

              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-300">{sr.skill.name}</span>
                    <span className="text-xs text-gray-400 font-mono">{pct.toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
