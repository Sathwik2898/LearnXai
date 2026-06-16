import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';

export function PublicHeader() {
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isCompact = width < 768;

  const isCoursesActive = pathname === '/courses';
  const isLoginActive = pathname === '/login' || pathname === '/forgot-password';
  const isRegisterActive = pathname === '/register';

  return (
    <View style={[styles.navbar, isCompact && styles.navbarCompact]}>
      <View style={styles.logoRow}>
        <Pressable onPress={() => router.push('/')} style={styles.logoWrap}>
          <Text style={[styles.logo, isCompact && styles.logoCompact]}>LearnXai</Text>
        </Pressable>
      </View>

      <View style={[styles.navTray, isCompact && styles.navTrayCompact]}>
        <Pressable
          style={[styles.navItem, isCoursesActive && styles.navItemActive]}
          onPress={() => router.push('/courses')}
        >
          <Text
            style={[
              styles.navLink,
              isCompact && styles.navLinkCompact,
              isCoursesActive && styles.navLinkActive,
            ]}
          >
            Courses
          </Text>
        </Pressable>

        <Pressable
          style={[styles.navItem, isLoginActive && styles.navItemActive]}
          onPress={() => router.push('/login')}
        >
          <Text
            style={[
              styles.navLink,
              isCompact && styles.navLinkCompact,
              isLoginActive && styles.navLinkActive,
            ]}
          >
            Login
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.navButton,
            isCompact && styles.navButtonCompact,
            isRegisterActive && styles.navButtonActive,
          ]}
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: spacing.md,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 28,
    letterSpacing: -0.3,
  },
  navTray: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'flex-end',
  },
  navTrayCompact: {
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.055)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: radius.pill,
    padding: 5,
  },
  navItem: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radius.pill,
  },
  navItemActive: {
    backgroundColor: 'rgba(129, 140, 248, 0.14)',
  },
  navLink: {
    color: colors.indigoLight,
    fontSize: 14,
    fontWeight: '800',
  },
  navLinkCompact: {
    fontSize: 13,
  },
  navLinkActive: {
    color: colors.textPrimary,
  },
  navButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.26,
    shadowRadius: 16,
    elevation: 8,
  },
  navButtonCompact: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexShrink: 1,
  },
  navButtonActive: {
    backgroundColor: colors.indigoMedium,
  },
  navButtonText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '900',
  },
  navButtonTextCompact: {
    fontSize: 12,
  },
});