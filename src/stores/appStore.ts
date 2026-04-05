import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { DEFAULT_ZONES, CURRENT_VERSION } from '../types';
import type {
  DamageZone, Buff, BuffGroup, Character, Skill, SkillGroup,
  RotationGroup, CalcRow, AppData, Tab, Preset,
} from '../types';

// ── Helpers ──

export function makeEmptyData(): AppData {
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

  keys.forEach(k => window.localStorage.removeItem(k));
  return [makeTab('頁籤 1', data)];
}

function loadInitialState() {
  // Try existing tab format
  const parseSafe = <T,>(key: string): T | null => {
    try {
      const v = window.localStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch { return null; }
  };

  const savedTabs = parseSafe<Tab[]>('dmg-tabs');
  if (savedTabs && savedTabs.length > 0) {
    const savedActiveId = parseSafe<string>('dmg-active-tab') || savedTabs[0].id;
    const savedPresets = parseSafe<Preset[]>('dmg-presets') || [];
    return { tabs: savedTabs, activeTabId: savedActiveId, presets: savedPresets };
  }

  // Try legacy per-key format
  const migrated = migrateLegacyData();
  if (migrated) {
    return { tabs: migrated, activeTabId: migrated[0].id, presets: [] as Preset[] };
  }

  // Default
  const defaultTab = makeTab('頁籤 1');
  return { tabs: [defaultTab], activeTabId: defaultTab.id, presets: [] as Preset[] };
}

function loadTabData(tab: Tab) {
  const d = tab.data;
  return {
    zones: d.zones || DEFAULT_ZONES,
    buffs: d.buffs || [],
    buffGroups: d.buffGroups || [],
    characters: d.characters || [],
    skills: d.skills || [],
    skillGroups: d.skillGroups || [],
    rotationGroups: d.rotationGroups || [],
    calcRows: d.calcRows || [],
    notes: d.notes || '',
  };
}

// ── Types ──

type Updater<T> = T | ((prev: T) => T);
function resolve<T>(v: Updater<T>, prev: T): T {
  return typeof v === 'function' ? (v as (p: T) => T)(prev) : v;
}

export interface AppState {
  // Tab system
  tabs: Tab[];
  activeTabId: string;

  // Working state (from active tab)
  zones: DamageZone[];
  buffs: Buff[];
  buffGroups: BuffGroup[];
  characters: Character[];
  skills: Skill[];
  skillGroups: SkillGroup[];
  rotationGroups: RotationGroup[];
  calcRows: CalcRow[];
  notes: string;

  // Rotation UI
  activeRotationId: string;
  excludedGroupIds: string[];

  // Presets
  presets: Preset[];

  // Tab actions
  switchTab: (tabId: string) => void;
  addTab: () => void;
  closeTab: (tabId: string) => void;
  renameTab: (tabId: string, name: string) => void;
  duplicateTab: (tabId: string) => void;

  // Data setters
  setZones: (v: Updater<DamageZone[]>) => void;
  setBuffs: (v: Updater<Buff[]>) => void;
  setBuffGroups: (v: Updater<BuffGroup[]>) => void;
  setCharacters: (v: Updater<Character[]>) => void;
  setSkills: (v: Updater<Skill[]>) => void;
  setSkillGroups: (v: Updater<SkillGroup[]>) => void;
  setRotationGroups: (v: Updater<RotationGroup[]>) => void;
  setCalcRows: (v: Updater<CalcRow[]>) => void;
  setNotes: (v: string) => void;

  // Rotation actions
  setActiveRotationId: (id: string) => void;
  addRotationGroup: () => void;
  updateRotationGroup: (g: RotationGroup) => void;
  removeRotationGroup: (id: string) => void;
  copyRotationGroup: (g: RotationGroup) => void;
  reorderRotationGroups: (groups: RotationGroup[]) => void;
  toggleCycleBuff: (buffId: string) => void;
  toggleExclude: (id: string) => void;

  // Preset actions
  savePreset: (name: string) => void;
  overwritePreset: (id: string) => void;
  loadPreset: (preset: Preset) => void;
  openPresetInNewTab: (preset: Preset) => void;
  duplicatePreset: (id: string) => void;
  renamePreset: (id: string, name: string) => void;
  deletePreset: (id: string) => void;
  reorderPresets: (presets: Preset[]) => void;

  // Import/Export
  getData: () => AppData;
  importData: (data: AppData) => void;
  clearAll: () => void;

  // Migration (called once on mount)
  runMigration: () => void;
}

// ── Store ──

const initial = loadInitialState();
const initialTab = initial.tabs.find(t => t.id === initial.activeTabId) || initial.tabs[0];
const initialWorkingData = loadTabData(initialTab);

export const useAppStore = create<AppState>()((set, get) => {
  // Helper: get current working data as AppData
  const getWorkingData = (): AppData => {
    const s = get();
    return {
      version: CURRENT_VERSION,
      zones: s.zones, buffs: s.buffs, buffGroups: s.buffGroups,
      characters: s.characters, skills: s.skills, skillGroups: s.skillGroups,
      rotationGroups: s.rotationGroups, calcRows: s.calcRows, notes: s.notes,
    };
  };

  // Helper: update a working state field and sync to active tab
  const updateField = <K extends keyof AppData>(key: K, valueOrFn: Updater<AppData[K]>) => {
    set(state => {
      const newValue = resolve(valueOrFn, (state as unknown as AppData)[key]);
      return {
        [key]: newValue,
        tabs: state.tabs.map(t =>
          t.id === state.activeTabId
            ? { ...t, data: { ...t.data, [key]: newValue } }
            : t
        ),
      } as Partial<AppState>;
    });
  };

  // Helper: set working state from AppData (for tab switch / import)
  const setWorkingData = (data: AppData) => {
    set({
      zones: data.zones || DEFAULT_ZONES,
      buffs: data.buffs || [],
      buffGroups: data.buffGroups || [],
      characters: data.characters || [],
      skills: data.skills || [],
      skillGroups: data.skillGroups || [],
      rotationGroups: data.rotationGroups || [],
      calcRows: data.calcRows || [],
      notes: data.notes || '',
    });
  };

  return {
    // Initial state
    tabs: initial.tabs,
    activeTabId: initial.activeTabId,
    presets: initial.presets,
    ...initialWorkingData,
    activeRotationId: '',
    excludedGroupIds: [],

    // ── Tab actions ──

    switchTab: (tabId) => {
      const state = get();
      if (tabId === state.activeTabId) return;
      // Save current working state to current tab
      const currentData = getWorkingData();
      const tabs = state.tabs.map(t =>
        t.id === state.activeTabId ? { ...t, data: currentData } : t
      );
      const target = tabs.find(t => t.id === tabId);
      if (target) {
        set({ tabs, activeTabId: tabId });
        setWorkingData(target.data);
      }
    },

    addTab: () => {
      const state = get();
      const newTab = makeTab(`頁籤 ${state.tabs.length + 1}`);
      const currentData = getWorkingData();
      const updatedTabs = state.tabs.map(t =>
        t.id === state.activeTabId ? { ...t, data: currentData } : t
      );
      set({ tabs: [...updatedTabs, newTab], activeTabId: newTab.id });
      setWorkingData(newTab.data);
    },

    closeTab: (tabId) => {
      const state = get();
      if (state.tabs.length <= 1) return;
      const idx = state.tabs.findIndex(t => t.id === tabId);
      const remaining = state.tabs.filter(t => t.id !== tabId);
      set({ tabs: remaining });
      if (tabId === state.activeTabId) {
        const nextIdx = Math.min(idx, remaining.length - 1);
        const nextTab = remaining[nextIdx];
        set({ activeTabId: nextTab.id });
        setWorkingData(nextTab.data);
      }
    },

    renameTab: (tabId, name) => {
      set(state => ({ tabs: state.tabs.map(t => t.id === tabId ? { ...t, name } : t) }));
    },

    duplicateTab: (tabId) => {
      const state = get();
      const source = state.tabs.find(t => t.id === tabId);
      if (!source) return;
      const sourceData = tabId === state.activeTabId ? getWorkingData() : source.data;
      const newTab = makeTab(`${source.name} (複製)`, JSON.parse(JSON.stringify(sourceData)));
      const updatedTabs = state.tabs.map(t =>
        t.id === state.activeTabId ? { ...t, data: getWorkingData() } : t
      );
      set({ tabs: [...updatedTabs, newTab], activeTabId: newTab.id });
      setWorkingData(newTab.data);
    },

    // ── Data setters ──

    setZones: (v) => updateField('zones', v),
    setBuffs: (v) => updateField('buffs', v),
    setBuffGroups: (v) => updateField('buffGroups', v),
    setCharacters: (v) => updateField('characters', v),
    setSkills: (v) => updateField('skills', v),
    setSkillGroups: (v) => updateField('skillGroups', v),
    setRotationGroups: (v) => updateField('rotationGroups', v),
    setCalcRows: (v) => updateField('calcRows', v),
    setNotes: (v) => updateField('notes', v),

    // ── Rotation actions ──

    setActiveRotationId: (id) => set({ activeRotationId: id }),

    addRotationGroup: () => {
      const state = get();
      const newGroup: RotationGroup = {
        id: uuid(), name: `循環 ${state.rotationGroups.length + 1}`,
        entries: [], disabledBuffIds: [],
      };
      updateField('rotationGroups', [...state.rotationGroups, newGroup]);
      set({ activeRotationId: newGroup.id });
    },

    updateRotationGroup: (g) => {
      updateField('rotationGroups', get().rotationGroups.map(x => x.id === g.id ? g : x));
    },

    removeRotationGroup: (id) => {
      const state = get();
      updateField('rotationGroups', state.rotationGroups.filter(g => g.id !== id));
    },

    copyRotationGroup: (g) => {
      const copy: RotationGroup = {
        ...g,
        id: uuid(),
        name: `${g.name} (複製)`,
        disabledBuffIds: [...(g.disabledBuffIds || [])],
        entries: g.entries.map(e => ({ ...e, id: uuid(), disabledBuffIds: [...(e.disabledBuffIds || [])] })),
      };
      updateField('rotationGroups', [...get().rotationGroups, copy]);
    },

    reorderRotationGroups: (groups) => updateField('rotationGroups', groups),

    toggleCycleBuff: (buffId) => {
      const state = get();
      updateField('rotationGroups', state.rotationGroups.map(g => {
        if (g.id !== state.activeRotationId) return g;
        const disabled = g.disabledBuffIds || [];
        return {
          ...g,
          disabledBuffIds: disabled.includes(buffId)
            ? disabled.filter(id => id !== buffId)
            : [...disabled, buffId],
        };
      }));
    },

    toggleExclude: (id) => {
      set(state => {
        const next = [...state.excludedGroupIds];
        const idx = next.indexOf(id);
        if (idx >= 0) next.splice(idx, 1); else next.push(id);
        return { excludedGroupIds: next };
      });
    },

    // ── Preset actions ──

    savePreset: (name) => {
      const preset: Preset = {
        id: uuid(), name, timestamp: Date.now(),
        data: JSON.parse(JSON.stringify(getWorkingData())),
      };
      set(state => ({ presets: [...state.presets, preset] }));
    },

    overwritePreset: (id) => {
      set(state => ({
        presets: state.presets.map(p =>
          p.id === id ? { ...p, timestamp: Date.now(), data: JSON.parse(JSON.stringify(getWorkingData())) } : p
        ),
      }));
    },

    loadPreset: (preset) => {
      const data = JSON.parse(JSON.stringify(preset.data)) as AppData;
      setWorkingData(data);
      // Also sync to active tab
      set(state => ({
        tabs: state.tabs.map(t =>
          t.id === state.activeTabId ? { ...t, data } : t
        ),
      }));
    },

    openPresetInNewTab: (preset) => {
      const state = get();
      const data = JSON.parse(JSON.stringify(preset.data)) as AppData;
      const newTab = makeTab(preset.name, data);
      const updatedTabs = state.tabs.map(t =>
        t.id === state.activeTabId ? { ...t, data: getWorkingData() } : t
      );
      set({ tabs: [...updatedTabs, newTab], activeTabId: newTab.id });
      setWorkingData(data);
    },

    duplicatePreset: (id) => {
      set(state => {
        const source = state.presets.find(p => p.id === id);
        if (!source) return state;
        const copy: Preset = {
          id: uuid(), name: `${source.name} (複製)`,
          timestamp: Date.now(), data: JSON.parse(JSON.stringify(source.data)),
        };
        const idx = state.presets.findIndex(p => p.id === id);
        const next = [...state.presets];
        next.splice(idx + 1, 0, copy);
        return { presets: next };
      });
    },

    renamePreset: (id, name) => {
      set(state => ({ presets: state.presets.map(p => p.id === id ? { ...p, name } : p) }));
    },

    deletePreset: (id) => {
      set(state => ({ presets: state.presets.filter(p => p.id !== id) }));
    },

    reorderPresets: (presets) => set({ presets }),

    // ── Import/Export ──

    getData: getWorkingData,

    importData: (data) => {
      setWorkingData(data);
      set(state => ({
        tabs: state.tabs.map(t =>
          t.id === state.activeTabId ? { ...t, data } : t
        ),
      }));
    },

    clearAll: () => {
      const emptyData = makeEmptyData();
      setWorkingData(emptyData);
      set(state => ({
        tabs: state.tabs.map(t =>
          t.id === state.activeTabId ? { ...t, data: emptyData } : t
        ),
      }));
    },

    // ── Migration (v1 → v2 field patches) ──
    runMigration: () => {
      set(state => ({
        buffs: state.buffs.map(b => ({
          ...b,
          enabled: (b as unknown as Record<string, unknown>).enabled !== undefined ? b.enabled : true,
          groupId: b.groupId ?? '',
        })),
        skills: state.skills.map(s => ({
          ...s,
          groupId: s.groupId ?? '',
        })),
        rotationGroups: state.rotationGroups.map(g => ({
          ...g,
          disabledBuffIds: g.disabledBuffIds ?? [],
          entries: g.entries.map(e => ({
            ...e,
            disabledBuffIds: e.disabledBuffIds ?? [],
          })),
        })),
      }));
    },
  };
});

// ── Auto-persist to localStorage ──

useAppStore.subscribe((state, prevState) => {
  if (state.tabs !== prevState.tabs) {
    try { localStorage.setItem('dmg-tabs', JSON.stringify(state.tabs)); } catch { /* quota */ }
  }
  if (state.activeTabId !== prevState.activeTabId) {
    try { localStorage.setItem('dmg-active-tab', JSON.stringify(state.activeTabId)); } catch { /* quota */ }
  }
  if (state.presets !== prevState.presets) {
    try { localStorage.setItem('dmg-presets', JSON.stringify(state.presets)); } catch { /* quota */ }
  }
});
