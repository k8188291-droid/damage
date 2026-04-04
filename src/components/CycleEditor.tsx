import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Skill, Buff, BuffGroup, Character, DamageZone, RotationGroup, RotationEntry } from '../types';
import { calculateSkillDamage, type RotationGroupResult } from '../utils/damage';
import Modal from './Modal';

interface Props {
  group: RotationGroup;
  groupResult: RotationGroupResult;
  skills: Skill[];
  buffs: Buff[];
  buffGroups: BuffGroup[];
  characters: Character[];
  zones: DamageZone[];
  onUpdate: (g: RotationGroup) => void;
  onToggleRightPanel: () => void;
  rightPanelOpen: boolean;
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
          <SkillDetailCard key={i} sr={sr} count={count} subtotal={subtotal} />
        ))}
        {result.skillResults.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-4">此循環尚無技能</p>
        )}
      </div>
    </Modal>
  );
}

function SkillDetailCard({ sr, count, subtotal }: { sr: ReturnType<typeof calculateSkillDamage>; count: number; subtotal: number }) {
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

/* ── Sortable Entry ── */
function SortableEntry({ entry, index, group, skills, buffs, buffGroups, characters, zones, onUpdate, onRemove }: {
  entry: RotationEntry; index: number; group: RotationGroup;
  skills: Skill[]; buffs: Buff[]; buffGroups: BuffGroup[]; characters: Character[]; zones: DamageZone[];
  onUpdate: (id: string, patch: Partial<RotationEntry>) => void;
  onRemove: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: entry.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  const skill = skills.find(s => s.id === entry.skillId);
  const enabledBuffIds = skill?.enabledBuffIds || [];
  const relevantBuffs = buffs.filter(b => b.enabled && enabledBuffIds.includes(b.id));
  const disabledSet = new Set(entry.disabledBuffIds || []);
  const hasOverrides = disabledSet.size > 0;

  // Calculate inline damage for this entry
  const sr = skill ? calculateSkillDamage(skill, characters, buffs, zones, entry.disabledBuffIds || [], group.disabledBuffIds || []) : null;

  // Compute simplified formula parts
  const basicValue = sr ? fmt(sr.attackPower) : '0';
  const buffMultiplier = sr ? sr.zones.reduce((acc, zb) => acc * zb.multiplier, 1).toFixed(2) : '0';
  const finalValue = sr ? sr.finalDamage.toFixed(2) : '0';

  const toggleBuffForEntry = (buffId: string) => {
    const current = entry.disabledBuffIds || [];
    const next = current.includes(buffId) ? current.filter(x => x !== buffId) : [...current, buffId];
    onUpdate(entry.id, { disabledBuffIds: next });
  };

  return (
    <div ref={setNodeRef} style={style} className="space-y-1">
      <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-4 flex items-start gap-4">
        {/* Drag handle + index */}
        <div className="flex items-center gap-2 shrink-0 pt-0.5">
          <span {...attributes} {...listeners} className="text-gray-600 cursor-grab active:cursor-grabbing text-xs" onClick={e => e.stopPropagation()}>⠿</span>
          <span className="text-xs font-mono text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">{String(index + 1).padStart(2, '0')}</span>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {skill ? (
              <>
                <span className="text-sm font-semibold text-gray-100">{skill.name}</span>
                <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded tracking-wider">PHYSICAL</span>
              </>
            ) : (
              <select value={entry.skillId} onChange={e => onUpdate(entry.id, { skillId: e.target.value })}
                className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-sm text-gray-200 focus:outline-none focus:border-indigo-500">
                <option value="" className="bg-gray-900">選擇技能</option>
                {skills.map(s => <option key={s.id} value={s.id} className="bg-gray-900">{s.name}</option>)}
              </select>
            )}
          </div>
          {sr && (
            <div className="text-xs text-gray-500 font-mono">
              {basicValue} (Basic) × {buffMultiplier} (Buff) = <span className="text-gray-300">{finalValue}</span>
            </div>
          )}
        </div>

        {/* Quantity */}
        <div className="shrink-0 text-right">
          <div className="text-[10px] text-gray-500 mb-1 tracking-wider">QUANTITY</div>
          <input type="number" min={1} value={entry.count}
            onChange={e => onUpdate(entry.id, { count: Math.max(1, Number(e.target.value) || 1) })}
            className="w-16 bg-transparent text-2xl font-bold text-gray-100 text-center focus:outline-none font-mono" />
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
          <button onClick={() => setExpanded(!expanded)}
            className={`text-xs cursor-pointer transition-colors ${hasOverrides ? 'text-amber-400' : 'text-gray-600 hover:text-gray-400'}`}
            title="Buff 設定">
            ⚙
          </button>
          <button onClick={() => onRemove(entry.id)} className="text-gray-600 hover:text-red-400 cursor-pointer text-base" title="刪除">
            🗑
          </button>
        </div>
      </div>

      {/* Per-entry buff toggle panel */}
      {expanded && relevantBuffs.length > 0 && (
        <div className="ml-12 flex flex-wrap gap-1 py-1">
          {relevantBuffs.map(b => {
            const off = disabledSet.has(b.id);
            const bGroup = buffGroups.find(g => g.id === b.groupId);
            const color = bGroup?.color || '#64748b';
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

/* ── Main CycleEditor ── */
export default function CycleEditor({ group, groupResult, skills, buffs, buffGroups, characters, zones, onUpdate, onToggleRightPanel, rightPanelOpen }: Props) {
  const [detailResult, setDetailResult] = useState<RotationGroupResult | null>(null);
  const [showSkillPalette, setShowSkillPalette] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const updateEntry = (id: string, patch: Partial<RotationEntry>) => {
    onUpdate({ ...group, entries: group.entries.map(e => e.id === id ? { ...e, ...patch } : e) });
  };
  const removeEntry = (id: string) => {
    onUpdate({ ...group, entries: group.entries.filter(e => e.id !== id) });
  };
  const addSkill = (skillId: string) => {
    onUpdate({ ...group, entries: [...group.entries, { id: uuid(), skillId, count: 1, disabledBuffIds: [] }] });
    setShowSkillPalette(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = group.entries.findIndex(e => e.id === active.id);
      const newIdx = group.entries.findIndex(e => e.id === over.id);
      onUpdate({ ...group, entries: arrayMove(group.entries, oldIdx, newIdx) });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto relative">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded tracking-wider">ACTIVE</span>
              <input
                value={group.name}
                onChange={e => onUpdate({ ...group, name: e.target.value })}
                className="bg-transparent text-xl font-bold text-gray-100 focus:outline-none focus:border-b focus:border-indigo-500"
              />
              <span className="text-xs text-gray-500">編排</span>
            </div>
            <p className="text-xs text-gray-500">從左側技能庫拖放技能，並透過上方開關快速調整增益對比</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-4xl font-bold text-amber-400 cursor-pointer hover:text-amber-300 transition-colors"
              onClick={() => setDetailResult(groupResult)}>
              {fmt(groupResult.totalDamage)}
            </div>
            <div className="text-[10px] text-gray-500 tracking-wider">TOTAL DMG OUTPUT</div>
          </div>
        </div>

        {/* Entries */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={group.entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3 mt-6">
              {group.entries.map((e, i) => (
                <SortableEntry key={e.id} entry={e} index={i} group={group}
                  skills={skills} buffs={buffs} buffGroups={buffGroups}
                  characters={characters} zones={zones}
                  onUpdate={updateEntry} onRemove={removeEntry} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Add Next Skill */}
        <div className="mt-4">
          {showSkillPalette ? (
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-4 space-y-3">
              <div className="text-xs text-gray-400 mb-2">選擇技能</div>
              <div className="flex gap-2 flex-wrap">
                {skills.map(s => (
                  <button key={s.id} onClick={() => addSkill(s.id)}
                    className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 hover:border-indigo-500/50 cursor-pointer transition-colors">
                    + {s.name}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowSkillPalette(false)}
                className="text-xs text-gray-600 hover:text-gray-400 cursor-pointer">取消</button>
            </div>
          ) : (
            <button
              onClick={() => setShowSkillPalette(true)}
              className="w-full border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-xl py-6 flex flex-col items-center gap-1 cursor-pointer transition-colors group"
            >
              <span className="text-lg text-gray-600 group-hover:text-gray-400">+</span>
              <span className="text-xs text-gray-600 group-hover:text-gray-400 tracking-wider font-medium">ADD NEXT SKILL</span>
            </button>
          )}
        </div>

        {group.entries.length === 0 && !showSkillPalette && (
          <p className="text-gray-600 text-xs text-center py-4 mt-2">點擊上方按鈕加入技能，或從左側技能庫拖放</p>
        )}
      </div>

      {/* Right panel toggle button */}
      <button
        onClick={onToggleRightPanel}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-12 bg-gray-800 border border-gray-700 border-r-0 rounded-l-lg flex items-center justify-center text-gray-500 hover:text-gray-300 cursor-pointer transition-colors text-xs"
      >
        {rightPanelOpen ? '›' : '‹'}
      </button>

      {detailResult && <DamageDetailModal result={detailResult} onClose={() => setDetailResult(null)} />}
    </div>
  );
}
