import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DEFAULT_ZONES } from './types';
import type { DamageZone, Buff, Character, Skill, SkillRotation } from './types';
import CharacterPanel from './components/CharacterPanel';
import ZonePanel from './components/ZonePanel';
import BuffPanel from './components/BuffPanel';
import SkillPanel from './components/SkillPanel';
import RotationPanel from './components/RotationPanel';
import DamageResult from './components/DamageResult';

const TABS = [
  { id: 'characters', label: '角色', icon: '👤' },
  { id: 'zones', label: '分區', icon: '📊' },
  { id: 'buffs', label: 'Buff', icon: '✨' },
  { id: 'skills', label: '技能', icon: '⚔️' },
  { id: 'rotation', label: '循環', icon: '🔄' },
  { id: 'result', label: '結果', icon: '📈' },
] as const;

type TabId = (typeof TABS)[number]['id'];

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('characters');
  const [zones, setZones] = useLocalStorage<DamageZone[]>('dmg-zones', DEFAULT_ZONES);
  const [buffs, setBuffs] = useLocalStorage<Buff[]>('dmg-buffs', []);
  const [characters, setCharacters] = useLocalStorage<Character[]>('dmg-characters', []);
  const [skills, setSkills] = useLocalStorage<Skill[]>('dmg-skills', []);
  const [rotation, setRotation] = useLocalStorage<SkillRotation[]>('dmg-rotation', []);

  const clearAll = () => {
    if (!confirm('確定要清除所有資料嗎？')) return;
    setZones(DEFAULT_ZONES);
    setBuffs([]);
    setCharacters([]);
    setSkills([]);
    setRotation([]);
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-200">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-100">
            <span className="text-indigo-400">⚔️</span> 傷害計算器
          </h1>
          <button
            onClick={clearAll}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
          >
            清除全部資料
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'characters' && (
          <CharacterPanel characters={characters} onChange={setCharacters} />
        )}
        {activeTab === 'zones' && (
          <ZonePanel zones={zones} onChange={setZones} />
        )}
        {activeTab === 'buffs' && (
          <BuffPanel buffs={buffs} zones={zones} onChange={setBuffs} />
        )}
        {activeTab === 'skills' && (
          <SkillPanel
            skills={skills}
            buffs={buffs}
            characters={characters}
            zones={zones}
            onChange={setSkills}
          />
        )}
        {activeTab === 'rotation' && (
          <RotationPanel rotation={rotation} skills={skills} onChange={setRotation} />
        )}
        {activeTab === 'result' && (
          <DamageResult
            skills={skills}
            buffs={buffs}
            characters={characters}
            zones={zones}
            rotation={rotation}
          />
        )}
      </main>
    </div>
  );
}

export default App;
