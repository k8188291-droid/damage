import { useState, useRef, useEffect } from 'react';
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
import type { Preset } from '../types';
import ConfirmDialog from './ConfirmDialog';
import { SYSTEM_PRESETS } from '../constants';
import type { SystemPreset } from '../constants';
import { migrateToLatest } from '../migrations';

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

function SystemPresetCard({ preset, onLoad, onOpenInNewTab }: {
  preset: SystemPreset;
  onLoad: () => void;
  onOpenInNewTab: () => void;
}) {
  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-lg px-2.5 py-2">
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="text-xs text-gray-200 truncate flex-1 min-w-0">{preset.name}</span>
        <span className="text-[10px] text-indigo-400 shrink-0">系統</span>
      </div>
      {preset.description && (
        <div className="text-[10px] text-gray-500 mb-1.5">{preset.description}</div>
      )}
      <div className="flex gap-1.5">
        <button onClick={onLoad}
          className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 cursor-pointer transition-colors">
          載入
        </button>
        <button onClick={onOpenInNewTab}
          className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 cursor-pointer transition-colors">
          開新頁籤
        </button>
      </div>
    </div>
  );
}

type ConfirmAction = { type: 'load'; preset: Preset } | { type: 'delete'; id: string; name: string } | { type: 'overwrite'; id: string; name: string } | { type: 'load-system'; preset: SystemPreset };

export default function PresetSection() {
  const {
    presets, savePreset, overwritePreset, loadPreset,
    openPresetInNewTab, duplicatePreset, renamePreset,
    deletePreset, reorderPresets, importData,
  } = useAppStore(useShallow(s => ({
    presets: s.presets,
    savePreset: s.savePreset,
    overwritePreset: s.overwritePreset,
    loadPreset: s.loadPreset,
    openPresetInNewTab: s.openPresetInNewTab,
    duplicatePreset: s.duplicatePreset,
    renamePreset: s.renamePreset,
    deletePreset: s.deletePreset,
    reorderPresets: s.reorderPresets,
    importData: s.importData,
  })));

  const [activeTab, setActiveTab] = useState<'mine' | 'system'>('mine');
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleSave = () => {
    const name = newName.trim() || `檔案 ${presets.length + 1}`;
    savePreset(name);
    setNewName('');
  };

  const startRename = (p: Preset) => {
    setEditingId(p.id);
    setEditValue(p.name);
  };

  const commitRename = () => {
    if (editingId && editValue.trim()) {
      renamePreset(editingId, editValue.trim());
    }
    setEditingId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = presets.findIndex(p => p.id === active.id);
      const newIdx = presets.findIndex(p => p.id === over.id);
      reorderPresets(arrayMove(presets, oldIdx, newIdx));
    }
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    switch (confirmAction.type) {
      case 'load': loadPreset(confirmAction.preset); break;
      case 'delete': deletePreset(confirmAction.id); break;
      case 'overwrite': overwritePreset(confirmAction.id); break;
      case 'load-system': {
        const data = migrateToLatest(JSON.parse(confirmAction.preset.dataJson));
        importData(data);
        break;
      }
    }
    setConfirmAction(null);
  };

  const openSystemInNewTab = (sp: SystemPreset) => {
    const data = migrateToLatest(JSON.parse(sp.dataJson));
    openPresetInNewTab({ id: sp.id, name: sp.name, timestamp: Date.now(), data });
  };

  const confirmTitle = confirmAction?.type === 'load' ? '載入檔案'
    : confirmAction?.type === 'delete' ? '刪除檔案'
    : confirmAction?.type === 'overwrite' ? '覆蓋檔案'
    : '載入系統檔案';
  const confirmMessage = confirmAction?.type === 'load'
    ? `確定要載入「${confirmAction.preset.name}」？目前的設定將被覆蓋。`
    : confirmAction?.type === 'delete'
      ? `確定要刪除「${confirmAction.name}」？此操作無法復原。`
      : confirmAction?.type === 'overwrite'
        ? `確定要以目前設定覆蓋「${confirmAction.name}」？`
        : confirmAction?.type === 'load-system'
          ? `確定要載入系統檔案「${confirmAction.preset.name}」？目前的設定將被覆蓋。`
          : '';
  const confirmColor = confirmAction?.type === 'delete' ? 'red' as const : confirmAction?.type === 'overwrite' ? 'amber' as const : 'indigo' as const;
  const confirmLabel = confirmAction?.type === 'load' || confirmAction?.type === 'load-system' ? '載入' : confirmAction?.type === 'delete' ? '刪除' : '覆蓋';

  return (
    <div className="space-y-2">
      {/* Tab bar */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('mine')}
          className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'mine'
              ? 'text-indigo-400 border-b-2 border-indigo-400 -mb-px'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          我的檔案
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'system'
              ? 'text-indigo-400 border-b-2 border-indigo-400 -mb-px'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          系統檔案
        </button>
      </div>

      {/* My Files tab */}
      {activeTab === 'mine' && (
        <>
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

          {/* Empty state */}
          {presets.length === 0 && (
            <div className="py-4 flex flex-col items-center gap-2">
              <p className="text-xs text-gray-600 text-center">尚無檔案</p>
              <button
                onClick={() => setActiveTab('system')}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
              >
                瀏覽系統檔案
              </button>
            </div>
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
                    onOpenInNewTab={() => openPresetInNewTab(p)}
                    onDuplicate={() => duplicatePreset(p.id)}
                    onOverwrite={() => setConfirmAction({ type: 'overwrite', id: p.id, name: p.name })}
                    onDelete={() => setConfirmAction({ type: 'delete', id: p.id, name: p.name })}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}

      {/* System Files tab */}
      {activeTab === 'system' && (
        <div className="space-y-1.5">
          {SYSTEM_PRESETS.map(sp => (
            <SystemPresetCard
              key={sp.id}
              preset={sp}
              onLoad={() => setConfirmAction({ type: 'load-system', preset: sp })}
              onOpenInNewTab={() => openSystemInNewTab(sp)}
            />
          ))}
        </div>
      )}

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
