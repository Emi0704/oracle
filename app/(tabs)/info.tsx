import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Fonts, Spacing, BorderRadius, ThemeColors } from '../../constants/theme';
import { ScreenContainer } from '../../components/ScreenContainer';
import { WitchyCard } from '../../components/WitchyCard';
import { MoonPhaseIcon } from '../../components/MoonPhaseIcon';
import { SymptomIcon, Sparkle } from '../../components/SymptomIcon';
import { useCycle } from '../../context/CycleContext';
import { PHASE_INFO } from '../../constants/cycleInfo';
import { PHASE_MOON } from '../../constants/cycleMoon';
import { SYMPTOM_LIST } from '../../constants/symptoms';
import { GLOSSARY, WARNING_SIGNS, getDailyMyths } from '../../constants/lore';
import { CyclePhase } from '../../types/cycle';

export default function InfoScreen() {
  const { colors } = useCycle();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const dailyMyths = getDailyMyths(3);

  return (
    <ScreenContainer>
      <Text style={styles.header}>The Codex</Text>
      <Text style={styles.subtitle}>A compendium of cycle wisdom</Text>

      <Text style={styles.sectionTitle}>Myths &amp; Truths</Text>
      <Text style={styles.rotateNote}>A new set unveils itself each day</Text>
      {dailyMyths.map((entry, i) => (
        <WitchyCard key={entry.myth} style={styles.symptomCard}>
          <View style={styles.mythRow}>
            <Text style={styles.mythLabel}>Myth</Text>
            <Text style={styles.mythText}>{entry.myth}</Text>
          </View>
          <View style={styles.truthBlock}>
            <View style={styles.truthHeader}>
              <Sparkle size={11} color={colors.silver} />
              <Text style={styles.truthLabel}>Truth</Text>
            </View>
            <Text style={styles.truthText}>{entry.truth}</Text>
          </View>
        </WitchyCard>
      ))}

      <Text style={styles.sectionTitle}>Signs to Heed</Text>
      <WitchyCard variant="tarot">
        <Text style={styles.warningIntro}>
          The body speaks in signs. If you notice any of these, it&apos;s worth consulting a healthcare provider.
        </Text>
        {WARNING_SIGNS.map((sign, i) => (
          <View key={i} style={styles.tipRow}>
            <Text style={styles.tipStar}>✦</Text>
            <Text style={styles.tipText}>{sign}</Text>
          </View>
        ))}
      </WitchyCard>

      <Text style={styles.sectionTitle}>The Four Phases</Text>
      {(Object.keys(PHASE_INFO) as CyclePhase[]).map((phase) => {
        const info = PHASE_INFO[phase];
        return (
          <WitchyCard key={phase}>
            <View style={styles.phaseHeader}>
              <MoonPhaseIcon phase={PHASE_MOON[phase]} size={30} />
              <View style={styles.phaseHeaderText}>
                <Text style={styles.phaseTitle}>{info.tarotName}</Text>
                <Text style={styles.phaseSub}>{info.title} · {info.duration}</Text>
              </View>
            </View>
            <Text style={styles.phaseDesc}>{info.description}</Text>

            <Text style={styles.subHeading}>Common Signs</Text>
            <View style={styles.tagContainer}>
              {info.symptoms.map((s, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{s}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.subHeading}>Self-Care Rituals</Text>
            {info.selfCare.map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <Text style={styles.tipStar}>✦</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </WitchyCard>
        );
      })}

      <Text style={styles.sectionTitle}>Symptom Glossary</Text>
      {SYMPTOM_LIST.map((symptom) => (
        <WitchyCard key={symptom.key} style={styles.symptomCard}>
          <View style={styles.symptomRow}>
            <View style={styles.symptomIconWrap}>
              <SymptomIcon type={symptom.key} size={24} color={colors.silver} />
            </View>
            <View style={styles.symptomContent}>
              <Text style={styles.symptomTitle}>{symptom.label}</Text>
              <Text style={styles.symptomDesc}>{symptom.description}</Text>
            </View>
          </View>
        </WitchyCard>
      ))}

      <Text style={styles.sectionTitle}>Cycle Glossary</Text>
      <WitchyCard>
        {GLOSSARY.map((entry, i) => (
          <View key={entry.term} style={[styles.glossaryRow, i === GLOSSARY.length - 1 && styles.glossaryRowLast]}>
            <Text style={styles.glossaryTerm}>{entry.term}</Text>
            <Text style={styles.glossaryDef}>{entry.definition}</Text>
          </View>
        ))}
      </WitchyCard>

      <Text style={styles.disclaimer}>
        The Codex offers general knowledge, not medical advice. When in doubt, consult a healthcare provider.
      </Text>
    </ScreenContainer>
  );
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
    sectionTitle: {
      fontFamily: Fonts.header,
      fontSize: 18,
      color: colors.silver,
      textAlign: 'center',
      marginTop: Spacing.lg,
      marginBottom: Spacing.sm,
    },
    phaseHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      marginBottom: Spacing.sm,
    },
    phaseHeaderText: {
      flex: 1,
    },
    phaseTitle: {
      fontFamily: Fonts.header,
      fontSize: 17,
      color: colors.textPrimary,
    },
    phaseSub: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
    },
    phaseDesc: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: Spacing.md,
    },
    subHeading: {
      fontFamily: Fonts.subheader,
      fontSize: 12,
      color: colors.lavender,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: Spacing.sm,
      marginTop: Spacing.xs,
    },
    tagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      marginBottom: Spacing.md,
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
    tipRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      marginBottom: Spacing.sm,
    },
    tipStar: {
      color: colors.silver,
      fontSize: 12,
    },
    tipText: {
      color: colors.textPrimary,
      fontSize: 14,
      flex: 1,
    },
    symptomCard: {
      marginVertical: Spacing.xs,
    },
    symptomRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Spacing.md,
    },
    symptomIconWrap: {
      paddingTop: 2,
    },
    symptomContent: {
      flex: 1,
    },
    symptomTitle: {
      fontFamily: Fonts.subheader,
      fontSize: 15,
      color: colors.textPrimary,
      marginBottom: 2,
    },
    symptomDesc: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    glossaryRow: {
      marginBottom: Spacing.md,
      paddingBottom: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.textMuted + '25',
    },
    glossaryRowLast: {
      marginBottom: 0,
      paddingBottom: 0,
      borderBottomWidth: 0,
    },
    glossaryTerm: {
      fontFamily: Fonts.subheader,
      fontSize: 14,
      color: colors.silver,
      marginBottom: 2,
    },
    glossaryDef: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    mythRow: {
      marginBottom: Spacing.sm,
    },
    mythLabel: {
      fontFamily: Fonts.subheader,
      fontSize: 11,
      color: colors.crimson,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 2,
    },
    mythText: {
      fontSize: 14,
      color: colors.textPrimary,
      fontStyle: 'italic',
    },
    truthBlock: {
      paddingTop: Spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.textMuted + '25',
    },
    truthHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      marginBottom: Spacing.xs,
    },
    truthLabel: {
      fontFamily: Fonts.subheader,
      fontSize: 11,
      color: colors.silver,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    rotateNote: {
      fontSize: 11,
      color: colors.textMuted,
      textAlign: 'center',
      fontStyle: 'italic',
      marginBottom: Spacing.sm,
    },
    truthText: {
      fontSize: 13,
      color: colors.textSecondary,
      flex: 1,
      lineHeight: 18,
    },
    warningIntro: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 19,
      marginBottom: Spacing.md,
      textAlign: 'center',
    },
    disclaimer: {
      fontSize: 11,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: 16,
      marginTop: Spacing.lg,
      marginBottom: Spacing.md,
      paddingHorizontal: Spacing.md,
    },
  });
}
