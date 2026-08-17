import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Fonts, Spacing, BorderRadius, ThemeColors } from '../../constants/theme';
import { ScreenContainer } from '../../components/ScreenContainer';
import { WitchyCard } from '../../components/WitchyCard';
import { WitchyButton } from '../../components/WitchyButton';
import { ConfirmModal } from '../../components/ConfirmModal';
import { SettingsModal } from '../../components/SettingsModal';
import { MoonPhaseIcon, getMoonPhaseForDate } from '../../components/MoonPhaseIcon';
import { SymptomIcon, DropIcon, Sparkle, GearIcon } from '../../components/SymptomIcon';
import { useCycle } from '../../context/CycleContext';
import { getPrediction, getFertilityForDate, getTrackingAdvisory, getDayInfo } from '../../lib/predictions';
import { SYMPTOM_LIST } from '../../constants/symptoms';
import { PHASE_INFO } from '../../constants/cycleInfo';
import { PHASE_MOON } from '../../constants/cycleMoon';
import { FlowLevel, SymptomType } from '../../types/cycle';

const FLOW_LEVELS: { key: FlowLevel; label: string; drops: number }[] = [
  { key: 'light', label: 'Light', drops: 1 },
  { key: 'medium', label: 'Medium', drops: 2 },
  { key: 'heavy', label: 'Heavy', drops: 3 },
];

const POSITIVE_COLOR = '#2b9d8f';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function HomeScreen() {
  const { data, addPeriod, updatePeriod, deletePeriod, logSymptoms, colors } = useCycle();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const prediction = useMemo(() => getPrediction(data.periods, data.settings.defaultCycleLength), [data.periods, data.settings.defaultCycleLength]);

  const today = new Date().toISOString().split('T')[0];
  const moonPhase = getMoonPhaseForDate(new Date());

  const [periodStart, setPeriodStart] = useState<string | null>(null);
  const [periodEnd, setPeriodEnd] = useState<string | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<FlowLevel | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomType[]>([]);
  const [editingPeriodId, setEditingPeriodId] = useState<string | null>(null);
  const [symptomDay, setSymptomDay] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [forecastDate, setForecastDate] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  };

  const daysUntilPeriod = useMemo(() => {
    if (!prediction) return null;
    const next = new Date(prediction.nextPeriodStart).getTime();
    const now = new Date(today).getTime();
    return Math.ceil((next - now) / (1000 * 60 * 60 * 24));
  }, [prediction, today]);

  const daysUntilLabel =
    daysUntilPeriod === null ? '—' : daysUntilPeriod === 0 ? 'Today' : daysUntilPeriod < 0 ? `${Math.abs(daysUntilPeriod)}d late` : String(daysUntilPeriod);

  const trackingAdvisory = useMemo(() => {
    if (!prediction || data.settings.trackingMode === 'normal') return null;
    const fertility = getFertilityForDate(today, data.periods, data.settings.defaultCycleLength);
    const isPastFertileWindow = new Date(today).getTime() > new Date(prediction.fertileWindowEnd).getTime();
    return getTrackingAdvisory(data.settings.trackingMode, fertility, isPastFertileWindow);
  }, [prediction, data.settings.trackingMode, data.periods, data.settings.defaultCycleLength, today]);

  const forecastInfo = useMemo(() => {
    if (!forecastDate || !prediction) return null;
    return getDayInfo(forecastDate, data.periods, data.settings.defaultCycleLength);
  }, [forecastDate, prediction, data.periods, data.settings.defaultCycleLength]);

  const findPeriodForDate = (date: string) =>
    data.periods.find((p) => date >= p.startDate && date <= (p.endDate || p.startDate));

  const handleDayPress = (day: DateData) => {
    const dateStr = day.dateString;
    if (dateStr > today) {
      setPeriodStart(null);
      setPeriodEnd(null);
      setSelectedFlow(null);
      setSelectedSymptoms([]);
      setEditingPeriodId(null);
      setSymptomDay(null);
      setForecastDate(dateStr);
      return;
    }

    setForecastDate(null);
    setSymptomDay(dateStr);
    const existingSymptomEntry = data.symptoms.find((s) => s.date === dateStr);
    setSelectedSymptoms(existingSymptomEntry ? existingSymptomEntry.symptoms : []);

    if (!periodStart || (periodStart && periodEnd)) {
      const existingPeriod = findPeriodForDate(dateStr);
      if (existingPeriod) {
        setPeriodStart(existingPeriod.startDate);
        setPeriodEnd(existingPeriod.endDate);
        setSelectedFlow(existingPeriod.flowIntensity[0] || null);
        setEditingPeriodId(existingPeriod.id);
      } else {
        setPeriodStart(dateStr);
        setPeriodEnd(null);
        setSelectedFlow(null);
        setEditingPeriodId(null);
      }
    } else if (new Date(dateStr) < new Date(periodStart)) {
      setPeriodEnd(periodStart);
      setPeriodStart(dateStr);
    } else {
      setPeriodEnd(dateStr);
    }
  };

  const clearSelection = () => {
    setPeriodStart(null);
    setPeriodEnd(null);
    setSelectedFlow(null);
    setSelectedSymptoms([]);
    setEditingPeriodId(null);
    setSymptomDay(null);
  };

  const handleSavePeriod = () => {
    if (!periodStart) return;
    const flow: FlowLevel[] = selectedFlow ? [selectedFlow] : [];
    if (editingPeriodId) {
      updatePeriod({ id: editingPeriodId, startDate: periodStart, endDate: periodEnd, flowIntensity: flow });
    } else {
      addPeriod(periodStart, periodEnd || undefined, flow);
    }
    showToast('Recorded in the grimoire');
  };

  const handleDeletePeriod = () => setConfirmDeleteVisible(true);

  const confirmDeletePeriod = () => {
    if (editingPeriodId) deletePeriod(editingPeriodId);
    setConfirmDeleteVisible(false);
    clearSelection();
    showToast('This page has been torn from the grimoire');
  };

  const handleSaveSymptoms = () => {
    if (!symptomDay || selectedSymptoms.length === 0) return;
    logSymptoms(symptomDay, selectedSymptoms);
    showToast('Recorded in the grimoire');
  };

  const toggleSymptom = (symptom: SymptomType) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const getMarkedDates = () => {
    const marks: Record<string, any> = {};

    data.periods.forEach((period) => {
      const start = new Date(period.startDate);
      const end = period.endDate ? new Date(period.endDate) : start;
      const current = new Date(start);
      while (current <= end) {
        const dateStr = current.toISOString().split('T')[0];
        marks[dateStr] = {
          ...(marks[dateStr] || {}),
          customStyles: {
            container: { backgroundColor: colors.crimson + '40', borderRadius: 4 },
            text: { color: colors.textPrimary },
          },
        };
        current.setDate(current.getDate() + 1);
      }
    });

    if (prediction) {
      const fertStart = new Date(prediction.fertileWindowStart);
      const fertEnd = new Date(prediction.fertileWindowEnd);
      const current = new Date(fertStart);
      while (current <= fertEnd) {
        const dateStr = current.toISOString().split('T')[0];
        if (!marks[dateStr]) {
          marks[dateStr] = {
            customStyles: {
              container: { backgroundColor: colors.mysticTeal + '60', borderRadius: 4 },
              text: { color: colors.textPrimary },
            },
          };
        }
        current.setDate(current.getDate() + 1);
      }

      marks[prediction.ovulationDate] = {
        ...(marks[prediction.ovulationDate] || {}),
        customStyles: {
          container: { backgroundColor: colors.silver + '40', borderRadius: 4, borderWidth: 1, borderColor: colors.silver },
          text: { color: colors.silver, fontWeight: 'bold' },
        },
      };

      const predStart = new Date(prediction.nextPeriodStart);
      for (let i = 0; i < prediction.predictedPeriodLength; i++) {
        const d = new Date(predStart);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        if (!marks[dateStr] || !marks[dateStr]?.customStyles?.container?.backgroundColor?.startsWith?.(colors.crimson)) {
          marks[dateStr] = {
            ...(marks[dateStr] || {}),
            customStyles: {
              container: { backgroundColor: colors.crimson + '20', borderRadius: 4, borderWidth: 1, borderColor: colors.crimson + '60', borderStyle: 'dashed' },
              text: { color: colors.crimson },
            },
          };
        }
      }
    }

    if (!marks[today]) {
      marks[today] = { customStyles: { container: {}, text: { color: colors.silver } } };
    }
    marks[today] = {
      ...marks[today],
      customStyles: {
        container: { ...(marks[today].customStyles?.container || {}), borderWidth: 1, borderColor: colors.silver },
        text: { ...(marks[today].customStyles?.text || {}), color: colors.silver },
      },
    };

    if (periodStart) {
      const start = new Date(periodStart);
      const end = periodEnd ? new Date(periodEnd) : start;
      const current = new Date(start);
      while (current <= end) {
        const dateStr = current.toISOString().split('T')[0];
        marks[dateStr] = {
          ...(marks[dateStr] || {}),
          customStyles: {
            container: {
              ...(marks[dateStr]?.customStyles?.container || {}),
              borderWidth: 2,
              borderColor: colors.silver,
              borderRadius: 4,
            },
            text: { color: colors.textPrimary, fontWeight: 'bold' },
          },
        };
        current.setDate(current.getDate() + 1);
      }
    }

    if (symptomDay && symptomDay !== periodStart) {
      marks[symptomDay] = {
        ...(marks[symptomDay] || {}),
        customStyles: {
          container: { ...(marks[symptomDay]?.customStyles?.container || {}), borderWidth: 1.5, borderColor: colors.lavender, borderRadius: 4 },
          text: { ...(marks[symptomDay]?.customStyles?.text || {}), color: colors.textPrimary },
        },
      };
    }

    if (forecastDate) {
      marks[forecastDate] = {
        ...(marks[forecastDate] || {}),
        customStyles: {
          container: { ...(marks[forecastDate]?.customStyles?.container || {}), borderWidth: 1.5, borderColor: colors.lavender, borderRadius: 4, borderStyle: 'dashed' },
          text: { ...(marks[forecastDate]?.customStyles?.text || {}), color: colors.textPrimary },
        },
      };
    }

    return marks;
  };

  const phaseMoon = prediction ? PHASE_MOON[prediction.currentPhase] : null;
  const phaseLabel = prediction ? PHASE_INFO[prediction.currentPhase].title : null;

  const selectionLabel = periodStart
    ? periodEnd && periodEnd !== periodStart
      ? `${formatDate(periodStart)} – ${formatDate(periodEnd)}`
      : formatDate(periodStart)
    : null;

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.header}>The Oracle</Text>
          <Text style={styles.subtitle}>Your cycle divination</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setSettingsVisible(true)} style={styles.iconBtn}>
            <GearIcon size={22} color={colors.silver} />
          </TouchableOpacity>
          <MoonPhaseIcon phase={moonPhase} size={36} />
        </View>
      </View>

      {toast && (
        <View style={styles.toast}>
          <Sparkle size={12} color={colors.silver} />
          <Text style={styles.toastText}>{toast}</Text>
          <Sparkle size={12} color={colors.silver} />
        </View>
      )}

      {prediction && (
        <WitchyCard variant="glow">
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Text style={styles.statusNumber}>{prediction.currentCycleDay}</Text>
              <Text style={styles.statusLabel}>Cycle Day</Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusItem}>
              <Text style={styles.statusNumber}>{daysUntilLabel}</Text>
              <Text style={styles.statusLabel}>Days Until</Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusItem}>
              <Text style={styles.statusNumber}>{prediction.averageCycleLength}</Text>
              <Text style={styles.statusLabel}>Cycle Length</Text>
            </View>
          </View>
          {phaseMoon && (
            <View style={styles.phaseRow}>
              <MoonPhaseIcon phase={phaseMoon} size={16} color={colors.lavender} />
              <Text style={styles.phaseText}>{phaseLabel}</Text>
            </View>
          )}
        </WitchyCard>
      )}

      {trackingAdvisory && (
        <WitchyCard
          style={[
            styles.advisoryCard,
            trackingAdvisory.tone === 'warning' && { borderColor: colors.crimson },
            trackingAdvisory.tone === 'positive' && { borderColor: POSITIVE_COLOR },
          ]}
        >
          <Text
            style={[
              styles.advisoryTitle,
              trackingAdvisory.tone === 'warning' && { color: colors.crimson },
              trackingAdvisory.tone === 'positive' && { color: POSITIVE_COLOR },
            ]}
          >
            {trackingAdvisory.title}
          </Text>
          <Text style={styles.advisoryMessage}>{trackingAdvisory.message}</Text>
        </WitchyCard>
      )}

      {!prediction && (
        <WitchyCard variant="tarot">
          <Text style={styles.emptyText}>
            The cards await your first entry.{'\n'}Tap a day below to log your first period.
          </Text>
        </WitchyCard>
      )}

      <WitchyCard>
        <Calendar
          markingType="custom"
          markedDates={getMarkedDates()}
          onDayPress={handleDayPress}
          theme={{
            backgroundColor: 'transparent',
            calendarBackground: 'transparent',
            textSectionTitleColor: colors.lavender,
            todayTextColor: colors.silver,
            dayTextColor: colors.textPrimary,
            textDisabledColor: colors.textMuted,
            monthTextColor: colors.silver,
            arrowColor: colors.silver,
            textMonthFontFamily: Fonts.header,
            textDayFontSize: 14,
            textMonthFontSize: 16,
          }}
        />
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.crimson }]} />
            <Text style={styles.legendText}>Period</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.mysticTeal }]} />
            <Text style={styles.legendText}>Fertile</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.silver }]} />
            <Text style={styles.legendText}>Ovulation</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.crimson + '40', borderWidth: 1, borderColor: colors.crimson }]} />
            <Text style={styles.legendText}>Predicted</Text>
          </View>
        </View>
      </WitchyCard>

      {periodStart && (
        <WitchyCard title="The Grimoire Page">
          <View style={styles.selectionRow}>
            <Sparkle size={12} color={colors.silver} />
            <Text style={styles.selectionText}>{selectionLabel}</Text>
            <Sparkle size={12} color={colors.silver} />
          </View>
          {editingPeriodId && <Text style={styles.editingBadge}>~ recalling a page already written ~</Text>}

          <Text style={styles.sectionLabel}>Flow Intensity</Text>
          <View style={styles.flowRow}>
            {FLOW_LEVELS.map((flow) => (
              <TouchableOpacity
                key={flow.key}
                style={[styles.flowBtn, selectedFlow === flow.key && styles.flowBtnActive]}
                onPress={() => setSelectedFlow(flow.key)}
              >
                <View style={styles.flowDrops}>
                  {Array.from({ length: flow.drops }).map((_, i) => (
                    <DropIcon key={i} size={16} color={colors.crimson} filled={selectedFlow === flow.key} />
                  ))}
                </View>
                <Text style={[styles.flowLabel, selectedFlow === flow.key && styles.flowLabelActive]}>
                  {flow.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <WitchyButton title="Record Period" onPress={handleSavePeriod} style={styles.saveBtn} />
          {editingPeriodId && (
            <WitchyButton title="Delete This Period" onPress={handleDeletePeriod} variant="ghost" style={styles.deleteBtn} />
          )}

          <Text style={[styles.sectionLabel, styles.symptomsLabel]}>
            Symptoms for {symptomDay ? formatDate(symptomDay) : ''}
          </Text>
          <View style={styles.symptomsGrid}>
            {SYMPTOM_LIST.map((symptom) => {
              const active = selectedSymptoms.includes(symptom.key);
              return (
                <TouchableOpacity
                  key={symptom.key}
                  style={[styles.symptomBtn, active && styles.symptomBtnActive]}
                  onPress={() => toggleSymptom(symptom.key)}
                >
                  <SymptomIcon type={symptom.key} size={22} color={active ? colors.silver : colors.lavender} />
                  <Text style={[styles.symptomLabel, active && styles.symptomLabelActive]}>
                    {symptom.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <WitchyButton
            title="Record Symptoms"
            onPress={handleSaveSymptoms}
            disabled={selectedSymptoms.length === 0}
            style={styles.saveBtn}
          />

          <WitchyButton title="Close the Grimoire" onPress={clearSelection} variant="ghost" />
        </WitchyCard>
      )}

      {forecastDate && (
        <WitchyCard title="A Glimpse Ahead">
          <View style={styles.selectionRow}>
            <Sparkle size={12} color={colors.lavender} />
            <Text style={styles.selectionText}>{formatDate(forecastDate)}</Text>
            <Sparkle size={12} color={colors.lavender} />
          </View>

          {!forecastInfo ? (
            <Text style={styles.emptyText}>
              Log a period first so the Oracle can peer into your future days.
            </Text>
          ) : (
            <>
              <View style={styles.phaseRow}>
                <MoonPhaseIcon phase={PHASE_MOON[forecastInfo.phase]} size={18} color={colors.lavender} />
                <Text style={styles.phaseText}>{PHASE_INFO[forecastInfo.phase].title}</Text>
              </View>
              {forecastInfo.cycleDay !== null && (
                <Text style={styles.forecastCycleDay}>Predicted cycle day {forecastInfo.cycleDay}</Text>
              )}
              {(forecastInfo.isPredictedPeriod || forecastInfo.isOvulation || forecastInfo.isFertile) && (
                <Text style={styles.forecastStatus}>
                  {[
                    forecastInfo.isPredictedPeriod && 'Predicted period day',
                    forecastInfo.isOvulation && 'Ovulation day',
                    !forecastInfo.isOvulation && forecastInfo.isFertile && 'In fertile window',
                  ].filter(Boolean).join(' · ')}
                </Text>
              )}

              <Text style={styles.phaseDesc}>{PHASE_INFO[forecastInfo.phase].description}</Text>

              <Text style={[styles.sectionLabel, styles.symptomsLabel]}>Expected Symptoms</Text>
              <View style={styles.tagContainer}>
                {PHASE_INFO[forecastInfo.phase].symptoms.map((s, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{s}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.forecastNote}>
                Forecast from {data.periods.length} logged period{data.periods.length === 1 ? '' : 's'}, averaging a {prediction?.averageCycleLength}-day cycle.
              </Text>
            </>
          )}

          <WitchyButton title="Close" onPress={() => setForecastDate(null)} variant="ghost" style={styles.saveBtn} />
        </WitchyCard>
      )}

      <ConfirmModal
        visible={confirmDeleteVisible}
        title="Tear Out This Page?"
        message="This period entry will be removed from the grimoire for good."
        confirmLabel="Delete"
        onConfirm={confirmDeletePeriod}
        onCancel={() => setConfirmDeleteVisible(false)}
      />

      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
    </ScreenContainer>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: Spacing.md,
      marginBottom: Spacing.md,
    },
    header: {
      fontFamily: Fonts.header,
      fontSize: 28,
      color: colors.silver,
    },
    subtitle: {
      fontFamily: Fonts.subheader,
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
    headerIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    iconBtn: {
      padding: Spacing.sm,
    },
    toast: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
      backgroundColor: colors.deepPurple,
      borderWidth: 1,
      borderColor: colors.silver + '80',
      borderRadius: BorderRadius.xl,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      marginBottom: Spacing.md,
    },
    toastText: {
      color: colors.silver,
      fontFamily: Fonts.subheader,
      fontSize: 13,
    },
    statusRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    statusItem: {
      alignItems: 'center',
      maxWidth: 90,
    },
    statusNumber: {
      fontFamily: Fonts.header,
      fontSize: 24,
      color: colors.silver,
    },
    statusLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
      textAlign: 'center',
    },
    statusDivider: {
      width: 1,
      height: 30,
      backgroundColor: colors.silver + '30',
    },
    phaseRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.xs,
      marginTop: Spacing.md,
    },
    phaseText: {
      textAlign: 'center',
      color: colors.lavender,
      fontSize: 14,
      fontFamily: Fonts.subheader,
    },
    forecastCycleDay: {
      textAlign: 'center',
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 2,
    },
    forecastStatus: {
      textAlign: 'center',
      color: colors.silver,
      fontSize: 12,
      fontFamily: Fonts.subheader,
      marginTop: Spacing.xs,
    },
    phaseDesc: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 21,
      marginTop: Spacing.md,
    },
    tagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
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
    forecastNote: {
      fontSize: 11,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: 16,
      marginTop: Spacing.md,
      fontStyle: 'italic',
    },
    advisoryCard: {
      borderWidth: 1.5,
      borderColor: colors.silver,
    },
    advisoryTitle: {
      fontFamily: Fonts.header,
      fontSize: 15,
      color: colors.silver,
      textAlign: 'center',
      marginBottom: Spacing.xs,
    },
    advisoryMessage: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 19,
    },
    emptyText: {
      textAlign: 'center',
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 22,
    },
    legend: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: Spacing.md,
      paddingTop: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.textMuted + '30',
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    legendDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    legendText: {
      fontSize: 11,
      color: colors.textMuted,
    },
    selectionRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    selectionText: {
      textAlign: 'center',
      color: colors.silver,
      fontFamily: Fonts.subheader,
      fontSize: 14,
    },
    editingBadge: {
      textAlign: 'center',
      color: colors.lavender,
      fontSize: 11,
      marginTop: Spacing.xs,
      fontStyle: 'italic',
    },
    sectionLabel: {
      color: colors.lavender,
      fontFamily: Fonts.subheader,
      fontSize: 13,
      marginBottom: Spacing.sm,
      marginTop: Spacing.md,
    },
    symptomsLabel: {
      marginTop: Spacing.lg,
    },
    flowRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    flowBtn: {
      alignItems: 'center',
      padding: Spacing.md,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: 'transparent',
      minWidth: 80,
    },
    flowBtnActive: {
      borderColor: colors.crimson,
      backgroundColor: colors.crimson + '20',
    },
    flowDrops: {
      flexDirection: 'row',
      gap: 2,
      marginBottom: Spacing.xs,
      height: 18,
    },
    flowLabel: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    flowLabelActive: {
      color: colors.crimson,
    },
    symptomsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    symptomBtn: {
      alignItems: 'center',
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: colors.textMuted + '40',
      minWidth: '30%',
      flexGrow: 1,
    },
    symptomBtnActive: {
      borderColor: colors.silver,
      backgroundColor: colors.silver + '15',
    },
    symptomLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 2,
    },
    symptomLabelActive: {
      color: colors.silver,
    },
    saveBtn: {
      marginTop: Spacing.sm,
      marginBottom: Spacing.sm,
    },
    deleteBtn: {
      marginBottom: Spacing.lg,
    },
  });
}
