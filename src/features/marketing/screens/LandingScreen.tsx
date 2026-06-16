import { router } from 'expo-router';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { PageShell } from '../../../components/layout/PageShell';
import { PublicHeader } from '../../../components/layout/PublicHeader';
import { AppButton } from '../../../components/ui/AppButton';
import { AppCard } from '../../../components/ui/AppCard';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

const productSignals = [
    'AI mentor',
    'Smart course paths',
    'Progress intelligence',
    'Certificates',
];

const proofCards = [
    {
        value: 'AI-first',
        label: 'Learning journeys',
    },
    {
        value: 'Web + Mobile',
        label: 'One premium platform',
    },
    {
        value: 'Outcome-led',
        label: 'Built for real progress',
    },
];

const featureCards = [
    {
        title: 'Learning that feels guided',
        description:
            'Courses are designed around clarity, practice, feedback, and AI-supported next steps.',
    },
    {
        title: 'Premium learner experience',
        description:
            'A polished interface for lessons, quizzes, dashboards, certificates, and learner progress.',
    },
    {
        title: 'Built like a real product',
        description:
            'Clean architecture today, so APIs, analytics, admin tools, and scale can come tomorrow.',
    },
];

export function LandingScreen() {
    const { width } = useWindowDimensions();
    const isCompact = width < 768;

    return (
        <PageShell scroll header={<PublicHeader />} contentStyle={styles.content}>
            <View style={styles.stage}>
                <View style={[styles.glowOrbOne, isCompact && styles.glowOrbOneCompact]} />
                <View style={[styles.glowOrbTwo, isCompact && styles.glowOrbTwoCompact]} />
                <View style={[styles.glowOrbThree, isCompact && styles.glowOrbThreeCompact]} />

                <View style={[styles.hero, isCompact && styles.heroCompact]}>
                    <View style={styles.heroCopy}>
                        <View style={styles.kickerPill}>
                            <View style={styles.kickerDot} />
                            <Text style={styles.kickerText}>AI-first LMS launching soon</Text>
                        </View>

                        <Text style={[styles.heroTitle, isCompact && styles.heroTitleCompact]}>
                            Turn learning into a premium AI-guided experience.
                        </Text>

                        <Text style={[styles.heroSubtitle, isCompact && styles.heroSubtitleCompact]}>
                            LearnXai brings courses, practice, progress, certificates, and AI guidance
                            into one polished learning platform for modern learners and institutes.
                        </Text>

                        <View style={[styles.heroActions, isCompact && styles.heroActionsCompact]}>
                            <AppButton
                                title="Join Early Access"
                                onPress={() => router.push('/register')}
                            />

                            <AppButton
                                title="View Courses"
                                variant="secondary"
                                onPress={() => router.push('/courses')}
                            />
                        </View>

                        <View style={[styles.proofGrid, isCompact && styles.proofGridCompact]}>
                            {proofCards.map((item) => (
                                <View key={item.label} style={[styles.proofCard, isCompact && styles.proofCardCompact]}>
                                    <Text style={styles.proofValue}>{item.value}</Text>
                                    <Text style={styles.proofLabel}>{item.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={[styles.heroVisualWrap, isCompact && styles.heroVisualWrapCompact]}>
                        <View style={styles.visualShell}>
                            <View style={styles.visualTopBar}>
                                <View>
                                    <Text style={styles.visualKicker}>LearnXai Intelligence</Text>
                                    <Text style={styles.visualTitle}>AI Learning Core</Text>
                                </View>

                                <View style={styles.livePill}>
                                    <View style={styles.liveDot} />
                                    <Text style={styles.liveText}>Live</Text>
                                </View>
                            </View>

                            <View style={styles.coreArea}>
                                <View style={styles.coreOuterRing}>
                                    <View style={styles.coreMiddleRing}>
                                        <View style={styles.coreInnerOrb}>
                                            <Text style={styles.coreText}>LX</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.orbitCardTop}>
                                    <Text style={styles.orbitCardTitle}>Next lesson</Text>
                                    <Text style={styles.orbitCardText}>Components + routing</Text>
                                </View>

                                <View style={styles.orbitCardBottom}>
                                    <Text style={styles.orbitCardTitle}>Momentum</Text>
                                    <Text style={styles.orbitCardText}>72% this week</Text>
                                </View>
                            </View>

                            <View style={styles.signalGrid}>
                                {productSignals.map((signal) => (
                                    <View key={signal} style={styles.signalPill}>
                                        <View style={styles.signalDot} />
                                        <Text style={styles.signalText}>{signal}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.sectionIntro}>
                <Text style={styles.sectionKicker}>Why LearnXai</Text>
                <Text style={[styles.sectionTitle, isCompact && styles.sectionTitleCompact]}>
                    Not just course content. A product experience learners remember.
                </Text>
                <Text style={styles.sectionSubtitle}>
                    The goal is to make learning feel premium, guided, measurable, and worth
                    returning to every day.
                </Text>
            </View>

            <View style={[styles.featureGrid, isCompact && styles.featureGridCompact]}>
                {featureCards.map((feature) => (
                    <AppCard key={feature.title} style={styles.featureCard}>
                        <View style={styles.featureGlowLine} />
                        <Text style={styles.featureTitle}>{feature.title}</Text>
                        <Text style={styles.featureDescription}>{feature.description}</Text>
                    </AppCard>
                ))}
            </View>

            <AppCard
                variant="highlight"
                style={[styles.launchPanel, isCompact && styles.launchPanelCompact]}
            >
                <View style={styles.launchGlow} />

                <View style={styles.launchContent}>
                    <Text style={styles.launchKicker}>Early access</Text>
                    <Text style={[styles.launchTitle, isCompact && styles.launchTitleCompact]}>
                        Join the first LearnXai learner group.
                    </Text>
                    <Text style={styles.launchText}>
                        Get notified when the first AI-powered learning tracks are ready.
                    </Text>
                </View>

                <View style={[styles.launchAction, isCompact && styles.launchActionCompact]}>
                    <AppButton title="Request Access" onPress={() => router.push('/register')} />
                </View>
            </AppCard>
        </PageShell>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 20,
        paddingTop: spacing['3xl'],
        paddingBottom: spacing['4xl'],
        overflow: 'hidden',
    },
    stage: {
        position: 'relative',
        width: '100%',
        maxWidth: 1180,
        alignSelf: 'center',
        overflow: 'hidden',
        borderRadius: radius['3xl'],
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing['3xl'],
        backgroundColor: 'rgba(255,255,255,0.018)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.055)',
    },
    glowOrbOne: {
        position: 'absolute',
        width: 420,
        height: 420,
        borderRadius: 420,
        left: -190,
        top: 20,
        backgroundColor: 'rgba(116, 103, 255, 0.26)',
    },
    glowOrbTwo: {
        position: 'absolute',
        width: 520,
        height: 520,
        borderRadius: 520,
        right: -230,
        bottom: -100,
        backgroundColor: 'rgba(66, 216, 255, 0.16)',
    },
    glowOrbThree: {
        position: 'absolute',
        width: 280,
        height: 280,
        borderRadius: 280,
        right: 260,
        top: 120,
        backgroundColor: 'rgba(179, 107, 255, 0.12)',
    },
    glowOrbOneCompact: {
        width: 330,
        height: 330,
        borderRadius: 330,
        left: -210,
        top: 80,
        backgroundColor: 'rgba(116, 103, 255, 0.22)',
    },
    glowOrbTwoCompact: {
        width: 360,
        height: 360,
        borderRadius: 360,
        right: -240,
        bottom: 220,
        backgroundColor: 'rgba(66, 216, 255, 0.13)',
    },
    glowOrbThreeCompact: {
        width: 260,
        height: 260,
        borderRadius: 260,
        right: -120,
        top: 520,
        backgroundColor: 'rgba(179, 107, 255, 0.11)',
    },
    hero: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing['3xl'],
        minHeight: 650,
    },
    heroCompact: {
        flexDirection: 'column',
        alignItems: 'stretch',
        minHeight: 0,
        gap: spacing['2xl'],
        paddingVertical: spacing.lg,
    },
    heroCopy: {
        flex: 1,
        minWidth: 0,
    },
    kickerPill: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.pill,
        backgroundColor: 'rgba(116, 103, 255, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(141, 140, 255, 0.32)',
        marginBottom: spacing.xl,
    },
    kickerDot: {
        width: 8,
        height: 8,
        borderRadius: 8,
        backgroundColor: colors.neuralCyan,
    },
    kickerText: {
        color: colors.indigoLight,
        fontFamily: typography.fontFamily.bodyExtraBold,
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 0.7,
    },
    heroTitle: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.heading,
        fontSize: 66,
        lineHeight: 70,
        letterSpacing: -2.9,
        maxWidth: 740,
    },
    heroTitleCompact: {
        fontSize: 44,
        lineHeight: 49,
        letterSpacing: -1.7,
    },
    heroSubtitle: {
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.body,
        fontSize: 19,
        lineHeight: 31,
        marginTop: spacing.xl,
        maxWidth: 640,
    },
    heroSubtitleCompact: {
        fontSize: 17,
        lineHeight: 28,
    },
    heroActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        marginTop: spacing['2xl'],
    },
    heroActionsCompact: {
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    proofGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        marginTop: spacing['2xl'],
    },
    proofGridCompact: {
        gap: spacing.sm,
    },
    proofCard: {
        minWidth: 150,
        padding: spacing.md,
        borderRadius: radius.xl,
        backgroundColor: 'rgba(255,255,255,0.065)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
    },
    proofCardCompact: {
        flexGrow: 1,
        minWidth: 145,
    },
    proofValue: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.heading,
        fontSize: 18,
    },
    proofLabel: {
        color: colors.textMuted,
        fontFamily: typography.fontFamily.bodyBold,
        fontSize: 12,
        marginTop: 4,
    },
    heroVisualWrap: {
        flex: 1,
        minWidth: 340,
        maxWidth: 500,
    },
    heroVisualWrapCompact: {
        width: '100%',
        minWidth: 0,
        maxWidth: '100%',
    },
    visualShell: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: radius['3xl'],
        padding: spacing.xl,
        backgroundColor: 'rgba(13, 18, 38, 0.92)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 30,
        },
        shadowOpacity: 0.35,
        shadowRadius: 48,
        elevation: 20,
    },
    visualTopBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.md,
        alignItems: 'flex-start',
        marginBottom: spacing.xl,
    },
    visualKicker: {
        color: colors.textMuted,
        fontFamily: typography.fontFamily.bodyExtraBold,
        fontSize: 11,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    visualTitle: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.heading,
        fontSize: 27,
        marginTop: 5,
    },
    livePill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: radius.pill,
        backgroundColor: colors.successSoft,
        borderWidth: 1,
        borderColor: 'rgba(143,255,193,0.24)',
    },
    liveDot: {
        width: 7,
        height: 7,
        borderRadius: 7,
        backgroundColor: colors.success,
    },
    liveText: {
        color: colors.success,
        fontSize: 12,
        fontWeight: '900',
    },
    coreArea: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 330,
        marginBottom: spacing.xl,
    },
    coreOuterRing: {
        width: 250,
        height: 250,
        borderRadius: 250,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(116,103,255,0.13)',
        borderWidth: 1,
        borderColor: 'rgba(141,140,255,0.28)',
    },
    coreMiddleRing: {
        width: 178,
        height: 178,
        borderRadius: 178,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(66,216,255,0.10)',
        borderWidth: 1,
        borderColor: 'rgba(66,216,255,0.24)',
    },
    coreInnerOrb: {
        width: 104,
        height: 104,
        borderRadius: 104,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: {
            width: 0,
            height: 18,
        },
        shadowOpacity: 0.42,
        shadowRadius: 26,
        elevation: 18,
    },
    coreText: {
        color: colors.textPrimary,
        fontSize: 31,
        fontWeight: '900',
        letterSpacing: -1,
    },
    orbitCardTop: {
        position: 'absolute',
        top: 18,
        right: 0,
        maxWidth: 170,
        padding: spacing.md,
        borderRadius: radius.xl,
        backgroundColor: 'rgba(255,255,255,0.10)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.16)',
    },
    orbitCardBottom: {
        position: 'absolute',
        left: 0,
        bottom: 22,
        maxWidth: 170,
        padding: spacing.md,
        borderRadius: radius.xl,
        backgroundColor: 'rgba(255,255,255,0.10)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.16)',
    },
    orbitCardTitle: {
        color: colors.textPrimary,
        fontSize: 12,
        fontWeight: '900',
    },
    orbitCardText: {
        color: colors.textSecondary,
        fontSize: 12,
        lineHeight: 17,
        marginTop: 4,
        fontWeight: '700',
    },
    signalGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    signalPill: {
        flexGrow: 1,
        minWidth: 145,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderRadius: radius.lg,
        backgroundColor: 'rgba(255,255,255,0.065)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.10)',
    },
    signalDot: {
        width: 9,
        height: 9,
        borderRadius: 9,
        backgroundColor: colors.neuralCyan,
    },
    signalText: {
        color: colors.textSecondary,
        fontSize: 13,
        fontWeight: '800',
    },
    sectionIntro: {
        width: '100%',
        maxWidth: 860,
        alignSelf: 'center',
        alignItems: 'center',
        paddingTop: spacing['4xl'],
        paddingBottom: spacing['2xl'],
    },
    sectionKicker: {
        color: colors.indigoMedium,
        fontSize: 13,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1.4,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.heading,
        fontSize: 44,
        lineHeight: 50,
        letterSpacing: -1.5,
        textAlign: 'center',
    },
    sectionTitleCompact: {
        fontSize: 34,
        lineHeight: 40,
    },
    sectionSubtitle: {
        color: colors.textSecondary,
        fontSize: 17,
        lineHeight: 28,
        textAlign: 'center',
        marginTop: spacing.md,
    },
    featureGrid: {
        width: '100%',
        maxWidth: 1120,
        alignSelf: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.lg,
    },
    featureGridCompact: {
        flexDirection: 'column',
    },
    featureCard: {
        flex: 1,
        minWidth: 280,
        minHeight: 230,
        overflow: 'hidden',
    },
    featureGlowLine: {
        width: 54,
        height: 4,
        borderRadius: 4,
        backgroundColor: colors.neuralCyan,
        marginBottom: spacing.xl,
    },
    featureTitle: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.heading,
        fontSize: 22,
        marginBottom: spacing.md,
    },
    featureDescription: {
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.body,
        fontSize: 15,
        lineHeight: 25,
    },
    launchPanel: {
        position: 'relative',
        width: '100%',
        maxWidth: 1120,
        alignSelf: 'center',
        marginTop: spacing['3xl'],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.xl,
        overflow: 'hidden',
    },
    launchPanelCompact: {
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    launchGlow: {
        position: 'absolute',
        width: 360,
        height: 360,
        borderRadius: 360,
        right: -160,
        top: -160,
        backgroundColor: 'rgba(116, 103, 255, 0.18)',
    },
    launchContent: {
        flex: 1,
        minWidth: 0,
    },
    launchKicker: {
        color: colors.indigoMedium,
        fontSize: 13,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1.3,
        marginBottom: spacing.sm,
    },
    launchTitle: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.heading,
        fontSize: 34,
        lineHeight: 40,
        letterSpacing: -1,
    },
    launchTitleCompact: {
        fontSize: 30,
        lineHeight: 36,
    },
    launchText: {
        color: colors.textSecondary,
        fontSize: 15,
        lineHeight: 25,
        marginTop: spacing.sm,
    },
    launchAction: {
        minWidth: 190,
    },
    launchActionCompact: {
        minWidth: 0,
        width: '100%',
    },
});