import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';

export function LoginScreen() {
  return (
    <View style={styles.page}>
      <Pressable onPress={() => router.push('/')} style={styles.backButton}>
        <Text style={styles.backLink}>← Back to Home</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.badge}>Platform Access</Text>
        <Text style={styles.title}>Login to LearnXai</Text>
        <Text style={styles.subtitle}>
          Access is currently limited while the platform is being prepared.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="you@example.com"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Enter password"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            secureTextEntry
          />

          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </Pressable>

          <Pressable onPress={() => router.push('/register')}>
            <Text style={styles.footerText}>
              New here? <Text style={styles.footerLinkInline}>Join early access</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: spacing['2xl'],
    left: 20,
  },
  backLink: {
    color: colors.indigoLight,
    fontSize: 14,
    fontWeight: '800',
  },
  card: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    backgroundColor: colors.surfaceGlass,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    borderRadius: radius['3xl'],
    padding: 26,
  },
  badge: {
    color: colors.indigoMedium,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
  },
  label: {
    color: '#E5E7EB',
    fontSize: 13,
    fontWeight: '800',
  },
  input: {
    backgroundColor: colors.surfaceDark,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 13,
    color: colors.textPrimary,
    fontSize: 15,
  },
  primaryButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '900',
  },
  footerText: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 14,
    marginTop: spacing.sm,
  },
  footerLinkInline: {
    color: colors.indigoLight,
    fontWeight: '900',
  },
});