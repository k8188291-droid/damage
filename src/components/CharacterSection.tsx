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
          <label className="block text-xs text-ef-ink-3 mb-1">角色名稱</label>
          <input value={draft.name} onChange={e => p({ name: e.target.value })}
            className="w-full bg-ef-input border border-ef-line rounded-lg px-3 py-2 text-ef-ink focus:outline-none focus:border-ef-gold" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-ef-ink-3 mb-1">角色攻擊力</label>
            <input type="number" value={draft.baseAttack || ''} onChange={e => p({ baseAttack: Number(e.target.value) || 0 })}
              className="w-full bg-ef-input border border-ef-line rounded-lg px-3 py-2 text-sm text-ef-ink focus:outline-none focus:border-ef-gold" placeholder="0" />
          </div>
          <div>
            <label className="block text-xs text-ef-ink-3 mb-1">武器攻擊力</label>
            <input type="number" value={draft.weaponAttack || ''} onChange={e => p({ weaponAttack: Number(e.target.value) || 0 })}
              className="w-full bg-ef-input border border-ef-line rounded-lg px-3 py-2 text-sm text-ef-ink focus:outline-none focus:border-ef-gold" placeholder="0" />
          </div>
          <div>
            <label className="block text-xs text-ef-ink-3 mb-1">攻擊力%加成</label>
            <input type="number" value={draft.attackPercentBonus || ''} onChange={e => p({ attackPercentBonus: Number(e.target.value) || 0 })}
              className="w-full bg-ef-input border border-ef-line rounded-lg px-3 py-2 text-sm text-ef-ink focus:outline-none focus:border-ef-gold" placeholder="0" />
          </div>
        </div>
        <div className="text-sm text-ef-ink-3">
          攻擊力 = ({draft.baseAttack} + {draft.weaponAttack}) × (1 + {draft.attackPercentBonus}%) ={' '}
          <span className="text-ef-gold font-semibold">{Math.round((draft.baseAttack + draft.weaponAttack) * (1 + draft.attackPercentBonus / 100))}</span>
        </div>
        <button onClick={() => onSave(draft)}
          className="w-full py-2 bg-ef-gold hover:bg-ef-gold-2 rounded-lg font-medium transition-colors cursor-pointer text-white">
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
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-ef-gold hover:bg-ef-gold-2 text-white cursor-pointer transition-colors">
          + 角色
        </button>
      </div>
      {characters.length === 0 ? (
        <p className="text-ef-ink-4 text-xs text-center py-3">尚未新增角色</p>
      ) : (
        <div className="space-y-1.5">
          {characters.map(c => {
            const atk = Math.round((c.baseAttack + c.weaponAttack) * (1 + c.attackPercentBonus / 100));
            return (
              <div key={c.id} onClick={() => setEditing({ ...c })}
                className="bg-ef-card border border-ef-line rounded-xl px-3 py-2 cursor-pointer hover:border-ef-gold/50 transition-colors group flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-ef-line flex items-center justify-center text-sm shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ef-ink truncate">{c.name}</div>
                  <div className="text-xs text-ef-ink-3">ATK <span className="text-ef-gold">{atk.toLocaleString()}</span></div>
                </div>
                <button onClick={e => { e.stopPropagation(); remove(c.id); }}
                  className="text-ef-ink-4 hover:text-red-400 text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
              </div>
            );
          })}
        </div>
      )}
      {editing && <CharEditModal char={editing} onSave={save} onClose={() => setEditing(null)} />}
    </section>
  );
}
