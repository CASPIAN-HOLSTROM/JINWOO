import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SHADOWS, SPACING, FONTS } from '@/constants/theme';

interface SystemButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

export function SystemButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: SystemButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        (disabled || loading) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.text.primary} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    ...SHADOWS.subtle,
  },
  primary: {
    backgroundColor: COLORS.system.blue,
    borderColor: COLORS.system.accent,
  },
  secondary: {
    backgroundColor: COLORS.background.elevated,
    borderColor: COLORS.system.blue,
  },
  danger: {
    backgroundColor: COLORS.error,
    borderColor: '#dc2626',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: COLORS.text.primary,
    fontSize: FONTS.size.base,
    fontWeight: FONTS.weight.semibold,
  },
});
