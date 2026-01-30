export interface Subject {
  id: string;
  name: string;
  timeSpent: number; // in seconds
  isRunning: boolean;
  createdAt: number;
}

export type TabType = 'timer' | 'books' | 'insights' | 'planner';
