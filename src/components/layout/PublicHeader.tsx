import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';

export function PublicHeader() {
  return (
    <View style={styles.navbar}>
      <Pressable onPress={() => router.push('/')}>
        <Text style={styles.logo}>LearnXai</Text>
      </Pressable>

      <View style={styles.navActions}>
        <Pressable onPress={() => router.push('/courses')}>
          <Text style={styles.navLink}>Courses</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/login')}>
          <Text style={styles.navLink}>Login</Text>
        </Pressable>

        <Pressable style={styles.navButton} onPress={() => router.push('/register')}>
          <Text style={styles.navButtonText}>Join Early Access</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  logo: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  navLink: {
    color: colors.indigoLight,
    fontSize: 14,
    fontWeight: '700',
  },
  navButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  navButtonText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
});