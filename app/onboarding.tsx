import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { SystemButton } from '@/components/SystemButton';
import { SystemCard } from '@/components/SystemCard';
import { COLORS, SPACING, FONTS } from '@/constants/theme';
import { generateDailyQuests } from '@/lib/quest-generator';

const CLASSES = [
  { name: 'Warrior', description: 'Bonus to Strength. Masters of physical prowess.', stat: 'Strength' },
  { name: 'Assassin', description: 'Bonus to Discipline. Masters of focus and precision.', stat: 'Discipline' },
  { name: 'Mage', description: 'Bonus to Intelligence. Masters of knowledge and skill.', stat: 'Intelligence' },
  { name: 'Shadow Monarch', description: 'Bonus to Willpower. Masters of relentless will.', stat: 'Willpower' },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [skillset, setSkillset] = useState('');
  const [dailyHours, setDailyHours] = useState('8');
  const [weaknesses, setWeaknesses] = useState('');
  const [longTermMission, setLongTermMission] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleComplete = async () => {
    if (!user) return;

    setLoading(true);

    try {
      await supabase.from('hunters').update({
        hunter_class: selectedClass as any,
      }).eq('id', user.id);

      await supabase.from('hunter_goals').insert({
        hunter_id: user.id,
        primary_goal: primaryGoal,
        skillset: skillset.split(',').map(s => s.trim()).filter(Boolean),
        daily_availability: parseInt(dailyHours) || 8,
        weaknesses: weaknesses.split(',').map(s => s.trim()).filter(Boolean),
        long_term_mission: longTermMission,
      });

      const goals = {
        skillset: skillset.split(',').map(s => s.trim()).filter(Boolean),
      };

      const dailyQuests = generateDailyQuests(1, goals);

      for (const quest of dailyQuests) {
        await supabase.from('quests').insert({
          hunter_id: user.id,
          ...quest,
        });
      }

      router.replace('/(tabs)');
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>SYSTEM INITIALIZATION</Text>
        <Text style={styles.subtitle}>Step {step} of 3</Text>
      </View>

      {step === 1 && (
        <SystemCard glowing style={styles.card}>
          <Text style={styles.stepTitle}>SELECT YOUR CLASS</Text>
          <Text style={styles.stepDescription}>
            Choose the path that resonates with your inner strength.
          </Text>

          {CLASSES.map((cls) => (
            <TouchableOpacity
              key={cls.name}
              style={[
                styles.classOption,
                selectedClass === cls.name && styles.classOptionSelected,
              ]}
              onPress={() => setSelectedClass(cls.name)}
            >
              <Text style={styles.className}>{cls.name}</Text>
              <Text style={styles.classDescription}>{cls.description}</Text>
              <Text style={styles.classStat}>+{cls.stat}</Text>
            </TouchableOpacity>
          ))}

          <SystemButton
            title="CONTINUE"
            onPress={() => setStep(2)}
            disabled={!selectedClass}
          />
        </SystemCard>
      )}

      {step === 2 && (
        <SystemCard glowing style={styles.card}>
          <Text style={styles.stepTitle}>DEFINE YOUR MISSION</Text>
          <Text style={styles.stepDescription}>
            The System needs to understand your objectives.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>PRIMARY GOAL</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Build a successful coaching business"
              placeholderTextColor={COLORS.text.dim}
              value={primaryGoal}
              onChangeText={setPrimaryGoal}
              multiline
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>SKILLS TO BUILD (comma-separated)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., AI engineering, sales, automation"
              placeholderTextColor={COLORS.text.dim}
              value={skillset}
              onChangeText={setSkillset}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>DAILY AVAILABILITY (hours)</Text>
            <TextInput
              style={styles.input}
              placeholder="8"
              placeholderTextColor={COLORS.text.dim}
              value={dailyHours}
              onChangeText={setDailyHours}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.buttonRow}>
            <SystemButton
              title="BACK"
              onPress={() => setStep(1)}
              variant="secondary"
            />
            <SystemButton
              title="CONTINUE"
              onPress={() => setStep(3)}
              disabled={!primaryGoal.trim()}
            />
          </View>
        </SystemCard>
      )}

      {step === 3 && (
        <SystemCard glowing style={styles.card}>
          <Text style={styles.stepTitle}>FINAL CALIBRATION</Text>
          <Text style={styles.stepDescription}>
            Help the System personalize your journey.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>WEAKNESSES TO OVERCOME</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., procrastination, inconsistency"
              placeholderTextColor={COLORS.text.dim}
              value={weaknesses}
              onChangeText={setWeaknesses}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>LONG-TERM MISSION</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Close 2000 leads this month"
              placeholderTextColor={COLORS.text.dim}
              value={longTermMission}
              onChangeText={setLongTermMission}
              multiline
            />
          </View>

          <View style={styles.buttonRow}>
            <SystemButton
              title="BACK"
              onPress={() => setStep(2)}
              variant="secondary"
            />
            <SystemButton
              title="BEGIN ASCENSION"
              onPress={handleComplete}
              loading={loading}
            />
          </View>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.xl,
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
    marginTop: SPACING.sm,
  },
  card: {
    gap: SPACING.md,
  },
  stepTitle: {
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.weight.bold,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: FONTS.size.base,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  classOption: {
    backgroundColor: COLORS.background.elevated,
    borderWidth: 2,
    borderColor: COLORS.system.blue,
    borderRadius: 8,
    padding: SPACING.md,
  },
  classOptionSelected: {
    borderColor: COLORS.system.glow,
    backgroundColor: COLORS.background.secondary,
  },
  className: {
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  classDescription: {
    fontSize: FONTS.size.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  classStat: {
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.semibold,
    color: COLORS.system.accent,
  },
  inputContainer: {
    gap: SPACING.xs,
  },
  inputLabel: {
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.semibold,
    color: COLORS.system.accent,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: COLORS.background.elevated,
    borderWidth: 1,
    borderColor: COLORS.system.blue,
    borderRadius: 8,
    padding: SPACING.md,
    color: COLORS.text.primary,
    fontSize: FONTS.size.base,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
});
