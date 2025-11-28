# AI Quest System & Progression Engine - Complete Guide

This document describes the new AI-powered quest generation system, XP calculation engine, and visual progression system added to your Solo Leveling app.

## What Was Added

### 1. AI Quest Generation Engine (`/services/questEngine/`)

Intelligent quest generation that adapts to your hunter profile, level, and goals.

#### Files Created:
- `questGenerator.ts` - Main orchestrator for quest generation
- `dailyQuest.ts` - 25+ daily quest templates with Solo Leveling imagery
- `weeklyBossQuest.ts` - Epic boss encounters with unique artwork prompts
- `adaptiveDifficulty.ts` - Difficulty scaling based on level and streak

#### Features:
- **Personalized Quest Selection**: Analyzes your skillset, goals, and weaknesses to generate relevant quests
- **Dynamic Difficulty Scaling**: Quest requirements scale exponentially with level (1.15^(level/5))
- **Category-Based Quests**:
  - Business (sales, outreach, automation)
  - Skill (AI, coding, learning)
  - Physical (training, exercise)
  - Mind (meditation, planning, reflection)
- **Boss Quests**: Weekly challenges unlocked at level 5+
- **Raid Quests**: Monthly epic challenges unlocked at level 25+

#### How It Works:
```typescript
const dailyQuests = generateDailyQuests(userProfile, level, streak, 5);
// Returns 5 personalized quests scaled to your level

const bossQuest = generateWeeklyBoss(userProfile, level, streak);
// Returns 1 epic boss challenge
```

### 2. XP & Progression System (`/services/progression/`)

Advanced progression mechanics with multiple reward layers.

#### Files Created:
- `xpCalculator.ts` - XP rewards with multipliers and bonuses
- `levelSystem.ts` - Exponential leveling (XP = 100 * level^1.5)
- `rankSystem.ts` - 8 ranks from E to SSS with metadata
- `titleUnlocker.ts` - Automatic title unlock checking

#### Progression Formula:
```
XP = baseXP × levelBonus × streakMultiplier × questTypeMultiplier

Level Requirements:
- Level 1→2: 100 XP
- Level 10→11: 3,162 XP
- Level 50→51: 35,355 XP
- Level 100→101: 100,000 XP

Streak Bonuses:
- 7+ days: 1.25x XP
- 14+ days: 1.5x XP
- 30+ days: 2.0x XP

Quest Type Bonuses:
- Daily: 1.0x
- Boss: 1.5x
- Raid: 2.0x
```

#### Combo Bonuses:
- 3 quests in one day: +200 XP
- 5 quests in one day: +500 XP
- Perfect day (all daily + boss): +3000 XP

### 3. Art Generation Engine (`/services/artEngine/`)

Solo Leveling-themed image prompts for every progression milestone.

#### Files Created:
- `imagePromptGenerator.ts` - Dynamic prompt creation
- `ascensionArt.ts` - Level-up artwork (11 milestones)
- `rankArt.ts` - Rank promotion artwork (8 ranks)
- `titleArt.ts` - Title unlock artwork (100 titles)

#### Image Themes:
Every image prompt features **Sung Jin-Woo** in Solo Leveling style:
- Dark gothic aesthetic
- Blue holographic energy
- Shadow particles and beasts
- Dramatic power manifestations
- Rank-specific color schemes

#### Ascension Milestones:
- Level 1: Awakening (blue glow beginning)
- Level 10: Shadow manifestation
- Level 50: Half transformation
- Level 100: S-Rank power (crimson energy)
- Level 200: Shadow Monarch form (golden-black aura)

### 4. Visual System Panels (`/ui/systemPanels/`)

Animated full-screen panels for major events.

#### Files Created:
- `LevelUpPanel.tsx` - Level ascension celebration
- `RankUpPanel.tsx` - Rank promotion ceremony
- `TitleUnlockedPanel.tsx` - Title acquisition
- `QuestClearedPanel.tsx` - Quest completion with XP breakdown

#### Features:
- Sequential animations (Quest → Level → Rank)
- Sung Jin-Woo themed imagery
- Rank-specific color schemes
- XP breakdown displays
- Combo bonus notifications

### 5. System Controller (`/services/systemController.ts`)

Central orchestration layer that ties everything together.

#### Main Functions:

**Quest Completion:**
```typescript
const result = await completeQuestWithSystem(questId, hunterId);
// Returns: {
//   xpGained, totalXP, comboBonus,
//   levelUp: { oldLevel, newLevel, artwork },
//   rankUp: { oldRank, newRank, artwork },
//   titlesUnlocked: [...]
// }
```

**Quest Generation:**
```typescript
await generateQuestsForHunter(hunterId);
// Automatically creates 5 daily quests + 1 boss quest (if level 5+)
```

## Integration Points

### Dashboard Integration
Added "AI Quest Generation" button:
- Analyzes your profile
- Generates personalized quests
- Unlocks boss quests at level 5+
- Shows notification when complete

### Quest Screen Integration
Enhanced quest completion:
1. Quest cleared panel shows first
2. If leveled up → Level up panel appears
3. If ranked up → Rank up panel appears
4. All with smooth transitions

## How to Use

### Generate New Quests:
1. Go to Dashboard
2. Scroll to "AI Quest Generation" section
3. Tap "GENERATE NEW QUESTS"
4. Check Quest Log to see new quests

### Complete Quests with Full Experience:
1. Go to Quest Log
2. Complete an active quest
3. Watch the progression panels:
   - Quest Cleared (XP gained, combo bonuses)
   - Level Up (if you leveled)
   - Rank Up (if you ranked up)

### Quest Difficulty Scaling:
At level 1: "Message 10 leads"
At level 50: "Message 150 leads"
At level 100: "Message 500+ leads"

## Image Placeholder System

All image paths are configured but use placeholder URLs currently:
```
/assets/ascensions/level-{number}.png
/assets/ranks/{rank}-rank.png
/assets/titles/{title-name}.png
```

Current implementation uses Pexels placeholder with overlay text showing:
- Character name (SUNG JIN-WOO)
- Event type (ASCENDING, S-RANK HUNTER, etc.)

### Adding Real Images:
1. Generate images using the provided prompts in each artwork file
2. Save to the appropriate assets folder
3. Images will automatically display in panels

## Quest Template Examples

### Business Quest:
```typescript
{
  title: 'Message {value} high-value leads',
  description: 'Reach out to qualified prospects...',
  imagePrompt: 'Solo Leveling style, hunter sending glowing blue message arrows through void, holographic contact list, energy trails, dramatic shadows...'
}
```

### Boss Quest:
```typescript
{
  title: 'BOSS RAID: Close {value} High-Value Deals',
  description: 'The Prospector King challenges you...',
  bossName: 'The Prospector King',
  imagePrompt: 'Solo Leveling style, massive shadowy boss figure made of gold coins and contracts, glowing red eyes, business suit armor...'
}
```

## Technical Implementation

### Quest Difficulty Formula:
```typescript
scaledValue = baseValue × (1.15 ^ (level / 5))
```

### XP Calculation:
```typescript
totalXP = baseXP × (1 + level × 0.1) × streakMultiplier × questTypeMultiplier
```

### Level Calculation:
```typescript
XP_FORMULA(level) = Math.floor(100 × level^1.5)
```

### Rank Thresholds:
- E: Level 1+
- D: Level 10+
- C: Level 25+
- B: Level 50+
- A: Level 75+
- S: Level 100+
- SS: Level 150+
- SSS: Level 200+

## File Structure

```
services/
├── questEngine/
│   ├── questGenerator.ts      (Main generator)
│   ├── dailyQuest.ts          (25+ templates)
│   ├── weeklyBossQuest.ts     (7 boss templates)
│   └── adaptiveDifficulty.ts  (Scaling logic)
├── progression/
│   ├── xpCalculator.ts        (XP & bonuses)
│   ├── levelSystem.ts         (Leveling math)
│   ├── rankSystem.ts          (Rank metadata)
│   └── titleUnlocker.ts       (Title checks)
├── artEngine/
│   ├── imagePromptGenerator.ts (Dynamic prompts)
│   ├── ascensionArt.ts         (11 milestones)
│   ├── rankArt.ts              (8 ranks)
│   └── titleArt.ts             (100 titles)
└── systemController.ts         (Orchestrator)

ui/
└── systemPanels/
    ├── LevelUpPanel.tsx
    ├── RankUpPanel.tsx
    ├── TitleUnlockedPanel.tsx
    └── QuestClearedPanel.tsx
```

## Image Prompt Philosophy

Every image prompt follows this structure:
1. **Base Style**: "Solo Leveling style, Sung Jin-Woo"
2. **Specific Scene**: Action, pose, environment
3. **Energy Effects**: Blue glow, shadows, particles
4. **Aesthetic**: Dark gothic, dramatic lighting

Example:
```
Solo Leveling style, Sung Jin-Woo with shadow army glimpse,
dark figures materializing, blue energy chains, power
consolidating, hunter evolution, dramatic shadows, gothic
aesthetic, high quality anime art
```

## Future Enhancements

The system is designed to support:
- Actual image generation via DALL-E/Midjourney API
- Raid quest unlocking at level 25+
- Title unlock animations
- Stat-based title requirements
- Category completion tracking
- Achievement combos

## Summary

You now have a complete AI-powered progression system that:
1. **Generates** personalized quests based on your profile
2. **Scales** difficulty exponentially with your level
3. **Calculates** XP with multiple bonus layers
4. **Displays** stunning Solo Leveling-themed progression panels
5. **Tracks** everything from levels to ranks to combo bonuses

All while maintaining the dark, gothic Solo Leveling aesthetic with Sung Jin-Woo as the protagonist throughout your journey from E-Rank to Shadow Monarch.
