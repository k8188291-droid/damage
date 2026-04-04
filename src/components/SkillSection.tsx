import { useState, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent, type DragOverEvent, type DragStartEvent, DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, useSortable, rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Skill, SkillGroup, Buff, BuffGroup, Character, DamageZone } from '../types';
import Modal from './Modal';

interface Props {
  skills: Skill[];
  buffs: Buff[];
  buffGroups: BuffGroup[];
  characters: Character[];
  zones: DamageZone[];
  skillGroups: SkillGroup[];
  onChange: (skills: Skill[]) => void;
  onSkillGroupsChange: (groups: SkillGroup[]) => void;
  pushUndo: (label: string, restore: () => void) => void;
}

const COLORS = ['#ef4444','#f97316','#eab308','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899','#f43f5e','#14b8a6','#a855f7','#64748b'];

/* ── Skill Modal ── */
function SkillModal({ skill, buffs, buffGroups, characters, zones, onSave, onClose }: {
  skill: Skill; buffs: Buff[]; buffGroups: BuffGroup[]; characters: Character[]; zones: DamageZone[];
  onSave: (s: Skill) => void; onClose: () => void;
}) {
  const [d, setD] = useState({ ...skill });
  const p = (patch: Partial<Skill>) => setD(v => ({ ...v, ...patch }));

  const toggleBuff = (id: string) => {
    p({ enabledBuffIds: d.enabledBuffIds.includes(id) ? d.enabledBuffIds.filter(x => x !== id) : [...d.enabledBuffIds, id] });
  };

  // Group buffs by zone for display
  const buffsByZone = new Map<string, Buff[]>();
  for (const b of buffs) {
    const key = b.zoneId;
    if (!buffsByZone.has(key)) buffsByZone.set(key, []);
    buffsByZone.get(key)!.push(b);
  }

  return (
    <Modal open title="編輯技能" onClose={onClose} width="max-w-xl">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <label className="block text-xs text-gray-400 mb-1">技能名稱</label>
            <input value={d.name} onChange={e => p({ name: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">角色</label>
            <select value={d.characterId} onChange={e => p({ characterId: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500">
              <option value="">選擇角色</option>
              {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">技能倍率 (%)</label>
            <input type="number" value={d.skillMultiplier || ''} onChange={e => p({ skillMultiplier: Number(e.target.value) || 0 })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500" placeholder="100" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-gray-400 font-medium">啟用的 Buff</label>
            <div className="flex gap-3">
              <button onClick={() => p({ enabledBuffIds: buffs.map(b => b.id) })} className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer">全選</button>
              <button onClick={() => p({ enabledBuffIds: [] })} className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer">全不選</button>
            </div>
          </div>
          {buffs.length === 0 ? (
            <p className="text-xs text-gray-600">尚未設定 Buff</p>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {Array.from(buffsByZone.entries()).map(([zoneId, zoneBuffs]) => {
                const zone = zones.find(z => z.id === zoneId);
                return (
                  <div key={zoneId}>
                    {zone && <div className="text-xs font-medium mb-1" style={{ color: zone.color }}>{zone.icon} {zone.displayName}</div>}
                    <div className="flex flex-wrap gap-1.5">
                      {zoneBuffs.map(b => {
                        const on = d.enabledBuffIds.includes(b.id);
                        const group = buffGroups.find(g => g.id === b.groupId);
                        const chipColor = group?.color || '#64748b';
                        return (
                          <button key={b.id} onClick={() => toggleBuff(b.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer border transition-all ${on ? 'text-white border-opacity-60' : 'border-gray-700 text-gray-500 opacity-40 hover:opacity-70'}`}
                            style={on ? { backgroundColor: chipColor + '30', borderColor: chipColor } : undefined}>
                            {b.icon} {b.name} ({b.value}%)
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button onClick={() => onSave(d)} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors cursor-pointer">儲存</button>
      </div>
    </Modal>
  );
}

/* ── Skill Group Edit Modal ── */
function SkillGroupEditModal({ group, onSave, onClose }: {
  group: SkillGroup; onSave: (g: SkillGroup) => void; onClose: () => void;
}) {
  const [d, setD] = useState({ ...group });

  return (
    <Modal open title="編輯技能群組" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">群組名稱</label>
          <input value={d.name} onChange={e => setD(v => ({ ...v, name: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-2">顏色</label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map(c => (
              <button key={c} onClick={() => setD(v => ({ ...v, color: c }))}
                className={`w-7 h-7 rounded-full cursor-pointer border-2 transition-transform ${d.color === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
        <button onClick={() => onSave(d)} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors cursor-pointer">儲存</button>
      </div>
    </Modal>
  );
}

/* ── Sortable Skill Card ── */
function SortableSkillCard({ skill, char, buffs, buffGroups, onClick, onCopy, onRemove }: {
  skill: Skill; char: Character | undefined; buffs: Buff[]; buffGroups: BuffGroup[];
  onClick: () => void; onCopy: () => void; onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: skill.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  const enabledBuffs = buffs.filter(b => skill.enabledBuffIds.includes(b.id));
  const maxShow = 6;
  const shown = enabledBuffs.slice(0, maxShow);
  const remaining = enabledBuffs.length - maxShow;

  return (
    <div ref={setNodeRef} style={style}
      className="bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-2.5 cursor-pointer hover:border-indigo-500/50 transition-colors group"
      onClick={onClick}>
      <div className="flex items-center gap-3">
        <span {...attributes} {...listeners} className="text-gray-600 cursor-grab active:cursor-grabbing text-xs" onClick={e => e.stopPropagation()}>⠿</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-200">{skill.name}</div>
          <div className="text-xs text-gray-500">
            {char ? char.name : '未指定'} · {skill.skillMultiplier}% · {enabledBuffs.length} buff
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={e => { e.stopPropagation(); onCopy(); }} className="text-gray-600 hover:text-indigo-400 text-xs cursor-pointer" title="複製">⧉</button>
          <button onClick={e => { e.stopPropagation(); onRemove(); }} className="text-gray-600 hover:text-red-400 text-xs cursor-pointer" title="刪除">✕</button>
        </div>
      </div>
      {/* Inline buff chips */}
      {shown.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {shown.map(b => {
            const group = buffGroups.find(g => g.id === b.groupId);
            const color = group?.color || '#64748b';
            return (
              <span key={b.id} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] border"
                style={{ backgroundColor: color + '20', borderColor: color + '40', color: color }}>
                {b.icon} {b.name}
              </span>
            );
          })}
          {remaining > 0 && <span className="text-[10px] text-gray-500 px-1 py-0.5">+{remaining}</span>}
        </div>
      )}
    </div>
  );
}

/* ── Overlay for dragging ── */
function SkillCardOverlay({ skill, char }: { skill: Skill; char: Character | undefined }) {
  return (
    <div className="bg-gray-800 border border-indigo-500 rounded-xl px-4 py-2.5 shadow-xl shadow-indigo-500/20">
      <div className="text-sm font-medium text-gray-200">{skill.name}</div>
      <div className="text-xs text-gray-500">{char ? char.name : '未指定'} · {skill.skillMultiplier}%</div>
    </div>
  );
}

/* ── Droppable placeholder for empty groups ── */
function DroppableSkillGroupPlaceholder({ groupId }: { groupId: string }) {
  const { setNodeRef } = useSortable({ id: `skill-group-drop:${groupId}` });
  return (
    <div ref={setNodeRef} className="text-xs text-gray-600 text-center py-2">
      拖曳技能到此群組
    </div>
  );
}

/* ── Main Section ── */
export default function SkillSection({ skills, buffs, buffGroups, characters, zones, skillGroups, onChange, onSkillGroupsChange, pushUndo }: Props) {
  const [editing, setEditing] = useState<Skill | null>(null);
  const [editingGroup, setEditingGroup] = useState<SkillGroup | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const skillsRef = useRef(skills);
  skillsRef.current = skills;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const save = (s: Skill) => {
    const exists = skills.find(x => x.id === s.id);
    onChange(exists ? skills.map(x => x.id === s.id ? s : x) : [...skills, s]);
    setEditing(null);
  };

  const remove = (id: string) => {
    const skill = skills.find(s => s.id === id);
    if (!skill) return;
    const prev = [...skills];
    onChange(skills.filter(s => s.id !== id));
    pushUndo(`已刪除技能: ${skill.name}`, () => onChange(prev));
  };

  const copy = (s: Skill) => {
    const c = { ...s, id: uuid(), name: `${s.name} (複製)`, enabledBuffIds: [...s.enabledBuffIds], order: skills.length };
    const idx = skills.findIndex(x => x.id === s.id);
    const next = [...skills];
    next.splice(idx + 1, 0, c);
    onChange(next);
  };

  const startNew = () => setEditing({
    id: uuid(), name: `技能 ${skills.length + 1}`, characterId: characters[0]?.id || '',
    skillMultiplier: 100, enabledBuffIds: [], order: skills.length, groupId: '',
  });

  const saveGroup = (g: SkillGroup) => {
    const exists = skillGroups.find(x => x.id === g.id);
    onSkillGroupsChange(exists ? skillGroups.map(x => x.id === g.id ? g : x) : [...skillGroups, g]);
    setEditingGroup(null);
  };

  const removeGroup = (id: string) => {
    const grp = skillGroups.find(g => g.id === id);
    if (!grp) return;
    const prevGroups = [...skillGroups];
    const prevSkills = [...skills];
    onSkillGroupsChange(skillGroups.filter(g => g.id !== id));
    onChange(skills.map(s => s.groupId === id ? { ...s, groupId: '' } : s));
    pushUndo(`已刪除技能群組: ${grp.name}`, () => { onSkillGroupsChange(prevGroups); onChange(prevSkills); });
  };

  const newGroup = () => {
    setEditingGroup({ id: uuid(), name: `群組 ${skillGroups.length + 1}`, color: COLORS[skillGroups.length % COLORS.length] });
  };

  // Find group for a skill (for cross-group DnD)
  const findGroupForSkill = (skillId: string): string => {
    const s = skills.find(x => x.id === skillId);
    return s?.groupId || '';
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeSkillId = active.id as string;
    const overId = over.id as string;

    let targetGroupId: string | undefined;
    if (overId.startsWith('skill-group-drop:')) {
      targetGroupId = overId.replace('skill-group-drop:', '');
    } else {
      targetGroupId = findGroupForSkill(overId);
    }

    if (targetGroupId === undefined) return;

    const currentGroupId = findGroupForSkill(activeSkillId);
    if (currentGroupId !== targetGroupId) {
      onChange(skillsRef.current.map(s => s.id === activeSkillId ? { ...s, groupId: targetGroupId } : s));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const overId = over.id as string;
    if (overId.startsWith('skill-group-drop:')) return;

    const oldIdx = skills.findIndex(s => s.id === active.id);
    const newIdx = skills.findIndex(s => s.id === over.id);
    if (oldIdx !== -1 && newIdx !== -1) {
      onChange(arrayMove(skills, oldIdx, newIdx));
    }
  };

  // Group skills
  const ungroupedSkills = skills.filter(s => !s.groupId);
  const groupedMap = new Map<string, Skill[]>();
  for (const g of skillGroups) groupedMap.set(g.id, []);
  for (const s of skills) {
    if (s.groupId && groupedMap.has(s.groupId)) {
      groupedMap.get(s.groupId)!.push(s);
    }
  }

  const activeSkill = activeId ? skills.find(s => s.id === activeId) : null;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-100">⚔️ 技能</h2>
        <div className="flex gap-2">
          <button onClick={newGroup} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-medium transition-colors cursor-pointer">+ 群組</button>
          <button onClick={startNew} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-medium transition-colors cursor-pointer">+ 新增</button>
        </div>
      </div>

      {skills.length === 0 && skillGroups.length === 0 ? (
        <p className="text-gray-600 text-sm text-center py-4">尚未新增技能</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter}
          onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>

          {/* Ungrouped */}
          {(ungroupedSkills.length > 0 || skillGroups.length > 0) && (
            <div className="mb-3">
              {skillGroups.length > 0 && <div className="text-xs text-gray-500 mb-1.5">未分組</div>}
              <SortableContext items={[...ungroupedSkills.map(s => s.id), 'skill-group-drop:']} strategy={rectSortingStrategy}>
                <div className="flex gap-2 flex-wrap min-h-[40px]">
                  {ungroupedSkills.map(s => (
                    <SortableSkillCard key={s.id} skill={s}
                      char={characters.find(c => c.id === s.characterId)}
                      buffs={buffs} buffGroups={buffGroups}
                      onClick={() => setEditing({ ...s })}
                      onCopy={() => copy(s)}
                      onRemove={() => remove(s.id)} />
                  ))}
                </div>
              </SortableContext>
            </div>
          )}

          {/* Skill Groups */}
          {skillGroups.map(g => {
            const groupSkills = groupedMap.get(g.id) || [];
            return (
              <div key={g.id} className="mb-3 border border-gray-700/50 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/40" style={{ borderLeft: `3px solid ${g.color}` }}>
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                  <span className="text-sm font-medium text-gray-200 flex-1">{g.name}</span>
                  <button onClick={() => setEditingGroup({ ...g })} className="text-gray-500 hover:text-indigo-400 text-xs cursor-pointer">編輯</button>
                  <button onClick={() => removeGroup(g.id)} className="text-gray-500 hover:text-red-400 text-xs cursor-pointer">✕</button>
                </div>
                <SortableContext items={[...groupSkills.map(s => s.id), `skill-group-drop:${g.id}`]} strategy={rectSortingStrategy}>
                  <div className="flex gap-2 flex-wrap p-2 min-h-[40px]">
                    {groupSkills.map(s => (
                      <SortableSkillCard key={s.id} skill={s}
                        char={characters.find(c => c.id === s.characterId)}
                        buffs={buffs} buffGroups={buffGroups}
                        onClick={() => setEditing({ ...s })}
                        onCopy={() => copy(s)}
                        onRemove={() => remove(s.id)} />
                    ))}
                    {groupSkills.length === 0 && (
                      <DroppableSkillGroupPlaceholder groupId={g.id} />
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}

          <DragOverlay>
            {activeSkill ? (
              <SkillCardOverlay skill={activeSkill} char={characters.find(c => c.id === activeSkill.characterId)} />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {editing && (
        <SkillModal skill={editing} buffs={buffs} buffGroups={buffGroups} characters={characters} zones={zones}
          onSave={save} onClose={() => setEditing(null)} />
      )}
      {editingGroup && (
        <SkillGroupEditModal group={editingGroup} onSave={saveGroup} onClose={() => setEditingGroup(null)} />
      )}
    </section>
  );
}
