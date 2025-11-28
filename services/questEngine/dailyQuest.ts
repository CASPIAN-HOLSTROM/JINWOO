import type { UserProfile, GeneratedQuest } from './questGenerator';

interface QuestTemplate {
  titleTemplate: string;
  descriptionTemplate: string;
  baseValue: number;
  baseXP: number;
  imagePrompt: string;
}

export const dailyQuestTemplates: Record<string, QuestTemplate[]> = {
  Business: [
    {
      titleTemplate: 'Message {value} high-value leads',
      descriptionTemplate: 'Reach out to qualified prospects who match your ideal client profile',
      baseValue: 15,
      baseXP: 200,
      imagePrompt: 'Solo Leveling style, dark hunter sending glowing blue message arrows through void, holographic contact list, energy trails, dramatic shadows, gothic aesthetic'
    },
    {
      titleTemplate: 'Pitch your offer to {value} potential clients',
      descriptionTemplate: 'Present your coaching or automation services with confidence',
      baseValue: 5,
      baseXP: 300,
      imagePrompt: 'Solo Leveling style, hunter standing before glowing presentation panel, blue holographic charts, energy flowing from hands, persuasion aura, dark background'
    },
    {
      titleTemplate: 'Build {value} automation flows',
      descriptionTemplate: 'Create PDIDT systems that demonstrate your expertise',
      baseValue: 2,
      baseXP: 400,
      imagePrompt: 'Solo Leveling style, hunter crafting glowing blue circuit diagrams in air, code runes floating, automation chains forming, dark workshop, energy sparks'
    },
    {
      titleTemplate: 'Follow up with {value} warm prospects',
      descriptionTemplate: 'Nurture your pipeline with strategic follow-ups',
      baseValue: 20,
      baseXP: 150,
      imagePrompt: 'Solo Leveling style, hunter reviewing glowing prospect cards, blue energy connecting dots, relationship web visible, shadow aesthetic'
    },
    {
      titleTemplate: 'Close {value} deals today',
      descriptionTemplate: 'Convert interested prospects into paying clients',
      baseValue: 1,
      baseXP: 600,
      imagePrompt: 'Solo Leveling style, hunter shaking hands with glowing figure, contract materializing in blue energy, victory aura, dramatic lighting, gold accents'
    },
  ],
  Skill: [
    {
      titleTemplate: 'Study AI engineering for {value} minutes',
      descriptionTemplate: 'Deepen your technical knowledge and capabilities',
      baseValue: 60,
      baseXP: 250,
      imagePrompt: 'Solo Leveling style, hunter absorbing glowing blue knowledge streams, floating AI symbols, neural network visualization, dark study chamber, runes forming'
    },
    {
      titleTemplate: 'Build {value} portfolio demos',
      descriptionTemplate: 'Create showcase projects that prove your abilities',
      baseValue: 1,
      baseXP: 400,
      imagePrompt: 'Solo Leveling style, hunter crafting holographic project displays, code flowing like water, blue energy construction, portfolio materializing, gothic workshop'
    },
    {
      titleTemplate: 'Write {value} case studies',
      descriptionTemplate: 'Document your success stories to attract clients',
      baseValue: 1,
      baseXP: 350,
      imagePrompt: 'Solo Leveling style, hunter writing glowing blue text in air, success stories forming as energy panels, before/after visuals, dark library aesthetic'
    },
    {
      titleTemplate: 'Practice coding for {value} minutes',
      descriptionTemplate: 'Sharpen your technical implementation skills',
      baseValue: 90,
      baseXP: 200,
      imagePrompt: 'Solo Leveling style, hunter typing with blue energy flowing from fingers, code materializing as glowing runes, multiple screens, dark coding chamber'
    },
    {
      titleTemplate: 'Master {value} new frameworks',
      descriptionTemplate: 'Expand your technical toolkit',
      baseValue: 1,
      baseXP: 500,
      imagePrompt: 'Solo Leveling style, hunter absorbing glowing framework orbs, technical knowledge flowing as blue streams, skill tree illuminating, power surge effect'
    },
  ],
  Physical: [
    {
      titleTemplate: 'Complete {value} push-ups',
      descriptionTemplate: 'Build physical strength like a true hunter',
      baseValue: 30,
      baseXP: 100,
      imagePrompt: 'Solo Leveling style, muscular hunter doing push-ups with blue energy aura, strength particles rising, dark training ground, determined expression'
    },
    {
      titleTemplate: 'Train for {value} minutes',
      descriptionTemplate: 'Forge your body into a weapon',
      baseValue: 45,
      baseXP: 150,
      imagePrompt: 'Solo Leveling style, hunter in intense training stance, energy waves emanating, sweat glowing blue, shadow monsters in background, power building'
    },
    {
      titleTemplate: 'Complete {value} burpees',
      descriptionTemplate: 'Full-body conditioning for peak performance',
      baseValue: 25,
      baseXP: 200,
      imagePrompt: 'Solo Leveling style, hunter executing explosive burpee with energy burst, blue power rings expanding, dark gym, determination radiating'
    },
    {
      titleTemplate: 'Run {value} kilometers',
      descriptionTemplate: 'Build endurance worthy of a Shadow Monarch',
      baseValue: 5,
      baseXP: 250,
      imagePrompt: 'Solo Leveling style, hunter running with blue speed trails, shadow clones following, dark path ahead, energy foot prints, motion blur'
    },
    {
      titleTemplate: 'Hold plank for {value} seconds',
      descriptionTemplate: 'Core strength is the foundation of power',
      baseValue: 120,
      baseXP: 150,
      imagePrompt: 'Solo Leveling style, hunter in perfect plank with blue energy shield forming above, core glowing, unwavering focus, dark background'
    },
  ],
  Mind: [
    {
      titleTemplate: 'Meditate for {value} minutes',
      descriptionTemplate: 'Sharpen your mental focus and willpower',
      baseValue: 20,
      baseXP: 180,
      imagePrompt: 'Solo Leveling style, hunter meditating in lotus position, blue energy spiraling upward, third eye glowing, peaceful yet powerful aura, dark void'
    },
    {
      titleTemplate: 'Journal for {value} minutes',
      descriptionTemplate: 'Reflect on your journey and growth',
      baseValue: 15,
      baseXP: 150,
      imagePrompt: 'Solo Leveling style, hunter writing in glowing journal, memories visualizing as blue holograms, self-awareness awakening, contemplative mood'
    },
    {
      titleTemplate: 'Plan your strategy for {value} minutes',
      descriptionTemplate: 'Prepare for tomorrow battles',
      baseValue: 20,
      baseXP: 160,
      imagePrompt: 'Solo Leveling style, hunter studying glowing blue tactical map, chess pieces moving, strategy forming as energy lines, mastermind aura'
    },
    {
      titleTemplate: 'Visualize your goals for {value} minutes',
      descriptionTemplate: 'Manifest your desired future',
      baseValue: 10,
      baseXP: 140,
      imagePrompt: 'Solo Leveling style, hunter surrounded by glowing visions of future success, blue energy projections, dreams materializing, inspiration flowing'
    },
    {
      titleTemplate: 'Read {value} pages of development material',
      descriptionTemplate: 'Feed your mind with knowledge',
      baseValue: 30,
      baseXP: 170,
      imagePrompt: 'Solo Leveling style, hunter reading glowing book, knowledge flowing as blue particles into head, wisdom awakening, library of power'
    },
  ],
};

export function generateDailyQuest(
  category: 'Business' | 'Skill' | 'Physical' | 'Mind',
  level: number,
  difficultyMultiplier: number,
  userProfile: UserProfile
): GeneratedQuest {
  const templates = dailyQuestTemplates[category];
  const template = templates[Math.floor(Math.random() * templates.length)];

  const scaledValue = Math.floor(template.baseValue * difficultyMultiplier);
  const scaledXP = Math.floor(template.baseXP * (1 + level * 0.1));

  const title = template.titleTemplate.replace('{value}', scaledValue.toString());
  const description = template.descriptionTemplate;

  const dueDate = new Date();
  dueDate.setHours(23, 59, 59, 999);

  return {
    title,
    description,
    category,
    quest_type: 'Daily',
    xp_reward: scaledXP,
    difficulty: level,
    due_date: dueDate.toISOString(),
    image_prompt: template.imagePrompt,
  };
}
