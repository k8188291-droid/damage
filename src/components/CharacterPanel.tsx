import { v4 as uuid } from 'uuid';
import type { Character } from '../types';

interface Props {
  characters: Character[];
  onChange: (characters: Character[]) => void;
}

export default function CharacterPanel({ characters, onChange }: Props) {
  const addCharacter = () => {
    onChange([
      ...characters,
      {
        id: uuid(),
        name: `角色 ${characters.length + 1}`,
        baseAttack: 0,
        weaponAttack: 0,
        attackPercentBonus: 0,
      },
    ]);
  };

  const update = (id: string, patch: Partial<Character>) => {
    onChange(characters.map(c => (c.id === id ? { ...c, ...patch } : c)));
  };

  const remove = (id: string) => {
    onChange(characters.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">角色設定</h2>
        <button
          onClick={addCharacter}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          + 新增角色
        </button>
      </div>

      {characters.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-8">尚未新增角色，點擊上方按鈕新增</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {characters.map(char => (
          <div
            key={char.id}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={char.name}
                onChange={e => update(char.id, { name: e.target.value })}
                className="bg-transparent border-b border-gray-600 text-gray-100 font-medium text-lg focus:outline-none focus:border-indigo-500 w-48"
              />
              <button
                onClick={() => remove(char.id)}
                className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">角色攻擊力</label>
                <input
                  type="number"
                  value={char.baseAttack || ''}
                  onChange={e => update(char.id, { baseAttack: Number(e.target.value) || 0 })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">武器攻擊力</label>
                <input
                  type="number"
                  value={char.weaponAttack || ''}
                  onChange={e => update(char.id, { weaponAttack: Number(e.target.value) || 0 })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">攻擊力%加成</label>
                <input
                  type="number"
                  value={char.attackPercentBonus || ''}
                  onChange={e => update(char.id, { attackPercentBonus: Number(e.target.value) || 0 })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="text-xs text-gray-500">
              攻擊力 = ({char.baseAttack} + {char.weaponAttack}) × (1 + {char.attackPercentBonus}%) ={' '}
              <span className="text-indigo-400 font-medium">
                {Math.round((char.baseAttack + char.weaponAttack) * (1 + char.attackPercentBonus / 100))}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
