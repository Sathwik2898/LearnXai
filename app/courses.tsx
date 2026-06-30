import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const courses = [
    'AI Foundations',
    'Full-Stack Development',
    'Mobile App Development',
    'Cloud & DevOps',
];

export default function CoursesScreen() {
    return (
        <ScrollView style={styles.page} contentContainerStyle={styles.content}>
            <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
                <Text style={styles.backText}>← Back to LearnXai</Text>
            </TouchableOpacity>

            <Text style={styles.badge}>Course catalogue</Text>
            <Text style={styles.title}>Choose a learning path</Text>
            <Text style={styles.subtitle}>
                Demo catalogue for AI, full-stack, mobile app development, cloud, and career-ready learning paths.
            </Text>

            <View style={styles.grid}>
                {courses.map((course) => (
                    <View key={course} style={styles.card}>
                        <Text style={styles.cardTag}>Early access</Text>
                        <Text style={styles.cardTitle}>{course}</Text>
                        <Text style={styles.cardText}>
                            Structured lessons, guided practice, projects, and course mentor support.
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/register')} style={styles.button}>
                            <Text style={styles.buttonText}>Start Free</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    page: { flex: 1, backgroundColor: '#fbfbfb' },
    content: { padding: 24, maxWidth: 1100, width: '100%', alignSelf: 'center' },
    backButton: { marginBottom: 28 },
    backText: { color: '#0a6e42', fontWeight: '800' },
    badge: { color: '#0a6e42', fontWeight: '900', textTransform: 'uppercase', marginBottom: 12 },
    title: { fontSize: 44, lineHeight: 50, fontWeight: '900', color: '#111827' },
    subtitle: { marginTop: 14, fontSize: 16, lineHeight: 24, color: '#4b5563', maxWidth: 680 },
    grid: { marginTop: 32, gap: 16 },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(15,23,42,0.08)',
    },
    cardTag: { color: '#0a6e42', fontWeight: '900', textTransform: 'uppercase', marginBottom: 12 },
    cardTitle: { fontSize: 26, fontWeight: '900', color: '#111827' },
    cardText: { marginTop: 10, color: '#4b5563', fontSize: 15, lineHeight: 22 },
    button: {
        marginTop: 20,
        backgroundColor: '#0e8f56',
        borderRadius: 999,
        paddingVertical: 13,
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontWeight: '900' },
});
