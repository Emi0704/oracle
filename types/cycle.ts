export interface PeriodEntry {
  id: string;
  startDate: string;
  endDate: string | null;
  flowIntensity: FlowLevel[];
}

export type FlowLevel = 'light' | 'medium' | 'heavy';

export interface SymptomEntry {
  date: string;
  symptoms: SymptomType[];
  notes?: string;
}

export type SymptomType =
  | 'cramps'
  | 'bloating'
  | 'headache'
  | 'fatigue'
  | 'mood_swings'
  | 'breast_tenderness'
  | 'acne'
  | 'cravings'
  | 'backache'
  | 'nausea'
  | 'insomnia'
  | 'anxiety';

export type ThemeMode = 'light' | 'dark';

export type TrackingMode = 'normal' | 'conceiving' | 'avoiding';

export interface UserSettings {
  defaultCycleLength: number;
  defaultPeriodLength: number;
  themeMode: ThemeMode;
  trackingMode: TrackingMode;
}

export interface CycleData {
  periods: PeriodEntry[];
  symptoms: SymptomEntry[];
  settings: UserSettings;
}

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export type FertilityLevel = 'low' | 'medium' | 'high';

export interface PredictionResult {
  nextPeriodStart: string;
  ovulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  currentPhase: CyclePhase;
  currentCycleDay: number;
  averageCycleLength: number;
  predictedPeriodLength: number;
}

export interface DayInfo {
  date: string;
  isPeriod: boolean;
  isPredictedPeriod: boolean;
  isFertile: boolean;
  isOvulation: boolean;
  phase: CyclePhase;
  fertilityLevel: FertilityLevel;
  cycleDay: number | null;
}
