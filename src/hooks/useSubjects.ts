import { useState, useEffect, useCallback } from 'react';
import { Subject } from '@/types';

const STORAGE_KEY = 'focus-flow-subjects';

const getStoredSubjects = (): Subject[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const subjects = JSON.parse(stored);
      // Reset all running states on load
      return subjects.map((s: Subject) => ({ ...s, isRunning: false }));
    }
  } catch (e) {
    console.error('Error loading subjects:', e);
  }
  return [];
};

const saveSubjects = (subjects: Subject[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
  } catch (e) {
    console.error('Error saving subjects:', e);
  }
};

interface UseSubjectsOptions {
  onTimerStart?: (subjectId: string, subjectName: string) => void;
  onTimerStop?: () => void;
}

export const useSubjects = (options?: UseSubjectsOptions) => {
  const [subjects, setSubjects] = useState<Subject[]>(getStoredSubjects);
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);

  // Save to localStorage whenever subjects change
  useEffect(() => {
    saveSubjects(subjects);
  }, [subjects]);

  // Timer tick effect
  useEffect(() => {
    if (!activeSubjectId) return;

    const interval = setInterval(() => {
      setSubjects(prev => 
        prev.map(subject => 
          subject.id === activeSubjectId && subject.isRunning
            ? { ...subject, timeSpent: subject.timeSpent + 1 }
            : subject
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSubjectId]);

  const addSubject = useCallback((name: string) => {
    const newSubject: Subject = {
      id: crypto.randomUUID(),
      name: name.trim(),
      timeSpent: 0,
      isRunning: false,
      createdAt: Date.now(),
    };
    setSubjects(prev => [...prev, newSubject]);
  }, []);

  const deleteSubject = useCallback((id: string) => {
    if (activeSubjectId === id) {
      options?.onTimerStop?.();
      setActiveSubjectId(null);
    }
    setSubjects(prev => prev.filter(s => s.id !== id));
  }, [activeSubjectId, options]);

  const editSubject = useCallback((id: string, newName: string) => {
    setSubjects(prev => 
      prev.map(s => s.id === id ? { ...s, name: newName.trim() } : s)
    );
  }, []);

  const toggleTimer = useCallback((id: string) => {
    setSubjects(prev => {
      const subject = prev.find(s => s.id === id);
      if (!subject) return prev;

      // If starting this timer, stop all others
      if (!subject.isRunning) {
        // End previous session if any
        if (activeSubjectId) {
          options?.onTimerStop?.();
        }
        
        setActiveSubjectId(id);
        options?.onTimerStart?.(id, subject.name);
        
        return prev.map(s => ({
          ...s,
          isRunning: s.id === id ? true : false
        }));
      } else {
        // Stopping this timer
        options?.onTimerStop?.();
        setActiveSubjectId(null);
        return prev.map(s => 
          s.id === id ? { ...s, isRunning: false } : s
        );
      }
    });
  }, [activeSubjectId, options]);

  const resetTimer = useCallback((id: string) => {
    if (activeSubjectId === id) {
      options?.onTimerStop?.();
      setActiveSubjectId(null);
    }
    setSubjects(prev => 
      prev.map(s => s.id === id ? { ...s, timeSpent: 0, isRunning: false } : s)
    );
  }, [activeSubjectId, options]);

  const getTotalTime = useCallback(() => {
    return subjects.reduce((acc, s) => acc + s.timeSpent, 0);
  }, [subjects]);

  const getActiveSubject = useCallback(() => {
    return subjects.find(s => s.id === activeSubjectId) || null;
  }, [subjects, activeSubjectId]);

  return {
    subjects,
    addSubject,
    deleteSubject,
    editSubject,
    toggleTimer,
    resetTimer,
    getTotalTime,
    getActiveSubject,
    activeSubjectId,
  };
};
