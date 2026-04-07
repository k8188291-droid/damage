import type { AppData } from '../types';

interface V1Buff {
  id: string;
  name: string;
  zoneId: string;
  value: number;
  icon: string;
  color: string;
}

interface V1RotationEntry {
  id: string;
  skillId: string;
  count: number;
}

interface V1RotationGroup {
  id: string;
  name: string;
  entries: V1RotationEntry[];
}

interface V1Skill {
  id: string;
  name: string;
  characterId: string;
  skillMultiplier: number;
  enabledBuffIds: string[];
  order: number;
}

interface V1AppData {
  zones: AppData['zones'];
  buffs: V1Buff[];
  characters: AppData['characters'];
  skills: V1Skill[];
  rotationGroups: V1RotationGroup[];
}

export function migrateV1ToV2(data: V1AppData): AppData {
  return {
    version: 2,
    zones: data.zones,
    buffs: data.buffs.map(b => ({
      id: b.id,
      name: b.name,
      zoneId: b.zoneId,
      groupId: '',
      value: b.value,
      icon: b.icon,
      enabled: true,
      condition: 'all' as const,
    })),
    buffGroups: [],
    characters: data.characters,
    skills: data.skills.map(s => ({
      ...s,
      groupId: '',
      damageType: 'physical' as const,
    })),
    skillGroups: [],
    rotationGroups: data.rotationGroups.map(g => ({
      ...g,
      disabledBuffIds: [],
      entries: g.entries.map(e => ({
        ...e,
        disabledBuffIds: [],
      })),
    })),
    calcRows: [],
  };
}
