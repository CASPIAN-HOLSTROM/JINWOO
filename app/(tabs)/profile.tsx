import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { SystemCard } from '@/components/SystemCard';
import { SystemButton } from '@/components/SystemButton';
import { COLORS, SPACING, FONTS } from '@/constants/theme';
import { User, Trophy, Zap, Calendar, Target, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [hunter, setHunter] = useState<any>(null);
  const [goals, setGoals] = useState<any>(null);
  const [stats, setStats] = useState({
    totalTitles: 0,
    completedQuests: 0,
    bossQuests: 0,
    raidQuests: 0,
  });

  const loadProfile = async () => {
    if (!user) return;

    const { data: hunterData } = await supabase
      .from('hunters')
      .select('*')
      .eq('id', user.id)
      .single();

    const { data: goalsData } = await supabase
      .from('hunter_goals')
      .select('*')
      .eq('hunter_id', user.id)
      .maybeSingle();

    const { data: titlesData } = await supabase
      .from('hunter_titles')
      .select('id')
      .eq('hunter_id', user.id);

    const { data: completedData } = await supabase
      .from('quests')
      .select('quest_type')
      .eq('hunter_id', user.id)
      .eq('status', 'Completed');

    setHunter(hunterData);
    setGoals(goalsData);
    setStats({
      totalTitles: titlesData?.length || 0,
      completedQuests: completedData?.length || 0,
      bossQuests: completedData?.filter(q => q.quest_type === 'Boss').length || 0,
      raidQuests: completedData?.filter(q => q.quest_type === 'Raid').length || 0,
    });
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth');
  };

  if (!hunter) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading Profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/THE REAWAKENED ONE copy.jpg')}
        style={styles.headerBg}
        resizeMode="cover"
        blurRadius={1}
      >
        <View style={styles.headerOverlay}>
          <Text style={styles.title}>HUNTER PROFILE</Text>
          <Text style={styles.headerQuote}>Know thyself, and victory is assured</Text>
        </View>
      </ImageBackground>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <SystemCard glowing style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User color={COLORS.system.glow} size={48} />
            </View>
          </View>

          <Text style={styles.username}>{hunter.username}</Text>
          <Text style={styles.class}>{hunter.hunter_class || 'Unclassed'}</Text>

          <View style={styles.levelRankRow}>
            <View style={styles.levelBadge}>
              <Text style={styles.badgeLabel}>LEVEL</Text>
              <Text style={styles.badgeValue}>{hunter.level}</Text>
            </View>
            <View style={[styles.rankBadge, { borderColor: COLORS.rank[hunter.rank as keyof typeof COLORS.rank] }]}>
              <Text style={[styles.badgeLabel, { color: COLORS.rank[hunter.rank as keyof typeof COLORS.rank] }]}>
                {hunter.rank}-RANK
              </Text>
            </View>
          </View>
        </SystemCard>

        <SystemCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Trophy color={COLORS.system.accent} size={24} />
            <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
          </View>

          <View style={styles.achievementGrid}>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementValue}>{stats.totalTitles}</Text>
              <Text style={styles.achievementLabel}>Titles Unlocked</Text>
            </View>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementValue}>{stats.completedQuests}</Text>
              <Text style={styles.achievementLabel}>Quests Completed</Text>
            </View>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementValue}>{hunter.longest_streak}</Text>
              <Text style={styles.achievementLabel}>Longest Streak</Text>
            </View>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementValue}>{stats.bossQuests}</Text>
              <Text style={styles.achievementLabel}>Bosses Defeated</Text>
            </View>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementValue}>{stats.raidQuests}</Text>
              <Text style={styles.achievementLabel}>Raids Completed</Text>
            </View>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementValue}>{hunter.total_xp.toLocaleString()}</Text>
              <Text style={styles.achievementLabel}>Total XP</Text>
            </View>
          </View>
        </SystemCard>

        {goals && (
          <SystemCard style={styles.section}>
            <View style={styles.sectionHeader}>
              <Target color={COLORS.system.accent} size={24} />
              <Text style={styles.sectionTitle}>MISSION</Text>
            </View>

            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>Primary Goal</Text>
              <Text style={styles.goalValue}>{goals.primary_goal}</Text>
            </View>

            {goals.long_term_mission && (
              <View style={styles.goalItem}>
                <Text style={styles.goalLabel}>Long-term Mission</Text>
                <Text style={styles.goalValue}>{goals.long_term_mission}</Text>
              </View>
            )}

            {goals.skillset && goals.skillset.length > 0 && (
              <View style={styles.goalItem}>
                <Text style={styles.goalLabel}>Skills in Development</Text>
                <View style={styles.skillTags}>
                  {goals.skillset.map((skill: string) => (
                    <View key={skill} style={styles.skillTag}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </SystemCard>
        )}

        <SystemCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar color={COLORS.system.accent} size={24} />
            <Text style={styles.sectionTitle}>ACTIVITY</Text>
          </View>

          <View style={styles.activityRow}>
            <Text style={styles.activityLabel}>Joined</Text>
            <Text style={styles.activityValue}>
              {new Date(hunter.created_at).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.activityRow}>
            <Text style={styles.activityLabel}>Last Active</Text>
            <Text style={styles.activityValue}>
              {new Date(hunter.last_active).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.activityRow}>
            <Zap color={COLORS.warning} size={16} />
            <Text style={styles.activityLabel}>Current Streak</Text>
            <Text style={[styles.activityValue, { color: COLORS.warning }]}>
              {hunter.current_streak} days
            </Text>
          </View>
        </SystemCard>

        <SystemButton
          title="Sign Out"
          onPress={handleSignOut}
          variant="danger"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.system.glow,
    fontSize: FONTS.size.lg,
  },
  headerBg: {
    width: '100%',
    paddingTop: SPACING['2xl'],
  },
  headerOverlay: {
    backgroundColor: 'rgba(10, 14, 26, 0.88)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.system.blue,
    alignItems: 'center',
  },
  headerQuote: {
    fontSize: FONTS.size.xs,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
    fontStyle: 'italic',
  },
  title: {
    fontSize: FONTS.size['3xl'],
    fontWeight: FONTS.weight.bold,
    color: COLORS.system.glow,
    letterSpacing: 2,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarContainer: {
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.background.elevated,
    borderWidth: 3,
    borderColor: COLORS.system.glow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: FONTS.size['2xl'],
    fontWeight: FONTS.weight.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  class: {
    fontSize: FONTS.size.base,
    color: COLORS.system.accent,
    marginBottom: SPACING.lg,
  },
  levelRankRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  levelBadge: {
    backgroundColor: COLORS.background.elevated,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.system.blue,
    alignItems: 'center',
  },
  rankBadge: {
    backgroundColor: COLORS.background.elevated,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  badgeLabel: {
    fontSize: FONTS.size.xs,
    color: COLORS.text.secondary,
    fontWeight: FONTS.weight.semibold,
    marginBottom: SPACING.xs,
  },
  badgeValue: {
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.weight.bold,
    color: COLORS.system.glow,
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
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  achievementItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.background.elevated,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  achievementValue: {
    fontSize: FONTS.size['2xl'],
    fontWeight: FONTS.weight.bold,
    color: COLORS.system.accent,
    marginBottom: SPACING.xs,
  },
  achievementLabel: {
    fontSize: FONTS.size.xs,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  goalItem: {
    marginBottom: SPACING.md,
  },
  goalLabel: {
    fontSize: FONTS.size.sm,
    color: COLORS.text.secondary,
    fontWeight: FONTS.weight.semibold,
    marginBottom: SPACING.xs,
  },
  goalValue: {
    fontSize: FONTS.size.base,
    color: COLORS.text.primary,
  },
  skillTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  skillTag: {
    backgroundColor: COLORS.background.elevated,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.system.blue,
  },
  skillText: {
    fontSize: FONTS.size.sm,
    color: COLORS.system.accent,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background.elevated,
  },
  activityLabel: {
    fontSize: FONTS.size.base,
    color: COLORS.text.secondary,
  },
  activityValue: {
    fontSize: FONTS.size.base,
    color: COLORS.text.primary,
    fontWeight: FONTS.weight.semibold,
  },
});
