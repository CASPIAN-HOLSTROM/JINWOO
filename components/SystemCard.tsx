import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SHADOWS, SPACING, FONTS } from '@/constants/theme';

interface SystemCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowing?: boolean;
}

export function SystemCard({ children, style, glowing = false }: SystemCardProps) {
  return (
    <View
      style={[
        styles.container,
        glowing && styles.glowing,
        style,
      ]}
    >
      <View style={styles.border} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background.card,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.system.blue,
    ...SHADOWS.card,
  },
  glowing: {
    borderColor: COLORS.system.glow,
    ...SHADOWS.glow,
  },
  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.system.blue,
    opacity: 0.5,
  },
  content: {
    position: 'relative',
  },
});
