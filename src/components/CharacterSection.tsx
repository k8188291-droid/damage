import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useAppStore } from '../stores/appStore';
import type { Character } from '../types';
import Modal from './Modal';

function CharEditModal({ char, onSave, onClose }: { char: Character; onSave: (c: Character) => void; onClose: () => void }) {
  const [draft, setDraft] = useState<Character>({ ...char });
  const p = (patch: Partial<Character>) => setDraft(d => ({ ...d, ...patch }));

  return (
    <Modal open title={char.id ? '編輯角色' : '新增角色'} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">角色名稱</label>
          <input value={draft.name} onChange={e => p({ name: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">角色攻擊力</label>
            <input type="number" value={draft.baseAttack || ''} onChange={e => p({ baseAttack: Number(e.target.value) || 0 })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500" placeholder="0" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">武器攻擊力</label>
            <input type="number" value={draft.weaponAttack || ''} onChange={e => p({ weaponAttack: Number(e.target.value) || 0 })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500" placeholder="0" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">攻擊力%加成</label>
            <input type="number" value={draft.attackPercentBonus || ''} onChange={e => p({ attackPercentBonus: Number(e.target.value) || 0 })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500" placeholder="0" />
          </div>
        </div>
        <div className="text-sm text-gray-500">
          攻擊力 = ({draft.baseAttack} + {draft.weaponAttack}) × (1 + {draft.attackPercentBonus}%) ={' '}
          <span className="text-indigo-400 font-semibold">{Math.round((draft.baseAttack + draft.weaponAttack) * (1 + draft.attackPercentBonus / 100))}</span>
        </div>
        <button onClick={() => onSave(draft)}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors cursor-pointer">
          儲存
        </button>
      </div>
    </Modal>
  );
}

export default function CharacterSection() {
  const characters = useAppStore(s => s.characters);
  const setCharacters = useAppStore(s => s.setCharacters);
  const [editing, setEditing] = useState<Character | null>(null);

  const save = (c: Character) => {
    const exists = characters.find(x => x.id === c.id);
    setCharacters(exists ? characters.map(x => x.id === c.id ? c : x) : [...characters, c]);
    setEditing(null);
  };

  const remove = (id: string) => setCharacters(characters.filter(c => c.id !== id));

  const startNew = () => setEditing({ id: uuid(), name: `角色 ${characters.length + 1}`, baseAttack: 0, weaponAttack: 0, attackPercentBonus: 0 });

  return (
    <section>
      <div className="flex gap-2 mb-3">
        <button onClick={startNew}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer transition-colors">
          + 角色
        </button>
      </div>
      {characters.length === 0 ? (
        <p className="text-gray-600 text-xs text-center py-3">尚未新增角色</p>
      ) : (
        <div className="space-y-1.5">
          {characters.map(c => {
            const atk = Math.round((c.baseAttack + c.weaponAttack) * (1 + c.attackPercentBonus / 100));
            return (
              <div key={c.id} onClick={() => setEditing({ ...c })}
                className="bg-gray-800/60 border border-gray-700 rounded-xl px-3 py-2 cursor-pointer hover:border-indigo-500/50 transition-colors group flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-700/50 flex items-center justify-center text-sm shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-200 truncate">{c.name}</div>
                  <div className="text-xs text-gray-500">ATK <span className="text-indigo-400">{atk.toLocaleString()}</span></div>
                </div>
                <button onClick={e => { e.stopPropagation(); remove(c.id); }}
                  className="text-gray-600 hover:text-red-400 text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
              </div>
            );
          })}
        </div>
      )}
      {editing && <CharEditModal char={editing} onSave={save} onClose={() => setEditing(null)} />}
    </section>
  );
}
