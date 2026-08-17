import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { Fonts, Spacing, BorderRadius, ThemeColors } from '../../constants/theme';
import { ScreenContainer } from '../../components/ScreenContainer';
import { WitchyCard } from '../../components/WitchyCard';
import { TabIcon } from '../../components/TabIcon';
import { useCycle } from '../../context/CycleContext';
import { getAverageCycleLength, getAveragePeriodLength, getCycleLengths } from '../../lib/predictions';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 80;
const CHART_HEIGHT = 160;

const AVERAGE_CYCLE = {
  cycleLength: 28,
  periodLength: 5,
  follicularLength: 13,
  lutealLength: 14,
  ovulationDay: 14,
};

const NORMAL_RANGES = {
  cycleLength: { min: 21, max: 35 },
  periodLength: { min: 2, max: 7 },
  follicularLength: { min: 10, max: 16 },
  lutealLength: { min: 11, max: 17 },
};

interface ComparisonMetric {
  label: string;
  yours: number | null;
  average: number;
  normalMin: number;
  normalMax: number;
  unit: string;
}

export default function CompareScreen() {
  const { data, colors } = useCycle();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const metrics: ComparisonMetric[] = useMemo(() => {
    const avgCycle = data.periods.length >= 2 ? getAverageCycleLength(data.periods) : null;
    const avgPeriod = data.periods.length >= 1 ? getAveragePeriodLength(data.periods) : null;

    const follicular = avgCycle && avgPeriod ? avgCycle - 14 - avgPeriod + 1 : null;
    const luteal = avgCycle ? 14 : null;

    return [
      {
        label: 'Cycle Length',
        yours: avgCycle,
        average: AVERAGE_CYCLE.cycleLength,
        normalMin: NORMAL_RANGES.cycleLength.min,
        normalMax: NORMAL_RANGES.cycleLength.max,
        unit: 'days',
      },
      {
        label: 'Period Duration',
        yours: avgPeriod,
        average: AVERAGE_CYCLE.periodLength,
        normalMin: NORMAL_RANGES.periodLength.min,
        normalMax: NORMAL_RANGES.periodLength.max,
        unit: 'days',
      },
      {
        label: 'Follicular Phase',
        yours: follicular,
        average: AVERAGE_CYCLE.follicularLength,
        normalMin: NORMAL_RANGES.follicularLength.min,
        normalMax: NORMAL_RANGES.follicularLength.max,
        unit: 'days',
      },
      {
        label: 'Luteal Phase',
        yours: luteal,
        average: AVERAGE_CYCLE.lutealLength,
        normalMin: NORMAL_RANGES.lutealLength.min,
        normalMax: NORMAL_RANGES.lutealLength.max,
        unit: 'days',
      },
    ];
  }, [data.periods]);

  const cycleLengths = useMemo(() => getCycleLengths(data.periods), [data.periods]);
  const hasData = data.periods.length >= 2;

  return (
    <ScreenContainer>
      <Text style={styles.header}>The Mirror</Text>
      <Text style={styles.subtitle}>Your cycle reflected against the norm</Text>

      {hasData ? (
        <>
          {/* Bar Chart Comparison */}
          <WitchyCard title="Your Cycle vs Average">
            <ComparisonChart metrics={metrics} colors={colors} styles={styles} />
          </WitchyCard>

          {/* Detailed Metrics */}
          {metrics.map((metric, i) => (
            <WitchyCard key={i}>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <View style={styles.metricValues}>
                  <View style={styles.metricValue}>
                    <Text style={styles.metricNumber}>
                      {metric.yours ?? '—'}
                    </Text>
                    <Text style={styles.metricSub}>Yours</Text>
                  </View>
                  <Text style={styles.metricVs}>vs</Text>
                  <View style={styles.metricValue}>
                    <Text style={[styles.metricNumber, styles.metricAvg]}>
                      {metric.average}
                    </Text>
                    <Text style={styles.metricSub}>Average</Text>
                  </View>
                </View>
                {metric.yours !== null && (
                  <StatusBadge value={metric.yours} min={metric.normalMin} max={metric.normalMax} styles={styles} />
                )}
                <Text style={styles.rangeText}>
                  Normal range: {metric.normalMin}–{metric.normalMax} {metric.unit}
                </Text>
              </View>
            </WitchyCard>
          ))}

          {/* Cycle History */}
          {cycleLengths.length > 0 && (
            <WitchyCard title="Cycle History">
              <CycleHistoryChart lengths={cycleLengths} colors={colors} styles={styles} />
              <Text style={styles.historyNote}>
                Past {cycleLengths.length} cycles recorded
              </Text>
            </WitchyCard>
          )}
        </>
      ) : (
        <WitchyCard variant="tarot">
          <View style={styles.emptyIcon}>
            <TabIcon name="mirror" color={colors.silver} size={48} />
          </View>
          <Text style={styles.emptyText}>
            The mirror needs more reflections.{'\n'}Log at least 2 periods to see how your cycle compares to the average.
          </Text>
        </WitchyCard>
      )}
    </ScreenContainer>
  );
}

type Styles = ReturnType<typeof createStyles>;

function ComparisonChart({ metrics, colors, styles }: { metrics: ComparisonMetric[]; colors: ThemeColors; styles: Styles }) {
  const barWidth = 20;
  const gap = CHART_WIDTH / (metrics.length + 1);
  const maxVal = Math.max(...metrics.map((m) => Math.max(m.yours || 0, m.average))) * 1.2;

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT + 30} style={styles.chart}>
      <Line x1={0} y1={CHART_HEIGHT} x2={CHART_WIDTH} y2={CHART_HEIGHT} stroke={colors.textMuted + '40'} strokeWidth={1} />
      {metrics.map((metric, i) => {
        const x = gap * (i + 1) - barWidth;
        const yoursHeight = metric.yours ? (metric.yours / maxVal) * CHART_HEIGHT : 0;
        const avgHeight = (metric.average / maxVal) * CHART_HEIGHT;

        return (
          <React.Fragment key={i}>
            {metric.yours !== null && (
              <Rect
                x={x - barWidth / 2 - 2}
                y={CHART_HEIGHT - yoursHeight}
                width={barWidth}
                height={yoursHeight}
                fill={colors.silver}
                rx={4}
                opacity={0.8}
              />
            )}
            <Rect
              x={x + barWidth / 2 + 2}
              y={CHART_HEIGHT - avgHeight}
              width={barWidth}
              height={avgHeight}
              fill={colors.lavender}
              rx={4}
              opacity={0.5}
            />
            <SvgText
              x={x + barWidth / 2}
              y={CHART_HEIGHT + 16}
              fontSize={9}
              fill={colors.textMuted}
              textAnchor="middle"
            >
              {metric.label.split(' ')[0]}
            </SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

function CycleHistoryChart({ lengths, colors, styles }: { lengths: number[]; colors: ThemeColors; styles: Styles }) {
  const maxVal = Math.max(...lengths) + 5;
  const minVal = Math.min(...lengths) - 5;
  const range = maxVal - minVal;
  const barWidth = Math.min(30, (CHART_WIDTH - 20) / lengths.length - 4);

  return (
    <Svg width={CHART_WIDTH} height={100} style={styles.chart}>
      <Line x1={0} y1={80} x2={CHART_WIDTH} y2={80} stroke={colors.textMuted + '40'} strokeWidth={1} />
      {/* Average line */}
      <Line
        x1={0}
        y1={80 - ((28 - minVal) / range) * 70}
        x2={CHART_WIDTH}
        y2={80 - ((28 - minVal) / range) * 70}
        stroke={colors.silver + '50'}
        strokeWidth={1}
        strokeDasharray="4,4"
      />
      {lengths.map((len, i) => {
        const x = (i + 0.5) * (CHART_WIDTH / lengths.length);
        const height = ((len - minVal) / range) * 70;
        return (
          <React.Fragment key={i}>
            <Rect
              x={x - barWidth / 2}
              y={80 - height}
              width={barWidth}
              height={height}
              fill={len >= 21 && len <= 35 ? colors.silver : colors.crimson}
              rx={3}
              opacity={0.7}
            />
            <SvgText x={x} y={95} fontSize={9} fill={colors.textMuted} textAnchor="middle">
              {len}
            </SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

function StatusBadge({ value, min, max, styles }: { value: number; min: number; max: number; styles: Styles }) {
  const isNormal = value >= min && value <= max;
  const isLow = value < min;

  return (
    <View style={[styles.badge, isNormal ? styles.badgeNormal : styles.badgeAbnormal]}>
      <Text style={[styles.badgeText, isNormal ? styles.badgeTextNormal : styles.badgeTextAbnormal]}>
        {isNormal ? 'Within normal range' : isLow ? 'Below average' : 'Above average'}
      </Text>
    </View>
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
    chart: {
      alignSelf: 'center',
      marginVertical: Spacing.sm,
    },
    metricRow: {
      gap: Spacing.sm,
    },
    metricLabel: {
      fontFamily: Fonts.subheader,
      fontSize: 15,
      color: colors.silver,
      marginBottom: Spacing.xs,
    },
    metricValues: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.lg,
    },
    metricValue: {
      alignItems: 'center',
    },
    metricNumber: {
      fontFamily: Fonts.header,
      fontSize: 28,
      color: colors.textPrimary,
    },
    metricAvg: {
      color: colors.lavender,
    },
    metricSub: {
      fontSize: 11,
      color: colors.textMuted,
    },
    metricVs: {
      fontSize: 12,
      color: colors.textMuted,
      fontStyle: 'italic',
    },
    rangeText: {
      fontSize: 11,
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: Spacing.xs,
    },
    badge: {
      alignSelf: 'center',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.xl,
      marginTop: Spacing.sm,
    },
    badgeNormal: {
      backgroundColor: colors.mysticTeal + '30',
      borderWidth: 1,
      borderColor: colors.mysticTeal,
    },
    badgeAbnormal: {
      backgroundColor: colors.crimson + '30',
      borderWidth: 1,
      borderColor: colors.crimson,
    },
    badgeText: {
      fontSize: 12,
      fontFamily: Fonts.subheader,
    },
    badgeTextNormal: {
      color: '#2b9d8f',
    },
    badgeTextAbnormal: {
      color: colors.crimson,
    },
    historyNote: {
      fontSize: 11,
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: Spacing.sm,
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
