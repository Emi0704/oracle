import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Fonts, Spacing, BorderRadius, ThemeColors } from '../../constants/theme';
import { ScreenContainer } from '../../components/ScreenContainer';
import { WitchyCard } from '../../components/WitchyCard';
import { MoonPhaseIcon } from '../../components/MoonPhaseIcon';
import { CrystalBallIcon } from '../../components/SymptomIcon';
import { useCycle } from '../../context/CycleContext';
import { getPrediction, getPregnancyChance, getTrackingAdvisory } from '../../lib/predictions';
import { PHASE_INFO } from '../../constants/cycleInfo';
import { PHASE_MOON } from '../../constants/cycleMoon';
import { FertilityLevel } from '../../types/cycle';

export default function InsightsScreen() {
  const { data, colors } = useCycle();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const prediction = useMemo(
    () => getPrediction(data.periods, data.settings.defaultCycleLength),
    [data.periods, data.settings.defaultCycleLength]
  );

  const today = new Date().toISOString().split('T')[0];
  const pregnancy = useMemo(
    () => getPregnancyChance(today, data.periods, data.settings.defaultCycleLength),
    [today, data.periods, data.settings.defaultCycleLength]
  );

  const trackingTip = useMemo(() => {
    if (data.settings.trackingMode === 'normal') return null;
    return getTrackingAdvisory(data.settings.trackingMode, pregnancy.level, pregnancy.isPastFertileWindow);
  }, [data.settings.trackingMode, pregnancy.level, pregnancy.isPastFertileWindow]);

  const currentPhaseInfo = prediction ? PHASE_INFO[prediction.currentPhase] : null;

  const fertilityColor = (level: FertilityLevel) => {
    switch (level) {
      case 'high': return colors.crimson;
      case 'medium': return colors.silver;
      case 'low': return colors.mysticTeal;
    }
  };

  return (
    <ScreenContainer>
      <Text style={styles.header}>Visions</Text>
      <Text style={styles.subtitle}>Wisdom of your cycle</Text>

      {prediction ? (
        <>
          {/* Current Phase Card */}
          <WitchyCard variant="tarot">
            <Text style={styles.tarotTitle}>{currentPhaseInfo?.tarotName}</Text>
            <View style={styles.moonSymbol}>
              <MoonPhaseIcon phase={PHASE_MOON[prediction.currentPhase]} size={44} />
            </View>
            <Text style={styles.phaseTitle}>{currentPhaseInfo?.title}</Text>
            <Text style={styles.phaseDuration}>{currentPhaseInfo?.duration}</Text>
            <Text style={styles.phaseDesc}>{currentPhaseInfo?.description}</Text>
          </WitchyCard>

          {/* Fertility & Ovulation Card */}
          <WitchyCard title="Fertility Reading">
            <View style={styles.fertilityRow}>
              <View style={styles.fertilityItem}>
                <Text style={styles.fertilityLabel}>Ovulation</Text>
                <Text style={styles.fertilityValue}>
                  {formatDate(prediction.ovulationDate)}
                </Text>
              </View>
              <View style={styles.fertilityItem}>
                <Text style={styles.fertilityLabel}>Fertile Window</Text>
                <Text style={styles.fertilityValue}>
                  {formatDate(prediction.fertileWindowStart)} — {formatDate(prediction.fertileWindowEnd)}
                </Text>
              </View>
            </View>
            <View style={styles.pregnancyBox}>
              <Text style={styles.pregnancyTitle}>Pregnancy Chance Today</Text>
              <View style={[styles.pregnancyBadge, { backgroundColor: fertilityColor(pregnancy.level) + '30', borderColor: fertilityColor(pregnancy.level) }]}>
                <Text style={[styles.pregnancyLevel, { color: fertilityColor(pregnancy.level) }]}>
                  {pregnancy.level.toUpperCase()} — {pregnancy.percentage}
                </Text>
              </View>
              <Text style={styles.pregnancyDesc}>{pregnancy.description}</Text>
              {trackingTip && (
                <Text style={styles.trackingTip}>{trackingTip.message}</Text>
              )}
            </View>
          </WitchyCard>

          {/* Symptoms for Current Phase */}
          {currentPhaseInfo && (
            <WitchyCard title="Common Signs">
              <View style={styles.tagContainer}>
                {currentPhaseInfo.symptoms.map((s, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{s}</Text>
                  </View>
                ))}
              </View>
            </WitchyCard>
          )}
        </>
      ) : (
        <WitchyCard variant="tarot">
          <View style={styles.emptyIcon}>
            <CrystalBallIcon size={48} color={colors.silver} />
          </View>
          <Text style={styles.emptyText}>
            The crystal ball is clouded.{'\n'}Log your first period to reveal your cycle&apos;s wisdom.
          </Text>
        </WitchyCard>
      )}
    </ScreenContainer>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    header: {
      fontFamily: Fonts.header,
      fontSize: 28,
      color: colors.silver,
      textAlign: 'center',
      marginTop: Spacing.md,
    },
    subtitle: {
      fontFamily: Fonts.subheader,
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: Spacing.lg,
    },
    tarotTitle: {
      fontFamily: Fonts.header,
      fontSize: 14,
      color: colors.lavender,
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: Spacing.xs,
    },
    moonSymbol: {
      alignItems: 'center',
      marginVertical: Spacing.sm,
    },
    phaseTitle: {
      fontFamily: Fonts.header,
      fontSize: 20,
      color: colors.silver,
      textAlign: 'center',
    },
    phaseDuration: {
      fontSize: 12,
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: 2,
      marginBottom: Spacing.md,
    },
    phaseDesc: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    fertilityRow: {
      gap: Spacing.md,
      marginBottom: Spacing.md,
    },
    fertilityItem: {
      marginBottom: Spacing.sm,
    },
    fertilityLabel: {
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 2,
    },
    fertilityValue: {
      fontSize: 15,
      color: colors.textPrimary,
      fontFamily: Fonts.subheader,
    },
    pregnancyBox: {
      marginTop: Spacing.sm,
      paddingTop: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.textMuted + '30',
      alignItems: 'center',
    },
    pregnancyTitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: Spacing.sm,
    },
    pregnancyBadge: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
    },
    pregnancyLevel: {
      fontFamily: Fonts.subheader,
      fontSize: 14,
      fontWeight: '600',
    },
    pregnancyDesc: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: Spacing.sm,
    },
    trackingTip: {
      fontSize: 12,
      color: colors.silver,
      marginTop: Spacing.sm,
      textAlign: 'center',
      fontStyle: 'italic',
      paddingHorizontal: Spacing.md,
    },
    tagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    tag: {
      backgroundColor: colors.plum,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs + 2,
      borderRadius: BorderRadius.xl,
    },
    tagText: {
      color: colors.lavender,
      fontSize: 12,
    },
    emptyIcon: {
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    emptyText: {
      textAlign: 'center',
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 22,
    },
  });
}
