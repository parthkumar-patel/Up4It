import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Search } from 'lucide-react-native';
import { ReactNode } from 'react';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  rightIcon?: ReactNode;
  onRightIconPress?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search',
  rightIcon,
  onRightIconPress,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color="#9BA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#666666"
        />
        {rightIcon && (
          <Pressable onPress={onRightIconPress} style={styles.rightIconContainer}>
            {rightIcon}
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
    color: '#F0F0F0',
    fontFamily: 'Satoshi-Regular',
    fontSize: 16,
  },
  rightIconContainer: {
    padding: 8,
  },
});