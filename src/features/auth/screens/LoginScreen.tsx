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
import { loginUser } from '../api/authApi';
import { AuthLogoLink } from '../components/AuthLogoLink';
import { AuthMentorPreview } from '../components/AuthMentorPreview';

const FRONTEND_DEMO_MODE = true;

const FONT_FAMILY = Platform.select({
  web: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  default: 'System',
}) as string;

export default function LoginScreen() {
  const { width, height } = useWindowDimensions();
  const isCompact = width < 940;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleLogin() {
    setMessage('');
    setErrorMessage('');

    if (!email.includes('@') || !password) {
      setErrorMessage('Please enter email and password.');
      return;
    }

    try {
      setLoading(true);

      if (FRONTEND_DEMO_MODE) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        setMessage('Demo login successful. Backend authentication will be connected next.');
        return;
      }

      const result = await loginUser({
        email: email.trim().toLowerCase(),
        password,
      });

      setMessage(result?.message || 'Login successful.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Login failed.');
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
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue your learning.</Text>

            <View style={styles.form}>
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
                  placeholder="Enter password"
                  placeholderTextColor="#8b95a1"
                  secureTextEntry
                  style={styles.input}
                />
              </View>

              <View style={styles.loginOptions}>
                <TouchableOpacity
                  onPress={() => setRememberMe((current) => !current)}
                  style={styles.rememberRow}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                    {rememberMe ? <Text style={styles.checkboxTick}>✓</Text> : null}
                  </View>
                  <Text style={styles.optionText}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
              {message ? <Text style={styles.success}>{message}</Text> : null}

              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                style={[styles.primaryButton, loading && styles.disabledButton]}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Sign in</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.switchText}>
                  New to LearnXai? <Text style={styles.switchStrong}>Create an account</Text>
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
    fontWeight: '850',
    letterSpacing: -1.2,
  },
  subtitle: {
    marginTop: 12,
    color: '#475569',
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '450',
  },
  form: {
    marginTop: 34,
    gap: 18,
  },
  label: {
    color: '#111827',
    fontFamily: FONT_FAMILY,
    fontSize: 13,
    fontWeight: '750',
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
  loginOptions: {
    marginTop: -2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 17,
    height: 17,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#94a3b8',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#111418',
    borderColor: '#111418',
  },
  checkboxTick: {
    color: '#ffffff',
    fontFamily: FONT_FAMILY,
    fontSize: 11,
    fontWeight: '900',
  },
  optionText: {
    color: '#475569',
    fontFamily: FONT_FAMILY,
    fontSize: 14,
  },
  forgotText: {
    color: '#111827',
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    fontWeight: '650',
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