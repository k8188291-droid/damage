import { useRef, useState } from 'react';
import type { AppData } from '../types';
import { CURRENT_VERSION } from '../types';
import { useAppStore } from '../stores/appStore';
import { migrateToLatest } from '../migrations';
import Modal from './Modal';
import ConfirmDialog from './ConfirmDialog';

export default function ImportExport() {
  const getData = useAppStore(s => s.getData);
  const importData = useAppStore(s => s.importData);
  const clearAll = useAppStore(s => s.clearAll);

  const [showModal, setShowModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [error, setError] = useState('');
  const [copyDone, setCopyDone] = useState(false);
  const [pendingImport, setPendingImport] = useState<AppData | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = { ...getData(), version: CURRENT_VERSION };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `damage-calc-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = () => {
    const data = { ...getData(), version: CURRENT_VERSION };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopyDone(true);
    setTimeout(() => setCopyDone(false), 1000);
  };

  const requestImport = (raw: string) => {
    const parsed = JSON.parse(raw);
    const migrated = migrateToLatest(parsed);
    validate(migrated);
    setPendingImport(migrated);
  };

  const handleConfirmImport = () => {
    if (!pendingImport) return;
    importData(pendingImport);
    setPendingImport(null);
    setShowModal(false);
    setImportText('');
    setError('');
  };

  const handleImportFromText = () => {
    try {
      requestImport(importText);
    } catch (e) {
      setError(e instanceof Error ? e.message : '格式錯誤');
    }
  };

  const handleImportFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        requestImport(reader.result as string);
      } catch (err) {
        setError(err instanceof Error ? err.message : '格式錯誤');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <>
      <div className="flex gap-2">
        <button onClick={handleExport}
          className="px-3 py-1 bg-ef-card hover:bg-ef-card-hover border border-ef-line rounded-lg text-xs font-medium text-ef-ink-2 transition-colors cursor-pointer">
          匯出
        </button>
        <button onClick={handleCopyToClipboard}
          className={`px-3 py-1 ${copyDone ? 'bg-green-700 text-white' : 'bg-ef-card hover:bg-ef-card-hover border border-ef-line text-ef-ink-2'} rounded-lg text-xs font-medium transition-colors cursor-pointer`}>
          {copyDone ? '已複製 ✓' : '複製'}
        </button>
        <button onClick={() => setShowModal(true)}
          className="px-3 py-1 bg-ef-card hover:bg-ef-card-hover border border-ef-line rounded-lg text-xs font-medium text-ef-ink-2 transition-colors cursor-pointer">
          匯入
        </button>
        <button onClick={() => setShowClearDialog(true)}
          className="px-2 py-0.5 text-xs text-ef-ink-4 hover:text-red-400 transition-colors cursor-pointer">
          清除
        </button>
      </div>

      {showModal && (
        <Modal open title="匯入設定" onClose={() => { setShowModal(false); setError(''); }}>
          <div className="space-y-4">
            <div className='text-yellow-500 text-sm mb-2'>{"🛈 可以從[檔案庫 > 系統檔案]載入範例資料"}</div>
            <div>
              <label className="block text-xs text-ef-ink-3 mb-1">從檔案匯入</label>
              <input ref={fileRef} type="file" accept=".json" onChange={handleImportFromFile}
                className="block w-full text-sm text-ef-ink-3 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-ef-gold file:text-white file:cursor-pointer hover:file:bg-ef-gold-2" />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-ef-line" />
              <span className="text-xs text-ef-ink-4">或</span>
              <div className="flex-1 border-t border-ef-line" />
            </div>

            <div>
              <label className="block text-xs text-ef-ink-3 mb-1">貼上 JSON</label>
              <textarea value={importText} onChange={e => setImportText(e.target.value)}
                rows={8} placeholder='{"zones":...}'
                className="w-full bg-ef-input border border-ef-line rounded-lg px-3 py-2 text-sm text-ef-ink font-mono focus:outline-none focus:border-ef-gold resize-none" />
            </div>

            {error && <div className="text-red-400 text-xs">{error}</div>}

            <button onClick={handleImportFromText} disabled={!importText.trim()}
              className="w-full py-2 bg-ef-gold hover:bg-ef-gold-2 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors cursor-pointer">
              匯入
            </button>

            <p className="text-xs text-ef-ink-4">注意：匯入會覆蓋目前所有設定</p>
          </div>
        </Modal>
      )}

      <ConfirmDialog
        open={pendingImport !== null}
        title="確認匯入"
        message="確定要匯入？目前所有設定將被覆蓋，此操作無法復原。"
        confirmLabel="匯入"
        confirmColor="indigo"
        onConfirm={handleConfirmImport}
        onCancel={() => setPendingImport(null)}
      />

      <ConfirmDialog
        open={showClearDialog}
        title="確認清除"
        message="確定要清除所有資料嗎？"
        confirmLabel="清除"
        confirmColor="red"
        onConfirm={() => { clearAll(); setShowClearDialog(false); }}
        onCancel={() => setShowClearDialog(false)}
      />
    </>
  );
}

function validate(data: unknown): asserts data is AppData {
  if (!data || typeof data !== 'object') throw new Error('無效的資料格式');
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.zones)) throw new Error('缺少 zones');
  if (!Array.isArray(d.buffs)) throw new Error('缺少 buffs');
  if (!Array.isArray(d.characters)) throw new Error('缺少 characters');
  if (!Array.isArray(d.skills)) throw new Error('缺少 skills');
  if (!Array.isArray(d.rotationGroups)) throw new Error('缺少 rotationGroups');
}
