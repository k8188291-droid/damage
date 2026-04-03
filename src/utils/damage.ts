import type { Buff, Character, Skill, DamageZone, RotationGroup } from '../types';

export interface ZoneBreakdown {
  zone: DamageZone;
  sources: { buffName: string; value: number }[];
  total: number;
  multiplier: number;
}

export interface SkillDamageResult {
  skill: Skill;
  character: Character | undefined;
  attackPower: number;
  zones: ZoneBreakdown[];
  finalDamage: number;
}

export interface RotationGroupResult {
  group: RotationGroup;
  skillResults: { result: SkillDamageResult; count: number; subtotal: number }[];
  totalDamage: number;
}

export function calculateAttackPower(char: Character): number {
  return (char.baseAttack + char.weaponAttack) * (1 + char.attackPercentBonus / 100);
}

export function calculateSkillDamage(
  skill: Skill,
  characters: Character[],
  buffs: Buff[],
  zones: DamageZone[],
): SkillDamageResult {
  const character = characters.find(c => c.id === skill.characterId);
  const attackPower = character ? calculateAttackPower(character) : 0;
  const enabledBuffs = buffs.filter(b => skill.enabledBuffIds.includes(b.id));

  const zoneMap = new Map<string, { zone: DamageZone; sources: { buffName: string; value: number }[] }>();

  const skillZone = zones.find(z => z.id === 'zone-skill');
  if (skillZone) {
    zoneMap.set(skillZone.id, {
      zone: skillZone,
      sources: [{ buffName: '技能倍率', value: skill.skillMultiplier }],
    });
  }

  for (const buff of enabledBuffs) {
    const zone = zones.find(z => z.id === buff.zoneId);
    if (!zone) continue;
    if (!zoneMap.has(zone.id)) {
      zoneMap.set(zone.id, { zone, sources: [] });
    }
    zoneMap.get(zone.id)!.sources.push({ buffName: buff.name, value: buff.value });
  }

  const zoneBreakdowns: ZoneBreakdown[] = [];
  for (const { zone, sources } of zoneMap.values()) {
    const total = sources.reduce((sum, s) => sum + s.value, 0);
    zoneBreakdowns.push({
      zone,
      sources,
      total,
      multiplier: zone.id === 'zone-skill' ? total / 100 : 1 + total / 100,
    });
  }

  const finalDamage = zoneBreakdowns.reduce((dmg, zb) => dmg * zb.multiplier, attackPower);

  return { skill, character, attackPower, zones: zoneBreakdowns, finalDamage };
}

export function calculateRotationGroup(
  group: RotationGroup,
  skills: Skill[],
  characters: Character[],
  buffs: Buff[],
  zones: DamageZone[],
): RotationGroupResult {
  let totalDamage = 0;
  const skillResults: RotationGroupResult['skillResults'] = [];

  for (const entry of group.entries) {
    const skill = skills.find(s => s.id === entry.skillId);
    if (!skill) continue;
    const result = calculateSkillDamage(skill, characters, buffs, zones);
    const subtotal = result.finalDamage * entry.count;
    totalDamage += subtotal;
    skillResults.push({ result, count: entry.count, subtotal });
  }

  return { group, skillResults, totalDamage };
}
