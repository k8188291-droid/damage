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
      "id": "3731c421-5221-40bb-9867-249d6fefcb17",
      "name": "扶搖能力值",
      "zoneId": "5b7eff09-7aae-4b2d-9adb-1480267ef377",
      "groupId": "2165f21b-ee56-4e18-a252-5e5ffe7672f4",
      "value": -12,
      "icon": "🌟",
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
      "value": 58.5,
      "icon": "🛡️",
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
      "id": "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
      "name": "狼之緋",
      "zoneId": "68495fff-977e-4076-87b6-7c086f9c875c",
      "groupId": "822cf98b-a3f3-4618-8f78-37369f3626f2",
      "value": 25.6,
      "icon": "🗡️",
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
      "id": "4f0042b4-b722-424a-80f0-839d5fb6a67f",
      "name": "(物/火)狼之緋-疊滿 打8折",
      "zoneId": "zone-dmg-bonus",
      "groupId": "822cf98b-a3f3-4618-8f78-37369f3626f2",
      "value": 51.2,
      "icon": "🗡️",
      "enabled": true
    },
    {
      "id": "cb571a20-6b38-4b68-950a-bd88f6a93406",
      "name": "狼之緋-滿",
      "zoneId": "68495fff-977e-4076-87b6-7c086f9c875c",
      "groupId": "fb8206a6-8548-4444-b6ad-d33b2b0daccb",
      "value": 44.8,
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
      "id": "4154376a-a4b2-45b1-b8a3-22bde49465ac",
      "name": "(物/火)狼之緋-滿-疊滿 打8折",
      "zoneId": "zone-dmg-bonus",
      "groupId": "fb8206a6-8548-4444-b6ad-d33b2b0daccb",
      "value": 89.6,
      "icon": "🗡️",
      "enabled": true
    },
    {
      "id": "0bfcaad3-b996-4784-96c9-def36179cfa1",
      "name": "天賦必定爆擊",
      "zoneId": "zone-crit",
      "groupId": "e0b61390-435d-43a9-9c59-ea02bce5263e",
      "value": 13.6,
      "icon": "💥",
      "enabled": false
    },
    {
      "id": "4e4ee622-63a9-4980-9e61-c74289289ca5",
      "name": "套裝攻擊",
      "zoneId": "68495fff-977e-4076-87b6-7c086f9c875c",
      "groupId": "e0b61390-435d-43a9-9c59-ea02bce5263e",
      "value": 25,
      "icon": "🛡️",
      "enabled": true
    },
    {
      "id": "9f90b2d9-ae25-4ca8-aec5-23fe24d3315f",
      "name": "(大招)光榮記憶-疊滿",
      "zoneId": "zone-dmg-bonus",
      "groupId": "2b1e4f52-3974-4131-9c20-1c2f341b77ff",
      "value": 57.6,
      "icon": "🗡️",
      "enabled": true
    },
    {
      "id": "f8ee182b-a1b9-4a85-9643-ebbbf167d635",
      "name": "光榮記憶",
      "zoneId": "68495fff-977e-4076-87b6-7c086f9c875c",
      "groupId": "2b1e4f52-3974-4131-9c20-1c2f341b77ff",
      "value": 11.2,
      "icon": "🗡️",
      "enabled": true
    },
    {
      "id": "3ba1d874-0dbe-4327-b480-23d39c7c4319",
      "name": "(大招)光榮記憶-滿-疊滿",
      "zoneId": "zone-dmg-bonus",
      "groupId": "12037cc5-3a7b-48b8-b3c6-283d4b4ce5be",
      "value": 100.8,
      "icon": "🗡️",
      "enabled": true
    },
    {
      "id": "cefc8dca-4c7f-4f00-921a-914b411d84ce",
      "name": "光榮記憶-滿",
      "zoneId": "68495fff-977e-4076-87b6-7c086f9c875c",
      "groupId": "12037cc5-3a7b-48b8-b3c6-283d4b4ce5be",
      "value": 19.6,
      "icon": "🗡️",
      "enabled": true
    },
    {
      "id": "d6f9dca6-d60f-4a98-b7f0-cd6101656683",
      "name": "(戰技/終結技)(物)",
      "zoneId": "zone-dmg-bonus",
      "groupId": "150e6739-510a-4065-b7cf-098233b94a74",
      "value": 24,
      "icon": "🗡️",
      "enabled": true
    },
    {
      "id": "ff8c92e7-17b6-437f-96f1-f1423284209f",
      "name": "失衡增傷",
      "zoneId": "zone-dmg-bonus",
      "groupId": "150e6739-510a-4065-b7cf-098233b94a74",
      "value": 56,
      "icon": "🗡️",
      "enabled": true
    },
    {
      "id": "a944ee52-ffa7-42ae-a9aa-21fa5c355b94",
      "name": "(戰技/終結技)(物)-滿",
      "zoneId": "zone-dmg-bonus",
      "groupId": "86b3300e-d67e-4faf-9b2d-a8bd74fbb95c",
      "value": 42,
      "icon": "🗡️",
      "enabled": true
    },
    {
      "id": "228c4b6c-2ccc-4ee0-aa48-11e215e67d0a",
      "name": "失衡增傷-滿",
      "zoneId": "zone-dmg-bonus",
      "groupId": "86b3300e-d67e-4faf-9b2d-a8bd74fbb95c",
      "value": 98,
      "icon": "🗡️",
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
      "name": "狼之緋",
      "color": "#f97316"
    },
    {
      "id": "fb8206a6-8548-4444-b6ad-d33b2b0daccb",
      "name": "滿潛-狼之緋",
      "color": "#eab308"
    },
    {
      "id": "2b1e4f52-3974-4131-9c20-1c2f341b77ff",
      "name": "光榮記憶",
      "color": "#8b5cf6"
    },
    {
      "id": "12037cc5-3a7b-48b8-b3c6-283d4b4ce5be",
      "name": "滿潛-光榮記憶",
      "color": "#a855f7"
    },
    {
      "id": "150e6739-510a-4065-b7cf-098233b94a74",
      "name": "扶搖",
      "color": "#22c55e"
    },
    {
      "id": "86b3300e-d67e-4faf-9b2d-a8bd74fbb95c",
      "name": "滿潛-扶搖",
      "color": "#14b8a6"
    }
  ],
  "characters": [
    {
      "id": "9c30c6f6-5ea1-4111-bb09-8bb18545b65e",
      "name": "洛西",
      "baseAttack": 828,
      "weaponAttack": 0,
      "attackPercentBonus": 0
    }
  ],
  "skills": [
    {
      "id": "ce93e7ba-a71e-4f3f-81d4-5579d3ea454a",
      "name": "戰技-物傷",
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
        "cb571a20-6b38-4b68-950a-bd88f6a93406",
        "cefc8dca-4c7f-4f00-921a-914b411d84ce",
        "f8ee182b-a1b9-4a85-9643-ebbbf167d635",
        "d6f9dca6-d60f-4a98-b7f0-cd6101656683",
        "a944ee52-ffa7-42ae-a9aa-21fa5c355b94",
        "ff8c92e7-17b6-437f-96f1-f1423284209f",
        "228c4b6c-2ccc-4ee0-aa48-11e215e67d0a",
        "3731c421-5221-40bb-9867-249d6fefcb17",
        "4f0042b4-b722-424a-80f0-839d5fb6a67f",
        "4154376a-a4b2-45b1-b8a3-22bde49465ac"
      ],
      "order": 1,
      "groupId": "61742a3d-74fb-4f10-915f-a0f50efcd3da"
    },
    {
      "id": "0dd1eccf-b9c1-4837-8950-47010fd21b6e",
      "name": "戰技-法傷",
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
        "d5294369-fbe1-4747-8d0a-14575af852fb",
        "cefc8dca-4c7f-4f00-921a-914b411d84ce",
        "f8ee182b-a1b9-4a85-9643-ebbbf167d635",
        "ff8c92e7-17b6-437f-96f1-f1423284209f",
        "228c4b6c-2ccc-4ee0-aa48-11e215e67d0a",
        "3731c421-5221-40bb-9867-249d6fefcb17",
        "4f0042b4-b722-424a-80f0-839d5fb6a67f",
        "4154376a-a4b2-45b1-b8a3-22bde49465ac"
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
        "cb571a20-6b38-4b68-950a-bd88f6a93406",
        "cefc8dca-4c7f-4f00-921a-914b411d84ce",
        "f8ee182b-a1b9-4a85-9643-ebbbf167d635",
        "ff8c92e7-17b6-437f-96f1-f1423284209f",
        "228c4b6c-2ccc-4ee0-aa48-11e215e67d0a",
        "3731c421-5221-40bb-9867-249d6fefcb17",
        "4f0042b4-b722-424a-80f0-839d5fb6a67f",
        "4154376a-a4b2-45b1-b8a3-22bde49465ac"
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
        "cb571a20-6b38-4b68-950a-bd88f6a93406",
        "cefc8dca-4c7f-4f00-921a-914b411d84ce",
        "f8ee182b-a1b9-4a85-9643-ebbbf167d635",
        "ff8c92e7-17b6-437f-96f1-f1423284209f",
        "228c4b6c-2ccc-4ee0-aa48-11e215e67d0a",
        "3731c421-5221-40bb-9867-249d6fefcb17",
        "4f0042b4-b722-424a-80f0-839d5fb6a67f",
        "4154376a-a4b2-45b1-b8a3-22bde49465ac"
      ],
      "order": 2,
      "groupId": "61742a3d-74fb-4f10-915f-a0f50efcd3da"
    },
    {
      "id": "05095b04-00c5-4724-81f7-828b6c621b86",
      "name": "天賦-沸血",
      "characterId": "9c30c6f6-5ea1-4111-bb09-8bb18545b65e",
      "skillMultiplier": 24,
      "enabledBuffIds": [
        "eba8b725-c617-421b-ad05-d0aa6b94a26c",
        "b727caec-35bd-4b35-9a2a-75fafa297707",
        "bf69800c-c698-4c85-9573-449dae1c900e",
        "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
        "78b1caa3-da82-4277-ac78-1aaa90fe044c",
        "8d820226-2f54-4dba-8dd1-92804b0d6af1",
        "4e4ee622-63a9-4980-9e61-c74289289ca5",
        "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
        "d5294369-fbe1-4747-8d0a-14575af852fb",
        "cb571a20-6b38-4b68-950a-bd88f6a93406",
        "cefc8dca-4c7f-4f00-921a-914b411d84ce",
        "f8ee182b-a1b9-4a85-9643-ebbbf167d635",
        "e93e91e0-7310-4966-8e95-399c194c8037",
        "0bfcaad3-b996-4784-96c9-def36179cfa1",
        "ff8c92e7-17b6-437f-96f1-f1423284209f",
        "228c4b6c-2ccc-4ee0-aa48-11e215e67d0a",
        "3731c421-5221-40bb-9867-249d6fefcb17",
        "9f90b2d9-ae25-4ca8-aec5-23fe24d3315f",
        "3ba1d874-0dbe-4327-b480-23d39c7c4319",
        "4f0042b4-b722-424a-80f0-839d5fb6a67f",
        "4154376a-a4b2-45b1-b8a3-22bde49465ac"
      ],
      "order": 6,
      "groupId": "81282e45-a192-4c8d-a9b1-8afe1ce14147"
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
        "cb571a20-6b38-4b68-950a-bd88f6a93406",
        "cefc8dca-4c7f-4f00-921a-914b411d84ce",
        "f8ee182b-a1b9-4a85-9643-ebbbf167d635",
        "9f90b2d9-ae25-4ca8-aec5-23fe24d3315f",
        "3ba1d874-0dbe-4327-b480-23d39c7c4319",
        "ff8c92e7-17b6-437f-96f1-f1423284209f",
        "228c4b6c-2ccc-4ee0-aa48-11e215e67d0a",
        "3731c421-5221-40bb-9867-249d6fefcb17",
        "4f0042b4-b722-424a-80f0-839d5fb6a67f",
        "4154376a-a4b2-45b1-b8a3-22bde49465ac"
      ],
      "order": 0,
      "groupId": "81282e45-a192-4c8d-a9b1-8afe1ce14147"
    },
    {
      "id": "7cf512c9-6a18-450d-9658-949293a1770a",
      "name": "暖機面板",
      "characterId": "9c30c6f6-5ea1-4111-bb09-8bb18545b65e",
      "skillMultiplier": 100,
      "enabledBuffIds": [
        "eba8b725-c617-421b-ad05-d0aa6b94a26c",
        "3731c421-5221-40bb-9867-249d6fefcb17",
        "cefc8dca-4c7f-4f00-921a-914b411d84ce",
        "cb571a20-6b38-4b68-950a-bd88f6a93406",
        "f8ee182b-a1b9-4a85-9643-ebbbf167d635",
        "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
        "4e4ee622-63a9-4980-9e61-c74289289ca5"
      ],
      "order": 6,
      "groupId": ""
    },
    {
      "id": "de977545-7872-46cc-a780-139459e529c4",
      "name": "天賦-斫痕",
      "characterId": "9c30c6f6-5ea1-4111-bb09-8bb18545b65e",
      "skillMultiplier": 30,
      "enabledBuffIds": [
        "eba8b725-c617-421b-ad05-d0aa6b94a26c",
        "ff8c92e7-17b6-437f-96f1-f1423284209f",
        "228c4b6c-2ccc-4ee0-aa48-11e215e67d0a",
        "3ba1d874-0dbe-4327-b480-23d39c7c4319",
        "9f90b2d9-ae25-4ca8-aec5-23fe24d3315f",
        "f8ee182b-a1b9-4a85-9643-ebbbf167d635",
        "cefc8dca-4c7f-4f00-921a-914b411d84ce",
        "cb571a20-6b38-4b68-950a-bd88f6a93406",
        "d5294369-fbe1-4747-8d0a-14575af852fb",
        "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
        "bf69800c-c698-4c85-9573-449dae1c900e",
        "e93e91e0-7310-4966-8e95-399c194c8037",
        "b727caec-35bd-4b35-9a2a-75fafa297707",
        "4e4ee622-63a9-4980-9e61-c74289289ca5",
        "3731c421-5221-40bb-9867-249d6fefcb17",
        "4f0042b4-b722-424a-80f0-839d5fb6a67f",
        "4154376a-a4b2-45b1-b8a3-22bde49465ac"
      ],
      "order": 7,
      "groupId": "61742a3d-74fb-4f10-915f-a0f50efcd3da"
    }
  ],
  "skillGroups": [
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
      "id": "83897f34-79b4-4db0-970e-c42169abc06f",
      "name": "0潛專",
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
          "id": "ad13eaf1-35dc-437e-a40d-0e4d80372cf2",
          "skillId": "05095b04-00c5-4724-81f7-828b6c621b86",
          "count": 49.248,
          "disabledBuffIds": [
            "78b1caa3-da82-4277-ac78-1aaa90fe044c",
            "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "d5294369-fbe1-4747-8d0a-14575af852fb",
            "cb571a20-6b38-4b68-950a-bd88f6a93406"
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
          "id": "3efd2d32-ac61-4d84-87da-b57a11fd0372",
          "skillId": "de977545-7872-46cc-a780-139459e529c4",
          "count": 50,
          "disabledBuffIds": []
        }
      ],
      "disabledBuffIds": [
        "8d820226-2f54-4dba-8dd1-92804b0d6af1",
        "78b1caa3-da82-4277-ac78-1aaa90fe044c",
        "d5294369-fbe1-4747-8d0a-14575af852fb",
        "cb571a20-6b38-4b68-950a-bd88f6a93406",
        "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
        "cefc8dca-4c7f-4f00-921a-914b411d84ce",
        "3ba1d874-0dbe-4327-b480-23d39c7c4319",
        "9f90b2d9-ae25-4ca8-aec5-23fe24d3315f",
        "f8ee182b-a1b9-4a85-9643-ebbbf167d635",
        "d6f9dca6-d60f-4a98-b7f0-cd6101656683",
        "ff8c92e7-17b6-437f-96f1-f1423284209f",
        "a944ee52-ffa7-42ae-a9aa-21fa5c355b94",
        "228c4b6c-2ccc-4ee0-aa48-11e215e67d0a",
        "3731c421-5221-40bb-9867-249d6fefcb17",
        "4154376a-a4b2-45b1-b8a3-22bde49465ac",
        "4f0042b4-b722-424a-80f0-839d5fb6a67f"
      ]
    },
    {
      "id": "edbf95d5-008b-4e66-9c5f-bada48f6e9e0",
      "name": "0潛專-狼之緋8折",
      "entries": [
        {
          "id": "99bd3da6-05bc-4545-91be-1bd58593c2bf",
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
          "id": "9f1d30e8-d195-48fb-b96d-a3f0723842d6",
          "skillId": "a2281919-de6b-4889-ba97-75dbad18538b",
          "count": 3,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "cb571a20-6b38-4b68-950a-bd88f6a93406",
            "d5294369-fbe1-4747-8d0a-14575af852fb"
          ]
        },
        {
          "id": "96860926-9d01-4e3f-814d-4e73bc2dd8af",
          "skillId": "05095b04-00c5-4724-81f7-828b6c621b86",
          "count": 49.248,
          "disabledBuffIds": [
            "78b1caa3-da82-4277-ac78-1aaa90fe044c",
            "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "d5294369-fbe1-4747-8d0a-14575af852fb",
            "cb571a20-6b38-4b68-950a-bd88f6a93406"
          ]
        },
        {
          "id": "921b07da-0329-43a9-8ad0-de775f0c1b06",
          "skillId": "efae40cf-ee71-4f53-8aa4-659e21c217c2",
          "count": 1,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "cb571a20-6b38-4b68-950a-bd88f6a93406",
            "d5294369-fbe1-4747-8d0a-14575af852fb"
          ]
        },
        {
          "id": "6855597f-6f1c-442c-9cee-ab41d790d3ab",
          "skillId": "ce93e7ba-a71e-4f3f-81d4-5579d3ea454a",
          "count": 2,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "cb571a20-6b38-4b68-950a-bd88f6a93406",
            "d5294369-fbe1-4747-8d0a-14575af852fb"
          ]
        },
        {
          "id": "6b4c066a-5b65-4866-a8cb-1e6a4b4359d0",
          "skillId": "0dd1eccf-b9c1-4837-8950-47010fd21b6e",
          "count": 2,
          "disabledBuffIds": []
        },
        {
          "id": "157de680-a7ba-4e75-9aad-fb24ec6ec79e",
          "skillId": "de977545-7872-46cc-a780-139459e529c4",
          "count": 50,
          "disabledBuffIds": []
        }
      ],
      "disabledBuffIds": [
        "8d820226-2f54-4dba-8dd1-92804b0d6af1",
        "78b1caa3-da82-4277-ac78-1aaa90fe044c",
        "d5294369-fbe1-4747-8d0a-14575af852fb",
        "cb571a20-6b38-4b68-950a-bd88f6a93406",
        "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
        "cefc8dca-4c7f-4f00-921a-914b411d84ce",
        "3ba1d874-0dbe-4327-b480-23d39c7c4319",
        "9f90b2d9-ae25-4ca8-aec5-23fe24d3315f",
        "f8ee182b-a1b9-4a85-9643-ebbbf167d635",
        "d6f9dca6-d60f-4a98-b7f0-cd6101656683",
        "ff8c92e7-17b6-437f-96f1-f1423284209f",
        "a944ee52-ffa7-42ae-a9aa-21fa5c355b94",
        "228c4b6c-2ccc-4ee0-aa48-11e215e67d0a",
        "3731c421-5221-40bb-9867-249d6fefcb17",
        "4154376a-a4b2-45b1-b8a3-22bde49465ac",
        "bf69800c-c698-4c85-9573-449dae1c900e"
      ]
    },
    {
      "id": "09b99093-bbdb-4384-8f75-6c3782f99fe3",
      "name": "滿潛專",
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
          "id": "50519f23-37b4-432e-a0b5-d2931dc09287",
          "skillId": "05095b04-00c5-4724-81f7-828b6c621b86",
          "count": 49.248,
          "disabledBuffIds": [
            "78b1caa3-da82-4277-ac78-1aaa90fe044c",
            "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
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
          "id": "6dc2c620-9e0f-4810-bfbb-3c1968ff3b9b",
          "skillId": "de977545-7872-46cc-a780-139459e529c4",
          "count": 50,
          "disabledBuffIds": []
        }
      ],
      "disabledBuffIds": [
        "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
        "78b1caa3-da82-4277-ac78-1aaa90fe044c",
        "8d820226-2f54-4dba-8dd1-92804b0d6af1",
        "bf69800c-c698-4c85-9573-449dae1c900e",
        "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
        "9f90b2d9-ae25-4ca8-aec5-23fe24d3315f",
        "f8ee182b-a1b9-4a85-9643-ebbbf167d635",
        "3ba1d874-0dbe-4327-b480-23d39c7c4319",
        "cefc8dca-4c7f-4f00-921a-914b411d84ce",
        "d6f9dca6-d60f-4a98-b7f0-cd6101656683",
        "ff8c92e7-17b6-437f-96f1-f1423284209f",
        "a944ee52-ffa7-42ae-a9aa-21fa5c355b94",
        "228c4b6c-2ccc-4ee0-aa48-11e215e67d0a",
        "3731c421-5221-40bb-9867-249d6fefcb17",
        "4f0042b4-b722-424a-80f0-839d5fb6a67f",
        "4154376a-a4b2-45b1-b8a3-22bde49465ac"
      ]
    },
    {
      "id": "ea644a29-3454-41e9-9caf-d429a0705218",
      "name": "滿潛專-狼之緋8折",
      "entries": [
        {
          "id": "657ad10a-d413-46c2-b484-c32030491954",
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
          "id": "765dd32f-f70c-4060-9a2a-4b77fdbfb82a",
          "skillId": "a2281919-de6b-4889-ba97-75dbad18538b",
          "count": 3,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
          ]
        },
        {
          "id": "f91a80ce-6458-4c30-a0f1-71a6906d5417",
          "skillId": "05095b04-00c5-4724-81f7-828b6c621b86",
          "count": 49.248,
          "disabledBuffIds": [
            "78b1caa3-da82-4277-ac78-1aaa90fe044c",
            "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
          ]
        },
        {
          "id": "fb8493ef-0ba2-4f44-913e-c7f90eb2f417",
          "skillId": "efae40cf-ee71-4f53-8aa4-659e21c217c2",
          "count": 1,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
          ]
        },
        {
          "id": "4f4b0d7e-6c36-47ba-a2b5-027eedc14a49",
          "skillId": "ce93e7ba-a71e-4f3f-81d4-5579d3ea454a",
          "count": 2,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
          ]
        },
        {
          "id": "0feb9442-63d5-4d73-b4fd-e4938cc0df25",
          "skillId": "0dd1eccf-b9c1-4837-8950-47010fd21b6e",
          "count": 2,
          "disabledBuffIds": []
        },
        {
          "id": "55f30d21-7e35-46b3-b084-49626a6ffd6c",
          "skillId": "de977545-7872-46cc-a780-139459e529c4",
          "count": 50,
          "disabledBuffIds": []
        }
      ],
      "disabledBuffIds": [
        "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
        "78b1caa3-da82-4277-ac78-1aaa90fe044c",
        "8d820226-2f54-4dba-8dd1-92804b0d6af1",
        "bf69800c-c698-4c85-9573-449dae1c900e",
        "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
        "9f90b2d9-ae25-4ca8-aec5-23fe24d3315f",
        "f8ee182b-a1b9-4a85-9643-ebbbf167d635",
        "3ba1d874-0dbe-4327-b480-23d39c7c4319",
        "cefc8dca-4c7f-4f00-921a-914b411d84ce",
        "d6f9dca6-d60f-4a98-b7f0-cd6101656683",
        "ff8c92e7-17b6-437f-96f1-f1423284209f",
        "a944ee52-ffa7-42ae-a9aa-21fa5c355b94",
        "228c4b6c-2ccc-4ee0-aa48-11e215e67d0a",
        "3731c421-5221-40bb-9867-249d6fefcb17",
        "4f0042b4-b722-424a-80f0-839d5fb6a67f",
        "d5294369-fbe1-4747-8d0a-14575af852fb"
      ]
    },
    {
      "id": "aa27835c-3039-4120-a553-db336e627140",
      "name": "0潛大月卡",
      "entries": [
        {
          "id": "edc4ce1c-6ed0-447c-9f7b-c7985270a9f9",
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
          "id": "6b47b15a-1895-4875-b5ef-54467fe66c4c",
          "skillId": "a2281919-de6b-4889-ba97-75dbad18538b",
          "count": 3,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "cb571a20-6b38-4b68-950a-bd88f6a93406",
            "d5294369-fbe1-4747-8d0a-14575af852fb"
          ]
        },
        {
          "id": "7d27628c-9876-46a9-bc6b-46b1b8d23878",
          "skillId": "05095b04-00c5-4724-81f7-828b6c621b86",
          "count": 25.92,
          "disabledBuffIds": [
            "78b1caa3-da82-4277-ac78-1aaa90fe044c",
            "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "d5294369-fbe1-4747-8d0a-14575af852fb",
            "cb571a20-6b38-4b68-950a-bd88f6a93406",
            "9f90b2d9-ae25-4ca8-aec5-23fe24d3315f"
          ]
        },
        {
          "id": "bd3af7bd-9cdd-4494-89d7-294427a27fef",
          "skillId": "05095b04-00c5-4724-81f7-828b6c621b86",
          "count": 23.328,
          "disabledBuffIds": []
        },
        {
          "id": "d890019e-f595-400b-9788-f289854f62c4",
          "skillId": "efae40cf-ee71-4f53-8aa4-659e21c217c2",
          "count": 1,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "cb571a20-6b38-4b68-950a-bd88f6a93406",
            "d5294369-fbe1-4747-8d0a-14575af852fb"
          ]
        },
        {
          "id": "90cb3fbf-22eb-4b8a-a1ce-8694ddd202da",
          "skillId": "ce93e7ba-a71e-4f3f-81d4-5579d3ea454a",
          "count": 2,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "cb571a20-6b38-4b68-950a-bd88f6a93406",
            "d5294369-fbe1-4747-8d0a-14575af852fb"
          ]
        },
        {
          "id": "3ee04d93-c888-41d9-bc6a-556cd007743b",
          "skillId": "0dd1eccf-b9c1-4837-8950-47010fd21b6e",
          "count": 2,
          "disabledBuffIds": []
        },
        {
          "id": "d5f9f84d-2308-4376-95d3-66aeaf7f72c5",
          "skillId": "de977545-7872-46cc-a780-139459e529c4",
          "count": 46,
          "disabledBuffIds": [
            "9f90b2d9-ae25-4ca8-aec5-23fe24d3315f"
          ]
        },
        {
          "id": "51dbe95f-1ca6-40a3-a184-e67d83e3971d",
          "skillId": "de977545-7872-46cc-a780-139459e529c4",
          "count": 4,
          "disabledBuffIds": []
        }
      ],
      "disabledBuffIds": [
        "8d820226-2f54-4dba-8dd1-92804b0d6af1",
        "78b1caa3-da82-4277-ac78-1aaa90fe044c",
        "d5294369-fbe1-4747-8d0a-14575af852fb",
        "cb571a20-6b38-4b68-950a-bd88f6a93406",
        "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
        "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
        "cefc8dca-4c7f-4f00-921a-914b411d84ce",
        "3ba1d874-0dbe-4327-b480-23d39c7c4319",
        "bf69800c-c698-4c85-9573-449dae1c900e",
        "d6f9dca6-d60f-4a98-b7f0-cd6101656683",
        "ff8c92e7-17b6-437f-96f1-f1423284209f",
        "a944ee52-ffa7-42ae-a9aa-21fa5c355b94",
        "228c4b6c-2ccc-4ee0-aa48-11e215e67d0a",
        "3731c421-5221-40bb-9867-249d6fefcb17",
        "4f0042b4-b722-424a-80f0-839d5fb6a67f",
        "4154376a-a4b2-45b1-b8a3-22bde49465ac"
      ]
    },
    {
      "id": "2c2b3d17-e5dc-47f0-96df-1daf2f1b290e",
      "name": "滿潛大月卡",
      "entries": [
        {
          "id": "38aa0e9b-3eee-4cec-92f2-c0630889b698",
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
          "id": "08dec5ec-c94d-499e-8d55-a6740ce77f89",
          "skillId": "a2281919-de6b-4889-ba97-75dbad18538b",
          "count": 3,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
          ]
        },
        {
          "id": "1d3ae4df-ae2c-4ba5-aa28-e33e0de6b5ba",
          "skillId": "05095b04-00c5-4724-81f7-828b6c621b86",
          "count": 25.92,
          "disabledBuffIds": [
            "78b1caa3-da82-4277-ac78-1aaa90fe044c",
            "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
            "3ba1d874-0dbe-4327-b480-23d39c7c4319"
          ]
        },
        {
          "id": "24714c14-1e66-4090-a2d9-c6de8e6b8b7e",
          "skillId": "05095b04-00c5-4724-81f7-828b6c621b86",
          "count": 23.328,
          "disabledBuffIds": []
        },
        {
          "id": "1db73115-0e7f-43ca-965b-460b98b7e6e4",
          "skillId": "efae40cf-ee71-4f53-8aa4-659e21c217c2",
          "count": 1,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
          ]
        },
        {
          "id": "8186f1ab-cdec-43a2-9392-e11bdd749b34",
          "skillId": "ce93e7ba-a71e-4f3f-81d4-5579d3ea454a",
          "count": 2,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
          ]
        },
        {
          "id": "cb882ec2-d9b3-4017-b9c9-b41d846a8de4",
          "skillId": "0dd1eccf-b9c1-4837-8950-47010fd21b6e",
          "count": 2,
          "disabledBuffIds": []
        },
        {
          "id": "c28f0057-945c-4213-81f7-8623dbcfcefd",
          "skillId": "de977545-7872-46cc-a780-139459e529c4",
          "count": 46,
          "disabledBuffIds": [
            "3ba1d874-0dbe-4327-b480-23d39c7c4319"
          ]
        },
        {
          "id": "3a1b525f-510f-4841-8eda-bf8391c7b628",
          "skillId": "de977545-7872-46cc-a780-139459e529c4",
          "count": 4,
          "disabledBuffIds": []
        }
      ],
      "disabledBuffIds": [
        "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
        "78b1caa3-da82-4277-ac78-1aaa90fe044c",
        "8d820226-2f54-4dba-8dd1-92804b0d6af1",
        "bf69800c-c698-4c85-9573-449dae1c900e",
        "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
        "9f90b2d9-ae25-4ca8-aec5-23fe24d3315f",
        "f8ee182b-a1b9-4a85-9643-ebbbf167d635",
        "cb571a20-6b38-4b68-950a-bd88f6a93406",
        "d5294369-fbe1-4747-8d0a-14575af852fb",
        "d6f9dca6-d60f-4a98-b7f0-cd6101656683",
        "ff8c92e7-17b6-437f-96f1-f1423284209f",
        "a944ee52-ffa7-42ae-a9aa-21fa5c355b94",
        "228c4b6c-2ccc-4ee0-aa48-11e215e67d0a",
        "3731c421-5221-40bb-9867-249d6fefcb17",
        "4f0042b4-b722-424a-80f0-839d5fb6a67f",
        "4154376a-a4b2-45b1-b8a3-22bde49465ac"
      ]
    },
    {
      "id": "f30608a3-31ae-4b92-9f5c-5baceb05aa24",
      "name": "0潛扶搖-部分失衡增傷",
      "entries": [
        {
          "id": "35c61ee9-00f6-4937-82d3-cde10e92f0be",
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
          "id": "72481c42-0d49-4bf8-8bc0-15e05ddda188",
          "skillId": "a2281919-de6b-4889-ba97-75dbad18538b",
          "count": 2,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
            "ff8c92e7-17b6-437f-96f1-f1423284209f"
          ]
        },
        {
          "id": "93140fdb-9f3f-436f-b892-f6954e451294",
          "skillId": "a2281919-de6b-4889-ba97-75dbad18538b",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "738b7304-89d3-491d-abe5-6874f89b65d1",
          "skillId": "05095b04-00c5-4724-81f7-828b6c621b86",
          "count": 49.248,
          "disabledBuffIds": [
            "78b1caa3-da82-4277-ac78-1aaa90fe044c",
            "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
          ]
        },
        {
          "id": "2a850375-39cc-4971-857e-f3fca9c3fb1a",
          "skillId": "efae40cf-ee71-4f53-8aa4-659e21c217c2",
          "count": 1,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
          ]
        },
        {
          "id": "cc7390b0-a66b-4683-bd7d-6d4377c92ff2",
          "skillId": "ce93e7ba-a71e-4f3f-81d4-5579d3ea454a",
          "count": 1,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
            "ff8c92e7-17b6-437f-96f1-f1423284209f"
          ]
        },
        {
          "id": "2c36dc33-12a3-4f3e-bf5c-ba1576fe8ebe",
          "skillId": "0dd1eccf-b9c1-4837-8950-47010fd21b6e",
          "count": 1,
          "disabledBuffIds": [
            "ff8c92e7-17b6-437f-96f1-f1423284209f"
          ]
        },
        {
          "id": "72c086d6-b950-49c4-8238-5c59576ae452",
          "skillId": "ce93e7ba-a71e-4f3f-81d4-5579d3ea454a",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "68ba3321-278e-47de-8b1c-d307a152fed4",
          "skillId": "0dd1eccf-b9c1-4837-8950-47010fd21b6e",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "132841ea-d4d4-4306-83a8-7df81fdcdbe4",
          "skillId": "de977545-7872-46cc-a780-139459e529c4",
          "count": 38,
          "disabledBuffIds": [
            "ff8c92e7-17b6-437f-96f1-f1423284209f"
          ]
        },
        {
          "id": "bb3580ba-6fd8-4135-9fc9-d240578cb600",
          "skillId": "de977545-7872-46cc-a780-139459e529c4",
          "count": 12,
          "disabledBuffIds": []
        }
      ],
      "disabledBuffIds": [
        "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
        "78b1caa3-da82-4277-ac78-1aaa90fe044c",
        "8d820226-2f54-4dba-8dd1-92804b0d6af1",
        "bf69800c-c698-4c85-9573-449dae1c900e",
        "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
        "9f90b2d9-ae25-4ca8-aec5-23fe24d3315f",
        "f8ee182b-a1b9-4a85-9643-ebbbf167d635",
        "cb571a20-6b38-4b68-950a-bd88f6a93406",
        "d5294369-fbe1-4747-8d0a-14575af852fb",
        "3ba1d874-0dbe-4327-b480-23d39c7c4319",
        "cefc8dca-4c7f-4f00-921a-914b411d84ce",
        "a944ee52-ffa7-42ae-a9aa-21fa5c355b94",
        "228c4b6c-2ccc-4ee0-aa48-11e215e67d0a",
        "4f0042b4-b722-424a-80f0-839d5fb6a67f",
        "4154376a-a4b2-45b1-b8a3-22bde49465ac"
      ]
    },
    {
      "id": "cc4314e4-36c5-4d3b-9b98-a21444e3fc30",
      "name": "滿潛扶搖-部分失衡增傷",
      "entries": [
        {
          "id": "f5e56f16-23f9-4dcf-99e1-af92e1d695c8",
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
          "id": "083fad6e-553c-49f4-8f57-aad93dd79a60",
          "skillId": "a2281919-de6b-4889-ba97-75dbad18538b",
          "count": 2,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
            "ff8c92e7-17b6-437f-96f1-f1423284209f",
            "228c4b6c-2ccc-4ee0-aa48-11e215e67d0a"
          ]
        },
        {
          "id": "018434e0-a910-427a-b1c2-38b18ff1109c",
          "skillId": "a2281919-de6b-4889-ba97-75dbad18538b",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "a4d804ed-1334-415c-9f42-ccd3efd46a0e",
          "skillId": "05095b04-00c5-4724-81f7-828b6c621b86",
          "count": 49.248,
          "disabledBuffIds": [
            "78b1caa3-da82-4277-ac78-1aaa90fe044c",
            "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
          ]
        },
        {
          "id": "2589eb81-d4bf-47a8-bf25-d175b8f47f3f",
          "skillId": "efae40cf-ee71-4f53-8aa4-659e21c217c2",
          "count": 1,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
          ]
        },
        {
          "id": "279dc990-9217-4059-a27e-1d163b603d5d",
          "skillId": "ce93e7ba-a71e-4f3f-81d4-5579d3ea454a",
          "count": 1,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
            "ff8c92e7-17b6-437f-96f1-f1423284209f",
            "228c4b6c-2ccc-4ee0-aa48-11e215e67d0a"
          ]
        },
        {
          "id": "541b6e90-fbe5-48ad-8b57-b3b59cf61291",
          "skillId": "0dd1eccf-b9c1-4837-8950-47010fd21b6e",
          "count": 1,
          "disabledBuffIds": [
            "ff8c92e7-17b6-437f-96f1-f1423284209f",
            "228c4b6c-2ccc-4ee0-aa48-11e215e67d0a"
          ]
        },
        {
          "id": "88d57bab-4020-41a9-a3bc-f06b20975433",
          "skillId": "ce93e7ba-a71e-4f3f-81d4-5579d3ea454a",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "1eaf377a-7b82-4dd1-8ee9-13048402e570",
          "skillId": "0dd1eccf-b9c1-4837-8950-47010fd21b6e",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "d43e1ff3-9931-4f56-9a66-a28cb5cc7826",
          "skillId": "de977545-7872-46cc-a780-139459e529c4",
          "count": 38,
          "disabledBuffIds": [
            "ff8c92e7-17b6-437f-96f1-f1423284209f",
            "228c4b6c-2ccc-4ee0-aa48-11e215e67d0a"
          ]
        },
        {
          "id": "c97117bc-5719-4c7e-8083-4b3a91a23b76",
          "skillId": "de977545-7872-46cc-a780-139459e529c4",
          "count": 12,
          "disabledBuffIds": []
        }
      ],
      "disabledBuffIds": [
        "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
        "78b1caa3-da82-4277-ac78-1aaa90fe044c",
        "8d820226-2f54-4dba-8dd1-92804b0d6af1",
        "bf69800c-c698-4c85-9573-449dae1c900e",
        "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
        "9f90b2d9-ae25-4ca8-aec5-23fe24d3315f",
        "f8ee182b-a1b9-4a85-9643-ebbbf167d635",
        "cb571a20-6b38-4b68-950a-bd88f6a93406",
        "d5294369-fbe1-4747-8d0a-14575af852fb",
        "3ba1d874-0dbe-4327-b480-23d39c7c4319",
        "cefc8dca-4c7f-4f00-921a-914b411d84ce",
        "ff8c92e7-17b6-437f-96f1-f1423284209f",
        "d6f9dca6-d60f-4a98-b7f0-cd6101656683",
        "4f0042b4-b722-424a-80f0-839d5fb6a67f",
        "4154376a-a4b2-45b1-b8a3-22bde49465ac"
      ]
    },
    {
      "id": "25188ea4-d462-49c8-8e97-0d4dd584fc49",
      "name": "滿潛扶搖-全失衡增傷",
      "entries": [
        {
          "id": "80bcc2c9-a8c1-4ebb-aefd-d42e4da10db5",
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
          "id": "dbfc12b3-281d-4891-b9d1-fd837b0ba7ef",
          "skillId": "a2281919-de6b-4889-ba97-75dbad18538b",
          "count": 2,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
            "ff8c92e7-17b6-437f-96f1-f1423284209f"
          ]
        },
        {
          "id": "6d4102fb-599f-4473-a6a3-fcf70614e6a9",
          "skillId": "a2281919-de6b-4889-ba97-75dbad18538b",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "ae9d0ea8-d540-4fc4-be59-aab64e4903a5",
          "skillId": "05095b04-00c5-4724-81f7-828b6c621b86",
          "count": 49.248,
          "disabledBuffIds": [
            "78b1caa3-da82-4277-ac78-1aaa90fe044c",
            "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
          ]
        },
        {
          "id": "21076522-1d09-410f-a3d1-9f93a7b93c5f",
          "skillId": "efae40cf-ee71-4f53-8aa4-659e21c217c2",
          "count": 1,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d"
          ]
        },
        {
          "id": "752b933e-fff6-4118-a59c-a5804d74c556",
          "skillId": "ce93e7ba-a71e-4f3f-81d4-5579d3ea454a",
          "count": 1,
          "disabledBuffIds": [
            "8d820226-2f54-4dba-8dd1-92804b0d6af1",
            "bf69800c-c698-4c85-9573-449dae1c900e",
            "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
            "ff8c92e7-17b6-437f-96f1-f1423284209f",
            "228c4b6c-2ccc-4ee0-aa48-11e215e67d0a"
          ]
        },
        {
          "id": "24374cd1-5f27-4368-930f-afde47748517",
          "skillId": "0dd1eccf-b9c1-4837-8950-47010fd21b6e",
          "count": 1,
          "disabledBuffIds": [
            "ff8c92e7-17b6-437f-96f1-f1423284209f"
          ]
        },
        {
          "id": "2ca430c3-507c-482d-92b1-2165c1f2a053",
          "skillId": "ce93e7ba-a71e-4f3f-81d4-5579d3ea454a",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "1b316049-0ce2-48e5-ad72-fceb15d1e663",
          "skillId": "0dd1eccf-b9c1-4837-8950-47010fd21b6e",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "962af140-6f7f-4b9d-b853-8cdac07d7976",
          "skillId": "de977545-7872-46cc-a780-139459e529c4",
          "count": 38,
          "disabledBuffIds": [
            "ff8c92e7-17b6-437f-96f1-f1423284209f"
          ]
        },
        {
          "id": "1d0ef5ee-2ebf-4f00-b1a5-733a02a9ebd5",
          "skillId": "de977545-7872-46cc-a780-139459e529c4",
          "count": 12,
          "disabledBuffIds": []
        }
      ],
      "disabledBuffIds": [
        "ab7f52f0-6e3c-4cb4-821c-5b3e6d1abdcc",
        "78b1caa3-da82-4277-ac78-1aaa90fe044c",
        "8d820226-2f54-4dba-8dd1-92804b0d6af1",
        "bf69800c-c698-4c85-9573-449dae1c900e",
        "35f27ba6-abe1-41a1-ba86-46d17e94af4d",
        "9f90b2d9-ae25-4ca8-aec5-23fe24d3315f",
        "f8ee182b-a1b9-4a85-9643-ebbbf167d635",
        "cb571a20-6b38-4b68-950a-bd88f6a93406",
        "d5294369-fbe1-4747-8d0a-14575af852fb",
        "3ba1d874-0dbe-4327-b480-23d39c7c4319",
        "cefc8dca-4c7f-4f00-921a-914b411d84ce",
        "ff8c92e7-17b6-437f-96f1-f1423284209f",
        "d6f9dca6-d60f-4a98-b7f0-cd6101656683",
        "4f0042b4-b722-424a-80f0-839d5fb6a67f",
        "4154376a-a4b2-45b1-b8a3-22bde49465ac"
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
      "formula": "57 * 0.864"
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
  ],
  "notes": "狼之緋要疊層，多算一個8折的版本"
})

const estellaExampleData = JSON.stringify({
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
      "id": "acdfee0b-c8e3-4688-9355-4cb7c4f96a1d",
      "name": "能力值",
      "displayName": "能力值",
      "icon": "🌟",
      "color": "#14b8a6",
      "isDefault": false
    },
    {
      "id": "77d8e6f4-5c8f-4595-b55e-a95cfcdeb8c2",
      "name": "攻擊力",
      "displayName": "攻擊力",
      "icon": "🗡️",
      "color": "#ef4444",
      "isDefault": false
    },
    {
      "id": "2fdc97e3-5ac6-45cc-9d46-d22d314419e1",
      "name": "基礎攻擊力",
      "displayName": "基礎攻擊力",
      "icon": "🎯",
      "color": "#a855f7",
      "isDefault": false
    }
  ],
  "buffs": [
    {
      "id": "d6056f45-7f2a-4b89-aaa4-9392b4671625",
      "name": "意志 221",
      "zoneId": "acdfee0b-c8e3-4688-9355-4cb7c4f96a1d",
      "groupId": "fa3af6ba-0091-4e16-861c-8a7e8b613835",
      "value": 110.5,
      "icon": "🌟",
      "enabled": true
    },
    {
      "id": "c15a3cce-d204-47e6-9a4f-aa20bac4fbdb",
      "name": "力量 114",
      "zoneId": "acdfee0b-c8e3-4688-9355-4cb7c4f96a1d",
      "groupId": "4fb6674f-ea23-4f57-a300-513afb401a6b",
      "value": 22.8,
      "icon": "⭐",
      "enabled": true
    },
    {
      "id": "94450b82-98fc-408e-95d9-adfab6f9ac05",
      "name": "裝備 意志 198",
      "zoneId": "acdfee0b-c8e3-4688-9355-4cb7c4f96a1d",
      "groupId": "fa3af6ba-0091-4e16-861c-8a7e8b613835",
      "value": 99,
      "icon": "🛡️",
      "enabled": true
    },
    {
      "id": "d474111c-9fb5-4d19-87b3-6e325f50c644",
      "name": "裝備 力量 238",
      "zoneId": "acdfee0b-c8e3-4688-9355-4cb7c4f96a1d",
      "groupId": "4fb6674f-ea23-4f57-a300-513afb401a6b",
      "value": 47.6,
      "icon": "🛡️",
      "enabled": true
    },
    {
      "id": "fd005337-b097-4026-ad7b-e3ee43b54fc9",
      "name": "OBJ 124",
      "zoneId": "acdfee0b-c8e3-4688-9355-4cb7c4f96a1d",
      "groupId": "fa3af6ba-0091-4e16-861c-8a7e8b613835",
      "value": 62,
      "icon": "🗡️",
      "enabled": true
    },
    {
      "id": "0ae5abec-7c2a-41c3-85a1-3a706433d079",
      "name": "OBJ 主能力板",
      "zoneId": "acdfee0b-c8e3-4688-9355-4cb7c4f96a1d",
      "groupId": "fa3af6ba-0091-4e16-861c-8a7e8b613835",
      "value": 73,
      "icon": "🛡️",
      "enabled": true
    },
    {
      "id": "c2aafcc5-8be1-40c3-905b-ac95d7d07b6e",
      "name": "驍勇 主能力板",
      "zoneId": "acdfee0b-c8e3-4688-9355-4cb7c4f96a1d",
      "groupId": "fa3af6ba-0091-4e16-861c-8a7e8b613835",
      "value": 56.3555,
      "icon": "🛡️",
      "enabled": true
    },
    {
      "id": "3af92a72-1977-4a03-8fae-4458f1d343da",
      "name": "JET 132",
      "zoneId": "acdfee0b-c8e3-4688-9355-4cb7c4f96a1d",
      "groupId": "fa3af6ba-0091-4e16-861c-8a7e8b613835",
      "value": 66,
      "icon": "🗡️",
      "enabled": true
    },
    {
      "id": "7adb9c12-9c9a-4967-b93b-62533e7d0ec8",
      "name": "JET 主能力板",
      "zoneId": "acdfee0b-c8e3-4688-9355-4cb7c4f96a1d",
      "groupId": "fa3af6ba-0091-4e16-861c-8a7e8b613835",
      "value": 74.1095,
      "icon": "🛡️",
      "enabled": true
    },
    {
      "id": "2e442de0-b7f2-429b-8b03-dc5b41056a0f",
      "name": "物理傷害 中",
      "zoneId": "zone-dmg-bonus",
      "groupId": "6d584522-5300-49be-adbd-7c3f6af3d770",
      "value": 34.7,
      "icon": "🗡️",
      "enabled": true
    },
    {
      "id": "73de9726-ec52-42f1-8a2e-08f506762767",
      "name": "物理傷害 大",
      "zoneId": "zone-dmg-bonus",
      "groupId": "8a2a05c7-eba7-40d9-b786-fb7b30389c36",
      "value": 43.3,
      "icon": "🗡️",
      "enabled": true
    },
    {
      "id": "b7d703ae-5765-48e5-88ac-7c9efb60578c",
      "name": "巧技",
      "zoneId": "77d8e6f4-5c8f-4595-b55e-a95cfcdeb8c2",
      "groupId": "8a2a05c7-eba7-40d9-b786-fb7b30389c36",
      "value": 28,
      "icon": "🗡️",
      "enabled": true
    },
    {
      "id": "c0b48a6e-9428-4406-8959-ecd48fc94ab0",
      "name": "JET 攻擊力 大",
      "zoneId": "77d8e6f4-5c8f-4595-b55e-a95cfcdeb8c2",
      "groupId": "e32e09a0-4bfe-4baf-98ab-bd9f8d022dc1",
      "value": 39,
      "icon": "🗡️",
      "enabled": true
    },
    {
      "id": "6675b224-5f7e-478b-8e97-21e347013b85",
      "name": "JET 法傷",
      "zoneId": "zone-dmg-bonus",
      "groupId": "e32e09a0-4bfe-4baf-98ab-bd9f8d022dc1",
      "value": 67.2,
      "icon": "🗡️",
      "enabled": true
    },
    {
      "id": "cd16672a-51a4-4209-be2c-1854c6fbbe7c",
      "name": "消耗凍結",
      "zoneId": "77d8e6f4-5c8f-4595-b55e-a95cfcdeb8c2",
      "groupId": "6d584522-5300-49be-adbd-7c3f6af3d770",
      "value": 33.6,
      "icon": "🗡️",
      "enabled": true
    },
    {
      "id": "c166c6c1-0b17-4f12-affe-f9e786827469",
      "name": "-",
      "zoneId": "2fdc97e3-5ac6-45cc-9d46-d22d314419e1",
      "groupId": "a754f76b-85ec-4c9f-a2d4-f41238635405",
      "value": -100,
      "icon": "🌟",
      "enabled": true
    },
    {
      "id": "1eb1feec-a51b-41d6-8ff6-3442d68197c8",
      "name": "埃特拉",
      "zoneId": "2fdc97e3-5ac6-45cc-9d46-d22d314419e1",
      "groupId": "a754f76b-85ec-4c9f-a2d4-f41238635405",
      "value": 31200,
      "icon": "🌟",
      "enabled": true
    },
    {
      "id": "0fb8928f-d91d-4389-bd7c-8ac78d951565",
      "name": "OBJ",
      "zoneId": "2fdc97e3-5ac6-45cc-9d46-d22d314419e1",
      "groupId": "a754f76b-85ec-4c9f-a2d4-f41238635405",
      "value": 41100,
      "icon": "🌟",
      "enabled": true
    },
    {
      "id": "01dfb9c9-4e7c-4572-b450-7c46a8712bc8",
      "name": "驍勇",
      "zoneId": "2fdc97e3-5ac6-45cc-9d46-d22d314419e1",
      "groupId": "a754f76b-85ec-4c9f-a2d4-f41238635405",
      "value": 49500,
      "icon": "🌟",
      "enabled": true
    },
    {
      "id": "4884ee67-a9c8-4266-ba76-97799a4eb746",
      "name": "JET",
      "zoneId": "2fdc97e3-5ac6-45cc-9d46-d22d314419e1",
      "groupId": "a754f76b-85ec-4c9f-a2d4-f41238635405",
      "value": 50000,
      "icon": "🌟",
      "enabled": true
    },
    {
      "id": "2928f129-4613-47e8-9050-aff35da47da5",
      "name": "物理傷害加成",
      "zoneId": "zone-dmg-bonus",
      "groupId": "",
      "value": 54.8,
      "icon": "🛡️",
      "enabled": true
    },
    {
      "id": "d6541675-f6ce-4031-bc05-a98b54a4261f",
      "name": "物理脆弱",
      "zoneId": "zone-fragile",
      "groupId": "",
      "value": 15,
      "icon": "🔮",
      "enabled": true
    }
  ],
  "buffGroups": [
    {
      "id": "fa3af6ba-0091-4e16-861c-8a7e8b613835",
      "name": "意志",
      "color": "#14b8a6"
    },
    {
      "id": "4fb6674f-ea23-4f57-a300-513afb401a6b",
      "name": "力量",
      "color": "#22c55e"
    },
    {
      "id": "6d584522-5300-49be-adbd-7c3f6af3d770",
      "name": "OBJ",
      "color": "#eab308"
    },
    {
      "id": "8a2a05c7-eba7-40d9-b786-fb7b30389c36",
      "name": "驍勇",
      "color": "#3b82f6"
    },
    {
      "id": "e32e09a0-4bfe-4baf-98ab-bd9f8d022dc1",
      "name": "JET",
      "color": "#f97316"
    },
    {
      "id": "a754f76b-85ec-4c9f-a2d4-f41238635405",
      "name": "基礎攻擊力",
      "color": "#a855f7"
    }
  ],
  "characters": [
    {
      "id": "0ac1f5a5-8d47-4db4-b3ca-0f2c3d6fb071",
      "name": "埃特拉",
      "baseAttack": 1,
      "weaponAttack": 0,
      "attackPercentBonus": 0
    }
  ],
  "skills": [
    {
      "id": "55021cc5-f4d0-4d1b-9820-6a6d378c7d1a",
      "name": "戰技 專1",
      "characterId": "0ac1f5a5-8d47-4db4-b3ca-0f2c3d6fb071",
      "skillMultiplier": 300,
      "enabledBuffIds": [
        "d6056f45-7f2a-4b89-aaa4-9392b4671625",
        "c15a3cce-d204-47e6-9a4f-aa20bac4fbdb",
        "94450b82-98fc-408e-95d9-adfab6f9ac05",
        "d474111c-9fb5-4d19-87b3-6e325f50c644",
        "fd005337-b097-4026-ad7b-e3ee43b54fc9",
        "0ae5abec-7c2a-41c3-85a1-3a706433d079",
        "c2aafcc5-8be1-40c3-905b-ac95d7d07b6e",
        "01dfb9c9-4e7c-4572-b450-7c46a8712bc8",
        "4884ee67-a9c8-4266-ba76-97799a4eb746",
        "3af92a72-1977-4a03-8fae-4458f1d343da",
        "7adb9c12-9c9a-4967-b93b-62533e7d0ec8",
        "1eb1feec-a51b-41d6-8ff6-3442d68197c8",
        "c166c6c1-0b17-4f12-affe-f9e786827469",
        "0fb8928f-d91d-4389-bd7c-8ac78d951565",
        "c0b48a6e-9428-4406-8959-ecd48fc94ab0",
        "b7d703ae-5765-48e5-88ac-7c9efb60578c",
        "6675b224-5f7e-478b-8e97-21e347013b85"
      ],
      "order": 7,
      "groupId": "797a93fd-d30f-475a-b2d5-61849a21c18b"
    },
    {
      "id": "646cf99a-82be-40ca-887b-adb65df10093",
      "name": "連攜 專1",
      "characterId": "0ac1f5a5-8d47-4db4-b3ca-0f2c3d6fb071",
      "skillMultiplier": 539,
      "enabledBuffIds": [
        "d6056f45-7f2a-4b89-aaa4-9392b4671625",
        "c15a3cce-d204-47e6-9a4f-aa20bac4fbdb",
        "94450b82-98fc-408e-95d9-adfab6f9ac05",
        "d474111c-9fb5-4d19-87b3-6e325f50c644",
        "fd005337-b097-4026-ad7b-e3ee43b54fc9",
        "0ae5abec-7c2a-41c3-85a1-3a706433d079",
        "c2aafcc5-8be1-40c3-905b-ac95d7d07b6e",
        "2e442de0-b7f2-429b-8b03-dc5b41056a0f",
        "b7d703ae-5765-48e5-88ac-7c9efb60578c",
        "cd16672a-51a4-4209-be2c-1854c6fbbe7c",
        "c166c6c1-0b17-4f12-affe-f9e786827469",
        "1eb1feec-a51b-41d6-8ff6-3442d68197c8",
        "01dfb9c9-4e7c-4572-b450-7c46a8712bc8",
        "0fb8928f-d91d-4389-bd7c-8ac78d951565",
        "4884ee67-a9c8-4266-ba76-97799a4eb746",
        "c0b48a6e-9428-4406-8959-ecd48fc94ab0",
        "3af92a72-1977-4a03-8fae-4458f1d343da",
        "7adb9c12-9c9a-4967-b93b-62533e7d0ec8",
        "2928f129-4613-47e8-9050-aff35da47da5",
        "d6541675-f6ce-4031-bc05-a98b54a4261f",
        "73de9726-ec52-42f1-8a2e-08f506762767"
      ],
      "order": 8,
      "groupId": "797a93fd-d30f-475a-b2d5-61849a21c18b"
    },
    {
      "id": "0118550c-2956-408c-883c-79a1ffedc995",
      "name": "終結技 專1",
      "characterId": "0ac1f5a5-8d47-4db4-b3ca-0f2c3d6fb071",
      "skillMultiplier": 941,
      "enabledBuffIds": [
        "d6056f45-7f2a-4b89-aaa4-9392b4671625",
        "c15a3cce-d204-47e6-9a4f-aa20bac4fbdb",
        "94450b82-98fc-408e-95d9-adfab6f9ac05",
        "d474111c-9fb5-4d19-87b3-6e325f50c644",
        "fd005337-b097-4026-ad7b-e3ee43b54fc9",
        "0ae5abec-7c2a-41c3-85a1-3a706433d079",
        "c2aafcc5-8be1-40c3-905b-ac95d7d07b6e",
        "2e442de0-b7f2-429b-8b03-dc5b41056a0f",
        "b7d703ae-5765-48e5-88ac-7c9efb60578c",
        "cd16672a-51a4-4209-be2c-1854c6fbbe7c",
        "c166c6c1-0b17-4f12-affe-f9e786827469",
        "1eb1feec-a51b-41d6-8ff6-3442d68197c8",
        "01dfb9c9-4e7c-4572-b450-7c46a8712bc8",
        "0fb8928f-d91d-4389-bd7c-8ac78d951565",
        "4884ee67-a9c8-4266-ba76-97799a4eb746",
        "c0b48a6e-9428-4406-8959-ecd48fc94ab0",
        "3af92a72-1977-4a03-8fae-4458f1d343da",
        "7adb9c12-9c9a-4967-b93b-62533e7d0ec8",
        "2928f129-4613-47e8-9050-aff35da47da5",
        "d6541675-f6ce-4031-bc05-a98b54a4261f",
        "73de9726-ec52-42f1-8a2e-08f506762767"
      ],
      "order": 3,
      "groupId": "797a93fd-d30f-475a-b2d5-61849a21c18b"
    },
    {
      "id": "01533394-2fd8-4f70-ae2f-3e110bc4163d",
      "name": "戰技 專3",
      "characterId": "0ac1f5a5-8d47-4db4-b3ca-0f2c3d6fb071",
      "skillMultiplier": 350,
      "enabledBuffIds": [
        "d6056f45-7f2a-4b89-aaa4-9392b4671625",
        "c15a3cce-d204-47e6-9a4f-aa20bac4fbdb",
        "94450b82-98fc-408e-95d9-adfab6f9ac05",
        "d474111c-9fb5-4d19-87b3-6e325f50c644",
        "fd005337-b097-4026-ad7b-e3ee43b54fc9",
        "0ae5abec-7c2a-41c3-85a1-3a706433d079",
        "c2aafcc5-8be1-40c3-905b-ac95d7d07b6e",
        "b7d703ae-5765-48e5-88ac-7c9efb60578c",
        "c166c6c1-0b17-4f12-affe-f9e786827469",
        "1eb1feec-a51b-41d6-8ff6-3442d68197c8",
        "01dfb9c9-4e7c-4572-b450-7c46a8712bc8",
        "0fb8928f-d91d-4389-bd7c-8ac78d951565",
        "4884ee67-a9c8-4266-ba76-97799a4eb746",
        "c0b48a6e-9428-4406-8959-ecd48fc94ab0",
        "3af92a72-1977-4a03-8fae-4458f1d343da",
        "7adb9c12-9c9a-4967-b93b-62533e7d0ec8",
        "6675b224-5f7e-478b-8e97-21e347013b85"
      ],
      "order": 8,
      "groupId": "797a93fd-d30f-475a-b2d5-61849a21c18b"
    },
    {
      "id": "3068ee2a-3bb4-4181-bdc8-c460be1d544c",
      "name": "連攜 專3",
      "characterId": "0ac1f5a5-8d47-4db4-b3ca-0f2c3d6fb071",
      "skillMultiplier": 630,
      "enabledBuffIds": [
        "d6056f45-7f2a-4b89-aaa4-9392b4671625",
        "c15a3cce-d204-47e6-9a4f-aa20bac4fbdb",
        "94450b82-98fc-408e-95d9-adfab6f9ac05",
        "d474111c-9fb5-4d19-87b3-6e325f50c644",
        "fd005337-b097-4026-ad7b-e3ee43b54fc9",
        "0ae5abec-7c2a-41c3-85a1-3a706433d079",
        "c2aafcc5-8be1-40c3-905b-ac95d7d07b6e",
        "2e442de0-b7f2-429b-8b03-dc5b41056a0f",
        "b7d703ae-5765-48e5-88ac-7c9efb60578c",
        "cd16672a-51a4-4209-be2c-1854c6fbbe7c",
        "c166c6c1-0b17-4f12-affe-f9e786827469",
        "1eb1feec-a51b-41d6-8ff6-3442d68197c8",
        "01dfb9c9-4e7c-4572-b450-7c46a8712bc8",
        "0fb8928f-d91d-4389-bd7c-8ac78d951565",
        "4884ee67-a9c8-4266-ba76-97799a4eb746",
        "c0b48a6e-9428-4406-8959-ecd48fc94ab0",
        "3af92a72-1977-4a03-8fae-4458f1d343da",
        "7adb9c12-9c9a-4967-b93b-62533e7d0ec8",
        "2928f129-4613-47e8-9050-aff35da47da5",
        "d6541675-f6ce-4031-bc05-a98b54a4261f",
        "73de9726-ec52-42f1-8a2e-08f506762767"
      ],
      "order": 1,
      "groupId": "797a93fd-d30f-475a-b2d5-61849a21c18b"
    },
    {
      "id": "67006af8-dad6-4f13-a6f2-53d6c261b3ea",
      "name": "終結技 專3",
      "characterId": "0ac1f5a5-8d47-4db4-b3ca-0f2c3d6fb071",
      "skillMultiplier": 1100,
      "enabledBuffIds": [
        "d6056f45-7f2a-4b89-aaa4-9392b4671625",
        "c15a3cce-d204-47e6-9a4f-aa20bac4fbdb",
        "94450b82-98fc-408e-95d9-adfab6f9ac05",
        "d474111c-9fb5-4d19-87b3-6e325f50c644",
        "fd005337-b097-4026-ad7b-e3ee43b54fc9",
        "0ae5abec-7c2a-41c3-85a1-3a706433d079",
        "c2aafcc5-8be1-40c3-905b-ac95d7d07b6e",
        "2e442de0-b7f2-429b-8b03-dc5b41056a0f",
        "b7d703ae-5765-48e5-88ac-7c9efb60578c",
        "cd16672a-51a4-4209-be2c-1854c6fbbe7c",
        "c166c6c1-0b17-4f12-affe-f9e786827469",
        "1eb1feec-a51b-41d6-8ff6-3442d68197c8",
        "01dfb9c9-4e7c-4572-b450-7c46a8712bc8",
        "0fb8928f-d91d-4389-bd7c-8ac78d951565",
        "4884ee67-a9c8-4266-ba76-97799a4eb746",
        "c0b48a6e-9428-4406-8959-ecd48fc94ab0",
        "3af92a72-1977-4a03-8fae-4458f1d343da",
        "7adb9c12-9c9a-4967-b93b-62533e7d0ec8",
        "2928f129-4613-47e8-9050-aff35da47da5",
        "d6541675-f6ce-4031-bc05-a98b54a4261f",
        "73de9726-ec52-42f1-8a2e-08f506762767"
      ],
      "order": 4,
      "groupId": "797a93fd-d30f-475a-b2d5-61849a21c18b"
    },
    {
      "id": "a07098db-5929-401d-8611-ebfd1e61dd22",
      "name": "面板攻擊力",
      "characterId": "0ac1f5a5-8d47-4db4-b3ca-0f2c3d6fb071",
      "skillMultiplier": 100,
      "enabledBuffIds": [
        "d6056f45-7f2a-4b89-aaa4-9392b4671625",
        "c15a3cce-d204-47e6-9a4f-aa20bac4fbdb",
        "94450b82-98fc-408e-95d9-adfab6f9ac05",
        "d474111c-9fb5-4d19-87b3-6e325f50c644",
        "fd005337-b097-4026-ad7b-e3ee43b54fc9",
        "0ae5abec-7c2a-41c3-85a1-3a706433d079",
        "c2aafcc5-8be1-40c3-905b-ac95d7d07b6e",
        "b7d703ae-5765-48e5-88ac-7c9efb60578c",
        "c166c6c1-0b17-4f12-affe-f9e786827469",
        "1eb1feec-a51b-41d6-8ff6-3442d68197c8",
        "01dfb9c9-4e7c-4572-b450-7c46a8712bc8",
        "0fb8928f-d91d-4389-bd7c-8ac78d951565",
        "4884ee67-a9c8-4266-ba76-97799a4eb746",
        "c0b48a6e-9428-4406-8959-ecd48fc94ab0",
        "3af92a72-1977-4a03-8fae-4458f1d343da",
        "7adb9c12-9c9a-4967-b93b-62533e7d0ec8"
      ],
      "order": 5,
      "groupId": ""
    },
    {
      "id": "f0b7a0c7-026f-488a-a1da-c9321cb33bd3",
      "name": "驍勇",
      "characterId": "0ac1f5a5-8d47-4db4-b3ca-0f2c3d6fb071",
      "skillMultiplier": 336,
      "enabledBuffIds": [
        "d6056f45-7f2a-4b89-aaa4-9392b4671625",
        "94450b82-98fc-408e-95d9-adfab6f9ac05",
        "c2aafcc5-8be1-40c3-905b-ac95d7d07b6e",
        "fd005337-b097-4026-ad7b-e3ee43b54fc9",
        "0ae5abec-7c2a-41c3-85a1-3a706433d079",
        "d474111c-9fb5-4d19-87b3-6e325f50c644",
        "c15a3cce-d204-47e6-9a4f-aa20bac4fbdb",
        "0fb8928f-d91d-4389-bd7c-8ac78d951565",
        "01dfb9c9-4e7c-4572-b450-7c46a8712bc8",
        "1eb1feec-a51b-41d6-8ff6-3442d68197c8",
        "c166c6c1-0b17-4f12-affe-f9e786827469",
        "cd16672a-51a4-4209-be2c-1854c6fbbe7c",
        "2e442de0-b7f2-429b-8b03-dc5b41056a0f",
        "b7d703ae-5765-48e5-88ac-7c9efb60578c",
        "4884ee67-a9c8-4266-ba76-97799a4eb746",
        "c0b48a6e-9428-4406-8959-ecd48fc94ab0",
        "3af92a72-1977-4a03-8fae-4458f1d343da",
        "7adb9c12-9c9a-4967-b93b-62533e7d0ec8",
        "2928f129-4613-47e8-9050-aff35da47da5",
        "d6541675-f6ce-4031-bc05-a98b54a4261f",
        "73de9726-ec52-42f1-8a2e-08f506762767"
      ],
      "order": 6,
      "groupId": "d92fdd5e-6d32-4c4d-b441-1a190cd478f7"
    },
    {
      "id": "ca3c18a7-af3b-4fa4-aa3e-b600f16895f7",
      "name": "點劍套",
      "characterId": "0ac1f5a5-8d47-4db4-b3ca-0f2c3d6fb071",
      "skillMultiplier": 250,
      "enabledBuffIds": [
        "d6056f45-7f2a-4b89-aaa4-9392b4671625",
        "94450b82-98fc-408e-95d9-adfab6f9ac05",
        "c2aafcc5-8be1-40c3-905b-ac95d7d07b6e",
        "c15a3cce-d204-47e6-9a4f-aa20bac4fbdb",
        "d474111c-9fb5-4d19-87b3-6e325f50c644",
        "fd005337-b097-4026-ad7b-e3ee43b54fc9",
        "0ae5abec-7c2a-41c3-85a1-3a706433d079",
        "0fb8928f-d91d-4389-bd7c-8ac78d951565",
        "01dfb9c9-4e7c-4572-b450-7c46a8712bc8",
        "1eb1feec-a51b-41d6-8ff6-3442d68197c8",
        "c166c6c1-0b17-4f12-affe-f9e786827469",
        "cd16672a-51a4-4209-be2c-1854c6fbbe7c",
        "2e442de0-b7f2-429b-8b03-dc5b41056a0f",
        "b7d703ae-5765-48e5-88ac-7c9efb60578c",
        "4884ee67-a9c8-4266-ba76-97799a4eb746",
        "c0b48a6e-9428-4406-8959-ecd48fc94ab0",
        "3af92a72-1977-4a03-8fae-4458f1d343da",
        "7adb9c12-9c9a-4967-b93b-62533e7d0ec8",
        "2928f129-4613-47e8-9050-aff35da47da5",
        "d6541675-f6ce-4031-bc05-a98b54a4261f",
        "73de9726-ec52-42f1-8a2e-08f506762767"
      ],
      "order": 7,
      "groupId": "d92fdd5e-6d32-4c4d-b441-1a190cd478f7"
    },
    {
      "id": "9c36bc33-46b4-4b31-a448-815564a29ebf",
      "name": "碎冰",
      "characterId": "0ac1f5a5-8d47-4db4-b3ca-0f2c3d6fb071",
      "skillMultiplier": 348.96,
      "enabledBuffIds": [
        "d6056f45-7f2a-4b89-aaa4-9392b4671625",
        "c15a3cce-d204-47e6-9a4f-aa20bac4fbdb",
        "94450b82-98fc-408e-95d9-adfab6f9ac05",
        "d474111c-9fb5-4d19-87b3-6e325f50c644",
        "fd005337-b097-4026-ad7b-e3ee43b54fc9",
        "0ae5abec-7c2a-41c3-85a1-3a706433d079",
        "c2aafcc5-8be1-40c3-905b-ac95d7d07b6e",
        "3af92a72-1977-4a03-8fae-4458f1d343da",
        "7adb9c12-9c9a-4967-b93b-62533e7d0ec8",
        "2e442de0-b7f2-429b-8b03-dc5b41056a0f",
        "b7d703ae-5765-48e5-88ac-7c9efb60578c",
        "c0b48a6e-9428-4406-8959-ecd48fc94ab0",
        "cd16672a-51a4-4209-be2c-1854c6fbbe7c",
        "c166c6c1-0b17-4f12-affe-f9e786827469",
        "1eb1feec-a51b-41d6-8ff6-3442d68197c8",
        "0fb8928f-d91d-4389-bd7c-8ac78d951565",
        "01dfb9c9-4e7c-4572-b450-7c46a8712bc8",
        "4884ee67-a9c8-4266-ba76-97799a4eb746",
        "2928f129-4613-47e8-9050-aff35da47da5",
        "d6541675-f6ce-4031-bc05-a98b54a4261f",
        "73de9726-ec52-42f1-8a2e-08f506762767"
      ],
      "order": 9,
      "groupId": "d92fdd5e-6d32-4c4d-b441-1a190cd478f7"
    },
    {
      "id": "d74ddae8-5220-437b-bb05-5f945feac56e",
      "name": "擊飛",
      "characterId": "0ac1f5a5-8d47-4db4-b3ca-0f2c3d6fb071",
      "skillMultiplier": 147.245,
      "enabledBuffIds": [
        "d6056f45-7f2a-4b89-aaa4-9392b4671625",
        "c15a3cce-d204-47e6-9a4f-aa20bac4fbdb",
        "94450b82-98fc-408e-95d9-adfab6f9ac05",
        "d474111c-9fb5-4d19-87b3-6e325f50c644",
        "fd005337-b097-4026-ad7b-e3ee43b54fc9",
        "0ae5abec-7c2a-41c3-85a1-3a706433d079",
        "c2aafcc5-8be1-40c3-905b-ac95d7d07b6e",
        "3af92a72-1977-4a03-8fae-4458f1d343da",
        "7adb9c12-9c9a-4967-b93b-62533e7d0ec8",
        "2e442de0-b7f2-429b-8b03-dc5b41056a0f",
        "b7d703ae-5765-48e5-88ac-7c9efb60578c",
        "c0b48a6e-9428-4406-8959-ecd48fc94ab0",
        "cd16672a-51a4-4209-be2c-1854c6fbbe7c",
        "c166c6c1-0b17-4f12-affe-f9e786827469",
        "1eb1feec-a51b-41d6-8ff6-3442d68197c8",
        "0fb8928f-d91d-4389-bd7c-8ac78d951565",
        "01dfb9c9-4e7c-4572-b450-7c46a8712bc8",
        "4884ee67-a9c8-4266-ba76-97799a4eb746",
        "2928f129-4613-47e8-9050-aff35da47da5",
        "d6541675-f6ce-4031-bc05-a98b54a4261f",
        "73de9726-ec52-42f1-8a2e-08f506762767"
      ],
      "order": 10,
      "groupId": "d92fdd5e-6d32-4c4d-b441-1a190cd478f7"
    }
  ],
  "skillGroups": [
    {
      "id": "d92fdd5e-6d32-4c4d-b441-1a190cd478f7",
      "name": "額外傷害",
      "color": "#ef4444"
    },
    {
      "id": "797a93fd-d30f-475a-b2d5-61849a21c18b",
      "name": "埃特拉",
      "color": "#f97316"
    }
  ],
  "rotationGroups": [
    {
      "id": "d661c491-242f-42e4-a31b-81740f10c9a5",
      "name": "OBJ面板",
      "entries": [
        {
          "id": "e7600ee2-7003-4788-a21f-0037620482d1",
          "skillId": "a07098db-5929-401d-8611-ebfd1e61dd22",
          "count": 1,
          "disabledBuffIds": []
        }
      ],
      "disabledBuffIds": [
        "01dfb9c9-4e7c-4572-b450-7c46a8712bc8",
        "3af92a72-1977-4a03-8fae-4458f1d343da",
        "c2aafcc5-8be1-40c3-905b-ac95d7d07b6e",
        "7adb9c12-9c9a-4967-b93b-62533e7d0ec8",
        "4884ee67-a9c8-4266-ba76-97799a4eb746",
        "b7d703ae-5765-48e5-88ac-7c9efb60578c",
        "c0b48a6e-9428-4406-8959-ecd48fc94ab0"
      ]
    },
    {
      "id": "2fb4cca8-d2b6-4ac5-a6a0-c802a125c2fb",
      "name": "驍勇面板",
      "entries": [
        {
          "id": "9d823099-8e5c-4ff2-bb4d-07f7390c3ee2",
          "skillId": "a07098db-5929-401d-8611-ebfd1e61dd22",
          "count": 1,
          "disabledBuffIds": []
        }
      ],
      "disabledBuffIds": [
        "0fb8928f-d91d-4389-bd7c-8ac78d951565",
        "2e442de0-b7f2-429b-8b03-dc5b41056a0f",
        "cd16672a-51a4-4209-be2c-1854c6fbbe7c",
        "4884ee67-a9c8-4266-ba76-97799a4eb746",
        "c0b48a6e-9428-4406-8959-ecd48fc94ab0",
        "fd005337-b097-4026-ad7b-e3ee43b54fc9",
        "0ae5abec-7c2a-41c3-85a1-3a706433d079",
        "3af92a72-1977-4a03-8fae-4458f1d343da",
        "7adb9c12-9c9a-4967-b93b-62533e7d0ec8"
      ]
    },
    {
      "id": "43467f5a-ccb4-4b4b-a890-ac9dc1641eb4",
      "name": "JET面板",
      "entries": [
        {
          "id": "ef9df8a5-561f-468c-a64a-541e2b6fabbf",
          "skillId": "a07098db-5929-401d-8611-ebfd1e61dd22",
          "count": 1,
          "disabledBuffIds": []
        }
      ],
      "disabledBuffIds": [
        "0fb8928f-d91d-4389-bd7c-8ac78d951565",
        "01dfb9c9-4e7c-4572-b450-7c46a8712bc8",
        "b7d703ae-5765-48e5-88ac-7c9efb60578c",
        "2e442de0-b7f2-429b-8b03-dc5b41056a0f",
        "cd16672a-51a4-4209-be2c-1854c6fbbe7c",
        "c2aafcc5-8be1-40c3-905b-ac95d7d07b6e",
        "fd005337-b097-4026-ad7b-e3ee43b54fc9",
        "0ae5abec-7c2a-41c3-85a1-3a706433d079"
      ]
    },
    {
      "id": "bb5bfd6a-a249-4a37-9ae2-2d69801f581f",
      "name": "OBJ 技能專3",
      "entries": [
        {
          "id": "85c2ad49-c8bd-4753-b504-42c9d0a63601",
          "skillId": "01533394-2fd8-4f70-ae2f-3e110bc4163d",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "df771a92-ebb0-4212-8f73-74df86d0ff3c",
          "skillId": "3068ee2a-3bb4-4181-bdc8-c460be1d544c",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "22bb2dfb-e4d0-4616-b2b2-38f745424afa",
          "skillId": "67006af8-dad6-4f13-a6f2-53d6c261b3ea",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "b2c6446b-c911-4c69-bcc5-297360a566f0",
          "skillId": "ca3c18a7-af3b-4fa4-aa3e-b600f16895f7",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "26efb15e-3836-4af3-8ef0-565663025f20",
          "skillId": "9c36bc33-46b4-4b31-a448-815564a29ebf",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "9b9929b7-cc84-4538-8db7-7d1e0ab4b232",
          "skillId": "d74ddae8-5220-437b-bb05-5f945feac56e",
          "count": 2,
          "disabledBuffIds": []
        }
      ],
      "disabledBuffIds": [
        "01dfb9c9-4e7c-4572-b450-7c46a8712bc8",
        "3af92a72-1977-4a03-8fae-4458f1d343da",
        "c2aafcc5-8be1-40c3-905b-ac95d7d07b6e",
        "7adb9c12-9c9a-4967-b93b-62533e7d0ec8",
        "4884ee67-a9c8-4266-ba76-97799a4eb746",
        "b7d703ae-5765-48e5-88ac-7c9efb60578c",
        "c0b48a6e-9428-4406-8959-ecd48fc94ab0",
        "73de9726-ec52-42f1-8a2e-08f506762767",
        "6675b224-5f7e-478b-8e97-21e347013b85"
      ]
    },
    {
      "id": "67d459cd-29bb-4dd2-9f4b-1a9ee18f5b9d",
      "name": "驍勇 技能專3",
      "entries": [
        {
          "id": "5fe51503-f252-4774-8bd2-a4e6f0f9761f",
          "skillId": "01533394-2fd8-4f70-ae2f-3e110bc4163d",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "cfef6240-88d4-40b6-ad46-ec77516a325f",
          "skillId": "3068ee2a-3bb4-4181-bdc8-c460be1d544c",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "6db73954-5b93-47dd-95b6-1cb31bd1ad15",
          "skillId": "67006af8-dad6-4f13-a6f2-53d6c261b3ea",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "2441842b-4b61-4c25-918a-8398a49ccc58",
          "skillId": "ca3c18a7-af3b-4fa4-aa3e-b600f16895f7",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "3f39dc0d-d710-45af-b5d1-f9895d083f91",
          "skillId": "f0b7a0c7-026f-488a-a1da-c9321cb33bd3",
          "count": 2,
          "disabledBuffIds": []
        },
        {
          "id": "7c5b4674-ad0b-4a80-ab91-10d76c6431d4",
          "skillId": "9c36bc33-46b4-4b31-a448-815564a29ebf",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "f57be868-4b1a-42d2-b010-abd95e4f40e5",
          "skillId": "d74ddae8-5220-437b-bb05-5f945feac56e",
          "count": 2,
          "disabledBuffIds": []
        }
      ],
      "disabledBuffIds": [
        "0fb8928f-d91d-4389-bd7c-8ac78d951565",
        "2e442de0-b7f2-429b-8b03-dc5b41056a0f",
        "cd16672a-51a4-4209-be2c-1854c6fbbe7c",
        "4884ee67-a9c8-4266-ba76-97799a4eb746",
        "c0b48a6e-9428-4406-8959-ecd48fc94ab0",
        "fd005337-b097-4026-ad7b-e3ee43b54fc9",
        "0ae5abec-7c2a-41c3-85a1-3a706433d079",
        "3af92a72-1977-4a03-8fae-4458f1d343da",
        "7adb9c12-9c9a-4967-b93b-62533e7d0ec8",
        "6675b224-5f7e-478b-8e97-21e347013b85"
      ]
    },
    {
      "id": "ec773759-2619-4e5a-bac3-5029f80694f5",
      "name": "JET 技能專3",
      "entries": [
        {
          "id": "fe17096d-d4d4-46e4-888f-2c4310d0f24d",
          "skillId": "01533394-2fd8-4f70-ae2f-3e110bc4163d",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "337cc167-145e-4053-961a-4bbdeaf7958b",
          "skillId": "3068ee2a-3bb4-4181-bdc8-c460be1d544c",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "eb047a07-a312-4696-b991-8ce3e6b2006e",
          "skillId": "67006af8-dad6-4f13-a6f2-53d6c261b3ea",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "73d930b4-5fed-4d67-926f-307908892ca4",
          "skillId": "ca3c18a7-af3b-4fa4-aa3e-b600f16895f7",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "a28b90ae-1488-4b4e-90e6-a295e582af29",
          "skillId": "9c36bc33-46b4-4b31-a448-815564a29ebf",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "f2b92499-d494-49c1-bde4-2520c4dea1db",
          "skillId": "d74ddae8-5220-437b-bb05-5f945feac56e",
          "count": 2,
          "disabledBuffIds": []
        }
      ],
      "disabledBuffIds": [
        "0fb8928f-d91d-4389-bd7c-8ac78d951565",
        "01dfb9c9-4e7c-4572-b450-7c46a8712bc8",
        "b7d703ae-5765-48e5-88ac-7c9efb60578c",
        "2e442de0-b7f2-429b-8b03-dc5b41056a0f",
        "cd16672a-51a4-4209-be2c-1854c6fbbe7c",
        "c2aafcc5-8be1-40c3-905b-ac95d7d07b6e",
        "fd005337-b097-4026-ad7b-e3ee43b54fc9",
        "0ae5abec-7c2a-41c3-85a1-3a706433d079",
        "73de9726-ec52-42f1-8a2e-08f506762767"
      ]
    },
    {
      "id": "8967c32d-6de7-44f1-809a-e5d70342d3b4",
      "name": "OBJ 技能專1",
      "entries": [
        {
          "id": "326196cc-6dd5-46ec-a78a-13205cf93421",
          "skillId": "55021cc5-f4d0-4d1b-9820-6a6d378c7d1a",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "cb9609db-ea3b-4b6e-ab64-e212bc4f86dd",
          "skillId": "ca3c18a7-af3b-4fa4-aa3e-b600f16895f7",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "bbe89737-93f4-4642-9aa8-909a93ea2154",
          "skillId": "646cf99a-82be-40ca-887b-adb65df10093",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "9ef112a9-cfb9-4b32-8696-df5ddee133a4",
          "skillId": "0118550c-2956-408c-883c-79a1ffedc995",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "4e299063-b96a-47bb-a13b-0052b741b26a",
          "skillId": "9c36bc33-46b4-4b31-a448-815564a29ebf",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "4e9b2280-2ba6-4606-ad5b-6f25e081452d",
          "skillId": "d74ddae8-5220-437b-bb05-5f945feac56e",
          "count": 2,
          "disabledBuffIds": []
        }
      ],
      "disabledBuffIds": [
        "01dfb9c9-4e7c-4572-b450-7c46a8712bc8",
        "3af92a72-1977-4a03-8fae-4458f1d343da",
        "c2aafcc5-8be1-40c3-905b-ac95d7d07b6e",
        "7adb9c12-9c9a-4967-b93b-62533e7d0ec8",
        "4884ee67-a9c8-4266-ba76-97799a4eb746",
        "b7d703ae-5765-48e5-88ac-7c9efb60578c",
        "c0b48a6e-9428-4406-8959-ecd48fc94ab0",
        "73de9726-ec52-42f1-8a2e-08f506762767",
        "6675b224-5f7e-478b-8e97-21e347013b85"
      ]
    },
    {
      "id": "7ed2f855-310d-431d-be5d-b58fca3d77ea",
      "name": "驍勇 技能專1",
      "entries": [
        {
          "id": "5f112a1c-2a59-48e6-8f35-37942a83da02",
          "skillId": "55021cc5-f4d0-4d1b-9820-6a6d378c7d1a",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "ceff6e1c-8a8e-44b0-bb99-9d3d543fe47f",
          "skillId": "ca3c18a7-af3b-4fa4-aa3e-b600f16895f7",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "e1a447a2-25c3-48e8-8170-e43342ac5036",
          "skillId": "f0b7a0c7-026f-488a-a1da-c9321cb33bd3",
          "count": 2,
          "disabledBuffIds": []
        },
        {
          "id": "575206d0-ed80-4352-b3a0-a888a5a6e19a",
          "skillId": "646cf99a-82be-40ca-887b-adb65df10093",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "3f83a0c2-5043-4cec-8dbe-05f85d15a3e8",
          "skillId": "0118550c-2956-408c-883c-79a1ffedc995",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "6fa6e3ff-5ecd-443d-802d-08f3f2b28e5a",
          "skillId": "9c36bc33-46b4-4b31-a448-815564a29ebf",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "9cd5a1c7-ea91-4c0c-b0e2-bc2eae376f0c",
          "skillId": "d74ddae8-5220-437b-bb05-5f945feac56e",
          "count": 2,
          "disabledBuffIds": []
        }
      ],
      "disabledBuffIds": [
        "0fb8928f-d91d-4389-bd7c-8ac78d951565",
        "2e442de0-b7f2-429b-8b03-dc5b41056a0f",
        "cd16672a-51a4-4209-be2c-1854c6fbbe7c",
        "4884ee67-a9c8-4266-ba76-97799a4eb746",
        "c0b48a6e-9428-4406-8959-ecd48fc94ab0",
        "fd005337-b097-4026-ad7b-e3ee43b54fc9",
        "0ae5abec-7c2a-41c3-85a1-3a706433d079",
        "3af92a72-1977-4a03-8fae-4458f1d343da",
        "7adb9c12-9c9a-4967-b93b-62533e7d0ec8",
        "6675b224-5f7e-478b-8e97-21e347013b85"
      ]
    },
    {
      "id": "325faf0f-869a-41ae-8c41-35c22be6ac23",
      "name": "JET 技能專1",
      "entries": [
        {
          "id": "4cbe4d50-9c6a-41f8-aad5-929ac928f6bb",
          "skillId": "55021cc5-f4d0-4d1b-9820-6a6d378c7d1a",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "0be5cd0c-940a-423f-a340-90e619d1af6f",
          "skillId": "ca3c18a7-af3b-4fa4-aa3e-b600f16895f7",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "35c25f4a-7867-4fee-905c-f779ced25327",
          "skillId": "646cf99a-82be-40ca-887b-adb65df10093",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "8125cd97-dd0d-49cb-851a-83fec045617f",
          "skillId": "0118550c-2956-408c-883c-79a1ffedc995",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "6ca2dd25-c774-45ea-a723-bda9bf03733d",
          "skillId": "9c36bc33-46b4-4b31-a448-815564a29ebf",
          "count": 1,
          "disabledBuffIds": []
        },
        {
          "id": "84a36f8b-e5b5-42bb-bd5d-da2df707f10b",
          "skillId": "d74ddae8-5220-437b-bb05-5f945feac56e",
          "count": 2,
          "disabledBuffIds": []
        }
      ],
      "disabledBuffIds": [
        "0fb8928f-d91d-4389-bd7c-8ac78d951565",
        "01dfb9c9-4e7c-4572-b450-7c46a8712bc8",
        "b7d703ae-5765-48e5-88ac-7c9efb60578c",
        "2e442de0-b7f2-429b-8b03-dc5b41056a0f",
        "cd16672a-51a4-4209-be2c-1854c6fbbe7c",
        "c2aafcc5-8be1-40c3-905b-ac95d7d07b6e",
        "fd005337-b097-4026-ad7b-e3ee43b54fc9",
        "0ae5abec-7c2a-41c3-85a1-3a706433d079",
        "73de9726-ec52-42f1-8a2e-08f506762767"
      ]
    }
  ],
  "calcRows": [
    {
      "id": "d8b03003-c87b-44be-84aa-4fb86dd3295a",
      "name": "OBJ主能力板",
      "formula": "(221+198+124)*0.269/2"
    },
    {
      "id": "faf73f0b-db11-4200-b4e1-7ca3a59df88d",
      "name": "驍勇主能力板",
      "formula": "(221+198)*0.269/2"
    },
    {
      "id": "385509b7-5779-4b9a-b51b-e38619ab2ea5",
      "name": "JET主能力板",
      "formula": "(221+198+132)*0.269/2"
    },
    {
      "id": "067c3405-961c-479d-840d-f7268f6d80e1",
      "name": "",
      "formula": "15959/2"
    }
  ],
  "notes": "點劍套鍛滿 濾芯+主能力板"
});

export interface SystemPreset {
  id: string;
  name: string;
  description: string;
  dataJson: string;
};

export const SYSTEM_PRESETS: SystemPreset[] = [
  {
    id: 'system-example',
    name: '洛西武器分析',
    description: '內建範例：多武器橫向對比',
    dataJson: exampleData,
  },
  {
    id: 'estella-example',
    name: '埃特拉武器分析',
    description: '內建範例：多武器橫向對比',
    dataJson: estellaExampleData,
  },
];