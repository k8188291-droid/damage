import { useState, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useShallow } from 'zustand/shallow';
import { useAppStore } from '../stores/appStore';
import type { Skill, Buff } from '../types';

interface CartItem {
  type: 'skill' | 'buff';
  id: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

type TabKey = 'operators' | 'equipment' | 'cart';

export default function SearchModal({ open, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('operators');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

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

  const addToCart = (type: 'skill' | 'buff', id: string) => {
    setCart(prev => {
      if (prev.some(c => c.type === type && c.id === id)) return prev;
      return [...prev, { type, id }];
    });
  };

  const removeFromCart = (type: 'skill' | 'buff', id: string) => {
    setCart(prev => prev.filter(c => !(c.type === type && c.id === id)));
  };

  const isInCart = (type: 'skill' | 'buff', id: string) =>
    cart.some(c => c.type === type && c.id === id);

  const [checkoutMsg, setCheckoutMsg] = useState('');

  const handleCheckout = () => {
    const skillItems = cart.filter(c => c.type === 'skill');
    const buffItems = cart.filter(c => c.type === 'buff');

    // Enable buffs
    if (buffItems.length > 0) {
      const buffIds = new Set(buffItems.map(c => c.id));
      setBuffs(prev => prev.map(b => buffIds.has(b.id) ? { ...b, enabled: true } : b));
    }

    // Add skills to active rotation
    if (skillItems.length > 0) {
      let targetRotation = rotationGroups.find(g => g.id === activeRotationId);

      if (!targetRotation) {
        // No active rotation — create a new one with the skills
        const newEntries = skillItems.map(c => ({
          id: uuid(), skillId: c.id, count: 1, disabledBuffIds: [],
        }));
        const newGroup = {
          id: uuid(),
          name: `循環 ${rotationGroups.length + 1}`,
          entries: newEntries,
          disabledBuffIds: [],
        };
        setRotationGroups(prev => [...prev, newGroup]);
        setActiveRotationId(newGroup.id);
        const parts: string[] = [`${skillItems.length} 個技能加入新循環`];
        if (buffItems.length > 0) parts.push(`${buffItems.length} 個 Buff 已啟用`);
        setCheckoutMsg(parts.join('，'));
        setCart([]);
        setTimeout(() => setCheckoutMsg(''), 3000);
        return;
      }

      const newEntries = skillItems.map(c => ({
        id: uuid(), skillId: c.id, count: 1, disabledBuffIds: [],
      }));
      updateRotationGroup({
        ...targetRotation,
        entries: [...targetRotation.entries, ...newEntries],
      });
    }

    const parts: string[] = [];
    if (skillItems.length > 0) parts.push(`${skillItems.length} 個技能加入循環`);
    if (buffItems.length > 0) parts.push(`${buffItems.length} 個 Buff 已啟用`);
    setCheckoutMsg(parts.join('，'));
    setCart([]);
    setTimeout(() => setCheckoutMsg(''), 3000);
  };

  // ── Operator Skills Tab ──
  const filteredSkills = useMemo(() => {
    const q = search.toLowerCase();
    return skills.filter(s => {
      const char = characters.find(c => c.id === s.characterId);
      return (
        s.name.toLowerCase().includes(q) ||
        (char?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [skills, characters, search]);

  const skillsByChar = useMemo(() => {
    const map = new Map<string, { charName: string; skills: Skill[] }>();
    for (const skill of filteredSkills) {
      const char = characters.find(c => c.id === skill.characterId);
      const key = skill.characterId || '__none__';
      if (!map.has(key)) {
        map.set(key, { charName: char?.name ?? '無角色', skills: [] });
      }
      map.get(key)!.skills.push(skill);
    }
    return map;
  }, [filteredSkills, characters]);

  // ── Equipment Buffs Tab ──
  const filteredBuffs = useMemo(() => {
    const q = search.toLowerCase();
    return buffs.filter(b => {
      const group = buffGroups.find(g => g.id === b.groupId);
      return (
        b.name.toLowerCase().includes(q) ||
        (group?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [buffs, buffGroups, search]);

  const buffsByGroup = useMemo(() => {
    const map = new Map<string, { groupName: string; color: string; buffs: Buff[] }>();
    for (const buff of filteredBuffs) {
      const group = buffGroups.find(g => g.id === buff.groupId);
      const key = buff.groupId || '__none__';
      if (!map.has(key)) {
        map.set(key, {
          groupName: group?.name ?? '未分組',
          color: group?.color ?? '#6b7280',
          buffs: [],
        });
      }
      map.get(key)!.buffs.push(buff);
    }
    return map;
  }, [filteredBuffs, buffGroups]);

  if (!open) return null;

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'operators', label: '幹員技能' },
    { key: 'equipment', label: '裝備 Buff' },
    { key: 'cart', label: `購物車${cartCount > 0 ? ` (${cartCount})` : ''}` },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: '85vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 shrink-0">
          <h3 className="text-lg font-semibold text-gray-100">搜尋技能 &amp; Buff</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-xl cursor-pointer leading-none">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 shrink-0 px-5">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => { setActiveTab(t.key); setSearch(''); }}
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

        {/* Search (operators/equipment tabs) */}
        {activeTab !== 'cart' && (
          <div className="px-5 pt-3 pb-2 shrink-0">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={activeTab === 'operators' ? '搜尋技能名稱或角色名稱…' : '搜尋 Buff 名稱或裝備組名稱…'}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-2">

          {/* ── Operators Tab ── */}
          {activeTab === 'operators' && (
            <div className="space-y-4">
              {skillsByChar.size === 0 && (
                <p className="text-gray-600 text-sm text-center py-8">
                  {skills.length === 0 ? '尚未建立任何技能' : '找不到符合的技能'}
                </p>
              )}
              {[...skillsByChar.entries()].map(([key, { charName, skills: cSkills }]) => (
                <div key={key}>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <span>👤</span> {charName}
                  </div>
                  <div className="space-y-1">
                    {cSkills.map(skill => {
                      const skillBuffs = buffs.filter(b => skill.enabledBuffIds.includes(b.id));
                      const inCart = isInCart('skill', skill.id);
                      return (
                        <div
                          key={skill.id}
                          className={`flex items-center justify-between rounded-lg px-3 py-2 border transition-colors ${
                            inCart
                              ? 'bg-indigo-600/15 border-indigo-500/40'
                              : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm text-gray-100 font-medium">{skill.name}</span>
                              <span className="text-xs text-red-400 font-mono">×{skill.skillMultiplier}%</span>
                              {skillBuffs.length > 0 && (
                                <span className="text-xs text-gray-500">{skillBuffs.length} buff</span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => inCart ? removeFromCart('skill', skill.id) : addToCart('skill', skill.id)}
                            className={`ml-3 w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors cursor-pointer shrink-0 ${
                              inCart
                                ? 'bg-indigo-600 text-white hover:bg-red-600'
                                : 'bg-gray-700 text-gray-400 hover:bg-indigo-600 hover:text-white'
                            }`}
                            title={inCart ? '從購物車移除' : '加入購物車'}
                          >
                            {inCart ? '✓' : '+'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Equipment Buffs Tab ── */}
          {activeTab === 'equipment' && (
            <div className="space-y-4">
              {buffsByGroup.size === 0 && (
                <p className="text-gray-600 text-sm text-center py-8">
                  {buffs.length === 0 ? '尚未建立任何 Buff' : '找不到符合的 Buff'}
                </p>
              )}
              {[...buffsByGroup.entries()].map(([key, { groupName, color, buffs: gBuffs }]) => (
                <div key={key}>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-1.5 flex items-center gap-1.5" style={{ color }}>
                    <span
                      className="inline-block w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    {groupName}
                  </div>
                  <div className="space-y-1">
                    {gBuffs.map(buff => {
                      const zone = zones.find(z => z.id === buff.zoneId);
                      const inCart = isInCart('buff', buff.id);
                      return (
                        <div
                          key={buff.id}
                          className={`flex items-center justify-between rounded-lg px-3 py-2 border transition-colors ${
                            inCart
                              ? 'bg-indigo-600/15 border-indigo-500/40'
                              : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
                            <span className="text-base leading-none">{buff.icon}</span>
                            <span className="text-sm text-gray-100 font-medium">{buff.name}</span>
                            {zone && (
                              <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: zone.color + '22', color: zone.color }}>
                                {zone.icon} {zone.displayName}
                              </span>
                            )}
                            <span className="text-xs font-mono text-emerald-400">+{buff.value}%</span>
                            {!buff.enabled && (
                              <span className="text-xs text-gray-600 italic">已停用</span>
                            )}
                          </div>
                          <button
                            onClick={() => inCart ? removeFromCart('buff', buff.id) : addToCart('buff', buff.id)}
                            className={`ml-3 w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors cursor-pointer shrink-0 ${
                              inCart
                                ? 'bg-indigo-600 text-white hover:bg-red-600'
                                : 'bg-gray-700 text-gray-400 hover:bg-indigo-600 hover:text-white'
                            }`}
                            title={inCart ? '從購物車移除' : '加入購物車'}
                          >
                            {inCart ? '✓' : '+'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Cart Tab ── */}
          {activeTab === 'cart' && (
            <div className="space-y-2 py-1">
              {cart.length === 0 && (
                <p className="text-gray-600 text-sm text-center py-8">購物車是空的</p>
              )}
              {cart.map(item => {
                if (item.type === 'skill') {
                  const skill = skills.find(s => s.id === item.id);
                  if (!skill) return null;
                  const char = characters.find(c => c.id === skill.characterId);
                  return (
                    <div key={`skill-${item.id}`} className="flex items-center gap-3 bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2">
                      <span className="text-base">⚔️</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-100 font-medium">{skill.name}</div>
                        {char && <div className="text-xs text-gray-500">{char.name}</div>}
                      </div>
                      <span className="text-xs text-red-400 font-mono">×{skill.skillMultiplier}%</span>
                      <span className="text-xs bg-indigo-900/40 text-indigo-300 px-1.5 py-0.5 rounded">技能</span>
                      <button
                        onClick={() => removeFromCart('skill', item.id)}
                        className="text-gray-600 hover:text-red-400 transition-colors cursor-pointer text-sm"
                      >✕</button>
                    </div>
                  );
                } else {
                  const buff = buffs.find(b => b.id === item.id);
                  if (!buff) return null;
                  const zone = zones.find(z => z.id === buff.zoneId);
                  return (
                    <div key={`buff-${item.id}`} className="flex items-center gap-3 bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2">
                      <span className="text-base">{buff.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-100 font-medium">{buff.name}</div>
                        {zone && <div className="text-xs" style={{ color: zone.color }}>{zone.icon} {zone.displayName}</div>}
                      </div>
                      <span className="text-xs text-emerald-400 font-mono">+{buff.value}%</span>
                      <span className="text-xs bg-emerald-900/40 text-emerald-300 px-1.5 py-0.5 rounded">Buff</span>
                      <button
                        onClick={() => removeFromCart('buff', item.id)}
                        className="text-gray-600 hover:text-red-400 transition-colors cursor-pointer text-sm"
                      >✕</button>
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTab === 'cart' && (
          <div className="px-5 py-3 border-t border-gray-800 shrink-0 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {checkoutMsg ? (
                <span className="text-sm text-emerald-400">{checkoutMsg}</span>
              ) : (
                <span className="text-xs text-gray-600">
                  {cart.length > 0 ? `共 ${cart.length} 項` : ''}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition-colors"
                >
                  清空
                </button>
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
        )}

        {/* Footer hint for non-cart tabs */}
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
