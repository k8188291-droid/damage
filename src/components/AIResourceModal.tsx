import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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

const InlineGroupSchema = z.object({
  name: z.string().min(1, '群組名稱不可為空'),
  color: z.string().default('#3b82f6'),
});

const BuffItemSchema = z.object({
  name: z.string().min(1, 'Buff 名稱不可為空'),
  zoneId: z.string().min(1, '必須指定分區 ID'),
  groupId: z.string().default(''),
  groupName: z.string().optional(),
  value: z.number(),
  icon: z.string().default('🌟'),
  enabled: z.boolean().default(true),
});

const SkillItemSchema = z.object({
  name: z.string().min(1, '技能名稱不可為空'),
  characterId: z.string().default(''),
  skillMultiplier: z.number().min(0, '技能倍率不可為負'),
  enabledBuffIds: z.array(z.string()).default([]),
  groupId: z.string().default(''),
  groupName: z.string().optional(),
});

// Wrapper schemas with inline group creation
const BuffWrapperSchema = z.object({
  newGroups: z.array(InlineGroupSchema).default([]),
  buffs: z.array(BuffItemSchema).min(1, '至少需要一個 Buff'),
});

const SkillWrapperSchema = z.object({
  newGroups: z.array(InlineGroupSchema).default([]),
  skills: z.array(SkillItemSchema).min(1, '至少需要一個技能'),
});

// Accept wrapper format OR simple array/single item
const BuffBatchSchema = z.union([
  BuffWrapperSchema,
  z.array(BuffItemSchema),
  BuffItemSchema,
]);

const SkillBatchSchema = z.union([
  SkillWrapperSchema,
  z.array(SkillItemSchema),
  SkillItemSchema,
]);

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

const CharacterBatchSchema = z.union([CharacterSchema, z.array(CharacterSchema)]);
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

const COLOR_REF = `可用顏色：#ef4444（紅）, #f97316（橙）, #eab308（黃）, #22c55e（綠）, #06b6d4（青）, #3b82f6（藍）, #8b5cf6（紫）, #ec4899（粉）`;

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
    characters, skills, buffs, zones, buffGroups, skillGroups,
    setCharacters, setSkills, setBuffs, setZones, setBuffGroups, setSkillGroups,
  } = useAppStore(useShallow(s => ({
    characters: s.characters,
    skills: s.skills,
    buffs: s.buffs,
    zones: s.zones,
    buffGroups: s.buffGroups,
    skillGroups: s.skillGroups,
    setCharacters: s.setCharacters,
    setSkills: s.setSkills,
    setBuffs: s.setBuffs,
    setZones: s.setZones,
    setBuffGroups: s.setBuffGroups,
    setSkillGroups: s.setSkillGroups,
  })));

  // Dynamic prompts that include existing groups
  const resourceConfigs = useMemo((): Record<ResourceType, ResourceConfig> => {
    const buffGroupList = buffGroups.length > 0
      ? `\n目前已有的 Buff 群組：\n${buffGroups.map(g => `- ID: "${g.id}"，名稱: "${g.name}"`).join('\n')}`
      : '\n目前尚無 Buff 群組。';

    const skillGroupList = skillGroups.length > 0
      ? `\n目前已有的技能群組：\n${skillGroups.map(g => `- ID: "${g.id}"，名稱: "${g.name}"`).join('\n')}`
      : '\n目前尚無技能群組。';

    const characterList = characters.length > 0
      ? `\n目前已有的角色：\n${characters.map(c => `- ID: "${c.id}"，名稱: "${c.name}"`).join('\n')}`
      : '\n目前尚無角色。';

    return {
      character: {
        label: '角色',
        icon: '👤',
        schema: CharacterBatchSchema,
        prompt: `請幫我產生遊戲角色的 JSON 資料，用於傷害計算器。可一次產生多個角色。

格式（陣列）：
[
  {
    "name": "角色名稱",
    "baseAttack": 數字（基礎攻擊力）,
    "weaponAttack": 數字（武器攻擊力）,
    "attackPercentBonus": 數字（攻擊力百分比加成，15 代表 15%）
  }
]

請根據我的需求產生 JSON，只輸出純 JSON，不要其他文字。`,
        example: `[
  { "name": "主角", "baseAttack": 800, "weaponAttack": 500, "attackPercentBonus": 15 },
  { "name": "副手", "baseAttack": 600, "weaponAttack": 400, "attackPercentBonus": 10 }
]`,
      },

      buff: {
        label: 'Buff',
        icon: '✨',
        schema: BuffBatchSchema,
        prompt: `請幫我產生 BUFF 的 JSON 資料，用於傷害計算器。可一次產生多個 Buff，也可同時新增群組。

格式：
{
  "newGroups": [
    { "name": "群組名稱", "color": "十六進位色碼" }
  ],
  "buffs": [
    {
      "name": "Buff 名稱",
      "zoneId": "分區 ID（見下方列表）",
      "groupName": "群組名稱（對應 newGroups 中的名稱，或已有群組的名稱，可省略）",
      "value": 數字（百分比，30 代表 30%）,
      "icon": "emoji 圖標",
      "enabled": true
    }
  ]
}

如果不需要新增群組，也可以直接用陣列格式：
[{ "name": "...", "zoneId": "...", "value": 數字, "icon": "emoji", "enabled": true }]

${ZONE_LIST}
${buffGroupList}
${COLOR_REF}

請根據我的需求產生 JSON，只輸出純 JSON，不要其他文字。`,
        example: `{
  "newGroups": [
    { "name": "隊伍增益", "color": "#22c55e" },
    { "name": "個人增益", "color": "#3b82f6" }
  ],
  "buffs": [
    { "name": "攻擊光環", "zoneId": "zone-dmg-bonus", "groupName": "隊伍增益", "value": 25, "icon": "⚔️", "enabled": true },
    { "name": "暴擊提升", "zoneId": "zone-crit", "groupName": "個人增益", "value": 40, "icon": "💥", "enabled": true },
    { "name": "脆弱標記", "zoneId": "zone-fragile", "groupName": "隊伍增益", "value": 15, "icon": "🔮", "enabled": true }
  ]
}`,
      },

      skill: {
        label: '技能',
        icon: '⚡',
        schema: SkillBatchSchema,
        prompt: `請幫我產生技能的 JSON 資料，用於傷害計算器。可一次產生多個技能，也可同時新增技能群組。

格式：
{
  "newGroups": [
    { "name": "群組名稱", "color": "十六進位色碼" }
  ],
  "skills": [
    {
      "name": "技能名稱",
      "characterId": "角色 ID（可留空 ""）",
      "skillMultiplier": 數字（技能倍率百分比，350 代表 350%）,
      "enabledBuffIds": [],
      "groupName": "群組名稱（對應 newGroups 中的名稱，或已有群組的名稱，可省略）"
    }
  ]
}

如果不需要新增群組，也可以直接用陣列格式：
[{ "name": "...", "characterId": "", "skillMultiplier": 數字, "enabledBuffIds": [], "groupName": "" }]
${characterList}
${skillGroupList}
${COLOR_REF}

請根據我的需求產生 JSON，只輸出純 JSON，不要其他文字。`,
        example: `{
  "newGroups": [
    { "name": "普攻連段", "color": "#ef4444" },
    { "name": "必殺技", "color": "#8b5cf6" }
  ],
  "skills": [
    { "name": "普攻一段", "characterId": "", "skillMultiplier": 120, "enabledBuffIds": [], "groupName": "普攻連段" },
    { "name": "普攻二段", "characterId": "", "skillMultiplier": 180, "enabledBuffIds": [], "groupName": "普攻連段" },
    { "name": "終結技", "characterId": "", "skillMultiplier": 950, "enabledBuffIds": [], "groupName": "必殺技" }
  ]
}`,
      },

      buffGroup: {
        label: '群組',
        icon: '📁',
        schema: BuffGroupBatchSchema,
        prompt: `請幫我產生 Buff 群組的 JSON 資料，用於傷害計算器中組織 Buff。可一次產生多個群組。

格式（陣列）：
[
  { "name": "群組名稱", "color": "十六進位色碼" }
]

${COLOR_REF}
${buffGroupList}

請根據我的需求產生 JSON，只輸出純 JSON，不要其他文字。`,
        example: `[
  { "name": "主動 Buff", "color": "#22c55e" },
  { "name": "被動 Buff", "color": "#3b82f6" },
  { "name": "食物增益", "color": "#f97316" }
]`,
      },

      zone: {
        label: '分區',
        icon: '📦',
        schema: ZoneBatchSchema,
        prompt: `請幫我產生傷害分區的 JSON 資料，用於傷害計算器。可一次產生多個分區。

格式（陣列）：
[
  {
    "name": "分區內部名稱",
    "displayName": "分區顯示名稱",
    "icon": "emoji 圖標",
    "color": "十六進位色碼",
    "isDefault": false
  }
]

系統已有的預設分區：技能倍率、增傷、易傷、暴擊、失衡、抗性、脆弱、增幅。
請只產生新的自訂分區。

請根據我的需求產生 JSON，只輸出純 JSON，不要其他文字。`,
        example: `[
  { "name": "元素加成", "displayName": "元素加成", "icon": "🔷", "color": "#0ea5e9", "isDefault": false }
]`,
      },
    };
  }, [buffGroups, skillGroups, characters]);

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
    const config = resourceConfigs[resourceType];
    try {
      await navigator.clipboard.writeText(config.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
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

  const resolveGroupName = (
    groupName: string | undefined,
    existingGroups: { id: string; name: string }[],
    newGroupMap: Map<string, string>,
  ): string => {
    if (!groupName) return '';
    // Check newly created groups first
    const newId = newGroupMap.get(groupName);
    if (newId) return newId;
    // Check existing groups
    const existing = existingGroups.find(g => g.name === groupName);
    if (existing) return existing.id;
    return '';
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

    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
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

    const config = resourceConfigs[resourceType];
    const result = config.schema.safeParse(parsed);
    if (!result.success) {
      const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n');
      setError(`資料驗證失敗：\n${issues}`);
      return;
    }

    const data = result.data;
    const messages: string[] = [];

    switch (resourceType) {
      case 'character': {
        const items = Array.isArray(data) ? data : [data];
        const newChars = items.map((item: z.infer<typeof CharacterSchema>, i: number) => ({
          ...item, id: uuid(), order: characters.length + i,
        }));
        setCharacters([...characters, ...newChars]);
        messages.push(`${newChars.length} 個角色`);
        break;
      }

      case 'buff': {
        // Determine if wrapper format or simple format
        let newGroupDefs: z.infer<typeof InlineGroupSchema>[] = [];
        let buffItems: z.infer<typeof BuffItemSchema>[];

        if (!Array.isArray(data) && 'buffs' in data && Array.isArray(data.buffs)) {
          // Wrapper format
          newGroupDefs = data.newGroups || [];
          buffItems = data.buffs;
        } else {
          buffItems = Array.isArray(data) ? data : [data];
        }

        // Create new groups first
        const newGroupMap = new Map<string, string>();
        if (newGroupDefs.length > 0) {
          const createdGroups = newGroupDefs.map(g => ({ ...g, id: uuid() }));
          createdGroups.forEach(g => newGroupMap.set(g.name, g.id));
          setBuffGroups([...buffGroups, ...createdGroups]);
          messages.push(`${createdGroups.length} 個群組`);
        }

        // Create buffs, resolving groupName → groupId
        const newBuffs = buffItems.map((item) => {
          const { groupName, ...rest } = item;
          const resolvedGroupId = groupName
            ? resolveGroupName(groupName, buffGroups, newGroupMap)
            : rest.groupId || '';
          return { ...rest, groupId: resolvedGroupId, id: uuid() };
        });
        setBuffs([...buffs, ...newBuffs]);
        messages.push(`${newBuffs.length} 個 Buff`);
        break;
      }

      case 'skill': {
        let newGroupDefs: z.infer<typeof InlineGroupSchema>[] = [];
        let skillItems: z.infer<typeof SkillItemSchema>[];

        if (!Array.isArray(data) && 'skills' in data && Array.isArray(data.skills)) {
          newGroupDefs = data.newGroups || [];
          skillItems = data.skills;
        } else {
          skillItems = Array.isArray(data) ? data : [data];
        }

        // Create new skill groups first
        const newGroupMap = new Map<string, string>();
        if (newGroupDefs.length > 0) {
          const createdGroups = newGroupDefs.map(g => ({ ...g, id: uuid() }));
          createdGroups.forEach(g => newGroupMap.set(g.name, g.id));
          setSkillGroups([...skillGroups, ...createdGroups]);
          messages.push(`${createdGroups.length} 個群組`);
        }

        // Create skills, resolving groupName → groupId
        const newSkills = skillItems.map((item, i: number) => {
          const { groupName, ...rest } = item;
          const resolvedGroupId = groupName
            ? resolveGroupName(groupName, skillGroups, newGroupMap)
            : rest.groupId || '';
          return { ...rest, groupId: resolvedGroupId, id: uuid(), order: skills.length + i };
        });
        setSkills([...skills, ...newSkills]);
        messages.push(`${newSkills.length} 個技能`);
        break;
      }

      case 'buffGroup': {
        const items = Array.isArray(data) ? data : [data];
        const newGroups = items.map((item: z.infer<typeof BuffGroupSchema>) => ({ ...item, id: uuid() }));
        setBuffGroups([...buffGroups, ...newGroups]);
        messages.push(`${newGroups.length} 個群組`);
        break;
      }

      case 'zone': {
        const items = Array.isArray(data) ? data : [data];
        const newZones = items.map((item: z.infer<typeof ZoneSchema>) => ({ ...item, id: uuid() }));
        setZones([...zones, ...newZones]);
        messages.push(`${newZones.length} 個分區`);
        break;
      }
    }

    setSuccess(`成功新增 ${messages.join(' + ')}！`);
    setJsonText('');
  };

  const config = resourceType ? resourceConfigs[resourceType] : null;

  return (
    <>
      {/* Floating AI Button */}
      <button
        onClick={() => { setOpen(true); reset(); }}
        className="fixed top-3 right-4 z-[100] group cursor-pointer"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl blur-md opacity-60 group-hover:opacity-90 transition-opacity animate-pulse" />
          <div className="relative flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl text-white font-semibold text-[14px] shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-violet-500/25">
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
          <div className="w-full max-w-xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-[13px] font-bold">AI</div>
                <h3 className="text-[15px] font-semibold text-gray-100">
                  {step === 'select' ? 'AI 資源建立' : `新增${config?.label}`}
                </h3>
              </div>
              <button onClick={close} className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer text-xl leading-none">&times;</button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {step === 'select' ? (
                <div className="p-5">
                  <p className="text-[14px] text-gray-400 mb-4">選擇要建立的資源類型，複製提示詞後向 AI 描述你的需求，將產生的 JSON 貼回即可建立。</p>
                  <div className="grid grid-cols-2 gap-3">
                    {(Object.entries(resourceConfigs) as [ResourceType, ResourceConfig][]).map(([key, cfg]) => (
                      <button
                        key={key}
                        onClick={() => selectResource(key)}
                        className="flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-indigo-500/50 rounded-xl transition-all duration-150 cursor-pointer group text-left"
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform">{cfg.icon}</span>
                        <div className="text-[14px] font-medium text-gray-200 group-hover:text-indigo-300 transition-colors">新增{cfg.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : config && (
                <div className="p-5 space-y-4">
                  {/* Back + title */}
                  <div className="flex items-center gap-2 text-[14px] text-gray-500">
                    <button onClick={() => { setStep('select'); setError(''); setSuccess(''); }} className="hover:text-gray-300 cursor-pointer transition-colors">
                      &larr; 返回
                    </button>
                    <span className="text-gray-700">|</span>
                    <span>{config.icon} 新增{config.label}</span>
                  </div>

                  {/* Step 1: Copy Prompt */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[12px] flex items-center justify-center font-bold shrink-0">1</span>
                      <span className="text-[14px] font-medium text-gray-300">複製提示詞，發給任意 AI 聊天工具</span>
                    </div>
                    <div className="bg-gray-800/60 rounded-lg p-3 text-[13px] text-gray-400 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto border border-gray-700/30 leading-relaxed">
                      {config.prompt}
                    </div>
                    <button
                      onClick={copyPrompt}
                      className={`w-full py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 cursor-pointer ${
                        copied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {copied ? '已複製提示詞！' : '複製提示詞'}
                    </button>
                  </div>

                  {/* Step 2: Paste JSON */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[12px] flex items-center justify-center font-bold shrink-0">2</span>
                        <span className="text-[14px] font-medium text-gray-300">將 AI 產生的 JSON 貼到下方</span>
                      </div>
                      <button
                        onClick={() => setShowExample(!showExample)}
                        className="text-[13px] text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors"
                      >
                        {showExample ? '隱藏範例' : '查看範例'}
                      </button>
                    </div>

                    {showExample && (
                      <div className="bg-gray-800/40 rounded-lg p-3 text-[13px] text-emerald-400 font-mono whitespace-pre-wrap border border-gray-700/30 leading-relaxed">
                        {config.example}
                      </div>
                    )}

                    <textarea
                      ref={textareaRef}
                      value={jsonText}
                      onChange={e => { setJsonText(e.target.value); setError(''); setSuccess(''); }}
                      placeholder='在此貼上 JSON...'
                      className="w-full h-40 bg-gray-800/60 border border-gray-700/50 rounded-lg p-3 text-[14px] font-mono text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-indigo-500/50 transition-colors leading-relaxed"
                    />

                    {error && (
                      <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 text-[13px] text-red-400 whitespace-pre-wrap">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-3 text-[14px] text-emerald-400 font-medium">
                        {success}
                      </div>
                    )}

                    <button
                      onClick={handleSubmit}
                      disabled={!jsonText.trim()}
                      className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 rounded-lg text-[14px] font-semibold text-white transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
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
