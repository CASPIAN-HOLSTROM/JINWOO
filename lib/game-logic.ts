import { supabase } from './supabase';
import type { Database } from './database.types';

type Hunter = Database['public']['Tables']['hunters']['Row'];
type Quest = Database['public']['Tables']['quests']['Row'];
type Title = Database['public']['Tables']['titles']['Row'];

export const XP_FORMULA = (level: number) => Math.floor(100 * Math.pow(level, 1.5));

export const calculateTotalXPForLevel = (targetLevel: number): number => {
  let total = 0;
  for (let i = 1; i <= targetLevel; i++) {
    total += XP_FORMULA(i);
  }
  return total;
};

export const getLevelFromXP = (totalXP: number): { level: number; currentXP: number } => {
  let level = 1;
  let cumulativeXP = 0;

  while (cumulativeXP + XP_FORMULA(level + 1) <= totalXP) {
    cumulativeXP += XP_FORMULA(level + 1);
    level++;
  }

  const currentXP = totalXP - cumulativeXP;
  return { level, currentXP };
};

export const getRankForLevel = (level: number): string => {
  if (level >= 200) return 'SSS';
  if (level >= 150) return 'SS';
  if (level >= 100) return 'S';
  if (level >= 75) return 'A';
  if (level >= 50) return 'B';
  if (level >= 25) return 'C';
  if (level >= 10) return 'D';
  return 'E';
};

export const calculateQuestXP = (baseXP: number, level: number): number => {
  return Math.floor(baseXP * (1 + level * 0.1));
};

export const scaleQuestDifficulty = (baseValue: number, level: number): number => {
  return Math.floor(baseValue * Math.pow(1.15, level / 5));
};

export const checkTitleUnlock = async (
  hunterId: string,
  hunter: Hunter,
  stats: any,
  questCounts: any
): Promise<Title[]> => {
  const { data: allTitles } = await supabase.from('titles').select('*');

  if (!allTitles) return [];

  const { data: unlockedTitles } = await supabase
    .from('hunter_titles')
    .select('title_id')
    .eq('hunter_id', hunterId);

  const unlockedIds = new Set(unlockedTitles?.map(t => t.title_id) || []);
  const newlyUnlocked: Title[] = [];

  for (const title of allTitles) {
    if (unlockedIds.has(title.id)) continue;

    const req = title.unlock_requirement as any;
    let unlocked = false;

    if (req.type === 'level' && hunter.level >= req.value) {
      unlocked = true;
    } else if (req.type === 'rank') {
      const rankOrder = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];
      const currentRankIndex = rankOrder.indexOf(hunter.rank);
      const requiredRankIndex = rankOrder.indexOf(req.value);
      if (currentRankIndex >= requiredRankIndex) {
        unlocked = true;
      }
    } else if (req.type === 'streak' && hunter.current_streak >= req.value) {
      unlocked = true;
    } else if (req.type === 'total_xp' && hunter.total_xp >= req.value) {
      unlocked = true;
    } else if (req.type === 'stat' && stats[req.stat] >= req.value) {
      unlocked = true;
    } else if (req.type === 'quest_completed' && questCounts.total >= req.value) {
      unlocked = true;
    } else if (req.type === 'quest_type' && questCounts[req.quest_type] >= req.value) {
      unlocked = true;
    } else if (req.type === 'category_completed' && questCounts[req.category] >= req.value) {
      unlocked = true;
    }

    if (unlocked) {
      await supabase.from('hunter_titles').insert({
        hunter_id: hunterId,
        title_id: title.id,
        is_active: false,
      });

      await supabase.from('ascension_log').insert({
        hunter_id: hunterId,
        event_type: 'Title',
        to_value: title.name,
        image_shown: title.image_path,
      });

      newlyUnlocked.push(title);
    }
  }

  return newlyUnlocked;
};

export const completeQuest = async (questId: string, hunterId: string) => {
  const { data: quest } = await supabase
    .from('quests')
    .select('*')
    .eq('id', questId)
    .maybeSingle();

  if (!quest || quest.status !== 'Active') {
    return { error: 'Quest not found or already completed' };
  }

  await supabase
    .from('quests')
    .update({ status: 'Completed', completed_at: new Date().toISOString() })
    .eq('id', questId);

  const { data: hunter } = await supabase
    .from('hunters')
    .select('*')
    .eq('id', hunterId)
    .single();

  if (!hunter) {
    return { error: 'Hunter not found' };
  }

  const newTotalXP = hunter.total_xp + quest.xp_reward;
  const { level: newLevel, currentXP: newCurrentXP } = getLevelFromXP(newTotalXP);
  const newRank = getRankForLevel(newLevel);
  const oldLevel = hunter.level;
  const oldRank = hunter.rank;

  await supabase
    .from('hunters')
    .update({
      total_xp: newTotalXP,
      level: newLevel,
      current_xp: newCurrentXP,
      rank: newRank,
      last_active: new Date().toISOString(),
    })
    .eq('id', hunterId);

  const leveledUp = newLevel > oldLevel;
  const rankedUp = newRank !== oldRank;

  if (leveledUp) {
    await supabase.from('ascension_log').insert({
      hunter_id: hunterId,
      event_type: 'Level',
      from_value: oldLevel.toString(),
      to_value: newLevel.toString(),
      image_shown: `/assets/ascensions/level-${newLevel}.png`,
    });

    const statBonus = Math.floor(newLevel / 5);
    if (hunter.hunter_class === 'Warrior') {
      await supabase.rpc('increment_stat', { hunter_id: hunterId, stat: 'strength', amount: statBonus });
    } else if (hunter.hunter_class === 'Assassin') {
      await supabase.rpc('increment_stat', { hunter_id: hunterId, stat: 'discipline', amount: statBonus });
    } else if (hunter.hunter_class === 'Mage') {
      await supabase.rpc('increment_stat', { hunter_id: hunterId, stat: 'intelligence', amount: statBonus });
    } else if (hunter.hunter_class === 'Shadow Monarch') {
      await supabase.rpc('increment_stat', { hunter_id: hunterId, stat: 'willpower', amount: statBonus });
    }
  }

  if (rankedUp) {
    await supabase.from('ascension_log').insert({
      hunter_id: hunterId,
      event_type: 'Rank',
      from_value: oldRank,
      to_value: newRank,
      image_shown: `/assets/ranks/${newRank.toLowerCase()}-rank.png`,
    });
  }

  return {
    success: true,
    xpGained: quest.xp_reward,
    leveledUp,
    newLevel,
    rankedUp,
    newRank,
  };
};
