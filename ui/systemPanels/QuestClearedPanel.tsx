import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, SPACING, FONTS } from '@/constants/theme';
import { SystemCard } from '@/components/SystemCard';
import { CheckCircle2, Zap, TrendingUp } from 'lucide-react-native';

interface QuestClearedPanelProps {
  visible: boolean;
  questTitle: string;
  xpGained: number;
  comboBonus?: number;
  breakdown: string[];
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export function QuestClearedPanel({
  visible,
  questTitle,
  xpGained,
  comboBonus,
  breakdown,
  onClose,
}: QuestClearedPanelProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <SystemCard glowing style={styles.card}>
            <View style={styles.header}>
              <CheckCircle2 color={COLORS.success} size={48} />
              <Text style={styles.title}>QUEST CLEARED</Text>
            </View>

            <View style={styles.questNameContainer}>
              <Text style={styles.questName}>{questTitle}</Text>
            </View>

            <View style={styles.xpContainer}>
              <Zap color={COLORS.system.glow} size={32} fill={COLORS.system.glow} />
              <Text style={styles.xpValue}>+{xpGained}</Text>
              <Text style={styles.xpLabel}>XP</Text>
            </View>

            {comboBonus && comboBonus > 0 && (
              <View style={styles.comboContainer}>
                <TrendingUp color={COLORS.warning} size={24} />
                <Text style={styles.comboText}>COMBO BONUS: +{comboBonus} XP</Text>
              </View>
            )}

            {breakdown && breakdown.length > 0 && (
              <View style={styles.breakdownContainer}>
                <Text style={styles.breakdownTitle}>XP BREAKDOWN</Text>
                {breakdown.map((item, index) => (
                  <Text key={index} style={styles.breakdownItem}>
                    {item}
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.glowLine} />

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>CONTINUE HUNTING</Text>
            </TouchableOpacity>
          </SystemCard>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.85,
    maxWidth: 450,
  },
  card: {
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONTS.size['2xl'],
    fontWeight: FONTS.weight.bold,
    color: COLORS.success,
    letterSpacing: 2,
    textShadowColor: COLORS.success,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  questNameContainer: {
    backgroundColor: COLORS.background.elevated,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.xl,
    width: '100%',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.success,
  },
  questName: {
    fontSize: FONTS.size.base,
    color: COLORS.text.primary,
    textAlign: 'center',
    fontWeight: FONTS.weight.semibold,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  xpValue: {
    fontSize: FONTS.size['4xl'],
    fontWeight: FONTS.weight.bold,
    color: COLORS.system.glow,
    textShadowColor: COLORS.system.glow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  xpLabel: {
    fontSize: FONTS.size.lg,
    color: COLORS.text.secondary,
    fontWeight: FONTS.weight.bold,
  },
  comboContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.background.elevated,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.warning,
  },
  comboText: {
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.bold,
    color: COLORS.warning,
    letterSpacing: 1,
  },
  breakdownContainer: {
    width: '100%',
    backgroundColor: COLORS.background.elevated,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.lg,
  },
  breakdownTitle: {
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.bold,
    color: COLORS.system.accent,
    marginBottom: SPACING.sm,
    letterSpacing: 1,
  },
  breakdownItem: {
    fontSize: FONTS.size.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  glowLine: {
    width: '100%',
    height: 2,
    backgroundColor: COLORS.success,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  closeButton: {
    backgroundColor: COLORS.success,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  closeButtonText: {
    fontSize: FONTS.size.base,
    fontWeight: FONTS.weight.bold,
    color: COLORS.background.primary,
    letterSpacing: 1,
  },
});
