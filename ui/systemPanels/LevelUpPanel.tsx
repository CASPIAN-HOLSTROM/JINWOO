import { Modal, View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { COLORS, SPACING, FONTS } from '@/constants/theme';
import { SystemCard } from '@/components/SystemCard';
import { Zap, TrendingUp } from 'lucide-react-native';

interface LevelUpPanelProps {
  visible: boolean;
  oldLevel: number;
  newLevel: number;
  artwork: {
    imagePath: string;
    description: string;
  };
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export function LevelUpPanel({ visible, oldLevel, newLevel, artwork, onClose }: LevelUpPanelProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
    }
  }, [visible]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
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
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Zap color={COLORS.system.glow} size={32} fill={COLORS.system.glow} />
              </Animated.View>
              <Animated.Text style={[styles.title, { opacity: glowOpacity }]}>LEVEL UP!</Animated.Text>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Zap color={COLORS.system.glow} size={32} fill={COLORS.system.glow} />
              </Animated.View>
            </View>

            <View style={styles.levelDisplay}>
              <View style={styles.levelBox}>
                <Text style={styles.levelLabel}>FROM</Text>
                <Text style={styles.levelValue}>{oldLevel}</Text>
              </View>

              <TrendingUp color={COLORS.success} size={48} />

              <View style={styles.levelBox}>
                <Text style={styles.levelLabel}>TO</Text>
                <Text style={[styles.levelValue, styles.newLevel]}>{newLevel}</Text>
              </View>
            </View>

            <Animated.View style={[styles.imageContainer, { opacity: glowOpacity }]}>
              <Image
                source={require('@/assets/images/THE REAWAKENED ONE copy.jpg')}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay}>
                <Animated.Text style={[styles.imageText, { transform: [{ scale: pulseAnim }] }]}>SUNG JIN-WOO</Animated.Text>
                <Text style={styles.imageSubtext}>ASCENDING</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>LV. {newLevel}</Text>
                </View>
              </View>
              <View style={styles.energyEffect} />
            </Animated.View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>{artwork.description}</Text>
            </View>

            <View style={styles.glowLine} />

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>CONTINUE YOUR ASCENSION</Text>
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
    fontSize: FONTS.size['3xl'],
    fontWeight: FONTS.weight.bold,
    color: COLORS.system.glow,
    letterSpacing: 3,
    textShadowColor: COLORS.system.glow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  levelDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: SPACING.xl,
  },
  levelBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.background.elevated,
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.system.blue,
  },
  levelLabel: {
    fontSize: FONTS.size.sm,
    color: COLORS.text.secondary,
    fontWeight: FONTS.weight.semibold,
    marginBottom: SPACING.xs,
  },
  levelValue: {
    fontSize: FONTS.size['4xl'],
    fontWeight: FONTS.weight.bold,
    color: COLORS.text.primary,
  },
  newLevel: {
    color: COLORS.system.glow,
    textShadowColor: COLORS.system.glow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.system.glow,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  energyEffect: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.system.glow,
    opacity: 0.1,
  },
  levelBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.system.glow,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.text.primary,
  },
  levelBadgeText: {
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.bold,
    color: COLORS.background.primary,
    letterSpacing: 1,
  },
  imageText: {
    fontSize: FONTS.size['2xl'],
    fontWeight: FONTS.weight.bold,
    color: COLORS.system.glow,
    letterSpacing: 2,
    textShadowColor: COLORS.system.glow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  imageSubtext: {
    fontSize: FONTS.size.base,
    color: COLORS.text.primary,
    marginTop: SPACING.xs,
  },
  descriptionContainer: {
    backgroundColor: COLORS.background.elevated,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.system.glow,
  },
  description: {
    fontSize: FONTS.size.base,
    color: COLORS.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  glowLine: {
    width: '100%',
    height: 2,
    backgroundColor: COLORS.system.glow,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.system.glow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  closeButton: {
    backgroundColor: COLORS.system.blue,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.system.glow,
  },
  closeButtonText: {
    fontSize: FONTS.size.base,
    fontWeight: FONTS.weight.bold,
    color: COLORS.text.primary,
    letterSpacing: 1,
  },
});
