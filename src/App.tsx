import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DEFAULT_ZONES, CURRENT_VERSION } from './types';
import type { DamageZone, Buff, BuffGroup, Character, Skill, SkillGroup, RotationGroup, CalcRow, AppData } from './types';
import CharacterSection from './components/CharacterSection';
import BuffSection from './components/BuffSection';
import SkillSection from './components/SkillSection';
import RotationSection from './components/RotationSection';
import ImportExport from './components/ImportExport';
import CalcPanel from './components/CalcPanel';

interface UndoItem {
  id: string;
  label: string;
  restore: () => void;
}

function UndoToast({ stack, onUndo, onDismiss }: {
  stack: UndoItem[];
  onUndo: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  if (stack.length === 0) return null;
  const item = stack[stack.length - 1];
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[95] bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 shadow-2xl flex items-center gap-3 animate-slide-up">
      <span className="text-sm text-gray-300">{item.label}</span>
      <button onClick={() => onUndo(item.id)}
        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-medium cursor-pointer transition-colors">
        復原
      </button>
      <button onClick={() => onDismiss(item.id)} className="text-gray-500 hover:text-gray-300 text-xs cursor-pointer">✕</button>
    </div>
  );
}

function App() {
  const [zones, setZones] = useLocalStorage<DamageZone[]>('dmg-zones', DEFAULT_ZONES);
  const [buffs, setBuffs] = useLocalStorage<Buff[]>('dmg-buffs', []);
  const [buffGroups, setBuffGroups] = useLocalStorage<BuffGroup[]>('dmg-buff-groups', []);
  const [characters, setCharacters] = useLocalStorage<Character[]>('dmg-characters', []);
  const [skills, setSkills] = useLocalStorage<Skill[]>('dmg-skills', []);
  const [skillGroups, setSkillGroups] = useLocalStorage<SkillGroup[]>('dmg-skill-groups', []);
  const [rotationGroups, setRotationGroups] = useLocalStorage<RotationGroup[]>('dmg-rotation-groups', []);
  const [calcRows, setCalcRows] = useLocalStorage<CalcRow[]>('dmg-calc-rows', []);

  // One-time migration for existing localStorage data (v1 → v2)
  useEffect(() => {
    // Patch buffs: add enabled + groupId if missing, remove color
    setBuffs(prev => prev.map(b => ({
      ...b,
      enabled: (b as unknown as Record<string, unknown>).enabled !== undefined ? b.enabled : true,
      groupId: b.groupId ?? '',
    })));
    // Patch skills: add groupId if missing
    setSkills(prev => prev.map(s => ({
      ...s,
      groupId: s.groupId ?? '',
    })));
    // Patch rotation entries: add disabledBuffIds if missing
    setRotationGroups(prev => prev.map(g => ({
      ...g,
      entries: g.entries.map(e => ({
        ...e,
        disabledBuffIds: e.disabledBuffIds ?? [],
      })),
    })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Undo system
  const [undoStack, setUndoStack] = useState<UndoItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const pushUndo = useCallback((label: string, restore: () => void) => {
    const id = crypto.randomUUID();
    setUndoStack(prev => [...prev, { id, label, restore }]);
    const timer = setTimeout(() => {
      setUndoStack(prev => prev.filter(x => x.id !== id));
      timersRef.current.delete(id);
    }, 5000);
    timersRef.current.set(id, timer);
  }, []);

  const handleUndo = useCallback((id: string) => {
    setUndoStack(prev => {
      const item = prev.find(x => x.id === id);
      if (item) item.restore();
      return prev.filter(x => x.id !== id);
    });
    const timer = timersRef.current.get(id);
    if (timer) { clearTimeout(timer); timersRef.current.delete(id); }
  }, []);

  const dismissUndo = useCallback((id: string) => {
    setUndoStack(prev => prev.filter(x => x.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) { clearTimeout(timer); timersRef.current.delete(id); }
  }, []);

  // Cleanup timers
  useEffect(() => {
    return () => {
      timersRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  const clearAll = () => {
    if (!confirm('確定要清除所有資料嗎？')) return;
    setZones(DEFAULT_ZONES);
    setBuffs([]);
    setBuffGroups([]);
    setCharacters([]);
    setSkills([]);
    setSkillGroups([]);
    setRotationGroups([]);
    setCalcRows([]);
  };

  const getData = (): AppData => ({
    version: CURRENT_VERSION,
    zones, buffs, buffGroups, characters, skills, skillGroups, rotationGroups, calcRows,
  });

  const handleImport = (data: AppData) => {
    setZones(data.zones);
    setBuffs(data.buffs);
    setBuffGroups(data.buffGroups || []);
    setCharacters(data.characters);
    setSkills(data.skills);
    setSkillGroups(data.skillGroups || []);
    setRotationGroups(data.rotationGroups);
    setCalcRows(data.calcRows || []);
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
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8 pb-20">
        {/* Row 1: Characters */}
        <CharacterSection characters={characters} onChange={setCharacters} />

        <hr className="border-gray-800" />

        {/* Row 2: Buffs & Zones */}
        <BuffSection buffs={buffs} zones={zones} buffGroups={buffGroups}
          onBuffsChange={setBuffs} onZonesChange={setZones} onBuffGroupsChange={setBuffGroups}
          pushUndo={pushUndo} />

        <hr className="border-gray-800" />

        {/* Row 3: Skills */}
        <SkillSection skills={skills} buffs={buffs} buffGroups={buffGroups}
          characters={characters} zones={zones} skillGroups={skillGroups}
          onChange={setSkills} onSkillGroupsChange={setSkillGroups}
          pushUndo={pushUndo} />

        <hr className="border-gray-800" />

        {/* Row 4: Rotation & Damage */}
        <RotationSection
          rotationGroups={rotationGroups}
          skills={skills}
          buffs={buffs}
          buffGroups={buffGroups}
          characters={characters}
          zones={zones}
          onChange={setRotationGroups}
          pushUndo={pushUndo}
        />
      </main>

      {/* Floating calculator */}
      <CalcPanel calcRows={calcRows} onChange={setCalcRows} pushUndo={pushUndo} />

      {/* Undo toast */}
      <UndoToast stack={undoStack} onUndo={handleUndo} onDismiss={dismissUndo} />
    </div>
  );
}

export default App;
