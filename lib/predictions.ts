import { PeriodEntry, PredictionResult, CyclePhase, FertilityLevel, DayInfo, TrackingMode } from '../types/cycle';

function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA);
  const b = new Date(dateB);
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function addDays(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getCycleLengths(periods: PeriodEntry[]): number[] {
  if (periods.length < 2) return [];

  const sorted = [...periods].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const lengths: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const days = daysBetween(sorted[i - 1].startDate, sorted[i].startDate);
    if (days > 15 && days < 60) {
      lengths.push(days);
    }
  }
  return lengths;
}

export function getAverageCycleLength(periods: PeriodEntry[], defaultLength: number = 28): number {
  const lengths = getCycleLengths(periods);
  if (lengths.length === 0) return defaultLength;

  if (lengths.length < 3) {
    const sum = lengths.reduce((a, b) => a + b, 0);
    return Math.round(sum / lengths.length);
  }

  // Weighted moving average: recent cycles weigh more
  let totalWeight = 0;
  let weightedSum = 0;
  for (let i = 0; i < lengths.length; i++) {
    const weight = i < lengths.length - 1 ? 1 : i === lengths.length - 1 ? 2 : 3;
    const actualWeight = i === lengths.length - 1 ? 3 : i === lengths.length - 2 ? 2 : 1;
    weightedSum += lengths[i] * actualWeight;
    totalWeight += actualWeight;
  }
  return Math.round(weightedSum / totalWeight);
}

export function getAveragePeriodLength(periods: PeriodEntry[], defaultLength: number = 5): number {
  const periodsWithEnd = periods.filter((p) => p.endDate);
  if (periodsWithEnd.length === 0) return defaultLength;

  const lengths = periodsWithEnd.map((p) => daysBetween(p.startDate, p.endDate!) + 1);
  const sum = lengths.reduce((a, b) => a + b, 0);
  return Math.round(sum / lengths.length);
}

export function getPrediction(periods: PeriodEntry[], defaultCycleLength: number = 28): PredictionResult | null {
  if (periods.length === 0) return null;

  const sorted = [...periods].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
  const lastPeriod = sorted[0];
  const avgCycleLength = getAverageCycleLength(periods, defaultCycleLength);
  const avgPeriodLength = getAveragePeriodLength(periods);

  const nextPeriodStart = addDays(lastPeriod.startDate, avgCycleLength);
  const ovulationDate = addDays(nextPeriodStart, -14);
  const fertileWindowStart = addDays(ovulationDate, -5);
  const fertileWindowEnd = ovulationDate;

  const today = toDateString(new Date());
  const currentCycleDay = daysBetween(lastPeriod.startDate, today) + 1;
  const currentPhase = getPhaseForDay(currentCycleDay, avgCycleLength, avgPeriodLength);

  return {
    nextPeriodStart,
    ovulationDate,
    fertileWindowStart,
    fertileWindowEnd,
    currentPhase,
    currentCycleDay,
    averageCycleLength: avgCycleLength,
    predictedPeriodLength: avgPeriodLength,
  };
}

export function getPhaseForDay(cycleDay: number, cycleLength: number, periodLength: number): CyclePhase {
  if (cycleDay <= periodLength) return 'menstrual';
  const ovulationDay = cycleLength - 14;
  if (cycleDay <= ovulationDay - 3) return 'follicular';
  if (cycleDay <= ovulationDay + 1) return 'ovulatory';
  return 'luteal';
}

export function getFertilityForDate(date: string, periods: PeriodEntry[], defaultCycleLength: number = 28): FertilityLevel {
  const prediction = getPrediction(periods, defaultCycleLength);
  if (!prediction) return 'low';

  const fertileStart = new Date(prediction.fertileWindowStart).getTime();
  const fertileEnd = new Date(prediction.fertileWindowEnd).getTime();
  const ovulation = new Date(prediction.ovulationDate).getTime();
  const dateTime = new Date(date).getTime();

  if (dateTime === ovulation) return 'high';
  if (dateTime >= fertileStart && dateTime <= fertileEnd) return 'high';

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysFromFertile = Math.min(
    Math.abs(dateTime - fertileStart) / msPerDay,
    Math.abs(dateTime - fertileEnd) / msPerDay
  );

  if (daysFromFertile <= 2) return 'medium';
  return 'low';
}

export function getDayInfo(date: string, periods: PeriodEntry[], defaultCycleLength: number = 28): DayInfo {
  const sorted = [...periods].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const isPeriod = periods.some((p) => {
    const start = new Date(p.startDate).getTime();
    const end = p.endDate ? new Date(p.endDate).getTime() : start;
    const d = new Date(date).getTime();
    return d >= start && d <= end;
  });

  const prediction = getPrediction(periods, defaultCycleLength);
  let isPredictedPeriod = false;
  let isFertile = false;
  let isOvulation = false;
  let phase: CyclePhase = 'follicular';
  let fertilityLevel: FertilityLevel = 'low';
  let cycleDay: number | null = null;

  if (prediction) {
    const nextStart = new Date(prediction.nextPeriodStart).getTime();
    const nextEnd = nextStart + (prediction.predictedPeriodLength - 1) * 24 * 60 * 60 * 1000;
    const dateTime = new Date(date).getTime();

    isPredictedPeriod = dateTime >= nextStart && dateTime <= nextEnd;
    isOvulation = date === prediction.ovulationDate;
    isFertile = dateTime >= new Date(prediction.fertileWindowStart).getTime() &&
                dateTime <= new Date(prediction.fertileWindowEnd).getTime();
    fertilityLevel = getFertilityForDate(date, periods, defaultCycleLength);

    if (sorted.length > 0) {
      const lastStart = sorted[0].startDate;
      const daysSince = daysBetween(lastStart, date);
      const cycleLen = prediction.averageCycleLength;
      cycleDay = ((daysSince % cycleLen) + cycleLen) % cycleLen + 1;
      phase = getPhaseForDay(cycleDay, cycleLen, prediction.predictedPeriodLength);
    }
  }

  return { date, isPeriod, isPredictedPeriod, isFertile, isOvulation, phase, fertilityLevel, cycleDay };
}

export function getPregnancyChance(date: string, periods: PeriodEntry[], defaultCycleLength: number = 28): { level: FertilityLevel; percentage: string; description: string; isPastFertileWindow: boolean } {
  const fertility = getFertilityForDate(date, periods, defaultCycleLength);
  const prediction = getPrediction(periods, defaultCycleLength);
  const isPastFertileWindow = prediction ? new Date(date).getTime() > new Date(prediction.fertileWindowEnd).getTime() : false;

  switch (fertility) {
    case 'high':
      return { level: 'high', percentage: '20-33%', description: 'Peak fertility window', isPastFertileWindow };
    case 'medium':
      return {
        level: 'medium',
        percentage: '5-10%',
        description: isPastFertileWindow ? 'Just past fertile window' : 'Approaching fertile window',
        isPastFertileWindow,
      };
    case 'low':
      return { level: 'low', percentage: '<5%', description: 'Outside fertile window', isPastFertileWindow };
  }
}

export type AdvisoryTone = 'warning' | 'positive' | 'neutral';

export function getTrackingAdvisory(
  mode: TrackingMode,
  fertility: FertilityLevel,
  isPastFertileWindow: boolean = false
): { title: string; message: string; tone: AdvisoryTone } | null {
  if (mode === 'conceiving') {
    switch (fertility) {
      case 'high':
        return { title: 'Peak Fertility', message: 'This is one of your best days to try to conceive.', tone: 'positive' };
      case 'medium':
        return isPastFertileWindow
          ? { title: 'Fertility Fading', message: 'Your fertile window just passed — conception is less likely now.', tone: 'neutral' }
          : { title: 'Rising Fertility', message: "You're approaching your fertile window — a good time to start trying.", tone: 'positive' };
      case 'low':
        return { title: 'Low Fertility', message: 'Conception is unlikely today, but every cycle is unique.', tone: 'neutral' };
    }
  }
  if (mode === 'avoiding') {
    switch (fertility) {
      case 'high':
        return { title: 'High Risk', message: 'Peak fertility today — use protection or abstain to avoid pregnancy.', tone: 'warning' };
      case 'medium':
        return isPastFertileWindow
          ? { title: 'Elevated Risk', message: 'Your fertile window just ended — some risk may remain, stay cautious.', tone: 'warning' }
          : { title: 'Elevated Risk', message: "You're approaching your fertile window — stay cautious and use protection.", tone: 'warning' };
      case 'low':
        return { title: 'Lower Risk', message: 'Pregnancy is less likely today, but no day is entirely risk-free.', tone: 'neutral' };
    }
  }
  return null;
}
