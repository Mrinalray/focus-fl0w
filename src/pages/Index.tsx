import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { MainTimer } from '@/components/MainTimer';
import { TabBar } from '@/components/TabBar';
import { SubjectList } from '@/components/SubjectList';
import { AddSubjectButton } from '@/components/AddSubjectButton';
import { BottomNav } from '@/components/BottomNav';
import { PlannerTab } from '@/components/PlannerTab';
import { CalendarTab } from '@/components/CalendarTab';
import { InsightsTab } from '@/components/InsightsTab';
import { MoreTab } from '@/components/MoreTab';
import { useSubjects } from '@/hooks/useSubjects';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useProfile } from '@/hooks/useProfile';
import { useTodos } from '@/hooks/useTodos';
import { TabType, BottomNavType } from '@/types';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('timer');
  const [activeNav, setActiveNav] = useState<BottomNavType>('home');
  
  const { profile, updateName } = useProfile();
  const { 
    sessions, 
    startSession, 
    endSession, 
    getTodaySessions 
  } = useStudySessions();
  
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
  } = useTodos();

  const subjectOptions = useMemo(() => ({
    onTimerStart: startSession,
    onTimerStop: endSession,
  }), [startSession, endSession]);

  const {
    subjects,
    addSubject,
    deleteSubject,
    editSubject,
    toggleTimer,
    resetTimer,
    getTotalTime,
    activeSubjectId,
  } = useSubjects(subjectOptions);

  const todaySessions = getTodaySessions();
  const studyDates = sessions.map(s => s.startTime);

  const handleNavChange = (nav: BottomNavType) => {
    setActiveNav(nav);
    // When switching to calendar from bottom nav, also switch top tab
    if (nav === 'calendar') {
      setActiveTab('calendar');
    } else if (nav === 'home') {
      setActiveTab('timer');
    }
  };

  const renderContent = () => {
    // More tab overrides everything
    if (activeNav === 'more') {
      return <MoreTab />;
    }

    // Otherwise render based on active tab
    switch (activeTab) {
      case 'timer':
        return (
          <SubjectList
            subjects={subjects}
            onToggle={toggleTimer}
            onEdit={editSubject}
            onDelete={deleteSubject}
            onReset={resetTimer}
          />
        );
      case 'calendar':
        return <CalendarTab studyDates={studyDates} />;
      case 'insights':
        return <InsightsTab sessions={sessions} getTodaySessions={getTodaySessions} />;
      case 'planner':
        return (
          <PlannerTab
            todos={todos}
            onAdd={addTodo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
            onClearCompleted={clearCompleted}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        profile={profile} 
        onUpdateName={updateName}
        totalStudyTime={getTotalTime()}
      />
      
      {activeNav !== 'more' && (
        <>
          <MainTimer 
            totalTime={getTotalTime()} 
            isActive={!!activeSubjectId}
            todaySessions={todaySessions}
          />
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      )}
      
      <main className="flex-1 flex flex-col pb-20 overflow-hidden">
        {renderContent()}
      </main>

      {activeTab === 'timer' && activeNav !== 'more' && (
        <AddSubjectButton onAdd={addSubject} />
      )}
      
      <BottomNav activeNav={activeNav} onNavChange={handleNavChange} />
    </div>
  );
};

export default Index;
