import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { sendForgotPasswordEmail } from '../api/authApi';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleForgotPassword() {
    setMessage('');
    setErrorMessage('');

    if (!email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const result = await sendForgotPasswordEmail({
        email: email.trim().toLowerCase(),
      });

      setMessage(result?.message || 'Password reset email has been sent.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send email.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => router.push('/login')} style={styles.backButton}>
          <Text style={styles.backText}>← Back to Login</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.badge}>Password help</Text>
          <Text style={styles.title}>Reset your password</Text>
          <Text style={styles.subtitle}>
            Enter your registered email. We will send password reset instructions.
          </Text>

          <View style={styles.form}>
            <View>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />
            </View>

            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            {message ? <Text style={styles.success}>{message}</Text> : null}

            <TouchableOpacity
              onPress={handleForgotPassword}
              disabled={loading}
              style={[styles.primaryButton, loading && styles.disabledButton]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Send reset email</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fbfbfb' },
  content: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
  backButton: { marginBottom: 20 },
  backText: { color: '#0a6e42', fontWeight: '800' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
  },
  badge: {
    color: '#0a6e42',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  title: { color: '#111827', fontSize: 34, lineHeight: 40, fontWeight: '900' },
  subtitle: { marginTop: 12, color: '#4b5563', fontSize: 15, lineHeight: 23 },
  form: { marginTop: 28, gap: 16 },
  label: { color: '#111827', fontSize: 13, fontWeight: '800', marginBottom: 8 },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.12)',
    borderRadius: 16,
    paddingHorizontal: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: 999,
    backgroundColor: '#0e8f56',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  disabledButton: { opacity: 0.7 },
  primaryButtonText: { color: '#fff', fontWeight: '900', fontSize: 15 },
  error: { color: '#b91c1c', fontWeight: '700', lineHeight: 20 },
  success: { color: '#0a6e42', fontWeight: '800', lineHeight: 20 },
  note: { color: '#6b7280', fontSize: 12, lineHeight: 18, textAlign: 'center' },
  link: { color: '#0a6e42', fontWeight: '800', textAlign: 'center' },
});
