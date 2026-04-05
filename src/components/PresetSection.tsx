import { useState } from 'react';
import type { Preset } from '../types';

interface Props {
  presets: Preset[];
  onSavePreset: (name: string) => void;
  onLoadPreset: (preset: Preset) => void;
  onOpenInNewTab: (preset: Preset) => void;
  onRenamePreset: (id: string, name: string) => void;
  onDeletePreset: (id: string) => void;
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function PresetSection({ presets, onSavePreset, onLoadPreset, onOpenInNewTab, onRenamePreset, onDeletePreset }: Props) {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleSave = () => {
    const name = newName.trim() || `預設 ${presets.length + 1}`;
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

  return (
    <div className="space-y-2">
      {/* Save new preset */}
      <div className="flex gap-1.5">
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
          placeholder="預設名稱..."
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
        <p className="text-[11px] text-gray-600 text-center py-2">尚無預設集</p>
      )}

      <div className="space-y-1.5">
        {presets.map(p => (
          <div key={p.id} className="bg-gray-800/60 border border-gray-700 rounded-lg px-2.5 py-2 group">
            <div className="flex items-center justify-between mb-0.5">
              {editingId === p.id ? (
                <input
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setEditingId(null); }}
                  className="bg-transparent border-b border-indigo-500 text-xs text-gray-200 focus:outline-none min-w-0 flex-1"
                  autoFocus
                />
              ) : (
                <span
                  className="text-xs text-gray-200 truncate cursor-pointer hover:text-indigo-400"
                  onDoubleClick={() => startRename(p)}
                  title="雙擊重新命名"
                >
                  {p.name}
                </span>
              )}
            </div>
            <div className="text-[10px] text-gray-600 mb-1.5">{formatTime(p.timestamp)}</div>
            <div className="flex gap-1.5">
              <button
                onClick={() => onLoadPreset(p)}
                className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-[10px] text-gray-300 cursor-pointer transition-colors"
              >
                載入
              </button>
              <button
                onClick={() => onOpenInNewTab(p)}
                className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-[10px] text-gray-300 cursor-pointer transition-colors"
              >
                開新分頁
              </button>
              <button
                onClick={() => startRename(p)}
                className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-[10px] text-gray-300 cursor-pointer transition-colors opacity-0 group-hover:opacity-100"
              >
                改名
              </button>
              <button
                onClick={() => onDeletePreset(p.id)}
                className="px-2 py-0.5 bg-gray-700 hover:bg-red-600/40 rounded text-[10px] text-red-400 cursor-pointer transition-colors opacity-0 group-hover:opacity-100 ml-auto"
              >
                刪除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
