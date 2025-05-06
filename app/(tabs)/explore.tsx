import { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { SearchBar } from '@/components/SearchBar';
import { Filter } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { eventsData } from '@/data/mockData';

const exploreCategories = [
  { id: 'parties', name: 'Parties & Socials', image: 'https://images.pexels.com/photos/5926478/pexels-photo-5926478.jpeg' },
  { id: 'sports', name: 'Sports & Fitness', image: 'https://images.pexels.com/photos/6551133/pexels-photo-6551133.jpeg' },
  { id: 'academic', name: 'Academic Events', image: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg' },
  { id: 'networking', name: 'Networking', image: 'https://images.pexels.com/photos/6457521/pexels-photo-6457521.jpeg' },
  { id: 'arts', name: 'Arts & Culture', image: 'https://images.pexels.com/photos/1996153/pexels-photo-1996153.jpeg' },
  { id: 'volunteer', name: 'Volunteer', image: 'https://images.pexels.com/photos/6591156/pexels-photo-6591156.jpeg' },
];

const trendingLocations = [
  { id: 1, name: 'AMS Nest', eventsCount: 42 },
  { id: 2, name: 'Life Building', eventsCount: 28 },
  { id: 3, name: 'IKB Library', eventsCount: 15 },
  { id: 4, name: 'UBC Recreation', eventsCount: 34 },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for trending events - use top 3 by attendees
  const trendingEvents = [...eventsData]
    .sort((a, b) => b.attendees - a.attendees)
    .slice(0, 3);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
      </View>
      
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search events, clubs, or activities"
        rightIcon={<Filter size={20} color="#9BA3AF" />}
      />
      
      <FlatList
        data={[]}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={() => (
          <>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.categoriesGrid}>
              {exploreCategories.map((category, index) => (
                <Animated.View 
                  key={category.id}
                  entering={FadeInUp.delay(200 + index * 100).duration(500)}
                  style={styles.categoryItem}
                >
                  <Pressable 
                    style={styles.categoryButton}
                    onPress={() => {}}
                  >
                    <Image 
                      source={{ uri: category.image }} 
                      style={styles.categoryImage}
                    />
                    <View style={styles.categoryOverlay} />
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
            
            <Text style={[styles.sectionTitle, styles.trendingTitle]}>Trending Now</Text>
            {trendingEvents.map((event, index) => (
              <Animated.View
                key={`trending-${event.id}`}
                entering={FadeInUp.delay(600 + index * 100).duration(500)}
                style={styles.trendingItem}
              >
                <Pressable style={styles.trendingCard}>
                  <Image 
                    source={{ uri: event.image }}
                    style={styles.trendingImage}
                  />
                  <View style={styles.trendingContent}>
                    <Text style={styles.trendingEventTitle} numberOfLines={1}>{event.title}</Text>
                    <Text style={styles.trendingEventDetails}>{event.date} • {event.attendees} attending</Text>
                  </View>
                </Pressable>
              </Animated.View>
            ))}
            
            <Text style={[styles.sectionTitle, styles.locationsTitle]}>Popular Locations</Text>
            <View style={styles.locationsContainer}>
              {trendingLocations.map((location, index) => (
                <Animated.View
                  key={location.id}
                  entering={FadeInUp.delay(900 + index * 100).duration(500)}
                  style={styles.locationItem}
                >
                  <Pressable style={styles.locationButton}>
                    <Text style={styles.locationName}>{location.name}</Text>
                    <Text style={styles.locationCount}>{location.eventsCount} events</Text>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          </>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 16,
  },
  trendingTitle: {
    marginTop: 32,
  },
  locationsTitle: {
    marginTop: 32,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '48%',
    marginBottom: 16,
  },
  categoryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 120,
    justifyContent: 'flex-end',
  },
  categoryImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  categoryName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    padding: 12,
  },
  trendingItem: {
    marginBottom: 12,
  },
  trendingCard: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  trendingImage: {
    width: 80,
    height: 80,
  },
  trendingContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  trendingEventTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  trendingEventDetails: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9BA3AF',
  },
  locationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  locationItem: {
    width: '48%',
    marginBottom: 16,
  },
  locationButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    height: 90,
    justifyContent: 'center',
  },
  locationName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  locationCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9BA3AF',
  },
});