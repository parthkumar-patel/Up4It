export interface UserProfile {
  $id?: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
  preferences?: {
    savedLocations?: string[];
    theme?: 'light' | 'dark' | 'system';
    notifications?: boolean;
    [key: string]: unknown;
  };
}

export interface ProfileUpdateData {
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  preferences?: Record<string, unknown>;
}

export interface ProfileFormData {
  displayName: string;
  bio?: string;
  avatar?: File | null;
} 