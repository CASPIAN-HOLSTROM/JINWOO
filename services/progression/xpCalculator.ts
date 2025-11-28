import { calculateXPMultiplier } from '../questEngine/adaptiveDifficulty';

export interface XPCalculationResult {
  baseXP: number;
  multiplier: number;
  bonusXP: number;
  totalXP: number;
  breakdown: string[];
}

export function calculateQuestXP(
  baseXP: number,
  level: number,
  streak: number,
  penaltyMode: boolean,
  questType: 'Daily' | 'Boss' | 'Raid' | 'Optional'
): XPCalculationResult {
  const breakdown: string[] = [`Base XP: ${baseXP}`];

  const levelBonus = 1 + (level * 0.1);
  breakdown.push(`Level Bonus: x${levelBonus.toFixed(2)}`);

  const streakMultiplier = calculateXPMultiplier(streak, penaltyMode);
  breakdown.push(`Streak Multiplier: x${streakMultiplier.toFixed(2)}`);

  let questTypeMultiplier = 1.0;
  if (questType === 'Boss') {
    questTypeMultiplier = 1.5;
    breakdown.push(`Boss Quest Bonus: x1.5`);
  } else if (questType === 'Raid') {
    questTypeMultiplier = 2.0;
    breakdown.push(`Raid Quest Bonus: x2.0`);
  }

  const combinedMultiplier = levelBonus * streakMultiplier * questTypeMultiplier;
  const totalXP = Math.floor(baseXP * combinedMultiplier);

  return {
    baseXP,
    multiplier: combinedMultiplier,
    bonusXP: totalXP - baseXP,
    totalXP,
    breakdown,
  };
}

export function calculateComboBonus(questsCompletedToday: number): number {
  if (questsCompletedToday >= 5) {
    return 500;
  } else if (questsCompletedToday >= 3) {
    return 200;
  }
  return 0;
}

export function calculatePerfectDayBonus(
  allDailyQuestsCompleted: boolean,
  bossQuestCompleted: boolean
): number {
  let bonus = 0;

  if (allDailyQuestsCompleted) {
    bonus += 1000;
  }

  if (bossQuestCompleted) {
    bonus += 2000;
  }

  return bonus;
}
