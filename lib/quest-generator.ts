import { scaleQuestDifficulty, calculateQuestXP } from './game-logic';

type QuestCategory = 'Business' | 'Skill' | 'Physical' | 'Mind';
type QuestType = 'Daily' | 'Boss' | 'Raid' | 'Optional';

interface QuestTemplate {
  title: string;
  description: string;
  category: QuestCategory;
  baseValue: number;
  xpReward: number;
}

const businessQuests: QuestTemplate[] = [
  { title: 'Message {value} leads', description: 'Reach out to potential clients', category: 'Business', baseValue: 10, xpReward: 150 },
  { title: 'Pitch {value} coaches', description: 'Present your offer to coaches', category: 'Business', baseValue: 5, xpReward: 200 },
  { title: 'Record {value} sales videos', description: 'Create video content for outreach', category: 'Business', baseValue: 1, xpReward: 250 },
  { title: 'Build {value} automation flows', description: 'Create PDIDT automation systems', category: 'Business', baseValue: 1, xpReward: 300 },
  { title: 'Follow up with {value} prospects', description: 'Nurture your pipeline', category: 'Business', baseValue: 15, xpReward: 150 },
  { title: 'Close {value} deals', description: 'Convert prospects to clients', category: 'Business', baseValue: 2, xpReward: 500 },
  { title: 'Update {value} client projects', description: 'Maintain active client relationships', category: 'Business', baseValue: 3, xpReward: 200 },
];

const skillQuests: QuestTemplate[] = [
  { title: 'Study AI concepts for {value} minutes', description: 'Deepen your AI knowledge', category: 'Skill', baseValue: 45, xpReward: 200 },
  { title: 'Build {value} PDIDT demos', description: 'Create practical automation examples', category: 'Skill', baseValue: 1, xpReward: 300 },
  { title: 'Write {value} case studies', description: 'Document your success stories', category: 'Skill', baseValue: 1, xpReward: 250 },
  { title: 'Practice coding for {value} minutes', description: 'Sharpen your technical skills', category: 'Skill', baseValue: 60, xpReward: 200 },
  { title: 'Complete {value} tutorials', description: 'Learn new frameworks or tools', category: 'Skill', baseValue: 1, xpReward: 300 },
  { title: 'Read {value} pages of technical material', description: 'Expand your knowledge base', category: 'Skill', baseValue: 20, xpReward: 150 },
];

const physicalQuests: QuestTemplate[] = [
  { title: 'Complete {value} push-ups', description: 'Build physical strength', category: 'Physical', baseValue: 20, xpReward: 100 },
  { title: 'Walk {value} minutes', description: 'Get your body moving', category: 'Physical', baseValue: 30, xpReward: 100 },
  { title: 'Do {value} squats', description: 'Train your lower body', category: 'Physical', baseValue: 30, xpReward: 100 },
  { title: 'Plank for {value} seconds', description: 'Strengthen your core', category: 'Physical', baseValue: 60, xpReward: 150 },
  { title: 'Complete {value} burpees', description: 'Full body conditioning', category: 'Physical', baseValue: 15, xpReward: 150 },
  { title: 'Run for {value} minutes', description: 'Cardiovascular endurance', category: 'Physical', baseValue: 20, xpReward: 200 },
];

const mindQuests: QuestTemplate[] = [
  { title: 'Meditate for {value} minutes', description: 'Calm your mind and focus', category: 'Mind', baseValue: 10, xpReward: 150 },
  { title: 'Journal for {value} minutes', description: 'Reflect on your progress', category: 'Mind', baseValue: 15, xpReward: 150 },
  { title: 'Plan tomorrow for {value} minutes', description: 'Strategize your next day', category: 'Mind', baseValue: 10, xpReward: 100 },
  { title: 'Read {value} pages', description: 'Feed your mind with knowledge', category: 'Mind', baseValue: 20, xpReward: 150 },
  { title: 'Practice gratitude for {value} minutes', description: 'Cultivate positive mindset', category: 'Mind', baseValue: 5, xpReward: 100 },
  { title: 'Visualize goals for {value} minutes', description: 'Reinforce your vision', category: 'Mind', baseValue: 10, xpReward: 150 },
];

const bossQuests: QuestTemplate[] = [
  { title: 'Complete {value} daily quests this week', description: 'Master consistency', category: 'Business', baseValue: 20, xpReward: 1000 },
  { title: 'Close {value} high-value deals', description: 'Land major clients', category: 'Business', baseValue: 5, xpReward: 2000 },
  { title: 'Build a complete automation system', description: 'Create end-to-end PDIDT flow', category: 'Skill', baseValue: 1, xpReward: 1500 },
  { title: 'Maintain {value}-day streak', description: 'Prove your dedication', category: 'Mind', baseValue: 7, xpReward: 1000 },
  { title: 'Train for {value} hours this week', description: 'Physical excellence', category: 'Physical', baseValue: 5, xpReward: 800 },
];

const raidQuests: QuestTemplate[] = [
  { title: 'Close {value} leads this month', description: 'Massive sales push', category: 'Business', baseValue: 50, xpReward: 5000 },
  { title: 'Build {value} client automation systems', description: 'Scale your delivery', category: 'Skill', baseValue: 10, xpReward: 4000 },
  { title: 'Achieve {value}-day perfect streak', description: 'Ultimate consistency', category: 'Mind', baseValue: 30, xpReward: 3000 },
  { title: 'Master a new skill completely', description: 'Reach expert level', category: 'Skill', baseValue: 1, xpReward: 5000 },
];

function selectRandomQuests(templates: QuestTemplate[], count: number): QuestTemplate[] {
  const shuffled = [...templates].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateDailyQuests(level: number, goals: any) {
  const questPool: QuestTemplate[] = [];

  if (goals.skillset.includes('AI engineering') || goals.skillset.includes('PDIDT')) {
    questPool.push(...skillQuests);
  }
  if (goals.skillset.includes('sales') || goals.skillset.includes('coaching')) {
    questPool.push(...businessQuests);
  }

  questPool.push(...physicalQuests);
  questPool.push(...mindQuests);

  const selected = selectRandomQuests(questPool, 5);

  return selected.map((template) => {
    const scaledValue = scaleQuestDifficulty(template.baseValue, level);
    const scaledXP = calculateQuestXP(template.xpReward, level);

    return {
      title: template.title.replace('{value}', scaledValue.toString()),
      description: template.description,
      category: template.category,
      quest_type: 'Daily' as QuestType,
      xp_reward: scaledXP,
      difficulty: level,
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  });
}

export function generateBossQuest(level: number) {
  const template = bossQuests[Math.floor(Math.random() * bossQuests.length)];
  const scaledValue = scaleQuestDifficulty(template.baseValue, level);
  const scaledXP = calculateQuestXP(template.xpReward, level);

  return {
    title: template.title.replace('{value}', scaledValue.toString()),
    description: template.description,
    category: template.category,
    quest_type: 'Boss' as QuestType,
    xp_reward: scaledXP,
    difficulty: level,
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

export function generateRaidQuest(level: number) {
  const template = raidQuests[Math.floor(Math.random() * raidQuests.length)];
  const scaledValue = scaleQuestDifficulty(template.baseValue, level);
  const scaledXP = calculateQuestXP(template.xpReward, level);

  return {
    title: template.title.replace('{value}', scaledValue.toString()),
    description: template.description,
    category: template.category,
    quest_type: 'Raid' as QuestType,
    xp_reward: scaledXP,
    difficulty: level,
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
}
