import React, { useState } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TextInput } from './text-input';
import type { TextInputProps } from 'react-native';
import { IconSymbol } from './icon-symbol';

type Props = TextInputProps & {
  label?: string;
  error?: string | null;
  containerStyle?: ViewStyle;
};

export const PasswordInput: React.FC<Props> = ({
  label,
  error,
  containerStyle,
  ...rest
}) => {
  const [visible, setVisible] = useState(false);
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <View style={containerStyle}>
      <TextInput
        label={label}
        error={error}
        secureTextEntry={!visible}
        rightAccessory={
          <Pressable
            onPress={() => setVisible((v) => !v)}
            style={styles.toggle}
            hitSlop={10}
          >
            <IconSymbol
              name={visible ? 'eye.slash' : 'eye'}
              color={palette.primary}
              size={20}
            />
          </Pressable>
        }
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  toggle: {
    paddingVertical: 2,
  },
});

