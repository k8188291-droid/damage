# Damage Calculator — AI Agent Overview

## Purpose

This is a browser-based **game damage calculation and rotation analysis tool** written in React + TypeScript. It helps users model skill rotations, apply buff stacking, and compare total damage output across different configurations — targeting Chinese-speaking players of action RPGs (e.g. Honkai: Star Rail-style games).

Deployed at base path `/damage/`.

---

## Core Domain Model

### Damage Formula

```
finalDamage = attackPower
            × (skillMultiplier / 100)
            × (1 + dmgBonus% / 100)
            × (1 + vulnerability% / 100)
            × (1 + critDmg% / 100)
            × (1 + stagger% / 100)
            × (1 + resist% / 100)
            × (1 + fragile% / 100)
            × (1 + amplify% / 100)

attackPower = (baseAttack + weaponAttack) × (1 + attackPercentBonus / 100)
```

Each damage zone multiplies independently. The `zone-skill` zone uses `value / 100` directly (not `1 + value/100`).

### Key Entities

| Entity | Description |
|--------|-------------|
| `DamageZone` | A multiplicative damage category (8 defaults: skill, dmgBonus, vuln, crit, stagger, resist, fragile, amp) |
| `Buff` | A named modifier assigned to one zone; has a numeric `value` (%) and a global `enabled` toggle |
| `BuffGroup` | Optional grouping/coloring for buffs |
| `Character` | Holds `baseAttack`, `weaponAttack`, `attackPercentBonus` |
| `Skill` | References a character; has `skillMultiplier` (%); declares which buff IDs it uses via `enabledBuffIds` |
| `SkillGroup` | Optional grouping for skills |
| `RotationEntry` | One skill in a rotation: `skillId`, `count` (executions), `disabledBuffIds` (entry-level overrides) |
| `RotationGroup` | A sequence of `RotationEntry` items; has its own `disabledBuffIds` (cycle-level overrides) |
| `Tab` | An independent workspace containing a full `AppData` snapshot |
| `Preset` | A named, timestamped `AppData` snapshot for reuse |
| `CalcRow` | A row in the floating calculator with a custom formula string |

### Buff Activation Rules

A buff is active for a given skill execution if ALL of the following are true:
1. `buff.enabled === true` (global toggle)
2. `skill.enabledBuffIds.includes(buff.id)` (skill-level opt-in)
3. `!cycleDisabledBuffIds.includes(buff.id)` (rotation-group override)
4. `!entryDisabledBuffIds.includes(buff.id)` (per-entry override)

---

## Architecture

### Stack

- **React 19** + **TypeScript 5** + **Vite 8**
- **Tailwind CSS 4** for styling
- **@dnd-kit** for drag-and-drop (rotation entries, preset reordering)
- **localStorage** for persistence via `useLocalStorage` hook
- **UUID** for entity IDs

### File Structure

```
src/
├── main.tsx                  # Entry point
├── App.tsx                   # Root state: tabs, presets, working data, undo, layout
├── constants.ts              # Large example dataset (demo import)
├── types/index.ts            # All TypeScript interfaces + DEFAULT_ZONES
├── utils/damage.ts           # calculateAttackPower / calculateSkillDamage / calculateRotationGroup
├── hooks/useLocalStorage.ts  # Persistent state hook
├── migrations/
│   ├── index.ts              # Version routing
│   └── v1_to_v2.ts          # Adds groupId to buffs/skills, disabledBuffIds to rotations
└── components/
    ├── TabBar.tsx            # Tab CRUD
    ├── CharacterSection.tsx  # Character management
    ├── BuffSection.tsx       # Buff + zone management
    ├── SkillSection.tsx      # Skill management
    ├── RotationSection.tsx   # Rotation group list (left panel)
    ├── CycleEditor.tsx       # Rotation entry editor (center panel)
    ├── CycleBuffBar.tsx      # Cycle-level buff toggles
    ├── AnalysisPanel.tsx     # Damage comparison (right panel)
    ├── CalcPanel.tsx         # Floating calculator
    ├── PresetSection.tsx     # Preset management
    ├── ImportExport.tsx      # JSON import/export
    ├── ConfirmDialog.tsx     # Reusable confirm modal
    ├── Modal.tsx             # Generic modal wrapper
    ├── ui.tsx                # Tooltip component
    └── IconSidebar.tsx       # Left icon sidebar
```

### State Flow

```
localStorage
    └── tabs[]  (Tab[])
    └── presets[] (Preset[])
         │
         ▼
    App.tsx (working state)
         │
         ├── CharacterSection / BuffSection / SkillSection / RotationSection
         │       (left panel — mutate working state)
         │
         ├── CycleEditor
         │       (center — edit selected RotationGroup entries)
         │
         └── AnalysisPanel
                 (right — read-only calculated results)
```

Working state is written back to the active tab on every change. Tab switch saves current tab and loads the selected tab's data.

### Migration Strategy

- `AppData.version` field tracks schema version
- Current version: `2`
- v1 → v2: adds `groupId` (empty string) to all buffs and skills; adds `disabledBuffIds: []` to all rotation groups

---

## UI Layout

- **Three-column layout**: left panel (config) | center (cycle editor) | right panel (analysis)
- Left and right panels are resizable via drag handles
- On narrow screens both panels collapse to overlay mode
- Left sidebar: icon buttons toggle visibility of each config section
- Undo system: toast at bottom of screen, 5-second auto-dismiss, single-level undo

---

## Data Persistence

- All state lives in `localStorage` under two keys
- Import/export via JSON (full `AppData` object)
- No server-side storage; fully client-side

---

## Internationalization

- UI language: **Traditional Chinese**
- Zone names, labels, and tooltips are all in Chinese
- No i18n framework — strings are hardcoded in components

---

## Notable Constraints

- No authentication or multi-user support
- No server; purely static SPA
- Buff zone list is editable but defaults are fixed system zones
- Damage formula assumes all zones multiply independently (no additive cross-zone interactions)
- `zone-skill` (技能倍率) is the only zone computed as `value/100` rather than `1 + value/100`
