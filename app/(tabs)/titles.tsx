import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { SystemCard } from '@/components/SystemCard';
import { COLORS, SPACING, FONTS } from '@/constants/theme';
import { Lock, Crown } from 'lucide-react-native';

const RARITY_COLORS = {
  Common: COLORS.text.dim,
  Rare: COLORS.system.blue,
  Epic: COLORS.system.purple,
  Legendary: COLORS.warning,
  Mythic: COLORS.rank.SSS,
};

export default function TitlesScreen() {
  const { user } = useAuth();
  const [unlockedTitles, setUnlockedTitles] = useState<any[]>([]);
  const [lockedTitles, setLockedTitles] = useState<any[]>([]);
  const [activeTitle, setActiveTitle] = useState<string | null>(null);

  const loadTitles = async () => {
    if (!user) return;

    const { data: hunterTitles } = await supabase
      .from('hunter_titles')
      .select('*, titles(*)')
      .eq('hunter_id', user.id);

    const { data: allTitles } = await supabase
      .from('titles')
      .select('*')
      .order('category');

    const unlockedIds = new Set(hunterTitles?.map(ht => ht.title_id) || []);
    const active = hunterTitles?.find(ht => ht.is_active);

    const unlocked = hunterTitles?.map(ht => ({
      ...ht.titles,
      unlocked_at: ht.unlocked_at,
      is_active: ht.is_active,
      hunter_title_id: ht.id,
    })) || [];

    const locked = allTitles?.filter(t => !unlockedIds.has(t.id)) || [];

    setUnlockedTitles(unlocked);
    setLockedTitles(locked);
    setActiveTitle(active?.title_id || null);
  };

  useEffect(() => {
    loadTitles();
  }, [user]);

  const handleSetActive = async (titleId: string) => {
    if (!user) return;

    await supabase
      .from('hunter_titles')
      .update({ is_active: false })
      .eq('hunter_id', user.id);

    await supabase
      .from('hunter_titles')
      .update({ is_active: true })
      .eq('hunter_id', user.id)
      .eq('title_id', titleId);

    setActiveTitle(titleId);
    await loadTitles();
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/THE REAWAKENED ONE copy.jpg')}
        style={styles.headerBg}
        resizeMode="cover"
        blurRadius={3}
      >
        <View style={styles.headerOverlay}>
          <Text style={styles.title}>TITLES</Text>
          <Text style={styles.subtitle}>
            {unlockedTitles.length} / {unlockedTitles.length + lockedTitles.length} Unlocked
          </Text>
          <Text style={styles.headerQuote}>Collect the achievements of legends</Text>
        </View>
      </ImageBackground>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {unlockedTitles.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>UNLOCKED</Text>
            {unlockedTitles.map((title) => (
              <TouchableOpacity
                key={title.id}
                onPress={() => handleSetActive(title.id)}
              >
                <SystemCard
                  style={[
                    styles.titleCard,
                    title.is_active && styles.activeTitleCard,
                  ]}
                  glowing={title.is_active}
                >
                  <View style={styles.titleHeader}>
                    <View style={styles.titleNameRow}>
                      {title.is_active && <Crown color={COLORS.rank.SSS} size={20} />}
                      <Text style={[styles.titleName, { color: RARITY_COLORS[title.rarity as keyof typeof RARITY_COLORS] }]}>
                        {title.name}
                      </Text>
                    </View>
                    <Text style={[styles.rarity, { color: RARITY_COLORS[title.rarity as keyof typeof RARITY_COLORS] }]}>
                      {title.rarity}
                    </Text>
                  </View>

                  <Text style={styles.titleDescription}>{title.description}</Text>

                  <View style={styles.titleFooter}>
                    <Text style={styles.category}>{title.category}</Text>
                    <Text style={styles.unlockedDate}>
                      Unlocked {new Date(title.unlocked_at).toLocaleDateString()}
                    </Text>
                  </View>

                  {title.is_active && (
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>EQUIPPED</Text>
                    </View>
                  )}
                </SystemCard>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {lockedTitles.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LOCKED</Text>
            {lockedTitles.map((title) => (
              <SystemCard key={title.id} style={styles.lockedCard}>
                <View style={styles.titleHeader}>
                  <View style={styles.titleNameRow}>
                    <Lock color={COLORS.text.dim} size={16} />
                    <Text style={styles.lockedName}>{title.name}</Text>
                  </View>
                  <Text style={[styles.rarity, { color: RARITY_COLORS[title.rarity as keyof typeof RARITY_COLORS] }]}>
                    {title.rarity}
                  </Text>
                </View>

                <Text style={styles.lockedDescription}>{title.description}</Text>

                <View style={styles.titleFooter}>
                  <Text style={styles.lockedCategory}>{title.category}</Text>
                  <Text style={styles.requirement}>
                    {formatRequirement(title.unlock_requirement)}
                  </Text>
                </View>
              </SystemCard>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function formatRequirement(req: any): string {
  if (req.type === 'level') return `Reach Level ${req.value}`;
  if (req.type === 'rank') return `Reach ${req.value}-Rank`;
  if (req.type === 'streak') return `${req.value}-day streak`;
  if (req.type === 'total_xp') return `${req.value.toLocaleString()} Total XP`;
  if (req.type === 'stat') return `${req.stat} ${req.value}`;
  if (req.type === 'quest_completed') return `Complete ${req.value} quests`;
  if (req.type === 'quest_type') return `Complete ${req.value} ${req.quest_type} quests`;
  if (req.type === 'category_completed') return `Complete ${req.value} ${req.category} quests`;
  return 'Hidden requirement';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  headerBg: {
    width: '100%',
    paddingTop: SPACING['2xl'],
  },
  headerOverlay: {
    backgroundColor: 'rgba(10, 14, 26, 0.9)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.rank.SSS,
    alignItems: 'center',
  },
  headerQuote: {
    fontSize: FONTS.size.xs,
    color: COLORS.text.dim,
    marginTop: SPACING.xs,
    fontStyle: 'italic',
  },
  title: {
    fontSize: FONTS.size['3xl'],
    fontWeight: FONTS.weight.bold,
    color: COLORS.system.glow,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: FONTS.size.base,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    letterSpacing: 1,
  },
  titleCard: {
    marginBottom: SPACING.md,
    position: 'relative',
  },
  activeTitleCard: {
    borderColor: COLORS.rank.SSS,
    borderWidth: 2,
  },
  titleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  titleNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  titleName: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
    flex: 1,
  },
  rarity: {
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.semibold,
    letterSpacing: 1,
  },
  titleDescription: {
    fontSize: FONTS.size.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
  },
  titleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: {
    fontSize: FONTS.size.xs,
    color: COLORS.text.accent,
    fontWeight: FONTS.weight.semibold,
  },
  unlockedDate: {
    fontSize: FONTS.size.xs,
    color: COLORS.text.dim,
  },
  activeBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.rank.SSS,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 4,
  },
  activeBadgeText: {
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.bold,
    color: COLORS.background.primary,
  },
  lockedCard: {
    marginBottom: SPACING.md,
    opacity: 0.6,
  },
  lockedName: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
    color: COLORS.text.dim,
    flex: 1,
  },
  lockedDescription: {
    fontSize: FONTS.size.sm,
    color: COLORS.text.dim,
    marginBottom: SPACING.md,
  },
  lockedCategory: {
    fontSize: FONTS.size.xs,
    color: COLORS.text.dim,
    fontWeight: FONTS.weight.semibold,
  },
  requirement: {
    fontSize: FONTS.size.xs,
    color: COLORS.system.accent,
    fontStyle: 'italic',
  },
});
