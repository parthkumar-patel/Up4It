/**
 * Mock data service
 * Provides sample data for development and testing
 */

// Sample user interests categories
export const interestCategories = [
  'Sports', 'Music', 'Movies', 'Books', 'Travel', 'Food', 
  'Art', 'Photography', 'Technology', 'Gaming', 'Fitness', 
  'Outdoors', 'Cooking', 'Dancing', 'Languages', 'Pets'
];

// Sample interests for each category
export const interestsByCategory = {
  Sports: ['Soccer', 'Basketball', 'Tennis', 'Swimming', 'Volleyball', 'Hiking', 'Cycling', 'Running', 'Yoga'],
  Music: ['Rock', 'Pop', 'Hip Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country', 'Indie'],
  Movies: ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Documentaries', 'Animation', 'Thriller'],
  Books: ['Fiction', 'Non-Fiction', 'Fantasy', 'Science Fiction', 'Mystery', 'Biography', 'History', 'Poetry'],
  Travel: ['Backpacking', 'Road Trips', 'Luxury Travel', 'Solo Travel', 'Adventure Travel', 'Cultural Experiences'],
  Food: ['Italian Cuisine', 'Asian Cuisine', 'Vegan', 'BBQ', 'Baking', 'Coffee', 'Wine Tasting', 'Street Food'],
  Art: ['Painting', 'Drawing', 'Sculpture', 'Digital Art', 'Street Art', 'Museum Visits', 'Art History'],
  Photography: ['Portrait', 'Landscape', 'Street Photography', 'Wildlife', 'Macro', 'Black & White', 'Film'],
  Technology: ['Programming', 'AI', 'Blockchain', 'Gadgets', 'Web Development', 'Mobile Apps', 'Robotics'],
  Gaming: ['Video Games', 'Board Games', 'Card Games', 'Role-Playing Games', 'Strategy Games', 'Puzzles'],
  Fitness: ['Weightlifting', 'CrossFit', 'HIIT', 'Pilates', 'Dance Fitness', 'Martial Arts'],
  Outdoors: ['Camping', 'Fishing', 'Hunting', 'Kayaking', 'Rock Climbing', 'Birdwatching', 'Stargazing'],
  Cooking: ['Baking', 'Grilling', 'Meal Prep', 'Gourmet Cooking', 'International Cuisine', 'Desserts'],
  Dancing: ['Salsa', 'Ballroom', 'Hip Hop', 'Contemporary', 'Ballet', 'Folk Dancing'],
  Languages: ['Spanish', 'French', 'Mandarin', 'German', 'Japanese', 'Italian', 'Russian', 'Arabic'],
  Pets: ['Dogs', 'Cats', 'Birds', 'Fish', 'Reptiles', 'Small Animals']
};

// Sample user bios
export const sampleBios = [
  "UBC grad student looking for coffee buddies to explore Vancouver's best cafes. Always down for deep conversations!",
  "Engineering major by day, amateur chef by night. Let's grab dinner and swap recipes!",
  "Love hiking the local trails and taking photographs of the stunning Vancouver scenery. Looking for outdoor adventure partners!",
  "Film studies student searching for friends to attend movie screenings and festivals with. Popcorn's on me!",
  "International student from Tokyo exploring Vancouver for the first time. Would love to meet locals who can show me around!",
  "Computer science major with a passion for indie game development. Looking for playtesters and gaming friends!",
  "Psychology student conducting research on friendship formation. Also genuinely looking to make new friends on campus!",
  "Marine biology enthusiast! If you love the ocean as much as I do, we'll get along just fine.",
  "Sustainability advocate looking to connect with like-minded individuals. Let's make the world a better place together!",
  "Transfer student from Toronto adjusting to west coast life. Coffee enthusiast and avid reader seeking study partners."
];

// Sample profile photos (use placeholder URLs for development)
export const samplePhotos = [
  "https://source.unsplash.com/random/400x600/?portrait,person,1",
  "https://source.unsplash.com/random/400x600/?portrait,person,2",
  "https://source.unsplash.com/random/400x600/?portrait,person,3",
  "https://source.unsplash.com/random/400x600/?portrait,person,4",
  "https://source.unsplash.com/random/400x600/?portrait,person,5",
  "https://source.unsplash.com/random/400x600/?portrait,person,6",
  "https://source.unsplash.com/random/400x600/?portrait,person,7",
  "https://source.unsplash.com/random/400x600/?portrait,person,8",
  "https://source.unsplash.com/random/400x600/?portrait,person,9",
  "https://source.unsplash.com/random/400x600/?portrait,person,10"
];

// Sample user names
export const sampleNames = [
  "Alex Chan", "Jordan Lee", "Taylor Kim", "Morgan Singh", "Casey Patel",
  "Avery Wong", "Riley Chen", "Jamie Garcia", "Sam Nguyen", "Quinn Sharma",
  "Parker Li", "Reese Gupta", "Dakota Smith", "Kai Johnson", "Skyler Brown"
];

// Function to generate a random user profile
export const generateRandomUser = (id) => {
  // Get 2-4 random interests
  const numInterests = Math.floor(Math.random() * 3) + 2;
  const interests = [];
  
  for (let i = 0; i < numInterests; i++) {
    // Select a random category
    const category = interestCategories[Math.floor(Math.random() * interestCategories.length)];
    // Select a random interest from that category
    const categoryInterests = interestsByCategory[category];
    const interest = categoryInterests[Math.floor(Math.random() * categoryInterests.length)];
    
    // Add if not already in the list
    if (!interests.includes(interest)) {
      interests.push(interest);
    }
  }
  
  // Generate 1-3 profile photos
  const numPhotos = Math.floor(Math.random() * 3) + 1;
  const photos = [];
  
  for (let i = 0; i < numPhotos; i++) {
    const photoIndex = Math.floor(Math.random() * samplePhotos.length);
    photos.push(samplePhotos[photoIndex]);
  }
  
  // Generate random age between 18-30
  const age = Math.floor(Math.random() * 13) + 18;
  
  return {
    id: id.toString(),
    name: sampleNames[Math.floor(Math.random() * sampleNames.length)],
    age,
    bio: sampleBios[Math.floor(Math.random() * sampleBios.length)],
    interests,
    photos,
    location: {
      latitude: 49.2827 + (Math.random() * 0.05 - 0.025), // Random location near UBC (Vancouver)
      longitude: -123.1207 + (Math.random() * 0.05 - 0.025)
    },
    distance: Math.floor(Math.random() * 5) + 1 // Random distance 1-5 km
  };
};

// Generate sample users
export const generateSampleUsers = (count = 10) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(generateRandomUser(i + 1));
  }
  return users;
};

// Export a default set of users
export const sampleUsers = generateSampleUsers(15); 