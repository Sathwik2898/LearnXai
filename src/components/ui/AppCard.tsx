import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';

type AppCardVariant = 'glass' | 'highlight';

type AppCardProps = {
  children: ReactNode;
  variant?: AppCardVariant;
  style?: StyleProp<ViewStyle>;
};

export function AppCard({ children, variant = 'glass', style }: AppCardProps) {
  const gradientColors =
    variant === 'highlight'
      ? (['rgba(116,103,255,0.24)', 'rgba(66,216,255,0.09)', 'rgba(255,255,255,0.06)'] as const)
      : (['rgba(255,255,255,0.105)', 'rgba(255,255,255,0.045)', 'rgba(116,103,255,0.055)'] as const);

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.base,
        variant === 'highlight' && styles.highlight,
        style,
      ]}
    >
      <View style={styles.topHighlight} pointerEvents="none" />
      <View style={styles.cornerGlow} pointerEvents="none" />
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  base: {
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderGlass,
    borderRadius: radius['2xl'],
    padding: 22,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.22,
    shadowRadius: 30,
    elevation: 10,
  },
  highlight: {
    borderColor: colors.borderPrimaryStrong,
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 18,
    right: 18,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  cornerGlow: {
    position: 'absolute',
    top: -90,
    right: -80,
    width: 190,
    height: 190,
    borderRadius: 190,
    backgroundColor: 'rgba(66,216,255,0.10)',
  },
});