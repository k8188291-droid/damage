import type { Buff, Character, Skill, DamageZone } from '../types';

export interface ZoneBreakdown {
  zone: DamageZone;
  sources: { buffName: string; value: number }[];
  total: number; // sum of values in this zone
  multiplier: number; // 1 + total/100
}

export interface SkillDamageResult {
  skill: Skill;
  character: Character | undefined;
  attackPower: number;
  zones: ZoneBreakdown[];
  finalDamage: number;
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

  // Group buffs by zone
  const zoneMap = new Map<string, { zone: DamageZone; sources: { buffName: string; value: number }[] }>();

  // Always add skill multiplier as the first zone
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

  // Final damage = attack * product of all zone multipliers
  const finalDamage = zoneBreakdowns.reduce(
    (dmg, zb) => dmg * zb.multiplier,
    attackPower,
  );

  return {
    skill,
    character,
    attackPower,
    zones: zoneBreakdowns,
    finalDamage,
  };
}
