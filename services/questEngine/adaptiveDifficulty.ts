export function calculateDifficultyMultiplier(level: number, streak: number): number {
  const levelMultiplier = Math.pow(1.15, level / 5);

  const streakMultiplier = 1 + (Math.min(streak, 30) * 0.02);

  const combinedMultiplier = levelMultiplier * streakMultiplier;

  return Math.max(1.0, Math.min(combinedMultiplier, 10.0));
}

export function calculateXPMultiplier(streak: number, penaltyMode: boolean): number {
  if (penaltyMode) {
    return 0.5;
  }

  if (streak >= 30) {
    return 2.0;
  } else if (streak >= 14) {
    return 1.5;
  } else if (streak >= 7) {
    return 1.25;
  }

  return 1.0;
}

export function shouldUnlockBossQuest(level: number, completedDailyQuests: number): boolean {
  if (level < 5) return false;

  return completedDailyQuests >= 10;
}

export function shouldUnlockRaidQuest(level: number, completedBossQuests: number): boolean {
  if (level < 25) return false;

  return completedBossQuests >= 3;
}
