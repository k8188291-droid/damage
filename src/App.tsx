import { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DEFAULT_ZONES, CURRENT_VERSION } from './types';
import type { DamageZone, Buff, BuffGroup, Character, Skill, SkillGroup, RotationGroup, CalcRow, AppData } from './types';
import { calculateRotationGroup } from './utils/damage';
import IconSidebar from './components/IconSidebar';
import CharacterSection from './components/CharacterSection';
import BuffSection from './components/BuffSection';
import SkillSection from './components/SkillSection';
import CycleBuffBar from './components/CycleBuffBar';
import CycleEditor from './components/CycleEditor';
import AnalysisPanel from './components/AnalysisPanel';
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

  // Layout state
  const [activeRotationId, setActiveRotationId] = useState<string>('');
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    characters: true,
    buffs: true,
    skills: true,
  });
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // One-time migration for existing localStorage data (v1 → v2)
  useEffect(() => {
    setBuffs(prev => prev.map(b => ({
      ...b,
      enabled: (b as unknown as Record<string, unknown>).enabled !== undefined ? b.enabled : true,
      groupId: b.groupId ?? '',
    })));
    setSkills(prev => prev.map(s => ({
      ...s,
      groupId: s.groupId ?? '',
    })));
    // Patch rotation groups & entries: add disabledBuffIds if missing
    setRotationGroups(prev => prev.map(g => ({
      ...g,
      disabledBuffIds: g.disabledBuffIds ?? [],
      entries: g.entries.map(e => ({
        ...e,
        disabledBuffIds: e.disabledBuffIds ?? [],
      })),
    })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-select first rotation if none selected
  useEffect(() => {
    if (rotationGroups.length > 0 && !rotationGroups.find(g => g.id === activeRotationId)) {
      setActiveRotationId(rotationGroups[0].id);
    }
  }, [rotationGroups, activeRotationId]);

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

  // Rotation group operations
  const addRotationGroup = () => {
    const newGroup: RotationGroup = { id: uuid(), name: `循環 ${rotationGroups.length + 1}`, entries: [], disabledBuffIds: [] };
    setRotationGroups([...rotationGroups, newGroup]);
    setActiveRotationId(newGroup.id);
  };

  const updateRotationGroup = (g: RotationGroup) => {
    setRotationGroups(rotationGroups.map(x => x.id === g.id ? g : x));
  };

  const removeRotationGroup = (id: string) => {
    const grp = rotationGroups.find(g => g.id === id);
    if (!grp) return;
    const prev = [...rotationGroups];
    setRotationGroups(rotationGroups.filter(g => g.id !== id));
    pushUndo(`已刪除循環: ${grp.name}`, () => setRotationGroups(prev));
  };

  const copyRotationGroup = (g: RotationGroup) => {
    const copy: RotationGroup = {
      ...g,
      id: uuid(),
      name: `${g.name} (複製)`,
      disabledBuffIds: [...(g.disabledBuffIds || [])],
      entries: g.entries.map(e => ({ ...e, id: uuid(), disabledBuffIds: [...(e.disabledBuffIds || [])] })),
    };
    setRotationGroups([...rotationGroups, copy]);
  };

  // Cycle-level buff toggle
  const toggleCycleBuff = (buffId: string) => {
    setRotationGroups(rotationGroups.map(g => {
      if (g.id !== activeRotationId) return g;
      const disabled = g.disabledBuffIds || [];
      return {
        ...g,
        disabledBuffIds: disabled.includes(buffId)
          ? disabled.filter(id => id !== buffId)
          : [...disabled, buffId],
      };
    }));
  };

  const toggleSection = (key: string) => {
    setVisibleSections(prev => ({ ...prev, [key]: !(prev[key] !== false) }));
  };

  const toggleCollapse = (key: string) => {
    setCollapsedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculate results for all rotation groups
  const groupResults = rotationGroups.map(g => calculateRotationGroup(g, skills, characters, buffs, zones));
  const activeRotation = rotationGroups.find(g => g.id === activeRotationId);
  const activeResult = groupResults.find(r => r.group.id === activeRotationId);

  // Check if left panel has any visible sections
  const hasLeftPanel = Object.values(visibleSections).some(v => v !== false);

  return (
    <div className="h-screen flex bg-[#0f1117] text-gray-200 overflow-hidden">
      {/* Icon Sidebar */}
      <IconSidebar visibleSections={visibleSections} onToggle={toggleSection} />

      {/* Left Panel */}
      {hasLeftPanel && (
        <aside className="w-[360px] bg-gray-900/30 border-r border-gray-800 overflow-y-auto shrink-0 flex flex-col">
          {/* Header area with import/export */}
          <div className="px-4 py-2.5 border-b border-gray-800 flex items-center justify-between shrink-0">
            <span className="text-xs text-gray-500 font-medium">設定面板</span>
            <div className="flex items-center gap-2">
              <ImportExport getData={getData} onImport={handleImport} />
              <button onClick={clearAll}
                className="px-2 py-0.5 text-[10px] text-gray-600 hover:text-red-400 transition-colors cursor-pointer">
                清除
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Characters */}
            {visibleSections.characters !== false && (
              <div className="border-b border-gray-800">
                <button onClick={() => toggleCollapse('characters')}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-800/30 cursor-pointer transition-colors">
                  <span className="text-sm font-semibold text-indigo-400 flex items-center gap-2">
                    <span className={`text-[10px] text-gray-500 transition-transform ${collapsedSections.characters ? '' : 'rotate-90'}`}>▶</span>
                    角色
                  </span>
                </button>
                {!collapsedSections.characters && (
                  <div className="px-3 pb-3">
                    <CharacterSection characters={characters} onChange={setCharacters} />
                  </div>
                )}
              </div>
            )}

            {/* Buffs */}
            {visibleSections.buffs !== false && (
              <div className="border-b border-gray-800">
                <button onClick={() => toggleCollapse('buffs')}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-800/30 cursor-pointer transition-colors">
                  <span className="text-sm font-semibold text-indigo-400 flex items-center gap-2">
                    <span className={`text-[10px] text-gray-500 transition-transform ${collapsedSections.buffs ? '' : 'rotate-90'}`}>▶</span>
                    BUFF / 分區
                  </span>
                </button>
                {!collapsedSections.buffs && (
                  <div className="px-3 pb-3">
                    <BuffSection buffs={buffs} zones={zones} buffGroups={buffGroups}
                      onBuffsChange={setBuffs} onZonesChange={setZones} onBuffGroupsChange={setBuffGroups}
                      pushUndo={pushUndo} />
                  </div>
                )}
              </div>
            )}

            {/* Skills */}
            {visibleSections.skills !== false && (
              <div className="border-b border-gray-800">
                <button onClick={() => toggleCollapse('skills')}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-800/30 cursor-pointer transition-colors">
                  <span className="text-sm font-semibold text-indigo-400 flex items-center gap-2">
                    <span className={`text-[10px] text-gray-500 transition-transform ${collapsedSections.skills ? '' : 'rotate-90'}`}>▶</span>
                    技能庫
                  </span>
                </button>
                {!collapsedSections.skills && (
                  <div className="px-3 pb-3">
                    <SkillSection skills={skills} buffs={buffs} buffGroups={buffGroups}
                      characters={characters} zones={zones} skillGroups={skillGroups}
                      onChange={setSkills} onSkillGroupsChange={setSkillGroups}
                      pushUndo={pushUndo} />
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Center Panel */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Buff Toggle Bar */}
        {activeRotation && (
          <CycleBuffBar
            buffs={buffs}
            buffGroups={buffGroups}
            cycleDisabledBuffIds={activeRotation.disabledBuffIds || []}
            onToggleBuff={toggleCycleBuff}
          />
        )}

        {/* Cycle Editor */}
        {activeRotation && activeResult ? (
          <CycleEditor
            group={activeRotation}
            groupResult={activeResult}
            skills={skills}
            buffs={buffs}
            buffGroups={buffGroups}
            characters={characters}
            zones={zones}
            onUpdate={updateRotationGroup}
            onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
            rightPanelOpen={rightPanelOpen}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-3">尚未建立技能循環</p>
              <button onClick={addRotationGroup}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                + 新增循環
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Right Panel */}
      {rightPanelOpen && rotationGroups.length > 0 && (
        <AnalysisPanel
          rotationGroups={rotationGroups}
          groupResults={groupResults}
          activeRotationId={activeRotationId}
          onSelectRotation={setActiveRotationId}
          onAddRotation={addRotationGroup}
          onRemoveRotation={removeRotationGroup}
          onCopyRotation={copyRotationGroup}
        />
      )}

      {/* Floating calculator */}
      <CalcPanel calcRows={calcRows} onChange={setCalcRows} pushUndo={pushUndo} />

      {/* Undo toast */}
      <UndoToast stack={undoStack} onUndo={handleUndo} onDismiss={dismissUndo} />
    </div>
  );
}

export default App;
