import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function LandingScreen() {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
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
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Join Early Access</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton}>
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
        <Text style={styles.comingSoonTitle}>Course catalog is coming soon</Text>
        <Text style={styles.comingSoonText}>
          We will soon publish available courses, learning paths, and platform services here.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#080B1A',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 48,
  },
  heroBadge: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.35)',
    backgroundColor: 'rgba(79, 70, 229, 0.16)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 28,
  },
  heroBadgeText: {
    color: '#C7D2FE',
    fontSize: 13,
    fontWeight: '700',
  },
  heroSection: {
    alignItems: 'center',
    maxWidth: 920,
    alignSelf: 'center',
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 18,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 44,
    lineHeight: 52,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -1.2,
  },
  subtitle: {
    color: '#A7B0D8',
    fontSize: 17,
    lineHeight: 27,
    textAlign: 'center',
    marginTop: 18,
    maxWidth: 720,
  },
  actions: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 30,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 16,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  section: {
    marginTop: 72,
    maxWidth: 1080,
    width: '100%',
    alignSelf: 'center',
  },
  sectionLabel: {
    color: '#818CF8',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 26,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  card: {
    width: 320,
    minHeight: 190,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 24,
    padding: 22,
  },
  cardIcon: {
    fontSize: 30,
    marginBottom: 14,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 10,
  },
  cardText: {
    color: '#A7B0D8',
    fontSize: 14,
    lineHeight: 22,
  },
  comingSoonSection: {
    marginTop: 42,
    maxWidth: 720,
    alignSelf: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.25)',
    borderRadius: 26,
    padding: 24,
  },
  comingSoonTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  comingSoonText: {
    color: '#A7B0D8',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 10,
  },
});