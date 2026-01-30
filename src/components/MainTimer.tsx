import { HelpCircle } from 'lucide-react';
import { formatTime } from '@/utils/time';

interface MainTimerProps {
  totalTime: number;
  isActive: boolean;
}

export const MainTimer = ({ totalTime, isActive }: MainTimerProps) => {
  return (
    <div className="py-8 px-4 text-center">
      <div className="flex items-center justify-center gap-2">
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
        <p className="text-primary text-sm mt-2 fade-in">Timer running...</p>
      )}
    </div>
  );
};
