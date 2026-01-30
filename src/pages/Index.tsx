import { useState } from 'react';
import { Header } from '@/components/Header';
import { MainTimer } from '@/components/MainTimer';
import { TabBar } from '@/components/TabBar';
import { SubjectList } from '@/components/SubjectList';
import { AddSubjectButton } from '@/components/AddSubjectButton';
import { BottomNav } from '@/components/BottomNav';
import { PlaceholderTab } from '@/components/PlaceholderTab';
import { useSubjects } from '@/hooks/useSubjects';
import { TabType } from '@/types';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('timer');
  const {
    subjects,
    addSubject,
    deleteSubject,
    editSubject,
    toggleTimer,
    resetTimer,
    getTotalTime,
    activeSubjectId,
  } = useSubjects();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <MainTimer totalTime={getTotalTime()} isActive={!!activeSubjectId} />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 flex flex-col pb-20 overflow-hidden">
        {activeTab === 'timer' ? (
          <SubjectList
            subjects={subjects}
            onToggle={toggleTimer}
            onEdit={editSubject}
            onDelete={deleteSubject}
            onReset={resetTimer}
          />
        ) : (
          <PlaceholderTab tab={activeTab} />
        )}
      </main>

      {activeTab === 'timer' && <AddSubjectButton onAdd={addSubject} />}
      <BottomNav />
    </div>
  );
};

export default Index;
