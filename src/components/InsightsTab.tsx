import { Clock, Calendar, TrendingUp } from 'lucide-react';
import { StudySession } from '@/types';
import { formatTime } from '@/utils/time';

interface InsightsTabProps {
  sessions: StudySession[];
  getTodaySessions: () => StudySession[];
}

const formatSessionTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const formatSessionDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const InsightsTab = ({ sessions, getTodaySessions }: InsightsTabProps) => {
  const todaySessions = getTodaySessions();
  const totalTodayTime = todaySessions.reduce((acc, s) => acc + s.duration, 0);
  const totalAllTime = sessions.reduce((acc, s) => acc + s.duration, 0);

  // Group sessions by date
  const groupedSessions: Record<string, StudySession[]> = {};
  sessions.forEach(session => {
    const dateKey = formatSessionDate(session.startTime);
    if (!groupedSessions[dateKey]) {
      groupedSessions[dateKey] = [];
    }
    groupedSessions[dateKey].push(session);
  });

  return (
    <div className="flex-1 overflow-auto p-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
          <p className="text-xl font-bold text-foreground">{formatTime(totalTodayTime)}</p>
          <p className="text-xs text-muted-foreground">{todaySessions.length} sessions</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">All Time</span>
          </div>
          <p className="text-xl font-bold text-foreground">{formatTime(totalAllTime)}</p>
          <p className="text-xs text-muted-foreground">{sessions.length} sessions</p>
        </div>
      </div>

      {/* Session History */}
      <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Study Sessions
      </h3>

      {sessions.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">No study sessions recorded yet.</p>
          <p className="text-muted-foreground/60 text-xs mt-1">Start a timer to begin tracking!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedSessions).map(([date, dateSessions]) => (
            <div key={date}>
              <h4 className="text-xs font-medium text-primary mb-2">{date}</h4>
              <div className="space-y-2">
                {dateSessions.map(session => (
                  <div 
                    key={session.id}
                    className="bg-card rounded-lg p-3 border border-border fade-in"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground text-sm">{session.subjectName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatSessionTime(session.startTime)} - {formatSessionTime(session.endTime)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{formatTime(session.duration)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
