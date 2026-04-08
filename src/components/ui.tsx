import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

export const COLORS = ['#ef4444','#f97316','#eab308','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899','#f43f5e','#14b8a6','#a855f7','#64748b'];

/* ── Custom Tooltip (no html title) ── */
export function Tooltip({ children, label }: { children: React.ReactNode; label: string }) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  const show = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      setPos({ top: r.top - 6, left: r.left + r.width / 2 });
    }
  };

  return (
    <>
      <span ref={ref} className="inline-flex items-center"
        onMouseEnter={show} onMouseLeave={() => setPos(null)}>
        {children}
      </span>
      {pos && createPortal(
        <div
          className="fixed z-[300] pointer-events-none"
          style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -100%)' }}>
          <div className="bg-[#2a2725] border border-[#3a3530] rounded px-2 py-1 text-xs text-[#e8e4de] whitespace-nowrap shadow-lg mb-1.5">
            {label}
          </div>
          <div style={{
            width: 0, height: 0, margin: '0 auto',
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: '4px solid #3a3530',
          }} />
        </div>,
        document.body
      )}
    </>
  );
}

/* ── Color Dot Picker ── */
// Hover to open dropdown with all colors; click dot to cycle; click a color to select directly.
export function ColorDotPicker({ color, onChange, onCycle }: {
  color: string;
  onChange: (c: string) => void;
  onCycle: () => void;
}) {
  const [dropPos, setDropPos] = useState<{ top: number; left: number } | null>(null);
  const dotRef = useRef<HTMLButtonElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const openDrop = () => {
    clearTimeout(leaveTimer.current);
    if (dotRef.current) {
      const r = dotRef.current.getBoundingClientRect();
      setDropPos({ top: r.bottom + 6, left: r.left });
    }
  };

  const schedulClose = () => {
    leaveTimer.current = setTimeout(() => setDropPos(null), 150);
  };

  const cancelClose = () => clearTimeout(leaveTimer.current);

  const currentIdx = COLORS.indexOf(color);
  const nextColor = COLORS[(currentIdx + 1) % COLORS.length];

  return (
    <>
      <button
        ref={dotRef}
        onClick={onCycle}
        onMouseEnter={openDrop}
        onMouseLeave={schedulClose}
        className="w-3 h-3 rounded-full shrink-0 cursor-pointer hover:scale-125 transition-transform"
        style={{ backgroundColor: color }}
      />
      {dropPos && createPortal(
        <div
          className="fixed z-[300] bg-ef-card border border-ef-line rounded-lg p-2.5 shadow-2xl"
          style={{ top: dropPos.top, left: dropPos.left }}
          onMouseEnter={cancelClose}
          onMouseLeave={schedulClose}>
          <div className="text-[10px] text-ef-ink-3 mb-2">選擇顏色 <span className="text-ef-ink-4">（點擊色點輪換）</span></div>
          <div className="grid grid-cols-6 gap-1.5">
            {COLORS.map((c, i) => {
              const isCurrent = c === color;
              const isNext = i === (currentIdx + 1) % COLORS.length;
              return (
                <button
                  key={c}
                  onClick={() => { onChange(c); setDropPos(null); }}
                  className="relative cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                  style={{ width: 20, height: 20 }}>
                  <span className={`block w-full h-full rounded-full border-2 ${isCurrent ? 'border-ef-ink scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c, display: 'block' }} />
                  {/* "next" indicator arrow */}
                  {isNext && !isCurrent && (
                    <span className="absolute -top-1 -right-1 text-[8px] text-white leading-none select-none">›</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-2 pt-2 border-t border-ef-line-2 flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-[10px] text-ef-ink-3">目前</span>
            <span className="mx-1 text-ef-ink-4">→</span>
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: nextColor }} />
            <span className="text-[10px] text-ef-ink-3">下一個</span>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
