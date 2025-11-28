export interface ImageGenerationRequest {
  prompt: string;
  type: 'ascension' | 'rank' | 'title' | 'quest' | 'boss';
  level?: number;
  rank?: string;
  titleName?: string;
}

export function generateImagePrompt(request: ImageGenerationRequest): string {
  const baseStyle = 'Solo Leveling manhwa style, Sung Jin-Woo, dark gothic aesthetic, dramatic lighting, blue glowing effects, shadow particles, high quality anime art, detailed';

  let specificPrompt = '';

  switch (request.type) {
    case 'ascension':
      specificPrompt = getAscensionPrompt(request.level || 1);
      break;
    case 'rank':
      specificPrompt = getRankPrompt(request.rank || 'E');
      break;
    case 'title':
      specificPrompt = getTitlePrompt(request.titleName || 'Unknown');
      break;
    case 'quest':
      specificPrompt = 'completing quest, determined expression, blue system panel visible, energy flowing, action pose, dark environment';
      break;
    case 'boss':
      specificPrompt = 'facing massive shadow boss, epic confrontation, energy clashing, determined stance, weapon ready, dramatic scale';
      break;
  }

  return `${baseStyle}, ${specificPrompt}`;
}

function getAscensionPrompt(level: number): string {
  if (level >= 200) {
    return 'Shadow Monarch final form, divine darkness, golden-black cosmic aura, army of shadows, throne materializing, absolute power, universe bending';
  } else if (level >= 150) {
    return 'SS-rank transformation, void lightning, pink-purple energy storm, reality cracking, shadow legion forming, transcendent power';
  } else if (level >= 100) {
    return 'S-rank breakthrough, massive crimson-red energy explosion, purple glowing eyes, shadow army emerging, legendary awakening, power overwhelming';
  } else if (level >= 75) {
    return 'A-rank ascension, golden energy surge, elite power manifestation, shadow beasts visible, commanding presence, national level threat';
  } else if (level >= 50) {
    return 'B-rank evolution, purple-blue aura, shadow weapons forming, half transformation, power crystallizing, formidable hunter';
  } else if (level >= 40) {
    return 'shadow army glimpse, dark figures behind, blue energy chains, power building, hunter leveling up';
  } else if (level >= 30) {
    return 'power crystallization, blue energy armor forming, shadow daggers appearing, confidence growing';
  } else if (level >= 20) {
    return 'dark aura manifesting, blue-black energy swirling, eyes glowing brighter, strength emerging';
  } else if (level >= 10) {
    return 'first shadow power, dark wisps forming, blue glow, system interface visible, awakening beginning';
  } else if (level >= 5) {
    return 'initial power surge, blue energy crackling around body, eyes starting to glow, determination visible';
  }
  return 'awakening moment, system panel appearing, eyes glowing blue for first time, dark room, life changing';
}

function getRankPrompt(rank: string): string {
  const prompts: Record<string, string> = {
    E: 'E-rank hunter, weak but determined, hospital gown, faint aura, tired but hopeful, beginning',
    D: 'D-rank hunter, basic gear, green energy, training pose, growth visible, determined expression',
    C: 'C-rank hunter, improved armor, blue energy, combat ready, skilled stance, power building',
    B: 'B-rank hunter, advanced gear, purple aura, elite pose, formidable presence, enemies wary',
    A: 'A-rank hunter, master armor, golden glow, commanding stance, national power, shadow hints',
    S: 'S-rank legendary, crimson energy, purple glowing eyes, shadow monarch emerging, epic scale',
    SS: 'SS-rank mythical, void lightning, pink energy, reality warping, shadow army visible, transcendent',
    SSS: 'SSS-rank Shadow Monarch, divine darkness, golden-black aura, shadow legion, throne, godlike',
  };
  return prompts[rank] || prompts.E;
}

function getTitlePrompt(titleName: string): string {
  const lower = titleName.toLowerCase();

  if (lower.includes('shadow') || lower.includes('monarch')) {
    return 'shadow monarch power, dark energy, commanding presence, legion behind, throne visible';
  }
  if (lower.includes('discipline') || lower.includes('focus')) {
    return 'intense focus, blue energy concentration, unwavering determination, mental power visible';
  }
  if (lower.includes('warrior') || lower.includes('strength')) {
    return 'powerful combat stance, muscles tensed, weapon ready, strength radiating';
  }
  if (lower.includes('legend') || lower.includes('mythic')) {
    return 'legendary pose, golden aura, myth made real, awe-inspiring presence';
  }
  if (lower.includes('grind') || lower.includes('daily')) {
    return 'relentless training, sweat glowing blue, never giving up, grinding forward';
  }

  return 'achieving milestone, blue energy celebration, proud stance, accomplishment visible';
}
