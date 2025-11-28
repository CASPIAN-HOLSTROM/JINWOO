import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { SystemCard } from '@/components/SystemCard';
import { SystemButton } from '@/components/SystemButton';
import { COLORS, SPACING, FONTS } from '@/constants/theme';
import { completeQuest } from '@/lib/game-logic';
import { CheckCircle2, Flame, Crown, Swords, Plus } from 'lucide-react-native';

export default function QuestsScreen() {
  const { user } = useAuth();
  const [quests, setQuests] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<'Daily' | 'Boss' | 'Raid' | 'Optional'>('Daily');
  const [loading, setLoading] = useState<string | null>(null);

  const loadQuests = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('quests')
      .select('*')
      .eq('hunter_id', user.id)
      .eq('quest_type', selectedType)
      .order('created_at', { ascending: false });

    setQuests(data || []);
  };

  useEffect(() => {
    loadQuests();
  }, [user, selectedType]);

  const handleCompleteQuest = async (questId: string) => {
    if (!user) return;

    setLoading(questId);
    const result = await completeQuest(questId, user.id);

    if (result.error) {
      Alert.alert('Error', result.error);
    } else if (result.success) {
      let message = `QUEST CLEARED!\n+${result.xpGained} XP`;

      if (result.leveledUp) {
        message += `\n\nLEVEL UP! ${result.newLevel}`;
      }

      if (result.rankedUp) {
        message += `\n\nRANK UP! ${result.newRank}-RANK`;
      }

      Alert.alert('Success', message);
      await loadQuests();
    }

    setLoading(null);
  };

  const activeQuests = quests.filter(q => q.status === 'Active');
  const completedQuests = quests.filter(q => q.status === 'Completed');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Daily': return <Flame color={COLORS.system.accent} size={20} />;
      case 'Boss': return <Crown color={COLORS.error} size={20} />;
      case 'Raid': return <Swords color={COLORS.warning} size={20} />;
      default: return <Plus color={COLORS.text.dim} size={20} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>QUEST LOG</Text>
      </View>

      <View style={styles.tabBar}>
        {(['Daily', 'Boss', 'Raid', 'Optional'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.tab,
              selectedType === type && styles.tabActive,
            ]}
            onPress={() => setSelectedType(type)}
          >
            {getTypeIcon(type)}
            <Text
              style={[
                styles.tabText,
                selectedType === type && styles.tabTextActive,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {activeQuests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACTIVE</Text>
            {activeQuests.map((quest) => (
              <SystemCard key={quest.id} style={styles.questCard}>
                <View style={styles.questHeader}>
                  <View style={styles.questTypeRow}>
                    {getTypeIcon(quest.quest_type)}
                    <Text style={[styles.questType, { color: quest.quest_type === 'Boss' ? COLORS.error : COLORS.system.accent }]}>
                      {quest.quest_type.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.questXP}>+{quest.xp_reward} XP</Text>
                </View>

                <Text style={styles.questTitle}>{quest.title}</Text>

                {quest.description && (
                  <Text style={styles.questDescription}>{quest.description}</Text>
                )}

                <View style={styles.questMeta}>
                  <Text style={styles.questCategory}>{quest.category}</Text>
                  <Text style={styles.questDifficulty}>Lv.{quest.difficulty}</Text>
                </View>

                {quest.due_date && (
                  <Text style={styles.questDueDate}>
                    Due: {new Date(quest.due_date).toLocaleDateString()}
                  </Text>
                )}

                <SystemButton
                  title="COMPLETE QUEST"
                  onPress={() => handleCompleteQuest(quest.id)}
                  loading={loading === quest.id}
                />
              </SystemCard>
            ))}
          </View>
        )}

        {completedQuests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>COMPLETED</Text>
            {completedQuests.slice(0, 5).map((quest) => (
              <SystemCard key={quest.id} style={styles.completedCard}>
                <View style={styles.completedHeader}>
                  <View style={styles.completedIconRow}>
                    <CheckCircle2 color={COLORS.success} size={20} />
                    <Text style={styles.completedTitle}>{quest.title}</Text>
                  </View>
                  <Text style={styles.completedXP}>+{quest.xp_reward} XP</Text>
                </View>
                <Text style={styles.completedDate}>
                  {new Date(quest.completed_at).toLocaleDateString()}
                </Text>
              </SystemCard>
            ))}
          </View>
        )}

        {activeQuests.length === 0 && completedQuests.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No {selectedType} quests available</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  header: {
    paddingTop: SPACING['2xl'],
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.system.blue,
  },
  title: {
    fontSize: FONTS.size['3xl'],
    fontWeight: FONTS.weight.bold,
    color: COLORS.system.glow,
    letterSpacing: 2,
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.background.secondary,
    gap: SPACING.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    backgroundColor: COLORS.background.elevated,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabActive: {
    borderColor: COLORS.system.glow,
    backgroundColor: COLORS.background.card,
  },
  tabText: {
    fontSize: FONTS.size.sm,
    color: COLORS.text.dim,
    fontWeight: FONTS.weight.semibold,
  },
  tabTextActive: {
    color: COLORS.system.glow,
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
  questCard: {
    marginBottom: SPACING.md,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  questTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  questType: {
    fontSize: FONTS.size.xs,
    fontWeight: FONTS.weight.bold,
    letterSpacing: 1,
  },
  questXP: {
    fontSize: FONTS.size.base,
    color: COLORS.success,
    fontWeight: FONTS.weight.bold,
  },
  questTitle: {
    fontSize: FONTS.size.lg,
    color: COLORS.text.primary,
    fontWeight: FONTS.weight.semibold,
    marginBottom: SPACING.sm,
  },
  questDescription: {
    fontSize: FONTS.size.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  questMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  questCategory: {
    fontSize: FONTS.size.sm,
    color: COLORS.text.accent,
    fontWeight: FONTS.weight.medium,
  },
  questDifficulty: {
    fontSize: FONTS.size.sm,
    color: COLORS.warning,
    fontWeight: FONTS.weight.semibold,
  },
  questDueDate: {
    fontSize: FONTS.size.xs,
    color: COLORS.text.dim,
    marginBottom: SPACING.md,
  },
  completedCard: {
    marginBottom: SPACING.sm,
    opacity: 0.7,
  },
  completedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completedIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  completedTitle: {
    fontSize: FONTS.size.base,
    color: COLORS.text.secondary,
    flex: 1,
  },
  completedXP: {
    fontSize: FONTS.size.sm,
    color: COLORS.success,
    fontWeight: FONTS.weight.semibold,
  },
  completedDate: {
    fontSize: FONTS.size.xs,
    color: COLORS.text.dim,
    marginTop: SPACING.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING['2xl'],
  },
  emptyText: {
    fontSize: FONTS.size.base,
    color: COLORS.text.dim,
  },
});
