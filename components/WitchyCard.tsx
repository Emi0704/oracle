import React, { useMemo } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Fonts, Spacing, BorderRadius, ThemeColors } from '../constants/theme';
import { useCycle } from '../context/CycleContext';

interface WitchyCardProps {
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'tarot' | 'glow';
}

export function WitchyCard({ title, children, style, variant = 'default' }: WitchyCardProps) {
  const { colors } = useCycle();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.card, variant === 'tarot' && styles.tarot, variant === 'glow' && styles.glow, style]}>
      {variant === 'tarot' && (
        <View style={styles.tarotBorder}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
        </View>
      )}
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  const cornerBase: ViewStyle = {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: colors.silver,
  };

  return StyleSheet.create({
    card: {
      backgroundColor: colors.deepPurple,
      borderRadius: BorderRadius.card,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      marginVertical: Spacing.sm,
    },
    tarot: {
      borderWidth: 2,
      borderColor: colors.silver,
      paddingTop: Spacing.xl,
    },
    glow: {
      shadowColor: colors.silver,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    tarotBorder: {
      position: 'absolute',
      top: 8,
      left: 8,
      right: 8,
      bottom: 8,
    },
    cornerTL: {
      ...cornerBase,
      top: 0,
      left: 0,
      borderTopWidth: 1.5,
      borderLeftWidth: 1.5,
      borderTopLeftRadius: 4,
    },
    cornerTR: {
      ...cornerBase,
      top: 0,
      right: 0,
      borderTopWidth: 1.5,
      borderRightWidth: 1.5,
      borderTopRightRadius: 4,
    },
    cornerBL: {
      ...cornerBase,
      bottom: 0,
      left: 0,
      borderBottomWidth: 1.5,
      borderLeftWidth: 1.5,
      borderBottomLeftRadius: 4,
    },
    cornerBR: {
      ...cornerBase,
      bottom: 0,
      right: 0,
      borderBottomWidth: 1.5,
      borderRightWidth: 1.5,
      borderBottomRightRadius: 4,
    },
    title: {
      fontFamily: Fonts.header,
      fontSize: 18,
      color: colors.silver,
      textAlign: 'center',
      marginBottom: Spacing.md,
    },
  });
}
