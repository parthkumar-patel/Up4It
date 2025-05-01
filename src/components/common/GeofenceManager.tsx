import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
    Alert,
    StyleSheet,
    Switch,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { location as locationService } from "@/lib/appwrite";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

// Define types for props
interface GeofenceManagerProps {
  initialCenter?: {
    latitude: number;
    longitude: number;
  };
  initialRadius?: number;
  onGeofenceCreated?: (geofence: any) => void;
  onGeofenceRemoved?: (geofenceId: string) => void;
  activityId?: string;
  style?: any;
}

/**
 * GeofenceManager component
 * Allows users to create and manage geofences for activities
 * Uses the location service to handle geofence creation and tracking
 */
const GeofenceManager: React.FC<GeofenceManagerProps> = ({
  initialCenter,
  initialRadius = 100,
  onGeofenceCreated,
  onGeofenceRemoved,
  activityId,
  style,
}) => {
  // State variables
  const [radius, setRadius] = useState(initialRadius);
  const [isEnabled, setIsEnabled] = useState(false);
  const [geofenceId, setGeofenceId] = useState<string | null>(null);
  const [center, setCenter] = useState(initialCenter);
  const [entryCount, setEntryCount] = useState(0);
  const [exitCount, setExitCount] = useState(0);

  // Check for existing geofences when the component mounts
  useEffect(() => {
    const checkExistingGeofences = async () => {
      try {
        const geofences = await locationService.getActiveGeofences();

        // Check if there's an existing geofence for this activity
        if (activityId) {
          for (const id in geofences) {
            if (geofences[id].activityId === activityId) {
              setGeofenceId(id);
              setIsEnabled(true);
              setRadius(geofences[id].radius);
              setCenter(geofences[id].center);
              break;
            }
          }
        }
      } catch (error) {
        console.error("Error checking existing geofences:", error);
      }
    };

    checkExistingGeofences();
  }, [activityId]);

  // Handle creating a new geofence
  const createGeofence = async () => {
    try {
      if (!center) {
        Alert.alert("Error", "No location available for geofence");
        return;
      }
      
      // Generate a unique ID if one doesn't exist
      const id = geofenceId || `geofence_${activityId || Date.now()}`;

      // Handle when someone enters the geofence
      const handleGeofenceEnter = (event: any) => {
        console.log("Geofence entered:", event);
        setEntryCount((prev) => prev + 1);

        // Provide haptic feedback when entering geofence
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Show an alert
        Alert.alert(
          "Geofence Entered",
          `You've entered the ${
            event.geofence.metadata.name || "activity"
          } area!`,
          [{ text: "OK" }]
        );
      };

      // Handle when someone exits the geofence
      const handleGeofenceExit = (event: any) => {
        console.log("Geofence exited:", event);
        setExitCount((prev) => prev + 1);

        // Provide haptic feedback when exiting geofence
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

        // Show an alert
        Alert.alert(
          "Geofence Exited",
          `You've left the ${event.geofence.metadata.name || "activity"} area!`,
          [{ text: "OK" }]
        );
      };

      // Create the geofence
      const success = await locationService.createGeofence(
        id,
        center,
        radius,
        handleGeofenceEnter,
        handleGeofenceExit,
        {
          activityId,
          metadata: {
            name: activityId ? `Activity ${activityId}` : "Custom Location",
            createdAt: new Date().toISOString(),
          },
        }
      );

      if (success) {
        setGeofenceId(id);

        // Call the callback if provided
        if (onGeofenceCreated && typeof onGeofenceCreated === "function") {
          onGeofenceCreated({
            id,
            center,
            radius,
            activityId,
          });
        }
      } else {
        // Show error alert
        Alert.alert(
          "Geofence Error",
          "Failed to create geofence. Please check your location settings and try again.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error creating geofence:", error);
      Alert.alert("Error", "Failed to create geofence");
    }
  };

  // Handle removing an existing geofence
  const removeGeofence = async () => {
    try {
      if (!geofenceId) return;

      const success = await locationService.removeGeofence(geofenceId);

      if (success) {
        setGeofenceId(null);

        // Call the callback if provided
        if (onGeofenceRemoved && typeof onGeofenceRemoved === "function") {
          onGeofenceRemoved(geofenceId);
        }
      } else {
        Alert.alert("Error", "Failed to remove geofence", [{ text: "OK" }]);
      }
    } catch (error) {
      console.error("Error removing geofence:", error);
    }
  };

  // Handle toggling the geofence on/off
  const toggleGeofence = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);

    if (newState) {
      createGeofence();
    } else {
      removeGeofence();
    }
  };

  // Handle updating the radius
  const updateRadius = (value: string) => {
    const newRadius = parseInt(value);
    if (!isNaN(newRadius) && newRadius > 0) {
      setRadius(newRadius);

      // If geofence is already active, remove and recreate it
      if (isEnabled && geofenceId) {
        removeGeofence().then(createGeofence);
      }
    }
  };

  return (
    <ThemedView style={[styles.container, style]}>
      <ThemedText style={styles.title}>Location Boundary</ThemedText>

      <View style={styles.row}>
        <ThemedText>Enable geofence</ThemedText>
        <Switch
          value={isEnabled}
          onValueChange={toggleGeofence}
          ios_backgroundColor="#ccc"
        />
      </View>

      <View style={styles.row}>
        <ThemedText>Radius (meters)</ThemedText>
        <TextInput
          style={styles.input}
          value={radius.toString()}
          onChangeText={updateRadius}
          keyboardType="number-pad"
          maxLength={4}
        />
      </View>

      {isEnabled && (
        <View style={styles.stats}>
          <ThemedView style={styles.statsItem}>
            <MaterialIcons name="login" size={20} color="#4285F4" />
            <ThemedText style={styles.statsText}>
              Entries: {entryCount}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.statsItem}>
            <MaterialIcons name="logout" size={20} color="#ea4335" />
            <ThemedText style={styles.statsText}>Exits: {exitCount}</ThemedText>
          </ThemedView>
        </View>
      )}

      {isEnabled && (
        <TouchableOpacity style={styles.buttonDanger} onPress={removeGeofence}>
          <ThemedText style={styles.buttonText}>Clear Geofence</ThemedText>
        </TouchableOpacity>
      )}

      <ThemedText style={styles.helpText}>
        A geofence creates a virtual boundary around your activity location.
        You'll be notified when people enter or leave this area.
      </ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    width: 80,
    textAlign: "center",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
    marginBottom: 16,
  },
  statsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
  },
  statsText: {
    marginLeft: 8,
  },
  buttonDanger: {
    backgroundColor: "#ea4335",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  helpText: {
    fontSize: 14,
    opacity: 0.7,
    fontStyle: "italic",
  },
});

export default GeofenceManager;
