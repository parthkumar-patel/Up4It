import { useState } from 'react';
import { View, TextInput as RNTextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { Text } from './Text';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function TextInput({
  label,
  error,
  containerStyle,
  style,
  ...props
}: CustomTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        <RNTextInput
          style={[styles.input, style]}
          placeholderTextColor="#666666"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 14,
    color: '#F0F0F0',
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
    overflow: 'hidden',
  },
  inputContainerFocused: {
    borderColor: '#38B2AC',
  },
  inputContainerError: {
    borderColor: '#EF4444',
  },
  input: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 18,
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  errorText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
  },
});