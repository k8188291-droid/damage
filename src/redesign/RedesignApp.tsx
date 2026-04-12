import { useState, type ReactNode } from 'react';
import {
  IconFolder, IconUser, IconSword, IconSpark, IconGear,
  IconSearch, IconChevronRight, IconClose,
  IconPlus, IconCopy, IconTrash, IconGrip,
  IconSectionMark, IconDiamond, IconCalculator,
} from './icons';

/* ──────────────────────────────────────────────────────────
   Demo data (visual-only; not wired to the real store)
   ────────────────────────────────────────────────────────── */
const ROTATIONS = [
  { id: 'r1', name: '主循環',        dmg: 1958482, excluded: false },
  { id: 'r2', name: '副循環',        dmg: 1102003, excluded: false },
  { id: 'r3', name: '爆發循環',      dmg: 2450100, excluded: false },
  { id: 'r4', name: '低練度測試',    dmg:  742300, excluded: true  },
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

function PanelTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-3 h-8 border-b border-rd-line-soft">
      <div className="flex items-center gap-1.5 text-rd-text-dim">
        <IconSectionMark className="text-rd-accent" />
        <span className="text-[11px] tracking-[0.15em] uppercase">{children}</span>
      </div>
      {right}
    </div>
  );
}

function Crumb({ children, icon, active }: { children: ReactNode; icon?: ReactNode; active?: boolean }) {
  return (
    <div
      className={`rd-chamfer-tag h-7 px-4 flex items-center gap-1.5 text-xs ${
        active ? 'bg-rd-panel-hi text-rd-text' : 'bg-rd-panel/60 text-rd-text-dim'
      }`}
    >
      {icon}
      {children}
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
      className={`relative w-10 h-10 flex items-center justify-center cursor-pointer transition-colors group ${
        active
          ? 'text-rd-accent bg-rd-panel-hi'
          : 'text-rd-text-mute hover:text-rd-text hover:bg-rd-panel/60'
      }`}
    >
      {active && <span className="absolute left-0 top-1 bottom-1 w-[2px] bg-rd-accent" />}
      {icon}
    </button>
  );
}

/* ──────────────────────────────────────────────────────────
   Top breadcrumb bar
   ────────────────────────────────────────────────────────── */
function TopBar({
  tabs, activeTabId, onSwitchTab, onAddTab,
}: {
  tabs: { id: string; name: string }[];
  activeTabId: string;
  onSwitchTab: (id: string) => void;
  onAddTab: () => void;
}) {
  const active = tabs.find(t => t.id === activeTabId)!;
  return (
    <div className="h-11 flex items-stretch border-b border-rd-line-soft bg-rd-panel/40 backdrop-blur-sm">
      {/* breadcrumb */}
      <div className="flex items-center gap-1 pl-3">
        <button
          className="w-7 h-7 flex items-center justify-center text-rd-text-dim hover:text-rd-accent cursor-pointer"
          title="檔案庫"
        >
          <IconFolder />
        </button>
        <IconChevronRight className="text-rd-text-mute" size={12} />
        <Crumb active icon={<IconSectionMark className="text-rd-accent" />}>傷害計算</Crumb>
      </div>

      {/* tabs (workspace files) */}
      <div className="flex items-center gap-0.5 px-2 flex-1 overflow-x-auto">
        <IconChevronRight className="text-rd-text-mute shrink-0" size={12} />
        {tabs.map(t => {
          const isActive = t.id === activeTabId;
          return (
            <button
              key={t.id}
              onClick={() => onSwitchTab(t.id)}
              className={`rd-chamfer-tag h-7 px-3.5 text-xs cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-rd-panel-hi text-rd-text'
                  : 'bg-rd-panel/40 text-rd-text-dim hover:text-rd-text'
              }`}
            >
              {t.name}
            </button>
          );
        })}
        <button
          onClick={onAddTab}
          title="新增頁籤"
          className="w-6 h-6 flex items-center justify-center text-rd-text-mute hover:text-rd-accent cursor-pointer ml-1"
        >
          <IconPlus size={12} />
        </button>
        <span className="text-rd-text-mute text-xs ml-2">&gt; {active.name}</span>
      </div>

      {/* search + close */}
      <div className="flex items-center gap-1 pr-2">
        <div className="h-7 flex items-center gap-1.5 px-2.5 bg-rd-panel-mute border border-rd-line rd-chamfer-sm">
          <IconSearch className="text-rd-text-mute" size={12} />
          <input
            placeholder="搜尋技能 / 角色…"
            className="bg-transparent text-xs text-rd-text placeholder-rd-text-mute outline-none w-36"
          />
        </div>
        <button className="w-7 h-7 flex items-center justify-center text-rd-text-dim hover:text-rd-text cursor-pointer">
          <IconClose size={14} />
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Left: icon rail + data library
   ────────────────────────────────────────────────────────── */
type LibKey = 'characters' | 'buffs' | 'skills';

function LeftRail({ active, onToggle }: { active: LibKey | null; onToggle: (k: LibKey) => void }) {
  return (
    <div className="w-11 bg-rd-panel/30 border-r border-rd-line-soft flex flex-col items-center py-2 shrink-0">
      <RailButton icon={<IconUser />}  label="角色" active={active === 'characters'} onClick={() => onToggle('characters')} />
      <RailButton icon={<IconSpark />} label="BUFF" active={active === 'buffs'}      onClick={() => onToggle('buffs')}      />
      <RailButton icon={<IconSword />} label="技能" active={active === 'skills'}     onClick={() => onToggle('skills')}     />
      <div className="mt-auto">
        <RailButton icon={<IconCalculator />} label="速算器" />
        <RailButton icon={<IconGear />}       label="設定" />
      </div>
    </div>
  );
}

function LibraryPanel({ active }: { active: LibKey }) {
  const title = active === 'characters' ? '角色' : active === 'buffs' ? 'BUFF / 分區' : '技能庫';

  return (
    <aside className="w-64 bg-rd-panel/50 border-r border-rd-line-soft flex flex-col shrink-0">
      <PanelTitle
        right={
          <button className="w-6 h-6 flex items-center justify-center text-rd-text-mute hover:text-rd-accent cursor-pointer">
            <IconPlus size={14} />
          </button>
        }
      >
        {title}
      </PanelTitle>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {active === 'characters' && CHARACTERS.map(c => (
          <LibCard key={c.id} title={c.name} hasUpdate>
            <div className="grid grid-cols-3 gap-x-2 text-[11px] text-rd-text-dim mt-1">
              <div>ATK <span className="text-rd-text">{c.atk}</span></div>
              <div>暴擊 <span className="text-rd-text">{c.crit}%</span></div>
              <div>爆傷 <span className="text-rd-text">{c.cd}%</span></div>
            </div>
          </LibCard>
        ))}

        {active === 'buffs' && BUFFS.map(b => (
          <LibCard key={b.id} title={b.name}>
            <div className="flex items-center justify-between text-[11px] mt-1">
              <span className="text-rd-text-dim">{b.zone}</span>
              <span className="text-rd-data">{b.value}</span>
            </div>
          </LibCard>
        ))}

        {active === 'skills' && SKILLS.map(s => (
          <LibCard key={s.id} title={s.name}>
            <div className="flex items-center justify-between text-[11px] mt-1">
              <span className="text-rd-text-dim">{s.char}</span>
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
    <div className="relative bg-rd-panel-mute border border-rd-line hover:border-rd-line-hi px-3 py-2 rd-chamfer-sm group cursor-pointer transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-sm text-rd-text">{title}</span>
        {hasUpdate && <IconDiamond className="text-rd-accent" />}
      </div>
      {children}
      {/* bottom accent stroke on hover */}
      <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-rd-accent transition-all group-hover:w-full" />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Center: rotation list + cycle editor
   ────────────────────────────────────────────────────────── */
function CenterPane({
  activeRotationId, onSelect,
}: { activeRotationId: string; onSelect: (id: string) => void }) {
  const active = ROTATIONS.find(r => r.id === activeRotationId)!;

  return (
    <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
      {/* rotation tab strip */}
      <div className="h-11 flex items-center gap-1 px-3 border-b border-rd-line-soft bg-rd-panel/20">
        {ROTATIONS.map(r => {
          const isActive = r.id === activeRotationId;
          return (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              className={`relative h-8 px-4 text-xs cursor-pointer transition-colors rd-chamfer-tag flex items-center gap-2 ${
                isActive ? 'bg-rd-panel-hi text-rd-text' : 'bg-rd-panel/30 text-rd-text-dim hover:text-rd-text'
              }`}
            >
              {r.name}
              {isActive && <span className="absolute left-2 right-2 bottom-0 h-[2px] bg-rd-accent" />}
            </button>
          );
        })}
        <button
          className="h-7 px-2 ml-1 text-rd-text-mute hover:text-rd-accent cursor-pointer flex items-center gap-1 text-xs"
          title="新增循環"
        >
          <IconPlus size={12} /> 新增
        </button>
      </div>

      {/* active rotation header */}
      <div className="px-6 py-4 border-b border-rd-line-soft">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] tracking-[0.25em] text-rd-text-mute uppercase mb-1">Active Rotation</div>
            <div className="flex items-baseline gap-3">
              <h1 className="text-xl text-rd-text">{active.name}</h1>
              <span className="text-[11px] text-rd-text-mute">
                ID / {active.id.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] tracking-[0.25em] text-rd-text-mute uppercase mb-1">Total Damage</div>
            <div className="text-3xl text-rd-accent font-medium tabular-nums">{fmt(active.dmg)}</div>
          </div>
        </div>

        {/* buff bar */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {['攻擊力 +36%', '暴傷 +80%', '易傷 +25%', '元素增幅 +40%'].map(t => (
            <span
              key={t}
              className="rd-chamfer-sm bg-rd-panel-mute border border-rd-line px-2.5 py-1 text-[11px] text-rd-data"
            >
              {t}
            </span>
          ))}
          <button className="rd-chamfer-sm border border-dashed border-rd-line-hi text-rd-text-mute hover:text-rd-accent hover:border-rd-accent px-2.5 py-1 text-[11px] cursor-pointer flex items-center gap-1">
            <IconPlus size={10} /> 加入 BUFF
          </button>
        </div>
      </div>

      {/* skill entries */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-rd-text-dim">
            <IconSectionMark className="text-rd-accent" />
            <span className="text-[11px] tracking-[0.15em] uppercase">技能序列</span>
          </div>
          <button className="h-7 px-3 text-[11px] text-rd-text-dim hover:text-rd-accent cursor-pointer flex items-center gap-1">
            <IconPlus size={12} /> 加入技能
          </button>
        </div>

        {CYCLE_ENTRIES.map((e, i) => (
          <div
            key={e.id}
            className="relative bg-rd-panel border border-rd-line hover:border-rd-line-hi transition-colors group"
            style={{
              clipPath:
                'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
            }}
          >
            <div className="flex items-stretch">
              <div className="w-10 flex flex-col items-center justify-center border-r border-rd-line-soft text-rd-text-mute">
                <span className="text-[10px] tracking-wider">#{String(i + 1).padStart(2, '0')}</span>
                <IconGrip className="mt-1 text-rd-text-mute/60 cursor-grab" size={12} />
              </div>
              <div className="flex-1 px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-rd-text">{e.skill}</span>
                    {e.count > 1 && (
                      <span className="text-[10px] text-rd-text-mute border border-rd-line px-1.5 py-0.5 tabular-nums">
                        ×{e.count}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-rd-text-mute mt-0.5">施放者 · {e.char}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-rd-accent tabular-nums font-medium">{fmt(e.dmg)}</div>
                  {e.count > 1 && (
                    <div className="text-[10px] text-rd-text-mute tabular-nums">
                      單次 {fmt(Math.round(e.dmg / e.count))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-0.5 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-6 h-6 flex items-center justify-center text-rd-text-mute hover:text-rd-data cursor-pointer">
                  <IconCopy size={12} />
                </button>
                <button className="w-6 h-6 flex items-center justify-center text-rd-text-mute hover:text-rd-neg cursor-pointer">
                  <IconTrash size={12} />
                </button>
              </div>
            </div>
            {/* left accent */}
            <span className="absolute left-0 top-2 bottom-2 w-[2px] bg-rd-line-hi group-hover:bg-rd-accent transition-colors" />
          </div>
        ))}
      </div>
    </main>
  );
}

/* ──────────────────────────────────────────────────────────
   Right: analysis panel
   ────────────────────────────────────────────────────────── */
function AnalysisPanel({ activeRotationId, onSelect }: { activeRotationId: string; onSelect: (id: string) => void }) {
  const activeDmg = ROTATIONS.find(r => r.id === activeRotationId)!.dmg;
  const maxDmg = Math.max(...ROTATIONS.filter(r => !r.excluded).map(r => r.dmg));

  return (
    <aside className="w-[300px] bg-rd-panel/50 border-l border-rd-line-soft flex flex-col shrink-0">
      <PanelTitle>循環比較</PanelTitle>

      <div className="p-3 space-y-2 overflow-y-auto">
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
                r.excluded ? 'opacity-40' : ''
              } ${
                isActive
                  ? 'bg-rd-panel-hi border border-rd-accent/60'
                  : 'bg-rd-panel-mute border border-rd-line hover:border-rd-line-hi'
              }`}
            >
              {isActive && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-rd-accent" />}

              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <IconGrip className="text-rd-text-mute/60 shrink-0" size={12} />
                  <span className={`text-sm truncate ${isActive ? 'text-rd-text' : 'text-rd-text-dim'}`}>
                    {r.name}
                  </span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-rd-text-mute hover:text-rd-data cursor-pointer"><IconCopy size={11} /></button>
                  <button className="text-rd-text-mute hover:text-rd-neg cursor-pointer"><IconTrash size={11} /></button>
                </div>
              </div>

              {/* segmented bar */}
              <div className="flex gap-[2px] h-1.5 mb-1.5">
                {Array.from({ length: 20 }).map((_, i) => {
                  const filled = (i / 20) * 100 < pct;
                  return (
                    <div
                      key={i}
                      className={`flex-1 ${
                        filled ? (isActive ? 'bg-rd-accent' : 'bg-rd-line-hi') : 'bg-rd-panel'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="flex items-baseline justify-between">
                <span className={`text-base tabular-nums ${isActive ? 'text-rd-accent' : 'text-rd-text'}`}>
                  {fmt(r.dmg)}
                </span>
                {diff !== null && (
                  <span className={`text-[11px] tabular-nums ${Number(diff) >= 0 ? 'text-rd-pos' : 'text-rd-neg'}`}>
                    {Number(diff) >= 0 ? '+' : ''}{diff}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* summary block */}
      <div className="border-t border-rd-line-soft p-4">
        <div className="text-[10px] tracking-[0.25em] text-rd-text-mute uppercase">Peak</div>
        <div className="text-2xl text-rd-text tabular-nums font-medium mt-1">
          {fmt(maxDmg)}
        </div>
        <div className="text-[11px] text-rd-text-mute mt-0.5">4 個循環 · 1 個排除</div>
      </div>
    </aside>
  );
}

/* ──────────────────────────────────────────────────────────
   Bottom status bar
   ────────────────────────────────────────────────────────── */
function StatusBar() {
  return (
    <div className="h-6 border-t border-rd-line-soft bg-rd-panel/40 flex items-center justify-between px-3 text-[10px] text-rd-text-mute tracking-wider">
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
      <TopBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSwitchTab={setActiveTabId}
        onAddTab={addTab}
      />

      <div className="flex-1 flex overflow-hidden">
        <LeftRail active={libOpen} onToggle={toggleLib} />
        {libOpen && <LibraryPanel active={libOpen} />}
        <CenterPane activeRotationId={activeRotationId} onSelect={setActiveRotationId} />
        <AnalysisPanel activeRotationId={activeRotationId} onSelect={setActiveRotationId} />
      </div>

      <StatusBar />
    </div>
  );
}
