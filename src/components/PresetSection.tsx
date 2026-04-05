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
import ConfirmDialog from './ConfirmDialog';

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
            className="text-gray-600 cursor-grab active:cursor-grabbing text-xs shrink-0"
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
              onClick={() => onStartRename(preset)}
              title="點擊重新命名"
            >
              {preset.name}
            </span>
          )}
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button onClick={onDuplicate}
              className="text-gray-600 hover:text-indigo-400 cursor-pointer"
              style={{ fontSize: 12 }}
              title="複製">
              ⧉
            </button>
            <button onClick={onDelete}
              className="text-gray-600 hover:text-red-400 cursor-pointer"
              style={{ fontSize: 12 }}
              title="刪除">
              ✕
            </button>
          </div>
        </div>
        <div className="text-[10px] text-gray-600 mb-1.5 ml-[14px]">{formatTime(preset.timestamp)}</div>
        <div className="flex gap-1.5 ml-[14px]">
          <button onClick={onLoad}
            className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 cursor-pointer transition-colors">
            載入
          </button>
          <button onClick={onOpenInNewTab}
            className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 cursor-pointer transition-colors">
            開新頁籤
          </button>
          <button onClick={onOverwrite}
            className="px-2 py-0.5 bg-gray-700 hover:bg-amber-600/40 rounded text-xs text-amber-400 cursor-pointer transition-colors"
            title="以目前設定覆蓋此預設">
            覆蓋
          </button>
        </div>
      </div>
    </div>
  );
}

type ConfirmAction = { type: 'load'; preset: Preset } | { type: 'delete'; id: string; name: string } | { type: 'overwrite'; id: string; name: string };

export default function PresetSection({ presets, onSavePreset, onOverwritePreset, onLoadPreset, onOpenInNewTab, onDuplicatePreset, onRenamePreset, onDeletePreset, onReorderPresets }: Props) {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
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

  const handleConfirm = () => {
    if (!confirmAction) return;
    switch (confirmAction.type) {
      case 'load': onLoadPreset(confirmAction.preset); break;
      case 'delete': onDeletePreset(confirmAction.id); break;
      case 'overwrite': onOverwritePreset(confirmAction.id); break;
    }
    setConfirmAction(null);
  };

  const confirmTitle = confirmAction?.type === 'load' ? '載入檔案' : confirmAction?.type === 'delete' ? '刪除檔案' : '覆蓋檔案';
  const confirmMessage = confirmAction?.type === 'load'
    ? `確定要載入「${confirmAction.preset.name}」？目前的設定將被覆蓋。`
    : confirmAction?.type === 'delete'
      ? `確定要刪除「${confirmAction.name}」？此操作無法復原。`
      : confirmAction ? `確定要以目前設定覆蓋「${confirmAction.name}」？` : '';
  const confirmColor = confirmAction?.type === 'delete' ? 'red' as const : confirmAction?.type === 'overwrite' ? 'amber' as const : 'indigo' as const;
  const confirmLabel = confirmAction?.type === 'load' ? '載入' : confirmAction?.type === 'delete' ? '刪除' : '覆蓋';

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
        <p className="text-xs text-gray-600 text-center py-2">尚無檔案</p>
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
                onLoad={() => setConfirmAction({ type: 'load', preset: p })}
                onOpenInNewTab={() => onOpenInNewTab(p)}
                onDuplicate={() => onDuplicatePreset(p.id)}
                onOverwrite={() => setConfirmAction({ type: 'overwrite', id: p.id, name: p.name })}
                onDelete={() => setConfirmAction({ type: 'delete', id: p.id, name: p.name })}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <ConfirmDialog
        open={confirmAction !== null}
        title={confirmTitle}
        message={confirmMessage}
        confirmLabel={confirmLabel}
        confirmColor={confirmColor}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
