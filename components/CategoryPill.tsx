import { Pressable, StyleSheet } from 'react-native';
import { Text } from './Text';

interface CategoryPillProps {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

export function CategoryPill({ title, isSelected, onPress }: CategoryPillProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        isSelected && styles.selectedContainer,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Text 
        style={[
          styles.text,
          isSelected && styles.selectedText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  selectedContainer: {
    backgroundColor: '#668EFF',
    borderColor: '#668EFF',
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#9BA3AF',
  },
  selectedText: {
    color: '#FFFFFF',
  },
});