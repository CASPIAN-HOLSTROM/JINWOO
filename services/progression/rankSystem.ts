export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

export interface RankInfo {
  rank: Rank;
  minLevel: number;
  color: string;
  description: string;
  title: string;
}

export const RANK_DATA: Record<Rank, RankInfo> = {
  E: {
    rank: 'E',
    minLevel: 1,
    color: '#6b7280',
    description: 'The weakest hunters. But every monarch began here.',
    title: 'Novice Hunter',
  },
  D: {
    rank: 'D',
    minLevel: 10,
    color: '#84cc16',
    description: 'Basic competence achieved. The path becomes visible.',
    title: 'Awakened Hunter',
  },
  C: {
    rank: 'C',
    minLevel: 25,
    color: '#3b82f6',
    description: 'Above average. Power begins to manifest.',
    title: 'Skilled Hunter',
  },
  B: {
    rank: 'B',
    minLevel: 50,
    color: '#a855f7',
    description: 'Formidable. The weak fear you.',
    title: 'Elite Hunter',
  },
  A: {
    rank: 'A',
    minLevel: 75,
    color: '#f59e0b',
    description: 'Elite among hunters. National level power.',
    title: 'Master Hunter',
  },
  S: {
    rank: 'S',
    minLevel: 100,
    color: '#ef4444',
    description: 'Legendary. Your name echoes in the void.',
    title: 'Monarch Candidate',
  },
  SS: {
    rank: 'SS',
    minLevel: 150,
    color: '#ec4899',
    description: 'Mythical. Reality bends to your will.',
    title: 'Shadow General',
  },
  SSS: {
    rank: 'SSS',
    minLevel: 200,
    color: '#fbbf24',
    description: 'Shadow Monarch. You command the darkness itself.',
    title: 'Shadow Monarch',
  },
};

export function getRankForLevel(level: number): Rank {
  if (level >= 200) return 'SSS';
  if (level >= 150) return 'SS';
  if (level >= 100) return 'S';
  if (level >= 75) return 'A';
  if (level >= 50) return 'B';
  if (level >= 25) return 'C';
  if (level >= 10) return 'D';
  return 'E';
}

export function getRankInfo(rank: Rank): RankInfo {
  return RANK_DATA[rank];
}

export function checkRankUp(oldLevel: number, newLevel: number): {
  rankedUp: boolean;
  oldRank: Rank;
  newRank: Rank;
} {
  const oldRank = getRankForLevel(oldLevel);
  const newRank = getRankForLevel(newLevel);

  return {
    rankedUp: oldRank !== newRank,
    oldRank,
    newRank,
  };
}

export function getRankImage(rank: Rank): string {
  return `/assets/ranks/${rank.toLowerCase()}-rank.png`;
}

export function getRankPrompt(rank: Rank): string {
  const prompts: Record<Rank, string> = {
    E: 'Solo Leveling style, weak Sung Jin-Woo in hospital gown, faint blue aura, tired expression, determination in eyes, E-rank hunter, beginning journey, dark hospital room',
    D: 'Solo Leveling style, Sung Jin-Woo in basic hunter gear, green energy forming, confident stance, D-rank hunter, training hard, dark training facility, growth visible',
    C: 'Solo Leveling style, Sung Jin-Woo in improved armor, blue energy crackling, skilled combat pose, C-rank hunter, power building, dark dungeon, strength emerging',
    B: 'Solo Leveling style, Sung Jin-Woo in advanced gear, purple aura swirling, elite hunter stance, B-rank power, formidable presence, dark battlefield, enemies fleeing',
    A: 'Solo Leveling style, Sung Jin-Woo in master armor, golden glow radiating, A-rank elite, national level power, dark throne room, shadow army hints, commanding presence',
    S: 'Solo Leveling style, Sung Jin-Woo legendary form, red-crimson energy explosion, S-rank awakening, purple glowing eyes, shadow monarch powers emerging, epic scale, darkness bowing',
    SS: 'Solo Leveling style, Sung Jin-Woo transcendent form, void lightning pink energy, SS-rank mythical, reality warping, shadow army visible, cosmic power, dark dimension',
    SSS: 'Solo Leveling style, Sung Jin-Woo Shadow Monarch ultimate form, divine darkness golden-black aura, SSS-rank absolute, shadow army legion, throne of darkness, cosmic scale, god-like power',
  };

  return prompts[rank];
}
