import { v4 as uuid } from 'uuid';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Skill, Buff, Character, DamageZone } from '../types';

interface Props {
  skills: Skill[];
  buffs: Buff[];
  characters: Character[];
  zones: DamageZone[];
  onChange: (skills: Skill[]) => void;
}

function SortableSkill({
  skill,
  buffs,
  characters,
  zones,
  onUpdate,
  onRemove,
}: {
  skill: Skill;
  buffs: Buff[];
  characters: Character[];
  zones: DamageZone[];
  onUpdate: (id: string, patch: Partial<Skill>) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const toggleBuff = (buffId: string) => {
    const ids = skill.enabledBuffIds.includes(buffId)
      ? skill.enabledBuffIds.filter(id => id !== buffId)
      : [...skill.enabledBuffIds, buffId];
    onUpdate(skill.id, { enabledBuffIds: ids });
  };

  const enableAll = () => {
    onUpdate(skill.id, { enabledBuffIds: buffs.map(b => b.id) });
  };

  const disableAll = () => {
    onUpdate(skill.id, { enabledBuffIds: [] });
  };

  // Group buffs by zone for display
  const buffsByZone = new Map<string, Buff[]>();
  for (const buff of buffs) {
    const zone = zones.find(z => z.id === buff.zoneId);
    const key = zone ? zone.id : 'unknown';
    if (!buffsByZone.has(key)) buffsByZone.set(key, []);
    buffsByZone.get(key)!.push(buff);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-3"
    >
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="text-gray-500 hover:text-gray-300 cursor-grab active:cursor-grabbing"
        >
          ⠿
        </button>
        <input
          type="text"
          value={skill.name}
          onChange={e => onUpdate(skill.id, { name: e.target.value })}
          className="bg-transparent border-b border-gray-600 text-gray-100 font-medium text-lg focus:outline-none focus:border-indigo-500 flex-1 min-w-0"
        />
        <button
          onClick={() => onRemove(skill.id)}
          className="text-gray-500 hover:text-red-400 cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div>
          <label className="block text-xs text-gray-400 mb-1">角色</label>
          <select
            value={skill.characterId}
            onChange={e => onUpdate(skill.id, { characterId: e.target.value })}
            className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
          >
            <option value="">選擇角色</option>
            {characters.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">技能倍率 (%)</label>
          <input
            type="number"
            value={skill.skillMultiplier || ''}
            onChange={e => onUpdate(skill.id, { skillMultiplier: Number(e.target.value) || 0 })}
            className="w-28 bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
            placeholder="100"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-400 font-medium">啟用的 Buff</label>
          <div className="flex gap-2">
            <button onClick={enableAll} className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer">
              全選
            </button>
            <button onClick={disableAll} className="text-xs text-gray-400 hover:text-gray-300 cursor-pointer">
              全不選
            </button>
          </div>
        </div>

        {buffs.length === 0 ? (
          <p className="text-xs text-gray-500">尚未設定 Buff</p>
        ) : (
          <div className="space-y-2">
            {Array.from(buffsByZone.entries()).map(([zoneId, zoneBuffs]) => {
              const zone = zones.find(z => z.id === zoneId);
              return (
                <div key={zoneId}>
                  {zone && (
                    <div className="text-xs font-medium mb-1" style={{ color: zone.color }}>
                      {zone.icon} {zone.displayName}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {zoneBuffs.map(buff => {
                      const active = skill.enabledBuffIds.includes(buff.id);
                      return (
                        <button
                          key={buff.id}
                          onClick={() => toggleBuff(buff.id)}
                          className={`px-2 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                            active
                              ? 'border-opacity-50 text-white'
                              : 'border-gray-700 text-gray-500 opacity-50 hover:opacity-75'
                          }`}
                          style={
                            active
                              ? { backgroundColor: buff.color + '30', borderColor: buff.color }
                              : undefined
                          }
                        >
                          {buff.icon} {buff.name} ({buff.value}%)
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
    </div>
  );
}

export default function SkillPanel({ skills, buffs, characters, zones, onChange }: Props) {
  const sensors = useSensors(useSensor(PointerSensor));

  const addSkill = () => {
    onChange([
      ...skills,
      {
        id: uuid(),
        name: `技能 ${skills.length + 1}`,
        characterId: characters[0]?.id || '',
        skillMultiplier: 100,
        enabledBuffIds: [],
        order: skills.length,
      },
    ]);
  };

  const update = (id: string, patch: Partial<Skill>) => {
    onChange(skills.map(s => (s.id === id ? { ...s, ...patch } : s)));
  };

  const remove = (id: string) => {
    onChange(skills.filter(s => s.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = skills.findIndex(s => s.id === active.id);
      const newIndex = skills.findIndex(s => s.id === over.id);
      onChange(arrayMove(skills, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">技能設定</h2>
        <button
          onClick={addSkill}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          + 新增技能
        </button>
      </div>

      {skills.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-8">尚未新增技能，點擊上方按鈕新增</p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={skills.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {skills.map(skill => (
              <SortableSkill
                key={skill.id}
                skill={skill}
                buffs={buffs}
                characters={characters}
                zones={zones}
                onUpdate={update}
                onRemove={remove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
