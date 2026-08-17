export interface GlossaryTerm {
  term: string;
  definition: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  { term: 'Menarche', definition: 'The very first period, typically arriving between ages 10–15.' },
  { term: 'Ovulation', definition: 'The release of an egg from the ovary — usually around the midpoint of the cycle.' },
  { term: 'Follicular Phase', definition: 'The stretch from day 1 of your period to ovulation, as the body prepares an egg for release.' },
  { term: 'Luteal Phase', definition: 'The stretch after ovulation until your next period begins.' },
  { term: 'Basal Body Temperature', definition: 'Your resting body temperature, which rises slightly after ovulation and can help confirm it happened.' },
  { term: 'Cervical Mucus', definition: 'Vaginal discharge that changes texture through the cycle, becoming clear and stretchy near ovulation.' },
  { term: 'Anovulation', definition: 'A cycle in which no egg is released, which can make a cycle longer or irregular.' },
  { term: 'Amenorrhea', definition: 'The absence of a period for three months or more, outside of pregnancy or menopause.' },
  { term: 'PMS', definition: 'Premenstrual Syndrome — the physical and emotional symptoms that appear in the days before a period.' },
  { term: 'PMDD', definition: 'Premenstrual Dysphoric Disorder — a severe form of PMS that significantly affects daily life.' },
  { term: 'Menopause', definition: 'The point when periods stop permanently, typically between ages 45–55.' },
];

export interface MythEntry {
  myth: string;
  truth: string;
}

export const MYTHS: MythEntry[] = [
  {
    myth: "You can't get pregnant during your period.",
    truth: "It's less likely, but sperm can survive several days — pregnancy is still possible, especially with shorter cycles.",
  },
  {
    myth: 'A regular 28-day cycle is "normal" for everyone.',
    truth: 'Anywhere from 21 to 35 days is considered typical — cycles vary from person to person and month to month.',
  },
  {
    myth: 'PMS is "all in your head."',
    truth: 'PMS is driven by real hormonal shifts and affects most menstruating people to some degree.',
  },
  {
    myth: 'Cycles sync up when you spend time with friends.',
    truth: "Studies haven't found reliable evidence for period syncing — apparent overlaps are usually coincidence.",
  },
  {
    myth: 'Exercise should be avoided during your period.',
    truth: 'Gentle movement can actually ease cramps and lift mood through increased blood flow and endorphins.',
  },
  {
    myth: 'Period blood is somehow "dirty."',
    truth: "It's simply a mix of blood and uterine tissue — the same blood as anywhere else in your body.",
  },
  {
    myth: 'You should avoid swimming during your period.',
    truth: "It's perfectly safe to swim on your period, especially with a tampon, cup, or period-proof swimwear.",
  },
  {
    myth: 'Any irregular cycle means something is wrong.',
    truth: 'Stress, travel, illness, and other life changes can shift a cycle — occasional irregularity is common, not automatically a red flag.',
  },
  {
    myth: "A tampon can affect your virginity.",
    truth: "Virginity isn't a medical or physical status — inserting a tampon, cup, or similar product doesn't change it.",
  },
];

function getDayIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getDailyMyths(count: number = 3): MythEntry[] {
  const startIdx = getDayIndex() % MYTHS.length;
  return Array.from({ length: count }, (_, i) => MYTHS[(startIdx + i) % MYTHS.length]);
}

export const WARNING_SIGNS: string[] = [
  'Periods lasting longer than 7 days',
  'Soaking through a pad or tampon every hour for several hours in a row',
  'Cycles consistently shorter than 21 days or longer than 35 days',
  'No period for 3 months or more, and not pregnant',
  'Pain severe enough to disrupt daily life',
  'Bleeding between periods or after sex',
  'A sudden, unexplained change to a previously regular cycle',
];
