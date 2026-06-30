import { router } from 'expo-router';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FONT_FAMILY = Platform.select({
  web: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  default: 'System',
}) as string;

export function AuthLogoLink() {
  return (
    <TouchableOpacity onPress={() => router.push('/')} style={styles.brand}>
      <View style={styles.brandMark} aria-hidden>
        <View style={[styles.markDot, styles.markOne]} />
        <View style={[styles.markDot, styles.markTwo]} />
        <View style={[styles.markDot, styles.markThree]} />
        <View style={[styles.markDot, styles.markFour]} />
      </View>

      <Text style={styles.brandText}>LearnXai</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    alignSelf: 'flex-start',
  },
  brandMark: {
    width: 24,
    height: 24,
    position: 'relative',
    transform: [{ rotate: '45deg' }],
  },
  markDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: '#111827',
  },
  markOne: {
    left: 0,
    top: 0,
  },
  markTwo: {
    right: 0,
    top: 0,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#111827',
  },
  markThree: {
    left: 0,
    bottom: 0,
  },
  markFour: {
    right: 0,
    bottom: 0,
  },
  brandText: {
    color: '#111827',
    fontFamily: FONT_FAMILY,
    fontSize: 25,
    fontWeight: '850',
    letterSpacing: -0.6,
  },
});