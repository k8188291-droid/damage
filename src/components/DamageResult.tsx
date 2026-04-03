import type { Skill, Buff, Character, DamageZone, SkillRotation } from '../types';
import { calculateSkillDamage, type SkillDamageResult } from '../utils/damage';

interface Props {
  skills: Skill[];
  buffs: Buff[];
  characters: Character[];
  zones: DamageZone[];
  rotation: SkillRotation[];
}

function formatNumber(n: number): string {
  return Math.round(n).toLocaleString();
}

function SkillBreakdown({ result }: { result: SkillDamageResult }) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-100">
          {result.skill.name}
          {result.character && (
            <span className="text-sm text-gray-400 ml-2">({result.character.name})</span>
          )}
        </h3>
        <span className="text-lg font-bold text-amber-400">
          {formatNumber(result.finalDamage)}
        </span>
      </div>

      {/* Attack power */}
      <div className="text-xs text-gray-400">
        攻擊力: <span className="text-indigo-400">{formatNumber(result.attackPower)}</span>
      </div>

      {/* Zone breakdowns */}
      <div className="space-y-2">
        {result.zones.map(zb => (
          <div key={zb.zone.id} className="text-sm">
            <div className="flex items-center justify-between">
              <span style={{ color: zb.zone.color }}>
                {zb.zone.icon} {zb.zone.displayName}
              </span>
              <span className="text-gray-300 font-mono">
                ×{zb.multiplier.toFixed(4)}
              </span>
            </div>
            <div className="ml-4 text-xs text-gray-500 space-y-0.5">
              {zb.sources.map((s, i) => (
                <div key={i} className="flex justify-between">
                  <span>{s.buffName}</span>
                  <span>{s.value}%</span>
                </div>
              ))}
              {zb.sources.length > 1 && (
                <div className="flex justify-between text-gray-400 border-t border-gray-700 pt-0.5">
                  <span>合計</span>
                  <span>{zb.total}%</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Formula */}
      <div className="text-xs text-gray-500 border-t border-gray-700 pt-2 break-all">
        <span className="text-gray-400">公式: </span>
        {formatNumber(result.attackPower)}
        {result.zones.map(zb => (
          <span key={zb.zone.id}>
            {' × '}<span style={{ color: zb.zone.color }}>{zb.multiplier.toFixed(4)}</span>
          </span>
        ))}
        {' = '}
        <span className="text-amber-400 font-medium">{formatNumber(result.finalDamage)}</span>
      </div>
    </div>
  );
}

export default function DamageResult({ skills, buffs, characters, zones, rotation }: Props) {
  // Calculate all skill results
  const skillResults = new Map<string, SkillDamageResult>();
  for (const skill of skills) {
    skillResults.set(skill.id, calculateSkillDamage(skill, characters, buffs, zones));
  }

  // Calculate rotation total
  let totalDamage = 0;
  const rotationDetails: { entry: SkillRotation; result: SkillDamageResult | undefined; subtotal: number }[] = [];
  for (const entry of rotation) {
    const result = skillResults.get(entry.skillId);
    const subtotal = result ? result.finalDamage * entry.count : 0;
    totalDamage += subtotal;
    rotationDetails.push({ entry, result, subtotal });
  }

  return (
    <div className="space-y-6">
      {/* Total */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-700/50 rounded-2xl p-6 text-center">
        <div className="text-sm text-gray-400 mb-1">總傷害</div>
        <div className="text-4xl font-bold text-amber-400">{formatNumber(totalDamage)}</div>
        {rotation.length > 0 && (
          <div className="mt-3 text-sm text-gray-400 space-y-1">
            {rotationDetails.map((d, i) => {
              const skill = skills.find(s => s.id === d.entry.skillId);
              return (
                <div key={d.entry.id} className="flex justify-center gap-4">
                  <span>#{i + 1} {skill?.name || '未知技能'}</span>
                  <span>×{d.entry.count}</span>
                  <span className="text-amber-400">{formatNumber(d.subtotal)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Individual skill breakdowns */}
      <div>
        <h2 className="text-lg font-semibold text-gray-100 mb-3">技能傷害詳情</h2>
        <div className="space-y-4">
          {skills.map(skill => {
            const result = skillResults.get(skill.id);
            return result ? <SkillBreakdown key={skill.id} result={result} /> : null;
          })}
        </div>
      </div>

      {skills.length === 0 && (
        <p className="text-gray-500 text-center py-12">請先設定角色、Buff 和技能</p>
      )}
    </div>
  );
}
