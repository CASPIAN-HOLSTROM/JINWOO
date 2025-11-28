export interface LevelUpResult {
  oldLevel: number;
  newLevel: number;
  levelsGained: number;
  remainingXP: number;
  totalXPForNewLevel: number;
  ascensionTriggered: boolean;
  milestoneLevel: boolean;
}

export const XP_FORMULA = (level: number): number => {
  return Math.floor(100 * Math.pow(level, 1.5));
};

export function calculateLevel(totalXP: number): LevelUpResult {
  const oldLevel = getLevelFromTotalXP(totalXP - 1);
  let level = 1;
  let cumulativeXP = 0;

  while (cumulativeXP + XP_FORMULA(level + 1) <= totalXP) {
    cumulativeXP += XP_FORMULA(level + 1);
    level++;
  }

  const remainingXP = totalXP - cumulativeXP;
  const xpForNextLevel = XP_FORMULA(level + 1);

  const milestones = [1, 5, 10, 20, 30, 40, 50, 75, 100, 150, 200];
  const isMilestone = milestones.includes(level);

  return {
    oldLevel,
    newLevel: level,
    levelsGained: level - oldLevel,
    remainingXP,
    totalXPForNewLevel: xpForNextLevel,
    ascensionTriggered: level > oldLevel,
    milestoneLevel: isMilestone,
  };
}

function getLevelFromTotalXP(totalXP: number): number {
  let level = 1;
  let cumulativeXP = 0;

  while (cumulativeXP + XP_FORMULA(level + 1) <= totalXP) {
    cumulativeXP += XP_FORMULA(level + 1);
    level++;
  }

  return level;
}

export function getAscensionImage(level: number): string {
  const milestones = [1, 5, 10, 20, 30, 40, 50, 75, 100, 150, 200];

  const milestone = milestones.reverse().find(m => level >= m) || 1;

  return `/assets/ascensions/level-${milestone}.png`;
}

export function getAscensionPrompt(level: number): string {
  if (level >= 200) {
    return 'Solo Leveling style, Sung Jin-Woo achieving Shadow Monarch form, divine darkness aura, golden-black energy explosion, army of shadows behind, cosmic scale, absolute power, throne materializing, SSS-rank awakening';
  } else if (level >= 150) {
    return 'Solo Leveling style, Sung Jin-Woo with void lightning, pink-purple energy crackling, SS-rank transformation, shadow army forming, reality bending, epic scale, power transcending';
  } else if (level >= 100) {
    return 'Solo Leveling style, Sung Jin-Woo S-rank ascension, massive red-crimson energy explosion, glowing purple eyes, shadow tendrils erupting, legendary power awakening, dramatic lighting';
  } else if (level >= 75) {
    return 'Solo Leveling style, Sung Jin-Woo releasing full power, golden aura intensifying, A-rank energy surge, shadows dancing, determination absolute, elite hunter emergence';
  } else if (level >= 50) {
    return 'Solo Leveling style, Sung Jin-Woo half transformation, blue-purple energy mixing, shadow beasts emerging from body, power crystallizing, B-rank breakthrough';
  } else if (level >= 40) {
    return 'Solo Leveling style, Sung Jin-Woo with shadow army glimpse, dark figures materializing, blue energy chains, power consolidating, hunter evolution';
  } else if (level >= 30) {
    return 'Solo Leveling style, Sung Jin-Woo power crystallization, blue energy forming armor, shadow weapons appearing, determination radiating, strength building';
  } else if (level >= 20) {
    return 'Solo Leveling style, Sung Jin-Woo with dark aura forming, blue-black energy swirling, eyes glowing brighter, confidence growing, power manifesting';
  } else if (level >= 10) {
    return 'Solo Leveling style, Sung Jin-Woo with shadow manifestation, dark energy wisps, blue glow intensifying, first true power, system awakening';
  } else if (level >= 5) {
    return 'Solo Leveling style, Sung Jin-Woo first power surge, blue energy crackling, eyes beginning to glow, surprise and determination, initial awakening';
  }

  return 'Solo Leveling style, Sung Jin-Woo awakening moment, blue system panel materializing, eyes glowing for first time, dark room, life changing, hope emerging';
}
