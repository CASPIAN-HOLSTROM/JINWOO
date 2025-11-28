export interface TitleArtwork {
  titleName: string;
  imagePath: string;
  prompt: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
}

export function generateTitleArtwork(titleName: string, rarity: string): TitleArtwork {
  return {
    titleName,
    imagePath: `/assets/titles/${titleName.toLowerCase().replace(/ /g, '-')}.png`,
    prompt: generateTitlePrompt(titleName, rarity),
    rarity: rarity as any,
  };
}

function generateTitlePrompt(titleName: string, rarity: string): string {
  const baseStyle = 'Solo Leveling style, Sung Jin-Woo';
  const lower = titleName.toLowerCase();

  let specificPrompt = '';

  if (lower.includes('reawakened')) {
    specificPrompt = 'eyes opening with blue glow, system panel materializing, awakening moment, dark background';
  } else if (lower.includes('shadow monarch')) {
    specificPrompt = 'ultimate form, divine darkness, shadow army legion, throne of darkness, godlike power';
  } else if (lower.includes('shadow')) {
    specificPrompt = 'commanding shadows, dark energy swirling, shadow beasts forming, monarch presence';
  } else if (lower.includes('discipline')) {
    specificPrompt = 'unwavering focus, blue energy concentration, iron will visible, mental fortress';
  } else if (lower.includes('grinder') || lower.includes('daily')) {
    specificPrompt = 'training intensely, never stopping, sweat glowing, relentless determination';
  } else if (lower.includes('conqueror') || lower.includes('dominator')) {
    specificPrompt = 'standing victorious, enemies defeated, commanding presence, absolute victory';
  } else if (lower.includes('warrior')) {
    specificPrompt = 'combat ready, weapon in hand, battle scars, strength radiating';
  } else if (lower.includes('assassin') || lower.includes('blade')) {
    specificPrompt = 'daggers ready, stealth mode, precise deadly focus, shadow movement';
  } else if (lower.includes('mage') || lower.includes('knowledge')) {
    specificPrompt = 'magical energy, spell casting, intelligent eyes, power through knowledge';
  } else if (lower.includes('monarch')) {
    specificPrompt = 'royal presence, crown of shadows, commanding legion, absolute authority';
  } else if (lower.includes('legend') || lower.includes('mythic')) {
    specificPrompt = 'legendary pose, myth becoming real, awe-inspiring, historical moment';
  } else if (lower.includes('boss')) {
    specificPrompt = 'defeating massive boss, epic scale, energy explosion, triumph pose';
  } else if (lower.includes('streak')) {
    specificPrompt = 'consistent power, daily improvement visible, growth chart glowing, dedication manifest';
  } else {
    specificPrompt = 'achieving milestone, proud stance, blue energy celebration, accomplishment radiating';
  }

  let rarityEffect = '';
  switch (rarity) {
    case 'Mythic':
      rarityEffect = 'golden divine aura, cosmic effects, reality bending';
      break;
    case 'Legendary':
      rarityEffect = 'golden glow, legendary presence, awe-inspiring';
      break;
    case 'Epic':
      rarityEffect = 'purple-blue energy, epic scale, powerful';
      break;
    case 'Rare':
      rarityEffect = 'blue glow, notable power, impressive';
      break;
    default:
      rarityEffect = 'subtle aura, beginning power';
  }

  return `${baseStyle}, ${specificPrompt}, ${rarityEffect}, dark gothic aesthetic, high quality`;
}
