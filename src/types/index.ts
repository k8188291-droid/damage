export interface DamageZone {
  id: string;
  name: string; // internal zone name key
  displayName: string;
  icon: string;
  color: string;
  isDefault: boolean; // whether it's a built-in zone
}

export interface Buff {
  id: string;
  name: string; // display name for this buff
  zoneId: string; // which zone this buff belongs to
  value: number; // percentage value (e.g. 50 means 50%)
  icon: string;
  color: string;
}

export interface Character {
  id: string;
  name: string;
  baseAttack: number; // character base attack
  weaponAttack: number; // weapon attack
  attackPercentBonus: number; // percentage bonus (e.g. 50 means 50%)
}

export interface Skill {
  id: string;
  name: string;
  characterId: string; // which character uses this skill
  skillMultiplier: number; // skill multiplier percentage
  enabledBuffIds: string[]; // which buffs are active for this skill
  order: number; // for sorting
}

export interface SkillRotation {
  id: string;
  skillId: string;
  count: number; // how many times to cast
}

export interface AppState {
  zones: DamageZone[];
  buffs: Buff[];
  characters: Character[];
  skills: Skill[];
  rotation: SkillRotation[];
}

export const DEFAULT_ZONES: DamageZone[] = [
  { id: 'zone-skill', name: '技能倍率', displayName: '技能倍率', icon: '⚔️', color: '#ef4444', isDefault: true },
  { id: 'zone-dmg-bonus', name: '增傷', displayName: '增傷', icon: '🔥', color: '#f97316', isDefault: true },
  { id: 'zone-vuln', name: '易傷', displayName: '易傷', icon: '💀', color: '#eab308', isDefault: true },
  { id: 'zone-crit', name: '暴擊', displayName: '暴擊', icon: '💥', color: '#22c55e', isDefault: true },
  { id: 'zone-stagger', name: '失衡', displayName: '失衡', icon: '🌀', color: '#06b6d4', isDefault: true },
  { id: 'zone-resist', name: '抗性', displayName: '抗性', icon: '🛡️', color: '#3b82f6', isDefault: true },
  { id: 'zone-fragile', name: '脆弱', displayName: '脆弱', icon: '🔮', color: '#8b5cf6', isDefault: true },
  { id: 'zone-amp', name: '增幅', displayName: '增幅', icon: '⚡', color: '#ec4899', isDefault: true },
];
