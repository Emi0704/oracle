import { CyclePhase } from '../types/cycle';
import { MoonPhaseIcon } from '../components/MoonPhaseIcon';

export const PHASE_MOON: Record<CyclePhase, Parameters<typeof MoonPhaseIcon>[0]['phase']> = {
  menstrual: 'new',
  follicular: 'waxing-crescent',
  ovulatory: 'full',
  luteal: 'waning-crescent',
};
