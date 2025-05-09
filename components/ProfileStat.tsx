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
    fontFamily: 'Satoshi-Bold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  label: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: '#F0F0F0',
    marginTop: 4,
    textAlign: 'center',
  },
});