import { getRankPrompt, type Rank } from '../progression/rankSystem';

export interface RankArtwork {
  rank: Rank;
  imagePath: string;
  prompt: string;
  title: string;
  description: string;
}

export function getRankArtwork(rank: Rank): RankArtwork {
  return {
    rank,
    imagePath: `/assets/ranks/${rank.toLowerCase()}-rank.png`,
    prompt: getRankPrompt(rank),
    title: getRankTitle(rank),
    description: getRankDescription(rank),
  };
}

function getRankTitle(rank: Rank): string {
  const titles: Record<Rank, string> = {
    E: 'E-RANK HUNTER',
    D: 'D-RANK AWAKENED',
    C: 'C-RANK SKILLED',
    B: 'B-RANK ELITE',
    A: 'A-RANK MASTER',
    S: 'S-RANK LEGEND',
    SS: 'SS-RANK MYTHICAL',
    SSS: 'SSS-RANK SHADOW MONARCH',
  };
  return titles[rank];
}

function getRankDescription(rank: Rank): string {
  const descriptions: Record<Rank, string> = {
    E: 'The weakest of hunters. But every legend starts somewhere. Your journey begins in darkness.',
    D: 'You have awakened. The path forward becomes clear. Power flows through you.',
    C: 'Above average. Your skills manifest. Others begin to notice your strength.',
    B: 'Elite among hunters. Formidable power. The weak flee before you.',
    A: 'Master level achieved. National treasure. Your name echoes.',
    S: 'Legendary status. Your power is myth made real. Shadows bow to you.',
    SS: 'Mythical transcendence. Reality warps around you. Few have reached this height.',
    SSS: 'Shadow Monarch. You command the darkness. The ultimate power achieved.',
  };
  return descriptions[rank];
}
