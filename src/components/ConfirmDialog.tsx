import { useEffect, useRef } from 'react';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmColor?: 'red' | 'amber' | 'indigo';
  onConfirm: () => void;
  onCancel: () => void;
}

const colorMap = {
  red: 'bg-red-600 hover:bg-red-500',
  amber: 'bg-amber-600 hover:bg-amber-500',
  indigo: 'bg-indigo-600 hover:bg-indigo-500',
};

export default function ConfirmDialog({ open, title, message, confirmLabel = '確認', confirmColor = 'red', onConfirm, onCancel }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === backdropRef.current) onCancel(); }}
    >
      <div className="max-w-sm w-full bg-gray-900 border border-gray-700 rounded-xl shadow-2xl">
        <div className="px-5 py-4 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-gray-100">{title}</h3>
        </div>
        <div className="px-5 py-3">
          <p className="text-xs text-gray-400">{message}</p>
        </div>
        <div className="px-5 py-3 flex justify-end gap-2 border-t border-gray-800">
          <button onClick={onCancel}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-medium transition-colors cursor-pointer">
            取消
          </button>
          <button onClick={onConfirm}
            className={`px-3 py-1.5 ${colorMap[confirmColor]} rounded-lg text-xs font-medium text-white transition-colors cursor-pointer`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
