// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add custom resolver configuration for web platform
config.resolver = {
  ...config.resolver,
  resolveRequest: (context, moduleName, platform) => {
    // Check if the platform is web and the module is the problematic native one
    if (
      platform === 'web' &&
      moduleName.includes('react-native/Libraries/Utilities/codegenNativeCommands')
    ) {
      // Return a path to an empty module or a mock implementation if needed
      // For now, returning false might effectively block it, 
      // or point to an empty file if Metro requires a path.
      // Let's try blocking it first.
      return {
        type: 'empty',
      };
    }

    // Fallback to the default resolver for all other cases
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config; 