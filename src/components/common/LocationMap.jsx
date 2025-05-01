import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { location as locationService } from "@/lib/appwrite";
import { MAPBOX_CONFIG } from "@/lib/appwrite/config";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

/**
 * LocationMap component
 * Displays a map with the user's location and nearby users
 * Includes privacy controls and location permissions handling
 */
const LocationMap = ({
  onPermissionRequest,
  onNearbyUsersFound,
  radiusKm = 5,
  style,
  showControls = true,
}) => {
  // State variables
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState(null);

  // Ref for the map component
  const mapRef = useRef(null);

  // Check for location permission on component mount
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const permissionGranted = await locationService.hasLocationPermission();
        setHasPermission(permissionGranted);

        if (permissionGranted) {
          // If we have permission, get the current location
          getCurrentLocation();
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        setError("Failed to check location permission");
        setIsLoading(false);
        console.error("Error checking location permission:", err);
      }
    };

    checkPermission();
  }, []);

  // Get the user's current location
  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      const location = await locationService.getCurrentLocation(true);

      // Save the location to the database
      await locationService.saveUserLocation(location);

      setUserLocation(location);
      setError(null);

      // Find nearby users
      findNearbyUsers();
    } catch (err) {
      setError("Failed to get your location");
      console.error("Error getting current location:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Find users nearby the current location
  const findNearbyUsers = async () => {
    try {
      const users = await locationService.findUsersNearby(radiusKm);
      setNearbyUsers(users);

      // Call the callback if provided
      if (onNearbyUsersFound && typeof onNearbyUsersFound === "function") {
        onNearbyUsersFound(users);
      }
    } catch (err) {
      console.error("Error finding nearby users:", err);
    }
  };

  // Request location permission from the user
  const requestPermission = async () => {
    try {
      // If a callback is provided, call it before requesting permission
      if (onPermissionRequest && typeof onPermissionRequest === "function") {
        onPermissionRequest();
      }

      const permissionGranted =
        await locationService.requestLocationPermission();
      setHasPermission(permissionGranted);

      if (permissionGranted) {
        getCurrentLocation();
      }
    } catch (err) {
      setError("Failed to request location permission");
      console.error("Error requesting location permission:", err);
    }
  };

  // Refresh user location and nearby users
  const refreshLocation = () => {
    if (hasPermission) {
      getCurrentLocation();
    } else {
      requestPermission();
    }
  };

  // Center the map on the user's location
  const centerOnUser = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  // Clear location data (privacy feature)
  const clearLocationData = async () => {
    try {
      await locationService.clearLocationData();
      setUserLocation(null);
      setNearbyUsers([]);
      setHasPermission(false);
    } catch (err) {
      setError("Failed to clear location data");
      console.error("Error clearing location data:", err);
    }
  };

  // Initial map region - centers on Vancouver (UBC) or user's location if available
  const initialRegion = {
    latitude: userLocation
      ? userLocation.latitude
      : MAPBOX_CONFIG.DEFAULT_CENTER[1],
    longitude: userLocation
      ? userLocation.longitude
      : MAPBOX_CONFIG.DEFAULT_CENTER[0],
    latitudeDelta: 0.05, // Zoom level (smaller = more zoomed in)
    longitudeDelta: 0.05, // Zoom level
  };

  // Render permission request UI when permission hasn't been granted
  if (!hasPermission) {
    return (
      <ThemedView style={[styles.container, style]}>
        <ThemedText type="title" style={styles.permissionTitle}>
          Location Access
        </ThemedText>
        <ThemedText style={styles.permissionText}>
          To see nearby activities and students, we need access to your
          location. Your privacy is important - location data is automatically
          deleted after 24 hours.
        </ThemedText>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <ThemedText style={styles.buttonText}>Enable Location</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {/* Render markers for nearby users */}
        {nearbyUsers.map((user) => (
          <Marker
            key={user.$id}
            coordinate={{
              latitude: user.latitude,
              longitude: user.longitude,
            }}
            title={`${user.distanceKm.toFixed(1)} km away`}
          />
        ))}
      </MapView>

      {/* Map controls */}
      {showControls && (
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={refreshLocation}
          >
            <MaterialIcons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={centerOnUser}>
            <MaterialIcons name="my-location" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={clearLocationData}
          >
            <MaterialIcons name="delete" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Error display */}
      {error && (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  controls: {
    position: "absolute",
    right: 16,
    top: 16,
    flexDirection: "column",
    gap: 8,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4285F4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(255, 0, 0, 0.7)",
    padding: 8,
    borderRadius: 8,
  },
  errorText: {
    color: "#fff",
    textAlign: "center",
  },
  permissionTitle: {
    textAlign: "center",
    marginBottom: 16,
  },
  permissionText: {
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  permissionButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default LocationMap;
