import { useState, useRef, useEffect } from 'react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Preset } from '../types';

interface Props {
  presets: Preset[];
  onSavePreset: (name: string) => void;
  onOverwritePreset: (id: string) => void;
  onLoadPreset: (preset: Preset) => void;
  onOpenInNewTab: (preset: Preset) => void;
  onDuplicatePreset: (id: string) => void;
  onRenamePreset: (id: string, name: string) => void;
  onDeletePreset: (id: string) => void;
  onReorderPresets: (presets: Preset[]) => void;
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function SortablePresetCard({ preset, editingId, editValue, onEditChange, onStartRename, onCommitRename, onCancelRename, onLoad, onOpenInNewTab, onDuplicate, onOverwrite, onDelete }: {
  preset: Preset;
  editingId: string | null;
  editValue: string;
  onEditChange: (v: string) => void;
  onStartRename: (p: Preset) => void;
  onCommitRename: () => void;
  onCancelRename: () => void;
  onLoad: () => void;
  onOpenInNewTab: () => void;
  onDuplicate: () => void;
  onOverwrite: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: preset.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const isEditing = editingId === preset.id;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <div ref={setNodeRef} style={style}>
      <div className="bg-gray-800/60 border border-gray-700 rounded-lg px-2.5 py-2 group">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span {...attributes} {...listeners}
            className="text-gray-600 cursor-grab active:cursor-grabbing text-[10px] shrink-0"
            onClick={e => e.stopPropagation()}>⠿</span>
          {isEditing ? (
            <input
              ref={inputRef}
              value={editValue}
              onChange={e => onEditChange(e.target.value)}
              onBlur={onCommitRename}
              onKeyDown={e => { if (e.key === 'Enter') onCommitRename(); if (e.key === 'Escape') onCancelRename(); }}
              className="bg-transparent border-b border-indigo-500 text-xs text-gray-200 focus:outline-none min-w-0 flex-1"
            />
          ) : (
            <span
              className="text-xs text-gray-200 truncate flex-1 min-w-0 cursor-text"
              onDoubleClick={() => onStartRename(preset)}
              title="雙擊重新命名"
            >
              {preset.name}
            </span>
          )}
          <button
            onClick={onDelete}
            className="text-gray-600 hover:text-red-400 text-[10px] shrink-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            title="刪除"
          >
            ✕
          </button>
        </div>
        <div className="text-[10px] text-gray-600 mb-1.5 ml-[18px]">{formatTime(preset.timestamp)}</div>
        <div className="flex gap-1.5 ml-[18px]">
          <button onClick={onLoad}
            className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-[10px] text-gray-300 cursor-pointer transition-colors">
            載入
          </button>
          <button onClick={onOpenInNewTab}
            className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-[10px] text-gray-300 cursor-pointer transition-colors">
            開新頁籤
          </button>
          <button onClick={onDuplicate}
            className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-[10px] text-gray-300 cursor-pointer transition-colors opacity-0 group-hover:opacity-100">
            複製
          </button>
          <button onClick={onOverwrite}
            className="px-2 py-0.5 bg-gray-700 hover:bg-amber-600/40 rounded text-[10px] text-amber-400 cursor-pointer transition-colors opacity-0 group-hover:opacity-100"
            title="以目前設定覆蓋此預設">
            覆蓋
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PresetSection({ presets, onSavePreset, onOverwritePreset, onLoadPreset, onOpenInNewTab, onDuplicatePreset, onRenamePreset, onDeletePreset, onReorderPresets }: Props) {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleSave = () => {
    const name = newName.trim() || `檔案 ${presets.length + 1}`;
    onSavePreset(name);
    setNewName('');
  };

  const startRename = (p: Preset) => {
    setEditingId(p.id);
    setEditValue(p.name);
  };

  const commitRename = () => {
    if (editingId && editValue.trim()) {
      onRenamePreset(editingId, editValue.trim());
    }
    setEditingId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = presets.findIndex(p => p.id === active.id);
      const newIdx = presets.findIndex(p => p.id === over.id);
      onReorderPresets(arrayMove(presets, oldIdx, newIdx));
    }
  };

  return (
    <div className="space-y-2">
      {/* Save new preset */}
      <div className="flex gap-1.5">
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
          placeholder="檔案名稱..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 min-w-0"
        />
        <button
          onClick={handleSave}
          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0"
        >
          儲存
        </button>
      </div>

      {/* Preset list */}
      {presets.length === 0 && (
        <p className="text-[11px] text-gray-600 text-center py-2">尚無檔案</p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={presets.map(p => p.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1.5">
            {presets.map(p => (
              <SortablePresetCard
                key={p.id}
                preset={p}
                editingId={editingId}
                editValue={editValue}
                onEditChange={setEditValue}
                onStartRename={startRename}
                onCommitRename={commitRename}
                onCancelRename={() => setEditingId(null)}
                onLoad={() => onLoadPreset(p)}
                onOpenInNewTab={() => onOpenInNewTab(p)}
                onDuplicate={() => onDuplicatePreset(p.id)}
                onOverwrite={() => onOverwritePreset(p.id)}
                onDelete={() => onDeletePreset(p.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
