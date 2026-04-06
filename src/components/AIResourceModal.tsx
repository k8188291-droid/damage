import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { useAppStore } from '../stores/appStore';
import { useShallow } from 'zustand/shallow';

// ── Zod Schemas ──

const CharacterSchema = z.object({
  name: z.string().min(1, '角色名稱不可為空'),
  baseAttack: z.number().min(0, '基礎攻擊力不可為負'),
  weaponAttack: z.number().min(0, '武器攻擊力不可為負'),
  attackPercentBonus: z.number(),
});

const BuffSchema = z.object({
  name: z.string().min(1, 'Buff 名稱不可為空'),
  zoneId: z.string().min(1, '必須指定分區 ID'),
  groupId: z.string().default(''),
  value: z.number(),
  icon: z.string().default('🌟'),
  enabled: z.boolean().default(true),
});

const SkillSchema = z.object({
  name: z.string().min(1, '技能名稱不可為空'),
  characterId: z.string().default(''),
  skillMultiplier: z.number().min(0, '技能倍率不可為負'),
  enabledBuffIds: z.array(z.string()).default([]),
  groupId: z.string().default(''),
});

const BuffGroupSchema = z.object({
  name: z.string().min(1, '群組名稱不可為空'),
  color: z.string().default('#3b82f6'),
});

const ZoneSchema = z.object({
  name: z.string().min(1, '分區名稱不可為空'),
  displayName: z.string().min(1, '顯示名稱不可為空'),
  icon: z.string().default('📦'),
  color: z.string().default('#64748b'),
  isDefault: z.boolean().default(false),
});

// Batch schemas (allow single or array)
const CharacterBatchSchema = z.union([CharacterSchema, z.array(CharacterSchema)]);
const BuffBatchSchema = z.union([BuffSchema, z.array(BuffSchema)]);
const SkillBatchSchema = z.union([SkillSchema, z.array(SkillSchema)]);
const BuffGroupBatchSchema = z.union([BuffGroupSchema, z.array(BuffGroupSchema)]);
const ZoneBatchSchema = z.union([ZoneSchema, z.array(ZoneSchema)]);

// ── Resource Types ──

type ResourceType = 'character' | 'buff' | 'skill' | 'buffGroup' | 'zone';

interface ResourceConfig {
  label: string;
  icon: string;
  schema: z.ZodType;
  prompt: string;
  example: string;
}

const ZONE_LIST = `可用的分區 ID 與名稱：
- "zone-skill"：技能倍率
- "zone-dmg-bonus"：增傷
- "zone-vuln"：易傷
- "zone-crit"：暴擊
- "zone-stagger"：失衡
- "zone-resist"：抗性
- "zone-fragile"：脆弱
- "zone-amp"：增幅`;

const RESOURCE_CONFIGS: Record<ResourceType, ResourceConfig> = {
  character: {
    label: '角色',
    icon: '👤',
    schema: CharacterBatchSchema,
    prompt: `請幫我產生遊戲角色的 JSON 資料，用於傷害計算器。

格式要求（可以是單一物件或陣列）：
{
  "name": "角色名稱",
  "baseAttack": 數字（基礎攻擊力）,
  "weaponAttack": 數字（武器攻擊力）,
  "attackPercentBonus": 數字（攻擊力百分比加成，例如 15 代表 15%）
}

請根據我的需求產生 JSON，只需要輸出純 JSON，不要其他文字。`,
    example: `[
  {
    "name": "主角",
    "baseAttack": 800,
    "weaponAttack": 500,
    "attackPercentBonus": 15
  }
]`,
  },

  buff: {
    label: 'Buff',
    icon: '✨',
    schema: BuffBatchSchema,
    prompt: `請幫我產生 BUFF 的 JSON 資料，用於傷害計算器。

格式要求（可以是單一物件或陣列）：
{
  "name": "Buff 名稱",
  "zoneId": "分區 ID（見下方列表）",
  "groupId": "群組 ID（可留空 ""）",
  "value": 數字（百分比數值，例如 30 代表 30%）,
  "icon": "emoji 圖標（預設 🌟）",
  "enabled": true 或 false（預設 true）
}

${ZONE_LIST}

請根據我的需求產生 JSON，只需要輸出純 JSON，不要其他文字。`,
    example: `[
  {
    "name": "攻擊力提升",
    "zoneId": "zone-dmg-bonus",
    "groupId": "",
    "value": 30,
    "icon": "⚔️",
    "enabled": true
  }
]`,
  },

  skill: {
    label: '技能',
    icon: '⚡',
    schema: SkillBatchSchema,
    prompt: `請幫我產生技能的 JSON 資料，用於傷害計算器。

格式要求（可以是單一物件或陣列）：
{
  "name": "技能名稱",
  "characterId": "角色 ID（可留空 ""，之後手動關聯）",
  "skillMultiplier": 數字（技能倍率百分比，例如 350 代表 350%）,
  "enabledBuffIds": []（預設空陣列，之後手動設定）,
  "groupId": "技能群組 ID（可留空 ""）"
}

請根據我的需求產生 JSON，只需要輸出純 JSON，不要其他文字。`,
    example: `[
  {
    "name": "普通攻擊",
    "characterId": "",
    "skillMultiplier": 150,
    "enabledBuffIds": [],
    "groupId": ""
  },
  {
    "name": "大招",
    "characterId": "",
    "skillMultiplier": 800,
    "enabledBuffIds": [],
    "groupId": ""
  }
]`,
  },

  buffGroup: {
    label: '群組',
    icon: '📁',
    schema: BuffGroupBatchSchema,
    prompt: `請幫我產生 Buff 群組的 JSON 資料，用於傷害計算器中組織 Buff。

格式要求（可以是單一物件或陣列）：
{
  "name": "群組名稱",
  "color": "顏色代碼（十六進位，例如 #3b82f6）"
}

可用顏色參考：
#ef4444（紅）, #f97316（橙）, #eab308（黃）, #22c55e（綠）,
#06b6d4（青）, #3b82f6（藍）, #8b5cf6（紫）, #ec4899（粉）

請根據我的需求產生 JSON，只需要輸出純 JSON，不要其他文字。`,
    example: `[
  { "name": "主動 Buff", "color": "#22c55e" },
  { "name": "被動 Buff", "color": "#3b82f6" }
]`,
  },

  zone: {
    label: '分區',
    icon: '📦',
    schema: ZoneBatchSchema,
    prompt: `請幫我產生傷害分區的 JSON 資料，用於傷害計算器。

格式要求（可以是單一物件或陣列）：
{
  "name": "分區內部名稱",
  "displayName": "分區顯示名稱",
  "icon": "emoji 圖標",
  "color": "顏色代碼（十六進位）",
  "isDefault": false
}

系統已有的預設分區：技能倍率、增傷、易傷、暴擊、失衡、抗性、脆弱、增幅。
請只產生新的自訂分區。

請根據我的需求產生 JSON，只需要輸出純 JSON，不要其他文字。`,
    example: `[
  {
    "name": "元素加成",
    "displayName": "元素加成",
    "icon": "🔷",
    "color": "#0ea5e9",
    "isDefault": false
  }
]`,
  },
};

// ── Component ──

export default function AIResourceModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'select' | 'input'>('select');
  const [resourceType, setResourceType] = useState<ResourceType | null>(null);
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    characters, skills, buffs, zones, buffGroups,
    setCharacters, setSkills, setBuffs, setZones, setBuffGroups,
  } = useAppStore(useShallow(s => ({
    characters: s.characters,
    skills: s.skills,
    buffs: s.buffs,
    zones: s.zones,
    buffGroups: s.buffGroups,
    setCharacters: s.setCharacters,
    setSkills: s.setSkills,
    setBuffs: s.setBuffs,
    setZones: s.setZones,
    setBuffGroups: s.setBuffGroups,
  })));

  const reset = useCallback(() => {
    setStep('select');
    setResourceType(null);
    setJsonText('');
    setError('');
    setSuccess('');
    setCopied(false);
    setShowExample(false);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setTimeout(reset, 200);
  }, [reset]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, close]);

  const selectResource = (type: ResourceType) => {
    setResourceType(type);
    setStep('input');
    setError('');
    setSuccess('');
    setJsonText('');
    setCopied(false);
    setShowExample(false);
  };

  const copyPrompt = async () => {
    if (!resourceType) return;
    const config = RESOURCE_CONFIGS[resourceType];
    try {
      await navigator.clipboard.writeText(config.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text
      const ta = document.createElement('textarea');
      ta.value = config.prompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = () => {
    if (!resourceType) return;
    setError('');
    setSuccess('');

    const trimmed = jsonText.trim();
    if (!trimmed) {
      setError('請輸入 JSON 內容');
      return;
    }

    // Try to parse JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      // Try to extract JSON from markdown code block
      const codeBlockMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
      if (codeBlockMatch) {
        try {
          parsed = JSON.parse(codeBlockMatch[1].trim());
        } catch {
          setError('JSON 格式錯誤，請確認格式是否正確');
          return;
        }
      } else {
        setError('JSON 格式錯誤，請確認格式是否正確');
        return;
      }
    }

    // Validate with zod
    const config = RESOURCE_CONFIGS[resourceType];
    const result = config.schema.safeParse(parsed);
    if (!result.success) {
      const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n');
      setError(`資料驗證失敗：\n${issues}`);
      return;
    }

    const data = result.data;
    const items = Array.isArray(data) ? data : [data];

    // Create resources in store
    let count = 0;
    switch (resourceType) {
      case 'character': {
        const newChars = items.map((item: z.infer<typeof CharacterSchema>, i: number) => ({
          ...item,
          id: uuid(),
          order: characters.length + i,
        }));
        setCharacters([...characters, ...newChars]);
        count = newChars.length;
        break;
      }
      case 'buff': {
        const newBuffs = items.map((item: z.infer<typeof BuffSchema>) => ({
          ...item,
          id: uuid(),
        }));
        setBuffs([...buffs, ...newBuffs]);
        count = newBuffs.length;
        break;
      }
      case 'skill': {
        const newSkills = items.map((item: z.infer<typeof SkillSchema>, i: number) => ({
          ...item,
          id: uuid(),
          order: skills.length + i,
        }));
        setSkills([...skills, ...newSkills]);
        count = newSkills.length;
        break;
      }
      case 'buffGroup': {
        const newGroups = items.map((item: z.infer<typeof BuffGroupSchema>) => ({
          ...item,
          id: uuid(),
        }));
        setBuffGroups([...buffGroups, ...newGroups]);
        count = newGroups.length;
        break;
      }
      case 'zone': {
        const newZones = items.map((item: z.infer<typeof ZoneSchema>) => ({
          ...item,
          id: uuid(),
        }));
        setZones([...zones, ...newZones]);
        count = newZones.length;
        break;
      }
    }

    setSuccess(`成功新增 ${count} 個${RESOURCE_CONFIGS[resourceType].label}！`);
    setJsonText('');
  };

  const config = resourceType ? RESOURCE_CONFIGS[resourceType] : null;

  return (
    <>
      {/* Floating AI Button */}
      <button
        onClick={() => { setOpen(true); reset(); }}
        className="fixed top-3 right-4 z-[100] group cursor-pointer"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl blur-md opacity-60 group-hover:opacity-90 transition-opacity animate-pulse" />
          <div className="relative flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl text-white font-semibold text-sm shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-violet-500/25">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a4 4 0 0 1 4 4v1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2V6a4 4 0 0 1 4-4z" />
              <circle cx="10" cy="9" r="1" fill="currentColor" />
              <circle cx="14" cy="9" r="1" fill="currentColor" />
              <path d="M9 14v1a3 3 0 0 0 6 0v-1" />
              <path d="M5 20h14" />
              <path d="M12 17v3" />
            </svg>
            AI
          </div>
        </div>
      </button>

      {/* Modal */}
      {open && createPortal(
        <div
          ref={backdropRef}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={e => { if (e.target === backdropRef.current) close(); }}
        >
          <div className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">AI</div>
                <h3 className="text-sm font-semibold text-gray-100">
                  {step === 'select' ? 'AI 資源建立' : `新增${config?.label}`}
                </h3>
              </div>
              <button onClick={close} className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer text-lg leading-none">&times;</button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {step === 'select' ? (
                <div className="p-5">
                  <p className="text-xs text-gray-400 mb-4">選擇要建立的資源類型，複製提示詞後向 AI 描述你的需求，將產生的 JSON 貼回即可建立。</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(Object.entries(RESOURCE_CONFIGS) as [ResourceType, ResourceConfig][]).map(([key, cfg]) => (
                      <button
                        key={key}
                        onClick={() => selectResource(key)}
                        className="flex items-center gap-3 p-3.5 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-indigo-500/50 rounded-xl transition-all duration-150 cursor-pointer group text-left"
                      >
                        <span className="text-xl group-hover:scale-110 transition-transform">{cfg.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-200 group-hover:text-indigo-300 transition-colors">新增{cfg.label}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : config && (
                <div className="p-5 space-y-4">
                  {/* Step indicator */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <button onClick={() => { setStep('select'); setError(''); setSuccess(''); }} className="hover:text-gray-300 cursor-pointer transition-colors">
                      &larr; 返回
                    </button>
                    <span className="text-gray-700">|</span>
                    <span>{config.icon} 新增{config.label}</span>
                  </div>

                  {/* Step 1: Copy Prompt */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold shrink-0">1</span>
                      <span className="text-xs font-medium text-gray-300">複製提示詞，發給任意 AI 聊天工具</span>
                    </div>
                    <div className="bg-gray-800/60 rounded-lg p-3 text-[11px] text-gray-400 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto border border-gray-700/30">
                      {config.prompt}
                    </div>
                    <button
                      onClick={copyPrompt}
                      className={`w-full py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                        copied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {copied ? '已複製提示詞！' : '複製提示詞'}
                    </button>
                  </div>

                  {/* Step 2: Paste JSON */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold shrink-0">2</span>
                        <span className="text-xs font-medium text-gray-300">將 AI 產生的 JSON 貼到下方</span>
                      </div>
                      <button
                        onClick={() => setShowExample(!showExample)}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors"
                      >
                        {showExample ? '隱藏範例' : '查看範例'}
                      </button>
                    </div>

                    {showExample && (
                      <div className="bg-gray-800/40 rounded-lg p-2.5 text-[11px] text-emerald-400 font-mono whitespace-pre-wrap border border-gray-700/30">
                        {config.example}
                      </div>
                    )}

                    <textarea
                      ref={textareaRef}
                      value={jsonText}
                      onChange={e => { setJsonText(e.target.value); setError(''); setSuccess(''); }}
                      placeholder='在此貼上 JSON...'
                      className="w-full h-36 bg-gray-800/60 border border-gray-700/50 rounded-lg p-3 text-xs font-mono text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-indigo-500/50 transition-colors"
                    />

                    {/* Error */}
                    {error && (
                      <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-2.5 text-[11px] text-red-400 whitespace-pre-wrap">
                        {error}
                      </div>
                    )}

                    {/* Success */}
                    {success && (
                      <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-2.5 text-[11px] text-emerald-400">
                        {success}
                      </div>
                    )}

                    <button
                      onClick={handleSubmit}
                      disabled={!jsonText.trim()}
                      className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 rounded-lg text-xs font-semibold text-white transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                    >
                      驗證並建立
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
