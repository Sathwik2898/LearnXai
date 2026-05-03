import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PageShell } from '../../../components/layout/PageShell';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';

export function LandingScreen() {
    return (
        <PageShell scroll contentStyle={styles.content}>
            <View style={styles.navbar}>
                <Text style={styles.logo}>LearnXai</Text>

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

            <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>Launching Soon • AI-first LMS</Text>
            </View>

            <View style={styles.heroSection}>
                <Text style={styles.brand}>LearnXai</Text>

                <Text style={styles.title}>
                    Build, launch, and scale premium learning experiences with AI.
                </Text>

                <Text style={styles.subtitle}>
                    LearnXai is a modern LMS platform for courses, learners, analytics,
                    certificates, and intelligent learning journeys — built for web and mobile.
                </Text>

                <View style={styles.actions}>
                    <Pressable style={styles.primaryButton} onPress={() => router.push('/register')}>
                        <Text style={styles.primaryButtonText}>Join Early Access</Text>
                    </Pressable>

                    <Pressable style={styles.secondaryButton} onPress={() => router.push('/courses')}>
                        <Text style={styles.secondaryButtonText}>View Courses</Text>
                    </Pressable>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionLabel}>Platform Highlights</Text>
                <Text style={styles.sectionTitle}>Everything needed for a modern LMS</Text>

                <View style={styles.cardsGrid}>
                    <View style={styles.card}>
                        <Text style={styles.cardIcon}>🎓</Text>
                        <Text style={styles.cardTitle}>Course Experiences</Text>
                        <Text style={styles.cardText}>
                            Create structured courses, lessons, quizzes, notes, bookmarks, and learning paths.
                        </Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardIcon}>🤖</Text>
                        <Text style={styles.cardTitle}>AI-first Learning</Text>
                        <Text style={styles.cardText}>
                            Prepare for AI recommendations, smart summaries, learner insights, and guided progress.
                        </Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardIcon}>📊</Text>
                        <Text style={styles.cardTitle}>Analytics Ready</Text>
                        <Text style={styles.cardText}>
                            Track learner engagement, course progress, completion rates, and performance reports.
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.comingSoonSection}>
                <Text style={styles.comingSoonTitle}>Course catalog is opening soon</Text>
                <Text style={styles.comingSoonText}>
                    We will publish available courses, learning paths, and LearnXai platform services here.
                </Text>

                <Pressable style={styles.comingSoonButton} onPress={() => router.push('/courses')}>
                    <Text style={styles.comingSoonButtonText}>Explore Upcoming Courses</Text>
                </Pressable>
            </View>
        </PageShell>
    );
}

const styles = StyleSheet.create({

    content: {
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 48,
    },
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
    heroBadge: {
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: colors.borderPrimaryStrong,
        backgroundColor: colors.primaryGlass,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: radius.pill,
        marginBottom: 28,
    },
    heroBadgeText: {
        color: colors.indigoLight,
        fontSize: 13,
        fontWeight: '700',
    },
    heroSection: {
        alignItems: 'center',
        maxWidth: 920,
        alignSelf: 'center',
    },
    brand: {
        color: colors.textPrimary,
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: 0.5,
        marginBottom: spacing.lg,
    },
    title: {
        color: colors.textPrimary,
        fontSize: 44,
        lineHeight: 52,
        fontWeight: '900',
        textAlign: 'center',
        letterSpacing: -1.2,
    },
    subtitle: {
        color: colors.textSecondary,
        fontSize: 17,
        lineHeight: 27,
        textAlign: 'center',
        marginTop: spacing.lg,
        maxWidth: 720,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: 30,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 22,
        paddingVertical: 14,
        borderRadius: radius.lg,
    },
    primaryButtonText: {
        color: colors.textPrimary,
        fontSize: 15,
        fontWeight: '800',
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: colors.borderStrong,
        backgroundColor: 'rgba(255,255,255,0.06)',
        paddingHorizontal: 22,
        paddingVertical: 14,
        borderRadius: radius.lg,
    },
    secondaryButtonText: {
        color: colors.textPrimary,
        fontSize: 15,
        fontWeight: '800',
    },
    section: {
        marginTop: spacing['4xl'],
        maxWidth: 1080,
        width: '100%',
        alignSelf: 'center',
    },
    sectionLabel: {
        color: colors.indigoMedium,
        fontSize: 13,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
        textAlign: 'center',
    },
    sectionTitle: {
        color: colors.textPrimary,
        fontSize: 30,
        lineHeight: 38,
        fontWeight: '900',
        textAlign: 'center',
        marginTop: spacing.sm,
        marginBottom: 26,
    },
    cardsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.lg,
        justifyContent: 'center',
    },
    card: {
        width: 320,
        minHeight: 190,
        backgroundColor: colors.surfaceGlass,
        borderWidth: 1,
        borderColor: colors.borderGlass,
        borderRadius: radius.xl,
        padding: 22,
    },
    cardIcon: {
        fontSize: 30,
        marginBottom: spacing.md,
    },
    cardTitle: {
        color: colors.textPrimary,
        fontSize: 18,
        fontWeight: '900',
        marginBottom: spacing.sm,
    },
    cardText: {
        color: colors.textSecondary,
        fontSize: 14,
        lineHeight: 22,
    },
    comingSoonSection: {
        marginTop: 42,
        maxWidth: 720,
        alignSelf: 'center',
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: colors.borderPrimary,
        borderRadius: radius['2xl'],
        padding: spacing.xl,
        alignItems: 'center',
    },
    comingSoonTitle: {
        color: colors.textPrimary,
        fontSize: 22,
        fontWeight: '900',
        textAlign: 'center',
    },
    comingSoonText: {
        color: colors.textSecondary,
        fontSize: 15,
        lineHeight: 24,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
    comingSoonButton: {
        marginTop: spacing.lg,
        backgroundColor: colors.surfaceGlassLight,
        borderWidth: 1,
        borderColor: colors.borderLight,
        paddingHorizontal: spacing.lg,
        paddingVertical: 12,
        borderRadius: radius.md,
    },
    comingSoonButtonText: {
        color: colors.textPrimary,
        fontSize: 14,
        fontWeight: '800',
    },
});