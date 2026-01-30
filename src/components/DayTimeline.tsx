import { StudySession } from '@/types';

interface DayTimelineProps {
  sessions: StudySession[];
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const formatHour = (hour: number): string => {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
};

export const DayTimeline = ({ sessions }: DayTimelineProps) => {
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();

  // Check if there's any study activity in a given hour
  const hasStudyInHour = (hour: number): boolean => {
    const today = new Date();
    today.setHours(hour, 0, 0, 0);
    const hourStart = today.getTime();
    const hourEnd = hourStart + 60 * 60 * 1000;

    return sessions.some(session => {
      return (session.startTime < hourEnd && session.endTime > hourStart);
    });
  };

  // Get study percentage for an hour (0-100)
  const getStudyPercentage = (hour: number): number => {
    const today = new Date();
    today.setHours(hour, 0, 0, 0);
    const hourStart = today.getTime();
    const hourEnd = hourStart + 60 * 60 * 1000;

    let studyMs = 0;
    sessions.forEach(session => {
      const overlapStart = Math.max(session.startTime, hourStart);
      const overlapEnd = Math.min(session.endTime, hourEnd);
      if (overlapEnd > overlapStart) {
        studyMs += overlapEnd - overlapStart;
      }
    });

    return Math.min(100, Math.round((studyMs / (60 * 60 * 1000)) * 100));
  };

  return (
    <div className="w-full py-2">
      <p className="text-xs text-muted-foreground mb-2 px-1">24-Hour Study Timeline</p>
      <div className="flex gap-0.5 h-8 rounded-lg overflow-hidden bg-secondary/50">
        {HOURS.map(hour => {
          const isCurrentHour = hour === currentHour;
          const studyPercent = getStudyPercentage(hour);
          const hasStudy = studyPercent > 0;

          return (
            <div
              key={hour}
              className={`flex-1 relative transition-all ${
                isCurrentHour 
                  ? 'ring-2 ring-primary ring-inset shadow-[0_0_10px_rgba(249,115,22,0.5)]' 
                  : ''
              }`}
              title={`${formatHour(hour)}${hasStudy ? ` - ${studyPercent}% studied` : ''}`}
            >
              {/* Study fill */}
              <div 
                className={`absolute bottom-0 left-0 right-0 transition-all ${
                  hasStudy ? 'bg-primary' : ''
                } ${isCurrentHour && hasStudy ? 'timer-glow' : ''}`}
                style={{ height: `${studyPercent}%` }}
              />
              
              {/* Current time indicator */}
              {isCurrentHour && (
                <div 
                  className="absolute left-0 right-0 h-0.5 bg-primary"
                  style={{ 
                    top: `${((60 - currentMinute) / 60) * 100}%`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Hour labels */}
      <div className="flex justify-between mt-1 px-0.5">
        <span className="text-[8px] text-muted-foreground">12AM</span>
        <span className="text-[8px] text-muted-foreground">6AM</span>
        <span className="text-[8px] text-muted-foreground">12PM</span>
        <span className="text-[8px] text-muted-foreground">6PM</span>
        <span className="text-[8px] text-muted-foreground">12AM</span>
      </div>
    </div>
  );
};
