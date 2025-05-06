import { View, StyleSheet } from 'react-native';
import { Text } from './Text';

interface ProfileStatProps {
  value: string;
  label: string;
}

export function ProfileStat({ value, label }: ProfileStatProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  value: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#9BA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
});