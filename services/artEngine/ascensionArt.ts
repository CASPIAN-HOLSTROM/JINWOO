import { getAscensionPrompt } from '../progression/levelSystem';

export interface AscensionArtwork {
  level: number;
  imagePath: string;
  prompt: string;
  description: string;
}

export const ASCENSION_MILESTONES = [1, 5, 10, 20, 30, 40, 50, 75, 100, 150, 200];

export function getAscensionArtwork(level: number): AscensionArtwork {
  const milestone = ASCENSION_MILESTONES.reverse().find(m => level >= m) || 1;

  return {
    level: milestone,
    imagePath: `/assets/ascensions/level-${milestone}.png`,
    prompt: getAscensionPrompt(level),
    description: getAscensionDescription(milestone),
  };
}

function getAscensionDescription(level: number): string {
  const descriptions: Record<number, string> = {
    1: 'Your eyes open to a new world. The System has chosen you.',
    5: 'Power surges through your body for the first time. You feel different.',
    10: 'Shadows respond to your call. Something ancient awakens within.',
    20: 'Your aura becomes visible. The weak begin to fear you.',
    30: 'Power crystallizes into form. You are no longer ordinary.',
    40: 'Shadow beasts glimpse behind you. An army forms in darkness.',
    50: 'Half your transformation complete. The old you is dying.',
    75: 'Full power released. You transcend mortal limits.',
    100: 'S-Rank achieved. You stand among legends.',
    150: 'SS-Rank transcendence. Reality bends to your will.',
    200: 'Shadow Monarch. You are the darkness itself.',
  };

  return descriptions[level] || 'You grow stronger.';
}

export function shouldShowAscensionArt(level: number): boolean {
  return ASCENSION_MILESTONES.includes(level);
}
