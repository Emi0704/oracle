import { SymptomType } from '../types/cycle';

export interface SymptomDef {
  key: SymptomType;
  label: string;
  description: string;
}

export const SYMPTOM_LIST: SymptomDef[] = [
  { key: 'cramps', label: 'Cramps', description: 'Uterine contractions as the lining sheds — usually strongest in the first few days.' },
  { key: 'bloating', label: 'Bloating', description: 'Water retention and digestive shifts driven by changing hormone levels.' },
  { key: 'headache', label: 'Headache', description: 'Often tied to the drop in estrogen just before or during your period.' },
  { key: 'fatigue', label: 'Fatigue', description: 'Energy dips as hormone levels fall, especially in the luteal and menstrual phases.' },
  { key: 'mood_swings', label: 'Mood Swings', description: 'Shifting estrogen and progesterone can heighten emotional sensitivity.' },
  { key: 'breast_tenderness', label: 'Tenderness', description: 'Rising progesterone after ovulation can leave breasts feeling sore or swollen.' },
  { key: 'acne', label: 'Acne', description: 'Hormonal shifts increase oil production, often flaring in the days before your period.' },
  { key: 'cravings', label: 'Cravings', description: 'Blood sugar and serotonin dips can drive cravings for sweet or salty foods.' },
  { key: 'backache', label: 'Backache', description: 'The same prostaglandins that trigger uterine cramping can radiate to the lower back.' },
  { key: 'nausea', label: 'Nausea', description: 'Prostaglandins and hormone shifts can unsettle the stomach, mostly early in your period.' },
  { key: 'insomnia', label: 'Insomnia', description: 'Falling progesterone in the days before your period can disrupt sleep.' },
  { key: 'anxiety', label: 'Anxiety', description: 'Hormonal fluctuations in the luteal phase can heighten stress and worry.' },
];
