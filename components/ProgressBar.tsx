import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONTS } from '@/constants/theme';

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  color?: string;
  showNumbers?: boolean;
}

export function ProgressBar({
  current,
  max,
  label,
  color = COLORS.system.cyan,
  showNumbers = true,
}: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {showNumbers && (
            <Text style={styles.numbers}>
              {current.toLocaleString()} / {max.toLocaleString()}
            </Text>
          )}
        </View>
      )}
      <View style={styles.barContainer}>
        <View style={styles.barBackground}>
          <View
            style={[
              styles.barFill,
              { width: `${percentage}%`, backgroundColor: color },
            ]}
          >
            <View style={[styles.barGlow, { backgroundColor: color }]} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  label: {
    color: COLORS.text.secondary,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.medium,
  },
  numbers: {
    color: COLORS.text.accent,
    fontSize: FONTS.size.sm,
    fontWeight: FONTS.weight.semibold,
  },
  barContainer: {
    height: 24,
  },
  barBackground: {
    height: '100%',
    backgroundColor: COLORS.background.elevated,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.system.blue,
  },
  barFill: {
    height: '100%',
    borderRadius: 12,
    position: 'relative',
  },
  barGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    opacity: 0.6,
  },
});
