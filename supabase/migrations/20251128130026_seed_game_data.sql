/*
  # Seed Game Data - Ranks, Levels, and All 100 Titles

  ## Purpose
  Populate the database with:
  1. Rank progression data (E to SSS)
  2. Level milestone data (1-200)
  3. All 100 Solo Leveling titles with unlock requirements
  
  ## Data Structure
  - 8 Ranks with descriptions and level requirements
  - 200 Level milestones with XP curves
  - 100 Titles across 9 categories with unlock conditions
*/

-- Insert Rank Data
INSERT INTO rank_data (rank, min_level, description, image_path) VALUES
('E', 1, 'The beginning of your journey as a Hunter. Weak, but with potential.', '/assets/ranks/e-rank.png'),
('D', 10, 'You have proven basic competence. Your discipline is forming.', '/assets/ranks/d-rank.png'),
('C', 25, 'An above-average Hunter. You stand out from the masses.', '/assets/ranks/c-rank.png'),
('B', 50, 'A formidable Hunter. Few reach this level of dedication.', '/assets/ranks/b-rank.png'),
('A', 75, 'An elite Hunter. Your name is known among the disciplined.', '/assets/ranks/a-rank.png'),
('S', 100, 'A legendary Hunter. You have transcended normal limits.', '/assets/ranks/s-rank.png'),
('SS', 150, 'A mythical existence. Reality bends to your will.', '/assets/ranks/ss-rank.png'),
('SSS', 200, 'The Shadow Monarch. You have achieved the impossible.', '/assets/ranks/sss-rank.png')
ON CONFLICT (rank) DO NOTHING;

-- Insert Level Milestones (exponential XP curve)
-- Formula: XP = 100 * level^1.5
DO $$
DECLARE
  i INT;
  xp_needed INT;
  rank_unlock TEXT;
BEGIN
  FOR i IN 1..200 LOOP
    xp_needed := FLOOR(100 * POWER(i, 1.5));
    
    -- Determine rank unlocks
    rank_unlock := NULL;
    IF i = 1 THEN rank_unlock := 'E';
    ELSIF i = 10 THEN rank_unlock := 'D';
    ELSIF i = 25 THEN rank_unlock := 'C';
    ELSIF i = 50 THEN rank_unlock := 'B';
    ELSIF i = 75 THEN rank_unlock := 'A';
    ELSIF i = 100 THEN rank_unlock := 'S';
    ELSIF i = 150 THEN rank_unlock := 'SS';
    ELSIF i = 200 THEN rank_unlock := 'SSS';
    END IF;
    
    INSERT INTO level_milestones (level, xp_required, rank_unlock, image_path)
    VALUES (
      i,
      xp_needed,
      rank_unlock,
      CASE 
        WHEN i IN (1, 5, 10, 20, 30, 40, 50, 75, 100, 150, 200) 
        THEN '/assets/ascensions/level-' || i || '.png'
        ELSE NULL
      END
    )
    ON CONFLICT (level) DO NOTHING;
  END LOOP;
END $$;

-- Insert All 100 Titles

-- Ascension Titles (1-20)
INSERT INTO titles (name, description, category, unlock_requirement, rarity, image_path) VALUES
('The Reawakened One', 'You have opened your eyes to the System.', 'Ascension', '{"type": "level", "value": 1}', 'Common', '/assets/titles/reawakened.png'),
('Conqueror of Adversity', 'You faced the darkness and emerged stronger.', 'Ascension', '{"type": "level", "value": 5}', 'Rare', '/assets/titles/conqueror.png'),
('The Relentless Ascender', 'Your rise knows no pause.', 'Ascension', '{"type": "level", "value": 10}', 'Rare', '/assets/titles/relentless.png'),
('The One Who Returned from the Abyss', 'You clawed your way back from defeat.', 'Ascension', '{"type": "streak", "value": 7}', 'Epic', '/assets/titles/abyss.png'),
('Monarch of Discipline', 'Your will commands reality itself.', 'Ascension', '{"type": "level", "value": 20}', 'Epic', '/assets/titles/monarch-discipline.png'),
('Shadowborne Prodigy', 'Born from shadow, destined for greatness.', 'Ascension', '{"type": "rank", "value": "C"}', 'Epic', '/assets/titles/shadowborne.png'),
('The Unbroken Vessel', 'No setback can shatter you.', 'Ascension', '{"type": "streak", "value": 30}', 'Legendary', '/assets/titles/unbroken.png'),
('Titan of Will', 'Your willpower towers above mortals.', 'Ascension', '{"type": "stat", "stat": "willpower", "value": 50}', 'Legendary', '/assets/titles/titan.png'),
('Keeper of the Iron Mind', 'Your mind is forged in steel.', 'Ascension', '{"type": "stat", "stat": "discipline", "value": 50}', 'Legendary', '/assets/titles/iron-mind.png'),
('The Ascended Hunter', 'You have transcended your former self.', 'Ascension', '{"type": "level", "value": 30}', 'Epic', '/assets/titles/ascended.png'),
('He Who Defies Limits', 'Limits are illusions to you.', 'Ascension', '{"type": "level", "value": 40}', 'Legendary', '/assets/titles/defies-limits.png'),
('The Boundless', 'No ceiling contains your growth.', 'Ascension', '{"type": "level", "value": 50}', 'Legendary', '/assets/titles/boundless.png'),
('The Ever-Rising', 'Your ascent is eternal.', 'Ascension', '{"type": "total_xp", "value": 50000}', 'Legendary', '/assets/titles/ever-rising.png'),
('Architect of His Own Legend', 'You write your own story.', 'Ascension', '{"type": "level", "value": 60}', 'Mythic', '/assets/titles/architect.png'),
('The Awakened Sovereign', 'You rule your own destiny.', 'Ascension', '{"type": "rank", "value": "A"}', 'Mythic', '/assets/titles/sovereign.png'),
('Heir of the Impossible', 'You inherit what others deem unreachable.', 'Ascension', '{"type": "level", "value": 70}', 'Mythic', '/assets/titles/heir.png'),
('Limitbreaker', 'You shatter every boundary.', 'Ascension', '{"type": "level", "value": 80}', 'Mythic', '/assets/titles/limitbreaker.png'),
('The Phoenix in Human Form', 'You rise from every fall, stronger.', 'Ascension', '{"type": "quest_completed", "value": 100}', 'Mythic', '/assets/titles/phoenix.png'),
('The Undying Focus', 'Your concentration cannot be broken.', 'Ascension', '{"type": "stat", "stat": "intelligence", "value": 75}', 'Mythic', '/assets/titles/undying-focus.png'),
('The Unyielding Pilgrim', 'Your journey never ends.', 'Ascension', '{"type": "level", "value": 90}', 'Mythic', '/assets/titles/pilgrim.png')
ON CONFLICT (name) DO NOTHING;

-- Shadow Titles (21-30)
INSERT INTO titles (name, description, category, unlock_requirement, rarity, image_path) VALUES
('Shadow of Discipline', 'You move through life like a shadow—silent, deadly, focused.', 'Shadow', '{"type": "stat", "stat": "discipline", "value": 30}', 'Rare', '/assets/titles/shadow-discipline.png'),
('Lord of Black Resolve', 'Your resolve is dark and unyielding.', 'Shadow', '{"type": "rank", "value": "B"}', 'Epic', '/assets/titles/black-resolve.png'),
('Sovereign of the Gloompath', 'You walk the path others fear.', 'Shadow', '{"type": "level", "value": 35}', 'Epic', '/assets/titles/gloompath.png'),
('Bearer of the Silent Oath', 'You swore an oath to yourself in silence.', 'Shadow', '{"type": "streak", "value": 14}', 'Epic', '/assets/titles/silent-oath.png'),
('Whisper in the Void', 'You exist between action and thought.', 'Shadow', '{"type": "quest_type", "quest_type": "Daily", "value": 50}', 'Epic', '/assets/titles/whisper-void.png'),
('Monarch of Shadowwork', 'You rule the unseen hours of labor.', 'Shadow', '{"type": "level", "value": 45}', 'Legendary', '/assets/titles/shadowwork.png'),
('The Umbral Strategist', 'Your plans unfold in darkness.', 'Shadow', '{"type": "stat", "stat": "intelligence", "value": 50}', 'Legendary', '/assets/titles/umbral.png'),
('The Abysswalker', 'You traverse the deepest depths.', 'Shadow', '{"type": "rank", "value": "A"}', 'Legendary', '/assets/titles/abysswalker.png'),
('Keeper of the Nightbound Flame', 'Your fire burns brightest in darkness.', 'Shadow', '{"type": "level", "value": 65}', 'Mythic', '/assets/titles/nightbound.png'),
('Whisperer to the Dark', 'The darkness listens when you speak.', 'Shadow', '{"type": "level", "value": 85}', 'Mythic', '/assets/titles/whisperer.png')
ON CONFLICT (name) DO NOTHING;

-- Grinding Titles (31-40)
INSERT INTO titles (name, description, category, unlock_requirement, rarity, image_path) VALUES
('Executor of Will', 'You execute without hesitation.', 'Grinding', '{"type": "quest_completed", "value": 10}', 'Common', '/assets/titles/executor.png'),
('The Daily Reaper', 'You harvest progress every single day.', 'Grinding', '{"type": "streak", "value": 10}', 'Rare', '/assets/titles/daily-reaper.png'),
('God of Consistency', 'You are the embodiment of relentless repetition.', 'Grinding', '{"type": "streak", "value": 21}', 'Epic', '/assets/titles/consistency.png'),
('Hammer of Persistence', 'You strike again and again until breakthrough.', 'Grinding', '{"type": "quest_completed", "value": 50}', 'Epic', '/assets/titles/hammer.png'),
('The Tireless Machine', 'You operate without fatigue.', 'Grinding', '{"type": "quest_completed", "value": 100}', 'Legendary', '/assets/titles/machine.png'),
('Iron-Backed Worker', 'Your spine is steel, your effort endless.', 'Grinding', '{"type": "quest_completed", "value": 150}', 'Legendary', '/assets/titles/iron-backed.png'),
('The 24/7 Juggernaut', 'You never stop moving forward.', 'Grinding', '{"type": "streak", "value": 60}', 'Legendary', '/assets/titles/juggernaut.png'),
('The Endless Marcher', 'Your march has no end.', 'Grinding', '{"type": "quest_completed", "value": 250}', 'Mythic', '/assets/titles/marcher.png'),
('The Man Who Does Not Stop', 'Stopping is not in your vocabulary.', 'Grinding', '{"type": "streak", "value": 100}', 'Mythic', '/assets/titles/does-not-stop.png'),
('The 10,000-Hour Prophet', 'Mastery is your prophecy fulfilled.', 'Grinding', '{"type": "total_xp", "value": 100000}', 'Mythic', '/assets/titles/prophet.png')
ON CONFLICT (name) DO NOTHING;

-- Business/Builder Titles (41-50)
INSERT INTO titles (name, description, category, unlock_requirement, rarity, image_path) VALUES
('Closer of Worlds', 'You close deals that reshape reality.', 'Business', '{"type": "category_completed", "category": "Business", "value": 20}', 'Rare', '/assets/titles/closer.png'),
('Master of Dealflow', 'Opportunities flow to you endlessly.', 'Business', '{"type": "category_completed", "category": "Business", "value": 50}', 'Epic', '/assets/titles/dealflow.png'),
('The Prospect Slayer', 'You hunt prospects with lethal precision.', 'Business', '{"type": "category_completed", "category": "Business", "value": 75}', 'Epic', '/assets/titles/prospect-slayer.png'),
('Architect of Outcomes', 'You design results before they happen.', 'Business', '{"type": "category_completed", "category": "Business", "value": 100}', 'Legendary', '/assets/titles/outcomes.png'),
('Hunter of Opportunities', 'No opportunity escapes your sight.', 'Business', '{"type": "level", "value": 25}', 'Epic', '/assets/titles/hunter-opp.png'),
('The Cold Outreach Emperor', 'Your outreach commands empires.', 'Business', '{"type": "category_completed", "category": "Business", "value": 150}', 'Legendary', '/assets/titles/outreach.png'),
('The Lead-Devouring Wolf', 'You consume leads with savage efficiency.', 'Business', '{"type": "category_completed", "category": "Business", "value": 200}', 'Legendary', '/assets/titles/wolf.png'),
('The Pipeline Monarch', 'Your pipeline is an unstoppable force.', 'Business', '{"type": "category_completed", "category": "Business", "value": 300}', 'Mythic', '/assets/titles/pipeline.png'),
('The Conversion Sorcerer', 'You transmute leads into gold.', 'Business', '{"type": "category_completed", "category": "Business", "value": 400}', 'Mythic', '/assets/titles/conversion.png'),
('He Who Never Misses Targets', 'Your aim is absolute.', 'Business', '{"type": "category_completed", "category": "Business", "value": 500}', 'Mythic', '/assets/titles/never-misses.png')
ON CONFLICT (name) DO NOTHING;

-- Discipline Titles (51-60)
INSERT INTO titles (name, description, category, unlock_requirement, rarity, image_path) VALUES
('Mind of Unshakable Steel', 'Your mind cannot be moved.', 'Discipline', '{"type": "stat", "stat": "discipline", "value": 40}', 'Epic', '/assets/titles/steel-mind.png'),
('The Iron Stoic', 'You endure all without reaction.', 'Discipline', '{"type": "stat", "stat": "willpower", "value": 40}', 'Epic', '/assets/titles/stoic.png'),
('The Calm Among Chaos', 'Chaos swirls around you, but you remain still.', 'Discipline', '{"type": "streak", "value": 20}', 'Rare', '/assets/titles/calm.png'),
('Self-Made Titan', 'You forged yourself from nothing.', 'Discipline', '{"type": "level", "value": 40}', 'Epic', '/assets/titles/self-made.png'),
('Commander of Actions', 'Your actions obey only you.', 'Discipline', '{"type": "quest_completed", "value": 75}', 'Epic', '/assets/titles/commander.png'),
('The Unbent', 'Pressure does not bend you.', 'Discipline', '{"type": "stat", "stat": "discipline", "value": 60}', 'Legendary', '/assets/titles/unbent.png'),
('The Oathkeeper', 'Every promise to yourself is sacred.', 'Discipline', '{"type": "streak", "value": 50}', 'Legendary', '/assets/titles/oathkeeper.png'),
('The Wall Against Temptation', 'Temptation breaks against you.', 'Discipline', '{"type": "stat", "stat": "discipline", "value": 80}', 'Legendary', '/assets/titles/wall.png'),
('The Habit Forgemaster', 'You forge habits like weapons.', 'Discipline', '{"type": "quest_completed", "value": 200}', 'Mythic', '/assets/titles/forgemaster.png'),
('The Man Who Builds Himself', 'You are your own creation.', 'Discipline', '{"type": "level", "value": 100}', 'Mythic', '/assets/titles/builds-himself.png')
ON CONFLICT (name) DO NOTHING;

-- War Titles (61-70)
INSERT INTO titles (name, description, category, unlock_requirement, rarity, image_path) VALUES
('Blade of Relentlessness', 'You cut through all resistance.', 'War', '{"type": "quest_type", "quest_type": "Boss", "value": 5}', 'Rare', '/assets/titles/blade.png'),
('Warlord of Productivity', 'You command armies of completed tasks.', 'War', '{"type": "quest_completed", "value": 120}', 'Epic', '/assets/titles/warlord.png'),
('Commander of the Grindfront', 'You lead from the front lines of effort.', 'War', '{"type": "streak", "value": 40}', 'Epic', '/assets/titles/grindfront.png'),
('The Solo General', 'You fight alone, but with the strength of many.', 'War', '{"type": "level", "value": 55}', 'Epic', '/assets/titles/general.png'),
('Eternal Combatant', 'Your battle never ends.', 'War', '{"type": "quest_completed", "value": 180}', 'Legendary', '/assets/titles/combatant.png'),
('Vanguard of the Impossible', 'You charge toward what others flee.', 'War', '{"type": "quest_type", "quest_type": "Boss", "value": 10}', 'Legendary', '/assets/titles/vanguard.png'),
('The One-Man Army', 'You are a force unto yourself.', 'War', '{"type": "level", "value": 70}', 'Legendary', '/assets/titles/one-man-army.png'),
('Foe of Idleness', 'Idleness is your mortal enemy.', 'War', '{"type": "streak", "value": 70}', 'Legendary', '/assets/titles/foe-idleness.png'),
('The Daybreaker Warrior', 'You shatter every dawn with action.', 'War', '{"type": "quest_completed", "value": 300}', 'Mythic', '/assets/titles/daybreaker.png'),
('Slayer of Excuses', 'Excuses die in your presence.', 'War', '{"type": "level", "value": 95}', 'Mythic', '/assets/titles/slayer-excuses.png')
ON CONFLICT (name) DO NOTHING;

-- Mythic Titles (71-80)
INSERT INTO titles (name, description, category, unlock_requirement, rarity, image_path) VALUES
('The Human Calamity', 'Your existence disrupts the natural order.', 'Mythic', '{"type": "rank", "value": "S"}', 'Mythic', '/assets/titles/calamity.png'),
('Herald of the New Era', 'You announce a new age with your actions.', 'Mythic', '{"type": "level", "value": 105}', 'Mythic', '/assets/titles/herald.png'),
('Demi-God of Output', 'Your productivity is divine.', 'Mythic', '{"type": "total_xp", "value": 150000}', 'Mythic', '/assets/titles/demi-god.png'),
('The Divine Implement', 'You are the tool of higher purpose.', 'Mythic', '{"type": "level", "value": 115}', 'Mythic', '/assets/titles/implement.png'),
('Sentinel of Destiny', 'You guard your own fate.', 'Mythic', '{"type": "rank", "value": "S"}', 'Mythic', '/assets/titles/sentinel.png'),
('Emperor of the Coming Storm', 'You rule the future before it arrives.', 'Mythic', '{"type": "level", "value": 125}', 'Mythic', '/assets/titles/storm.png'),
('The Chosen of Progress', 'Progress itself has chosen you.', 'Mythic', '{"type": "quest_completed", "value": 400}', 'Mythic', '/assets/titles/chosen.png'),
('Destiny''s Architect', 'You design fate itself.', 'Mythic', '{"type": "level", "value": 135}', 'Mythic', '/assets/titles/destiny.png'),
('Godbound Innovator', 'Your innovation touches the divine.', 'Mythic', '{"type": "category_completed", "category": "Skill", "value": 200}', 'Mythic', '/assets/titles/innovator.png'),
('Keeper of the Eternal Flame', 'Your drive never dies.', 'Mythic', '{"type": "streak", "value": 90}', 'Mythic', '/assets/titles/eternal-flame.png')
ON CONFLICT (name) DO NOTHING;

-- Insanity Grind Titles (81-90)
INSERT INTO titles (name, description, category, unlock_requirement, rarity, image_path) VALUES
('The Beautiful Lunatic', 'Your madness is magnificent.', 'Insanity', '{"type": "streak", "value": 80}', 'Legendary', '/assets/titles/lunatic.png'),
('The Man Who Outworks Time', 'You accomplish more than time allows.', 'Insanity', '{"type": "quest_completed", "value": 350}', 'Legendary', '/assets/titles/outworks-time.png'),
('Sleepless Ascender', 'Sleep is a luxury you deny.', 'Insanity', '{"type": "total_xp", "value": 120000}', 'Legendary', '/assets/titles/sleepless.png'),
('The Obsession Incarnate', 'You are obsession given form.', 'Insanity', '{"type": "level", "value": 110}', 'Mythic', '/assets/titles/obsession.png'),
('The 2AM Ghost', 'You haunt the night hours with work.', 'Insanity', '{"type": "quest_completed", "value": 450}', 'Mythic', '/assets/titles/2am-ghost.png'),
('The Relentless Phantom', 'You appear everywhere, always working.', 'Insanity', '{"type": "streak", "value": 110}', 'Mythic', '/assets/titles/phantom.png'),
('Maniac of Mastery', 'Your pursuit of mastery is unhinged.', 'Insanity', '{"type": "category_completed", "category": "Skill", "value": 300}', 'Mythic', '/assets/titles/maniac.png'),
('Hunter of the Impossible', 'You hunt what cannot be caught.', 'Insanity', '{"type": "quest_type", "quest_type": "Raid", "value": 5}', 'Mythic', '/assets/titles/hunter-impossible.png'),
('The One Who Laughs While Working', 'You find joy in endless effort.', 'Insanity', '{"type": "level", "value": 140}', 'Mythic', '/assets/titles/laughs.png'),
('The Workaholic Devil', 'Work is your demonic pact.', 'Insanity', '{"type": "total_xp", "value": 200000}', 'Mythic', '/assets/titles/workaholic.png')
ON CONFLICT (name) DO NOTHING;

-- Legendary End-Game Titles (91-100)
INSERT INTO titles (name, description, category, unlock_requirement, rarity, image_path) VALUES
('Monarch of All Ranks', 'You have conquered every tier.', 'Legendary', '{"type": "rank", "value": "SS"}', 'Mythic', '/assets/titles/monarch-ranks.png'),
('SSS-Rank Reality Breaker', 'You shatter the fabric of possibility.', 'Legendary', '{"type": "rank", "value": "SSS"}', 'Mythic', '/assets/titles/reality-breaker.png'),
('The Absolute', 'You are complete.', 'Legendary', '{"type": "level", "value": 160}', 'Mythic', '/assets/titles/absolute.png'),
('King of Endless Light', 'Your light never fades.', 'Legendary', '{"type": "level", "value": 170}', 'Mythic', '/assets/titles/endless-light.png'),
('The Devourer of Limitations', 'Limitations cease to exist before you.', 'Legendary', '{"type": "quest_completed", "value": 600}', 'Mythic', '/assets/titles/devourer.png'),
('Emperor of the Abyss', 'You rule the deepest darkness.', 'Legendary', '{"type": "level", "value": 180}', 'Mythic', '/assets/titles/emperor-abyss.png'),
('Uncrowned God', 'Divinity without coronation.', 'Legendary', '{"type": "total_xp", "value": 300000}', 'Mythic', '/assets/titles/uncrowned.png'),
('The Final Ascendant', 'Your ascension is ultimate.', 'Legendary', '{"type": "level", "value": 190}', 'Mythic', '/assets/titles/final-ascendant.png'),
('The Man Beyond Mortality', 'You have transcended human limits.', 'Legendary', '{"type": "rank", "value": "SSS"}', 'Mythic', '/assets/titles/beyond-mortality.png'),
('The Shadow Throne Incarnate', 'You are the Shadow Monarch.', 'Legendary', '{"type": "level", "value": 200}', 'Mythic', '/assets/titles/shadow-throne.png')
ON CONFLICT (name) DO NOTHING;