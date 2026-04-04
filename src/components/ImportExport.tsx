import { useRef, useState } from 'react';
import type { AppData } from '../types';
import { CURRENT_VERSION } from '../types';
import { migrateToLatest } from '../migrations';
import Modal from './Modal';

interface Props {
  getData: () => AppData;
  onImport: (data: AppData) => void;
}

export default function ImportExport({ getData, onImport }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [error, setError] = useState('');
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
  };

  const processImport = (raw: string) => {
    const parsed = JSON.parse(raw);
    const migrated = migrateToLatest(parsed);
    validate(migrated);
    onImport(migrated);
    setShowModal(false);
    setImportText('');
    setError('');
  };

  const handleImportFromText = () => {
    try {
      processImport(importText);
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
        processImport(reader.result as string);
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
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-medium transition-colors cursor-pointer">
          匯出
        </button>
        <button onClick={handleCopyToClipboard}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-medium transition-colors cursor-pointer">
          複製
        </button>
        <button onClick={() => setShowModal(true)}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-medium transition-colors cursor-pointer">
          匯入
        </button>
      </div>

      {showModal && (
        <Modal open title="匯入設定" onClose={() => { setShowModal(false); setError(''); }}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">從檔案匯入</label>
              <input ref={fileRef} type="file" accept=".json" onChange={handleImportFromFile}
                className="block w-full text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-indigo-600 file:text-white file:cursor-pointer hover:file:bg-indigo-500" />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-gray-700" />
              <span className="text-xs text-gray-500">或</span>
              <div className="flex-1 border-t border-gray-700" />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">貼上 JSON</label>
              <textarea value={importText} onChange={e => setImportText(e.target.value)}
                rows={8} placeholder='{"zones":...}'
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 font-mono focus:outline-none focus:border-indigo-500 resize-none" />
            </div>

            {error && <div className="text-red-400 text-xs">{error}</div>}

            <button onClick={handleImportFromText} disabled={!importText.trim()}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg font-medium transition-colors cursor-pointer">
              匯入
            </button>

            <p className="text-[11px] text-gray-600">注意：匯入會覆蓋目前所有設定</p>
          </div>
        </Modal>
      )}
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
