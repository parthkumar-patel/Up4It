import { useState, useRef } from 'react';
import { View, StyleSheet, SectionList, Pressable, Image, Animated as RNAnimated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { SearchBar } from '@/components/SearchBar';
import { Filter, Plus } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { EventCard } from '@/components/EventCard';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { eventsData } from '@/data/mockData';

// Group events by day
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

// Format date to compare
const formatDateForCompare = (date) => {
  return date.toISOString().split('T')[0];
};

const todayStr = formatDateForCompare(today);
const tomorrowStr = formatDateForCompare(tomorrow);

// Helper to extract date from string like "2023-10-15"
const getDateFromString = (dateStr) => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return null;
    }
    return formatDateForCompare(date);
  } catch (error) {
    return null;
  }
};

// Group events
const upcomingEvents = eventsData.filter(event => {
  const eventDate = getDateFromString(event.date);
  return eventDate && eventDate !== todayStr && eventDate !== tomorrowStr;
});

// Create sections
const sections = [
  {
    title: 'Today',
    data: eventsData.filter(event => {
      const eventDate = getDateFromString(event.date);
      return eventDate === todayStr;
    }),
  },
  {
    title: 'Tomorrow',
    data: eventsData.filter(event => {
      const eventDate = getDateFromString(event.date);
      return eventDate === tomorrowStr;
    }),
  },
  {
    title: 'Upcoming',
    data: upcomingEvents,
  },
];

function EventsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const tabIndicatorPosition = useRef(new RNAnimated.Value(0)).current;

  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'registered', label: 'Registered' },
    { id: 'past', label: 'Past Events' },
  ];

  const onTabPress = (tabIndex) => {
    RNAnimated.spring(tabIndicatorPosition, {
      toValue: tabIndex * (tabWidth + 8),
      useNativeDriver: true,
    }).start();
    setActiveTab(tabs[tabIndex].id);
  };

  const tabWidth = (100 / tabs.length) - 2;  // 2% for gaps

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Events</Text>
        <Button 
          title="Create" 
          variant="primary" 
          size="small"
          leftIcon={<Plus size={16} color="#FFFFFF" />}
          style={styles.createButton}
        />
      </View>
      
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search your events"
        rightIcon={<Filter size={20} color="#9BA3AF" />}
      />
      
      <View style={styles.tabsContainer}>
        <RNAnimated.View 
          style={[
            styles.tabIndicator, 
            { 
              width: `${tabWidth}%`,
              transform: [{ translateX: tabIndicatorPosition }],
            }
          ]} 
        />
        
        {tabs.map((tab, index) => (
          <Pressable
            key={tab.id}
            style={[
              styles.tab, 
              { width: `${tabWidth}%` }
            ]}
            onPress={() => onTabPress(index)}
          >
            <Text 
              style={[
                styles.tabLabel, 
                activeTab === tab.id && styles.activeTabLabel
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
      
      <SectionList
        sections={activeTab === 'upcoming' ? sections : []}
        keyExtractor={(item) => item.id.toString()}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item, index, section }) => (
          <Animated.View entering={FadeInUp.delay(200 + index * 100).duration(500)}>
            <EventCard
              id={item.id.toString()}
              title={item.title}
              date={item.date}
              time={item.time}
              location={item.location}
              image={item.image}
              attendees={item.attendees}
              category={item.category}
            />
          </Animated.View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {activeTab === 'upcoming' ? (
              <Text style={styles.emptyText}>No upcoming events found</Text>
            ) : activeTab === 'registered' ? (
              <>
                <Text style={styles.emptyTitle}>No registered events</Text>
                <Text style={styles.emptyText}>Browse events and register to see them here</Text>
                <Button 
                  title="Explore Events" 
                  onPress={() => setActiveTab('upcoming')} 
                  style={styles.emptyButton}
                />
              </>
            ) : (
              <Text style={styles.emptyText}>No past events</Text>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#FFFFFF',
  },
  createButton: {
    height: 36,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    paddingHorizontal: 20,
    position: 'relative',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  tabLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#9BA3AF',
    textAlign: 'center',
  },
  activeTabLabel: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: '#668EFF',
    borderRadius: 2,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  sectionHeader: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#9BA3AF',
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 24,
  },
});

export default EventsScreen;