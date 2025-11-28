import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { SystemButton } from '@/components/SystemButton';
import { SystemCard } from '@/components/SystemCard';
import { COLORS, SPACING, FONTS } from '@/constants/theme';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleAuth = async () => {
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!username.trim()) {
          setError('Username is required');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, username);
        if (error) {
          setError(error.message);
        } else {
          router.replace('/onboarding');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          router.replace('/(tabs)');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>THE SYSTEM</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? 'Begin Your Ascension' : 'Welcome Back, Hunter'}
          </Text>
        </View>

        <SystemCard style={styles.card} glowing>
          {isSignUp && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>USERNAME</Text>
              <TextInput
                style={styles.input}
                placeholder="Choose your hunter name"
                placeholderTextColor={COLORS.text.dim}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>EMAIL</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.text.dim}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.text.dim}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <SystemButton
            title={isSignUp ? 'AWAKEN' : 'ENTER THE SYSTEM'}
            onPress={handleAuth}
            loading={loading}
          />

          <SystemButton
            title={isSignUp ? 'Already a Hunter? Sign In' : 'New Hunter? Sign Up'}
            onPress={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            variant="secondary"
          />
        </SystemCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONTS.size['4xl'],
    fontWeight: FONTS.weight.bold,
    color: COLORS.system.glow,
    letterSpacing: 2,
    textShadowColor: COLORS.system.glow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: FONTS.size.lg,
    color: COLORS.text.secondary,
    marginTop: SPACING.sm,
  },
  card: {
    gap: SPACING.md,
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
  error: {
    color: COLORS.error,
    fontSize: FONTS.size.sm,
    textAlign: 'center',
  },
});
