import { useState, type ReactNode } from 'react';
import {
  IconFolder, IconUser, IconSword, IconSpark, IconGear,
  IconSearch,
  IconPlus, IconCopy, IconTrash, IconGrip,
  IconSectionMark, IconDiamond, IconCalculator,
} from './icons';

/* ──────────────────────────────────────────────────────────
   Demo data
   ────────────────────────────────────────────────────────── */
const ROTATIONS = [
  { id: 'r1', name: '主循環',        dmg: 1958482, excluded: false },
  { id: 'r2', name: '副循環',        dmg: 1102003, excluded: false },
  { id: 'r3', name: '爆發循環',      dmg: 2450100, excluded: false },
  { id: 'r4', name: '低練度測試',    dmg:  742300, excluded: true  },
];

const PRESETS = [
  { id: 'p1', name: '速切雙C配置', time: '2026/04/20 14:30' },
  { id: 'p2', name: '純輸出最佳化', time: '2026/04/18 09:12' },
  { id: 'p3', name: '深淵12層', time: '2026/04/15 22:41' },
];

const CHARACTERS = [
  { id: 'c1', name: '主C',   atk: 2480, crit: 82.5, cd: 220 },
  { id: 'c2', name: '副C',   atk: 1940, crit: 65.0, cd: 180 },
  { id: 'c3', name: '輔助',  atk:  900, crit: 10.0, cd:  50 },
];

const BUFFS = [
  { id: 'b1', name: '攻擊力 BUFF',     value: '+36%',  zone: '全域' },
  { id: 'b2', name: '暴擊傷害 BUFF',   value: '+80%',  zone: '暴擊' },
  { id: 'b3', name: '易傷',            value: '+25%',  zone: '易傷' },
  { id: 'b4', name: '元素增幅',        value: '+40%',  zone: '增幅' },
];

const SKILLS = [
  { id: 's1', name: '普通攻擊',   mult:  120, char: '主C' },
  { id: 's2', name: '戰技',       mult:  380, char: '主C' },
  { id: 's3', name: '終結技',     mult: 1200, char: '主C' },
  { id: 's4', name: '副C 戰技',   mult:  340, char: '副C' },
];

const CYCLE_ENTRIES = [
  { id: 'e1', skill: '戰技',       char: '主C', dmg:  482100, count: 1 },
  { id: 'e2', skill: '普通攻擊',   char: '主C', dmg:  112400, count: 3 },
  { id: 'e3', skill: '副C 戰技',   char: '副C', dmg:  264800, count: 1 },
  { id: 'e4', skill: '終結技',     char: '主C', dmg: 1099182, count: 1 },
];

const fmt = (n: number) => n.toLocaleString();

/* ──────────────────────────────────────────────────────────
   Shared primitives
   ────────────────────────────────────────────────────────── */

function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-3 h-9 border-b border-rd-line shrink-0">
      <div className="flex items-center gap-1.5">
        <IconSectionMark className="text-rd-accent" />
        <span className="text-[11px] tracking-[0.12em] text-rd-text-dim uppercase">{children}</span>
      </div>
      {right}
    </div>
  );
}

function RailButton({
  icon, label, active, onClick,
}: { icon: ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`relative w-10 h-10 flex items-center justify-center cursor-pointer transition-colors ${
        active
          ? 'text-rd-text bg-rd-panel-hi'
          : 'text-rd-text-mute hover:text-rd-text-dim hover:bg-rd-panel/80'
      }`}
    >
      {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-rd-accent" />}
      {icon}
    </button>
  );
}

/* ──────────────────────────────────────────────────────────
   Top: VS-Code style Tab Bar (original IA)
   ────────────────────────────────────────────────────────── */
function TabBar({
  tabs, activeTabId, onSwitchTab, onAddTab,
}: {
  tabs: { id: string; name: string }[];
  activeTabId: string;
  onSwitchTab: (id: string) => void;
  onAddTab: () => void;
}) {
  return (
    <div className="h-9 bg-rd-panel-mute border-b border-rd-line flex items-end px-1 shrink-0">
      <div className="flex items-end gap-0.5 overflow-x-auto min-w-0 flex-1">
        {tabs.map(tab => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              onClick={() => onSwitchTab(tab.id)}
              className={`group relative flex items-center gap-2 px-3.5 py-1.5 text-xs cursor-pointer transition-colors rounded-t-[3px] min-w-0 max-w-[180px] shrink-0 ${
                isActive
                  ? 'bg-rd-panel text-rd-text border-t border-x border-rd-line-hi'
                  : 'text-rd-text-mute hover:text-rd-text-dim hover:bg-rd-panel/40'
              }`}
            >
              <span className="truncate">{tab.name}</span>
              <div className="flex gap-1 shrink-0">
                <span className="text-rd-text-ghost hover:text-rd-text-dim text-[10px] cursor-pointer">
                  ⧉
                </span>
                {tabs.length > 1 && (
                  <span className="text-rd-text-ghost hover:text-rd-neg text-[10px] cursor-pointer">
                    ✕
                  </span>
                )}
              </div>
              {isActive && <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-rd-panel" />}
            </button>
          );
        })}
        <button
          onClick={onAddTab}
          title="新增頁籤"
          className="w-7 h-7 flex items-center justify-center text-rd-text-ghost hover:text-rd-text-dim cursor-pointer transition-colors shrink-0 mb-0.5"
        >
          <IconPlus size={13} />
        </button>
      </div>

      {/* search */}
      <div className="flex items-center gap-1.5 pb-1 pr-1">
        <div className="h-6 flex items-center gap-1.5 px-2 bg-rd-panel-deep border border-rd-line rounded-[2px]">
          <IconSearch className="text-rd-text-ghost" size={11} />
          <input
            placeholder="搜尋…"
            className="bg-transparent text-[11px] text-rd-text placeholder-rd-text-ghost outline-none w-24"
          />
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Left: icon rail + library panel
   ────────────────────────────────────────────────────────── */
type LibKey = 'presets' | 'characters' | 'buffs' | 'skills';

function LeftRail({ active, onToggle }: { active: LibKey | null; onToggle: (k: LibKey) => void }) {
  return (
    <div className="w-11 bg-rd-panel-mute border-r border-rd-line flex flex-col items-center py-2 shrink-0">
      <RailButton icon={<IconFolder />} label="檔案庫" active={active === 'presets'}    onClick={() => onToggle('presets')} />
      <RailButton icon={<IconUser />}   label="角色"   active={active === 'characters'} onClick={() => onToggle('characters')} />
      <RailButton icon={<IconSpark />}  label="BUFF"   active={active === 'buffs'}      onClick={() => onToggle('buffs')} />
      <RailButton icon={<IconSword />}  label="技能"   active={active === 'skills'}     onClick={() => onToggle('skills')} />
      <div className="mt-auto flex flex-col items-center">
        <RailButton icon={<IconCalculator />} label="速算器" />
        <RailButton icon={<IconGear />}       label="設定" />
      </div>
    </div>
  );
}

function LibraryPanel({ active }: { active: LibKey }) {
  const titleMap: Record<LibKey, string> = {
    presets: '檔案庫',
    characters: '角色',
    buffs: 'BUFF / 分區',
    skills: '技能庫',
  };

  return (
    <aside className="w-64 bg-rd-panel border-r border-rd-line flex flex-col shrink-0 rd-sheen">
      <SectionTitle
        right={
          <button className="w-5 h-5 flex items-center justify-center text-rd-text-mute hover:text-rd-accent cursor-pointer">
            <IconPlus size={13} />
          </button>
        }
      >
        {titleMap[active]}
      </SectionTitle>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {active === 'presets' && PRESETS.map(p => (
          <LibCard key={p.id} title={p.name}>
            <div className="text-[10px] text-rd-text-ghost mt-0.5">{p.time}</div>
          </LibCard>
        ))}

        {active === 'characters' && CHARACTERS.map(c => (
          <LibCard key={c.id} title={c.name} hasUpdate>
            <div className="grid grid-cols-3 gap-x-2 text-[10px] text-rd-text-mute mt-1">
              <div>ATK <span className="text-rd-text-dim">{c.atk}</span></div>
              <div>暴擊 <span className="text-rd-text-dim">{c.crit}%</span></div>
              <div>爆傷 <span className="text-rd-text-dim">{c.cd}%</span></div>
            </div>
          </LibCard>
        ))}

        {active === 'buffs' && BUFFS.map(b => (
          <LibCard key={b.id} title={b.name}>
            <div className="flex items-center justify-between text-[10px] mt-1">
              <span className="text-rd-text-mute">{b.zone}</span>
              <span className="text-rd-data">{b.value}</span>
            </div>
          </LibCard>
        ))}

        {active === 'skills' && SKILLS.map(s => (
          <LibCard key={s.id} title={s.name}>
            <div className="flex items-center justify-between text-[10px] mt-1">
              <span className="text-rd-text-mute">{s.char}</span>
              <span className="text-rd-data">×{s.mult}%</span>
            </div>
          </LibCard>
        ))}
      </div>
    </aside>
  );
}

function LibCard({ title, children, hasUpdate }: { title: string; children?: ReactNode; hasUpdate?: boolean }) {
  return (
    <div className="relative bg-rd-panel-hi border border-rd-line-soft hover:border-rd-line-hi px-3 py-2 rd-chamfer-sm group cursor-pointer transition-colors rd-card-sheen">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-rd-text">{title}</span>
        {hasUpdate && <IconDiamond className="text-rd-accent" />}
      </div>
      {children}
      <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-rd-accent transition-all group-hover:w-full" />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Center: cycle tabs + rotation editor
   ────────────────────────────────────────────────────────── */
function CenterPane({
  activeRotationId, onSelect,
}: { activeRotationId: string; onSelect: (id: string) => void }) {
  const active = ROTATIONS.find(r => r.id === activeRotationId)!;

  return (
    <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
      {/* rotation sub-tabs */}
      <div className="h-10 flex items-end gap-px px-2 border-b border-rd-line bg-rd-panel-deep/50">
        {ROTATIONS.map(r => {
          const isActive = r.id === activeRotationId;
          return (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              className={`relative h-8 px-4 text-xs cursor-pointer transition-colors flex items-center gap-1.5 rounded-t-[3px] ${
                isActive
                  ? 'bg-rd-panel-hi text-rd-text'
                  : 'text-rd-text-mute hover:text-rd-text-dim hover:bg-rd-panel/50'
              }`}
            >
              {r.name}
              {r.excluded && <span className="text-[9px] text-rd-text-ghost">(排除)</span>}
              {isActive && <span className="absolute left-1 right-1 bottom-0 h-[2px] bg-rd-accent" />}
            </button>
          );
        })}
        <button className="h-7 px-2 mb-0.5 text-rd-text-ghost hover:text-rd-text-dim cursor-pointer flex items-center gap-1 text-xs">
          <IconPlus size={11} />
        </button>
      </div>

      {/* rotation header */}
      <div className="px-6 pt-5 pb-4 border-b border-rd-line">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] tracking-[0.2em] text-rd-text-ghost uppercase mb-1">ACTIVE ROTATION</div>
            <h1 className="text-lg text-rd-text">{active.name}</h1>
          </div>
          <div className="text-right">
            <div className="text-[10px] tracking-[0.2em] text-rd-text-ghost uppercase mb-1">TOTAL DAMAGE</div>
            <div className="text-3xl text-rd-text-hi tabular-nums font-semibold">{fmt(active.dmg)}</div>
          </div>
        </div>

        {/* buff chips */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {BUFFS.map(b => (
            <span
              key={b.id}
              className="rd-chamfer-sm bg-rd-panel-deep border border-rd-line px-2.5 py-1 text-[11px] text-rd-data"
            >
              {b.name} {b.value}
            </span>
          ))}
          <button className="rd-chamfer-sm border border-dashed border-rd-line-hi text-rd-text-ghost hover:text-rd-accent hover:border-rd-accent px-2.5 py-1 text-[11px] cursor-pointer flex items-center gap-1 transition-colors">
            <IconPlus size={10} /> BUFF
          </button>
        </div>
      </div>

      {/* skill entry list */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <IconSectionMark className="text-rd-accent" />
            <span className="text-[11px] tracking-[0.12em] text-rd-text-dim uppercase">技能序列</span>
          </div>
          <button className="h-6 px-3 text-[11px] text-rd-text-mute hover:text-rd-accent cursor-pointer flex items-center gap-1">
            <IconPlus size={11} /> 加入技能
          </button>
        </div>

        {CYCLE_ENTRIES.map((e, i) => (
          <SkillEntryCard key={e.id} entry={e} index={i} />
        ))}
      </div>
    </main>
  );
}

function SkillEntryCard({ entry: e, index: i }: { entry: typeof CYCLE_ENTRIES[number]; index: number }) {
  return (
    <div
      className="relative bg-rd-panel border border-rd-line hover:border-rd-line-hi transition-colors group rd-chamfer"
    >
      <div className="flex items-stretch">
        {/* index column */}
        <div className="w-10 flex flex-col items-center justify-center border-r border-rd-line-soft text-rd-text-ghost">
          <span className="text-[10px] tracking-wider tabular-nums">#{String(i + 1).padStart(2, '0')}</span>
          <IconGrip className="mt-0.5 text-rd-text-ghost cursor-grab" size={12} />
        </div>

        {/* content */}
        <div className="flex-1 px-4 py-2.5 flex items-center justify-between min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm text-rd-text">{e.skill}</span>
              {e.count > 1 && (
                <span className="text-[10px] text-rd-text-mute border border-rd-line-soft px-1.5 py-0.5 tabular-nums rounded-[2px]">
                  ×{e.count}
                </span>
              )}
            </div>
            <div className="text-[11px] text-rd-text-mute mt-0.5">{e.char}</div>
          </div>
          <div className="text-right shrink-0 ml-4">
            <div className="text-sm text-rd-text-hi tabular-nums font-medium">{fmt(e.dmg)}</div>
            {e.count > 1 && (
              <div className="text-[10px] text-rd-text-ghost tabular-nums">
                單次 {fmt(Math.round(e.dmg / e.count))}
              </div>
            )}
          </div>
        </div>

        {/* hover actions */}
        <div className="flex items-center gap-0.5 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-6 h-6 flex items-center justify-center text-rd-text-ghost hover:text-rd-data cursor-pointer">
            <IconCopy size={12} />
          </button>
          <button className="w-6 h-6 flex items-center justify-center text-rd-text-ghost hover:text-rd-neg cursor-pointer">
            <IconTrash size={12} />
          </button>
        </div>
      </div>

      {/* left accent bar */}
      <span className="absolute left-0 top-2 bottom-2 w-[2px] bg-rd-line group-hover:bg-rd-accent transition-colors" />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Right: analysis / comparison panel
   ────────────────────────────────────────────────────────── */
function RightAnalysis({ activeRotationId, onSelect }: { activeRotationId: string; onSelect: (id: string) => void }) {
  const activeDmg = ROTATIONS.find(r => r.id === activeRotationId)!.dmg;
  const maxDmg = Math.max(...ROTATIONS.filter(r => !r.excluded).map(r => r.dmg));

  return (
    <aside className="w-72 bg-rd-panel border-l border-rd-line flex flex-col shrink-0 rd-sheen">
      <SectionTitle>循環比較</SectionTitle>

      <div className="p-2.5 space-y-1.5 overflow-y-auto flex-1">
        {ROTATIONS.map(r => {
          const isActive = r.id === activeRotationId;
          const pct = (r.dmg / maxDmg) * 100;
          const diff = r.id === activeRotationId ? null
            : (((r.dmg - activeDmg) / activeDmg) * 100).toFixed(1);

          return (
            <div
              key={r.id}
              onClick={() => onSelect(r.id)}
              className={`relative px-3 py-2.5 rd-chamfer-sm cursor-pointer transition-colors group ${
                r.excluded ? 'opacity-35' : ''
              } ${
                isActive
                  ? 'bg-rd-panel-lift border border-rd-line-hi'
                  : 'bg-rd-panel-hi border border-rd-line-soft hover:border-rd-line'
              }`}
            >
              {/* selected accent */}
              {isActive && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-rd-accent" />}

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <IconGrip className="text-rd-text-ghost shrink-0" size={11} />
                  <span className={`text-[13px] truncate ${isActive ? 'text-rd-text' : 'text-rd-text-dim'}`}>
                    {r.name}
                  </span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-rd-text-ghost hover:text-rd-data cursor-pointer"><IconCopy size={11} /></button>
                  <button className="text-rd-text-ghost hover:text-rd-neg cursor-pointer"><IconTrash size={11} /></button>
                </div>
              </div>

              {/* segmented progress bar */}
              <div className="flex gap-[2px] h-[5px] mb-2">
                {Array.from({ length: 20 }).map((_, idx) => {
                  const filled = (idx / 20) * 100 < pct;
                  return (
                    <div
                      key={idx}
                      className={`flex-1 transition-colors ${
                        filled
                          ? isActive ? 'bg-rd-accent' : 'bg-rd-line-hi'
                          : 'bg-rd-panel-deep'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="flex items-baseline justify-between">
                <span className={`text-[15px] tabular-nums font-medium ${isActive ? 'text-rd-text-hi' : 'text-rd-text'}`}>
                  {fmt(r.dmg)}
                </span>
                {diff !== null && !r.excluded && (
                  <span className={`text-[11px] tabular-nums ${Number(diff) >= 0 ? 'text-rd-pos' : 'text-rd-neg'}`}>
                    {Number(diff) >= 0 ? '+' : ''}{diff}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* summary */}
      <div className="border-t border-rd-line p-4 bg-rd-panel-deep/40">
        <div className="text-[10px] tracking-[0.2em] text-rd-text-ghost uppercase">PEAK</div>
        <div className="text-2xl text-rd-text-hi tabular-nums font-semibold mt-1">
          {fmt(maxDmg)}
        </div>
        <div className="text-[11px] text-rd-text-mute mt-0.5">
          {ROTATIONS.length} 個循環 · {ROTATIONS.filter(r => r.excluded).length} 個排除
        </div>
      </div>
    </aside>
  );
}

/* ──────────────────────────────────────────────────────────
   Bottom status bar
   ────────────────────────────────────────────────────────── */
function StatusBar() {
  return (
    <div className="h-6 border-t border-rd-line bg-rd-panel-mute flex items-center justify-between px-3 text-[10px] text-rd-text-ghost tracking-wider">
      <div className="flex items-center gap-4">
        <span className="text-rd-pos">● ONLINE</span>
        <span>64ms</span>
        <span>UID / 4551295988</span>
      </div>
      <div className="flex items-center gap-4">
        <span>DAMAGE CALCULATOR</span>
        <span>v2.0 / REDESIGN</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Root
   ────────────────────────────────────────────────────────── */
export default function RedesignApp() {
  const [tabs, setTabs] = useState([
    { id: 't1', name: 'DPS 方案 A' },
    { id: 't2', name: 'DPS 方案 B' },
    { id: 't3', name: '方案 C' },
    { id: 't4', name: '方案 D' },
  ]);
  const [activeTabId, setActiveTabId] = useState('t1');
  const [activeRotationId, setActiveRotationId] = useState('r1');
  const [libOpen, setLibOpen] = useState<LibKey | null>('characters');

  const toggleLib = (k: LibKey) => setLibOpen(prev => (prev === k ? null : k));
  const addTab = () => {
    const id = 't' + (tabs.length + 1);
    setTabs(t => [...t, { id, name: `方案 ${String.fromCharCode(64 + t.length + 1)}` }]);
    setActiveTabId(id);
  };

  return (
    <div className="h-screen flex flex-col rd-canvas text-rd-text overflow-hidden">
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSwitchTab={setActiveTabId}
        onAddTab={addTab}
      />

      <div className="flex-1 flex overflow-hidden">
        <LeftRail active={libOpen} onToggle={toggleLib} />
        {libOpen && <LibraryPanel active={libOpen} />}
        <CenterPane activeRotationId={activeRotationId} onSelect={setActiveRotationId} />
        <RightAnalysis activeRotationId={activeRotationId} onSelect={setActiveRotationId} />
      </div>

      <StatusBar />
    </div>
  );
}
