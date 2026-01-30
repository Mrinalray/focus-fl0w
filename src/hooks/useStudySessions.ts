import { useState, useEffect, useCallback } from 'react';
import { StudySession } from '@/types';

const STORAGE_KEY = 'focus-flow-sessions';

const getStoredSessions = (): StudySession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading sessions:', e);
  }
  return [];
};

const saveSessions = (sessions: StudySession[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('Error saving sessions:', e);
  }
};

export const useStudySessions = () => {
  const [sessions, setSessions] = useState<StudySession[]>(getStoredSessions);
  const [activeSession, setActiveSession] = useState<{ subjectId: string; subjectName: string; startTime: number } | null>(null);

  // Save to localStorage whenever sessions change
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  const startSession = useCallback((subjectId: string, subjectName: string) => {
    setActiveSession({
      subjectId,
      subjectName,
      startTime: Date.now(),
    });
  }, []);

  const endSession = useCallback(() => {
    if (!activeSession) return;

    const endTime = Date.now();
    const duration = Math.floor((endTime - activeSession.startTime) / 1000);

    // Only save sessions longer than 5 seconds
    if (duration >= 5) {
      const newSession: StudySession = {
        id: crypto.randomUUID(),
        subjectId: activeSession.subjectId,
        subjectName: activeSession.subjectName,
        startTime: activeSession.startTime,
        endTime,
        duration,
      };
      setSessions(prev => [newSession, ...prev]);
    }

    setActiveSession(null);
  }, [activeSession]);

  const getTodaySessions = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();
    
    return sessions.filter(s => s.startTime >= todayStart);
  }, [sessions]);

  const getSessionsByDate = useCallback((date: Date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    return sessions.filter(s => s.startTime >= dayStart.getTime() && s.startTime <= dayEnd.getTime());
  }, [sessions]);

  const clearAllSessions = useCallback(() => {
    setSessions([]);
  }, []);

  return {
    sessions,
    activeSession,
    startSession,
    endSession,
    getTodaySessions,
    getSessionsByDate,
    clearAllSessions,
  };
};
