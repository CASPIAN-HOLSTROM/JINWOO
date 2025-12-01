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
    borderWidth: 2,
    borderColor: COLORS.system.blue,
    ...SHADOWS.card,
    position: 'relative',
    overflow: 'hidden',
  },
  glowing: {
    borderColor: COLORS.system.glow,
    borderWidth: 2,
    ...SHADOWS.glow,
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.system.glow,
    opacity: 0.6,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});
