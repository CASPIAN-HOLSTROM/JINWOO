import { dailyQuestTemplates, generateDailyQuest } from './dailyQuest';
import { generateWeeklyBossQuest } from './weeklyBossQuest';
import { calculateDifficultyMultiplier } from './adaptiveDifficulty';

export interface UserProfile {
  level: number;
  streak: number;
  hunter_class: 'Warrior' | 'Assassin' | 'Mage' | 'Shadow Monarch';
  skillset: string[];
  daily_availability: number;
  weaknesses: string[];
  primary_goal: string;
}

export interface GeneratedQuest {
  title: string;
  description: string;
  category: 'Business' | 'Skill' | 'Physical' | 'Mind';
  quest_type: 'Daily' | 'Boss';
  xp_reward: number;
  difficulty: number;
  due_date: string;
  image_prompt?: string;
}

export function generateDailyQuests(
  userProfile: UserProfile,
  level: number,
  streak: number,
  count: number = 5
): GeneratedQuest[] {
  const difficultyMultiplier = calculateDifficultyMultiplier(level, streak);
  const quests: GeneratedQuest[] = [];

  const categories = determinePriorityCategories(userProfile);

  for (let i = 0; i < count; i++) {
    const category = categories[i % categories.length];
    const quest = generateDailyQuest(
      category,
      level,
      difficultyMultiplier,
      userProfile
    );
    quests.push(quest);
  }

  return quests;
}

export function generateWeeklyBoss(
  userProfile: UserProfile,
  level: number,
  streak: number
): GeneratedQuest {
  const difficultyMultiplier = calculateDifficultyMultiplier(level, streak);
  return generateWeeklyBossQuest(level, difficultyMultiplier, userProfile);
}

function determinePriorityCategories(userProfile: UserProfile): Array<'Business' | 'Skill' | 'Physical' | 'Mind'> {
  const categories: Array<'Business' | 'Skill' | 'Physical' | 'Mind'> = [];

  if (userProfile.primary_goal.toLowerCase().includes('business') ||
      userProfile.primary_goal.toLowerCase().includes('sales') ||
      userProfile.primary_goal.toLowerCase().includes('client')) {
    categories.push('Business', 'Business');
  }

  if (userProfile.skillset.some(skill =>
      skill.toLowerCase().includes('ai') ||
      skill.toLowerCase().includes('coding') ||
      skill.toLowerCase().includes('engineering'))) {
    categories.push('Skill', 'Skill');
  }

  if (userProfile.weaknesses.some(w =>
      w.toLowerCase().includes('fitness') ||
      w.toLowerCase().includes('health'))) {
    categories.push('Physical', 'Physical');
  }

  categories.push('Mind');

  if (categories.length < 4) {
    categories.push('Business', 'Skill', 'Physical', 'Mind');
  }

  return categories;
}
