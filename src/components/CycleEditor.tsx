import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useShallow } from 'zustand/shallow';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppStore } from '../stores/appStore';
import type { Skill, Buff, BuffGroup, Character, DamageZone, RotationGroup, RotationEntry } from '../types';
import { calculateSkillDamage, type RotationGroupResult } from '../utils/damage';
import Modal from './Modal';
import { Tooltip } from './ui';

interface Props {
  groupResult: RotationGroupResult;
}

function fmt(n: number) { return Math.round(n).toLocaleString(); }

/* ── Damage Detail Modal ── */
function DamageDetailModal({ result, onClose }: { result: RotationGroupResult; onClose: () => void }) {
  return (
    <Modal open title={`${result.group.name} — 傷害詳情`} onClose={onClose} width="max-w-2xl">
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-xs text-ef-ink-3">總傷害</div>
          <div className="text-3xl font-bold text-amber-400">{fmt(result.totalDamage)}</div>
        </div>
        {result.skillResults.map(({ result: sr, count, subtotal }, i) => (
          <SkillDetailCard key={i} sr={sr} count={count} subtotal={subtotal} />
        ))}
        {result.skillResults.length === 0 && (
          <p className="text-ef-ink-4 text-sm text-center py-4">此循環尚無技能</p>
        )}
      </div>
    </Modal>
  );
}

function SkillDetailCard({ sr, count, subtotal }: { sr: ReturnType<typeof calculateSkillDamage>; count: number; subtotal: number }) {
  return (
    <div className="bg-ef-card border border-ef-line rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-ef-ink">{sr.skill.name}</span>
          {sr.character && <span className="text-xs text-ef-ink-3 ml-2">({sr.character.name})</span>}
          {count > 1 && <span className="text-xs text-ef-ink-3 ml-2">×{count}</span>}
        </div>
        <span className="text-base font-bold text-amber-400">{fmt(subtotal)}</span>
      </div>
      <div className="text-xs text-ef-ink-3">
        攻擊力: <span className="text-ef-gold">{fmt(sr.attackPower)}</span>
        {count > 1 && <> · 單次: <span className="text-ef-ink-2">{fmt(sr.finalDamage)}</span></>}
      </div>
      <div className="space-y-1.5">
        {sr.zones.map(zb => (
          <div key={zb.zone.id}>
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: zb.zone.color }}>{zb.zone.icon} {zb.zone.displayName}</span>
              <span className="text-ef-ink-2 font-mono">×{zb.multiplier.toFixed(4)}</span>
            </div>
            <div className="ml-4 text-xs text-ef-ink-4 space-y-0.5">
              {zb.sources.map((s, j) => (
                <div key={j} className="flex justify-between"><span>{s.buffName}</span><span>{s.value}%</span></div>
              ))}
              {zb.sources.length > 1 && (
                <div className="flex justify-between text-ef-ink-4 border-t border-ef-line pt-0.5"><span>合計</span><span>{zb.total}%</span></div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs text-ef-ink-4 border-t border-ef-line pt-1.5 break-all">
        <span className="text-ef-ink-3">公式: </span>{fmt(sr.attackPower)}
        {sr.zones.map(zb => (
          <span key={zb.zone.id}>{' × '}<span style={{ color: zb.zone.color }}>{zb.multiplier.toFixed(4)}</span></span>
        ))}
        {' = '}<span className="text-amber-400">{fmt(sr.finalDamage)}</span>
        {count > 1 && <span> × {count} = <span className="text-amber-400">{fmt(subtotal)}</span></span>}
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: entry.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  const skill = skills.find(s => s.id === entry.skillId);
  const enabledBuffIds = skill?.enabledBuffIds || [];
  const cycleDisabledSet = new Set(group.disabledBuffIds || []);
  const entryDisabledSet = new Set(entry.disabledBuffIds || []);

  // Exclude buffs disabled globally or at cycle level
  const relevantBuffs = buffs.filter(b =>
    b.enabled &&
    enabledBuffIds.includes(b.id) &&
    !cycleDisabledSet.has(b.id)
  );

  // Sort relevant buffs by group order then position within group
  const sortedRelevantBuffs = [...relevantBuffs].sort((a, b) => {
    const aGroupIdx = a.groupId ? buffGroups.findIndex(g => g.id === a.groupId) : -1;
    const bGroupIdx = b.groupId ? buffGroups.findIndex(g => g.id === b.groupId) : -1;
    if (aGroupIdx !== bGroupIdx) return aGroupIdx - bGroupIdx;
    return buffs.indexOf(a) - buffs.indexOf(b);
  });

  // Calculate inline damage for this entry
  const sr = skill
    ? calculateSkillDamage(skill, characters, buffs, zones, entry.disabledBuffIds || [], group.disabledBuffIds || [])
    : null;

  // Build formula: attackPower × skillZone × otherZones...
  const formulaParts: React.ReactNode[] = [];
  if (sr) {
    formulaParts.push(<span key="atk" className="text-ef-ink-2">{fmt(sr.attackPower)}</span>);
    sr.zones.forEach((zb, i) => {
      formulaParts.push(<span key={`sep${i}`} className="text-ef-ink-4"> × </span>);
      formulaParts.push(
        <Tooltip key={`z${i}`} label={`${zb.zone.icon} ${zb.zone.displayName}`}>
          <span style={{ color: zb.zone.color }}>
            {zb.multiplier.toFixed(2)}
          </span>
        </Tooltip>
      );
    });
    formulaParts.push(<span key="eq" className="text-ef-ink-4"> = </span>);
    formulaParts.push(<span key="res" className="text-ef-ink">{sr.finalDamage.toFixed(1)}</span>);
  }

  const toggleBuffForEntry = (buffId: string) => {
    const current = entry.disabledBuffIds || [];
    const next = current.includes(buffId) ? current.filter(x => x !== buffId) : [...current, buffId];
    onUpdate(entry.id, { disabledBuffIds: next });
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="bg-ef-card border border-ef-line rounded-xl p-4">
        <div className="flex items-start gap-3">
          {/* Drag handle + index */}
          <div className="flex items-center gap-2 shrink-0 pt-0.5">
            <span {...attributes} {...listeners} className="text-ef-ink-4 cursor-grab active:cursor-grabbing text-xs" onClick={e => e.stopPropagation()}>⠿</span>
            <span className="text-xs font-mono text-ef-ink-3 bg-ef-panel px-1.5 py-0.5 rounded">{String(index + 1).padStart(2, '0')}</span>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Skill name or selector */}
            {skill ? (
              <div className="text-sm font-semibold text-ef-ink mb-1">{skill.name}</div>
            ) : (
              <select value={entry.skillId} onChange={e => onUpdate(entry.id, { skillId: e.target.value })}
                className="bg-ef-input border border-ef-line rounded-lg px-2 py-1 text-sm text-ef-ink focus:outline-none focus:border-ef-gold mb-1 w-full">
                <option value="">選擇技能</option>
                {skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            )}

            {sr && (
              <div className="text-xs font-mono mb-2">{formulaParts}</div>
            )}

            {sortedRelevantBuffs.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {sortedRelevantBuffs.map(b => {
                  const off = entryDisabledSet.has(b.id);
                  const bGroup = buffGroups.find(g => g.id === b.groupId);
                  const color = bGroup?.color || '#64748b';
                  const zone = zones.find(z => z.id === b.zoneId);
                  const zoneLabel = zone ? `${zone.icon} ${zone.displayName}` : '未設定分區';
                  const tooltipLabel = `${zoneLabel}／${bGroup?.name || '未分組'}`;
                  return (
                    <Tooltip key={b.id} label={tooltipLabel}>
                      <button onClick={() => toggleBuffForEntry(b.id)}
                        className={`px-1.5 py-0.5 rounded text-xs cursor-pointer border transition-all ${
                          off ? 'border-ef-line text-ef-ink-4 opacity-40 line-through' : 'text-white'
                        }`}
                        style={off ? undefined : { backgroundColor: color + '25', borderColor: color + '60', color }}>
                        {b.icon} {b.name}
                      </button>
                    </Tooltip>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="shrink-0 text-right">
            <div className="text-xs text-ef-ink-3 mb-0.5 tracking-wider">施放次數</div>
            <input type="number" min={1} value={entry.count}
              onChange={e => onUpdate(entry.id, { count: Math.max(1, Number(e.target.value) || 1) })}
              className="w-20 bg-ef-input border border-ef-line rounded-lg text-lg font-bold text-ef-ink text-center focus:outline-none focus:border-ef-gold font-mono py-0.5 px-2" />
          </div>

          {/* Delete */}
          <button onClick={() => onRemove(entry.id)} className="text-ef-ink-4 hover:text-red-400 cursor-pointer shrink-0 pt-0.5 text-sm" title="刪除">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main CycleEditor ── */
export default function CycleEditor({ groupResult }: Props) {
  const { skills, buffs, buffGroups, characters, zones, activeRotationId, rotationGroups, updateRotationGroup } = useAppStore(useShallow(s => ({
    skills: s.skills,
    buffs: s.buffs,
    buffGroups: s.buffGroups,
    characters: s.characters,
    zones: s.zones,
    activeRotationId: s.activeRotationId,
    rotationGroups: s.rotationGroups,
    updateRotationGroup: s.updateRotationGroup,
  })));

  const group = rotationGroups.find(g => g.id === activeRotationId)!;
  const [detailResult, setDetailResult] = useState<RotationGroupResult | null>(null);
  const [showSkillPalette, setShowSkillPalette] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const updateEntry = (id: string, patch: Partial<RotationEntry>) => {
    updateRotationGroup({ ...group, entries: group.entries.map(e => e.id === id ? { ...e, ...patch } : e) });
  };
  const removeEntry = (id: string) => {
    updateRotationGroup({ ...group, entries: group.entries.filter(e => e.id !== id) });
  };
  const addSkill = (skillId: string) => {
    updateRotationGroup({ ...group, entries: [...group.entries, { id: uuid(), skillId, count: 1, disabledBuffIds: [] }] });
    setShowSkillPalette(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = group.entries.findIndex(e => e.id === active.id);
      const newIdx = group.entries.findIndex(e => e.id === over.id);
      updateRotationGroup({ ...group, entries: arrayMove(group.entries, oldIdx, newIdx) });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto relative">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <input
                value={group.name}
                onChange={e => updateRotationGroup({ ...group, name: e.target.value })}
                className="bg-transparent text-xl font-bold text-ef-ink focus:outline-none border-b border-transparent focus:border-ef-gold"
              />
            </div>
            <p className="text-xs text-ef-ink-3">新增技能到循環中計算傷害，設定個別技能的 Buff 生效狀態，或切換整體循環 Buff 生效狀態。</p>
          </div>
          <div className="text-right shrink-0 ml-4">
            <div className="text-4xl font-bold text-amber-400 cursor-pointer hover:text-amber-300 transition-colors"
              onClick={() => setDetailResult(groupResult)}>
              {fmt(groupResult.totalDamage)}
            </div>
            <div className="text-xs text-ef-ink-3 tracking-wider">TOTAL DMG OUTPUT</div>
          </div>
        </div>

        {/* Entries */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={group.entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
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
            <div className="border-2 border-dashed border-ef-line rounded-xl p-4 space-y-3">
              <div className="text-xs text-ef-ink-3 mb-2">選擇技能</div>
              <div className="flex gap-2 flex-wrap">
                {skills.map(s => (
                  <button key={s.id} onClick={() => addSkill(s.id)}
                    className="px-3 py-1.5 bg-ef-card border border-ef-line rounded-lg text-xs text-ef-ink-2 hover:border-ef-gold/50 cursor-pointer transition-colors">
                    + {s.name}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowSkillPalette(false)}
                className="text-xs text-ef-ink-4 hover:text-ef-ink-2 cursor-pointer">取消</button>
            </div>
          ) : (
            <button
              onClick={() => setShowSkillPalette(true)}
              className="w-full border-2 border-dashed border-ef-line hover:border-ef-gold/40 rounded-xl py-5 flex flex-col items-center gap-1 cursor-pointer transition-colors group"
            >
              <span className="text-lg text-ef-ink-4 group-hover:text-ef-ink-2">+</span>
              <span className="text-xs text-ef-ink-4 group-hover:text-ef-ink-2 tracking-wider font-medium">新增技能</span>
            </button>
          )}
        </div>

        {group.entries.length === 0 && !showSkillPalette && (
          <p className="text-ef-ink-4 text-xs text-center py-4 mt-2">點擊上方按鈕加入技能</p>
        )}
      </div>

      {detailResult && <DamageDetailModal result={detailResult} onClose={() => setDetailResult(null)} />}
    </div>
  );
}
