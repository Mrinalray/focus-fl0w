import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '@/types';

const STORAGE_KEY = 'focus-flow-profile';

const getStoredProfile = (): UserProfile => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading profile:', e);
  }
  return { name: 'Student', avatarUrl: undefined };
};

const saveProfile = (profile: UserProfile) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile:', e);
  }
};

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const updateName = useCallback((name: string) => {
    setProfile(prev => ({ ...prev, name: name.trim() || 'Student' }));
  }, []);

  const updateAvatar = useCallback((avatarUrl: string) => {
    setProfile(prev => ({ ...prev, avatarUrl }));
  }, []);

  return {
    profile,
    updateName,
    updateAvatar,
  };
};
