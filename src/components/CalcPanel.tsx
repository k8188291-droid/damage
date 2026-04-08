import { useState, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { Calculator } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useUndoStore } from '../stores/undoStore';
import type { CalcRow } from '../types';

function safeEval(formula: string): number {
  const cleaned = formula.trim();
  if (!cleaned) throw new Error('');
  // Block dangerous characters/patterns
  if (/[=`\\{}[\]]/.test(cleaned)) throw new Error('不允許的操作');
  // Replace allowed Math.xxx with placeholder, then check no identifiers remain
  const stripped = cleaned.replace(
    /\bMath\.(abs|ceil|floor|round|sqrt|pow|min|max|log|log2|log10|sin|cos|tan|PI|E)\b/g, '0'
  );
  if (/[a-zA-Z_$]/.test(stripped)) throw new Error('不允許的操作');
  const result = new Function(
    '"use strict"; const {abs,ceil,floor,round,sqrt,pow,min,max,log,log2,log10,sin,cos,tan,PI,E}=Math; return (' + cleaned + ');'
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
    <tr className="border-b border-ef-line last:border-0">
      <td className="py-1.5 pr-2">
        <input value={row.name} onChange={e => onUpdate({ name: e.target.value })}
          className="w-full bg-transparent text-ef-ink text-xs focus:outline-none placeholder-ef-ink-4"
          placeholder="名稱" />
      </td>
      <td className="py-1.5 pr-2">
        <input value={row.formula} onChange={e => onUpdate({ formula: e.target.value })}
          className="w-full bg-transparent text-ef-ink text-xs font-mono focus:outline-none placeholder-ef-ink-4"
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
        <button onClick={onRemove} className="text-ef-ink-4 hover:text-red-400 text-xs cursor-pointer">✕</button>
      </td>
    </tr>
  );
}

export default function CalcPanel() {
  const calcRows = useAppStore(s => s.calcRows);
  const setCalcRows = useAppStore(s => s.setCalcRows);
  const pushUndo = useUndoStore(s => s.pushUndo);
  const [open, setOpen] = useState(false);

  const addRow = () => {
    setCalcRows([...calcRows, { id: uuid(), name: '', formula: '' }]);
  };

  const updateRow = (id: string, patch: Partial<CalcRow>) => {
    setCalcRows(calcRows.map(r => r.id === id ? { ...r, ...patch } : r));
  };

  const removeRow = (id: string) => {
    const row = calcRows.find(r => r.id === id);
    if (!row) return;
    const prev = [...calcRows];
    setCalcRows(calcRows.filter(r => r.id !== id));
    pushUndo(`已刪除計算列: ${row.name || '(未命名)'}`, () => setCalcRows(prev));
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(v => !v)}
        className={`fixed bottom-4 right-4 z-[90] w-10 h-10 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-colors ${open ? 'bg-ef-gold hover:bg-ef-gold-2 text-white' : 'bg-ef-card hover:bg-ef-card-hover border border-ef-line text-ef-ink-3'}`}
        title="計算機"
      >
        <Calculator size={18} />
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-16 right-4 z-[90] w-[420px] max-h-[50vh] bg-ef-card border border-ef-line rounded-xl shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b border-ef-line shrink-0">
            <span className="text-sm font-semibold text-ef-ink flex items-center gap-2">
              <Calculator size={14} className="text-ef-ink-3" /> 計算機
            </span>
            <button onClick={addRow} className="text-xs text-ef-gold hover:text-ef-gold/80 cursor-pointer">+ 新增列</button>
          </div>
          <div className="overflow-y-auto flex-1 px-3 py-2">
            {calcRows.length === 0 ? (
              <p className="text-ef-ink-4 text-xs text-center py-4">點擊「+ 新增列」開始計算</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] text-ef-ink-3 border-b border-ef-line">
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
