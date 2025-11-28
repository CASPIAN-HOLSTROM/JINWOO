import type { Rank } from './rankSystem';

export interface TitleUnlockCheck {
  titleId: string;
  unlocked: boolean;
  progress?: string;
}

export async function checkTitleUnlocks(
  hunterId: string,
  stats: {
    level: number;
    rank: Rank;
    streak: number;
    totalXP: number;
    strength: number;
    intelligence: number;
    willpower: number;
    discipline: number;
    endurance: number;
  },
  questCounts: {
    total: number;
    daily: number;
    boss: number;
    raid: number;
    business: number;
    skill: number;
    physical: number;
    mind: number;
  }
): Promise<TitleUnlockCheck[]> {
  const checks: TitleUnlockCheck[] = [];

  if (stats.level >= 5 && stats.level < 10) {
    checks.push({ titleId: 'level-5', unlocked: true });
  }
  if (stats.level >= 10 && stats.level < 25) {
    checks.push({ titleId: 'level-10', unlocked: true });
  }
  if (stats.level >= 25 && stats.level < 50) {
    checks.push({ titleId: 'level-25', unlocked: true });
  }
  if (stats.level >= 50 && stats.level < 75) {
    checks.push({ titleId: 'level-50', unlocked: true });
  }
  if (stats.level >= 75 && stats.level < 100) {
    checks.push({ titleId: 'level-75', unlocked: true });
  }
  if (stats.level >= 100) {
    checks.push({ titleId: 'level-100', unlocked: true });
  }

  if (stats.rank === 'S') {
    checks.push({ titleId: 'rank-s', unlocked: true });
  }
  if (stats.rank === 'SS') {
    checks.push({ titleId: 'rank-ss', unlocked: true });
  }
  if (stats.rank === 'SSS') {
    checks.push({ titleId: 'rank-sss', unlocked: true });
  }

  if (stats.streak >= 7) {
    checks.push({ titleId: 'streak-7', unlocked: true });
  }
  if (stats.streak >= 30) {
    checks.push({ titleId: 'streak-30', unlocked: true });
  }
  if (stats.streak >= 100) {
    checks.push({ titleId: 'streak-100', unlocked: true });
  }

  if (questCounts.total >= 100) {
    checks.push({ titleId: 'quests-100', unlocked: true });
  }
  if (questCounts.total >= 500) {
    checks.push({ titleId: 'quests-500', unlocked: true });
  }

  if (questCounts.boss >= 10) {
    checks.push({ titleId: 'boss-slayer', unlocked: true });
  }

  if (stats.discipline >= 100) {
    checks.push({ titleId: 'discipline-master', unlocked: true });
  }

  return checks;
}
