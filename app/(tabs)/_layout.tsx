import { Tabs } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home as HomeIcon, User, Bell } from 'lucide-react-native';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            ...styles.tabBar,
            paddingBottom: 8 + insets.bottom,
          },
          tabBarActiveTintColor: '#668EFF',
          tabBarInactiveTintColor: '#9BA3AF',
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <HomeIcon size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: 'Activity',
            tabBarIcon: ({ color, size }) => (
              <Bell size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <User size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      <TouchableOpacity
        style={[
          styles.fab,
          { bottom: 32 + insets.bottom },
        ]}
        onPress={() => {/* TODO: handle create action */}}
        activeOpacity={0.86}
      >
        <View style={styles.plusIconWrapper}>
          <View style={styles.plusIconNeumorphic}>
            <Text style={styles.plusText}>+</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1A1A1A',
    borderTopColor: '#CCCCCC',
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 14,
    color: '#F0F0F0',
  },
  fab: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  plusIconWrapper: {
    borderRadius: 28,
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  plusIconNeumorphic: {
    backgroundColor: '#FFFFFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  plusText: {
    color: '#1A1A1A',
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'Satoshi-Bold',
    marginTop: -2,
  },
});