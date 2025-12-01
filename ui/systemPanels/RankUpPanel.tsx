import { Modal, View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
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

  const explodeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(explodeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          })
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 1200,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 1200,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    } else {
      explodeAnim.setValue(0);
      rotateAnim.setValue(0);
      scaleAnim.setValue(0.5);
      glowAnim.setValue(0);
    }
  }, [visible]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
          <SystemCard glowing style={styles.card}>
            <View style={styles.header}>
              <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                <Crown color={rankColor} size={40} />
              </Animated.View>
              <Animated.Text style={[styles.title, { color: rankColor, opacity: glowOpacity }]}>RANK PROMOTION</Animated.Text>
              <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                <Crown color={rankColor} size={40} />
              </Animated.View>
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

            <Animated.View style={[styles.imageContainer, { borderColor: rankColor, opacity: glowOpacity }]}>
              <Image
                source={require('@/assets/images/THE REAWAKENED ONE copy.jpg')}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay}>
                <Animated.Text style={[styles.imageTitle, { color: rankColor, transform: [{ scale: explodeAnim }] }]}>{artwork.title}</Animated.Text>
                <Text style={styles.imageSubtext}>SUNG JIN-WOO</Text>
              </View>
              <Animated.View style={[styles.rankEnergyEffect, { backgroundColor: rankColor, opacity: explodeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.1] }) }]} />
            </Animated.View>

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
        </Animated.View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankEnergyEffect: {
    ...StyleSheet.absoluteFillObject,
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
