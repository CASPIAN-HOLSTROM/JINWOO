import { Modal, View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, SPACING, FONTS } from '@/constants/theme';
import { SystemCard } from '@/components/SystemCard';
import { Crown, ArrowUp } from 'lucide-react-native';

interface RankUpPanelProps {
  visible: boolean;
  oldRank: string;
  newRank: string;
  artwork: {
    imagePath: string;
    title: string;
    description: string;
  };
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export function RankUpPanel({ visible, oldRank, newRank, artwork, onClose }: RankUpPanelProps) {
  const rankColor = COLORS.rank[newRank as keyof typeof COLORS.rank] || COLORS.system.glow;

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
              <Crown color={rankColor} size={40} />
              <Text style={[styles.title, { color: rankColor }]}>RANK PROMOTION</Text>
              <Crown color={rankColor} size={40} />
            </View>

            <View style={styles.rankDisplay}>
              <View style={styles.rankBox}>
                <Text style={styles.rankLabel}>FORMER</Text>
                <Text style={[styles.rankValue, { color: COLORS.rank[oldRank as keyof typeof COLORS.rank] }]}>
                  {oldRank}-RANK
                </Text>
              </View>

              <ArrowUp color={rankColor} size={56} strokeWidth={3} />

              <View style={[styles.rankBox, { borderColor: rankColor }]}>
                <Text style={styles.rankLabel}>PROMOTED TO</Text>
                <Text
                  style={[
                    styles.rankValue,
                    styles.newRank,
                    {
                      color: rankColor,
                      textShadowColor: rankColor,
                    },
                  ]}
                >
                  {newRank}-RANK
                </Text>
              </View>
            </View>

            <View style={[styles.imageContainer, { borderColor: rankColor }]}>
              <Image
                source={{ uri: `https://images.pexels.com/photos/1405849/pexels-photo-1405849.jpeg?auto=compress&cs=tinysrgb&w=800` }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay}>
                <Text style={[styles.imageTitle, { color: rankColor }]}>{artwork.title}</Text>
                <Text style={styles.imageSubtext}>SUNG JIN-WOO</Text>
              </View>
            </View>

            <View style={[styles.descriptionContainer, { borderLeftColor: rankColor }]}>
              <Text style={styles.description}>{artwork.description}</Text>
            </View>

            <View style={styles.statsBonus}>
              <Text style={styles.bonusTitle}>RANK BENEFITS UNLOCKED</Text>
              <View style={styles.bonusGrid}>
                <View style={styles.bonusItem}>
                  <Text style={styles.bonusLabel}>Higher Quest Rewards</Text>
                  <Text style={[styles.bonusValue, { color: rankColor }]}>+{newRank === 'SSS' ? 200 : newRank === 'SS' ? 150 : newRank === 'S' ? 100 : 50}%</Text>
                </View>
                <View style={styles.bonusItem}>
                  <Text style={styles.bonusLabel}>New Titles Available</Text>
                  <Text style={[styles.bonusValue, { color: rankColor }]}>Unlocked</Text>
                </View>
              </View>
            </View>

            <View style={[styles.glowLine, { backgroundColor: rankColor, shadowColor: rankColor }]} />

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: rankColor, borderColor: rankColor }]}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>EMBRACE YOUR NEW POWER</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.9,
    maxWidth: 500,
  },
  card: {
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONTS.size['2xl'],
    fontWeight: FONTS.weight.bold,
    letterSpacing: 3,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  rankDisplay: {
    width: '100%',
    alignItems: 'center',
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  rankBox: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: COLORS.background.elevated,
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: COLORS.system.blue,
  },
  rankLabel: {
    fontSize: FONTS.size.sm,
    color: COLORS.text.secondary,
    fontWeight: FONTS.weight.semibold,
    marginBottom: SPACING.xs,
    letterSpacing: 2,
  },
  rankValue: {
    fontSize: FONTS.size['3xl'],
    fontWeight: FONTS.weight.bold,
    letterSpacing: 2,
  },
  newRank: {
    fontSize: FONTS.size['4xl'],
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    borderWidth: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageTitle: {
    fontSize: FONTS.size['3xl'],
    fontWeight: FONTS.weight.bold,
    letterSpacing: 3,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  imageSubtext: {
    fontSize: FONTS.size.lg,
    color: COLORS.text.primary,
    marginTop: SPACING.sm,
    letterSpacing: 2,
  },
  descriptionContainer: {
    backgroundColor: COLORS.background.elevated,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
  },
  description: {
    fontSize: FONTS.size.base,
    color: COLORS.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsBonus: {
    width: '100%',
    backgroundColor: COLORS.background.elevated,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.lg,
  },
  bonusTitle: {
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.bold,
    color: COLORS.system.accent,
    textAlign: 'center',
    marginBottom: SPACING.md,
    letterSpacing: 1,
  },
  bonusGrid: {
    gap: SPACING.sm,
  },
  bonusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bonusLabel: {
    fontSize: FONTS.size.sm,
    color: COLORS.text.secondary,
  },
  bonusValue: {
    fontSize: FONTS.size.base,
    fontWeight: FONTS.weight.bold,
  },
  glowLine: {
    width: '100%',
    height: 3,
    marginBottom: SPACING.lg,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  closeButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 8,
    borderWidth: 2,
  },
  closeButtonText: {
    fontSize: FONTS.size.base,
    fontWeight: FONTS.weight.bold,
    color: COLORS.background.primary,
    letterSpacing: 1,
  },
});
