import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';

export function PublicHeader() {
  const { width } = useWindowDimensions();
  const isCompact = width < 768;

  return (
    <View style={[styles.navbar, isCompact && styles.navbarCompact]}>
      <Pressable onPress={() => router.push('/')} style={styles.logoWrap}>
        <Text style={[styles.logo, isCompact && styles.logoCompact]}>LearnXai</Text>
      </Pressable>

      <View style={[styles.navActions, isCompact && styles.navActionsCompact]}>
        <Pressable onPress={() => router.push('/courses')}>
          <Text style={[styles.navLink, isCompact && styles.navLinkCompact]}>Courses</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/login')}>
          <Text style={[styles.navLink, isCompact && styles.navLinkCompact]}>Login</Text>
        </Pressable>

        <Pressable
          style={[styles.navButton, isCompact && styles.navButtonCompact]}
          onPress={() => router.push('/register')}
        >
          <Text style={[styles.navButtonText, isCompact && styles.navButtonTextCompact]}>
            Join Early Access
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    width: '100%',
    maxWidth: 1120,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navbarCompact: {
    paddingVertical: 16,
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: spacing.md,
  },
  logoWrap: {
    alignSelf: 'flex-start',
  },
  logo: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  logoCompact: {
    fontSize: 24,
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    justifyContent: 'flex-end',
  },
  navActionsCompact: {
    width: '100%',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  navLink: {
    color: colors.indigoLight,
    fontSize: 14,
    fontWeight: '700',
  },
  navLinkCompact: {
    fontSize: 14,
  },
  navButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  navButtonCompact: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexShrink: 1,
  },
  navButtonText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  navButtonTextCompact: {
    fontSize: 13,
  },
});