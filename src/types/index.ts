export interface Subject {
  id: string;
  name: string;
  timeSpent: number; // in seconds
  isRunning: boolean;
  createdAt: number;
}

export interface StudySession {
  id: string;
  subjectId: string;
  subjectName: string;
  startTime: number;
  endTime: number;
  duration: number; // in seconds
}

export interface UserProfile {
  name: string;
  avatarUrl?: string;
}

export type TabType = 'timer' | 'calendar' | 'insights' | 'planner';
export type BottomNavType = 'home' | 'calendar' | 'more';
