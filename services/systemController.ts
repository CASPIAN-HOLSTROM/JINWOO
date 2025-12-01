import { supabase } from '@/lib/supabase';
import { generateDailyQuests, generateWeeklyBoss } from './questEngine/questGenerator';
import { calculateQuestXP, calculateComboBonus } from './progression/xpCalculator';
import { calculateLevel } from './progression/levelSystem';
import { checkRankUp } from './progression/rankSystem';
import { checkTitleUnlocks } from './progression/titleUnlocker';
import { getAscensionArtwork } from './artEngine/ascensionArt';
import { getRankArtwork } from './artEngine/rankArt';
import {
  shouldShowLevelUpEffect,
  shouldShowRankUpEffect,
  decideUpgradePresentation,
  getCompletionMessage,
} from './progression/upgradeTimingLogic';

export interface QuestCompletionResult {
  success: boolean;
  error?: string;
  xpGained: number;
  totalXP: number;
  levelUp?: {
    oldLevel: number;
    newLevel: number;
    artwork: any;
  };
  rankUp?: {
    oldRank: string;
    newRank: string;
    artwork: any;
  };
  titlesUnlocked?: Array<{
    id: string;
    name: string;
    artwork: any;
  }>;
  comboBonus?: number;
}

export async function completeQuestWithSystem(
  questId: string,
  hunterId: string
): Promise<QuestCompletionResult> {
  const { data: quest } = await supabase
    .from('quests')
    .select('*')
    .eq('id', questId)
    .maybeSingle();

  if (!quest || quest.status !== 'Active') {
    return { success: false, error: 'Quest not found or already completed', xpGained: 0, totalXP: 0 };
  }

  const { data: hunter } = await supabase
    .from('hunters')
    .select('*')
    .eq('id', hunterId)
    .single();

  if (!hunter) {
    return { success: false, error: 'Hunter not found', xpGained: 0, totalXP: 0 };
  }

  const xpCalc = calculateQuestXP(
    quest.xp_reward,
    hunter.level,
    hunter.current_streak,
    hunter.penalty_mode,
    quest.quest_type
  );

  const { data: todayQuests } = await supabase
    .from('quests')
    .select('id')
    .eq('hunter_id', hunterId)
    .eq('status', 'Completed')
    .gte('completed_at', new Date().toISOString().split('T')[0]);

  const questsCompletedToday = (todayQuests?.length || 0) + 1;
  const comboBonus = calculateComboBonus(questsCompletedToday);

  const totalXPGained = xpCalc.totalXP + comboBonus;
  const newTotalXP = hunter.total_xp + totalXPGained;

  const levelResult = calculateLevel(newTotalXP);
  const rankResult = checkRankUp(hunter.level, levelResult.newLevel);

  await supabase
    .from('quests')
    .update({
      status: 'Completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', questId);

  await supabase
    .from('hunters')
    .update({
      total_xp: newTotalXP,
      level: levelResult.newLevel,
      current_xp: levelResult.remainingXP,
      rank: rankResult.newRank,
      last_active: new Date().toISOString(),
    })
    .eq('id', hunterId);

  const result: QuestCompletionResult = {
    success: true,
    xpGained: totalXPGained,
    totalXP: newTotalXP,
  };

  const levelUpEvent = levelResult.ascensionTriggered
    ? shouldShowLevelUpEffect(levelResult.oldLevel, levelResult.newLevel, levelResult.levelsGained)
    : null;

  const rankUpEvent = rankResult.rankedUp
    ? shouldShowRankUpEffect(rankResult.oldRank, rankResult.newRank)
    : null;

  const upgradeDecision = decideUpgradePresentation(levelUpEvent, rankUpEvent, []);

  if (levelResult.ascensionTriggered && upgradeDecision.showLevelUp) {
    const artwork = getAscensionArtwork(levelResult.newLevel);
    result.levelUp = {
      oldLevel: levelResult.oldLevel,
      newLevel: levelResult.newLevel,
      artwork,
    };

    await supabase.from('ascension_log').insert({
      hunter_id: hunterId,
      event_type: 'Level',
      from_value: levelResult.oldLevel.toString(),
      to_value: levelResult.newLevel.toString(),
      image_shown: artwork.imagePath,
    });

    if (hunter.hunter_class) {
      const statBonus = Math.floor(levelResult.newLevel / 5);
      const statMap: Record<string, string> = {
        Warrior: 'strength',
        Assassin: 'discipline',
        Mage: 'intelligence',
        'Shadow Monarch': 'willpower',
      };
      const statToIncrease = statMap[hunter.hunter_class];

      if (statToIncrease) {
        await supabase.rpc('increment_stat', {
          hunter_id: hunterId,
          stat: statToIncrease,
          amount: statBonus,
        });
      }
    }
  }

  if (rankResult.rankedUp && upgradeDecision.showRankUp) {
    const artwork = getRankArtwork(rankResult.newRank);
    result.rankUp = {
      oldRank: rankResult.oldRank,
      newRank: rankResult.newRank,
      artwork,
    };

    await supabase.from('ascension_log').insert({
      hunter_id: hunterId,
      event_type: 'Rank',
      from_value: rankResult.oldRank,
      to_value: rankResult.newRank,
      image_shown: artwork.imagePath,
    });
  }

  if (comboBonus > 0) {
    result.comboBonus = comboBonus;
  }

  return result;
}

export async function generateQuestsForHunter(hunterId: string): Promise<void> {
  const { data: hunter } = await supabase
    .from('hunters')
    .select('*')
    .eq('id', hunterId)
    .single();

  const { data: goals } = await supabase
    .from('hunter_goals')
    .select('*')
    .eq('hunter_id', hunterId)
    .maybeSingle();

  if (!hunter || !goals) return;

  const userProfile = {
    level: hunter.level,
    streak: hunter.current_streak,
    hunter_class: hunter.hunter_class || 'Warrior',
    skillset: goals.skillset || [],
    daily_availability: goals.daily_availability || 8,
    weaknesses: goals.weaknesses || [],
    primary_goal: goals.primary_goal || '',
  };

  const dailyQuests = generateDailyQuests(userProfile, hunter.level, hunter.current_streak, 5);

  for (const quest of dailyQuests) {
    await supabase.from('quests').insert({
      hunter_id: hunterId,
      ...quest,
    });
  }

  const { data: existingBoss } = await supabase
    .from('quests')
    .select('id')
    .eq('hunter_id', hunterId)
    .eq('quest_type', 'Boss')
    .eq('status', 'Active')
    .maybeSingle();

  if (!existingBoss && hunter.level >= 5) {
    const bossQuest = generateWeeklyBoss(userProfile, hunter.level, hunter.current_streak);
    await supabase.from('quests').insert({
      hunter_id: hunterId,
      ...bossQuest,
    });
  }
}
