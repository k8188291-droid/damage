import { useState, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import type { CalcRow } from '../types';

interface Props {
  calcRows: CalcRow[];
  onChange: (rows: CalcRow[]) => void;
  pushUndo: (label: string, restore: () => void) => void;
}

function safeEval(formula: string): number {
  const cleaned = formula.trim();
  if (!cleaned) throw new Error('');
  // Block dangerous characters
  if (/[;=`\\{}[\]]/.test(cleaned)) throw new Error('不允許的操作');
  // Replace allowed Math.xxx with placeholder, then check no identifiers remain
  const stripped = cleaned.replace(
    /\bMath\.(abs|ceil|floor|round|sqrt|pow|min|max|log|log2|log10|sin|cos|tan|PI|E)\b/g, '0'
  );
  if (/[a-zA-Z_$]/.test(stripped)) throw new Error('不允許的操作');
  const result = new Function(
    '"use strict";',
    'const {abs,ceil,floor,round,sqrt,pow,min,max,log,log2,log10,sin,cos,tan,PI,E}=Math;',
    `return (${cleaned});`
  )();
  if (typeof result !== 'number' || !isFinite(result)) throw new Error('結果無效');
  return result;
}

function CalcRowItem({ row, onUpdate, onRemove }: {
  row: CalcRow;
  onUpdate: (patch: Partial<CalcRow>) => void;
  onRemove: () => void;
}) {
  const evalResult = useMemo(() => {
    try {
      const val = safeEval(row.formula);
      return { value: val, error: '' };
    } catch (e) {
      return { value: null, error: e instanceof Error ? e.message : '錯誤' };
    }
  }, [row.formula]);

  return (
    <tr className="border-b border-gray-800 last:border-0">
      <td className="py-1.5 pr-2">
        <input value={row.name} onChange={e => onUpdate({ name: e.target.value })}
          className="w-full bg-transparent text-gray-200 text-xs focus:outline-none placeholder-gray-600"
          placeholder="名稱" />
      </td>
      <td className="py-1.5 pr-2">
        <input value={row.formula} onChange={e => onUpdate({ formula: e.target.value })}
          className="w-full bg-transparent text-gray-200 text-xs font-mono focus:outline-none placeholder-gray-600"
          placeholder="例: (1+0.5)*(1+0.3)" />
      </td>
      <td className="py-1.5 pr-1 text-right">
        {evalResult.error ? (
          <span className="text-red-400 text-xs">{evalResult.error || '—'}</span>
        ) : (
          <span className="text-amber-400 text-xs font-mono">{evalResult.value?.toLocaleString(undefined, { maximumFractionDigits: 6 })}</span>
        )}
      </td>
      <td className="py-1.5 pl-1 w-6">
        <button onClick={onRemove} className="text-gray-600 hover:text-red-400 text-xs cursor-pointer">✕</button>
      </td>
    </tr>
  );
}

export default function CalcPanel({ calcRows, onChange, pushUndo }: Props) {
  const [open, setOpen] = useState(false);

  const addRow = () => {
    onChange([...calcRows, { id: uuid(), name: '', formula: '' }]);
  };

  const updateRow = (id: string, patch: Partial<CalcRow>) => {
    onChange(calcRows.map(r => r.id === id ? { ...r, ...patch } : r));
  };

  const removeRow = (id: string) => {
    const row = calcRows.find(r => r.id === id);
    if (!row) return;
    const prev = [...calcRows];
    onChange(calcRows.filter(r => r.id !== id));
    pushUndo(`已刪除計算列: ${row.name || '(未命名)'}`, () => onChange(prev));
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(v => !v)}
        className={`fixed bottom-4 right-4 z-[90] w-10 h-10 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-colors text-lg ${open ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'}`}
        title="計算機"
      >
        🧮
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-16 right-4 z-[90] w-[420px] max-h-[50vh] bg-gray-900 border border-gray-700 rounded-xl shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800 shrink-0">
            <span className="text-sm font-semibold text-gray-200">🧮 計算機</span>
            <button onClick={addRow} className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer">+ 新增列</button>
          </div>
          <div className="overflow-y-auto flex-1 px-3 py-2">
            {calcRows.length === 0 ? (
              <p className="text-gray-600 text-xs text-center py-4">點擊「+ 新增列」開始計算</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] text-gray-500 border-b border-gray-800">
                    <th className="text-left font-normal pb-1 w-24">名稱</th>
                    <th className="text-left font-normal pb-1">公式</th>
                    <th className="text-right font-normal pb-1 w-24">結果</th>
                    <th className="w-6" />
                  </tr>
                </thead>
                <tbody>
                  {calcRows.map(r => (
                    <CalcRowItem key={r.id} row={r}
                      onUpdate={patch => updateRow(r.id, patch)}
                      onRemove={() => removeRow(r.id)} />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </>
  );
}
