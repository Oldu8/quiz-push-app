import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { ReactNode, useState } from 'react';
import {
  TextInput as RNTextInput,
  StyleSheet,
  Text,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

type Props = TextInputProps & {
  label?: string;
  error?: string | null;
  containerStyle?: ViewStyle;
  rightAccessory?: ReactNode;
};

export const TextInput: React.FC<Props> = ({
  label,
  error,
  containerStyle,
  rightAccessory,
  onFocus,
  onBlur,
  ...rest
}) => {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  const hasError = Boolean(error);
  const [focused, setFocused] = useState(false);

  return (
    <View style={containerStyle}>
      {label ? <Text style={[styles.label, { color: palette.grey }]}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: hasError
              ? palette.error
              : focused
                ? palette.primary
                : palette.border,
            backgroundColor: palette.background,
          },
        ]}
      >
        <RNTextInput
          style={[styles.input, { color: palette.text }]}
          placeholderTextColor={palette.grey}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {rightAccessory ? (
          <View style={styles.accessory}>{rightAccessory}</View>
        ) : null}
      </View>
      {hasError ? <Text style={[styles.error, { color: palette.error }]}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  input: {
    paddingVertical: 10,
    fontSize: 16,
    flex: 1,
    borderWidth: 0,
    outlineWidth: 0,
    outlineStyle: "solid",
    outlineColor: "transparent",
  },
  accessory: {
    marginLeft: 8,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
  },
});

