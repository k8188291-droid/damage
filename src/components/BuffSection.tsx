import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, useSortable, rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Buff, DamageZone } from '../types';
import Modal from './Modal';

interface Props {
  buffs: Buff[];
  zones: DamageZone[];
  onBuffsChange: (buffs: Buff[]) => void;
  onZonesChange: (zones: DamageZone[]) => void;
}

const ICONS = ['🗡️','🔥','💀','💥','🌀','🛡️','🔮','⚡','🎯','💎','🌟','💫','🔰','⭐','❄️','🌊','💨','🍃'];
const COLORS = ['#ef4444','#f97316','#eab308','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899','#f43f5e','#14b8a6','#a855f7','#64748b'];

/* ── Zone Modal ── */
function ZoneModal({ zone, onSave, onClose }: { zone: DamageZone; onSave: (z: DamageZone) => void; onClose: () => void }) {
  const [d, setD] = useState({ ...zone });
  const p = (patch: Partial<DamageZone>) => setD(v => ({ ...v, ...patch }));

  return (
    <Modal open title="新增分區" onClose={onClose}>
      <div className="space-y-4">
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
        <button onClick={() => onSave(d)} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors cursor-pointer">儲存</button>
      </div>
    </Modal>
  );
}

/* ── Buff Modal ── */
function BuffModal({ buff, zones, onSave, onClose, onAddZone }: {
  buff: Buff; zones: DamageZone[]; onSave: (b: Buff) => void; onClose: () => void; onAddZone: () => void;
}) {
  const [d, setD] = useState({ ...buff });
  const p = (patch: Partial<Buff>) => setD(v => ({ ...v, ...patch }));

  return (
    <Modal open title={buff.name ? '編輯 Buff' : '新增 Buff'} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">名稱</label>
          <input value={d.name} onChange={e => p({ name: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500" />
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
        <button onClick={() => onSave(d)} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors cursor-pointer">儲存</button>
      </div>
    </Modal>
  );
}

/* ── Sortable Buff Chip ── */
function SortableBuffChip({ buff, zone, onClick }: { buff: Buff; zone: DamageZone | undefined; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: buff.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div ref={setNodeRef} style={style}
      className="bg-gray-800/60 border border-gray-700 rounded-xl px-3 py-2 flex items-center gap-2 cursor-pointer hover:border-indigo-500/50 transition-colors group"
      onClick={onClick}>
      <span {...attributes} {...listeners} className="text-gray-600 cursor-grab active:cursor-grabbing text-xs" onClick={e => e.stopPropagation()}>⠿</span>
      <span className="text-base">{buff.icon}</span>
      <div className="min-w-0">
        <div className="text-sm font-medium text-gray-200 truncate">{buff.name}</div>
        <div className="text-xs text-gray-500 flex items-center gap-1.5">
          {zone && <span style={{ color: zone.color }}>{zone.icon}{zone.displayName}</span>}
          <span className="text-gray-400 font-mono">{buff.value}%</span>
        </div>
      </div>
    </div>
  );
}

/* ── Main Section ── */
export default function BuffSection({ buffs, zones, onBuffsChange, onZonesChange }: Props) {
  const [editingBuff, setEditingBuff] = useState<Buff | null>(null);
  const [editingZone, setEditingZone] = useState<DamageZone | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const saveBuff = (b: Buff) => {
    const exists = buffs.find(x => x.id === b.id);
    onBuffsChange(exists ? buffs.map(x => x.id === b.id ? b : x) : [...buffs, b]);
    setEditingBuff(null);
  };

  const removeBuff = (id: string) => onBuffsChange(buffs.filter(b => b.id !== id));

  const saveZone = (z: DamageZone) => {
    const exists = zones.find(x => x.id === z.id);
    onZonesChange(exists ? zones.map(x => x.id === z.id ? z : x) : [...zones, z]);
    setEditingZone(null);
  };

  const removeZone = (id: string) => {
    onZonesChange(zones.filter(z => z.id !== id));
    onBuffsChange(buffs.filter(b => b.zoneId !== id));
  };

  const newBuff = () => {
    const defaultZone = zones.find(z => z.id !== 'zone-skill') || zones[0];
    setEditingBuff({ id: uuid(), name: '', zoneId: defaultZone?.id || '', value: 0, icon: '🌟', color: COLORS[buffs.length % COLORS.length] });
  };

  const newZone = () => {
    setEditingZone({ id: uuid(), name: '', displayName: '', icon: '⭐', color: COLORS[zones.length % COLORS.length], isDefault: false });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = buffs.findIndex(b => b.id === active.id);
      const newIdx = buffs.findIndex(b => b.id === over.id);
      onBuffsChange(arrayMove(buffs, oldIdx, newIdx));
    }
  };

  // Group buffs by zone for display
  const grouped = new Map<string, Buff[]>();
  for (const b of buffs) {
    if (!grouped.has(b.zoneId)) grouped.set(b.zoneId, []);
    grouped.get(b.zoneId)!.push(b);
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-100">✨ Buff / 分區</h2>
        <div className="flex gap-2">
          <button onClick={newZone} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-medium transition-colors cursor-pointer">+ 分區</button>
          <button onClick={newBuff} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-medium transition-colors cursor-pointer">+ Buff</button>
        </div>
      </div>

      {/* Zone chips */}
      <div className="flex gap-1.5 flex-wrap mb-3">
        {zones.filter(z => z.id !== 'zone-skill').map(z => (
          <span key={z.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-gray-700 group" style={{ borderColor: z.color + '60' }}>
            <span>{z.icon}</span>
            <span style={{ color: z.color }}>{z.displayName}</span>
            {!z.isDefault && (
              <button onClick={() => removeZone(z.id)} className="text-gray-600 hover:text-red-400 cursor-pointer opacity-0 group-hover:opacity-100 ml-0.5">✕</button>
            )}
          </span>
        ))}
      </div>

      {/* Buff grid */}
      {buffs.length === 0 ? (
        <p className="text-gray-600 text-sm text-center py-4">尚未新增 Buff</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={buffs.map(b => b.id)} strategy={rectSortingStrategy}>
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {buffs.map(b => (
                <SortableBuffChip key={b.id} buff={b} zone={zones.find(z => z.id === b.zoneId)} onClick={() => setEditingBuff({ ...b })} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Quick-remove row */}
      {buffs.length > 0 && (
        <div className="mt-2 flex gap-1 flex-wrap">
          {buffs.map(b => (
            <button key={b.id} onClick={() => removeBuff(b.id)}
              className="text-[10px] text-gray-600 hover:text-red-400 cursor-pointer px-1">
              ✕ {b.name}
            </button>
          ))}
        </div>
      )}

      {editingBuff && (
        <BuffModal buff={editingBuff} zones={zones} onSave={saveBuff} onClose={() => setEditingBuff(null)} onAddZone={newZone} />
      )}
      {editingZone && (
        <ZoneModal zone={editingZone} onSave={saveZone} onClose={() => setEditingZone(null)} />
      )}
    </section>
  );
}
