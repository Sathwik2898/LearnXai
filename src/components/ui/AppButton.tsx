import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/typography';

type AppButtonVariant = 'primary' | 'secondary' | 'ghost';

type AppButtonProps = {
  title: string;
  onPress: () => void | Promise<void>;
  variant?: AppButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: AppButtonProps) {
  const isDisabled = disabled || loading;
  const buttonText = loading ? 'Please wait...' : title;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.pressable,
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={['#A99BFF', '#7467FF', '#42D8FF'] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.surface}
        >
          <View style={styles.primaryShine} pointerEvents="none" />
          <Text style={styles.primaryText}>{buttonText}</Text>
        </LinearGradient>
      ) : null}

      {variant === 'secondary' ? (
        <LinearGradient
          colors={['rgba(255,255,255,0.13)', 'rgba(255,255,255,0.045)'] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.surface, styles.secondarySurface]}
        >
          <Text style={styles.secondaryText}>{buttonText}</Text>
        </LinearGradient>
      ) : null}

      {variant === 'ghost' ? (
        <View style={styles.ghostSurface}>
          <Text style={styles.ghostText}>{buttonText}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'flex-start',
  },
  fullWidth: {
    width: '100%',
    alignSelf: 'stretch',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.55,
  },
  surface: {
    width: '100%',
    minHeight: 50,
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.32,
    shadowRadius: 22,
    elevation: 10,
  },
  primaryShine: {
    position: 'absolute',
    top: 1,
    left: 10,
    right: 10,
    height: 18,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  primaryText: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.bodyExtraBold,
    fontSize: 15,
    letterSpacing: 0.2,
  },
  secondarySurface: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  secondaryText: {
    color: colors.indigoLight,
    fontFamily: typography.fontFamily.bodyExtraBold,
    fontSize: 15,
    letterSpacing: 0.2,
  },
  ghostSurface: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostText: {
    color: colors.indigoLight,
    fontFamily: typography.fontFamily.bodyExtraBold,
    fontSize: 15,
  },
});