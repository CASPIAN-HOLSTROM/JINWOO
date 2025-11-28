import type { UserProfile, GeneratedQuest } from './questGenerator';

interface BossQuestTemplate {
  titleTemplate: string;
  descriptionTemplate: string;
  category: 'Business' | 'Skill' | 'Physical' | 'Mind';
  baseValue: number;
  baseXP: number;
  imagePrompt: string;
  bossName: string;
}

const bossQuestTemplates: BossQuestTemplate[] = [
  {
    titleTemplate: 'BOSS RAID: Close {value} High-Value Deals',
    descriptionTemplate: 'A legendary sales challenge appears. Only the strongest hunters can convert this many prospects.',
    category: 'Business',
    baseValue: 10,
    baseXP: 2000,
    bossName: 'The Prospector King',
    imagePrompt: 'Solo Leveling style, massive shadowy boss figure made of gold coins and contracts, glowing red eyes, business suit armor, dark throne room, intimidating presence, hunter facing boss, epic scale'
  },
  {
    titleTemplate: 'BOSS RAID: Build {value} Complete Automation Systems',
    descriptionTemplate: 'The Automation Golem challenges you to prove your technical mastery.',
    category: 'Skill',
    baseValue: 5,
    baseXP: 2500,
    bossName: 'The Automation Golem',
    imagePrompt: 'Solo Leveling style, giant mechanical boss made of glowing blue circuits and gears, code flowing through body, energy core chest, dark factory, hunter preparing to fight, epic confrontation'
  },
  {
    titleTemplate: 'BOSS RAID: Maintain {value}-Day Perfect Streak',
    descriptionTemplate: 'The Consistency Demon tests your discipline and willpower.',
    category: 'Mind',
    baseValue: 7,
    baseXP: 1800,
    bossName: 'The Consistency Demon',
    imagePrompt: 'Solo Leveling style, demonic boss with calendar body, chains of habit, glowing discipline aura, dark void, time distortion effects, hunter standing firm, determination versus chaos'
  },
  {
    titleTemplate: 'BOSS RAID: Complete {value} Full Training Sessions',
    descriptionTemplate: 'The Iron Titan demands physical excellence.',
    category: 'Physical',
    baseValue: 7,
    baseXP: 1500,
    bossName: 'The Iron Titan',
    imagePrompt: 'Solo Leveling style, massive muscular titan boss with iron body, glowing red veins, dark arena, weights as weapons, hunter in combat stance, strength versus strength, epic battle'
  },
  {
    titleTemplate: 'BOSS RAID: Master {value} Advanced Skills',
    descriptionTemplate: 'The Knowledge Lich guards the secrets of mastery.',
    category: 'Skill',
    baseValue: 3,
    baseXP: 3000,
    bossName: 'The Knowledge Lich',
    imagePrompt: 'Solo Leveling style, skeletal boss wearing ancient robes, surrounded by floating glowing books, blue magic circles, dark library dimension, knowledge streams as weapons, hunter channeling power'
  },
  {
    titleTemplate: 'BOSS RAID: Generate ${value}K in Revenue',
    descriptionTemplate: 'The Wealth Dragon hoards the treasures you seek.',
    category: 'Business',
    baseValue: 10,
    baseXP: 3500,
    bossName: 'The Wealth Dragon',
    imagePrompt: 'Solo Leveling style, enormous dragon boss made of gold and currency, glowing treasure hoard, dark cavern, money as scales, hunter wielding determination, greed versus ambition, legendary encounter'
  },
  {
    titleTemplate: 'BOSS RAID: Overcome Your {weakness}',
    descriptionTemplate: 'Face your inner demon and emerge victorious.',
    category: 'Mind',
    baseValue: 1,
    baseXP: 2200,
    bossName: 'The Shadow Self',
    imagePrompt: 'Solo Leveling style, dark mirror boss version of hunter, corrupted shadow form, red glowing eyes, void dimension, self versus shadow, psychological battle, blue versus red energy'
  },
];

export function generateWeeklyBossQuest(
  level: number,
  difficultyMultiplier: number,
  userProfile: UserProfile
): GeneratedQuest {
  const template = selectBossBasedOnProfile(userProfile);

  let scaledValue = Math.floor(template.baseValue * difficultyMultiplier);
  let title = template.titleTemplate.replace('{value}', scaledValue.toString());

  if (template.titleTemplate.includes('{weakness}') && userProfile.weaknesses.length > 0) {
    const weakness = userProfile.weaknesses[0];
    title = template.titleTemplate.replace('{weakness}', weakness);
  }

  const scaledXP = Math.floor(template.baseXP * (1 + level * 0.15));

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);
  dueDate.setHours(23, 59, 59, 999);

  return {
    title,
    description: `${template.descriptionTemplate}\n\nBoss: ${template.bossName}`,
    category: template.category,
    quest_type: 'Boss',
    xp_reward: scaledXP,
    difficulty: level,
    due_date: dueDate.toISOString(),
    image_prompt: template.imagePrompt,
  };
}

function selectBossBasedOnProfile(userProfile: UserProfile): BossQuestTemplate {
  const businessFocused = userProfile.primary_goal.toLowerCase().includes('business') ||
                          userProfile.primary_goal.toLowerCase().includes('sales');

  const skillFocused = userProfile.skillset.some(s =>
    s.toLowerCase().includes('ai') || s.toLowerCase().includes('coding'));

  const hasWeaknesses = userProfile.weaknesses.length > 0;

  if (businessFocused && Math.random() > 0.5) {
    return bossQuestTemplates.filter(t => t.category === 'Business')[
      Math.floor(Math.random() * 2)
    ];
  }

  if (skillFocused && Math.random() > 0.5) {
    return bossQuestTemplates.filter(t => t.category === 'Skill')[
      Math.floor(Math.random() * 2)
    ];
  }

  if (hasWeaknesses && Math.random() > 0.7) {
    return bossQuestTemplates.find(t => t.bossName === 'The Shadow Self')!;
  }

  return bossQuestTemplates[Math.floor(Math.random() * bossQuestTemplates.length)];
}
