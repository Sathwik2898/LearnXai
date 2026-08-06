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
  useWindowDimensions,
  View,
} from 'react-native';
import { registerUser } from '../api/authApi';
import { AuthLogoLink } from '../components/AuthLogoLink';
import { AuthMentorPreview } from '../components/AuthMentorPreview';

const FRONTEND_DEMO_MODE = true;

const FONT_FAMILY = Platform.select({
  web: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  default: 'System',
}) as string;

export default function RegisterScreen() {
  const { width, height } = useWindowDimensions();
  const isCompact = width < 940;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleRegister() {
    setSuccessMessage('');
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (!email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);

      if (FRONTEND_DEMO_MODE) {
        await new Promise((resolve) => setTimeout(resolve, 650));

        setSuccessMessage(
          'Demo registration successful. Backend email confirmation will be connected next.'
        );

        setName('');
        setEmail('');
        setPassword('');
        return;
      }

      const result = await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      setSuccessMessage(
        result?.message ||
          'Registered successfully. Confirmation email has been sent to your registered email.'
      );

      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.page, { minHeight: height }, isCompact && styles.pageCompact]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.leftPane, isCompact && styles.leftPaneCompact]}>
        <ScrollView
          contentContainerStyle={[styles.formScroll, isCompact && styles.formScrollCompact]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topArea}>
            <AuthLogoLink />
          </View>

          <View style={styles.formWrap}>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>
              Start learning with structured courses, projects, and mentor guidance.
            </Text>

            <View style={styles.form}>
              <View>
                <Text style={styles.label}>Full name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor="#8b95a1"
                  style={styles.input}
                />
              </View>

              <View>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@domain.com"
                  placeholderTextColor="#8b95a1"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                />
              </View>

              <View>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 6 characters"
                  placeholderTextColor="#8b95a1"
                  secureTextEntry
                  style={styles.input}
                />
              </View>

              {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
              {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}

              <TouchableOpacity
                onPress={handleRegister}
                disabled={loading}
                style={[styles.primaryButton, loading && styles.disabledButton]}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Create account</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.switchText}>
                  Already have an account? <Text style={styles.switchStrong}>Sign in</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.footer}>© 2026 LearnXai</Text>
        </ScrollView>
      </View>

      {!isCompact ? <AuthMentorPreview /> : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  pageCompact: {
    flexDirection: 'column',
  },
  leftPane: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  leftPaneCompact: {
    minHeight: '100%',
  },
  formScroll: {
    flexGrow: 1,
    paddingHorizontal: 64,
    paddingTop: 46,
    paddingBottom: 34,
    justifyContent: 'space-between',
  },
  formScrollCompact: {
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  topArea: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  formWrap: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    marginVertical: 34,
  },
  title: {
    color: '#111827',
    fontFamily: FONT_FAMILY,
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '800',
    letterSpacing: -1.2,
  },
  subtitle: {
    marginTop: 12,
    color: '#475569',
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  form: {
    marginTop: 34,
    gap: 18,
  },
  label: {
    color: '#111827',
    fontFamily: FONT_FAMILY,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.14)',
    borderRadius: 14,
    paddingHorizontal: 18,
    color: '#111827',
    backgroundColor: '#ffffff',
    fontFamily: FONT_FAMILY,
    fontSize: 15.5,
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: 999,
    backgroundColor: '#111418',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontFamily: FONT_FAMILY,
    fontWeight: '800',
    fontSize: 15.5,
  },
  switchText: {
    color: '#475569',
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  switchStrong: {
    color: '#111827',
    fontWeight: '800',
  },
  error: {
    color: '#b91c1c',
    fontFamily: FONT_FAMILY,
    fontWeight: '700',
    lineHeight: 20,
  },
  success: {
    color: '#0a6e42',
    fontFamily: FONT_FAMILY,
    fontWeight: '800',
    lineHeight: 20,
  },
  footer: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    color: '#475569',
    fontFamily: FONT_FAMILY,
    fontSize: 13,
  },
});
