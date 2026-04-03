import { useLocalStorage } from './hooks/useLocalStorage';
import { DEFAULT_ZONES } from './types';
import type { DamageZone, Buff, Character, Skill, RotationGroup, AppData } from './types';
import CharacterSection from './components/CharacterSection';
import BuffSection from './components/BuffSection';
import SkillSection from './components/SkillSection';
import RotationSection from './components/RotationSection';
import ImportExport from './components/ImportExport';

function App() {
  const [zones, setZones] = useLocalStorage<DamageZone[]>('dmg-zones', DEFAULT_ZONES);
  const [buffs, setBuffs] = useLocalStorage<Buff[]>('dmg-buffs', []);
  const [characters, setCharacters] = useLocalStorage<Character[]>('dmg-characters', []);
  const [skills, setSkills] = useLocalStorage<Skill[]>('dmg-skills', []);
  const [rotationGroups, setRotationGroups] = useLocalStorage<RotationGroup[]>('dmg-rotation-groups', []);

  const clearAll = () => {
    if (!confirm('確定要清除所有資料嗎？')) return;
    setZones(DEFAULT_ZONES);
    setBuffs([]);
    setCharacters([]);
    setSkills([]);
    setRotationGroups([]);
  };

  const getData = (): AppData => ({ zones, buffs, characters, skills, rotationGroups });

  const handleImport = (data: AppData) => {
    setZones(data.zones);
    setBuffs(data.buffs);
    setCharacters(data.characters);
    setSkills(data.skills);
    setRotationGroups(data.rotationGroups);
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-200">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 [:not(:has(.backdrop-blur-sm))]:backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-100">
            <span className="text-indigo-400">⚔️</span> 傷害計算器
          </h1>
          <div className="flex items-center gap-3">
            <ImportExport getData={getData} onImport={handleImport} />
            <button onClick={clearAll}
              className="px-3 py-1 text-xs text-gray-500 hover:text-red-400 transition-colors cursor-pointer">
              清除全部
            </button>
          </div>
        </div>
      </header>

      {/* Single-page sections */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Row 1: Characters */}
        <CharacterSection characters={characters} onChange={setCharacters} />

        <hr className="border-gray-800" />

        {/* Row 2: Buffs & Zones */}
        <BuffSection buffs={buffs} zones={zones} onBuffsChange={setBuffs} onZonesChange={setZones} />

        <hr className="border-gray-800" />

        {/* Row 3: Skills */}
        <SkillSection skills={skills} buffs={buffs} characters={characters} zones={zones} onChange={setSkills} />

        <hr className="border-gray-800" />

        {/* Row 4: Rotation & Damage */}
        <RotationSection
          rotationGroups={rotationGroups}
          skills={skills}
          buffs={buffs}
          characters={characters}
          zones={zones}
          onChange={setRotationGroups}
        />
      </main>
    </div>
  );
}

export default App;
