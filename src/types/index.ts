export interface DamageZone {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  color: string;
  isDefault: boolean;
}

export interface Buff {
  id: string;
  name: string;
  zoneId: string;
  value: number;
  icon: string;
  color: string;
}

export interface Character {
  id: string;
  name: string;
  baseAttack: number;
  weaponAttack: number;
  attackPercentBonus: number;
}

export interface Skill {
  id: string;
  name: string;
  characterId: string;
  skillMultiplier: number;
  enabledBuffIds: string[];
  order: number;
}

export interface RotationEntry {
  id: string;
  skillId: string;
  count: number;
}

export interface RotationGroup {
  id: string;
  name: string;
  entries: RotationEntry[];
}

export interface AppData {
  zones: DamageZone[];
  buffs: Buff[];
  characters: Character[];
  skills: Skill[];
  rotationGroups: RotationGroup[];
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
