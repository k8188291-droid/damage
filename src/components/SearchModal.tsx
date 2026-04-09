import { useState, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useShallow } from 'zustand/shallow';
import { useAppStore } from '../stores/appStore';
import {
  GAME_CHARACTERS, GAME_EQUIPMENT_SETS, SKILL_LEVELS,
  ELEMENT_COLORS, ROLE_ICONS,
  getSkillMultiplier, getBuffValue,
  type GameCharacter, type GameEquipmentSet, type GameSkill,
} from '../data/gameDatabase';

// ── Helpers ──

function elemColor(element: string): string {
  return ELEMENT_COLORS[element] ?? '#6b7280';
}

function rarityStars(r: number): string {
  return '★'.repeat(r);
}

// ── Cart ──

interface CartSkillItem {
  type: 'skill';
  charId: string;
  skillId: string;
  levelIndex: number; // 0-11
}

interface CartEquipItem {
  type: 'equip';
  setId: string;
  equipId: string;
  buffId: string;
}

type CartItem = CartSkillItem | CartEquipItem;

// ── Props ──

interface Props {
  open: boolean;
  onClose: () => void;
}

type TabKey = 'operators' | 'equipment' | 'cart';

// ── Sub-components ──

function StarBadge({ rarity, element }: { rarity: number; element: string }) {
  const color = elemColor(element);
  return (
    <span className="text-[10px] font-bold" style={{ color }}>
      {'★'.repeat(rarity)}
    </span>
  );
}

// Grid card for characters/equipment
function GridCard({
  name, rarity, tag, tagColor, color, onClick, selected,
}: {
  name: string; rarity?: number; tag: string; tagColor: string; color: string;
  onClick: () => void; selected: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col gap-0 rounded-xl border-2 cursor-pointer overflow-hidden transition-all text-left w-full group ${
        selected ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-gray-700/60 hover:border-gray-500'
      }`}
    >
      {/* Image area */}
      <div
        className="w-full aspect-[3/4] flex flex-col items-center justify-center relative overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${color}28 0%, ${color}12 50%, #111827 100%)` }}
      >
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 20px,rgba(255,255,255,.1) 20px,rgba(255,255,255,.1) 21px),repeating-linear-gradient(90deg,transparent,transparent 20px,rgba(255,255,255,.1) 20px,rgba(255,255,255,.1) 21px)' }}
        />
        {/* Glow accent */}
        <div className="absolute bottom-0 left-0 right-0 h-20 opacity-30"
          style={{ background: `linear-gradient(to top, ${color}, transparent)` }}
        />
        {/* Initial letter */}
        <span
          className="text-5xl font-black select-none relative z-10 drop-shadow-lg transition-transform group-hover:scale-110"
          style={{ color, textShadow: `0 0 40px ${color}88, 0 2px 8px #000` }}
        >
          {name[0] ?? '?'}
        </span>
        {/* Rarity */}
        {rarity && (
          <span className="absolute top-1.5 left-1.5 text-[10px] font-bold" style={{ color }}>
            {'★'.repeat(rarity)}
          </span>
        )}
        {/* Tag (element/set type) */}
        <span
          className="absolute bottom-1.5 right-1.5 text-[9px] px-1.5 py-0.5 rounded font-medium"
          style={{ backgroundColor: tagColor + '33', color: tagColor }}
        >
          {tag}
        </span>
      </div>
      {/* Name */}
      <div className="px-2 py-1.5 bg-gray-900/80">
        <div className="text-xs text-gray-200 font-semibold truncate">{name}</div>
      </div>
    </button>
  );
}

// ── Operator Detail ──

function OperatorDetail({
  char, cart, onAddSkill, onRemoveSkill, search,
}: {
  char: GameCharacter;
  cart: CartItem[];
  onAddSkill: (charId: string, skillId: string, levelIndex: number) => void;
  onRemoveSkill: (charId: string, skillId: string) => void;
  search: string;
}) {
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>(() =>
    Object.fromEntries(char.skills.map(s => [s.id, 11])) // default sp3
  );
  const color = elemColor(char.element);

  const isSkillInCart = (skillId: string) =>
    cart.some(c => c.type === 'skill' && c.charId === char.id && c.skillId === skillId);

  const filteredSkills = useMemo(() => {
    if (!search) return char.skills;
    return char.skills.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  }, [char.skills, search]);

  return (
    <div className="space-y-4">
      {/* Character header */}
      <div
        className="rounded-xl p-4 flex gap-4 items-center border"
        style={{ background: `linear-gradient(135deg, ${color}14, transparent)`, borderColor: color + '44' }}
      >
        {/* Mini avatar */}
        <div
          className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center text-3xl font-black"
          style={{ background: `${color}22`, border: `2px solid ${color}55`, color }}
        >
          {char.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-bold text-gray-100">{char.name}</span>
            <span className="text-xs" style={{ color }}>{char.element}</span>
            <span className="text-xs text-gray-500">{ROLE_ICONS[char.role]} {char.role}</span>
          </div>
          <div className="text-[10px] font-bold mb-2" style={{ color }}>
            {rarityStars(char.rarity)}
          </div>
          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-1">
            {[
              { label: '力量', value: char.stats.strength },
              { label: '敏捷', value: char.stats.agility },
              { label: '智識', value: char.stats.intelligence },
              { label: '意志', value: char.stats.will },
            ].map(s => (
              <div key={s.label} className="bg-gray-900/60 rounded-lg p-1.5 text-center">
                <div className="text-[9px] text-gray-500">{s.label}</div>
                <div className="text-xs font-semibold text-gray-200">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] text-gray-600 mb-0.5">基礎攻擊力</div>
          <div className="text-xl font-black text-amber-400">{char.stats.baseAttack}</div>
          <div className="text-[10px] text-gray-600 mt-1">生命值</div>
          <div className="text-sm font-semibold text-gray-400">{char.stats.baseHP.toLocaleString()}</div>
        </div>
      </div>

      {/* Skills */}
      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">技能</div>
        {filteredSkills.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-4">找不到符合的技能</p>
        )}
        <div className="space-y-3">
          {filteredSkills.map(skill => {
            const lvIdx = skillLevels[skill.id] ?? 11;
            const multiplier = getSkillMultiplier(skill, lvIdx);
            const inCart = isSkillInCart(skill.id);

            return (
              <div
                key={skill.id}
                className={`rounded-xl border p-3 transition-colors ${
                  inCart ? 'border-indigo-500/50 bg-indigo-600/10' : 'border-gray-700/60 bg-gray-800/40'
                }`}
              >
                {/* Skill header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-100">⚔️ {skill.name}</span>
                      <span className="text-xs text-gray-500">{skill.damageType}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">{skill.description}</div>
                  </div>
                  <button
                    onClick={() => inCart
                      ? onRemoveSkill(char.id, skill.id)
                      : onAddSkill(char.id, skill.id, lvIdx)}
                    className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      inCart
                        ? 'bg-indigo-600 text-white hover:bg-red-600'
                        : 'bg-gray-700 text-gray-300 hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    {inCart ? '✓ 已加入' : '+ 購物車'}
                  </button>
                </div>

                {/* Level selector */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] text-gray-500 shrink-0">技能等級</span>
                  <div className="flex flex-wrap gap-1">
                    {SKILL_LEVELS.map((label, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSkillLevels(prev => ({ ...prev, [skill.id]: idx }))}
                        className={`text-[10px] px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                          lvIdx === idx
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-700 text-gray-500 hover:bg-gray-600 hover:text-gray-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Multiplier display */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-500">傷害倍率</span>
                    <span className="text-sm font-bold text-red-400">×{multiplier}%</span>
                  </div>
                  {/* Buff values */}
                  {skill.buffs.map(buff => (
                    <div key={buff.id} className="flex items-center gap-1.5">
                      <span className="text-[10px] text-gray-500">{buff.name}</span>
                      <span className="text-xs font-bold text-emerald-400">
                        +{getBuffValue(buff, lvIdx)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Equipment Detail ──

function EquipmentDetail({
  set, cart, onAddBuff, onRemoveBuff,
}: {
  set: GameEquipmentSet;
  cart: CartItem[];
  onAddBuff: (setId: string, equipId: string, buffId: string) => void;
  onRemoveBuff: (setId: string, equipId: string, buffId: string) => void;
}) {
  const isBuffInCart = (setId: string, equipId: string, buffId: string) =>
    cart.some(c => c.type === 'equip' && c.setId === setId && c.equipId === equipId && c.buffId === buffId);

  return (
    <div className="space-y-4">
      {/* Set header */}
      <div
        className="rounded-xl p-4 flex gap-4 items-center border"
        style={{ background: `linear-gradient(135deg, ${set.color}14, transparent)`, borderColor: set.color + '44' }}
      >
        <div
          className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center text-3xl"
          style={{ background: `${set.color}22`, border: `2px solid ${set.color}55` }}
        >
          🛡️
        </div>
        <div>
          <div className="text-base font-bold mb-0.5" style={{ color: set.color }}>{set.name}</div>
          <div className="text-xs text-gray-500 leading-relaxed">{set.description}</div>
          <div className="text-xs text-gray-600 mt-1">{set.equipment.length} 件裝備</div>
        </div>
      </div>

      {/* Equipment pieces */}
      <div className="space-y-3">
        {set.equipment.map(equip => (
          <div key={equip.id} className="rounded-xl border border-gray-700/60 bg-gray-800/40 overflow-hidden">
            {/* Piece header */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-700/40">
              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-gray-700 text-gray-400">
                {equip.type}
              </span>
              <span className="text-sm font-semibold text-gray-200">{equip.name}</span>
            </div>
            <div className="px-3 py-1.5 text-xs text-gray-600 border-b border-gray-700/30">{equip.description}</div>
            {/* Buffs */}
            <div className="p-2 space-y-1.5">
              {equip.buffs.map(buff => {
                const inCart = isBuffInCart(set.id, equip.id, buff.id);
                return (
                  <div key={buff.id} className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors ${
                    inCart ? 'bg-indigo-600/15 border border-indigo-500/30' : 'bg-gray-900/40'
                  }`}>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-gray-200">{buff.name}</span>
                      <span className="text-xs font-mono text-emerald-400 ml-2">+{buff.value}%</span>
                    </div>
                    <button
                      onClick={() => inCart
                        ? onRemoveBuff(set.id, equip.id, buff.id)
                        : onAddBuff(set.id, equip.id, buff.id)}
                      className={`shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs transition-colors cursor-pointer ${
                        inCart
                          ? 'bg-indigo-600 text-white hover:bg-red-600'
                          : 'bg-gray-700 text-gray-400 hover:bg-indigo-600 hover:text-white'
                      }`}
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
    </div>
  );
}

// ── Main Component ──

export default function SearchModal({ open, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('operators');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [expanded, setExpanded] = useState<{ type: 'char' | 'set'; id: string } | null>(null);
  const [checkoutMsg, setCheckoutMsg] = useState('');

  const { characters, skills, buffs, buffGroups, zones,
    setCharacters, setSkills, setBuffs, setBuffGroups } =
    useAppStore(useShallow(s => ({
      characters: s.characters, skills: s.skills, buffs: s.buffs,
      buffGroups: s.buffGroups, zones: s.zones,
      setCharacters: s.setCharacters, setSkills: s.setSkills,
      setBuffs: s.setBuffs, setBuffGroups: s.setBuffGroups,
    })));

  const cartCount = cart.length;

  // ── Cart helpers ──

  const addSkillToCart = (charId: string, skillId: string, levelIndex: number) => {
    setCart(prev => {
      const exists = prev.some(c => c.type === 'skill' && c.charId === charId && c.skillId === skillId);
      if (exists) {
        // update level
        return prev.map(c => (c.type === 'skill' && c.charId === charId && c.skillId === skillId)
          ? { ...c, levelIndex } : c);
      }
      return [...prev, { type: 'skill', charId, skillId, levelIndex }];
    });
  };

  const removeSkillFromCart = (charId: string, skillId: string) => {
    setCart(prev => prev.filter(c => !(c.type === 'skill' && c.charId === charId && c.skillId === skillId)));
  };

  const addEquipBuffToCart = (setId: string, equipId: string, buffId: string) => {
    setCart(prev => {
      const exists = prev.some(c => c.type === 'equip' && c.setId === setId && c.equipId === equipId && c.buffId === buffId);
      if (exists) return prev;
      return [...prev, { type: 'equip', setId, equipId, buffId }];
    });
  };

  const removeEquipBuffFromCart = (setId: string, equipId: string, buffId: string) => {
    setCart(prev => prev.filter(c => !(c.type === 'equip' && c.setId === setId && c.equipId === equipId && c.buffId === buffId)));
  };

  // ── Search filtering ──

  const filteredChars = useMemo(() => {
    if (!search) return GAME_CHARACTERS;
    const q = search.toLowerCase();
    return GAME_CHARACTERS.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.skills.some(s => s.name.toLowerCase().includes(q))
    );
  }, [search]);

  const filteredSets = useMemo(() => {
    if (!search) return GAME_EQUIPMENT_SETS;
    const q = search.toLowerCase();
    return GAME_EQUIPMENT_SETS.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.equipment.some(e =>
        e.name.toLowerCase().includes(q) ||
        e.buffs.some(b => b.name.toLowerCase().includes(q))
      )
    );
  }, [search]);

  // ── Checkout to settings panel ──

  const handleCheckout = () => {
    if (cart.length === 0) return;

    let addedSkills = 0;
    let addedBuffs = 0;

    // Process skill items
    const skillItems = cart.filter((c): c is CartSkillItem => c.type === 'skill');
    for (const item of skillItems) {
      const gameChar = GAME_CHARACTERS.find(c => c.id === item.charId);
      const gameSkill = gameChar?.skills.find(s => s.id === item.skillId);
      if (!gameChar || !gameSkill) continue;

      // Find or create character in app store
      let appChar = characters.find(c => c.name === gameChar.name);
      let newCharId = appChar?.id ?? '';

      if (!appChar) {
        newCharId = uuid();
        const newChar = {
          id: newCharId,
          name: gameChar.name,
          baseAttack: gameChar.stats.baseAttack,
          weaponAttack: 0,
          attackPercentBonus: 0,
        };
        setCharacters(prev => [...prev, newChar]);
        // Update local ref for skill linking below
        appChar = newChar;
      }

      // Create skill with selected level multiplier
      const multiplier = getSkillMultiplier(gameSkill, item.levelIndex);
      const levelLabel = SKILL_LEVELS[item.levelIndex];

      // Create buffs for this skill first (collect buff IDs)
      const enabledBuffIds: string[] = [];
      for (const gameBuff of gameSkill.buffs) {
        const value = getBuffValue(gameBuff, item.levelIndex);
        const buffId = uuid();
        setBuffs(prev => [...prev, {
          id: buffId,
          name: `${gameBuff.name} (${gameChar.name}·${gameSkill.name}·${levelLabel})`,
          zoneId: gameBuff.zoneId,
          groupId: '',
          value,
          icon: '✨',
          enabled: true,
        }]);
        enabledBuffIds.push(buffId);
        addedBuffs++;
      }

      // Create the skill
      setSkills(prev => [...prev, {
        id: uuid(),
        name: `${gameSkill.name} (${levelLabel})`,
        characterId: newCharId,
        skillMultiplier: multiplier,
        enabledBuffIds,
        order: 0,
        groupId: '',
      }]);
      addedSkills++;
    }

    // Process equipment buff items
    const equipItems = cart.filter((c): c is CartEquipItem => c.type === 'equip');
    for (const item of equipItems) {
      const gameSet = GAME_EQUIPMENT_SETS.find(s => s.id === item.setId);
      const gameEquip = gameSet?.equipment.find(e => e.id === item.equipId);
      const gameBuff = gameEquip?.buffs.find(b => b.id === item.buffId);
      if (!gameSet || !gameEquip || !gameBuff) continue;

      // Find or create buff group (equipment set)
      let appGroup = buffGroups.find(g => g.name === gameSet.name);
      let groupId = appGroup?.id ?? '';

      if (!appGroup) {
        groupId = uuid();
        setBuffGroups(prev => [...prev, { id: groupId, name: gameSet.name, color: gameSet.color }]);
      }

      // Create buff
      setBuffs(prev => [...prev, {
        id: uuid(),
        name: `${gameBuff.name} (${gameEquip.name})`,
        zoneId: gameBuff.zoneId,
        groupId,
        value: gameBuff.value,
        icon: '🛡️',
        enabled: true,
      }]);
      addedBuffs++;
    }

    const parts: string[] = [];
    if (addedSkills > 0) parts.push(`${addedSkills} 個技能已加入「技能庫」`);
    if (addedBuffs > 0) parts.push(`${addedBuffs} 個 Buff 已加入「Buff 面板」`);
    setCheckoutMsg(parts.join('，'));
    setCart([]);
    setTimeout(() => setCheckoutMsg(''), 4000);
  };

  // ── Expanded card data ──

  const expandedChar = expanded?.type === 'char'
    ? GAME_CHARACTERS.find(c => c.id === expanded.id) ?? null
    : null;
  const expandedSet = expanded?.type === 'set'
    ? GAME_EQUIPMENT_SETS.find(s => s.id === expanded.id) ?? null
    : null;

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
          {expanded ? (
            <button
              onClick={() => setExpanded(null)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-200 cursor-pointer transition-colors text-sm"
            >
              ← 返回列表
            </button>
          ) : (
            <h3 className="text-base font-semibold text-gray-100">明日方舟終末地 — 技能 &amp; 裝備搜尋</h3>
          )}
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-xl cursor-pointer leading-none">✕</button>
        </div>

        {/* ── Tabs ── */}
        {!expanded && (
          <div className="flex border-b border-gray-800 shrink-0 px-5 gap-1">
            {tabDefs.map(t => (
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
        )}

        {/* ── Search bar ── */}
        {activeTab !== 'cart' && (
          <div className="px-5 pt-3 pb-2 shrink-0">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={
                expanded
                  ? '搜尋技能名稱…'
                  : activeTab === 'operators'
                    ? '搜尋角色名稱 或 技能名稱…'
                    : '搜尋裝備套裝 或 裝備名稱…'
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        )}

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto min-h-0">

          {/* ═══ EXPANDED DETAIL VIEW ═══ */}
          {expanded && (
            <div className="px-5 py-4">
              {expandedChar && (
                <OperatorDetail
                  char={expandedChar}
                  cart={cart}
                  onAddSkill={addSkillToCart}
                  onRemoveSkill={removeSkillFromCart}
                  search={search}
                />
              )}
              {expandedSet && (
                <EquipmentDetail
                  set={expandedSet}
                  cart={cart}
                  onAddBuff={addEquipBuffToCart}
                  onRemoveBuff={removeEquipBuffFromCart}
                />
              )}
            </div>
          )}

          {/* ═══ OPERATORS GRID ═══ */}
          {!expanded && activeTab === 'operators' && (
            <div className="px-5 py-4">
              {filteredChars.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-12">找不到符合的角色</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {filteredChars.map(char => {
                    const color = elemColor(char.element);
                    const cartCount = cart.filter(c => c.type === 'skill' && c.charId === char.id).length;
                    return (
                      <div key={char.id} className="relative">
                        <GridCard
                          name={char.name}
                          rarity={char.rarity}
                          tag={char.element}
                          tagColor={color}
                          color={color}
                          selected={false}
                          onClick={() => setExpanded({ type: 'char', id: char.id })}
                        />
                        {cartCount > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                            {cartCount}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ═══ EQUIPMENT GRID ═══ */}
          {!expanded && activeTab === 'equipment' && (
            <div className="px-5 py-4">
              {filteredSets.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-12">找不到符合的裝備</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {filteredSets.map(set => {
                    const cartItems = cart.filter(c => c.type === 'equip' && c.setId === set.id).length;
                    return (
                      <div key={set.id} className="relative">
                        <GridCard
                          name={set.name}
                          tag={`${set.equipment.length} 件`}
                          tagColor={set.color}
                          color={set.color}
                          selected={false}
                          onClick={() => setExpanded({ type: 'set', id: set.id })}
                        />
                        {cartItems > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                            {cartItems}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ═══ CART ═══ */}
          {!expanded && activeTab === 'cart' && (
            <div className="px-5 py-4">
              {cart.length === 0 ? (
                <div className="flex items-center justify-center py-16">
                  <p className="text-gray-600 text-sm">購物車是空的，請先到幹員或裝備頁面選擇項目</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cart.map((item, i) => {
                    if (item.type === 'skill') {
                      const gameChar = GAME_CHARACTERS.find(c => c.id === item.charId);
                      const gameSkill = gameChar?.skills.find(s => s.id === item.skillId);
                      if (!gameChar || !gameSkill) return null;
                      const color = elemColor(gameChar.element);
                      const multiplier = getSkillMultiplier(gameSkill, item.levelIndex);
                      const levelLabel = SKILL_LEVELS[item.levelIndex];
                      return (
                        <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-700/60 bg-gray-800/40 px-3 py-2.5">
                          <div
                            className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center font-bold text-base"
                            style={{ background: `${color}22`, border: `1px solid ${color}44`, color }}
                          >
                            {gameChar.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-100 font-medium">
                              ⚔️ {gameSkill.name}
                              <span className="text-[10px] ml-1.5 text-gray-500">{levelLabel}</span>
                            </div>
                            <div className="text-xs text-gray-500">{gameChar.name} · {gameChar.element}</div>
                          </div>
                          <span className="text-xs font-mono text-red-400 shrink-0">×{multiplier}%</span>
                          {gameSkill.buffs.length > 0 && (
                            <span className="text-xs text-emerald-500 shrink-0">+{gameSkill.buffs.length} buff</span>
                          )}
                          <span className="text-xs bg-indigo-900/40 text-indigo-300 px-1.5 py-0.5 rounded shrink-0">技能</span>
                          <button
                            onClick={() => removeSkillFromCart(item.charId, item.skillId)}
                            className="text-gray-600 hover:text-red-400 transition-colors cursor-pointer shrink-0"
                          >✕</button>
                        </div>
                      );
                    } else {
                      const gameSet = GAME_EQUIPMENT_SETS.find(s => s.id === item.setId);
                      const gameEquip = gameSet?.equipment.find(e => e.id === item.equipId);
                      const gameBuff = gameEquip?.buffs.find(b => b.id === item.buffId);
                      if (!gameSet || !gameEquip || !gameBuff) return null;
                      const zone = zones.find(z => z.id === gameBuff.zoneId);
                      return (
                        <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-700/60 bg-gray-800/40 px-3 py-2.5">
                          <div
                            className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-lg bg-gray-700/60"
                            style={{ border: `1px solid ${gameSet.color}44` }}
                          >
                            🛡️
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-100 font-medium">{gameBuff.name}</div>
                            <div className="text-xs text-gray-500">
                              {gameEquip.name} · {gameSet.name}
                              {zone && <span style={{ color: zone.color }}> · {zone.icon}{zone.displayName}</span>}
                            </div>
                          </div>
                          <span className="text-xs font-mono text-emerald-400 shrink-0">+{gameBuff.value}%</span>
                          <span className="text-xs bg-emerald-900/40 text-emerald-300 px-1.5 py-0.5 rounded shrink-0">裝備</span>
                          <button
                            onClick={() => removeEquipBuffFromCart(item.setId, item.equipId, item.buffId)}
                            className="text-gray-600 hover:text-red-400 transition-colors cursor-pointer shrink-0"
                          >✕</button>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-3 border-t border-gray-800 shrink-0 flex items-center justify-between gap-3">
          <div className="min-w-0">
            {checkoutMsg ? (
              <span className="text-sm text-emerald-400">{checkoutMsg}</span>
            ) : cartCount > 0 && !expanded ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">購物車: {cartCount} 項</span>
                {activeTab !== 'cart' && (
                  <button
                    onClick={() => { setActiveTab('cart'); setExpanded(null); }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors"
                  >
                    查看 →
                  </button>
                )}
              </div>
            ) : expanded ? (
              <span className="text-xs text-gray-600">選好後點擊「+購物車」，完成後前往購物車結帳</span>
            ) : null}
          </div>

          {activeTab === 'cart' && !expanded && (
            <div className="flex items-center gap-2 shrink-0">
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
                結帳加入設定面板 →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
