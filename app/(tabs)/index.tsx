import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { SystemCard } from '@/components/SystemCard';
import { ProgressBar } from '@/components/ProgressBar';
import { COLORS, SPACING, FONTS } from '@/constants/theme';
import { XP_FORMULA } from '@/lib/game-logic';
import { Zap, TrendingUp, Target, Award } from 'lucide-react-native';

export default function DashboardScreen() {
  const { user } = useAuth();
  const [hunter, setHunter] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [activeQuests, setActiveQuests] = useState<any[]>([]);
  const [activeTitle, setActiveTitle] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (!user) return;

    const { data: hunterData } = await supabase
      .from('hunters')
      .select('*')
      .eq('id', user.id)
      .single();

    const { data: statsData } = await supabase
      .from('hunter_stats')
      .select('*')
      .eq('hunter_id', user.id)
      .single();

    const { data: questsData } = await supabase
      .from('quests')
      .select('*')
      .eq('hunter_id', user.id)
      .eq('status', 'Active')
      .order('quest_type', { ascending: false })
      .limit(3);

    const { data: titleData } = await supabase
      .from('hunter_titles')
      .select('titles(name)')
      .eq('hunter_id', user.id)
      .eq('is_active', true)
      .maybeSingle();

    setHunter(hunterData);
    setStats(statsData);
    setActiveQuests(questsData || []);
    setActiveTitle(titleData?.titles?.name || 'The Reawakened One');
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (!hunter) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Initializing System...</Text>
        </View>
      </View>
    );
  }

  const xpForNextLevel = XP_FORMULA(hunter.level + 1);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.system.glow} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.systemTitle}>THE SYSTEM</Text>
        <Text style={styles.username}>{hunter.username}</Text>
        <Text style={styles.title}>{activeTitle}</Text>
      </View>

      <SystemCard glowing style={styles.mainCard}>
        <View style={styles.levelRow}>
          <View style={styles.levelInfo}>
            <Text style={styles.levelLabel}>LEVEL</Text>
            <Text style={styles.levelValue}>{hunter.level}</Text>
          </View>
          <View style={styles.rankBadge}>
            <Text style={[styles.rankText, { color: COLORS.rank[hunter.rank as keyof typeof COLORS.rank] }]}>
              {hunter.rank}-RANK
            </Text>
          </View>
        </View>

        <ProgressBar
          current={hunter.current_xp}
          max={xpForNextLevel}
          label="EXPERIENCE"
          color={COLORS.system.cyan}
        />

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Zap color={COLORS.system.accent} size={20} />
            <Text style={styles.statValue}>{hunter.current_streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statItem}>
            <TrendingUp color={COLORS.success} size={20} />
            <Text style={styles.statValue}>{hunter.total_xp.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statItem}>
            <Target color={COLORS.warning} size={20} />
            <Text style={styles.statValue}>{activeQuests.length}</Text>
            <Text style={styles.statLabel}>Active Quests</Text>
          </View>
        </View>
      </SystemCard>

      <SystemCard style={styles.section}>
        <View style={styles.sectionHeader}>
          <Award color={COLORS.system.accent} size={24} />
          <Text style={styles.sectionTitle}>HUNTER STATS</Text>
        </View>

        {stats && (
          <View style={styles.attributesGrid}>
            <View style={styles.attribute}>
              <Text style={styles.attributeName}>Strength</Text>
              <Text style={styles.attributeValue}>{stats.strength}</Text>
            </View>
            <View style={styles.attribute}>
              <Text style={styles.attributeName}>Intelligence</Text>
              <Text style={styles.attributeValue}>{stats.intelligence}</Text>
            </View>
            <View style={styles.attribute}>
              <Text style={styles.attributeName}>Willpower</Text>
              <Text style={styles.attributeValue}>{stats.willpower}</Text>
            </View>
            <View style={styles.attribute}>
              <Text style={styles.attributeName}>Discipline</Text>
              <Text style={styles.attributeValue}>{stats.discipline}</Text>
            </View>
            <View style={styles.attribute}>
              <Text style={styles.attributeName}>Endurance</Text>
              <Text style={styles.attributeValue}>{stats.endurance}</Text>
            </View>
          </View>
        )}
      </SystemCard>

      {activeQuests.length > 0 && (
        <SystemCard style={styles.section}>
          <Text style={styles.sectionTitle}>ACTIVE QUESTS</Text>
          {activeQuests.map((quest) => (
            <View key={quest.id} style={styles.questPreview}>
              <View style={styles.questHeader}>
                <Text style={[styles.questType, { color: quest.quest_type === 'Boss' ? COLORS.error : COLORS.system.accent }]}>
                  {quest.quest_type.toUpperCase()}
                </Text>
                <Text style={styles.questXP}>+{quest.xp_reward} XP</Text>
              </View>
              <Text style={styles.questTitle}>{quest.title}</Text>
              <Text style={styles.questCategory}>{quest.category}</Text>
            </View>
          ))}
        </SystemCard>
      )}

      {hunter.penalty_mode && (
        <SystemCard style={[styles.section, styles.warningCard]}>
          <Text style={styles.warningTitle}>PENALTY MODE ACTIVE</Text>
          <Text style={styles.warningText}>
            You missed a day. Complete extra quests to restore your standing.
          </Text>
        </SystemCard>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  content: {
    padding: SPACING.lg,
    paddingTop: SPACING['2xl'],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.system.glow,
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.semibold,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  systemTitle: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
    color: COLORS.system.glow,
    letterSpacing: 2,
    marginBottom: SPACING.xs,
  },
  username: {
    fontSize: FONTS.size['2xl'],
    fontWeight: FONTS.weight.bold,
    color: COLORS.text.primary,
  },
  title: {
    fontSize: FONTS.size.base,
    color: COLORS.text.accent,
    fontStyle: 'italic',
    marginTop: SPACING.xs,
  },
  mainCard: {
    marginBottom: SPACING.lg,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  levelInfo: {
    gap: SPACING.xs,
  },
  levelLabel: {
    fontSize: FONTS.size.sm,
    color: COLORS.text.secondary,
    fontWeight: FONTS.weight.semibold,
  },
  levelValue: {
    fontSize: FONTS.size['4xl'],
    fontWeight: FONTS.weight.bold,
    color: COLORS.system.glow,
  },
  rankBadge: {
    backgroundColor: COLORS.background.elevated,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    borderWidth: 2,
  },
  rankText: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  statItem: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statValue: {
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.weight.bold,
    color: COLORS.text.primary,
  },
  statLabel: {
    fontSize: FONTS.size.xs,
    color: COLORS.text.secondary,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
    color: COLORS.text.primary,
  },
  attributesGrid: {
    gap: SPACING.sm,
  },
  attribute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background.elevated,
  },
  attributeName: {
    fontSize: FONTS.size.base,
    color: COLORS.text.secondary,
  },
  attributeValue: {
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.weight.bold,
    color: COLORS.system.accent,
  },
  questPreview: {
    backgroundColor: COLORS.background.elevated,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.system.blue,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  questType: {
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.bold,
    letterSpacing: 1,
  },
  questXP: {
    fontSize: FONTS.size.sm,
    color: COLORS.success,
    fontWeight: FONTS.weight.semibold,
  },
  questTitle: {
    fontSize: FONTS.size.base,
    color: COLORS.text.primary,
    fontWeight: FONTS.weight.semibold,
    marginBottom: SPACING.xs,
  },
  questCategory: {
    fontSize: FONTS.size.sm,
    color: COLORS.text.dim,
  },
  warningCard: {
    borderColor: COLORS.error,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  warningTitle: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
  warningText: {
    fontSize: FONTS.size.base,
    color: COLORS.text.secondary,
  },
});
