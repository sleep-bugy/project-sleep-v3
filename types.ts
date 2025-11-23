
export type Language = 'en' | 'id' | 'hi' | 'ta' | 'ru' | 'th' | 'vi' | 'ar' | 'ka';

export interface Socials {
  github?: string;
  telegram?: string;
  twitter?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  country: string; // Using country code for emoji flag
  avatar: string;
  socials: Socials;
}

export type RomType = 'SleepOS' | 'AOSP' | 'Port';

export interface Device {
  id: string;
  brand: string;
  model: string;
  codename: string;
  chipset: string;
  imageUrl: string;
}

export interface ROM {
  id: string;
  deviceId: string;
  type: RomType;
  version: string;
  androidVersion: string;
  fileSize: string; // e.g., "2.1 GB"
  changelog: string;
  notes: string;
  isRecommended: boolean;
  downloadUrl: string;
  releaseDate: string;
}

export interface TeamApplication {
  id: string;
  name: string;
  email: string;
  role: string;
  country: string;
  experience: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface User {
  id: string;
  username: string;
  email: string;
}
