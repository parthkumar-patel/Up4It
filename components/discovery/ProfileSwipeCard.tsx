import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS // To call functions on the JS thread from worklet
    ,



    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { ThemedText } from '../ThemedText'; // Adjust path as needed
// import { GlassView } from '../common/GlassView'; // Use this once created

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.9;
const CARD_HEIGHT = CARD_WIDTH * 1.5; // Adjust aspect ratio as needed
const SWIPE_THRESHOLD = screenWidth * 0.4; // Distance to trigger swipe
const ROTATION_MAX_DEGREES = 15;
const LIKE_OPACITY_THRESHOLD = screenWidth * 0.1;
const DISLIKE_OPACITY_THRESHOLD = -screenWidth * 0.1;

// TODO: Define proper type for userData
interface ProfileSwipeCardProps {
  userData: any;
  onSwipeLeft?: (userId: string) => void;
  onSwipeRight?: (userId: string) => void;
  index: number; // Index for stacking effect
}

const ProfileSwipeCard: React.FC<ProfileSwipeCardProps> = ({ 
  userData,
  onSwipeLeft,
  onSwipeRight,
  index // Receive index
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only allow gestures on the top card
      if (index !== 0) return;
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      rotation.value = interpolate(
        translateX.value,
        [-screenWidth / 2, screenWidth / 2],
        [-ROTATION_MAX_DEGREES, ROTATION_MAX_DEGREES],
        Extrapolation.CLAMP
      );
    })
    .onEnd((event) => {
      if (index !== 0) return;
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? 1 : -1;
        translateX.value = withSpring(direction * screenWidth * 1.5, { damping: 100, stiffness: 100 });
        rotation.value = withSpring(direction * ROTATION_MAX_DEGREES * 2, { damping: 100, stiffness: 100 });
        translateY.value = withSpring(event.translationY + (direction * 50), { damping: 100, stiffness: 100 }); 

        const userId = userData?.$id || userData?.userId || 'unknown';
        if (direction > 0 && onSwipeRight) {
          runOnJS(onSwipeRight)(userId);
        } else if (direction < 0 && onSwipeLeft) {
          runOnJS(onSwipeLeft)(userId);
        }
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotation.value = withSpring(0);
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    // Ensure index is a valid number, default to 0 otherwise
    const validIndex = typeof index === 'number' && !isNaN(index) ? index : 0;

    // Safeguard interpolation inputs
    const currentTranslateX = typeof translateX.value === 'number' && !isNaN(translateX.value) ? translateX.value : 0;
    const currentTranslateY = typeof translateY.value === 'number' && !isNaN(translateY.value) ? translateY.value : 0;
    const currentRotation = typeof rotation.value === 'number' && !isNaN(rotation.value) ? rotation.value : 0;

    const scale = interpolate(
      validIndex, 
      [0, 1, 2], 
      [1, 0.95, 0.9], 
      Extrapolation.CLAMP
    );

    const translateYStack = interpolate(
      validIndex,
      [0, 1, 2],
      [0, 20, 40], 
      Extrapolation.CLAMP
    );
    
    // Final transform values, ensuring they are numbers
    const finalTranslateX = validIndex === 0 ? currentTranslateX : 0;
    const finalTranslateY = validIndex === 0 ? currentTranslateY + translateYStack : translateYStack;
    const finalRotationDeg = validIndex === 0 ? `${currentRotation}deg` : '0deg';
    const finalScale = typeof scale === 'number' && !isNaN(scale) ? scale : 1;
    const finalZIndex = 100 - validIndex;

    return {
      zIndex: finalZIndex,
      transform: [
        { translateX: finalTranslateX }, 
        { translateY: finalTranslateY }, 
        { rotateZ: finalRotationDeg }, 
        { scale: finalScale }, 
      ],
    };
  });

  // Animated style for Like overlay
  const likeOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, LIKE_OPACITY_THRESHOLD, SWIPE_THRESHOLD / 1.5], // Start fade slightly right, full near threshold
      [0, 0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  // Animated style for Dislike overlay
  const dislikeOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD / 1.5, DISLIKE_OPACITY_THRESHOLD, 0], // Start fade slightly left, full near threshold
      [1, 0, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const defaultAvatar = "https://api.dicebear.com/7.x/initials/png?seed=?";

  // Placeholder data - replace with userData props
  const name = userData?.name || 'Jordan Lee';
  const age = userData?.age || 21;
  const university = userData?.university || 'University of BC';
  const bio = userData?.bio || 'Loves hiking, coffee, and exploring the city. Looking for study buddies or adventure partners!';
  const interests = userData?.interests || ['Hiking', 'Coffee', 'Photography', 'Coding'];
  const distance = userData?.distanceKm ? `${userData.distanceKm.toFixed(1)} km away` : 'Nearby';
  const photoUrl = userData?.photoUrls?.[0] || defaultAvatar;
  const currentActivity = userData?.currentActivity || 'Studying @ Irving'; // Placeholder

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.cardContainer, animatedCardStyle]}>
         {/* Like Overlay */}
        <Animated.View style={[styles.overlay, styles.likeOverlay, likeOverlayStyle]}>
          <MaterialIcons name="favorite" size={80} color="white" />
          <Text style={styles.overlayText}>LIKE</Text>
        </Animated.View>

        {/* Dislike Overlay */}
        <Animated.View style={[styles.overlay, styles.dislikeOverlay, dislikeOverlayStyle]}>
          <MaterialIcons name="close" size={80} color="white" />
          <Text style={styles.overlayText}>NOPE</Text>
        </Animated.View>

        {/* Card Content */}
        <BlurView intensity={80} tint="light" style={styles.blurContainer}> 
          {/* Image Section */}
          <Image
            source={{ uri: photoUrl }}
            style={styles.profileImage}
            contentFit="cover"
            transition={200}
          />

          {/* Info Section (Bento-ish Layout) */}
          <View style={styles.infoContainer}>
            {/* Top Row: Name, Age, Distance */}
            <View style={styles.infoRowTop}>
              <View style={styles.nameAgeContainer}>
                <ThemedText style={styles.nameText} numberOfLines={1}>{name}, {age}</ThemedText>
                <ThemedText style={styles.universityText} numberOfLines={1}>{university}</ThemedText>
              </View>
              <View style={styles.distanceContainer}>
                <MaterialIcons name="place" size={16} color="#888" />
                <ThemedText style={styles.distanceText}>{distance}</ThemedText>
              </View>
            </View>

            {/* Bio */}
            <ThemedText style={styles.bioText} numberOfLines={2}>{bio}</ThemedText>

            {/* Interests */}
            <View style={styles.interestsContainer}>
              {interests.slice(0, 4).map((interest: string, index: number) => (
                <View key={index} style={styles.interestTag}>
                  <ThemedText style={styles.interestText}>{interest}</ThemedText>
                </View>
              ))}
              {interests.length > 4 && (
                  <View key="more" style={styles.interestTagMore}>
                      <ThemedText style={styles.interestText}>+{interests.length - 4}</ThemedText>
                  </View>
              )}
            </View>

            {/* Current Activity */}
            <View style={styles.activityContainer}>
              <MaterialIcons name="directions-run" size={16} color="#888" /> 
              <ThemedText style={styles.activityText} numberOfLines={1}>{currentActivity}</ThemedText>
            </View>
          </View>
        </BlurView>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden', // Needed for BlurView/Image borderRadius
    backgroundColor: 'transparent', // Important for BlurView
    // Add shadow for depth (optional, adjust as needed)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    position: 'absolute', // Important for stacking later
  },
  blurContainer: {
    flex: 1,
  },
  profileImage: {
    width: '100%',
    height: '60%', // Adjust ratio as needed
  },
  infoContainer: {
    padding: 15,
    flex: 1, // Take remaining space
    justifyContent: 'space-around',
  },
  infoRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nameAgeContainer: {
    flex: 1, // Allow name to take space but wrap/truncate
    marginRight: 10,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  universityText: {
      fontSize: 12,
      opacity: 0.7,
      marginTop: 2,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4, // Align slightly with name
  },
  distanceText: {
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.8,
  },
  bioText: {
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 10,
    lineHeight: 18,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    gap: 5,
  },
  interestTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  interestTagMore: {
    backgroundColor: 'rgba(200, 200, 200, 0.2)', 
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  interestText: {
    fontSize: 11,
    fontWeight: '500',
    opacity: 0.9,
  },
  activityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto', // Push to bottom
    paddingTop: 5,
  },
  activityText: {
    fontSize: 13,
    marginLeft: 6,
    opacity: 0.8,
    flexShrink: 1, // Allow text to shrink if needed
  },
  // Overlay Styles
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20, // Match card border radius
    zIndex: 10, // Ensure overlay is above image/content
  },
  likeOverlay: {
    backgroundColor: 'rgba(0, 255, 0, 0.4)', // Semi-transparent green
  },
  dislikeOverlay: {
    backgroundColor: 'rgba(255, 0, 0, 0.4)', // Semi-transparent red
  },
  overlayText: {
      color: 'white',
      fontSize: 32,
      fontWeight: 'bold',
      marginTop: 10,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
  }
});

export default ProfileSwipeCard; 