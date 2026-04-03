import { v4 as uuid } from 'uuid';
import type { DamageZone } from '../types';

interface Props {
  zones: DamageZone[];
  onChange: (zones: DamageZone[]) => void;
}

const EMOJI_OPTIONS = ['⚔️', '🔥', '💀', '💥', '🌀', '🛡️', '🔮', '⚡', '🎯', '💎', '🌟', '🎭', '💫', '🔰', '⭐'];
const COLOR_OPTIONS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#14b8a6'];

export default function ZonePanel({ zones, onChange }: Props) {
  const addZone = () => {
    onChange([
      ...zones,
      {
        id: uuid(),
        name: `自訂分區_${Date.now()}`,
        displayName: '新分區',
        icon: '⭐',
        color: COLOR_OPTIONS[zones.length % COLOR_OPTIONS.length],
        isDefault: false,
      },
    ]);
  };

  const update = (id: string, patch: Partial<DamageZone>) => {
    onChange(zones.map(z => (z.id === id ? { ...z, ...patch } : z)));
  };

  const remove = (id: string) => {
    onChange(zones.filter(z => z.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">傷害分區</h2>
        <button
          onClick={addZone}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          + 自訂分區
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {zones.map(zone => (
          <div
            key={zone.id}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 space-y-2"
            style={{ borderLeftColor: zone.color, borderLeftWidth: 3 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{zone.icon}</span>
                {zone.isDefault ? (
                  <span className="text-gray-100 font-medium">{zone.displayName}</span>
                ) : (
                  <input
                    type="text"
                    value={zone.displayName}
                    onChange={e => update(zone.id, { displayName: e.target.value })}
                    className="bg-transparent border-b border-gray-600 text-gray-100 font-medium focus:outline-none focus:border-indigo-500 w-24"
                  />
                )}
              </div>
              {!zone.isDefault && (
                <button
                  onClick={() => remove(zone.id)}
                  className="text-gray-500 hover:text-red-400 text-sm cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {!zone.isDefault && (
              <div className="flex gap-2 flex-wrap">
                <div className="flex gap-1">
                  {EMOJI_OPTIONS.map(e => (
                    <button
                      key={e}
                      onClick={() => update(zone.id, { icon: e })}
                      className={`text-sm p-0.5 rounded cursor-pointer ${zone.icon === e ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1">
                  {COLOR_OPTIONS.map(c => (
                    <button
                      key={c}
                      onClick={() => update(zone.id, { color: c })}
                      className={`w-5 h-5 rounded-full cursor-pointer border-2 ${zone.color === c ? 'border-white' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
