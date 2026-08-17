import { Platform } from 'react-native';
import { CycleData } from '../types/cycle';

function backupFilename(): string {
  const date = new Date().toISOString().split('T')[0];
  return `periodtracker-backup-${date}.json`;
}

function isValidCycleData(value: any): value is CycleData {
  return !!value && Array.isArray(value.periods) && Array.isArray(value.symptoms) && typeof value.settings === 'object';
}

export async function exportBackup(data: CycleData): Promise<void> {
  const content = JSON.stringify(data, null, 2);
  const filename = backupFilename();

  if (Platform.OS === 'web') {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return;
  }

  const FileSystem = require('expo-file-system/legacy');
  const Sharing = require('expo-sharing');

  const fileUri = FileSystem.cacheDirectory + filename;
  await FileSystem.writeAsStringAsync(fileUri, content);

  const available = await Sharing.isAvailableAsync();
  if (!available) throw new Error('Sharing is not available on this device.');
  await Sharing.shareAsync(fileUri, { mimeType: 'application/json', dialogTitle: 'Save your grimoire backup' });
}

export async function importBackup(): Promise<CycleData | null> {
  const DocumentPicker = require('expo-document-picker');
  const result = await DocumentPicker.getDocumentAsync({ type: 'application/json', copyToCacheDirectory: true });
  if (result.canceled || !result.assets || result.assets.length === 0) return null;

  const uri = result.assets[0].uri;
  let content: string;
  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    content = await response.text();
  } else {
    const FileSystem = require('expo-file-system/legacy');
    content = await FileSystem.readAsStringAsync(uri);
  }

  const parsed = JSON.parse(content);
  if (!isValidCycleData(parsed)) {
    throw new Error('This file does not look like a valid grimoire backup.');
  }
  return parsed;
}
