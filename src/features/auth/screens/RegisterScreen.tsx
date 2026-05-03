import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PageShell } from '../../../components/layout/PageShell';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';

export function RegisterScreen() {
  return (
    <PageShell scroll contentStyle={styles.content}>
      <Pressable onPress={() => router.push('/')}>
        <Text style={styles.backLink}>← Back to Home</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.badge}>Early Access</Text>
        <Text style={styles.title}>Join LearnXai early access</Text>
        <Text style={styles.subtitle}>
          Register your interest and get notified when LearnXai opens access.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            placeholder="Enter your full name"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="you@example.com"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Interest</Text>
          <TextInput
            placeholder="Learner, institute, business, admin, etc."
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />

          <Text style={styles.label}>Message</Text>
          <TextInput
            placeholder="Tell us what you want to learn or launch"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, styles.textArea]}
            multiline
            textAlignVertical="top"
          />

          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Submit Early Access Request</Text>
          </Pressable>

          <Pressable onPress={() => router.push('/login')}>
            <Text style={styles.footerText}>
              Already have access? <Text style={styles.footerLinkInline}>Login</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </PageShell>
  );
}

const styles = StyleSheet.create({

  content: {
    flexGrow: 1,
    padding: 20,
    paddingTop: spacing['2xl'],
    justifyContent: 'center',
  },
  backLink: {
    color: colors.indigoLight,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 520,
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
    lineHeight: 38,
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
  textArea: {
    minHeight: 100,
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
    textAlign: 'center',
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