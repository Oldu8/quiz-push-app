import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type SecondaryButtonProps = {
  label: string;
  onPress: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  style,
}) => {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isDisabled
            ? palette.lowGrey
            : pressed
              ? palette.lowPink
              : palette.background,
          borderColor: palette.lowGrey,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.primary} />
      ) : (
        <Text
          style={[
            styles.label,
            { color: isDisabled ? palette.grey : palette.primary },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
});

