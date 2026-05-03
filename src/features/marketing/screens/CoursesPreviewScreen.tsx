import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PageShell } from '../../../components/layout/PageShell';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';

const upcomingCourses = [
  {
    title: 'AI Foundations',
    level: 'Beginner',
    description: 'Learn AI basics, prompt thinking, modern tools, and practical workflows.',
  },
  {
    title: 'Full-Stack Development',
    level: 'Beginner to Advanced',
    description: 'Build production-ready frontend, backend, APIs, databases, and deployments.',
  },
  {
    title: 'React Native with Expo',
    level: 'Career Track',
    description: 'Create mobile and web apps from one codebase using Expo and TypeScript.',
  },
];

export function CoursesPreviewScreen() {
  return (
    <PageShell scroll contentStyle={styles.content}>
      <Pressable onPress={() => router.push('/')}>
        <Text style={styles.backLink}>← Back to Home</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.badge}>Course Catalog</Text>
        <Text style={styles.title}>Upcoming LearnXai courses</Text>
        <Text style={styles.subtitle}>
          Course access is opening soon. For now, explore the learning tracks planned for LearnXai.
        </Text>
      </View>

      <View style={styles.grid}>
        {upcomingCourses.map((course) => (
          <View key={course.title} style={styles.card}>
            <Text style={styles.level}>{course.level}</Text>
            <Text style={styles.cardTitle}>{course.title}</Text>
            <Text style={styles.cardText}>{course.description}</Text>

            <View style={styles.statusPill}>
              <Text style={styles.statusText}>Coming Soon</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.ctaBox}>
        <Text style={styles.ctaTitle}>Want early access?</Text>
        <Text style={styles.ctaText}>
          Join the early access list and get notified when LearnXai opens enrollment.
        </Text>

        <Pressable style={styles.primaryButton} onPress={() => router.push('/register')}>
          <Text style={styles.primaryButtonText}>Join Early Access</Text>
        </Pressable>
      </View>
    </PageShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing['3xl'],
  },
  backLink: {
    color: colors.indigoLight,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: spacing['2xl'],
  },
  header: {
    maxWidth: 780,
    alignSelf: 'center',
    alignItems: 'center',
  },
  badge: {
    color: colors.indigoMedium,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  grid: {
    marginTop: 42,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    justifyContent: 'center',
  },
  card: {
    width: 330,
    minHeight: 230,
    backgroundColor: colors.surfaceGlass,
    borderWidth: 1,
    borderColor: colors.borderGlass,
    borderRadius: radius.xl,
    padding: 22,
  },
  level: {
    color: colors.indigoLight,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '900',
  },
  cardText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 23,
    marginTop: spacing.sm,
  },
  statusPill: {
    alignSelf: 'flex-start',
    marginTop: 20,
    backgroundColor: colors.primaryGlass,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  statusText: {
    color: colors.indigoLight,
    fontSize: 12,
    fontWeight: '900',
  },
  ctaBox: {
    marginTop: 42,
    maxWidth: 720,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    borderRadius: radius['2xl'],
    padding: spacing.xl,
  },
  ctaTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '900',
  },
  ctaText: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  primaryButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: radius.md,
  },
  primaryButtonText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '900',
  },
});