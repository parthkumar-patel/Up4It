import { PROFILE_CONSTRAINTS } from '../constants/collections';

/**
 * Get initials from a user's name for avatar fallback
 */
export function getInitials(name: string): string {
  if (!name) return '?';
  
  const names = name.trim().split(' ');
  
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

/**
 * Get a random color for avatar background
 */
export function getRandomAvatarColor(userId: string): string {
  const colors = [
    '#2563EB', // Blue
    '#7C3AED', // Purple
    '#DB2777', // Pink
    '#DC2626', // Red
    '#EA580C', // Orange
    '#D97706', // Amber
    '#65A30D', // Lime
    '#059669', // Emerald
    '#0891B2', // Cyan
    '#4F46E5', // Indigo
  ];
  
  // Use userId to deterministically select a color
  const hash = userId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Generate a data URL for preview before upload
 */
export function generateAvatarPreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!PROFILE_CONSTRAINTS.ALLOWED_AVATAR_TYPES.includes(file.type)) {
      reject(new Error('Invalid file type'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

/**
 * Validate avatar file
 */
export function validateAvatarFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }
  
  if (!PROFILE_CONSTRAINTS.ALLOWED_AVATAR_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Invalid file type. Please upload a JPG, PNG, WebP, or GIF.' 
    };
  }
  
  if (file.size > PROFILE_CONSTRAINTS.AVATAR_MAX_SIZE_MB * 1024 * 1024) {
    return { 
      valid: false, 
      error: `File too large. Maximum size is ${PROFILE_CONSTRAINTS.AVATAR_MAX_SIZE_MB}MB.` 
    };
  }
  
  return { valid: true };
} 