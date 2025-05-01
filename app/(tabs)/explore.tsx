import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import NearbyUserCard from '@/components/common/NearbyUserCard';
import Spinner from '@/components/common/Spinner';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { location } from '@/lib/appwrite';
// Conditionally import native components
let GeofenceManager, LocationMap;
if (Platform.OS !== 'web') {
  GeofenceManager = require('@/components/common/GeofenceManager').default;
  LocationMap = require('@/components/common/LocationMap').default;
}

export default function ExploreScreen() {
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [activeGeofence, setActiveGeofence] = useState(null);

  // Handle when nearby users are found
  const handleNearbyUsersFound = (users) => {
    setNearbyUsers(users || []);
    setIsLoading(false);
  };

  // Handle permission request UI preparation
  const handlePermissionRequest = () => {
    setIsLoading(true);
  };

  // Handle selecting a user
  const handleUserSelect = (user) => {
    // Navigate to user profile or open chat
    console.log('Selected user:', user);
    // For now, we'll just log it, but this would navigate to user profile
    // router.push(`/profile/${user.userId}`);
  };

  // Manual refresh of nearby users
  const refreshNearbyUsers = async () => {
    setIsLoading(true);
    try {
      const hasPermission = await location.hasLocationPermission();
      if (hasPermission) {
        const userLocation = await location.getCurrentLocation();
        setUserLocation(userLocation);
        
        const users = await location.findUsersNearby(5, userLocation);
        setNearbyUsers(users || []);
      }
    } catch (error) {
      console.error('Error refreshing nearby users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Callback when a geofence is created
  const handleGeofenceCreated = (geofence) => {
    setActiveGeofence(geofence);
    console.log('Geofence created:', geofence);
  };

  // Callback when a geofence is removed
  const handleGeofenceRemoved = (geofenceId) => {
    setActiveGeofence(null);
    console.log('Geofence removed:', geofenceId);
  };

  // Set map ready state after a delay and get initial location
  useEffect(() => {
    const initializeMap = async () => {
      // Only try to get location on native platforms
      if (Platform.OS !== 'web') {
        try {
          const hasPermission = await location.hasLocationPermission();
          if (hasPermission) {
            const userLoc = await location.getCurrentLocation();
            setUserLocation(userLoc);
          }
        } catch (error) {
          console.error('Error getting initial location:', error);
        }
      }
      
      // Set map as ready (even if location isn't available)
      setTimeout(() => setMapReady(true), 500);
    };
    
    initializeMap();
    
    // Clean up geofences when component unmounts (only on native)
    return () => {
      if (Platform.OS !== 'web' && activeGeofence && !activeGeofence.activityId) {
        location.removeGeofence(activeGeofence.id);
      }
    };
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <View style={styles.headerOverlay}>
          <MaterialIcons 
            name="explore" 
            size={100} 
            color="#808080" 
            style={styles.headerImage} 
          />
        </View>
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore Nearby</ThemedText>
      </ThemedView>
      
      <ThemedText style={styles.subtitle}>
        Find students and activities near you, with privacy by default.
      </ThemedText>
      
      {/* Map and Geofence Section - Native Only */}
      {Platform.OS !== 'web' ? (
        <>
          {mapReady && LocationMap && (
            <LocationMap
              style={styles.map}
              radiusKm={5}
              onPermissionRequest={handlePermissionRequest}
              onNearbyUsersFound={handleNearbyUsersFound}
            />
          )}
          
          {userLocation && GeofenceManager && (
            <GeofenceManager
              initialCenter={userLocation}
              initialRadius={100}
              onGeofenceCreated={handleGeofenceCreated}
              onGeofenceRemoved={handleGeofenceRemoved}
              style={styles.geofenceManager}
            />
          )}
        </>
      ) : (
        <ThemedView style={styles.webPlaceholder}>
          <MaterialIcons name="map" size={48} color="#808080" />
          <ThemedText style={styles.webPlaceholderText}>
            Map view is not available on the web version.
          </ThemedText>
        </ThemedView>
      )}
      
      {/* Privacy Information */}
      <Collapsible 
        title="Privacy Information" 
        initialCollapsed={true}
        style={styles.collapsibleSection}
      >
        <ThemedText>
          Your location is only stored for 24 hours and is only shared with other students
          when you're actively using the app. You can delete your location data at any time.
        </ThemedText>
        <ThemedText style={styles.privacyPoint}>
          • Location is automatically deleted after 24 hours
        </ThemedText>
        <ThemedText style={styles.privacyPoint}>
          • Only university students can see your location
        </ThemedText>
        <ThemedText style={styles.privacyPoint}>
          • You can delete all location data with one tap
        </ThemedText>
        <ThemedText style={styles.privacyPoint}>
          • You control when your location is shared
        </ThemedText>
      </Collapsible>
      
      {/* Nearby Students Section */}
      <ThemedView style={styles.sectionHeader}>
        <ThemedText type="subtitle">Nearby Students</ThemedText>
        {!isLoading && Platform.OS !== 'web' && (
          <MaterialIcons 
            name="refresh" 
            size={24} 
            color="#4285F4" 
            style={styles.refreshIcon} 
            onPress={refreshNearbyUsers}
          />
        )}
      </ThemedView>
      
      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Spinner size="large" color="#4285F4" />
          <ThemedText>Looking for students nearby...</ThemedText>
        </View>
      )}
      
      {/* Nearby users list */}
      {!isLoading && (
        <>
          {nearbyUsers.length > 0 ? (
            <FlatList
              data={nearbyUsers}
              keyExtractor={(item) => item.$id}
              renderItem={({ item }) => (
                <NearbyUserCard
                  user={item}
                  onPress={handleUserSelect}
                />
              )}
              scrollEnabled={false}
              style={styles.usersList}
            />
          ) : (
            <ThemedView style={styles.emptyContainer}>
              <MaterialIcons name="people" size={48} color="#808080" />
              <ThemedText style={styles.emptyText}>
                No students found nearby.
              </ThemedText>
              {Platform.OS !== 'web' && (
                <ThemedText style={styles.emptySubtext}>
                  Try expanding your search radius or checking back later.
                </ThemedText>
              )}
            </ThemedView>
          )}
        </>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerOverlay: {
    position: 'absolute',
    bottom: -60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerImage: {
    opacity: 0.5,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
  },
  map: {
    height: 300,
    width: '100%',
    borderRadius: 12,
    marginBottom: 16,
  },
  geofenceManager: {
    marginBottom: 16,
  },
  webPlaceholder: {
    height: 300, // Match map height
    width: '100%',
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Use a light grey background
  },
  webPlaceholderText: {
    marginTop: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
  collapsibleSection: {
    marginBottom: 16,
  },
  privacyPoint: {
    marginLeft: 8,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  refreshIcon: {
    padding: 4,
  },
  usersList: {
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
