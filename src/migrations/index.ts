import type { AppData } from '../types';
import { CURRENT_VERSION } from '../types';
import { migrateV1ToV2 } from './v1_to_v2';

export function migrateToLatest(data: unknown): AppData {
  if (!data || typeof data !== 'object') throw new Error('無效的資料格式');

  const d = data as Record<string, unknown>;
  let version = typeof d.version === 'number' ? d.version : 1;

  let current = data as Record<string, unknown>;

  if (version < 2) {
    current = migrateV1ToV2(current as unknown as Parameters<typeof migrateV1ToV2>[0]) as unknown as Record<string, unknown>;
    version = 2;
  }

  // Future migrations go here:
  // if (version < 3) { current = migrateV2ToV3(current as ...); version = 3; }

  if (version !== CURRENT_VERSION) {
    throw new Error(`不支援的版本: ${version}`);
  }

  return current as unknown as AppData;
}
