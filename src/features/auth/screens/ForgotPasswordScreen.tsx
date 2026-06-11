import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PageShell } from '../../../components/layout/PageShell';
import { PublicHeader } from '../../../components/layout/PublicHeader';
import { AppButton } from '../../../components/ui/AppButton';
import { AppCard } from '../../../components/ui/AppCard';
import { AppInput } from '../../../components/ui/AppInput';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';
import { authService } from '../services/authService';

export function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleForgotPassword() {
    setSuccessMessage('');
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await authService.forgotPassword({
        email: email.trim(),
      });

      setSuccessMessage(response.message);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.';

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageShell scroll header={<PublicHeader />} contentStyle={styles.content}>

      <View style={styles.authSection}>
        <AppCard style={styles.card}>
          <Text style={styles.badge}>Account Recovery</Text>

          <Text style={styles.title}>Forgot password?</Text>

          <Text style={styles.subtitle}>
            Enter your email address and we will prepare a password reset request.
          </Text>

          <View style={styles.form}>
            <AppInput
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            {successMessage ? (
              <Text style={styles.successText}>{successMessage}</Text>
            ) : null}

            <AppButton
              title="Request Reset Link"
              loading={isSubmitting}
              onPress={handleForgotPassword}
            />
          </View>
        </AppCard>
      </View>
    </PageShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.xl,
  },
  authSection: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 460,
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
  errorText: {
    color: '#FCA5A5',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 20,
  },
  successText: {
    color: '#86EFAC',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 20,
  },
});