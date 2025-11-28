# Solo Leveling System - Real Life RPG

A complete mobile application that transforms your real life into a Solo Leveling-style RPG experience. Track daily progress, complete quests, level up, earn titles, and ascend through ranks just like Sung Jin-Woo.

## Overview

This application gamifies your life with:
- **Leveling System**: Progress from Level 1 to infinity with exponential difficulty scaling
- **Rank Progression**: Ascend from E-Rank to SSS-Rank (Shadow Monarch)
- **100 Titles**: Unlock legendary titles as you achieve milestones
- **Dynamic Quests**: Daily, Boss, and Raid quests that scale with your level
- **Hunter Classes**: Choose Warrior, Assassin, Mage, or Shadow Monarch
- **Stats System**: Strength, Intelligence, Willpower, Discipline, Endurance
- **Streak System**: Maintain consistency to unlock bonuses
- **Dark Gothic UI**: Solo Leveling-inspired interface with holographic system panels

## Tech Stack

- **Frontend**: React Native + Expo Router
- **Backend**: Supabase (PostgreSQL + Authentication)
- **Styling**: Custom StyleSheet with Solo Leveling theme
- **Icons**: Lucide React Native
- **State Management**: React Context + Supabase Realtime

## Project Structure

```
project/
├── app/
│   ├── (tabs)/              # Main app screens
│   │   ├── index.tsx        # Dashboard
│   │   ├── quests.tsx       # Quest management
│   │   ├── titles.tsx       # Title collection
│   │   └── profile.tsx      # Hunter profile
│   ├── auth.tsx             # Authentication
│   ├── onboarding.tsx       # New user setup
│   └── _layout.tsx          # Root layout with auth routing
├── components/
│   ├── SystemCard.tsx       # Solo Leveling-style card
│   ├── SystemButton.tsx     # Themed button
│   └── ProgressBar.tsx      # XP/progress bars
├── contexts/
│   └── AuthContext.tsx      # Authentication state
├── lib/
│   ├── supabase.ts          # Supabase client
│   ├── game-logic.ts        # XP, leveling, title unlocks
│   ├── quest-generator.ts   # Dynamic quest creation
│   └── database.types.ts    # TypeScript types
├── constants/
│   └── theme.ts             # Color scheme and styling
├── assets/
│   ├── ascensions/          # Level-up artwork
│   ├── ranks/               # Rank promotion artwork
│   ├── titles/              # Title unlock icons
│   └── ARTWORK_GUIDE.md     # Art specifications
└── supabase/
    └── migrations/          # Database schema
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+
- Expo CLI
- Supabase account

### 2. Installation

```bash
npm install
```

### 3. Supabase Configuration

The Supabase database is already configured with:
- URL: Already set in `.env`
- Anon Key: Already set in `.env`
- Database tables: Created via migrations
- RLS policies: Enabled for security
- Seed data: 100 titles, rank data, level milestones

Database schema includes:
- `hunters` - User profiles and progress
- `hunter_stats` - Strength, Intelligence, etc.
- `hunter_goals` - User objectives and skillsets
- `titles` - All 100 titles with unlock conditions
- `hunter_titles` - Unlocked titles per user
- `quests` - Daily/Boss/Raid quests
- `level_milestones` - XP requirements per level
- `rank_data` - Rank information (E to SSS)
- `ascension_log` - Level/rank/title history

### 4. Run the App

```bash
npm run dev
```

Access the app via:
- Web browser (recommended for development)
- iOS Simulator
- Android Emulator
- Expo Go app

## Core Features

### Authentication

- Email/password signup with Supabase Auth
- Automatic hunter profile creation
- Session management
- Protected routes

### Onboarding Flow

New users go through a 3-step process:
1. **Class Selection**: Choose Warrior, Assassin, Mage, or Shadow Monarch
2. **Mission Definition**: Set primary goal, skills to build, daily availability
3. **Final Calibration**: Define weaknesses and long-term mission

### Dashboard

Real-time display of:
- Current level and XP progress
- Rank badge with color coding
- Current streak counter
- Total XP earned
- Active quests preview
- Hunter stats (Strength, Intelligence, etc.)

### Quest System

**Daily Quests** (5 per day):
- Business: Message leads, pitch clients, build automations
- Skill: Study, practice coding, write case studies
- Physical: Push-ups, walking, training
- Mind: Meditation, journaling, planning

**Boss Quests** (Weekly):
- High XP rewards (1000+)
- 7-day time limit
- More challenging objectives

**Raid Quests** (Monthly):
- Massive XP rewards (3000-5000)
- 30-day time limit
- Epic scale challenges

**Quest Difficulty Scaling**:
```javascript
scaledValue = baseValue * (1.15 ^ (level / 5))
```

Example: "Message X leads"
- Level 1: Message 10 leads
- Level 10: Message 20 leads
- Level 50: Message 150 leads
- Level 100: Message 500+ leads

### Leveling System

**XP Formula**: `XP = 100 * level^1.5`

Level progression:
- Level 1 → 2: 100 XP
- Level 10 → 11: 3,162 XP
- Level 50 → 51: 35,355 XP
- Level 100 → 101: 100,000 XP

**Level Rewards**:
- Automatic rank upgrades
- Stat increases (class-dependent)
- Title unlocks
- Ascension artwork

### Rank System

8 Ranks with level requirements:

| Rank | Min Level | Description |
|------|-----------|-------------|
| E | 1 | The beginning |
| D | 10 | Basic competence |
| C | 25 | Above average |
| B | 50 | Formidable |
| A | 75 | Elite |
| S | 100 | Legendary |
| SS | 150 | Mythical |
| SSS | 200 | Shadow Monarch |

### Title System

100 titles across 9 categories:

1. **Ascension** (20 titles): Level and rank milestones
2. **Shadow** (10 titles): Dark path progression
3. **Grinding** (10 titles): Consistency achievements
4. **Business** (10 titles): Sales and client work
5. **Discipline** (10 titles): Willpower and focus
6. **War** (10 titles): Combat-style productivity
7. **Mythic** (10 titles): Extraordinary achievements
8. **Insanity** (10 titles): Extreme dedication
9. **Legendary** (10 titles): End-game titles

**Title Unlock Conditions**:
- Reach specific levels
- Achieve rank promotions
- Maintain streaks
- Complete quest counts
- Reach stat thresholds
- Complete category-specific quests

### Stats System

5 Core Stats:
- **Strength**: Physical prowess
- **Intelligence**: Mental capability
- **Willpower**: Mental fortitude
- **Discipline**: Focus and consistency
- **Endurance**: Stamina and persistence

**Class Bonuses**:
- Warrior: +Strength per level
- Assassin: +Discipline per level
- Mage: +Intelligence per level
- Shadow Monarch: +Willpower per level

### Streak System

- Track consecutive days of activity
- Bonus XP multipliers for long streaks
- Penalty mode activated on missed days
- Longest streak recorded

## Game Mechanics

### Quest Completion

When completing a quest:
1. XP is awarded
2. Total XP is calculated
3. Level is recalculated (may level up multiple times)
4. Rank is checked and updated
5. Stats are increased for level-ups
6. Title unlock conditions are checked
7. Ascension log is updated
8. Animations/notifications are triggered

### Title Unlocking

Automatic background checking:
```javascript
checkTitleUnlock(hunterId, hunter, stats, questCounts)
```

Checks all 100 titles against:
- Current level
- Current rank
- Streak count
- Total XP
- Individual stats
- Quest completion counts
- Quest type counts
- Category-specific counts

### Difficulty Scaling

All quest objectives scale with level:
```javascript
scaleQuestDifficulty(baseValue, level)
```

Creates a natural progression where:
- Early levels feel achievable
- Mid levels provide challenge
- High levels demand excellence
- Level 100+ requires superhuman effort

## UI/UX Design

### Color Scheme

- **Background**: Deep blue-black (#0a0e1a)
- **System Blue**: Holographic blue (#3b82f6)
- **Glow**: Cyan accent (#38bdf8)
- **Ranks**: Color-coded (E=gray, S=red, SSS=gold)

### Components

**SystemCard**:
- Blue holographic borders
- Shadow effects
- Optional glow animation
- Dark background

**SystemButton**:
- Three variants (primary, secondary, danger)
- Loading states
- Disabled states
- Glow effects

**ProgressBar**:
- Animated fills
- Glow effects on bar
- XP counters
- Color customization

### Typography

- **Titles**: Large, bold, uppercase, letter-spaced
- **Body**: Clean, readable
- **Accents**: Cyan highlights
- **Numbers**: Bold, prominent

## Database Security

All tables use Row Level Security (RLS):

**Hunters Table**:
```sql
CREATE POLICY "Users can view own hunter data"
  ON hunters FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
```

**Pattern Applied To**:
- Hunters (read/write own)
- Stats (read/write own)
- Goals (read/write own)
- Hunter Titles (read/write own)
- Quests (read/write/delete own)
- Ascension Log (read/write own)
- Titles (read-only for all)
- Level Milestones (read-only for all)
- Rank Data (read-only for all)

## API Endpoints (Built-in Functions)

While this uses Supabase client-side SDK, key operations:

**Authentication**:
- `signUp(email, password, username)`
- `signIn(email, password)`
- `signOut()`

**Game Logic**:
- `completeQuest(questId, hunterId)`
- `checkTitleUnlock(hunterId, hunter, stats, questCounts)`
- `generateDailyQuests(level, goals)`
- `generateBossQuest(level)`
- `generateRaidQuest(level)`

## Extending the System

### Adding New Titles

1. Insert into `titles` table
2. Define unlock requirement as JSON
3. Add image path
4. Set rarity and category

```sql
INSERT INTO titles (name, description, category, unlock_requirement, rarity)
VALUES (
  'New Title',
  'Description',
  'Ascension',
  '{"type": "level", "value": 150}',
  'Mythic'
);
```

### Adding New Quest Templates

Edit `lib/quest-generator.ts`:

```javascript
const newQuests: QuestTemplate[] = [
  {
    title: 'Do {value} of something',
    description: 'Description',
    category: 'Business',
    baseValue: 10,
    xpReward: 200
  }
];
```

### Customizing Difficulty Scaling

Modify in `lib/game-logic.ts`:

```javascript
export const scaleQuestDifficulty = (baseValue: number, level: number): number => {
  return Math.floor(baseValue * Math.pow(1.15, level / 5));
};
```

## Artwork Integration

The app is designed to display custom artwork for:
- Level ascensions (key levels: 1, 5, 10, 20, 30, 40, 50, 75, 100, 150, 200)
- Rank promotions (E through SSS)
- Title unlocks (all 100 titles)
- Quest types
- Boss encounters

See `assets/ARTWORK_GUIDE.md` for detailed specifications.

**Current Implementation**: Paths are set up but assets need to be added. The system will work without artwork but will show placeholder states.

## Future Enhancements

Potential additions:
- [ ] Daily quest auto-generation with cron job
- [ ] Leaderboards (optional social features)
- [ ] Achievement badges
- [ ] Custom quest creation
- [ ] Weekly/monthly reports from "The System"
- [ ] Push notifications for quests
- [ ] Class-specific abilities
- [ ] Guild/team features
- [ ] Ascension animations with react-native-reanimated
- [ ] Sound effects and music
- [ ] Dark mode toggle (currently always dark)

## Development Notes

### Key Files to Understand

1. `lib/game-logic.ts` - Core leveling/XP mechanics
2. `lib/quest-generator.ts` - Quest creation logic
3. `contexts/AuthContext.tsx` - Auth flow
4. `app/(tabs)/index.tsx` - Main dashboard
5. Database migrations in Supabase

### Testing

To test the system:
1. Sign up as new user
2. Complete onboarding
3. Complete quests to see XP gain
4. Level up to see rank progression
5. Check titles screen for unlocks

### Debugging

Use Supabase dashboard to:
- View raw data in tables
- Check RLS policies
- Monitor API calls
- View logs

## Troubleshooting

**Issue**: Not authenticated
- Check `.env` file has correct Supabase credentials
- Verify auth session in Supabase dashboard

**Issue**: Quests not appearing
- Check `hunter_goals` table is populated
- Verify quest generation in onboarding

**Issue**: Titles not unlocking
- Check `checkTitleUnlock` logic
- Verify unlock requirements in database

**Issue**: XP not calculating correctly
- Review `game-logic.ts` formulas
- Check `level_milestones` table data

## License

This is a demonstration project inspired by Solo Leveling. All game mechanics are original implementations.

## Credits

- Inspired by Solo Leveling (manhwa/anime)
- Built with React Native and Expo
- Database by Supabase
- Icons by Lucide

---

**Welcome to the System, Hunter. Your ascension begins now.**
