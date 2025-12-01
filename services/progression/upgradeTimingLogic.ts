/**
 * Smart Upgrade Timing Logic
 *
 * Determines WHEN and WHICH upgrade effects to show based on progression significance.
 * Prevents notification fatigue while highlighting truly important moments.
 */

export interface UpgradeEvent {
  type: 'level' | 'rank' | 'title' | 'milestone';
  priority: 'low' | 'medium' | 'high' | 'epic';
  shouldShow: boolean;
  reason: string;
}

export interface UpgradeDecision {
  showLevelUp: boolean;
  showRankUp: boolean;
  showTitleUnlock: boolean;
  mainEvent: 'level' | 'rank' | 'title' | null;
  priority: 'low' | 'medium' | 'high' | 'epic';
  message: string;
}

/**
 * Key level milestones that deserve special attention
 * Based on Solo Leveling narrative beats
 */
const SIGNIFICANT_LEVELS = [1, 5, 10, 20, 30, 40, 50, 75, 100, 150, 200];

/**
 * Determines if a level-up is significant enough to show an animation
 */
export function shouldShowLevelUpEffect(
  oldLevel: number,
  newLevel: number,
  levelsGained: number
): UpgradeEvent {
  if (SIGNIFICANT_LEVELS.includes(newLevel)) {
    return {
      type: 'level',
      priority: 'epic',
      shouldShow: true,
      reason: `Reached milestone level ${newLevel}`,
    };
  }

  if (levelsGained >= 5) {
    return {
      type: 'level',
      priority: 'high',
      shouldShow: true,
      reason: `Gained ${levelsGained} levels in one quest`,
    };
  }

  if (levelsGained >= 3) {
    return {
      type: 'level',
      priority: 'medium',
      shouldShow: true,
      reason: `Gained ${levelsGained} levels`,
    };
  }

  if (newLevel % 10 === 0) {
    return {
      type: 'level',
      priority: 'medium',
      shouldShow: true,
      reason: `Reached level ${newLevel} (multiple of 10)`,
    };
  }

  if (newLevel % 5 === 0) {
    return {
      type: 'level',
      priority: 'low',
      shouldShow: true,
      reason: `Reached level ${newLevel} (multiple of 5)`,
    };
  }

  return {
    type: 'level',
    priority: 'low',
    shouldShow: false,
    reason: 'Regular level progression',
  };
}

/**
 * Rank promotions are ALWAYS significant
 */
export function shouldShowRankUpEffect(
  oldRank: string,
  newRank: string
): UpgradeEvent {
  const rankPriority: Record<string, 'medium' | 'high' | 'epic'> = {
    D: 'medium',
    C: 'medium',
    B: 'high',
    A: 'high',
    S: 'epic',
    SS: 'epic',
    SSS: 'epic',
  };

  return {
    type: 'rank',
    priority: rankPriority[newRank] || 'medium',
    shouldShow: true,
    reason: `Promoted from ${oldRank}-Rank to ${newRank}-Rank`,
  };
}

/**
 * Title unlocks shown based on rarity and category
 */
export function shouldShowTitleUnlockEffect(
  titleRarity: string,
  titleCategory: string,
  unlockedTitlesCount: number
): UpgradeEvent {
  const rarityPriority: Record<string, 'low' | 'medium' | 'high' | 'epic'> = {
    Common: 'low',
    Rare: 'low',
    Epic: 'medium',
    Legendary: 'high',
    Mythic: 'epic',
  };

  const importantCategories = ['Shadow', 'Ascension', 'Legendary', 'Mythic'];
  const isImportantCategory = importantCategories.includes(titleCategory);

  const priority = rarityPriority[titleRarity] || 'low';

  if (priority === 'epic' || (priority === 'high' && isImportantCategory)) {
    return {
      type: 'title',
      priority: 'epic',
      shouldShow: true,
      reason: `Unlocked ${titleRarity} title in ${titleCategory} category`,
    };
  }

  if (priority === 'high' || priority === 'medium') {
    return {
      type: 'title',
      priority: priority,
      shouldShow: true,
      reason: `Unlocked ${titleRarity} title`,
    };
  }

  if (unlockedTitlesCount === 1) {
    return {
      type: 'title',
      priority: 'medium',
      shouldShow: true,
      reason: 'First title unlock',
    };
  }

  return {
    type: 'title',
    priority: 'low',
    shouldShow: false,
    reason: 'Common title unlock',
  };
}

/**
 * Master decision maker: determines which effects to show and in what order
 * when multiple events happen simultaneously
 */
export function decideUpgradePresentation(
  levelEvent: UpgradeEvent | null,
  rankEvent: UpgradeEvent | null,
  titleEvents: UpgradeEvent[]
): UpgradeDecision {
  const events: Array<UpgradeEvent & { eventType: 'level' | 'rank' | 'title' }> = [];

  if (levelEvent?.shouldShow) {
    events.push({ ...levelEvent, eventType: 'level' });
  }

  if (rankEvent?.shouldShow) {
    events.push({ ...rankEvent, eventType: 'rank' });
  }

  titleEvents.forEach(te => {
    if (te.shouldShow) {
      events.push({ ...te, eventType: 'title' });
    }
  });

  if (events.length === 0) {
    return {
      showLevelUp: false,
      showRankUp: false,
      showTitleUnlock: false,
      mainEvent: null,
      priority: 'low',
      message: 'Quest completed',
    };
  }

  const priorityOrder = { epic: 4, high: 3, medium: 2, low: 1 };
  events.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

  const mainEvent = events[0];

  if (rankEvent?.shouldShow && rankEvent.priority === 'epic') {
    return {
      showLevelUp: !!levelEvent?.shouldShow,
      showRankUp: true,
      showTitleUnlock: titleEvents.some(t => t.shouldShow && t.priority === 'epic'),
      mainEvent: 'rank',
      priority: 'epic',
      message: rankEvent.reason,
    };
  }

  if (mainEvent.priority === 'epic') {
    return {
      showLevelUp: mainEvent.eventType === 'level',
      showRankUp: mainEvent.eventType === 'rank',
      showTitleUnlock: mainEvent.eventType === 'title',
      mainEvent: mainEvent.eventType,
      priority: 'epic',
      message: mainEvent.reason,
    };
  }

  if (mainEvent.priority === 'high') {
    return {
      showLevelUp: mainEvent.eventType === 'level',
      showRankUp: mainEvent.eventType === 'rank',
      showTitleUnlock: mainEvent.eventType === 'title' && titleEvents.some(t => t.priority === 'high'),
      mainEvent: mainEvent.eventType,
      priority: 'high',
      message: mainEvent.reason,
    };
  }

  return {
    showLevelUp: levelEvent?.shouldShow && levelEvent.priority !== 'low' || false,
    showRankUp: rankEvent?.shouldShow || false,
    showTitleUnlock: titleEvents.some(t => t.shouldShow && t.priority !== 'low'),
    mainEvent: mainEvent.eventType,
    priority: mainEvent.priority,
    message: mainEvent.reason,
  };
}

/**
 * Provides feedback messages for completion screen based on event priority
 */
export function getCompletionMessage(priority: 'low' | 'medium' | 'high' | 'epic'): string {
  const messages = {
    epic: [
      'The power coursing through you... this is just the beginning.',
      'You have transcended mortal limits.',
      'The shadows themselves bow to your will.',
      'This is the power of a true hunter.',
    ],
    high: [
      'Significant growth detected.',
      'Your power increases dramatically.',
      'You grow stronger with each battle.',
      'The System acknowledges your progress.',
    ],
    medium: [
      'Steady progress continues.',
      'You advance along the path.',
      'Small steps lead to greatness.',
      'The grind never stops.',
    ],
    low: [
      'Quest complete.',
      'Experience gained.',
      'Progress recorded.',
      'Another step forward.',
    ],
  };

  const options = messages[priority];
  return options[Math.floor(Math.random() * options.length)];
}
