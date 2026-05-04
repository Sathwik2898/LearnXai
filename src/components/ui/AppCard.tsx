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
  const cardStyle = [
    styles.base,
    variant === 'glass' && styles.glass,
    variant === 'highlight' && styles.highlight,
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: 22,
  },
  glass: {
    backgroundColor: colors.surfaceGlass,
    borderColor: colors.borderGlass,
  },
  highlight: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.borderPrimary,
  },
});