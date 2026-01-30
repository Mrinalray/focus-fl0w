import { HelpCircle } from 'lucide-react';
import { formatTime } from '@/utils/time';
import { DayTimeline } from '@/components/DayTimeline';
import { StudySession } from '@/types';

interface MainTimerProps {
  totalTime: number;
  isActive: boolean;
  todaySessions: StudySession[];
}

export const MainTimer = ({ totalTime, isActive, todaySessions }: MainTimerProps) => {
  return (
    <div className="py-6 px-4">
      <div className="flex items-center justify-center gap-2 mb-4">
        <h1 
          className={`timer-font text-6xl font-semibold text-foreground tracking-tight ${
            isActive ? 'timer-glow timer-active' : ''
          }`}
        >
          {formatTime(totalTime)}
        </h1>
        <button className="p-1 hover:bg-secondary rounded-full transition-colors">
          <HelpCircle className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
      {isActive && (
        <p className="text-primary text-sm text-center mb-4 fade-in">Timer running...</p>
      )}
      
      {/* 24-Hour D-Day Timeline */}
      <DayTimeline sessions={todaySessions} />
    </div>
  );
};
