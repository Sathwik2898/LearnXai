import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';

type AppButtonVariant = 'primary' | 'secondary' | 'ghost';

type AppButtonProps = {
  title: string;
  onPress: () => void | Promise<void>;
  variant?: AppButtonVariant;
  disabled?: boolean;
  loading?: boolean;
};

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  const buttonStyle = [
    styles.base,
    variant === 'primary' && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'ghost' && styles.ghost,
    isDisabled && styles.disabled,
  ];

  const textStyle = [
    styles.text,
    variant === 'ghost' && styles.ghostText,
  ];

  return (
    <Pressable style={buttonStyle} onPress={onPress} disabled={isDisabled}>
      <Text style={textStyle}>{loading ? 'Please wait...' : title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  disabled: {
    opacity: 0.55,
  },
  text: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  ghostText: {
    color: colors.indigoLight,
  },
});