import { AppInput } from '@/src/components/ui/AppInput';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PageShell } from '../../../components/layout/PageShell';
import { PublicHeader } from '../../../components/layout/PublicHeader';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';

export function RegisterScreen() {
  return (
    <PageShell scroll header={<PublicHeader />} contentStyle={styles.content}>

      <View style={styles.authSection}>
        <View style={styles.card}>
          <Text style={styles.badge}>Early Access</Text>
          <Text style={styles.title}>Join LearnXai early access</Text>
          <Text style={styles.subtitle}>
            Register your interest and get notified when LearnXai opens access.
          </Text>

          <View style={styles.form}>
            <AppInput label="Full Name" placeholder="Enter your full name" />

            <AppInput
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
            />

            <AppInput
              label="Interest"
              placeholder="Learner, institute, business, admin, etc."
            />

            <AppInput
              label="Message"
              placeholder="Tell us what you want to learn or launch"
              multiline
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
      </View>
    </PageShell>
  );
}

const styles = StyleSheet.create({

  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.xl,
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
  authSection: {
    width: '100%',
    alignItems: 'center',
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