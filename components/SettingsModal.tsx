import React, { useMemo, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { Fonts, Spacing, BorderRadius, ThemeColors } from '../constants/theme';
import { useCycle } from '../context/CycleContext';
import { CycleData, ThemeMode, TrackingMode } from '../types/cycle';
import { exportBackup, importBackup } from '../lib/backup';
import { ConfirmModal } from './ConfirmModal';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const THEME_OPTIONS: { key: ThemeMode; label: string }[] = [
  { key: 'dark', label: 'Dark' },
  { key: 'light', label: 'Light' },
];

const TRACKING_OPTIONS: { key: TrackingMode; label: string; description: string }[] = [
  { key: 'normal', label: 'Just Tracking', description: 'Simply follow your cycle, symptoms, and predictions.' },
  { key: 'conceiving', label: 'Trying to Conceive', description: 'Highlights your most fertile days to help you plan.' },
  { key: 'avoiding', label: 'Avoiding Pregnancy', description: 'Flags fertile and risk days clearly, so you can take precautions.' },
];

export function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { data, updateSettings, restoreData, colors } = useCycle();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [pendingImport, setPendingImport] = useState<CycleData | null>(null);
  const [busy, setBusy] = useState(false);

  const handleExport = async () => {
    setFeedback(null);
    setBusy(true);
    try {
      await exportBackup(data);
      setFeedback({ text: 'Backup ready — choose where to save it.', isError: false });
    } catch (e) {
      setFeedback({ text: e instanceof Error ? e.message : 'Could not export your backup.', isError: true });
    } finally {
      setBusy(false);
    }
  };

  const handleImportPick = async () => {
    setFeedback(null);
    setBusy(true);
    try {
      const imported = await importBackup();
      if (imported) setPendingImport(imported);
    } catch (e) {
      setFeedback({ text: e instanceof Error ? e.message : 'Could not read that file.', isError: true });
    } finally {
      setBusy(false);
    }
  };

  const confirmImport = () => {
    if (!pendingImport) return;
    restoreData(pendingImport);
    setPendingImport(null);
    setFeedback({ text: 'Your grimoire has been restored.', isError: false });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Settings</Text>

            <Text style={styles.sectionLabel}>Appearance</Text>
            <View style={styles.themeRow}>
              {THEME_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.themeBtn, data.settings.themeMode === opt.key && styles.themeBtnActive]}
                  onPress={() => updateSettings({ themeMode: opt.key })}
                >
                  <Text style={[styles.themeBtnText, data.settings.themeMode === opt.key && styles.themeBtnTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Tracking Mode</Text>
            {TRACKING_OPTIONS.map((opt) => {
              const active = data.settings.trackingMode === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.modeCard, active && styles.modeCardActive]}
                  onPress={() => updateSettings({ trackingMode: opt.key })}
                >
                  <Text style={[styles.modeTitle, active && styles.modeTitleActive]}>{opt.label}</Text>
                  <Text style={styles.modeDesc}>{opt.description}</Text>
                </TouchableOpacity>
              );
            })}

            <Text style={styles.sectionLabel}>Backup &amp; Restore</Text>
            <Text style={styles.backupNote}>
              Save your grimoire as a file you can keep in Google Drive, iCloud, or send to another device.
            </Text>
            <View style={styles.backupRow}>
              <TouchableOpacity style={styles.backupBtn} onPress={handleExport} disabled={busy}>
                <Text style={styles.backupBtnText}>Export Backup</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backupBtn} onPress={handleImportPick} disabled={busy}>
                <Text style={styles.backupBtnText}>Restore from File</Text>
              </TouchableOpacity>
            </View>
            {feedback && (
              <Text style={[styles.feedbackText, feedback.isError && styles.feedbackError]}>{feedback.text}</Text>
            )}

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>Done</Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>

      <ConfirmModal
        visible={!!pendingImport}
        title="Restore This Backup?"
        message="This will replace all periods, symptoms, and settings currently in the app with the contents of this file."
        confirmLabel="Restore"
        onConfirm={confirmImport}
        onCancel={() => setPendingImport(null)}
      />
    </Modal>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: '#00000099',
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing.lg,
    },
    card: {
      width: '100%',
      maxWidth: 400,
      maxHeight: '80%',
      backgroundColor: colors.deepPurple,
      borderRadius: BorderRadius.card,
      borderWidth: 1,
      borderColor: colors.silver,
      padding: Spacing.lg,
    },
    title: {
      fontFamily: Fonts.header,
      fontSize: 20,
      color: colors.silver,
      textAlign: 'center',
      marginBottom: Spacing.md,
    },
    sectionLabel: {
      fontFamily: Fonts.subheader,
      fontSize: 12,
      color: colors.lavender,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: Spacing.sm,
      marginTop: Spacing.sm,
    },
    themeRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
      marginBottom: Spacing.md,
    },
    themeBtn: {
      flex: 1,
      paddingVertical: Spacing.sm + 2,
      borderRadius: BorderRadius.lg,
      borderWidth: 1.5,
      borderColor: colors.textMuted,
      alignItems: 'center',
    },
    themeBtnActive: {
      borderColor: colors.silver,
      backgroundColor: colors.silver + '20',
    },
    themeBtnText: {
      color: colors.textSecondary,
      fontFamily: Fonts.subheader,
      fontSize: 14,
    },
    themeBtnTextActive: {
      color: colors.silver,
    },
    modeCard: {
      borderWidth: 1.5,
      borderColor: colors.textMuted + '50',
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      marginBottom: Spacing.sm,
    },
    modeCardActive: {
      borderColor: colors.silver,
      backgroundColor: colors.silver + '15',
    },
    modeTitle: {
      fontFamily: Fonts.subheader,
      fontSize: 14,
      color: colors.textPrimary,
      marginBottom: 2,
    },
    modeTitleActive: {
      color: colors.silver,
    },
    modeDesc: {
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 17,
    },
    backupNote: {
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 17,
      marginBottom: Spacing.sm,
    },
    backupRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    backupBtn: {
      flex: 1,
      paddingVertical: Spacing.sm + 2,
      paddingHorizontal: Spacing.xs,
      borderRadius: BorderRadius.lg,
      borderWidth: 1.5,
      borderColor: colors.silver,
      alignItems: 'center',
    },
    backupBtnText: {
      color: colors.silver,
      fontFamily: Fonts.subheader,
      fontSize: 12,
      textAlign: 'center',
    },
    feedbackText: {
      fontSize: 12,
      color: colors.silver,
      textAlign: 'center',
      marginTop: Spacing.sm,
    },
    feedbackError: {
      color: colors.crimson,
    },
    closeBtn: {
      marginTop: Spacing.md,
      paddingVertical: Spacing.sm + 2,
      borderRadius: BorderRadius.lg,
      backgroundColor: colors.silver,
      alignItems: 'center',
    },
    closeText: {
      color: colors.backgroundDark,
      fontFamily: Fonts.subheader,
      fontSize: 14,
      fontWeight: '600',
    },
  });
}
