import { useState, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useShallow } from 'zustand/shallow';
import { useAppStore } from '../stores/appStore';
import type { Character, Skill, Buff } from '../types';

// ── Helpers ──

const PALETTE = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

function strColor(s: string): string {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length];
}

function calcAttackPower(char: Character): number {
  return Math.round((char.baseAttack + char.weaponAttack) * (1 + char.attackPercentBonus / 100));
}

// ── Sub-components ──

function AvatarCard({
  label, sublabel, color, selected, onClick, badge,
}: {
  label: string; sublabel?: string; color: string; selected: boolean; onClick: () => void; badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 cursor-pointer transition-all text-left w-full ${
        selected
          ? 'border-indigo-500 bg-indigo-600/15'
          : 'border-gray-700/60 bg-gray-800/40 hover:border-gray-600 hover:bg-gray-800/70'
      }`}
    >
      {/* Avatar image placeholder */}
      <div
        className="w-full aspect-square rounded-lg flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${color}28 0%, ${color}14 100%)`,
          border: `1px solid ${color}44`,
        }}
      >
        {/* Decorative background shape */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20"
          style={{ background: `linear-gradient(to top, ${color}, transparent)` }}
        />
        <span
          className="text-3xl font-black relative z-10 select-none"
          style={{ color, textShadow: `0 2px 8px ${color}66` }}
        >
          {label[0] ?? '?'}
        </span>
        {badge !== undefined && badge > 0 && (
          <span className="absolute top-1 right-1 text-[9px] bg-gray-900/80 text-gray-400 px-1 py-0.5 rounded">
            {badge}
          </span>
        )}
      </div>
      <span className="text-xs text-gray-300 font-medium text-center leading-tight line-clamp-2 w-full">{label}</span>
      {sublabel && <span className="text-[10px] text-gray-600 text-center">{sublabel}</span>}
    </button>
  );
}

function CartBtn({
  inCart, onAdd, onRemove,
}: { inCart: boolean; onAdd: () => void; onRemove: () => void }) {
  return (
    <button
      onClick={inCart ? onRemove : onAdd}
      className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors cursor-pointer ${
        inCart
          ? 'bg-indigo-600 text-white hover:bg-red-600'
          : 'bg-gray-700/80 text-gray-400 hover:bg-indigo-600 hover:text-white'
      }`}
      title={inCart ? '從購物車移除' : '加入購物車'}
    >
      {inCart ? '✓' : '+'}
    </button>
  );
}

// ── Types ──

interface CartItem { type: 'skill' | 'buff'; id: string; }
interface Props { open: boolean; onClose: () => void; }
type TabKey = 'operators' | 'equipment' | 'cart';

// ── Main Component ──

export default function SearchModal({ open, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('operators');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [selectedGroupKey, setSelectedGroupKey] = useState<string | null>(null);
  const [checkoutMsg, setCheckoutMsg] = useState('');

  const {
    skills, characters, buffs, buffGroups, zones,
    rotationGroups, activeRotationId,
    setBuffs, updateRotationGroup, setRotationGroups, setActiveRotationId,
  } = useAppStore(useShallow(s => ({
    skills: s.skills,
    characters: s.characters,
    buffs: s.buffs,
    buffGroups: s.buffGroups,
    zones: s.zones,
    rotationGroups: s.rotationGroups,
    activeRotationId: s.activeRotationId,
    setBuffs: s.setBuffs,
    updateRotationGroup: s.updateRotationGroup,
    setRotationGroups: s.setRotationGroups,
    setActiveRotationId: s.setActiveRotationId,
  })));

  const cartCount = cart.length;
  const isInCart = (type: 'skill' | 'buff', id: string) => cart.some(c => c.type === type && c.id === id);
  const addToCart = (type: 'skill' | 'buff', id: string) =>
    setCart(prev => prev.some(c => c.type === type && c.id === id) ? prev : [...prev, { type, id }]);
  const removeFromCart = (type: 'skill' | 'buff', id: string) =>
    setCart(prev => prev.filter(c => !(c.type === type && c.id === id)));

  // ── Search filtering ──

  const q = search.toLowerCase().trim();

  // Operators: show characters whose name OR any skill name matches
  const filteredChars = useMemo<Character[]>(() => {
    if (!q) return characters;
    return characters.filter(char => {
      if (char.name.toLowerCase().includes(q)) return true;
      return skills.some(s => s.characterId === char.id && s.name.toLowerCase().includes(q));
    });
  }, [characters, skills, q]);

  // Characters with no characterId also show as "unassigned skills" if matched
  const unassignedSkills = useMemo<Skill[]>(() => {
    const assignedIds = new Set(characters.map(c => c.id));
    const orphans = skills.filter(s => !assignedIds.has(s.characterId));
    if (!q) return orphans;
    return orphans.filter(s => s.name.toLowerCase().includes(q));
  }, [skills, characters, q]);

  // Equipment: buff groups where group name OR any buff name matches
  const filteredGroupKeys = useMemo<Set<string>>(() => {
    if (!q) return new Set([...buffGroups.map(g => g.id), '__none__']);
    const keys = new Set<string>();
    for (const buff of buffs) {
      const group = buffGroups.find(g => g.id === buff.groupId);
      const groupName = group?.name ?? '未分組';
      if (buff.name.toLowerCase().includes(q) || groupName.toLowerCase().includes(q)) {
        keys.add(buff.groupId || '__none__');
      }
    }
    return keys;
  }, [buffs, buffGroups, q]);

  // Buffs to show in selected group, optionally filtered
  const selectedGroupBuffs = useMemo<Buff[]>(() => {
    if (!selectedGroupKey) return [];
    const raw = buffs.filter(b => (b.groupId || '__none__') === selectedGroupKey);
    if (!q) return raw;
    return raw.filter(b => b.name.toLowerCase().includes(q));
  }, [buffs, selectedGroupKey, q]);

  // Skills for selected character
  const selectedCharSkills = useMemo<Skill[]>(() => {
    if (!selectedCharId) return unassignedSkills;
    const raw = skills.filter(s => s.characterId === selectedCharId);
    if (!q) return raw;
    return raw.filter(s => s.name.toLowerCase().includes(q));
  }, [skills, selectedCharId, unassignedSkills, q]);

  const selectedChar = selectedCharId ? characters.find(c => c.id === selectedCharId) : null;

  // Build equipment grid data
  const equipmentGroups = useMemo(() => {
    const result: { key: string; name: string; color: string; buffCount: number }[] = [];
    for (const group of buffGroups) {
      if (!filteredGroupKeys.has(group.id)) continue;
      const count = buffs.filter(b => b.groupId === group.id).length;
      result.push({ key: group.id, name: group.name, color: group.color, buffCount: count });
    }
    // Ungrouped
    if (filteredGroupKeys.has('__none__')) {
      const count = buffs.filter(b => !b.groupId).length;
      if (count > 0) result.push({ key: '__none__', name: '未分組', color: '#6b7280', buffCount: count });
    }
    return result;
  }, [buffGroups, buffs, filteredGroupKeys]);

  // ── Checkout ──

  const handleCheckout = () => {
    const skillItems = cart.filter(c => c.type === 'skill');
    const buffItems = cart.filter(c => c.type === 'buff');

    if (buffItems.length > 0) {
      const ids = new Set(buffItems.map(c => c.id));
      setBuffs(prev => prev.map(b => ids.has(b.id) ? { ...b, enabled: true } : b));
    }

    if (skillItems.length > 0) {
      const targetRotation = rotationGroups.find(g => g.id === activeRotationId);
      const newEntries = skillItems.map(c => ({ id: uuid(), skillId: c.id, count: 1, disabledBuffIds: [] }));

      if (!targetRotation) {
        const newGroup = {
          id: uuid(), name: `循環 ${rotationGroups.length + 1}`,
          entries: newEntries, disabledBuffIds: [],
        };
        setRotationGroups(prev => [...prev, newGroup]);
        setActiveRotationId(newGroup.id);
      } else {
        updateRotationGroup({ ...targetRotation, entries: [...targetRotation.entries, ...newEntries] });
      }
    }

    const parts: string[] = [];
    if (skillItems.length > 0) parts.push(`${skillItems.length} 個技能加入循環`);
    if (buffItems.length > 0) parts.push(`${buffItems.length} 個 Buff 已啟用`);
    setCheckoutMsg(parts.join('，'));
    setCart([]);
    setTimeout(() => setCheckoutMsg(''), 3000);
  };

  if (!open) return null;

  const tabDefs: { key: TabKey; label: string }[] = [
    { key: 'operators', label: '幹員' },
    { key: 'equipment', label: '裝備' },
    { key: 'cart', label: `購物車${cartCount > 0 ? ` (${cartCount})` : ''}` },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-3xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: '88vh' }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 shrink-0">
          <h3 className="text-base font-semibold text-gray-100">明日方舟終末地 — 技能 &amp; Buff 搜尋</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-xl cursor-pointer leading-none">✕</button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b border-gray-800 shrink-0 px-5 gap-1">
          {tabDefs.map(t => (
            <button
              key={t.key}
              onClick={() => {
                setActiveTab(t.key);
                setSearch('');
                setSelectedCharId(null);
                setSelectedGroupKey(null);
              }}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === t.key
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Search bar ── */}
        {activeTab !== 'cart' && (
          <div className="px-5 pt-3 pb-2 shrink-0">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={
                activeTab === 'operators'
                  ? '搜尋角色名稱 或 技能名稱…'
                  : '搜尋裝備名稱 或 套裝名稱…'
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
              autoFocus
            />
          </div>
        )}

        {/* ── Content (two-pane) ── */}
        <div className="flex-1 flex overflow-hidden min-h-0">

          {/* ════ OPERATORS TAB ════ */}
          {activeTab === 'operators' && (
            <>
              {/* Left: character grid */}
              <div className="w-52 shrink-0 border-r border-gray-800 overflow-y-auto px-3 py-3">
                {filteredChars.length === 0 && unassignedSkills.length === 0 && (
                  <p className="text-gray-600 text-xs text-center mt-6">
                    {characters.length === 0 ? '尚未建立任何角色' : '找不到符合的角色'}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {filteredChars.map(char => {
                    const color = strColor(char.name);
                    const skillCount = skills.filter(s => s.characterId === char.id).length;
                    return (
                      <AvatarCard
                        key={char.id}
                        label={char.name}
                        sublabel={`${skillCount} 技能`}
                        color={color}
                        selected={selectedCharId === char.id}
                        onClick={() => setSelectedCharId(selectedCharId === char.id ? null : char.id)}
                        badge={skillCount}
                      />
                    );
                  })}
                  {unassignedSkills.length > 0 && (
                    <AvatarCard
                      label="未分配"
                      sublabel={`${unassignedSkills.length} 技能`}
                      color="#6b7280"
                      selected={selectedCharId === '__none__'}
                      onClick={() => setSelectedCharId(selectedCharId === '__none__' ? null : '__none__')}
                      badge={unassignedSkills.length}
                    />
                  )}
                </div>
              </div>

              {/* Right: character detail */}
              <div className="flex-1 overflow-y-auto px-4 py-3">
                {!selectedCharId ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-600 text-sm text-center">
                      {filteredChars.length > 0
                        ? '← 點擊角色卡查看技能詳情'
                        : characters.length === 0
                          ? '請先在「角色」面板新增角色'
                          : '找不到符合的角色'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Character stats card */}
                    {selectedChar && (
                      <div
                        className="rounded-xl p-4 border flex gap-4 items-start"
                        style={{
                          background: `linear-gradient(135deg, ${strColor(selectedChar.name)}12 0%, transparent 60%)`,
                          borderColor: strColor(selectedChar.name) + '44',
                        }}
                      >
                        {/* Mini avatar */}
                        <div
                          className="w-14 h-14 rounded-xl shrink-0 flex items-center justify-center text-2xl font-black"
                          style={{
                            background: `${strColor(selectedChar.name)}22`,
                            border: `2px solid ${strColor(selectedChar.name)}55`,
                            color: strColor(selectedChar.name),
                          }}
                        >
                          {selectedChar.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-bold text-gray-100 mb-2">{selectedChar.name}</div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-gray-900/60 rounded-lg p-2">
                              <div className="text-[10px] text-gray-500 mb-0.5">基礎攻擊</div>
                              <div className="text-sm font-semibold text-gray-200">{selectedChar.baseAttack}</div>
                            </div>
                            <div className="bg-gray-900/60 rounded-lg p-2">
                              <div className="text-[10px] text-gray-500 mb-0.5">武器攻擊</div>
                              <div className="text-sm font-semibold text-gray-200">{selectedChar.weaponAttack}</div>
                            </div>
                            <div className="bg-gray-900/60 rounded-lg p-2">
                              <div className="text-[10px] text-gray-500 mb-0.5">攻擊加成</div>
                              <div className="text-sm font-semibold text-emerald-400">+{selectedChar.attackPercentBonus}%</div>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            最終攻擊力：<span className="text-amber-400 font-semibold">{calcAttackPower(selectedChar).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Skills list */}
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">技能</div>
                      {selectedCharSkills.length === 0 ? (
                        <p className="text-gray-600 text-sm text-center py-4">此角色暫無技能</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedCharSkills.map(skill => {
                            const skillBuffs = buffs.filter(b => skill.enabledBuffIds.includes(b.id));
                            const inCart = isInCart('skill', skill.id);
                            return (
                              <div
                                key={skill.id}
                                className={`rounded-xl border p-3 transition-colors ${
                                  inCart ? 'border-indigo-500/50 bg-indigo-600/10' : 'border-gray-700/60 bg-gray-800/40'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-sm font-semibold text-gray-100">⚔️ {skill.name}</span>
                                      <span className="text-xs font-mono text-red-400 bg-red-900/20 px-1.5 py-0.5 rounded">
                                        ×{skill.skillMultiplier}%
                                      </span>
                                    </div>
                                    {/* Buff tags */}
                                    {skillBuffs.length > 0 && (
                                      <div className="mt-1.5 flex flex-wrap gap-1">
                                        {skillBuffs.map(b => {
                                          const zone = zones.find(z => z.id === b.zoneId);
                                          return (
                                            <span
                                              key={b.id}
                                              className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                                              style={{
                                                backgroundColor: (zone?.color ?? '#6b7280') + '22',
                                                color: zone?.color ?? '#9ca3af',
                                              }}
                                            >
                                              {b.icon} {b.name} +{b.value}%
                                            </span>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                  <CartBtn
                                    inCart={inCart}
                                    onAdd={() => addToCart('skill', skill.id)}
                                    onRemove={() => removeFromCart('skill', skill.id)}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ════ EQUIPMENT TAB ════ */}
          {activeTab === 'equipment' && (
            <>
              {/* Left: equipment (buff group) grid */}
              <div className="w-52 shrink-0 border-r border-gray-800 overflow-y-auto px-3 py-3">
                {equipmentGroups.length === 0 && (
                  <p className="text-gray-600 text-xs text-center mt-6">
                    {buffGroups.length === 0 ? '尚未建立任何裝備組' : '找不到符合的裝備'}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {equipmentGroups.map(group => (
                    <AvatarCard
                      key={group.key}
                      label={group.name}
                      sublabel={`${group.buffCount} 詞條`}
                      color={group.color}
                      selected={selectedGroupKey === group.key}
                      onClick={() => setSelectedGroupKey(selectedGroupKey === group.key ? null : group.key)}
                      badge={group.buffCount}
                    />
                  ))}
                </div>
              </div>

              {/* Right: equipment detail */}
              <div className="flex-1 overflow-y-auto px-4 py-3">
                {!selectedGroupKey ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-600 text-sm text-center">
                      {equipmentGroups.length > 0
                        ? '← 點擊裝備套裝查看詞條詳情'
                        : buffGroups.length === 0
                          ? '請先在「Buff」面板建立裝備組'
                          : '找不到符合的裝備'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Equipment set header */}
                    {(() => {
                      const grp = equipmentGroups.find(g => g.key === selectedGroupKey);
                      if (!grp) return null;
                      return (
                        <div
                          className="rounded-xl p-4 border flex gap-4 items-center"
                          style={{
                            background: `linear-gradient(135deg, ${grp.color}12 0%, transparent 60%)`,
                            borderColor: grp.color + '44',
                          }}
                        >
                          <div
                            className="w-14 h-14 rounded-xl shrink-0 flex items-center justify-center text-2xl"
                            style={{ background: `${grp.color}22`, border: `2px solid ${grp.color}55` }}
                          >
                            🛡️
                          </div>
                          <div>
                            <div className="text-base font-bold mb-0.5" style={{ color: grp.color }}>{grp.name}</div>
                            <div className="text-xs text-gray-500">套裝 · {grp.buffCount} 個 Buff 詞條</div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Buff list */}
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Buff 詞條</div>
                      {selectedGroupBuffs.length === 0 ? (
                        <p className="text-gray-600 text-sm text-center py-4">此套裝暫無詞條</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedGroupBuffs.map(buff => {
                            const zone = zones.find(z => z.id === buff.zoneId);
                            const inCart = isInCart('buff', buff.id);
                            return (
                              <div
                                key={buff.id}
                                className={`rounded-xl border p-3 transition-colors ${
                                  inCart ? 'border-indigo-500/50 bg-indigo-600/10' : 'border-gray-700/60 bg-gray-800/40'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-xl shrink-0">{buff.icon}</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-sm font-semibold text-gray-100">{buff.name}</span>
                                      <span className="text-xs font-mono text-emerald-400 bg-emerald-900/20 px-1.5 py-0.5 rounded">
                                        +{buff.value}%
                                      </span>
                                      {!buff.enabled && (
                                        <span className="text-[10px] text-gray-600 italic">已停用</span>
                                      )}
                                    </div>
                                    {zone && (
                                      <div className="mt-1 text-xs" style={{ color: zone.color }}>
                                        {zone.icon} {zone.displayName} 分區
                                      </div>
                                    )}
                                  </div>
                                  <CartBtn
                                    inCart={inCart}
                                    onAdd={() => addToCart('buff', buff.id)}
                                    onRemove={() => removeFromCart('buff', buff.id)}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ════ CART TAB ════ */}
          {activeTab === 'cart' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto px-5 py-3">
                {cart.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-600 text-sm">購物車是空的</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cart.map(item => {
                      if (item.type === 'skill') {
                        const skill = skills.find(s => s.id === item.id);
                        if (!skill) return null;
                        const char = characters.find(c => c.id === skill.characterId);
                        const color = char ? strColor(char.name) : '#6b7280';
                        return (
                          <div
                            key={`skill-${item.id}`}
                            className="flex items-center gap-3 rounded-xl border border-gray-700/60 bg-gray-800/40 px-3 py-2.5"
                          >
                            <div
                              className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center font-bold text-sm"
                              style={{ background: `${color}22`, border: `1px solid ${color}44`, color }}
                            >
                              {char?.name[0] ?? '⚔'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-gray-100 font-medium">{skill.name}</div>
                              {char && <div className="text-xs text-gray-500">{char.name}</div>}
                            </div>
                            <span className="text-xs font-mono text-red-400">×{skill.skillMultiplier}%</span>
                            <span className="text-xs bg-indigo-900/40 text-indigo-300 px-1.5 py-0.5 rounded shrink-0">技能</span>
                            <button
                              onClick={() => removeFromCart('skill', item.id)}
                              className="text-gray-600 hover:text-red-400 transition-colors cursor-pointer text-sm shrink-0"
                            >✕</button>
                          </div>
                        );
                      } else {
                        const buff = buffs.find(b => b.id === item.id);
                        if (!buff) return null;
                        const zone = zones.find(z => z.id === buff.zoneId);
                        const group = buffGroups.find(g => g.id === buff.groupId);
                        return (
                          <div
                            key={`buff-${item.id}`}
                            className="flex items-center gap-3 rounded-xl border border-gray-700/60 bg-gray-800/40 px-3 py-2.5"
                          >
                            <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-xl bg-gray-700/60">
                              {buff.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-gray-100 font-medium">{buff.name}</div>
                              <div className="flex items-center gap-1.5 text-xs">
                                {zone && <span style={{ color: zone.color }}>{zone.icon} {zone.displayName}</span>}
                                {group && <span className="text-gray-600">· {group.name}</span>}
                              </div>
                            </div>
                            <span className="text-xs font-mono text-emerald-400">+{buff.value}%</span>
                            <span className="text-xs bg-emerald-900/40 text-emerald-300 px-1.5 py-0.5 rounded shrink-0">Buff</span>
                            <button
                              onClick={() => removeFromCart('buff', item.id)}
                              className="text-gray-600 hover:text-red-400 transition-colors cursor-pointer text-sm shrink-0"
                            >✕</button>
                          </div>
                        );
                      }
                    })}
                  </div>
                )}
              </div>

              {/* Cart footer */}
              <div className="px-5 py-3 border-t border-gray-800 shrink-0 flex items-center justify-between gap-3">
                <div>
                  {checkoutMsg
                    ? <span className="text-sm text-emerald-400">{checkoutMsg}</span>
                    : <span className="text-xs text-gray-600">{cart.length > 0 ? `共 ${cart.length} 項` : ''}</span>
                  }
                </div>
                <div className="flex items-center gap-2">
                  {cart.length > 0 && (
                    <button
                      onClick={() => setCart([])}
                      className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition-colors"
                    >清空</button>
                  )}
                  <button
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-600 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    結帳 →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Sticky bottom hint (non-cart tabs) ── */}
        {activeTab !== 'cart' && cartCount > 0 && (
          <div className="px-5 py-2.5 border-t border-gray-800 shrink-0 flex items-center justify-between">
            <span className="text-xs text-gray-600">已加入 {cartCount} 項</span>
            <button
              onClick={() => setActiveTab('cart')}
              className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors"
            >
              查看購物車 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
