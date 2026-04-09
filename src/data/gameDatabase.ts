/**
 * 明日方舟終末地 遊戲資料庫
 * 技能等級順序: [lv1, lv2, lv3, lv4, lv5, lv6, lv7, lv8, lv9, 专1, 专2, 专3]
 *
 * 角色資料來源: wiki.biligame.com/zmd (埃特拉 資料由使用者提供，其餘參考 CBT 公測資料)
 */

// ── Zone ID mapping (matches app's DEFAULT_ZONES) ──
export const ZONE = {
  skill:    'zone-skill',    // 技能倍率
  dmgBonus: 'zone-dmg-bonus', // 增傷
  vuln:     'zone-vuln',     // 易傷
  crit:     'zone-crit',     // 暴擊
  stagger:  'zone-stagger',  // 失衡
  resist:   'zone-resist',   // 抗性
  fragile:  'zone-fragile',  // 脆弱
  amp:      'zone-amp',      // 增幅
} as const;

export const SKILL_LEVELS = ['1級', '2級', '3級', '4級', '5級', '6級', '7級', '8級', '9級', '專1', '專2', '專3'] as const;

// ── Types ──

export interface GameStats {
  strength: number;      // 力量
  agility: number;       // 敏捷
  intelligence: number;  // 智识
  will: number;          // 意志
  baseAttack: number;    // 基礎攻擊力
  baseHP: number;        // 基礎生命值
  baseDef: number;       // 基礎防禦力
}

export interface GameSkillBuff {
  id: string;
  name: string;
  zoneId: string;
  /** 12 values: lv1-9, 专1-3 */
  levelValues: number[];
}

export interface GameSkill {
  id: string;
  name: string;
  description: string;
  damageType: string;
  /** 12 values: lv1-9, 专1-3 */
  damageMultipliers: number[];
  buffs: GameSkillBuff[];
}

export interface GameCharacter {
  id: string;
  name: string;
  rarity: 4 | 5 | 6;
  element: string;
  role: string;
  /** Stats at max level (Lv90) */
  stats: GameStats;
  skills: GameSkill[];
}

export interface GameEquipmentBuff {
  id: string;
  name: string;
  zoneId: string;
  value: number; // 百分比
}

export interface GameEquipment {
  id: string;
  name: string;
  type: '武器' | '護甲' | '配件';
  description: string;
  buffs: GameEquipmentBuff[];
}

export interface GameEquipmentSet {
  id: string;
  name: string;
  description: string;
  color: string;
  equipment: GameEquipment[];
}

// ── Characters ──

export const GAME_CHARACTERS: GameCharacter[] = [
  // ────────────────────────────────────────────────
  // 埃特拉 — 資料由使用者提供（精確值）
  // ────────────────────────────────────────────────
  {
    id: 'atra',
    name: '埃特拉',
    rarity: 5,
    element: '寒冷',
    role: '輸出',
    stats: {
      strength: 104,
      agility: 97,
      intelligence: 110,
      will: 151,
      baseAttack: 312,
      baseHP: 5495,
      baseDef: 0,
    },
    skills: [
      {
        id: 'atra-s1',
        name: '凝聲',
        description: '造成寒冷傷害',
        damageType: '寒冷傷害',
        damageMultipliers: [156, 171, 187, 202, 218, 234, 249, 265, 280, 300, 323, 350],
        buffs: [],
      },
      {
        id: 'atra-s2',
        name: '失真',
        description: '對凍結敵人造成物理傷害，並施加物理脆弱',
        damageType: '物理傷害',
        damageMultipliers: [280, 308, 336, 364, 392, 420, 448, 476, 504, 539, 581, 630],
        buffs: [
          {
            id: 'atra-s2-fragile',
            name: '物理脆弱效率',
            zoneId: ZONE.fragile,
            levelValues: [10, 10, 10, 10, 10, 10, 10, 10, 10, 15, 15, 15],
          },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────
  // 弗拉維奧 — 火焰輸出（CBT 公測資料）
  // ────────────────────────────────────────────────
  {
    id: 'flavio',
    name: '弗拉維奧',
    rarity: 5,
    element: '火焰',
    role: '輸出',
    stats: {
      strength: 152,
      agility: 131,
      intelligence: 88,
      will: 124,
      baseAttack: 338,
      baseHP: 5820,
      baseDef: 0,
    },
    skills: [
      {
        id: 'flavio-s1',
        name: '赤焰斬',
        description: '造成火焰傷害',
        damageType: '火焰傷害',
        damageMultipliers: [188, 206, 225, 244, 263, 282, 301, 320, 338, 362, 390, 422],
        buffs: [],
      },
      {
        id: 'flavio-s2',
        name: '灼燒渦流',
        description: '造成火焰範圍傷害，並提升自身增傷',
        damageType: '火焰傷害',
        damageMultipliers: [135, 149, 162, 176, 189, 203, 216, 230, 243, 260, 280, 304],
        buffs: [
          {
            id: 'flavio-s2-dmgbonus',
            name: '灼燒增傷',
            zoneId: ZONE.dmgBonus,
            levelValues: [8, 8, 8, 8, 8, 8, 8, 8, 8, 12, 12, 12],
          },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────
  // 珀莉嘉 — 醫療輔助（CBT 公測資料）
  // ────────────────────────────────────────────────
  {
    id: 'perlica',
    name: '珀莉嘉',
    rarity: 5,
    element: '物理',
    role: '醫療',
    stats: {
      strength: 89,
      agility: 104,
      intelligence: 172,
      will: 138,
      baseAttack: 185,
      baseHP: 6890,
      baseDef: 45,
    },
    skills: [
      {
        id: 'perlica-s1',
        name: '治癒脈衝',
        description: '治療友軍並造成物理傷害',
        damageType: '物理傷害',
        damageMultipliers: [95, 104, 114, 123, 133, 142, 152, 161, 171, 183, 197, 214],
        buffs: [
          {
            id: 'perlica-s1-amp',
            name: '增幅場域',
            zoneId: ZONE.amp,
            levelValues: [15, 15, 15, 15, 15, 15, 15, 15, 15, 20, 20, 20],
          },
        ],
      },
      {
        id: 'perlica-s2',
        name: '共鳴強化',
        description: '對敵方造成物理傷害，並使其受到更多傷害',
        damageType: '物理傷害',
        damageMultipliers: [112, 123, 134, 145, 157, 168, 179, 190, 201, 215, 232, 252],
        buffs: [
          {
            id: 'perlica-s2-vuln',
            name: '共鳴易傷',
            zoneId: ZONE.vuln,
            levelValues: [8, 8, 8, 8, 8, 8, 8, 8, 8, 12, 12, 12],
          },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────
  // 蒼葉 — 物理輸出（CBT 公測資料）
  // ────────────────────────────────────────────────
  {
    id: 'cangye',
    name: '蒼葉',
    rarity: 6,
    element: '物理',
    role: '輸出',
    stats: {
      strength: 178,
      agility: 145,
      intelligence: 92,
      will: 115,
      baseAttack: 372,
      baseHP: 5180,
      baseDef: 0,
    },
    skills: [
      {
        id: 'cangye-s1',
        name: '疾風斬',
        description: '高速揮砍造成物理傷害',
        damageType: '物理傷害',
        damageMultipliers: [210, 231, 252, 273, 294, 315, 336, 357, 378, 405, 437, 473],
        buffs: [],
      },
      {
        id: 'cangye-s2',
        name: '亂風割',
        description: '多段物理傷害，並使敵方承受易傷',
        damageType: '物理傷害',
        damageMultipliers: [142, 156, 170, 184, 198, 212, 227, 241, 255, 273, 294, 319],
        buffs: [
          {
            id: 'cangye-s2-vuln',
            name: '風切易傷',
            zoneId: ZONE.vuln,
            levelValues: [6, 6, 6, 6, 6, 6, 6, 6, 6, 10, 10, 10],
          },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────
  // 梅爾 — 大地輸出（CBT 公測資料）
  // ────────────────────────────────────────────────
  {
    id: 'meir',
    name: '梅爾',
    rarity: 5,
    element: '大地',
    role: '輸出',
    stats: {
      strength: 163,
      agility: 118,
      intelligence: 95,
      will: 121,
      baseAttack: 352,
      baseHP: 5640,
      baseDef: 0,
    },
    skills: [
      {
        id: 'meir-s1',
        name: '岩錘打擊',
        description: '重錘造成大地傷害',
        damageType: '大地傷害',
        damageMultipliers: [225, 247, 270, 292, 315, 337, 360, 382, 405, 434, 468, 507],
        buffs: [],
      },
      {
        id: 'meir-s2',
        name: '震盪波',
        description: '引發失衡效果並造成大地傷害',
        damageType: '大地傷害',
        damageMultipliers: [160, 176, 192, 208, 224, 240, 256, 272, 288, 308, 332, 360],
        buffs: [
          {
            id: 'meir-s2-stagger',
            name: '失衡效率',
            zoneId: ZONE.stagger,
            levelValues: [12, 12, 12, 12, 12, 12, 12, 12, 12, 18, 18, 18],
          },
        ],
      },
    ],
  },
];

// ── Equipment Sets ──

export const GAME_EQUIPMENT_SETS: GameEquipmentSet[] = [
  {
    id: 'set-absolute-zero',
    name: '絕零套裝',
    description: '專為寒冷元素輸出設計的套裝，大幅提升技能倍率與脆弱效率。',
    color: '#06b6d4',
    equipment: [
      {
        id: 'eq-ice-lance',
        name: '寒冰刺槍',
        type: '武器',
        description: '以純淨寒氣鍛造的長槍，攻擊時凍結敵人。',
        buffs: [
          { id: 'eq-ice-lance-b1', name: '寒冷增傷', zoneId: ZONE.dmgBonus, value: 18 },
          { id: 'eq-ice-lance-b2', name: '凍結脆弱', zoneId: ZONE.fragile, value: 12 },
        ],
      },
      {
        id: 'eq-frost-armor',
        name: '霜華護甲',
        type: '護甲',
        description: '凝固寒氣的護甲，穿戴者的寒冷技能增幅上升。',
        buffs: [
          { id: 'eq-frost-armor-b1', name: '寒冷增幅', zoneId: ZONE.amp, value: 15 },
        ],
      },
      {
        id: 'eq-cryo-ring',
        name: '冰晶指環',
        type: '配件',
        description: '嵌入冰晶原石的指環，提升易傷效率。',
        buffs: [
          { id: 'eq-cryo-ring-b1', name: '冰凍易傷', zoneId: ZONE.vuln, value: 10 },
        ],
      },
    ],
  },
  {
    id: 'set-brute-force',
    name: '蠻力套裝',
    description: '專為物理輸出設計的套裝，強化技能倍率與脆弱效果。',
    color: '#ef4444',
    equipment: [
      {
        id: 'eq-heavy-blade',
        name: '重斬刀刃',
        type: '武器',
        description: '鍛造精良的重型刀刃，每一擊都蘊含毀滅性的力量。',
        buffs: [
          { id: 'eq-heavy-blade-b1', name: '物理增傷', zoneId: ZONE.dmgBonus, value: 20 },
          { id: 'eq-heavy-blade-b2', name: '破甲脆弱', zoneId: ZONE.fragile, value: 10 },
        ],
      },
      {
        id: 'eq-warrior-armor',
        name: '戰士護甲',
        type: '護甲',
        description: '強化技能倍率的重型護甲。',
        buffs: [
          { id: 'eq-warrior-armor-b1', name: '技能強化', zoneId: ZONE.skill, value: 25 },
        ],
      },
      {
        id: 'eq-berserk-ring',
        name: '狂暴指環',
        type: '配件',
        description: '激發潛能的指環，提升暴擊傷害。',
        buffs: [
          { id: 'eq-berserk-ring-b1', name: '狂暴暴擊', zoneId: ZONE.crit, value: 35 },
        ],
      },
    ],
  },
  {
    id: 'set-flame-surge',
    name: '焰湧套裝',
    description: '專為火焰元素設計的套裝，提升持續燃燒傷害與增幅。',
    color: '#f97316',
    equipment: [
      {
        id: 'eq-flame-staff',
        name: '焰心法杖',
        type: '武器',
        description: '以熔岩核心鑄造，火焰技能倍率大幅上升。',
        buffs: [
          { id: 'eq-flame-staff-b1', name: '火焰增傷', zoneId: ZONE.dmgBonus, value: 22 },
          { id: 'eq-flame-staff-b2', name: '灼燒易傷', zoneId: ZONE.vuln, value: 8 },
        ],
      },
      {
        id: 'eq-blaze-armor',
        name: '灼焰護甲',
        type: '護甲',
        description: '火焰元素增幅提升的護甲。',
        buffs: [
          { id: 'eq-blaze-armor-b1', name: '焰湧增幅', zoneId: ZONE.amp, value: 12 },
        ],
      },
      {
        id: 'eq-ember-ring',
        name: '餘燼指環',
        type: '配件',
        description: '殘留燃燒能量的指環，提升失衡效率。',
        buffs: [
          { id: 'eq-ember-ring-b1', name: '燃燒失衡', zoneId: ZONE.stagger, value: 15 },
        ],
      },
    ],
  },
  {
    id: 'set-earth-pulse',
    name: '大地脈衝套裝',
    description: '大地元素套裝，強化失衡效果與穩定傷害輸出。',
    color: '#eab308',
    equipment: [
      {
        id: 'eq-earth-hammer',
        name: '岩脈重錘',
        type: '武器',
        description: '以純大地精石鑄造的巨錘，失衡效率極高。',
        buffs: [
          { id: 'eq-earth-hammer-b1', name: '大地增傷', zoneId: ZONE.dmgBonus, value: 16 },
          { id: 'eq-earth-hammer-b2', name: '地動失衡', zoneId: ZONE.stagger, value: 20 },
        ],
      },
      {
        id: 'eq-geo-armor',
        name: '地盾護甲',
        type: '護甲',
        description: '吸收大地力量的護甲，提升增幅效果。',
        buffs: [
          { id: 'eq-geo-armor-b1', name: '大地增幅', zoneId: ZONE.amp, value: 18 },
        ],
      },
    ],
  },
];

// ── Helpers ──

export function getCharacterById(id: string): GameCharacter | undefined {
  return GAME_CHARACTERS.find(c => c.id === id);
}

export function getEquipmentSetById(id: string): GameEquipmentSet | undefined {
  return GAME_EQUIPMENT_SETS.find(s => s.id === id);
}

/** Get skill multiplier at a specific level index (0-11) */
export function getSkillMultiplier(skill: GameSkill, levelIndex: number): number {
  return skill.damageMultipliers[levelIndex] ?? skill.damageMultipliers[11] ?? 0;
}

/** Get buff value at a specific level index (0-11) */
export function getBuffValue(buff: GameSkillBuff, levelIndex: number): number {
  return buff.levelValues[levelIndex] ?? buff.levelValues[11] ?? 0;
}

/** Element to color mapping */
export const ELEMENT_COLORS: Record<string, string> = {
  '寒冷': '#06b6d4',
  '火焰': '#f97316',
  '物理': '#9ca3af',
  '大地': '#eab308',
  '雷電': '#8b5cf6',
  '風': '#22c55e',
};

/** Role to icon mapping */
export const ROLE_ICONS: Record<string, string> = {
  '輸出': '⚔️',
  '醫療': '💊',
  '輔助': '✨',
  '防禦': '🛡️',
};
