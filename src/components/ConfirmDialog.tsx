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
  indigo: 'bg-ef-gold hover:bg-ef-gold-2',
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
      <div className="max-w-sm w-full bg-ef-card border border-ef-line rounded-xl shadow-2xl">
        <div className="px-5 py-4 border-b border-ef-line">
          <h3 className="text-sm font-semibold text-ef-ink">{title}</h3>
        </div>
        <div className="px-5 py-3">
          <p className="text-xs text-ef-ink-3">{message}</p>
        </div>
        <div className="px-5 py-3 flex justify-end gap-2 border-t border-ef-line">
          <button onClick={onCancel}
            className="px-3 py-1.5 bg-ef-card border border-ef-line hover:bg-ef-card-hover rounded-lg text-xs font-medium text-ef-ink-2 transition-colors cursor-pointer">
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
