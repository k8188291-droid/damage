import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import type { Skill, Buff, Character, DamageZone } from '../types';
import Modal from './Modal';

interface Props {
  skills: Skill[];
  buffs: Buff[];
  characters: Character[];
  zones: DamageZone[];
  onChange: (skills: Skill[]) => void;
}

function SkillModal({ skill, buffs, characters, zones, onSave, onClose }: {
  skill: Skill; buffs: Buff[]; characters: Character[]; zones: DamageZone[];
  onSave: (s: Skill) => void; onClose: () => void;
}) {
  const [d, setD] = useState({ ...skill });
  const p = (patch: Partial<Skill>) => setD(v => ({ ...v, ...patch }));

  const toggleBuff = (id: string) => {
    p({ enabledBuffIds: d.enabledBuffIds.includes(id) ? d.enabledBuffIds.filter(x => x !== id) : [...d.enabledBuffIds, id] });
  };

  // Group buffs by zone
  const buffsByZone = new Map<string, Buff[]>();
  for (const b of buffs) {
    const key = b.zoneId;
    if (!buffsByZone.has(key)) buffsByZone.set(key, []);
    buffsByZone.get(key)!.push(b);
  }

  return (
    <Modal open title="編輯技能" onClose={onClose} width="max-w-xl">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <label className="block text-xs text-gray-400 mb-1">技能名稱</label>
            <input value={d.name} onChange={e => p({ name: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">角色</label>
            <select value={d.characterId} onChange={e => p({ characterId: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500">
              <option value="">選擇角色</option>
              {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">技能倍率 (%)</label>
            <input type="number" value={d.skillMultiplier || ''} onChange={e => p({ skillMultiplier: Number(e.target.value) || 0 })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500" placeholder="100" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-gray-400 font-medium">啟用的 Buff</label>
            <div className="flex gap-3">
              <button onClick={() => p({ enabledBuffIds: buffs.map(b => b.id) })} className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer">全選</button>
              <button onClick={() => p({ enabledBuffIds: [] })} className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer">全不選</button>
            </div>
          </div>
          {buffs.length === 0 ? (
            <p className="text-xs text-gray-600">尚未設定 Buff</p>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {Array.from(buffsByZone.entries()).map(([zoneId, zoneBuffs]) => {
                const zone = zones.find(z => z.id === zoneId);
                return (
                  <div key={zoneId}>
                    {zone && <div className="text-xs font-medium mb-1" style={{ color: zone.color }}>{zone.icon} {zone.displayName}</div>}
                    <div className="flex flex-wrap gap-1.5">
                      {zoneBuffs.map(b => {
                        const on = d.enabledBuffIds.includes(b.id);
                        return (
                          <button key={b.id} onClick={() => toggleBuff(b.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer border transition-all ${on ? 'text-white border-opacity-60' : 'border-gray-700 text-gray-500 opacity-40 hover:opacity-70'}`}
                            style={on ? { backgroundColor: b.color + '30', borderColor: b.color } : undefined}>
                            {b.icon} {b.name} ({b.value}%)
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button onClick={() => onSave(d)} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors cursor-pointer">儲存</button>
      </div>
    </Modal>
  );
}

export default function SkillSection({ skills, buffs, characters, zones, onChange }: Props) {
  const [editing, setEditing] = useState<Skill | null>(null);

  const save = (s: Skill) => {
    const exists = skills.find(x => x.id === s.id);
    onChange(exists ? skills.map(x => x.id === s.id ? s : x) : [...skills, s]);
    setEditing(null);
  };

  const remove = (id: string) => onChange(skills.filter(s => s.id !== id));

  const startNew = () => setEditing({
    id: uuid(), name: `技能 ${skills.length + 1}`, characterId: characters[0]?.id || '',
    skillMultiplier: 100, enabledBuffIds: [], order: skills.length,
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-100">⚔️ 技能</h2>
        <button onClick={startNew} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-medium transition-colors cursor-pointer">+ 新增</button>
      </div>
      {skills.length === 0 ? (
        <p className="text-gray-600 text-sm text-center py-4">尚未新增技能</p>
      ) : (
        <div className="flex gap-2 flex-wrap">
          {skills.map(s => {
            const char = characters.find(c => c.id === s.characterId);
            const activeBuffCount = s.enabledBuffIds.filter(id => buffs.some(b => b.id === id)).length;
            return (
              <div key={s.id} onClick={() => setEditing({ ...s })}
                className="bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-2.5 cursor-pointer hover:border-indigo-500/50 transition-colors group flex items-center gap-3">
                <div>
                  <div className="text-sm font-medium text-gray-200">{s.name}</div>
                  <div className="text-xs text-gray-500">
                    {char ? char.name : '未指定'} · {s.skillMultiplier}% · {activeBuffCount} buff
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); remove(s.id); }}
                  className="text-gray-600 hover:text-red-400 text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
              </div>
            );
          })}
        </div>
      )}
      {editing && <SkillModal skill={editing} buffs={buffs} characters={characters} zones={zones} onSave={save} onClose={() => setEditing(null)} />}
    </section>
  );
}
