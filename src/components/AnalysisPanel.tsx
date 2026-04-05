import type { RotationGroup } from '../types';
import type { RotationGroupResult } from '../utils/damage';

interface Props {
  rotationGroups: RotationGroup[];
  groupResults: RotationGroupResult[];
  activeRotationId: string;
  onSelectRotation: (id: string) => void;
  onAddRotation: () => void;
  onRemoveRotation: (id: string) => void;
  onCopyRotation: (g: RotationGroup) => void;
}

function fmt(n: number) { return Math.round(n).toLocaleString(); }

const SKILL_COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#22c55e', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#a855f7'];

export default function AnalysisPanel({ rotationGroups, groupResults, activeRotationId, onSelectRotation, onAddRotation, onRemoveRotation, onCopyRotation }: Props) {
  const activeIdx = rotationGroups.findIndex(g => g.id === activeRotationId);
  const activeResult = activeIdx >= 0 ? groupResults[activeIdx] : null;
  const maxDamage = Math.max(...groupResults.map(r => r.totalDamage), 1);

  return (
    <aside className="w-[280px] bg-gray-900/40 border-l border-gray-800 flex flex-col overflow-y-auto shrink-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm">📊</span>
          <span className="text-sm font-semibold text-gray-200">數據分析對比</span>
        </div>
      </div>

      {/* Saved Cycles */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] text-gray-500 tracking-wider font-semibold">SAVED CYCLES</span>
          <button onClick={onAddRotation}
            className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer">+ 新增</button>
        </div>
        <div className="space-y-2">
          {rotationGroups.map((g, i) => {
            const isActive = g.id === activeRotationId;
            const result = groupResults[i];
            const pct = (result.totalDamage / maxDamage) * 100;
            const diff = activeResult && activeResult.totalDamage > 0 && !isActive
              ? ((result.totalDamage / activeResult.totalDamage - 1) * 100).toFixed(1)
              : null;

            return (
              <div
                key={g.id}
                onClick={() => onSelectRotation(g.id)}
                className={`rounded-xl px-3 py-2.5 cursor-pointer transition-colors group ${
                  isActive
                    ? 'bg-indigo-600/20 border border-indigo-500/40'
                    : 'bg-gray-800/60 border border-gray-700 hover:border-gray-600'
                }`}
              >
                {/* Name + damage */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-200 truncate min-w-0">{g.name}</span>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-sm font-bold text-gray-100">{fmt(result.totalDamage)}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={e => { e.stopPropagation(); onCopyRotation(g); }}
                        className="text-gray-500 hover:text-indigo-400 text-xs cursor-pointer" title="複製">⧉</button>
                      <button onClick={e => { e.stopPropagation(); onRemoveRotation(g.id); }}
                        className="text-gray-500 hover:text-red-400 text-xs cursor-pointer" title="刪除">✕</button>
                    </div>
                  </div>
                </div>

                {/* Progress bar vs max damage (req 8) */}
                <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden mb-1">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isActive ? 'bg-indigo-500' : 'bg-gray-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Diff vs active */}
                {diff && (
                  <div className={`text-[10px] font-mono ${Number(diff) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {Number(diff) >= 0 ? '+' : ''}{diff}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Damage Breakdown */}
      {activeResult && activeResult.skillResults.length > 0 && (
        <div className="px-4 py-3 flex-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500 tracking-wider font-semibold">DAMAGE BREAKDOWN</span>
            <span className="text-gray-600 text-xs cursor-help" title="各技能在當前循環中的傷害佔比">ⓘ</span>
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
    </aside>
  );
}
