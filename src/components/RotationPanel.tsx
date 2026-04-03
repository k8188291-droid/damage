import { v4 as uuid } from 'uuid';
import type { SkillRotation, Skill } from '../types';

interface Props {
  rotation: SkillRotation[];
  skills: Skill[];
  onChange: (rotation: SkillRotation[]) => void;
}

export default function RotationPanel({ rotation, skills, onChange }: Props) {
  const addEntry = () => {
    onChange([
      ...rotation,
      {
        id: uuid(),
        skillId: skills[0]?.id || '',
        count: 1,
      },
    ]);
  };

  const update = (id: string, patch: Partial<SkillRotation>) => {
    onChange(rotation.map(r => (r.id === id ? { ...r, ...patch } : r)));
  };

  const remove = (id: string) => {
    onChange(rotation.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">技能循環</h2>
        <button
          onClick={addEntry}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          + 新增施放
        </button>
      </div>

      {rotation.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-8">尚未設定技能循環，點擊上方按鈕新增施放順序</p>
      )}

      <div className="space-y-2">
        {rotation.map((entry, idx) => {
          const skill = skills.find(s => s.id === entry.skillId);
          return (
            <div
              key={entry.id}
              className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3"
            >
              <span className="text-gray-500 text-sm font-mono w-6">#{idx + 1}</span>
              <select
                value={entry.skillId}
                onChange={e => update(entry.id, { skillId: e.target.value })}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="">選擇技能</option>
                {skills.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400">次數</label>
                <input
                  type="number"
                  min={1}
                  value={entry.count}
                  onChange={e => update(entry.id, { count: Math.max(1, Number(e.target.value) || 1) })}
                  className="w-16 bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100 text-center focus:outline-none focus:border-indigo-500"
                />
              </div>
              {skill && (
                <span className="text-xs text-gray-500">{skill.name}</span>
              )}
              <button
                onClick={() => remove(entry.id)}
                className="text-gray-500 hover:text-red-400 cursor-pointer"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
