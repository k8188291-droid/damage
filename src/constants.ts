export const exampleData = JSON.stringify({
  "version": 2,
  "zones": [
    {
      "id": "zone-skill",
      "name": "技能倍率",
      "displayName": "技能倍率",
      "icon": "⚔️",
      "color": "#ef4444",
      "isDefault": true
    },
    {
      "id": "zone-dmg-bonus",
      "name": "增傷",
      "displayName": "增傷",
      "icon": "🔥",
      "color": "#f97316",
      "isDefault": true
    },
    {
      "id": "zone-vuln",
      "name": "易傷",
      "displayName": "易傷",
      "icon": "💀",
      "color": "#eab308",
      "isDefault": true
    },
    {
      "id": "zone-crit",
      "name": "暴擊",
      "displayName": "暴擊",
      "icon": "💥",
      "color": "#22c55e",
      "isDefault": true
    },
    {
      "id": "zone-stagger",
      "name": "失衡",
      "displayName": "失衡",
      "icon": "🌀",
      "color": "#06b6d4",
      "isDefault": true
    },
    {
      "id": "zone-resist",
      "name": "抗性",
      "displayName": "抗性",
      "icon": "🛡️",
      "color": "#3b82f6",
      "isDefault": true
    },
    {
      "id": "zone-fragile",
      "name": "脆弱",
      "displayName": "脆弱",
      "icon": "🔮",
      "color": "#8b5cf6",
      "isDefault": true
    },
    {
      "id": "zone-amp",
      "name": "增幅",
      "displayName": "增幅",
      "icon": "⚡",
      "color": "#ec4899",
      "isDefault": true
    },
    {
      "id": "5b7eff09-7aae-4b2d-9adb-1480267ef377",
      "name": "能力值",
      "displayName": "能力值",
      "icon": "⭐",
      "color": "#64748b",
      "isDefault": false
    },
    {
      "id": "68495fff-977e-4076-87b6-7c086f9c875c",
      "name": "攻",
      "displayName": "攻",
      "icon": "🗡️",
      "color": "#ec4899",
      "isDefault": false
    }
  ],
  "buffs": [
    {
      "id": "eba8b725-c617-421b-ad05-d0aa6b94a26c",
      "name": "能力值",
      "zoneId": "5b7eff09-7aae-4b2d-9adb-1480267ef377",
      "groupId": "2165f21b-ee56-4e18-a252-5e5ffe7672f4",
      "value": 398.4,
      "icon": "🌟",
      "enabled": true
    },
    {
      "id": "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
      "name": "(法)潔-大招",
      "zoneId": "zone-fragile",
      "groupId": "c4f7e0fa-61d2-4ce9-9d72-d8ee4b9fb0ec",
      "value": 42,
      "icon": "🍃",
      "enabled": true
    },
    {
      "id": "78b1caa3-da82-4277-ac78-1aaa90fe044c",
      "name": "(法)使命必達",
      "zoneId": "zone-dmg-bonus",
      "groupId": "c4f7e0fa-61d2-4ce9-9d72-d8ee4b9fb0ec",
      "value": 20,
      "icon": "🗡️",
      "enabled": true
    },
    {
      "id": "e93e91e0-7310-4966-8e95-399c194c8037",
      "name": "暴擊",
      "zoneId": "zone-crit",
      "groupId": "e0b61390-435d-43a9-9c59-ea02bce5263e",
      "value": 86.4,
      "icon": "💥",
      "enabled": true
    },
    {
      "id": "a4e064ae-3a6b-42ac-80fb-4075b8791311",
      "name": "大招暴擊提升",
      "zoneId": "zone-crit",
      "groupId": "b972f36f-c39d-4657-a344-564816454069",
      "value": 51.84,
      "icon": "🌟",
      "enabled": true
    },
    {
      "id": "c5047e12-173b-4e17-963d-a45b896be1fd",
      "name": "護手-終結技傷害加乘",
      "zoneId": "zone-dmg-bonus",
      "groupId": "b972f36f-c39d-4657-a344-564816454069",
      "value": 45,
      "icon": "🛡️",
      "enabled": false
    },
    {
      "id": "8d820226-2f54-4dba-8dd1-92804b0d6af1",
      "name": "長息",
      "zoneId": "zone-dmg-bonus",
      "groupId": "c4f7e0fa-61d2-4ce9-9d72-d8ee4b9fb0ec",
      "value": 16,
      "icon": "🔰",
      "enabled": true
    },
    {
      "id": "b727caec-35bd-4b35-9a2a-75fafa297707",
      "name": "(物/火)爪印",
      "zoneId": "zone-vuln",
      "groupId": "e0b61390-435d-43a9-9c59-ea02bce5263e",
      "value": 12,
      "icon": "🔮",
      "enabled": true
    },
    {
      "id": "bf69800c-c698-4c85-9573-449dae1c900e",
      "name": "(物/火)狼之緋-疊滿",
      "zoneId": "zone-dmg-bonus",
      "groupId": "822cf98b-a3f3-4618-8f78-37369f3626f2",
      "value": 64,
      "icon": "🗡️",
      "enabled": true
    },
    {
      "id": "d5294369-fbe1-4747-8d0a-14575af852fb",
      "name": "(物/火)狼之緋-滿-疊滿",
      "zoneId": "zone-dmg-bonus",
      "groupId": "fb8206a6-8548-4444-b6ad-d33b2b0daccb",
      "value": 112,
      "icon": "🗡️",
      "enabled": true
    },
    {
      "id": "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
      "name": "狼之緋",
      "zoneId": "68495fff-977e-4076-87b6-7c086f9c875c",
      "groupId": "822cf98b-a3f3-4618-8f78-37369f3626f2",
      "value": 25.6,
      "icon": "🗡️",
      "enabled": true
    },
    {
      "id": "4e4ee622-63a9-4980-9e61-c74289289ca5",
      "name": "套裝攻擊",
      "zoneId": "68495fff-977e-4076-87b6-7c086f9c875c",
      "groupId": "822cf98b-a3f3-4618-8f78-37369f3626f2",
      "value": 25,
      "icon": "🛡️",
      "enabled": true
    },
    {
      "id": "cb571a20-6b38-4b68-950a-bd88f6a93406",
      "name": "狼之緋-滿",
      "zoneId": "68495fff-977e-4076-87b6-7c086f9c875c",
      "groupId": "fb8206a6-8548-4444-b6ad-d33b2b0daccb",
      "value": 44.8,
      "icon": "🌟",
      "enabled": true
    }
  ],
  "buffGroups": [
    {
      "id": "2165f21b-ee56-4e18-a252-5e5ffe7672f4",
      "name": "能力值",
      "color": "#3b82f6"
    },
    {
      "id": "c4f7e0fa-61d2-4ce9-9d72-d8ee4b9fb0ec",
      "name": "潔",
      "color": "#14b8a6"
    },
    {
      "id": "e0b61390-435d-43a9-9c59-ea02bce5263e",
      "name": "洛",
      "color": "#f43f5e"
    },
    {
      "id": "b972f36f-c39d-4657-a344-564816454069",
      "name": "洛大招",
      "color": "#ec4899"
    },
    {
      "id": "822cf98b-a3f3-4618-8f78-37369f3626f2",
      "name": "洛武器&裝備",
      "color": "#06b6d4"
    },
    {
      "id": "fb8206a6-8548-4444-b6ad-d33b2b0daccb",
      "name": "滿潛-武器",
      "color": "#3b82f6"
    }
  ],
  "characters": [
    {
      "id": "9c30c6f6-5ea1-4111-bb09-8bb18545b65e",
      "name": "洛西",
      "baseAttack": 828,
      "weaponAttack": 0,
      "attackPercentBonus": 0
    },
    {
      "id": "743b25d3-f2fc-4bb3-9727-9ab01475c470",
      "name": "註: 當前沒有啟用護手終結技增傷，底下可以自己開啟",
      "baseAttack": 0,
      "weaponAttack": 0,
      "attackPercentBonus": 0
    },
    {
      "id": "c87c9d40-fe43-4a01-9be9-d63f89f821dc",
      "name": "註: 目前結果與excel相同",
      "baseAttack": 0,
      "weaponAttack": 0,
      "attackPercentBonus": 0
    }
  ],
  "skills": [
    {
      "id": "ce93e7ba-a71e-4f3f-81d4-5579d3ea454a",
      "name": "戰技1",
      "characterId": "9c30c6f6-5ea1-4111-bb09-8bb18545b65e",
      "skillMultiplier": 192,
      "enabledBuffIds": [
        "eba8b725-c617-421b-ad05-d0aa6b94a26c",
        "b727caec-35bd-4b35-9a2a-75fafa297707",
        "bf69800c-c698-4c85-9573-449dae1c900e",
        "e93e91e0-7310-4966-8e95-399c194c8037",
        "8d820226-2f54-4dba-8dd1-92804b0d6af1",
        "4e4ee622-63a9-4980-9e61-c74289289ca5",
        "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
        "d5294369-fbe1-4747-8d0a-14575af852fb",
        "cb571a20-6b38-4b68-950a-bd88f6a93406"
      ],
      "order": 1,
      "groupId": "61742a3d-74fb-4f10-915f-a0f50efcd3da"
    },
    {
      "id": "0dd1eccf-b9c1-4837-8950-47010fd21b6e",
      "name": "戰技2",
      "characterId": "9c30c6f6-5ea1-4111-bb09-8bb18545b65e",
      "skillMultiplier": 288,
      "enabledBuffIds": [
        "eba8b725-c617-421b-ad05-d0aa6b94a26c",
        "e93e91e0-7310-4966-8e95-399c194c8037",
        "b727caec-35bd-4b35-9a2a-75fafa297707",
        "bf69800c-c698-4c85-9573-449dae1c900e",
        "78b1caa3-da82-4277-ac78-1aaa90fe044c",
        "8d820226-2f54-4dba-8dd1-92804b0d6af1",
        "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
        "4e4ee622-63a9-4980-9e61-c74289289ca5",
        "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
        "cb571a20-6b38-4b68-950a-bd88f6a93406",
        "d5294369-fbe1-4747-8d0a-14575af852fb"
      ],
      "order": 4,
      "groupId": "81282e45-a192-4c8d-a9b1-8afe1ce14147"
    },
    {
      "id": "efae40cf-ee71-4f53-8aa4-659e21c217c2",
      "name": "處決",
      "characterId": "9c30c6f6-5ea1-4111-bb09-8bb18545b65e",
      "skillMultiplier": 900,
      "enabledBuffIds": [
        "eba8b725-c617-421b-ad05-d0aa6b94a26c",
        "b727caec-35bd-4b35-9a2a-75fafa297707",
        "bf69800c-c698-4c85-9573-449dae1c900e",
        "e93e91e0-7310-4966-8e95-399c194c8037",
        "8d820226-2f54-4dba-8dd1-92804b0d6af1",
        "4e4ee622-63a9-4980-9e61-c74289289ca5",
        "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
        "d5294369-fbe1-4747-8d0a-14575af852fb",
        "cb571a20-6b38-4b68-950a-bd88f6a93406"
      ],
      "order": 5,
      "groupId": "61742a3d-74fb-4f10-915f-a0f50efcd3da"
    },
    {
      "id": "a2281919-de6b-4889-ba97-75dbad18538b",
      "name": "連攜",
      "characterId": "9c30c6f6-5ea1-4111-bb09-8bb18545b65e",
      "skillMultiplier": 630,
      "enabledBuffIds": [
        "eba8b725-c617-421b-ad05-d0aa6b94a26c",
        "e93e91e0-7310-4966-8e95-399c194c8037",
        "b727caec-35bd-4b35-9a2a-75fafa297707",
        "bf69800c-c698-4c85-9573-449dae1c900e",
        "8d820226-2f54-4dba-8dd1-92804b0d6af1",
        "4e4ee622-63a9-4980-9e61-c74289289ca5",
        "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
        "d5294369-fbe1-4747-8d0a-14575af852fb",
        "cb571a20-6b38-4b68-950a-bd88f6a93406"
      ],
      "order": 2,
      "groupId": "61742a3d-74fb-4f10-915f-a0f50efcd3da"
    },
    {
      "id": "05095b04-00c5-4724-81f7-828b6c621b86",
      "name": "天賦",
      "characterId": "9c30c6f6-5ea1-4111-bb09-8bb18545b65e",
      "skillMultiplier": 24,
      "enabledBuffIds": [
        "eba8b725-c617-421b-ad05-d0aa6b94a26c",
        "b727caec-35bd-4b35-9a2a-75fafa297707",
        "bf69800c-c698-4c85-9573-449dae1c900e",
        "e93e91e0-7310-4966-8e95-399c194c8037",
        "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
        "78b1caa3-da82-4277-ac78-1aaa90fe044c",
        "8d820226-2f54-4dba-8dd1-92804b0d6af1",
        "4e4ee622-63a9-4980-9e61-c74289289ca5",
        "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
        "d5294369-fbe1-4747-8d0a-14575af852fb",
        "cb571a20-6b38-4b68-950a-bd88f6a93406"
      ],
      "order": 6,
      "groupId": "81282e45-a192-4c8d-a9b1-8afe1ce14147"
    },
    {
      "id": "a2b7f637-1e6e-427a-84f8-077476a962a2",
      "name": "暖機面板",
      "characterId": "9c30c6f6-5ea1-4111-bb09-8bb18545b65e",
      "skillMultiplier": 100,
      "enabledBuffIds": [
        "eba8b725-c617-421b-ad05-d0aa6b94a26c",
        "4e4ee622-63a9-4980-9e61-c74289289ca5",
        "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
      ],
      "order": 6,
      "groupId": "c40fe567-d28a-469f-90c0-b7c5033c148b"
    },
    {
      "id": "a666c340-d1bb-43fc-8750-baf29e158f9a",
      "name": "大招",
      "characterId": "9c30c6f6-5ea1-4111-bb09-8bb18545b65e",
      "skillMultiplier": 1600,
      "enabledBuffIds": [
        "699a678f-9c9c-4ff9-8db0-a39028473180",
        "b2a5a941-a978-4b45-be70-1dbb299335d1",
        "aafb1d7a-88a9-44ca-88c0-3911f54560cc",
        "eba8b725-c617-421b-ad05-d0aa6b94a26c",
        "e93e91e0-7310-4966-8e95-399c194c8037",
        "bf69800c-c698-4c85-9573-449dae1c900e",
        "b727caec-35bd-4b35-9a2a-75fafa297707",
        "dd373cf9-5dc3-4bd3-a6b5-99077de01219",
        "a4e064ae-3a6b-42ac-80fb-4075b8791311",
        "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
        "78b1caa3-da82-4277-ac78-1aaa90fe044c",
        "8d820226-2f54-4dba-8dd1-92804b0d6af1",
        "c5047e12-173b-4e17-963d-a45b896be1fd",
        "4e4ee622-63a9-4980-9e61-c74289289ca5",
        "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
        "d5294369-fbe1-4747-8d0a-14575af852fb",
        "cb571a20-6b38-4b68-950a-bd88f6a93406"
      ],
      "order": 0,
      "groupId": "81282e45-a192-4c8d-a9b1-8afe1ce14147"
    }
  ],
  "skillGroups": [
    {
      "id": "c40fe567-d28a-469f-90c0-b7c5033c148b",
      "name": "暖機面板",
      "color": "#ec4899"
    },
    {
      "id": "81282e45-a192-4c8d-a9b1-8afe1ce14147",
      "name": "法傷",
      "color": "#06b6d4"
    },
    {
      "id": "61742a3d-74fb-4f10-915f-a0f50efcd3da",
      "name": "物傷",
      "color": "#eab308"
    }
  ],
  "rotationGroups": [
    {
      "id": "0bba8639-552c-442d-8eee-f38a4720fa53",
      "name": "暖機面板",
      "entries": [
        {
          "id": "f1ebb5e4-8996-477e-b9db-c556c64b88e7",
          "skillId": "a2b7f637-1e6e-427a-84f8-077476a962a2",
          "count": 1,
          "disabledBuffIds": []
        }
      ],
      "disabledBuffIds": [
        "a4e064ae-3a6b-42ac-80fb-4075b8791311",
        "d5294369-fbe1-4747-8d0a-14575af852fb",
        "78b1caa3-da82-4277-ac78-1aaa90fe044c",
        "bf69800c-c698-4c85-9573-449dae1c900e",
        "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
        "b727caec-35bd-4b35-9a2a-75fafa297707",
        "cb571a20-6b38-4b68-950a-bd88f6a93406",
        "8d820226-2f54-4dba-8dd1-92804b0d6af1",
        "e93e91e0-7310-4966-8e95-399c194c8037"
      ]
    },
    {
      "id": "83897f34-79b4-4db0-970e-c42169abc06f",
      "name": "總傷-0潛專-無拐",
      "entries": [
        {
          "id": "2f43a322-a168-4c0d-b1e9-db341c8dfc98",
          "skillId": "a666c340-d1bb-43fc-8750-baf29e158f9a",
          "count": 1,
          "disabledBuffIds": [
            "78b1caa3-da82-4277-ac78-1aaa90fe044c",
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "d5294369-fbe1-4747-8d0a-14575af852fb",
            "cb571a20-6b38-4b68-950a-bd88f6a93406",
            "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc"
          ]
        },
        {
          "id": "ad13eaf1-35dc-437e-a40d-0e4d80372cf2",
          "skillId": "05095b04-00c5-4724-81f7-828b6c621b86",
          "count": 32.832,
          "disabledBuffIds": [
            "78b1caa3-da82-4277-ac78-1aaa90fe044c",
            "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "d5294369-fbe1-4747-8d0a-14575af852fb",
            "cb571a20-6b38-4b68-950a-bd88f6a93406"
          ]
        },
        {
          "id": "c1bc2af5-d19c-4841-b21e-d7ba7fc4da73",
          "skillId": "ce93e7ba-a71e-4f3f-81d4-5579d3ea454a",
          "count": 2,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "cb571a20-6b38-4b68-950a-bd88f6a93406",
            "d5294369-fbe1-4747-8d0a-14575af852fb"
          ]
        },
        {
          "id": "e4e17503-a4a5-4bcb-9d90-717b916b7e0e",
          "skillId": "0dd1eccf-b9c1-4837-8950-47010fd21b6e",
          "count": 2,
          "disabledBuffIds": []
        },
        {
          "id": "57fd46f6-a84e-42d8-8d6d-f56c8f0b0212",
          "skillId": "a2281919-de6b-4889-ba97-75dbad18538b",
          "count": 3,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "cb571a20-6b38-4b68-950a-bd88f6a93406",
            "d5294369-fbe1-4747-8d0a-14575af852fb"
          ]
        },
        {
          "id": "be370bb9-9cd4-42bf-8a6b-29a6763a29b0",
          "skillId": "efae40cf-ee71-4f53-8aa4-659e21c217c2",
          "count": 1,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "cb571a20-6b38-4b68-950a-bd88f6a93406",
            "d5294369-fbe1-4747-8d0a-14575af852fb"
          ]
        }
      ],
      "disabledBuffIds": [
        "8d820226-2f54-4dba-8dd1-92804b0d6af1",
        "78b1caa3-da82-4277-ac78-1aaa90fe044c",
        "d5294369-fbe1-4747-8d0a-14575af852fb",
        "cb571a20-6b38-4b68-950a-bd88f6a93406",
        "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc"
      ]
    },
    {
      "id": "09b99093-bbdb-4384-8f75-6c3782f99fe3",
      "name": "總傷-滿潛專-無拐",
      "entries": [
        {
          "id": "a910d4b6-a6c6-46ef-8fdd-e3a2da584f50",
          "skillId": "a666c340-d1bb-43fc-8750-baf29e158f9a",
          "count": 1,
          "disabledBuffIds": [
            "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
            "78b1caa3-da82-4277-ac78-1aaa90fe044c",
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
            "bf69800c-c698-4c85-9573-449dae1c900e"
          ]
        },
        {
          "id": "50519f23-37b4-432e-a0b5-d2931dc09287",
          "skillId": "05095b04-00c5-4724-81f7-828b6c621b86",
          "count": 32.832,
          "disabledBuffIds": [
            "78b1caa3-da82-4277-ac78-1aaa90fe044c",
            "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
          ]
        },
        {
          "id": "83d2ac3f-755a-44e5-a6d8-90148256efb7",
          "skillId": "ce93e7ba-a71e-4f3f-81d4-5579d3ea454a",
          "count": 2,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
          ]
        },
        {
          "id": "b11c9717-c9f2-43a2-baa1-7ff53fcf455b",
          "skillId": "0dd1eccf-b9c1-4837-8950-47010fd21b6e",
          "count": 2,
          "disabledBuffIds": []
        },
        {
          "id": "20c3d913-a2e3-49ce-a941-f69ef28a41f1",
          "skillId": "a2281919-de6b-4889-ba97-75dbad18538b",
          "count": 3,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
          ]
        },
        {
          "id": "118475e4-9bfa-46c9-bc28-671aeec69b35",
          "skillId": "efae40cf-ee71-4f53-8aa4-659e21c217c2",
          "count": 1,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
          ]
        }
      ],
      "disabledBuffIds": [
        "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
        "78b1caa3-da82-4277-ac78-1aaa90fe044c",
        "8d820226-2f54-4dba-8dd1-92804b0d6af1",
        "bf69800c-c698-4c85-9573-449dae1c900e",
        "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
      ]
    },
    {
      "id": "c6be085b-3419-4b87-a598-854b4ab29ca9",
      "name": "總傷-0潛專-潔拐",
      "entries": [
        {
          "id": "1576dbe2-9f90-426a-8826-4f6385729613",
          "skillId": "a666c340-d1bb-43fc-8750-baf29e158f9a",
          "count": 1,
          "disabledBuffIds": [
            "d5294369-fbe1-4747-8d0a-14575af852fb",
            "cb571a20-6b38-4b68-950a-bd88f6a93406"
          ]
        },
        {
          "id": "910e3a52-a1c2-48ba-bffc-4b591b46bc7a",
          "skillId": "05095b04-00c5-4724-81f7-828b6c621b86",
          "count": 32.832,
          "disabledBuffIds": [
            "d5294369-fbe1-4747-8d0a-14575af852fb",
            "cb571a20-6b38-4b68-950a-bd88f6a93406"
          ]
        },
        {
          "id": "772fc7ba-010c-4499-ab0f-520983f1799e",
          "skillId": "efae40cf-ee71-4f53-8aa4-659e21c217c2",
          "count": 1,
          "disabledBuffIds": [
            "d5294369-fbe1-4747-8d0a-14575af852fb",
            "cb571a20-6b38-4b68-950a-bd88f6a93406"
          ]
        },
        {
          "id": "d67f8f1d-373c-49a5-aa51-2d3e87c789fc",
          "skillId": "ce93e7ba-a71e-4f3f-81d4-5579d3ea454a",
          "count": 2,
          "disabledBuffIds": [
            "cb571a20-6b38-4b68-950a-bd88f6a93406",
            "d5294369-fbe1-4747-8d0a-14575af852fb"
          ]
        },
        {
          "id": "97a20ee7-48cc-4b8b-9e42-4ff2777a3fa5",
          "skillId": "0dd1eccf-b9c1-4837-8950-47010fd21b6e",
          "count": 2,
          "disabledBuffIds": []
        },
        {
          "id": "f3b22f47-14aa-4f76-8f75-78e2fb161486",
          "skillId": "a2281919-de6b-4889-ba97-75dbad18538b",
          "count": 3,
          "disabledBuffIds": [
            "cb571a20-6b38-4b68-950a-bd88f6a93406",
            "d5294369-fbe1-4747-8d0a-14575af852fb"
          ]
        }
      ],
      "disabledBuffIds": [
        "cb571a20-6b38-4b68-950a-bd88f6a93406",
        "d5294369-fbe1-4747-8d0a-14575af852fb"
      ]
    },
    {
      "id": "c8e40f04-2887-4309-9002-0f35efe40c09",
      "name": "總傷-滿潛專-潔拐",
      "entries": [
        {
          "id": "7b7338b5-96c3-44b2-b5c1-ed883a7bb5df",
          "skillId": "a666c340-d1bb-43fc-8750-baf29e158f9a",
          "count": 1,
          "disabledBuffIds": [
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
          ]
        },
        {
          "id": "4f0ee42d-0367-41a8-8238-061afed14426",
          "skillId": "05095b04-00c5-4724-81f7-828b6c621b86",
          "count": 32.832,
          "disabledBuffIds": [
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
          ]
        },
        {
          "id": "5d015225-2a4d-4347-bfb9-e8fd79b1c573",
          "skillId": "efae40cf-ee71-4f53-8aa4-659e21c217c2",
          "count": 1,
          "disabledBuffIds": [
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
            "bf69800c-c698-4c85-9573-449dae1c900e"
          ]
        },
        {
          "id": "ceb8be0b-553c-424c-9c18-d6d4ded65e29",
          "skillId": "ce93e7ba-a71e-4f3f-81d4-5579d3ea454a",
          "count": 2,
          "disabledBuffIds": [
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
          ]
        },
        {
          "id": "5eacdb45-ca6c-40d9-a730-3a2704b86de8",
          "skillId": "0dd1eccf-b9c1-4837-8950-47010fd21b6e",
          "count": 2,
          "disabledBuffIds": []
        },
        {
          "id": "8c6bbb92-3f2f-41af-a56c-9bf71c35eb0a",
          "skillId": "a2281919-de6b-4889-ba97-75dbad18538b",
          "count": 3,
          "disabledBuffIds": [
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
          ]
        }
      ],
      "disabledBuffIds": [
        "bf69800c-c698-4c85-9573-449dae1c900e",
        "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
      ]
    }
  ],
  "calcRows": [
    {
      "id": "2a4c4c9b-d917-4839-a94b-85cbd578e956",
      "name": "暴擊率",
      "formula": "0.864"
    },
    {
      "id": "55468d54-6584-43e2-82c5-96755cfc901f",
      "name": "期望暴擊次數",
      "formula": ""
    },
    {
      "id": "1878389b-7882-4fcd-880f-9cfa1076c208",
      "name": "1大1處3攜2戰",
      "formula": "38 * 0.864"
    },
    {
      "id": "6afd613b-e121-4759-92bd-489750a6d114",
      "name": "1大",
      "formula": "27 * 0.864"
    },
    {
      "id": "3803abc9-4523-4ce6-ab30-90f9e1154d35",
      "name": "暴擊乘區",
      "formula": "(2 * 0.864) + (1 - 0.864)"
    },
    {
      "id": "12f681f3-fc9f-44f9-8d46-370ae8b21d28",
      "name": "大招暴擊提升",
      "formula": "(0.6 * 0.864)"
    }
  ]
})