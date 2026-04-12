import { useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { DragDropProvider, type DragDropEvents } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { arrayMove } from '../utils/arrayMove';
import type { Skill, Buff, BuffGroup, Character, DamageZone, RotationGroup, RotationEntry } from '../types';
import { calculateRotationGroup, type RotationGroupResult, type SkillDamageResult } from '../utils/damage';
import Modal from './Modal';

interface Props {
  rotationGroups: RotationGroup[];
  skills: Skill[];
  buffs: Buff[];
  buffGroups: BuffGroup[];
  characters: Character[];
  zones: DamageZone[];
  onChange: (groups: RotationGroup[]) => void;
  pushUndo: (label: string, restore: () => void) => void;
}

function fmt(n: number) { return Math.round(n).toLocaleString(); }

/* ── Damage Detail Modal ── */
function DamageDetailModal({ result, onClose }: { result: RotationGroupResult; onClose: () => void }) {
  return (
    <Modal open title={`${result.group.name} — 傷害詳情`} onClose={onClose} width="max-w-2xl">
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-xs text-gray-400">總傷害</div>
          <div className="text-3xl font-bold text-amber-400">{fmt(result.totalDamage)}</div>
        </div>

        {result.skillResults.map(({ result: sr, count, subtotal }, i) => (
          <SkillDetail key={i} sr={sr} count={count} subtotal={subtotal} />
        ))}

        {result.skillResults.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-4">此循環尚無技能</p>
        )}
      </div>
    </Modal>
  );
}

function SkillDetail({ sr, count, subtotal }: { sr: SkillDamageResult; count: number; subtotal: number }) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-gray-100">{sr.skill.name}</span>
          {sr.character && <span className="text-xs text-gray-500 ml-2">({sr.character.name})</span>}
          {count > 1 && <span className="text-xs text-gray-400 ml-2">x{count}</span>}
        </div>
        <span className="text-base font-bold text-amber-400">{fmt(subtotal)}</span>
      </div>

      <div className="text-xs text-gray-500">
        攻擊力: <span className="text-indigo-400">{fmt(sr.attackPower)}</span>
        {count > 1 && <> · 單次: <span className="text-gray-300">{fmt(sr.finalDamage)}</span></>}
      </div>

      {/* Zone breakdown */}
      <div className="space-y-1.5">
        {sr.zones.map(zb => (
          <div key={zb.zone.id}>
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: zb.zone.color }}>{zb.zone.icon} {zb.zone.displayName}</span>
              <span className="text-gray-300 font-mono">x{zb.multiplier.toFixed(4)}</span>
            </div>
            <div className="ml-4 text-[11px] text-gray-600 space-y-0.5">
              {zb.sources.map((s, j) => (
                <div key={j} className="flex justify-between"><span>{s.buffName}</span><span>{s.value}%</span></div>
              ))}
              {zb.sources.length > 1 && (
                <div className="flex justify-between text-gray-500 border-t border-gray-800 pt-0.5"><span>合計</span><span>{zb.total}%</span></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Formula */}
      <div className="text-[11px] text-gray-600 border-t border-gray-800 pt-1.5 break-all">
        <span className="text-gray-500">公式: </span>{fmt(sr.attackPower)}
        {sr.zones.map(zb => (
          <span key={zb.zone.id}>{' x '}<span style={{ color: zb.zone.color }}>{zb.multiplier.toFixed(4)}</span></span>
        ))}
        {' = '}<span className="text-amber-400">{fmt(sr.finalDamage)}</span>
        {count > 1 && <span> x {count} = <span className="text-amber-400">{fmt(subtotal)}</span></span>}
      </div>
    </div>
  );
}

/* ── Sortable Entry with per-entry buff disable ── */
function SortableEntry({ entry, index, skills, buffs, buffGroups, onUpdate, onRemove }: {
  entry: RotationEntry; index: number; skills: Skill[]; buffs: Buff[]; buffGroups: BuffGroup[];
  onUpdate: (id: string, patch: Partial<RotationEntry>) => void;
  onRemove: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const handleRef = useRef<HTMLSpanElement>(null);
  const { ref, isDragging } = useSortable({ id: entry.id, index, handle: handleRef });

  const skill = skills.find(s => s.id === entry.skillId);
  const enabledBuffIds = skill?.enabledBuffIds || [];
  const relevantBuffs = buffs.filter(b => b.enabled && enabledBuffIds.includes(b.id));
  const disabledSet = new Set(entry.disabledBuffIds || []);
  const hasOverrides = disabledSet.size > 0;

  const toggleBuffForEntry = (buffId: string) => {
    const current = entry.disabledBuffIds || [];
    const next = current.includes(buffId) ? current.filter(x => x !== buffId) : [...current, buffId];
    onUpdate(entry.id, { disabledBuffIds: next });
  };

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.4 : 1 }} className="space-y-1">
      <div className="flex items-center gap-2 bg-gray-800/40 border border-gray-700 rounded-lg px-3 py-1.5 text-sm">
        <span ref={handleRef} className="text-gray-600 cursor-grab active:cursor-grabbing text-xs touch-none">⠿</span>
        <select value={entry.skillId} onChange={e => onUpdate(entry.id, { skillId: e.target.value })}
          className="flex-1 bg-transparent text-gray-200 focus:outline-none text-sm min-w-0">
          <option value="" className="bg-gray-900">選擇技能</option>
          {skills.map(s => <option key={s.id} value={s.id} className="bg-gray-900">{s.name}</option>)}
        </select>
        <span className="text-gray-600">x</span>
        <input type="number" min={1} value={entry.count} onChange={e => onUpdate(entry.id, { count: Math.max(1, Number(e.target.value) || 1) })}
          className="w-12 bg-transparent text-gray-200 text-center focus:outline-none font-mono text-sm" />
        <button onClick={() => setExpanded(!expanded)}
          className={`text-xs cursor-pointer transition-colors ${hasOverrides ? 'text-amber-400' : 'text-gray-600 hover:text-gray-400'}`}
          title="Buff 設定">
          ⚙
        </button>
        <button onClick={() => onRemove(entry.id)} className="text-gray-600 hover:text-red-400 cursor-pointer text-xs">✕</button>
      </div>

      {/* Per-entry buff toggle panel */}
      {expanded && relevantBuffs.length > 0 && (
        <div className="ml-6 flex flex-wrap gap-1 py-1">
          {relevantBuffs.map(b => {
            const off = disabledSet.has(b.id);
            const group = buffGroups.find(g => g.id === b.groupId);
            const color = group?.color || '#64748b';
            return (
              <button key={b.id} onClick={() => toggleBuffForEntry(b.id)}
                className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer border transition-all ${off ? 'border-gray-700 text-gray-600 opacity-50 line-through' : 'text-white'}`}
                style={off ? undefined : { backgroundColor: color + '25', borderColor: color + '60', color }}>
                {b.icon} {b.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Skill Palette ── */
function SkillChip({ skill, onAdd }: { skill: Skill; onAdd: () => void }) {
  return (
    <button onClick={onAdd}
      className="px-2.5 py-1 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 hover:border-indigo-500/50 cursor-pointer transition-colors">
      + {skill.name}
    </button>
  );
}

/* ── Single Group Card ── */
function GroupCard({ group, groupResult, skills, buffs, buffGroups, onUpdate, onRemove, onCopy, onShowDetail }: {
  group: RotationGroup;
  groupResult: RotationGroupResult;
  skills: Skill[];
  buffs: Buff[];
  buffGroups: BuffGroup[];
  onUpdate: (g: RotationGroup) => void;
  onRemove: () => void;
  onCopy: () => void;
  onShowDetail: () => void;
}) {
  const updateEntry = (id: string, patch: Partial<RotationEntry>) => {
    onUpdate({ ...group, entries: group.entries.map(e => e.id === id ? { ...e, ...patch } : e) });
  };
  const removeEntry = (id: string) => {
    onUpdate({ ...group, entries: group.entries.filter(e => e.id !== id) });
  };
  const addSkill = (skillId: string) => {
    onUpdate({ ...group, entries: [...group.entries, { id: uuid(), skillId, count: 1, disabledBuffIds: [] }] });
  };

  const handleDragEnd: DragDropEvents['dragend'] = (event) => {
    if (event.canceled) return;
    const { source, target } = event.operation;
    if (!source || !target || source.id === target.id) return;
    const oldIdx = group.entries.findIndex(e => e.id === source.id);
    const newIdx = group.entries.findIndex(e => e.id === target.id);
    if (oldIdx < 0 || newIdx < 0) return;
    onUpdate({ ...group, entries: arrayMove(group.entries, oldIdx, newIdx) });
  };

  return (
    <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-4 space-y-3 flex-1 min-w-[320px]">
      <div className="flex items-center justify-between">
        <input value={group.name}
          onChange={e => onUpdate({ ...group, name: e.target.value })}
          className="bg-transparent text-gray-100 font-semibold focus:outline-none focus:border-b focus:border-indigo-500 text-sm" />
        <div className="flex items-center gap-3">
          <button onClick={onShowDetail} className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer">詳情</button>
          <button onClick={onCopy} className="text-xs text-gray-500 hover:text-indigo-400 cursor-pointer" title="複製">⧉</button>
          <button onClick={onRemove} className="text-gray-600 hover:text-red-400 text-xs cursor-pointer">✕</button>
        </div>
      </div>

      {/* Total */}
      <div className="text-center py-2">
        <div className="text-2xl font-bold text-amber-400 cursor-pointer hover:text-amber-300 transition-colors" onClick={onShowDetail}>
          {fmt(groupResult.totalDamage)}
        </div>
        <div className="text-[11px] text-gray-500">{group.entries.length} 個技能施放</div>
      </div>

      {/* Skill palette */}
      <div className="flex gap-1.5 flex-wrap">
        {skills.map(s => <SkillChip key={s.id} skill={s} onAdd={() => addSkill(s.id)} />)}
      </div>

      {/* Entries */}
      <DragDropProvider onDragEnd={handleDragEnd}>
        <div className="space-y-1.5 max-h-64 overflow-y-auto">
          {group.entries.map((e, i) => (
            <SortableEntry key={e.id} entry={e} index={i} skills={skills} buffs={buffs} buffGroups={buffGroups}
              onUpdate={updateEntry} onRemove={removeEntry} />
          ))}
        </div>
      </DragDropProvider>

      {group.entries.length === 0 && (
        <p className="text-gray-600 text-xs text-center py-2">點擊上方技能加入循環</p>
      )}
    </div>
  );
}

/* ── Main Section ── */
export default function RotationSection({ rotationGroups, skills, buffs, buffGroups, characters, zones, onChange, pushUndo }: Props) {
  const [detailResult, setDetailResult] = useState<RotationGroupResult | null>(null);

  const addGroup = () => {
    onChange([...rotationGroups, { id: uuid(), name: `循環 ${rotationGroups.length + 1}`, entries: [], disabledBuffIds: [] }]);
  };

  const updateGroup = (g: RotationGroup) => {
    onChange(rotationGroups.map(x => x.id === g.id ? g : x));
  };

  const removeGroup = (id: string) => {
    const grp = rotationGroups.find(g => g.id === id);
    if (!grp) return;
    const prev = [...rotationGroups];
    onChange(rotationGroups.filter(g => g.id !== id));
    pushUndo(`已刪除循環: ${grp.name}`, () => onChange(prev));
  };

  const copyGroup = (g: RotationGroup) => {
    const copy: RotationGroup = {
      ...g,
      id: uuid(),
      name: `${g.name} (複製)`,
      entries: g.entries.map(e => ({ ...e, id: uuid(), disabledBuffIds: [...(e.disabledBuffIds || [])] })),
    };
    onChange([...rotationGroups, copy]);
  };

  const groupResults = rotationGroups.map(g => calculateRotationGroup(g, skills, characters, buffs, zones));

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-100">🔄 技能循環 & 傷害</h2>
        <button onClick={addGroup} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-medium transition-colors cursor-pointer">+ 新增循環</button>
      </div>

      {rotationGroups.length === 0 ? (
        <p className="text-gray-600 text-sm text-center py-4">新增循環來計算傷害，可建立多組對比</p>
      ) : (
        <div className="flex gap-4 flex-wrap">
          {rotationGroups.map((g, i) => (
            <GroupCard
              key={g.id}
              group={g}
              groupResult={groupResults[i]}
              skills={skills}
              buffs={buffs}
              buffGroups={buffGroups}
              onUpdate={updateGroup}
              onRemove={() => removeGroup(g.id)}
              onCopy={() => copyGroup(g)}
              onShowDetail={() => setDetailResult(groupResults[i])}
            />
          ))}
        </div>
      )}

      {/* Comparison bar if multiple */}
      {groupResults.length > 1 && (
        <div className="mt-4 bg-gray-800/30 border border-gray-700 rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-2">對比</div>
          {(() => {
            const max = Math.max(...groupResults.map(r => r.totalDamage), 1);
            return groupResults.map((r, i) => (
              <div key={r.group.id} className="flex items-center gap-3 mb-1.5">
                <span className="text-xs text-gray-400 w-20 truncate">{r.group.name}</span>
                <div className="flex-1 bg-gray-900 rounded-full h-5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${(r.totalDamage / max) * 100}%` }}>
                    <span className="text-[10px] text-white font-mono">{fmt(r.totalDamage)}</span>
                  </div>
                </div>
                {i > 0 && groupResults[0].totalDamage > 0 && (
                  <span className={`text-xs font-mono ${r.totalDamage >= groupResults[0].totalDamage ? 'text-green-400' : 'text-red-400'}`}>
                    {r.totalDamage >= groupResults[0].totalDamage ? '+' : ''}{((r.totalDamage / groupResults[0].totalDamage - 1) * 100).toFixed(1)}%
                  </span>
                )}
              </div>
            ));
          })()}
        </div>
      )}

      {detailResult && <DamageDetailModal result={detailResult} onClose={() => setDetailResult(null)} />}
    </section>
  );
}
