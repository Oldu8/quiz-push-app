import React, { ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
  ...rest
}) => {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  const hasError = Boolean(error);

  return (
    <View style={containerStyle}>
      {label ? <Text style={[styles.label, { color: palette.grey }]}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: hasError ? palette.error : palette.border,
            backgroundColor: palette.background,
          },
        ]}
      >
        <RNTextInput
          style={[styles.input, { color: palette.text }]}
          placeholderTextColor={palette.grey}
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
  },
  accessory: {
    marginLeft: 8,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
  },
});

