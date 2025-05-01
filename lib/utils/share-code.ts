/**
 * Utility for generating and validating share codes
 * Share codes are random word pairs used for in-person verification 
 * between matched users.
 */

// Common, recognizable words for share codes
const FIRST_WORDS = [
  'happy', 'sunny', 'blue', 'red', 'green', 'yellow', 'purple', 'orange',
  'swift', 'brave', 'calm', 'clever', 'eager', 'friendly', 'gentle', 'honest',
  'jolly', 'kind', 'lively', 'mighty', 'nice', 'polite', 'proud', 'quiet',
  'rapid', 'smooth', 'tender', 'wise', 'young', 'golden', 'silver', 'crystal'
];

const SECOND_WORDS = [
  'tiger', 'eagle', 'dolphin', 'panda', 'koala', 'falcon', 'jaguar', 'penguin',
  'rabbit', 'turtle', 'whale', 'zebra', 'bear', 'lion', 'wolf', 'fox',
  'mountain', 'ocean', 'river', 'forest', 'desert', 'canyon', 'island', 'valley',
  'planet', 'star', 'comet', 'moon', 'cloud', 'storm', 'rain', 'snow'
];

/**
 * Generate a random 6-character share code
 * @returns A 6-character alphanumeric code
 */
export function generateShareCode(): string {
  // Characters to use in the share code (omitting easily confused characters like 0/O, 1/I/l)
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  
  let result = '';
  const charactersLength = characters.length;
  
  // Generate 6 random characters
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
}

/**
 * Validate a share code format
 * @param code The share code to validate
 * @returns True if the code is valid, false otherwise
 */
export function validateShareCode(code: string): boolean {
  // Check if the code is 6 characters and contains only allowed characters
  const regex = /^[A-Z2-9]{6}$/;
  return regex.test(code);
}

/**
 * Format a share code for display (e.g., "ABC-123")
 * @param code The share code to format
 * @returns Formatted share code
 */
export function formatShareCode(code: string): string {
  if (!code || code.length !== 6) {
    return code;
  }
  
  // Format as XXX-XXX
  return `${code.substring(0, 3)}-${code.substring(3)}`;
}

/**
 * Check if two share codes match
 * @param code1 First share code
 * @param code2 Second share code
 * @returns True if the codes match, false otherwise
 */
export function doShareCodesMatch(code1: string, code2: string): boolean {
  return code1 === code2;
}

/**
 * Generate a new share code and schedule it to change after a certain period
 * @param matchId Match document ID
 * @param databaseId Appwrite database ID
 * @param matchCollectionId Appwrite match collection ID
 * @param updateFn Function to update the match document
 * @returns The generated share code
 */
export async function generateAndScheduleShareCode(
  matchId: string,
  databaseId: string,
  matchCollectionId: string,
  updateFn: (matchId: string, data: any) => Promise<any>
): Promise<string> {
  // Generate a fresh share code
  const shareCode = generateShareCode();
  
  // Update the match with the new share code
  await updateFn(matchId, { shareCode });
  
  return shareCode;
} 