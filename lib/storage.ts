import { Platform } from 'react-native';
import { CycleData } from '../types/cycle';

const WEB_STORAGE_KEY = 'cycle-data';

const DEFAULT_DATA: CycleData = {
  periods: [],
  symptoms: [],
  settings: {
    defaultCycleLength: 28,
    defaultPeriodLength: 5,
    themeMode: 'dark',
    trackingMode: 'normal',
  },
};

export function mergeWithDefaults(data: CycleData): CycleData {
  return {
    ...DEFAULT_DATA,
    ...data,
    settings: { ...DEFAULT_DATA.settings, ...data.settings },
  };
}

export async function loadCycleData(): Promise<CycleData> {
  try {
    if (Platform.OS === 'web') {
      const content = localStorage.getItem(WEB_STORAGE_KEY);
      if (!content) {
        await saveCycleData(DEFAULT_DATA);
        return DEFAULT_DATA;
      }
      return mergeWithDefaults(JSON.parse(content) as CycleData);
    }

    const { File, Paths } = require('expo-file-system');
    const dataFile = new File(Paths.document, 'cycle-data.json');
    if (!dataFile.exists) {
      await saveCycleData(DEFAULT_DATA);
      return DEFAULT_DATA;
    }
    const content = await dataFile.text();
    return mergeWithDefaults(JSON.parse(content) as CycleData);
  } catch {
    return DEFAULT_DATA;
  }
}

export async function saveCycleData(data: CycleData): Promise<void> {
  const content = JSON.stringify(data, null, 2);
  if (Platform.OS === 'web') {
    localStorage.setItem(WEB_STORAGE_KEY, content);
    return;
  }
  const { File, Paths } = require('expo-file-system');
  const dataFile = new File(Paths.document, 'cycle-data.json');
  dataFile.write(content);
}
