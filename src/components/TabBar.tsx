import { useState, useRef, useEffect } from 'react';
import type { Tab } from '../types';
import ConfirmDialog from './ConfirmDialog';

interface Props {
  tabs: Tab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onAddTab: () => void;
  onCloseTab: (id: string) => void;
  onRenameTab: (id: string, name: string) => void;
  onDuplicateTab: (id: string) => void;
}

export default function TabBar({ tabs, activeTabId, onSelectTab, onAddTab, onCloseTab, onRenameTab, onDuplicateTab }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [closingTabId, setClosingTabId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const startRename = (tab: Tab) => {
    setEditingId(tab.id);
    setEditValue(tab.name);
  };

  const commitRename = () => {
    if (editingId && editValue.trim()) {
      onRenameTab(editingId, editValue.trim());
    }
    setEditingId(null);
  };

  const [contextMenu, setContextMenu] = useState<{ tabId: string; x: number; y: number } | null>(null);

  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [contextMenu]);

  const closingTab = closingTabId ? tabs.find(t => t.id === closingTabId) : null;

  return (
    <div className="h-9 bg-gray-900/60 border-b border-gray-800 flex items-end px-1 shrink-0 relative">
      <div className="flex items-end gap-0.5 overflow-x-auto min-w-0 flex-1 scrollbar-none">
        {tabs.map(tab => {
          const isActive = tab.id === activeTabId;
          const isEditing = editingId === tab.id;

          return (
            <div
              key={tab.id}
              onClick={() => { if (!isEditing) onSelectTab(tab.id); }}
              onDoubleClick={() => startRename(tab)}
              onContextMenu={e => { e.preventDefault(); setContextMenu({ tabId: tab.id, x: e.clientX, y: e.clientY }); }}
              className={`group relative flex items-center gap-1.5 px-3 py-1.5 text-xs cursor-pointer transition-colors rounded-t-lg min-w-0 max-w-[160px] shrink-0 ${
                isActive
                  ? 'bg-[#0f1117] text-gray-200 border-t border-x border-gray-700'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/40'
              }`}
            >
              {isEditing ? (
                <input
                  ref={inputRef}
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setEditingId(null); }}
                  className="bg-transparent border-b border-indigo-500 text-xs text-gray-200 focus:outline-none w-full min-w-[40px]"
                  onClick={e => e.stopPropagation()}
                />
              ) : (
                <span className="truncate">{tab.name}</span>
              )}
              {!isEditing && (
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={e => { e.stopPropagation(); onDuplicateTab(tab.id); }}
                    className="text-gray-600 hover:text-indigo-400 text-[10px] cursor-pointer"
                    title="複製頁籤"
                  >
                    ⧉
                  </button>
                  {tabs.length > 1 && (
                    <button
                      onClick={e => { e.stopPropagation(); setClosingTabId(tab.id); }}
                      className="text-gray-600 hover:text-red-400 text-[10px] cursor-pointer"
                      title="關閉頁籤"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add tab button */}
      <button
        onClick={onAddTab}
        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-gray-800/40 rounded-lg cursor-pointer transition-colors shrink-0 mb-0.5 ml-1 text-sm"
        title="新增頁籤"
      >
        +
      </button>

      {/* Context menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 min-w-[120px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => { startRename(tabs.find(t => t.id === contextMenu.tabId)!); setContextMenu(null); }}
            className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700 cursor-pointer"
          >
            重新命名
          </button>
          <button
            onClick={() => { onDuplicateTab(contextMenu.tabId); setContextMenu(null); }}
            className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700 cursor-pointer"
          >
            複製頁籤
          </button>
          {tabs.length > 1 && (
            <button
              onClick={() => { setClosingTabId(contextMenu.tabId); setContextMenu(null); }}
              className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-gray-700 cursor-pointer"
            >
              關閉頁籤
            </button>
          )}
        </div>
      )}

      <ConfirmDialog
        open={closingTabId !== null}
        title="關閉頁籤"
        message={`確定要關閉「${closingTab?.name || ''}」？頁籤內的資料將會遺失。`}
        confirmLabel="關閉"
        confirmColor="red"
        onConfirm={() => { if (closingTabId) onCloseTab(closingTabId); setClosingTabId(null); }}
        onCancel={() => setClosingTabId(null)}
      />
    </div>
  );
}
