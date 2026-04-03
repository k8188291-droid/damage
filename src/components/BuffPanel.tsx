import { v4 as uuid } from 'uuid';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Buff, DamageZone } from '../types';

interface Props {
  buffs: Buff[];
  zones: DamageZone[];
  onChange: (buffs: Buff[]) => void;
}

const BUFF_ICONS = ['🗡️', '🔥', '💀', '💥', '🌀', '🛡️', '🔮', '⚡', '🎯', '💎', '🌟', '💫', '🔰', '⭐', '❄️', '🌊', '💨', '🍃'];
const BUFF_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#14b8a6', '#a855f7', '#64748b'];

function SortableBuff({
  buff,
  zones,
  onUpdate,
  onRemove,
}: {
  buff: Buff;
  zones: DamageZone[];
  onUpdate: (id: string, patch: Partial<Buff>) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: buff.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    borderLeftColor: buff.color,
    borderLeftWidth: 3,
  };

  const zone = zones.find(z => z.id === buff.zoneId);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 space-y-2"
    >
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="text-gray-500 hover:text-gray-300 cursor-grab active:cursor-grabbing"
        >
          ⠿
        </button>
        <span className="text-lg">{buff.icon}</span>
        <input
          type="text"
          value={buff.name}
          onChange={e => onUpdate(buff.id, { name: e.target.value })}
          className="bg-transparent border-b border-gray-600 text-gray-100 font-medium focus:outline-none focus:border-indigo-500 flex-1 min-w-0"
        />
        <button
          onClick={() => onRemove(buff.id)}
          className="text-gray-500 hover:text-red-400 text-sm cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-xs text-gray-400 mb-1">分區</label>
          <select
            value={buff.zoneId}
            onChange={e => onUpdate(buff.id, { zoneId: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
          >
            {zones.filter(z => z.id !== 'zone-skill').map(z => (
              <option key={z.id} value={z.id}>
                {z.icon} {z.displayName}
              </option>
            ))}
          </select>
        </div>
        <div className="w-28">
          <label className="block text-xs text-gray-400 mb-1">數值 (%)</label>
          <input
            type="number"
            value={buff.value || ''}
            onChange={e => onUpdate(buff.id, { value: Number(e.target.value) || 0 })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
            placeholder="0"
          />
        </div>
      </div>

      {zone && (
        <div className="text-xs text-gray-500">
          分區: <span style={{ color: zone.color }}>{zone.icon} {zone.displayName}</span>
        </div>
      )}

      <div className="flex gap-1 flex-wrap">
        {BUFF_ICONS.map(e => (
          <button
            key={e}
            onClick={() => onUpdate(buff.id, { icon: e })}
            className={`text-xs p-0.5 rounded cursor-pointer ${buff.icon === e ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
          >
            {e}
          </button>
        ))}
      </div>
      <div className="flex gap-1 flex-wrap">
        {BUFF_COLORS.map(c => (
          <button
            key={c}
            onClick={() => onUpdate(buff.id, { color: c })}
            className={`w-4 h-4 rounded-full cursor-pointer border-2 ${buff.color === c ? 'border-white' : 'border-transparent'}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );
}

export default function BuffPanel({ buffs, zones, onChange }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const addBuff = () => {
    const defaultZone = zones.find(z => z.id !== 'zone-skill') || zones[0];
    onChange([
      ...buffs,
      {
        id: uuid(),
        name: `Buff ${buffs.length + 1}`,
        zoneId: defaultZone?.id || '',
        value: 0,
        icon: '🌟',
        color: BUFF_COLORS[buffs.length % BUFF_COLORS.length],
      },
    ]);
  };

  const update = (id: string, patch: Partial<Buff>) => {
    onChange(buffs.map(b => (b.id === id ? { ...b, ...patch } : b)));
  };

  const remove = (id: string) => {
    onChange(buffs.filter(b => b.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = buffs.findIndex(b => b.id === active.id);
      const newIndex = buffs.findIndex(b => b.id === over.id);
      onChange(arrayMove(buffs, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">Buff 設定</h2>
        <button
          onClick={addBuff}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          + 新增 Buff
        </button>
      </div>

      {buffs.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-8">尚未新增 Buff，點擊上方按鈕新增</p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={buffs.map(b => b.id)} strategy={verticalListSortingStrategy}>
          <div className="grid gap-3 md:grid-cols-2">
            {buffs.map(buff => (
              <SortableBuff
                key={buff.id}
                buff={buff}
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
