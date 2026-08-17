import { CyclePhase } from '../types/cycle';

export interface PhaseInfo {
  phase: CyclePhase;
  title: string;
  tarotName: string;
  description: string;
  symptoms: string[];
  selfCare: string[];
  duration: string;
}

export const PHASE_INFO: Record<CyclePhase, PhaseInfo> = {
  menstrual: {
    phase: 'menstrual',
    title: 'Menstrual Phase',
    tarotName: 'The High Priestess',
    description:
      'The veil thins as your body releases and renews. This is a time of deep intuition and rest. Honor your need for solitude and reflection.',
    symptoms: ['Cramps', 'Fatigue', 'Lower back pain', 'Bloating', 'Mood changes'],
    selfCare: ['Rest and sleep', 'Warm baths', 'Gentle stretching', 'Iron-rich foods', 'Hydration'],
    duration: 'Days 1-5 (typically)',
  },
  follicular: {
    phase: 'follicular',
    title: 'Follicular Phase',
    tarotName: 'The Star',
    description:
      'New energy rises like the waxing moon. Creativity blooms and fresh beginnings call. Your body prepares for possibility.',
    symptoms: ['Rising energy', 'Improved mood', 'Clearer skin', 'Increased focus'],
    selfCare: ['Try new activities', 'Creative projects', 'Social connections', 'Cardio exercise'],
    duration: 'Days 6-13 (typically)',
  },
  ovulatory: {
    phase: 'ovulatory',
    title: 'Ovulatory Phase',
    tarotName: 'The Empress',
    description:
      'You radiate at your fullest power, like the full moon illuminating the night. Communication flows and magnetism peaks.',
    symptoms: ['Peak energy', 'Higher libido', 'Slight temperature rise', 'Mild pelvic sensation'],
    selfCare: ['High-intensity exercise', 'Important conversations', 'Social events', 'Express yourself'],
    duration: 'Days 14-16 (typically)',
  },
  luteal: {
    phase: 'luteal',
    title: 'Luteal Phase',
    tarotName: 'The Moon',
    description:
      'The waning moon draws you inward. Emotions deepen and the desire for comfort grows. Listen to what your shadow self whispers.',
    symptoms: ['PMS symptoms', 'Breast tenderness', 'Cravings', 'Mood swings', 'Fatigue'],
    selfCare: ['Comfort foods', 'Journaling', 'Yoga and meditation', 'Set boundaries', 'Magnesium-rich foods'],
    duration: 'Days 17-28 (typically)',
  },
};
