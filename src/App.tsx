import { useState, useCallback, useRef, useEffect, type MouseEvent as ReactMouseEvent } from 'react';
import { v4 as uuid } from 'uuid';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DEFAULT_ZONES, CURRENT_VERSION } from './types';
import type { DamageZone, Buff, BuffGroup, Character, Skill, SkillGroup, RotationGroup, CalcRow, AppData, Tab, Preset } from './types';
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
import TabBar from './components/TabBar';
import PresetSection from './components/PresetSection';
import { Tooltip } from './components/ui';

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

function makeEmptyData(): AppData {
  return {
    version: CURRENT_VERSION,
    zones: DEFAULT_ZONES,
    buffs: [],
    buffGroups: [],
    characters: [],
    skills: [],
    skillGroups: [],
    rotationGroups: [],
    calcRows: [],
  };
}

function makeTab(name: string, data?: AppData): Tab {
  return { id: uuid(), name, data: data || makeEmptyData() };
}

/** Migrate legacy per-key localStorage into the first tab */
function migrateLegacyData(): Tab[] | null {
  const keys = ['dmg-zones', 'dmg-buffs', 'dmg-buff-groups', 'dmg-characters', 'dmg-skills', 'dmg-skill-groups', 'dmg-rotation-groups', 'dmg-calc-rows'];
  const hasLegacy = keys.some(k => window.localStorage.getItem(k) !== null);
  if (!hasLegacy) return null;

  const parse = <T,>(key: string, fallback: T): T => {
    try { const v = window.localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  };

  const data: AppData = {
    version: CURRENT_VERSION,
    zones: parse<DamageZone[]>('dmg-zones', DEFAULT_ZONES),
    buffs: parse<Buff[]>('dmg-buffs', []),
    buffGroups: parse<BuffGroup[]>('dmg-buff-groups', []),
    characters: parse<Character[]>('dmg-characters', []),
    skills: parse<Skill[]>('dmg-skills', []),
    skillGroups: parse<SkillGroup[]>('dmg-skill-groups', []),
    rotationGroups: parse<RotationGroup[]>('dmg-rotation-groups', []),
    calcRows: parse<CalcRow[]>('dmg-calc-rows', []),
  };

  // Clean up legacy keys
  keys.forEach(k => window.localStorage.removeItem(k));

  return [makeTab('頁籤 1', data)];
}

function App() {
  // ── Tab system ──
  const [tabs, setTabs] = useLocalStorage<Tab[]>('dmg-tabs', () => {
    const migrated = migrateLegacyData();
    return migrated || [makeTab('頁籤 1')];
  });
  const [activeTabId, setActiveTabId] = useLocalStorage<string>('dmg-active-tab', () => {
    try {
      const t = window.localStorage.getItem('dmg-tabs');
      if (t) { const parsed = JSON.parse(t); return parsed[0]?.id || ''; }
    } catch { /* ignore */ }
    return '';
  });

  // ── Presets ──
  const [presets, setPresets] = useLocalStorage<Preset[]>('dmg-presets', []);

  // Ensure activeTabId is valid
  useEffect(() => {
    if (tabs.length > 0 && !tabs.find(t => t.id === activeTabId)) {
      setActiveTabId(tabs[0].id);
    }
  }, [tabs, activeTabId, setActiveTabId]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const tabData = activeTab?.data || makeEmptyData();

  // ── Working state (loaded from active tab) ──
  const [zones, setZones] = useState<DamageZone[]>(tabData.zones);
  const [buffs, setBuffs] = useState<Buff[]>(tabData.buffs);
  const [buffGroups, setBuffGroups] = useState<BuffGroup[]>(tabData.buffGroups || []);
  const [characters, setCharacters] = useState<Character[]>(tabData.characters);
  const [skills, setSkills] = useState<Skill[]>(tabData.skills);
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(tabData.skillGroups || []);
  const [rotationGroups, setRotationGroups] = useState<RotationGroup[]>(tabData.rotationGroups);
  const [calcRows, setCalcRows] = useState<CalcRow[]>(tabData.calcRows || []);
  const [notes, setNotes] = useState<string>(tabData.notes || '');

  // Save working state back to tabs whenever it changes
  const currentDataRef = useRef<AppData>(tabData);
  currentDataRef.current = {
    version: CURRENT_VERSION,
    zones, buffs, buffGroups, characters, skills, skillGroups, rotationGroups, calcRows, notes,
  };

  // Persist working state to active tab on every change
  useEffect(() => {
    setTabs(prev => prev.map(t =>
      t.id === activeTabId ? { ...t, data: currentDataRef.current } : t
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zones, buffs, buffGroups, characters, skills, skillGroups, rotationGroups, calcRows, notes, activeTabId]);

  // Load tab data when switching tabs
  const loadTabData = useCallback((data: AppData) => {
    setZones(data.zones || DEFAULT_ZONES);
    setBuffs(data.buffs || []);
    setBuffGroups(data.buffGroups || []);
    setCharacters(data.characters || []);
    setSkills(data.skills || []);
    setSkillGroups(data.skillGroups || []);
    setRotationGroups(data.rotationGroups || []);
    setCalcRows(data.calcRows || []);
    setNotes(data.notes || '');
  }, []);

  const switchTab = useCallback((tabId: string) => {
    if (tabId === activeTabId) return;
    // Save current state first
    setTabs(prev => prev.map(t =>
      t.id === activeTabId ? { ...t, data: currentDataRef.current } : t
    ));
    // Load new tab
    const target = tabs.find(t => t.id === tabId);
    if (target) {
      loadTabData(target.data);
      setActiveTabId(tabId);
    }
  }, [activeTabId, tabs, setTabs, setActiveTabId, loadTabData]);

  const addTab = useCallback(() => {
    const newTab = makeTab(`頁籤 ${tabs.length + 1}`);
    setTabs(prev => {
      const updated = prev.map(t =>
        t.id === activeTabId ? { ...t, data: currentDataRef.current } : t
      );
      return [...updated, newTab];
    });
    loadTabData(newTab.data);
    setActiveTabId(newTab.id);
  }, [tabs.length, activeTabId, setTabs, setActiveTabId, loadTabData]);

  const closeTab = useCallback((tabId: string) => {
    if (tabs.length <= 1) return;
    const idx = tabs.findIndex(t => t.id === tabId);
    const remaining = tabs.filter(t => t.id !== tabId);
    setTabs(remaining);
    if (tabId === activeTabId) {
      const nextIdx = Math.min(idx, remaining.length - 1);
      const nextTab = remaining[nextIdx];
      loadTabData(nextTab.data);
      setActiveTabId(nextTab.id);
    }
  }, [tabs, activeTabId, setTabs, setActiveTabId, loadTabData]);

  const renameTab = useCallback((tabId: string, name: string) => {
    setTabs(prev => prev.map(t => t.id === tabId ? { ...t, name } : t));
  }, [setTabs]);

  const duplicateTab = useCallback((tabId: string) => {
    const source = tabs.find(t => t.id === tabId);
    if (!source) return;
    // If duplicating active tab, use current working state
    const sourceData = tabId === activeTabId ? currentDataRef.current : source.data;
    const newTab = makeTab(`${source.name} (複製)`, JSON.parse(JSON.stringify(sourceData)));
    setTabs(prev => {
      const updated = prev.map(t =>
        t.id === activeTabId ? { ...t, data: currentDataRef.current } : t
      );
      return [...updated, newTab];
    });
    loadTabData(newTab.data);
    setActiveTabId(newTab.id);
  }, [tabs, activeTabId, setTabs, setActiveTabId, loadTabData]);

  // ── Preset operations ──
  const savePreset = useCallback((name: string) => {
    const preset: Preset = {
      id: uuid(),
      name,
      timestamp: Date.now(),
      data: JSON.parse(JSON.stringify(currentDataRef.current)),
    };
    setPresets(prev => [...prev, preset]);
  }, [setPresets]);

  const overwritePreset = useCallback((id: string) => {
    setPresets(prev => prev.map(p =>
      p.id === id ? { ...p, timestamp: Date.now(), data: JSON.parse(JSON.stringify(currentDataRef.current)) } : p
    ));
  }, [setPresets]);

  const loadPreset = useCallback((preset: Preset) => {
    loadTabData(JSON.parse(JSON.stringify(preset.data)));
  }, [loadTabData]);

  const openPresetInNewTab = useCallback((preset: Preset) => {
    const newTab = makeTab(preset.name, JSON.parse(JSON.stringify(preset.data)));
    setTabs(prev => {
      const updated = prev.map(t =>
        t.id === activeTabId ? { ...t, data: currentDataRef.current } : t
      );
      return [...updated, newTab];
    });
    loadTabData(newTab.data);
    setActiveTabId(newTab.id);
  }, [activeTabId, setTabs, setActiveTabId, loadTabData]);

  const duplicatePreset = useCallback((id: string) => {
    setPresets(prev => {
      const source = prev.find(p => p.id === id);
      if (!source) return prev;
      const copy: Preset = {
        id: uuid(),
        name: `${source.name} (複製)`,
        timestamp: Date.now(),
        data: JSON.parse(JSON.stringify(source.data)),
      };
      const idx = prev.findIndex(p => p.id === id);
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  }, [setPresets]);

  const renamePreset = useCallback((id: string, name: string) => {
    setPresets(prev => prev.map(p => p.id === id ? { ...p, name } : p));
  }, [setPresets]);

  const deletePreset = useCallback((id: string) => {
    setPresets(prev => prev.filter(p => p.id !== id));
  }, [setPresets]);

  const reorderPresets = useCallback((newPresets: Preset[]) => {
    setPresets(newPresets);
  }, [setPresets]);

  // Layout state
  const [activeRotationId, setActiveRotationId] = useState<string>('');
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    presets: true,
    characters: true,
    buffs: true,
    skills: true,
  });
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [leftPanelWidth, setLeftPanelWidth] = useState(360);
  const [rightPanelWidth, setRightPanelWidth] = useState(280);
  const [isNarrow, setIsNarrow] = useState(false);
  const prevNarrowRef = useRef(false);

  // Responsive: auto-collapse sidebars when window is narrow
  useEffect(() => {
    const checkWidth = () => {
      setIsNarrow(window.innerWidth < 1024);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  useEffect(() => {
    if (isNarrow && !prevNarrowRef.current) {
      setRightPanelOpen(false);
      setVisibleSections({ presets: false, characters: false, buffs: false, skills: false });
    }
    prevNarrowRef.current = isNarrow;
  }, [isNarrow]);

  // Resize handlers
  const resizeRef = useRef<{ startX: number; startWidth: number; side: 'left' | 'right' } | null>(null);

  const startResize = useCallback((e: ReactMouseEvent, side: 'left' | 'right', currentWidth: number) => {
    e.preventDefault();
    resizeRef.current = { startX: e.clientX, startWidth: currentWidth, side };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const onMouseMove = (e: globalThis.MouseEvent) => {
      if (!resizeRef.current) return;
      const { startX, startWidth, side } = resizeRef.current;
      const delta = side === 'left' ? e.clientX - startX : startX - e.clientX;
      const newWidth = Math.min(600, Math.max(200, startWidth + delta));
      if (side === 'left') setLeftPanelWidth(newWidth);
      else setRightPanelWidth(newWidth);
    };
    const onMouseUp = () => {
      if (!resizeRef.current) return;
      resizeRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // One-time migration for existing data (v1 → v2 field patches)
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
    setRotationGroups(prev => prev.map(g => ({
      ...g,
      disabledBuffIds: g.disabledBuffIds ?? [],
      entries: g.entries.map(e => ({
        ...e,
        disabledBuffIds: e.disabledBuffIds ?? [],
      })),
    })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabId]);

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
    zones, buffs, buffGroups, characters, skills, skillGroups, rotationGroups, calcRows, notes,
  });

  const handleImport = (data: AppData) => {
    loadTabData(data);
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

  const reorderRotationGroups = (newGroups: RotationGroup[]) => {
    setRotationGroups(newGroups);
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
    setVisibleSections(prev => {
      const next = { ...prev, [key]: !(prev[key] !== false) };
      return next;
    });
  };

  const closeOverlays = () => {
    if (isNarrow) {
      setRightPanelOpen(false);
      setVisibleSections({ presets: false, characters: false, buffs: false, skills: false });
    }
  };

  const toggleCollapse = (key: string) => {
    setCollapsedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ── Excluded rotation groups ──
  const [excludedGroupIds, setExcludedGroupIds] = useState<Set<string>>(new Set());

  const toggleExclude = (id: string) => {
    setExcludedGroupIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Calculate results for all rotation groups
  const groupResults = rotationGroups.map(g => calculateRotationGroup(g, skills, characters, buffs, zones));
  const activeRotation = rotationGroups.find(g => g.id === activeRotationId);
  const activeResult = groupResults.find(r => r.group.id === activeRotationId);

  // Check if left panel has any visible sections
  const hasLeftPanel = Object.values(visibleSections).some(v => v !== false);

  return (
    <div className="h-screen flex flex-col bg-[#0f1117] text-gray-200 overflow-hidden">
      {/* Tab Bar */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={switchTab}
        onAddTab={addTab}
        onCloseTab={closeTab}
        onRenameTab={renameTab}
        onDuplicateTab={duplicateTab}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Icon Sidebar */}
        <IconSidebar visibleSections={visibleSections} onToggle={toggleSection} />

        {/* Backdrop for narrow overlay mode */}
        {isNarrow && (hasLeftPanel || rightPanelOpen) && (
          <div className="absolute inset-0 bg-black/40 z-20" onClick={closeOverlays} />
        )}

        {/* Left Panel */}
        {hasLeftPanel && (
          <aside
            className={`bg-gray-900/95 border-r border-gray-800 flex flex-col ${
              isNarrow
                ? 'absolute top-0 bottom-0 left-12 z-30 shadow-2xl'
                : 'relative shrink-0'
            }`}
            style={{ width: leftPanelWidth }}
          >
            {/* Header area with import/export */}
            <div className="px-4 py-2.5 border-b border-gray-800 flex items-center justify-between shrink-0 overflow-auto whitespace-nowrap">
              <div className='flex items-center'>
                <span className="text-xs text-gray-500 font-medium">設定面板</span>
                <Tooltip label='點擊匯入按鈕可匯入範例資料' >
                  <span className="text-yellow-500 hover:text-yellow-400 text-md cursor-pointer px-2">🛈</span>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <ImportExport getData={getData} onImport={handleImport} clearAll={clearAll}/>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* 檔案庫 */}
              {visibleSections.presets !== false && (
                <div className="border-b border-gray-800">
                  <button onClick={() => toggleCollapse('presets')}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-800/30 cursor-pointer transition-colors">
                    <span className="text-sm font-semibold text-indigo-400 flex items-center gap-2">
                      <span className={`text-[10px] text-gray-500 transition-transform ${collapsedSections.presets ? '' : 'rotate-90'}`}>▶</span>
                      檔案庫
                    </span>
                  </button>
                  {!collapsedSections.presets && (
                    <div className="px-3 pb-3">
                      <PresetSection
                        presets={presets}
                        onSavePreset={savePreset}
                        onOverwritePreset={overwritePreset}
                        onLoadPreset={loadPreset}
                        onOpenInNewTab={openPresetInNewTab}
                        onDuplicatePreset={duplicatePreset}
                        onRenamePreset={renamePreset}
                        onDeletePreset={deletePreset}
                        onReorderPresets={reorderPresets}
                      />
                    </div>
                  )}
                </div>
              )}

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
                        skills={skills} skillGroups={skillGroups}
                        onBuffsChange={setBuffs} onZonesChange={setZones} onBuffGroupsChange={setBuffGroups}
                        onSkillsChange={setSkills} pushUndo={pushUndo} />
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

            {/* Left panel resize handle */}
            <div
              className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-indigo-500/40 transition-colors z-10"
              onMouseDown={e => startResize(e, 'left', leftPanelWidth)}
            />
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

        {/* Right panel toggle tab (when panel is closed) */}
        {rotationGroups.length > 0 && (
          <button
            onClick={() => setRightPanelOpen(v => !v)}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-12 bg-gray-800 border border-gray-700 border-r-0 rounded-l-lg flex items-center justify-center text-gray-500 hover:text-gray-300 cursor-pointer transition-colors text-xs z-10"
            style={{ right: rightPanelOpen ? rightPanelWidth : 0 }}
          >
            {rightPanelOpen ? '›' : '‹'}
          </button>
        )}

        {/* Right Panel */}
        {rightPanelOpen && rotationGroups.length > 0 && (
          <aside
            className={`bg-gray-900/95 border-l border-gray-800 flex flex-col ${
              isNarrow
                ? 'absolute top-0 bottom-0 right-0 z-30 shadow-2xl'
                : 'relative shrink-0'
            }`}
            style={{ width: rightPanelWidth }}
          >
            {/* Right panel resize handle */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-indigo-500/40 transition-colors z-10"
              onMouseDown={e => startResize(e, 'right', rightPanelWidth)}
            />
            <AnalysisPanel
              rotationGroups={rotationGroups}
              groupResults={groupResults}
              activeRotationId={activeRotationId}
              excludedGroupIds={excludedGroupIds}
              onSelectRotation={setActiveRotationId}
              onAddRotation={addRotationGroup}
              onRemoveRotation={removeRotationGroup}
              onCopyRotation={copyRotationGroup}
              onReorderRotations={reorderRotationGroups}
              onToggleExclude={toggleExclude}
              notes={notes}
              onNotesChange={setNotes}
            />
          </aside>
        )}
      </div>

      {/* Floating calculator */}
      <CalcPanel calcRows={calcRows} onChange={setCalcRows} pushUndo={pushUndo} />

      {/* Undo toast */}
      <UndoToast stack={undoStack} onUndo={handleUndo} onDismiss={dismissUndo} />
    </div>
  );
}

export default App;
