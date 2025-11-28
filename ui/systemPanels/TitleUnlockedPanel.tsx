import { Modal, View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, SPACING, FONTS } from '@/constants/theme';
import { SystemCard } from '@/components/SystemCard';
import { Trophy, Star } from 'lucide-react-native';

interface TitleUnlockedPanelProps {
  visible: boolean;
  titleName: string;
  description: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  category: string;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

const RARITY_COLORS = {
  Common: COLORS.text.dim,
  Rare: COLORS.system.blue,
  Epic: COLORS.system.purple,
  Legendary: COLORS.warning,
  Mythic: COLORS.rank.SSS,
};

export function TitleUnlockedPanel({
  visible,
  titleName,
  description,
  rarity,
  category,
  onClose,
}: TitleUnlockedPanelProps) {
  const rarityColor = RARITY_COLORS[rarity];

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
              <Trophy color={rarityColor} size={36} />
              <Text style={[styles.title, { color: rarityColor }]}>TITLE UNLOCKED</Text>
              <Trophy color={rarityColor} size={36} />
            </View>

            <View style={styles.rarityBadge}>
              <Star color={rarityColor} size={20} fill={rarityColor} />
              <Text style={[styles.rarityText, { color: rarityColor }]}>{rarity.toUpperCase()}</Text>
              <Star color={rarityColor} size={20} fill={rarityColor} />
            </View>

            <View style={[styles.imageContainer, { borderColor: rarityColor }]}>
              <Image
                source={{ uri: `https://images.pexels.com/photos/1405849/pexels-photo-1405849.jpeg?auto=compress&cs=tinysrgb&w=800` }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay}>
                <Text
                  style={[
                    styles.titleName,
                    {
                      color: rarityColor,
                      textShadowColor: rarityColor,
                    },
                  ]}
                >
                  {titleName}
                </Text>
              </View>
            </View>

            <View style={[styles.descriptionContainer, { borderTopColor: rarityColor }]}>
              <Text style={styles.category}>{category}</Text>
              <Text style={styles.description}>{description}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                This title can now be equipped from your Titles screen
              </Text>
            </View>

            <View style={[styles.glowLine, { backgroundColor: rarityColor, shadowColor: rarityColor }]} />

            <TouchableOpacity
              style={[styles.closeButton, { borderColor: rarityColor }]}
              onPress={onClose}
            >
              <Text style={[styles.closeButtonText, { color: rarityColor }]}>
                CLAIM YOUR TITLE
              </Text>
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
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.size['2xl'],
    fontWeight: FONTS.weight.bold,
    letterSpacing: 3,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  rarityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.background.elevated,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginBottom: SPACING.xl,
  },
  rarityText: {
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.bold,
    letterSpacing: 2,
  },
  imageContainer: {
    width: '100%',
    height: 220,
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleName: {
    fontSize: FONTS.size['3xl'],
    fontWeight: FONTS.weight.bold,
    letterSpacing: 2,
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    paddingHorizontal: SPACING.md,
  },
  descriptionContainer: {
    width: '100%',
    backgroundColor: COLORS.background.elevated,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
    borderTopWidth: 3,
  },
  category: {
    fontSize: FONTS.size.xs,
    color: COLORS.system.accent,
    fontWeight: FONTS.weight.semibold,
    marginBottom: SPACING.xs,
    letterSpacing: 1,
  },
  description: {
    fontSize: FONTS.size.base,
    color: COLORS.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoBox: {
    backgroundColor: COLORS.background.elevated,
    padding: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.lg,
  },
  infoText: {
    fontSize: FONTS.size.sm,
    color: COLORS.text.dim,
    textAlign: 'center',
  },
  glowLine: {
    width: '100%',
    height: 2,
    marginBottom: SPACING.lg,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  closeButton: {
    backgroundColor: COLORS.background.elevated,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 8,
    borderWidth: 2,
  },
  closeButtonText: {
    fontSize: FONTS.size.base,
    fontWeight: FONTS.weight.bold,
    letterSpacing: 1,
  },
});
