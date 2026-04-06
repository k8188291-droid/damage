import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useShallow } from 'zustand/shallow';
import {
  DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors,
  type DragEndEvent, type DragStartEvent, DragOverlay, useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppStore } from '../stores/appStore';
import { useUndoStore } from '../stores/undoStore';
import type { Buff, BuffGroup, DamageZone, Skill, SkillGroup } from '../types';
import Modal from './Modal';
import { Tooltip, ColorDotPicker, COLORS } from './ui';

const ICONS = ['🗡️','🔥','💀','💥','🌀','🛡️','🔮','⚡','🎯','💎','🌟','💫','🔰','⭐','❄️','🌊','💨','🍃'];

/* ── Zone Modal (edit for custom, view-only for default) ── */
function ZoneModal({ zone, buffs, onSave, onClose, readOnly }: {
  zone: DamageZone; buffs: Buff[]; onSave: (z: DamageZone) => void; onClose: () => void; readOnly?: boolean;
}) {
  const [d, setD] = useState({ ...zone });
  const p = (patch: Partial<DamageZone>) => setD(v => ({ ...v, ...patch }));
  const zoneBuffs = buffs.filter(b => b.zoneId === zone.id);

  const title = readOnly ? `${zone.icon} ${zone.displayName}` : (zone.name ? '編輯分區' : '新增分區');

  return (
    <Modal open title={title} onClose={onClose}>
      <div className="space-y-4">
        {!readOnly && (
          <>
            <div>
              <label className="block text-xs text-gray-400 mb-1">分區名稱</label>
              <input value={d.displayName} onChange={e => p({ displayName: e.target.value, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">圖示</label>
              <div className="flex gap-1.5 flex-wrap">
                {ICONS.map(e => (
                  <button key={e} onClick={() => p({ icon: e })}
                    className={`text-lg p-1 rounded cursor-pointer ${d.icon === e ? 'bg-gray-600 ring-1 ring-indigo-500' : 'hover:bg-gray-700'}`}>{e}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">顏色</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map(c => (
                  <button key={c} onClick={() => p({ color: c })}
                    className={`w-7 h-7 rounded-full cursor-pointer border-2 transition-transform ${d.color === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Buffs belonging to this zone */}
        <div>
          <label className="block text-xs text-gray-400 mb-2">此分區的 Buff ({zoneBuffs.length})</label>
          {zoneBuffs.length === 0 ? (
            <p className="text-xs text-gray-600 text-center py-2">尚無 Buff 屬於此分區</p>
          ) : (
            <div className="space-y-1">
              {zoneBuffs.map(b => (
                <div key={b.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/60 border ${b.enabled ? 'border-gray-700' : 'border-gray-800 opacity-50'}`}>
                  <span className="text-base shrink-0">{b.icon}</span>
                  <span className={`text-sm flex-1 truncate ${b.enabled ? 'text-gray-200' : 'text-gray-500 line-through'}`}>{b.name}</span>
                  <span className="text-xs text-gray-400 font-mono shrink-0">{b.value}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {!readOnly && (
          <button onClick={() => onSave(d)} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors cursor-pointer">儲存</button>
        )}
      </div>
    </Modal>
  );
}

/* ── Buff Modal ── */
function BuffModal({ buff, zones, buffGroups, skills, skillGroups, onSave, onClose, onAddZone }: {
  buff: Buff; zones: DamageZone[]; buffGroups: BuffGroup[]; skills: Skill[]; skillGroups: SkillGroup[];
  onSave: (b: Buff, enabledSkillIds: string[]) => void; onClose: () => void; onAddZone: () => void;
}) {
  const [d, setD] = useState({ ...buff });
  const p = (patch: Partial<Buff>) => setD(v => ({ ...v, ...patch }));

  const [enabledSkillIds, setEnabledSkillIds] = useState<string[]>(
    () => skills.filter(s => s.enabledBuffIds.includes(buff.id)).map(s => s.id)
  );

  const toggleSkill = (skillId: string) => {
    setEnabledSkillIds(prev =>
      prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]
    );
  };

  const skillsByGroup = new Map<string, Skill[]>();
  skillsByGroup.set('', []);
  for (const g of skillGroups) skillsByGroup.set(g.id, []);
  for (const s of skills) {
    const key = s.groupId || '';
    if (!skillsByGroup.has(key)) skillsByGroup.set(key, []);
    skillsByGroup.get(key)!.push(s);
  }

  return (
    <Modal open title={buff.name ? '編輯 Buff' : '新增 Buff'} onClose={onClose} width="max-w-xl">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">名稱</label>
          <input value={d.name} onChange={e => p({ name: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">分區</label>
            <div className="flex gap-2">
              <select value={d.zoneId} onChange={e => p({ zoneId: e.target.value })}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500">
                {zones.filter(z => z.id !== 'zone-skill').map(z => (
                  <option key={z.id} value={z.id}>{z.icon} {z.displayName}</option>
                ))}
              </select>
              <button onClick={onAddZone} className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs cursor-pointer whitespace-nowrap" title="新增分區">+</button>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">數值 (%)</label>
            <input type="number" value={d.value || ''} onChange={e => p({ value: Number(e.target.value) || 0 })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500" placeholder="0" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">群組</label>
          <select value={d.groupId} onChange={e => p({ groupId: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500">
            <option value="">未分組</option>
            {buffGroups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-2">圖示</label>
          <div className="flex gap-1.5 flex-wrap">
            {ICONS.map(e => (
              <button key={e} onClick={() => p({ icon: e })}
                className={`text-lg p-1 rounded cursor-pointer ${d.icon === e ? 'bg-gray-600 ring-1 ring-indigo-500' : 'hover:bg-gray-700'}`}>{e}</button>
            ))}
          </div>
        </div>

        {/* Skills that enable this buff */}
        {skills.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-400 font-medium">啟用此 Buff 的技能</label>
              <div className="flex gap-3">
                <button onClick={() => setEnabledSkillIds(skills.map(s => s.id))} className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer">全選</button>
                <button onClick={() => setEnabledSkillIds([])} className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer">全不選</button>
              </div>
            </div>
            <div className="space-y-2">
              {Array.from(skillsByGroup.entries()).map(([gId, groupSkills]) => {
                if (groupSkills.length === 0) return null;
                const sg = skillGroups.find(g => g.id === gId);
                const label = sg ? sg.name : '未分組';
                const labelColor = sg?.color || '#64748b';
                return (
                  <div key={gId || '__ungrouped'}>
                    {skillGroups.length > 0 && (
                      <div className="text-xs font-medium mb-1" style={{ color: labelColor }}>
                        {sg ? '●' : '○'} {label}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {groupSkills.map(s => {
                        const on = enabledSkillIds.includes(s.id);
                        const chipColor = sg?.color || '#64748b';
                        return (
                          <button key={s.id} onClick={() => toggleSkill(s.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer border transition-all ${on ? 'text-white border-opacity-60' : 'border-gray-700 text-gray-500 opacity-40 hover:opacity-70'}`}
                            style={on ? { backgroundColor: chipColor + '30', borderColor: chipColor } : undefined}>
                            ⚔️ {s.name} ({s.skillMultiplier}%)
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button onClick={() => onSave(d, enabledSkillIds)} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors cursor-pointer">儲存</button>
      </div>
    </Modal>
  );
}

/* ── Sortable Buff Chip ── */
function SortableBuffChip({ buff, zone, onClick, onToggle, onCopy, onRemove }: {
  buff: Buff; zone: DamageZone | undefined;
  onClick: () => void; onToggle: () => void; onCopy: () => void; onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: buff.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div ref={setNodeRef} style={style}
      className={`bg-gray-800/60 border rounded-xl px-3 py-2 flex items-center gap-2 cursor-pointer hover:border-indigo-500/50 transition-colors group ${buff.enabled ? 'border-gray-700' : 'border-gray-800 opacity-50'}`}
      onClick={onClick}>
      <span {...attributes} {...listeners} className="text-gray-600 cursor-grab active:cursor-grabbing text-xs" onClick={e => e.stopPropagation()}>⠿</span>
      <Tooltip label={buff.enabled ? '已啟用，點擊停用' : '已停用，點擊啟用'}>
        <button
          onClick={e => { e.stopPropagation(); onToggle(); }}
          className={`w-4 h-4 rounded-full border-2 cursor-pointer shrink-0 transition-colors ${buff.enabled ? 'border-green-500 bg-green-500/30' : 'border-gray-600 bg-transparent'}`}
        />
      </Tooltip>
      <span className="text-base shrink-0">{buff.icon}</span>
      <div className="min-w-0 flex-1">
        <div className={`text-sm font-medium truncate ${buff.enabled ? 'text-gray-200' : 'text-gray-500 line-through'}`}>{buff.name}</div>
        <div className="text-xs text-gray-500 flex items-center gap-1.5">
          {zone && <span style={{ color: zone.color }}>★ {zone.displayName}</span>}
          <span className="text-gray-400 font-mono">{buff.value}%</span>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button onClick={e => { e.stopPropagation(); onCopy(); }} className="text-gray-600 hover:text-indigo-400 cursor-pointer text-xs" title="複製">⧉</button>
        <button onClick={e => { e.stopPropagation(); onRemove(); }} className="text-gray-600 hover:text-red-400 cursor-pointer text-xs" title="刪除">✕</button>
      </div>
    </div>
  );
}

/* ── Overlay chip for dragging ── */
function BuffChipOverlay({ buff, zone }: { buff: Buff; zone: DamageZone | undefined }) {
  return (
    <div className="bg-gray-800 border border-indigo-500 rounded-xl px-3 py-2 flex items-center gap-2 shadow-xl shadow-indigo-500/20 cursor-grabbing">
      <span className="text-base">{buff.icon}</span>
      <div className="min-w-0">
        <div className="text-sm font-medium text-gray-200 truncate">{buff.name}</div>
        <div className="text-xs text-gray-500 flex items-center gap-1.5">
          {zone && <span style={{ color: zone.color }}>★ {zone.displayName}</span>}
          <span className="text-gray-400 font-mono">{buff.value}%</span>
        </div>
      </div>
    </div>
  );
}

/* ── Droppable group container ── */
function DroppableGroupArea({ groupId, children, isEmpty }: {
  groupId: string; children: React.ReactNode; isEmpty: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `group-drop:${groupId}` });
  return (
    <div ref={setNodeRef}
      className={`space-y-1.5 p-1.5 min-h-[40px] rounded-lg transition-colors ${isOver ? 'bg-indigo-500/10 ring-1 ring-inset ring-indigo-500/30' : ''}`}>
      {children}
      {isEmpty && (
        <div className="text-xs text-gray-600 text-center py-2">
          {isOver ? '放開以移入此群組' : '拖曳 Buff 到此群組'}
        </div>
      )}
    </div>
  );
}

/* ── Main Section ── */
export default function BuffSection() {
  const { buffs, zones, buffGroups, skills, skillGroups } = useAppStore(useShallow(s => ({
    buffs: s.buffs, zones: s.zones, buffGroups: s.buffGroups,
    skills: s.skills, skillGroups: s.skillGroups,
  })));
  const setBuffs = useAppStore(s => s.setBuffs);
  const setZones = useAppStore(s => s.setZones);
  const setBuffGroups = useAppStore(s => s.setBuffGroups);
  const setSkills = useAppStore(s => s.setSkills);
  const pushUndo = useUndoStore(s => s.pushUndo);

  const [editingBuff, setEditingBuff] = useState<Buff | null>(null);
  const [editingZone, setEditingZone] = useState<DamageZone | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  const saveBuff = (b: Buff, enabledSkillIds?: string[]) => {
    const exists = buffs.find(x => x.id === b.id);
    setBuffs(exists ? buffs.map(x => x.id === b.id ? b : x) : [...buffs, b]);
    // Update skills' enabledBuffIds based on which skills should have this buff
    if (enabledSkillIds !== undefined) {
      setSkills(skills.map(s => {
        const shouldEnable = enabledSkillIds.includes(s.id);
        const hasIt = s.enabledBuffIds.includes(b.id);
        if (shouldEnable && !hasIt) return { ...s, enabledBuffIds: [...s.enabledBuffIds, b.id] };
        if (!shouldEnable && hasIt) return { ...s, enabledBuffIds: s.enabledBuffIds.filter(id => id !== b.id) };
        return s;
      }));
    }
    setEditingBuff(null);
  };

  const removeBuff = (id: string) => {
    const buff = buffs.find(b => b.id === id);
    if (!buff) return;
    const prevBuffs = [...buffs];
    setBuffs(buffs.filter(b => b.id !== id));
    pushUndo(`已刪除 Buff: ${buff.name}`, () => setBuffs(prevBuffs));
  };

  const copyBuff = (b: Buff) => {
    const copy = { ...b, id: uuid(), name: `${b.name} (複製)` };
    const idx = buffs.findIndex(x => x.id === b.id);
    const next = [...buffs];
    next.splice(idx + 1, 0, copy);
    setBuffs(next);
  };

  const toggleBuff = (id: string) => {
    setBuffs(buffs.map(b => b.id === id ? { ...b, enabled: !b.enabled } : b));
  };

  const saveZone = (z: DamageZone) => {
    const exists = zones.find(x => x.id === z.id);
    setZones(exists ? zones.map(x => x.id === z.id ? z : x) : [...zones, z]);
    setEditingZone(null);
  };

  const removeZone = (id: string) => {
    const zone = zones.find(z => z.id === id);
    if (!zone) return;
    const prevZones = [...zones];
    const prevBuffs = [...buffs];
    setZones(zones.filter(z => z.id !== id));
    setBuffs(buffs.filter(b => b.zoneId !== id));
    pushUndo(`已刪除分區: ${zone.displayName}`, () => { setZones(prevZones); setBuffs(prevBuffs); });
  };

  const updateGroup = (g: BuffGroup) => {
    setBuffGroups(buffGroups.map(x => x.id === g.id ? g : x));
  };

  const cycleGroupColor = (g: BuffGroup) => {
    const idx = COLORS.indexOf(g.color);
    const nextColor = COLORS[(idx + 1) % COLORS.length];
    updateGroup({ ...g, color: nextColor });
  };

  const addGroup = () => {
    setBuffGroups([...buffGroups, { id: uuid(), name: `群組 ${buffGroups.length + 1}`, color: COLORS[buffGroups.length % COLORS.length] }]);
  };

  const removeGroup = (id: string) => {
    const grp = buffGroups.find(g => g.id === id);
    if (!grp) return;
    const prevGroups = [...buffGroups];
    const prevBuffs = [...buffs];
    setBuffGroups(buffGroups.filter(g => g.id !== id));
    setBuffs(buffs.map(b => b.groupId === id ? { ...b, groupId: '' } : b));
    pushUndo(`已刪除群組: ${grp.name}`, () => { setBuffGroups(prevGroups); setBuffs(prevBuffs); });
  };

  const newBuff = () => {
    const defaultZone = zones.find(z => z.id !== 'zone-skill') || zones[0];
    setEditingBuff({ id: uuid(), name: '', zoneId: defaultZone?.id || '', groupId: '', value: 0, icon: '🌟', enabled: true });
  };

  const newZone = () => {
    setEditingZone({ id: uuid(), name: '', displayName: '', icon: '⭐', color: COLORS[zones.length % COLORS.length], isDefault: false });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeBuffId = active.id as string;
    const overId = over.id as string;

    let targetGroupId: string;
    if (overId.startsWith('group-drop:')) {
      targetGroupId = overId.replace('group-drop:', '');
    } else {
      targetGroupId = buffs.find(b => b.id === overId)?.groupId ?? '';
    }

    const sourceGroupId = buffs.find(b => b.id === activeBuffId)?.groupId ?? '';
    const groupChanged = sourceGroupId !== targetGroupId;

    if (groupChanged) {
      setBuffs(buffs.map(b => b.id === activeBuffId ? { ...b, groupId: targetGroupId } : b));
    } else if (!overId.startsWith('group-drop:') && active.id !== over.id) {
      const oldIdx = buffs.findIndex(b => b.id === activeBuffId);
      const newIdx = buffs.findIndex(b => b.id === overId);
      if (oldIdx !== -1 && newIdx !== -1) {
        setBuffs(arrayMove(buffs, oldIdx, newIdx));
      }
    }
  };

  const ungroupedBuffs = buffs.filter(b => !b.groupId);
  const groupedMap = new Map<string, Buff[]>();
  for (const g of buffGroups) groupedMap.set(g.id, []);
  for (const b of buffs) {
    if (b.groupId && groupedMap.has(b.groupId)) {
      groupedMap.get(b.groupId)!.push(b);
    }
  }

  const activeBuff = activeId ? buffs.find(b => b.id === activeId) : null;

  return (
    <section>
      {/* Zone pills (req 2: show name) */}
      {zones.filter(z => z.id !== 'zone-skill').length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-2">
          {zones.filter(z => z.id !== 'zone-skill').map(z => (
            <span key={z.id} onClick={() => setEditingZone({ ...z })}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border group cursor-pointer hover:brightness-125 transition-all" style={{ borderColor: z.color + '40', color: z.color }}>
              <span>{z.icon}</span>
              <span>{z.displayName}</span>
              {!z.isDefault && (
                <button onClick={e => { e.stopPropagation(); removeZone(z.id); }} className="text-gray-600 hover:text-red-400 cursor-pointer opacity-0 group-hover:opacity-100 ml-0.5">✕</button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Action buttons (req 1: pill button style) */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <button onClick={newZone}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 cursor-pointer transition-colors">
          + 分區
        </button>
        <button onClick={addGroup}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 cursor-pointer transition-colors">
          + 群組
        </button>
        <button onClick={newBuff}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer transition-colors">
          + Buff
        </button>
      </div>

      {buffs.length === 0 && buffGroups.length === 0 ? (
        <p className="text-gray-600 text-xs text-center py-3">尚未新增 Buff</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter}
          onDragStart={handleDragStart} onDragEnd={handleDragEnd}>

          {/* Ungrouped */}
          {(ungroupedBuffs.length > 0 || buffGroups.length > 0) && (
            <div className="mb-2">
              {buffGroups.length > 0 && <div className="text-[10px] text-gray-600 mb-1">未分組</div>}
              <SortableContext items={ungroupedBuffs.map(b => b.id)} strategy={verticalListSortingStrategy}>
                <DroppableGroupArea groupId="" isEmpty={ungroupedBuffs.length === 0}>
                  {ungroupedBuffs.map(b => (
                    <SortableBuffChip key={b.id} buff={b}
                      zone={zones.find(z => z.id === b.zoneId)}
                      onClick={() => setEditingBuff({ ...b })}
                      onToggle={() => toggleBuff(b.id)}
                      onCopy={() => copyBuff(b)}
                      onRemove={() => removeBuff(b.id)} />
                  ))}
                </DroppableGroupArea>
              </SortableContext>
            </div>
          )}

          {/* Named groups */}
          {buffGroups.map(g => {
            const groupBuffs = groupedMap.get(g.id) || [];
            return (
              <div key={g.id} className="mb-2 border border-gray-700/50 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/40" style={{ borderLeft: `3px solid ${g.color}` }}>
                  <ColorDotPicker
                    color={g.color}
                    onCycle={() => cycleGroupColor(g)}
                    onChange={c => updateGroup({ ...g, color: c })}
                  />
                  <input
                    value={g.name}
                    onChange={e => updateGroup({ ...g, name: e.target.value })}
                    className="bg-transparent text-xs font-medium text-gray-200 flex-1 focus:outline-none focus:border-b focus:border-indigo-500 min-w-0"
                  />
                  <button onClick={() => removeGroup(g.id)} className="text-gray-500 hover:text-red-400 text-xs cursor-pointer shrink-0">✕</button>
                </div>
                <SortableContext items={groupBuffs.map(b => b.id)} strategy={verticalListSortingStrategy}>
                  <DroppableGroupArea groupId={g.id} isEmpty={groupBuffs.length === 0}>
                    {groupBuffs.map(b => (
                      <SortableBuffChip key={b.id} buff={b}
                        zone={zones.find(z => z.id === b.zoneId)}
                        onClick={() => setEditingBuff({ ...b })}
                        onToggle={() => toggleBuff(b.id)}
                        onCopy={() => copyBuff(b)}
                        onRemove={() => removeBuff(b.id)} />
                    ))}
                  </DroppableGroupArea>
                </SortableContext>
              </div>
            );
          })}

          <DragOverlay>
            {activeBuff ? (
              <BuffChipOverlay buff={activeBuff}
                zone={zones.find(z => z.id === activeBuff.zoneId)} />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {editingBuff && (
        <BuffModal buff={editingBuff} zones={zones} buffGroups={buffGroups} skills={skills} skillGroups={skillGroups}
          onSave={saveBuff} onClose={() => setEditingBuff(null)} onAddZone={newZone} />
      )}
      {editingZone && (
        <ZoneModal zone={editingZone} buffs={buffs} readOnly={editingZone.isDefault}
          onSave={saveZone} onClose={() => setEditingZone(null)} />
      )}
    </section>
  );
}
