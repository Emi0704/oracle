import React, { useMemo } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Fonts, Spacing, BorderRadius, ThemeColors } from '../constants/theme';
import { useCycle } from '../context/CycleContext';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ visible, title, message, confirmLabel = 'Delete', onConfirm, onCancel }: ConfirmModalProps) {
  const { colors } = useCycle();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
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
      maxWidth: 360,
      backgroundColor: colors.deepPurple,
      borderRadius: BorderRadius.card,
      borderWidth: 1,
      borderColor: colors.silver,
      padding: Spacing.lg,
    },
    title: {
      fontFamily: Fonts.header,
      fontSize: 18,
      color: colors.silver,
      textAlign: 'center',
      marginBottom: Spacing.sm,
    },
    message: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: Spacing.lg,
    },
    row: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    cancelBtn: {
      flex: 1,
      paddingVertical: Spacing.sm + 2,
      borderRadius: BorderRadius.lg,
      borderWidth: 1.5,
      borderColor: colors.textMuted,
      alignItems: 'center',
    },
    cancelText: {
      color: colors.textSecondary,
      fontFamily: Fonts.subheader,
      fontSize: 14,
    },
    confirmBtn: {
      flex: 1,
      paddingVertical: Spacing.sm + 2,
      borderRadius: BorderRadius.lg,
      backgroundColor: colors.crimson,
      alignItems: 'center',
    },
    confirmText: {
      color: '#f8f0ff',
      fontFamily: Fonts.subheader,
      fontSize: 14,
      fontWeight: '600',
    },
  });
}
