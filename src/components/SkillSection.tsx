import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useShallow } from 'zustand/shallow';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent, type DragStartEvent, DragOverlay, useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppStore } from '../stores/appStore';
import { useUndoStore } from '../stores/undoStore';
import type { Skill, SkillGroup, Buff, BuffGroup, Character, DamageZone, AutoApplyPreview } from '../types';
import { DAMAGE_TYPE_META, BUFF_CONDITION_META, type DamageType } from '../types';
import Modal from './Modal';
import { ColorDotPicker, COLORS } from './ui';

/* ── Skill Modal ── */
function SkillModal({ skill, buffs, buffGroups, characters, zones, skillGroups, onSave, onClose }: {
  skill: Skill; buffs: Buff[]; buffGroups: BuffGroup[]; characters: Character[]; zones: DamageZone[]; skillGroups: SkillGroup[];
  onSave: (s: Skill) => void; onClose: () => void;
}) {
  const [d, setD] = useState({ ...skill });
  const [groupBy, setGroupBy] = useState<'zone' | 'group'>('group');
  const p = (patch: Partial<Skill>) => setD(v => ({ ...v, ...patch }));

  const toggleBuff = (id: string) => {
    p({ enabledBuffIds: d.enabledBuffIds.includes(id) ? d.enabledBuffIds.filter(x => x !== id) : [...d.enabledBuffIds, id] });
  };

  const buffsByZone = new Map<string, Buff[]>();
  for (const b of buffs) {
    if (!buffsByZone.has(b.zoneId)) buffsByZone.set(b.zoneId, []);
    buffsByZone.get(b.zoneId)!.push(b);
  }

  const buffsByGroup = new Map<string, Buff[]>();
  buffsByGroup.set('', []);
  for (const g of buffGroups) buffsByGroup.set(g.id, []);
  for (const b of buffs) {
    const key = b.groupId || '';
    if (!buffsByGroup.has(key)) buffsByGroup.set(key, []);
    buffsByGroup.get(key)!.push(b);
  }

  return (
    <Modal open title="編輯技能" onClose={onClose} width="max-w-2xl">
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">技能名稱</label>
            <input value={d.name} onChange={e => p({ name: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500" />
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
          <div>
            <label className="block text-xs text-gray-400 mb-1">群組</label>
            <select value={d.groupId} onChange={e => p({ groupId: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500">
              <option value="">未分組</option>
              {skillGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">傷害類型</label>
          <div className="flex items-center bg-gray-800 rounded-lg border border-gray-700 overflow-hidden w-fit">
            {(Object.keys(DAMAGE_TYPE_META) as DamageType[]).map(dt => {
              const meta = DAMAGE_TYPE_META[dt];
              const active = d.damageType === dt;
              return (
                <button key={dt} onClick={() => p({ damageType: dt })}
                  className="px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors border-r border-gray-700 last:border-r-0"
                  style={active ? { backgroundColor: meta.color + '33', color: meta.color } : { color: '#9ca3af' }}>
                  {meta.icon} {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-400 font-medium">啟用的 Buff</label>
              <div className="flex items-center bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <button onClick={() => setGroupBy('group')}
                  className={`px-2 py-1 text-xs font-medium cursor-pointer transition-colors ${groupBy === 'group' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}>
                  依群組
                </button>
                <button onClick={() => setGroupBy('zone')}
                  className={`px-2 py-1 text-xs font-medium cursor-pointer transition-colors ${groupBy === 'zone' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}>
                  依分區
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => p({ enabledBuffIds: buffs.map(b => b.id) })} className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer">全選</button>
              <button onClick={() => p({ enabledBuffIds: [] })} className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer">全不選</button>
            </div>
          </div>
          {buffs.length === 0 ? (
            <p className="text-xs text-gray-600">尚未設定 Buff</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {groupBy === 'zone' ? (
                Array.from(buffsByZone.entries()).map(([zoneId, zoneBuffs]) => {
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
                              {b.icon} {b.name} ({b.value}%){b.condition && b.condition !== 'all' ? ` · ${BUFF_CONDITION_META[b.condition]?.label}` : ''}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                Array.from(buffsByGroup.entries()).map(([gId, groupBuffs]) => {
                  if (groupBuffs.length === 0) return null;
                  const bg = buffGroups.find(g => g.id === gId);
                  const label = bg ? bg.name : '未分組';
                  const labelColor = bg?.color || '#64748b';
                  return (
                    <div key={gId || '__ungrouped'}>
                      <div className="text-xs font-medium mb-1" style={{ color: labelColor }}>
                        {bg ? '●' : '○'} {label}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {groupBuffs.map(b => {
                          const on = d.enabledBuffIds.includes(b.id);
                          const zone = zones.find(z => z.id === b.zoneId);
                          const chipColor = zone?.color || '#64748b';
                          return (
                            <button key={b.id} onClick={() => toggleBuff(b.id)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer border transition-all ${on ? 'text-white border-opacity-60' : 'border-gray-700 text-gray-500 opacity-40 hover:opacity-70'}`}
                              style={on ? { backgroundColor: chipColor + '30', borderColor: chipColor } : undefined}>
                              {b.icon} {b.name} ({b.value}%){b.condition && b.condition !== 'all' ? ` · ${BUFF_CONDITION_META[b.condition]?.label}` : ''}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        <button onClick={() => onSave(d)} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors cursor-pointer">儲存</button>
      </div>
    </Modal>
  );
}

/* ── Sortable Skill Card ── */
function SortableSkillCard({ skill, char, onClick, onCopy, onRemove }: {
  skill: Skill; char: Character | undefined;
  onClick: () => void; onCopy: () => void; onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: skill.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div ref={setNodeRef} style={style}
      className="bg-gray-800/60 border border-gray-700 rounded-xl px-3 py-2 cursor-pointer hover:border-indigo-500/50 transition-colors group"
      onClick={onClick}>
      <div className="flex items-center gap-2">
        <span {...attributes} {...listeners} className="text-gray-600 cursor-grab active:cursor-grabbing text-xs" onClick={e => e.stopPropagation()}>⠿</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-200 truncate">{skill.name}</span>
            <span className="text-xs text-indigo-400 font-mono shrink-0 ml-2">{skill.skillMultiplier}%</span>
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1.5">
            <span>{char ? char.name : '未指定'}</span>
            {(() => {
              const m = DAMAGE_TYPE_META[skill.damageType ?? 'physical'];
              return m ? (
                <span className="px-1 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: m.color + '22', color: m.color }}>
                  {m.icon} {m.label}
                </span>
              ) : null;
            })()}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={e => { e.stopPropagation(); onCopy(); }} className="text-gray-600 hover:text-indigo-400 text-xs cursor-pointer" title="複製">⧉</button>
          <button onClick={e => { e.stopPropagation(); onRemove(); }} className="text-gray-600 hover:text-red-400 text-xs cursor-pointer" title="刪除">✕</button>
        </div>
      </div>
    </div>
  );
}

/* ── Overlay for dragging ── */
function SkillCardOverlay({ skill, char }: { skill: Skill; char: Character | undefined }) {
  return (
    <div className="bg-gray-800 border border-indigo-500 rounded-xl px-3 py-2 shadow-xl shadow-indigo-500/20 cursor-grabbing">
      <div className="text-sm font-medium text-gray-200">{skill.name}</div>
      <div className="text-xs text-gray-500">{char ? char.name : '未指定'} · {skill.skillMultiplier}%</div>
    </div>
  );
}

/* ── Droppable skill group container ── */
function DroppableSkillArea({ groupId, children, isEmpty }: {
  groupId: string; children: React.ReactNode; isEmpty: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `skill-group-drop:${groupId}` });
  return (
    <div ref={setNodeRef}
      className={`space-y-1.5 p-1.5 min-h-[40px] rounded-lg transition-colors ${isOver ? 'bg-indigo-500/10 ring-1 ring-inset ring-indigo-500/30' : ''}`}>
      {children}
      {isEmpty && (
        <div className="w-full text-xs text-gray-600 text-center py-2">
          {isOver ? '放開以移入此群組' : '拖曳技能到此群組'}
        </div>
      )}
    </div>
  );
}

/* ── Main Section ── */
export default function SkillSection() {
  const { skills, buffs, buffGroups, characters, zones, skillGroups } = useAppStore(useShallow(s => ({
    skills: s.skills, buffs: s.buffs, buffGroups: s.buffGroups,
    characters: s.characters, zones: s.zones, skillGroups: s.skillGroups,
  })));
  const setSkills = useAppStore(s => s.setSkills);
  const setSkillGroups = useAppStore(s => s.setSkillGroups);
  const previewAutoApply = useAppStore(s => s.previewAutoApply);
  const applyAutoApplyPreview = useAppStore(s => s.applyAutoApplyPreview);
  const pushUndo = useUndoStore(s => s.pushUndo);

  const [editing, setEditing] = useState<Skill | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [autoApplyPreview, setAutoApplyPreview] = useState<AutoApplyPreview[] | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const save = (s: Skill) => {
    const exists = skills.find(x => x.id === s.id);
    setSkills(exists ? skills.map(x => x.id === s.id ? s : x) : [...skills, s]);
    setEditing(null);
  };

  const remove = (id: string) => {
    const skill = skills.find(s => s.id === id);
    if (!skill) return;
    const prev = [...skills];
    setSkills(skills.filter(s => s.id !== id));
    pushUndo(`已刪除技能: ${skill.name}`, () => setSkills(prev));
  };

  const copy = (s: Skill) => {
    const c = { ...s, id: uuid(), name: `${s.name} (複製)`, enabledBuffIds: [...s.enabledBuffIds], order: skills.length };
    const idx = skills.findIndex(x => x.id === s.id);
    const next = [...skills];
    next.splice(idx + 1, 0, c);
    setSkills(next);
  };

  const startNew = () => setEditing({
    id: uuid(), name: `技能 ${skills.length + 1}`, characterId: characters[0]?.id || '',
    skillMultiplier: 100, enabledBuffIds: [], order: skills.length, groupId: '',
    damageType: 'physical',
  });

  const updateSkillGroup = (g: SkillGroup) => {
    setSkillGroups(skillGroups.map(x => x.id === g.id ? g : x));
  };

  const cycleSkillGroupColor = (g: SkillGroup) => {
    const idx = COLORS.indexOf(g.color);
    updateSkillGroup({ ...g, color: COLORS[(idx + 1) % COLORS.length] });
  };

  const addSkillGroup = () => {
    setSkillGroups([...skillGroups, { id: uuid(), name: `群組 ${skillGroups.length + 1}`, color: COLORS[skillGroups.length % COLORS.length] }]);
  };

  const removeSkillGroup = (id: string) => {
    const grp = skillGroups.find(g => g.id === id);
    if (!grp) return;
    const prevGroups = [...skillGroups];
    const prevSkills = [...skills];
    setSkillGroups(skillGroups.filter(g => g.id !== id));
    setSkills(skills.map(s => s.groupId === id ? { ...s, groupId: '' } : s));
    pushUndo(`已刪除技能群組: ${grp.name}`, () => { setSkillGroups(prevGroups); setSkills(prevSkills); });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeSkillId = active.id as string;
    const overId = over.id as string;

    let targetGroupId: string;
    if (overId.startsWith('skill-group-drop:')) {
      targetGroupId = overId.replace('skill-group-drop:', '');
    } else {
      targetGroupId = skills.find(s => s.id === overId)?.groupId ?? '';
    }

    const sourceGroupId = skills.find(s => s.id === activeSkillId)?.groupId ?? '';
    const groupChanged = sourceGroupId !== targetGroupId;

    if (groupChanged) {
      setSkills(skills.map(s => s.id === activeSkillId ? { ...s, groupId: targetGroupId } : s));
    } else if (!overId.startsWith('skill-group-drop:') && active.id !== over.id) {
      const oldIdx = skills.findIndex(s => s.id === activeSkillId);
      const newIdx = skills.findIndex(s => s.id === overId);
      if (oldIdx !== -1 && newIdx !== -1) {
        setSkills(arrayMove(skills, oldIdx, newIdx));
      }
    }
  };

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
      <div className="flex gap-2 mb-3 flex-wrap">
        <button onClick={addSkillGroup}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 cursor-pointer transition-colors">
          + 群組
        </button>
        <button onClick={startNew}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer transition-colors">
          + 技能
        </button>
        {skills.length > 0 && buffs.length > 0 && (
          <button
            onClick={() => {
              const preview = previewAutoApply();
              if (preview.length === 0) {
                alert('所有技能的 Buff 已符合條件，無需更新。');
              } else {
                setAutoApplyPreview(preview);
              }
            }}
            title="依傷害類型條件，自動設定每個技能的啟用 Buff"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-800 hover:bg-emerald-700 border border-gray-700 hover:border-emerald-600 text-gray-300 hover:text-white cursor-pointer transition-colors">
            ⚡ 自動套用
          </button>
        )}
      </div>

      {skills.length === 0 && skillGroups.length === 0 ? (
        <p className="text-gray-600 text-xs text-center py-3">尚未新增技能</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter}
          onDragStart={handleDragStart} onDragEnd={handleDragEnd}>

          {/* Ungrouped */}
          {(ungroupedSkills.length > 0 || skillGroups.length > 0) && (
            <div className="mb-2">
              {skillGroups.length > 0 && <div className="text-[10px] text-gray-600 mb-1">未分組</div>}
              <SortableContext items={ungroupedSkills.map(s => s.id)} strategy={verticalListSortingStrategy}>
                <DroppableSkillArea groupId="" isEmpty={ungroupedSkills.length === 0}>
                  {ungroupedSkills.map(s => (
                    <SortableSkillCard key={s.id} skill={s}
                      char={characters.find(c => c.id === s.characterId)}
                      onClick={() => setEditing({ ...s })}
                      onCopy={() => copy(s)}
                      onRemove={() => remove(s.id)} />
                  ))}
                </DroppableSkillArea>
              </SortableContext>
            </div>
          )}

          {/* Skill groups */}
          {skillGroups.map(g => {
            const groupSkills = groupedMap.get(g.id) || [];
            return (
              <div key={g.id} className="mb-2 border border-gray-700/50 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/40" style={{ borderLeft: `3px solid ${g.color}` }}>
                  <ColorDotPicker
                    color={g.color}
                    onCycle={() => cycleSkillGroupColor(g)}
                    onChange={c => updateSkillGroup({ ...g, color: c })}
                  />
                  <input
                    value={g.name}
                    onChange={e => updateSkillGroup({ ...g, name: e.target.value })}
                    className="bg-transparent text-xs font-medium text-gray-200 flex-1 focus:outline-none focus:border-b focus:border-indigo-500 min-w-0"
                  />
                  <button onClick={() => removeSkillGroup(g.id)} className="text-gray-500 hover:text-red-400 text-xs cursor-pointer shrink-0">✕</button>
                </div>
                <SortableContext items={groupSkills.map(s => s.id)} strategy={verticalListSortingStrategy}>
                  <DroppableSkillArea groupId={g.id} isEmpty={groupSkills.length === 0}>
                    {groupSkills.map(s => (
                      <SortableSkillCard key={s.id} skill={s}
                        char={characters.find(c => c.id === s.characterId)}
                        onClick={() => setEditing({ ...s })}
                        onCopy={() => copy(s)}
                        onRemove={() => remove(s.id)} />
                    ))}
                  </DroppableSkillArea>
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
        <SkillModal skill={editing} buffs={buffs} buffGroups={buffGroups} characters={characters} zones={zones} skillGroups={skillGroups}
          onSave={save} onClose={() => setEditing(null)} />
      )}

      {autoApplyPreview && (
        <Modal open title="⚡ 自動套用預覽" onClose={() => setAutoApplyPreview(null)} width="max-w-lg">
          <div className="space-y-4">
            <p className="text-xs text-gray-400">以下技能的 Buff 將依傷害類型條件更新：</p>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {autoApplyPreview.map(p => {
                const dtMeta = DAMAGE_TYPE_META[p.damageType];
                return (
                  <div key={p.skillId} className="bg-gray-800/60 border border-gray-700 rounded-xl px-3 py-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-200">{p.skillName}</span>
                      {dtMeta && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: dtMeta.color + '22', color: dtMeta.color }}>
                          {dtMeta.icon} {dtMeta.label}
                        </span>
                      )}
                    </div>
                    {p.added.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1">
                        {p.added.map(b => (
                          <span key={b.id} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            + {b.icon} {b.name}
                          </span>
                        ))}
                      </div>
                    )}
                    {p.removed.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {p.removed.map(b => (
                          <span key={b.id} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-red-500/15 text-red-400 border border-red-500/30 line-through">
                            − {b.icon} {b.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setAutoApplyPreview(null)}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                取消
              </button>
              <button onClick={() => {
                const prev = skills.map(s => ({ ...s, enabledBuffIds: [...s.enabledBuffIds] }));
                applyAutoApplyPreview(autoApplyPreview);
                pushUndo('自動套用 Buff', () => setSkills(prev));
                setAutoApplyPreview(null);
              }}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                確認套用
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
