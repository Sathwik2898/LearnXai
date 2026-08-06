import { Platform, StyleSheet, Text, View } from 'react-native';

const FONT_FAMILY = Platform.select({
  web: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  default: 'System',
}) as string;

export function AuthMentorPreview() {
  return (
    <View style={styles.previewPane}>
      <View style={styles.previewCard}>
        <View style={styles.previewHeader}>
          <View style={styles.aiIcon}>
            <Text style={styles.aiIconText}>✳</Text>
          </View>

          <View style={styles.previewTitleBlock}>
            <Text style={styles.previewTitle}>Course AI Mentor</Text>
            <Text style={styles.previewSubTitle}>Scoped to · AI Foundations</Text>
          </View>

          <Text style={styles.lessonCode}>LESSON 4 · MODULE 02</Text>
        </View>

        <View style={styles.previewBody}>
          <View style={styles.userBubble}>
            <Text style={styles.userBubbleText}>
              How should I evaluate two prompt versions head-to-head?
            </Text>
          </View>

          <View style={styles.mentorBubble}>
            <Text style={styles.mentorBubbleText}>
              Set the same task and rubric for both, then run a 10-sample blind
              comparison. Score for accuracy, structure, and tone — and keep a
              tie-breaker rule before you start.
            </Text>
          </View>

          <View style={styles.taskCard}>
            <Text style={styles.taskLabel}>SUGGESTED NEXT TASK</Text>
            <Text style={styles.taskText}>
              Run a 10-sample blind comparison and log scores in the project notebook.
            </Text>

            <View style={styles.taskActions}>
              <View style={styles.taskPill}>
                <Text style={styles.taskPillText}>Open task</Text>
              </View>
              <View style={styles.taskPill}>
                <Text style={styles.taskPillText}>Generate quiz</Text>
              </View>
              <View style={styles.taskPill}>
                <Text style={styles.taskPillText}>Project hint</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.previewInputRow}>
          <View style={styles.fakeInput}>
            <Text style={styles.fakeInputText}>Ask about this lesson...</Text>
          </View>

          <View style={styles.sendButton}>
            <Text style={styles.sendButtonText}>→</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  previewPane: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: '#faf9f5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 56,
    paddingVertical: 48,
  },
  previewCard: {
    width: '100%',
    maxWidth: 540,
    borderRadius: 26,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.10)',
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOpacity: 0.12,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 20 },
    elevation: 6,
  },
  previewHeader: {
    minHeight: 70,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(15,23,42,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#dff8eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  aiIconText: {
    color: '#0e8f56',
    fontFamily: FONT_FAMILY,
    fontSize: 19,
    fontWeight: '900',
  },
  previewTitleBlock: {
    flex: 1,
  },
  previewTitle: {
    color: '#111827',
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    fontWeight: '800',
  },
  previewSubTitle: {
    marginTop: 2,
    color: '#4b5563',
    fontFamily: FONT_FAMILY,
    fontSize: 12,
    fontWeight: '600',
  },
  lessonCode: {
    color: '#111827',
    fontFamily: FONT_FAMILY,
    fontSize: 10.5,
    letterSpacing: 4,
    fontWeight: '500',
  },
  previewBody: {
    padding: 24,
  },
  userBubble: {
    alignSelf: 'flex-end',
    maxWidth: '82%',
    backgroundColor: '#111418',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  userBubbleText: {
    color: '#ffffff',
    fontFamily: FONT_FAMILY,
    fontSize: 14.5,
    lineHeight: 23,
    fontWeight: '700',
  },
  mentorBubble: {
    marginTop: 18,
    maxWidth: '88%',
    backgroundColor: '#f1f4f8',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 17,
  },
  mentorBubbleText: {
    color: '#111827',
    fontFamily: FONT_FAMILY,
    fontSize: 14.5,
    lineHeight: 23,
    fontWeight: '500',
  },
  taskCard: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.10)',
    borderRadius: 18,
    padding: 18,
    backgroundColor: '#ffffff',
  },
  taskLabel: {
    color: '#64748b',
    fontFamily: FONT_FAMILY,
    fontSize: 10,
    letterSpacing: 4,
    fontWeight: '800',
  },
  taskText: {
    marginTop: 12,
    color: '#111827',
    fontFamily: FONT_FAMILY,
    fontSize: 14.5,
    lineHeight: 22,
    fontWeight: '700',
  },
  taskActions: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  taskPill: {
    minHeight: 32,
    paddingHorizontal: 13,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  taskPillText: {
    color: '#111827',
    fontFamily: FONT_FAMILY,
    fontSize: 12,
    fontWeight: '700',
  },
  previewInputRow: {
    minHeight: 68,
    borderTopWidth: 1,
    borderTopColor: 'rgba(15,23,42,0.08)',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
  },
  fakeInput: {
    flex: 1,
    minHeight: 40,
    borderRadius: 999,
    backgroundColor: '#f1f4f8',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  fakeInputText: {
    color: '#475569',
    fontFamily: FONT_FAMILY,
    fontSize: 14,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: '#111418',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#ffffff',
    fontFamily: FONT_FAMILY,
    fontSize: 21,
    fontWeight: '700',
  },
});
