# Solo Leveling System - Artwork Guide

This guide describes the required artwork for the complete Solo Leveling experience.

## Directory Structure

```
assets/
├── ascensions/      # Level-up milestone artwork
├── ranks/           # Rank promotion artwork (E to SSS)
├── titles/          # Title unlock artwork (100 titles)
├── quests/          # Quest type icons
└── bosses/          # Boss quest artwork
```

## Ascension Artwork

Dark, gothic artwork for major level milestones.

Required files:
- `level-1.png` - The awakening (blue energy, opening eyes)
- `level-5.png` - First power surge
- `level-10.png` - Shadow manifestation
- `level-20.png` - Dark aura formation
- `level-30.png` - Power crystallization
- `level-40.png` - Shadow army glimpse
- `level-50.png` - Half transformation
- `level-75.png` - Full power release
- `level-100.png` - S-Rank ascension (massive energy burst)
- `level-150.png` - SS-Rank transcendence
- `level-200.png` - SSS-Rank Shadow Monarch form

### Art Style
- Dark blue/black energy effects
- Glowing eyes (blue/purple)
- Shadow beasts in background
- Cracked aura effects
- Floating runes
- Silhouette transformations

## Rank Artwork

Full-screen artwork for rank promotions.

Required files:
- `e-rank.png` - Weak hunter, faint aura
- `d-rank.png` - Forming discipline, green energy
- `c-rank.png` - Blue energy, confident stance
- `b-rank.png` - Purple aura, power evident
- `a-rank.png` - Golden glow, elite status
- `s-rank.png` - Red/crimson energy, legendary
- `ss-rank.png` - Void lightning, pink energy
- `sss-rank.png` - Divine darkness, golden-black aura, Shadow Monarch

### Art Style
- Full hunter silhouette
- Rank-specific color scheme
- Energy aura matching rank power
- Background matching intensity

## Title Artwork

Minimalist icons for all 100 titles (400x400px recommended).

### Examples:
- `reawakened.png` - Opening eye with light
- `conqueror.png` - Broken chains glowing
- `shadow-discipline.png` - Shadow sword silhouette
- `daily-reaper.png` - Scythe in darkness
- `monarch-discipline.png` - Crown in shadow
- `workaholic.png` - Demonic notebook silhouette

### Art Style
- Simple, iconic designs
- Monochrome or single accent color
- Recognizable at small sizes
- Gothic aesthetic
- Glowing elements

## Quest Icons

Category-specific icons for quests.

Required files:
- `business-quest.png` - Shadow envelope/briefcase
- `skill-quest.png` - Glowing grimoire
- `physical-quest.png` - Gothic dumbbell/sword
- `mind-quest.png` - Third eye symbol
- `boss-quest.png` - Monster skull silhouette
- `raid-quest.png` - Dungeon gate

## Boss Artwork

Full-screen gothic monster artwork for boss quests.

Suggested themes:
- Shadow beasts
- Dungeon monsters
- Epic confrontations
- Dark fantasy creatures

## Color Palette

Primary colors for consistency:
- Background: #0a0e1a (deep black-blue)
- System Blue: #3b82f6
- Glow Cyan: #38bdf8
- Shadow: Black with blue tints
- Accents: Purple, gold for special moments

## Art Sources

For production use, commission custom artwork or use:
1. AI generation tools (Midjourney, DALL-E, Stable Diffusion)
2. Stock sites with dark fantasy themes
3. Custom illustrations matching Solo Leveling aesthetic

## Prompts for AI Art Generation

### Level Ascension Example:
"Dark fantasy anime style, male silhouette in center, massive blue energy explosion, glowing eyes, shadow creatures emerging, cracked reality effects, floating runes, dramatic lighting, cinematic, Solo Leveling inspired, 16:9"

### Rank Promotion Example:
"Solo Leveling style S-Rank hunter, full body silhouette, red and gold energy aura, standing in power stance, dramatic shadows, blue glowing eyes, epic scale, dark fantasy anime aesthetic, vertical composition"

### Title Icon Example:
"Minimalist icon design, broken glowing chains, dark background, blue accent color, gothic style, simple but powerful, 400x400px, Solo Leveling aesthetic"

## Implementation Notes

All image paths in the database are set up as:
- `/assets/ascensions/level-{number}.png`
- `/assets/ranks/{rank}-rank.png`
- `/assets/titles/{title-name}.png`

These can be:
1. Loaded from local assets
2. Served from a CDN
3. Generated dynamically
4. Using placeholder images from Pexels with dark/fantasy themes

## Placeholder Strategy

Until custom artwork is created, use:
- Solid color gradients matching rank/level
- System notification panels with text
- Abstract geometric patterns
- Dark blue/black backgrounds with glowing text
