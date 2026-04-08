import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/shallow';
import { useAppStore } from './stores/appStore';
import { useUIStore } from './stores/uiStore';
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
import UndoToast from './components/UndoToast';
import AIResourceModal from './components/AIResourceModal';

function App() {
  // ── App store ──
  const {
    rotationGroups, skills, characters, buffs, zones,
    activeRotationId, setActiveRotationId,
    activeTabId, addRotationGroup,
    runMigration,
  } = useAppStore(useShallow(s => ({
    rotationGroups: s.rotationGroups,
    skills: s.skills,
    characters: s.characters,
    buffs: s.buffs,
    zones: s.zones,
    activeRotationId: s.activeRotationId,
    setActiveRotationId: s.setActiveRotationId,
    activeTabId: s.activeTabId,
    addRotationGroup: s.addRotationGroup,
    runMigration: s.runMigration,
  })));

  // ── UI store ──
  const {
    rightPanelOpen, visibleSections, collapsedSections,
    leftPanelWidth, rightPanelWidth, isNarrow, isDark,
    setRightPanelOpen, toggleCollapse,
    closeOverlays, setIsNarrow, collapseForNarrow, startResize,
  } = useUIStore(useShallow(s => ({
    rightPanelOpen: s.rightPanelOpen,
    visibleSections: s.visibleSections,
    collapsedSections: s.collapsedSections,
    leftPanelWidth: s.leftPanelWidth,
    rightPanelWidth: s.rightPanelWidth,
    isNarrow: s.isNarrow,
    isDark: s.isDark,
    setRightPanelOpen: s.setRightPanelOpen,
    toggleCollapse: s.toggleCollapse,
    closeOverlays: s.closeOverlays,
    setIsNarrow: s.setIsNarrow,
    collapseForNarrow: s.collapseForNarrow,
    startResize: s.startResize,
  })));

  // ── Dark mode sync ──
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // ── One-time migration ──
  useEffect(() => { runMigration(); }, [activeTabId, runMigration]);

  // ── Auto-select first rotation ──
  useEffect(() => {
    if (rotationGroups.length > 0 && !rotationGroups.find(g => g.id === activeRotationId)) {
      setActiveRotationId(rotationGroups[0].id);
    }
  }, [rotationGroups, activeRotationId, setActiveRotationId]);

  // ── Responsive collapse ──
  useEffect(() => {
    const checkWidth = () => setIsNarrow(window.innerWidth < 1024);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, [setIsNarrow]);

  const prevNarrowRef = useRef(false);
  useEffect(() => {
    if (isNarrow && !prevNarrowRef.current) collapseForNarrow();
    prevNarrowRef.current = isNarrow;
  }, [isNarrow, collapseForNarrow]);

  // ── Derived ──
  const groupResults = rotationGroups.map(g => calculateRotationGroup(g, skills, characters, buffs, zones));
  const activeRotation = rotationGroups.find(g => g.id === activeRotationId);
  const activeResult = groupResults.find(r => r.group.id === activeRotationId);
  const hasLeftPanel = Object.values(visibleSections).some(v => v !== false);

  return (
    <div className="h-screen flex flex-col bg-ef-base text-ef-ink overflow-hidden">
      <TabBar />

      <div className="flex-1 flex overflow-hidden relative">
        <IconSidebar />

        {/* Backdrop for narrow overlay mode */}
        {isNarrow && (hasLeftPanel || rightPanelOpen) && (
          <div className="absolute inset-0 bg-black/40 z-20" onClick={closeOverlays} />
        )}

        {/* Left Panel */}
        {hasLeftPanel && (
          <aside
            className={`bg-ef-panel border-r border-ef-line flex flex-col ${
              isNarrow
                ? 'absolute top-0 bottom-0 left-12 z-30 shadow-2xl'
                : 'relative shrink-0'
            }`}
            style={{ width: leftPanelWidth }}
          >
            {/* Header area with import/export */}
            <div className="px-4 py-2.5 border-b border-ef-line flex items-center justify-between shrink-0 overflow-auto whitespace-nowrap">
              <div className='flex items-center'>
                <span className="text-xs text-ef-ink-3 font-medium">設定面板</span>
              </div>
              <div className="flex items-center gap-2">
                <ImportExport />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* 檔案庫 */}
              {visibleSections.presets !== false && (
                <div className="border-b border-ef-line">
                  <button onClick={() => toggleCollapse('presets')}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-black/5 cursor-pointer transition-colors">
                    <span className="text-sm font-semibold text-ef-gold flex items-center gap-2 border-l-2 border-ef-gold pl-2">
                      <span className={`text-[10px] text-ef-ink-4 transition-transform ${collapsedSections.presets ? '' : 'rotate-90'}`}>▶</span>
                      檔案庫
                    </span>
                  </button>
                  {!collapsedSections.presets && (
                    <div className="px-3 pb-3">
                      <PresetSection />
                    </div>
                  )}
                </div>
              )}

              {/* Characters */}
              {visibleSections.characters !== false && (
                <div className="border-b border-ef-line">
                  <button onClick={() => toggleCollapse('characters')}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-black/5 cursor-pointer transition-colors">
                    <span className="text-sm font-semibold text-ef-gold flex items-center gap-2 border-l-2 border-ef-gold pl-2">
                      <span className={`text-[10px] text-ef-ink-4 transition-transform ${collapsedSections.characters ? '' : 'rotate-90'}`}>▶</span>
                      角色
                    </span>
                  </button>
                  {!collapsedSections.characters && (
                    <div className="px-3 pb-3">
                      <CharacterSection />
                    </div>
                  )}
                </div>
              )}

              {/* Buffs */}
              {visibleSections.buffs !== false && (
                <div className="border-b border-ef-line">
                  <button onClick={() => toggleCollapse('buffs')}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-black/5 cursor-pointer transition-colors">
                    <span className="text-sm font-semibold text-ef-gold flex items-center gap-2 border-l-2 border-ef-gold pl-2">
                      <span className={`text-[10px] text-ef-ink-4 transition-transform ${collapsedSections.buffs ? '' : 'rotate-90'}`}>▶</span>
                      BUFF / 分區
                    </span>
                  </button>
                  {!collapsedSections.buffs && (
                    <div className="px-3 pb-3">
                      <BuffSection />
                    </div>
                  )}
                </div>
              )}

              {/* Skills */}
              {visibleSections.skills !== false && (
                <div className="border-b border-ef-line">
                  <button onClick={() => toggleCollapse('skills')}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-black/5 cursor-pointer transition-colors">
                    <span className="text-sm font-semibold text-ef-gold flex items-center gap-2 border-l-2 border-ef-gold pl-2">
                      <span className={`text-[10px] text-ef-ink-4 transition-transform ${collapsedSections.skills ? '' : 'rotate-90'}`}>▶</span>
                      技能庫
                    </span>
                  </button>
                  {!collapsedSections.skills && (
                    <div className="px-3 pb-3">
                      <SkillSection />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div
              className="absolute -right-1.5 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-ef-gold/40 transition-colors z-10"
              onMouseDown={e => startResize(e, 'left')}
            />
          </aside>
        )}

        {/* Center Panel */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          {activeRotation && <CycleBuffBar />}

          {activeRotation && activeResult ? (
            <CycleEditor groupResult={activeResult} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-ef-ink-4 text-sm mb-3">尚未建立技能循環</p>
                <button onClick={addRotationGroup}
                  className="px-4 py-2 bg-ef-gold hover:bg-ef-gold-2 rounded-lg text-sm font-medium text-white transition-colors cursor-pointer">
                  + 新增循環
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Right panel toggle */}
        {rotationGroups.length > 0 && (
          <button
            onClick={() => setRightPanelOpen(v => !v)}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-12 bg-ef-card border border-ef-line border-r-0 rounded-l-lg flex items-center justify-center text-ef-ink-3 hover:text-ef-ink cursor-pointer transition-colors text-xs z-10"
            style={{ right: rightPanelOpen ? rightPanelWidth : 0 }}
          >
            {rightPanelOpen ? '›' : '‹'}
          </button>
        )}

        {/* Right Panel */}
        {rightPanelOpen && rotationGroups.length > 0 && (
          <aside
            className={`bg-ef-panel border-l border-ef-line flex flex-col ${
              isNarrow
                ? 'absolute top-0 bottom-0 right-0 z-30 shadow-2xl'
                : 'relative shrink-0'
            }`}
            style={{ width: rightPanelWidth }}
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-ef-gold/40 transition-colors z-10"
              onMouseDown={e => startResize(e, 'right')}
            />
            <AnalysisPanel groupResults={groupResults} />
          </aside>
        )}
      </div>

      <CalcPanel />
      <UndoToast />
      <AIResourceModal />
    </div>
  );
}

export default App;
