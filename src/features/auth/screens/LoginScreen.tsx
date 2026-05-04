import { PublicHeader } from '@/src/components/layout/PublicHeader';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PageShell } from '../../../components/layout/PageShell';
import { AppInput } from '../../../components/ui/AppInput';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';

export function LoginScreen() {
  return (
    <PageShell contentStyle={styles.content}>
      <PublicHeader />

      <View style={styles.centerArea}>
        <View style={styles.card}>
          <Text style={styles.badge}>Platform Access</Text>
          <Text style={styles.title}>Login to LearnXai</Text>
          <Text style={styles.subtitle}>
            Access is currently limited while the platform is being prepared.
          </Text>

          <View style={styles.form}>
            <AppInput
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
            />

            <AppInput
              label="Password"
              placeholder="Enter password"
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
    </PageShell>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: spacing.xl,
  },
  centerArea: {
    flex: 1,
    justifyContent: 'center',
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