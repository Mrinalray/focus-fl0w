import { Clock, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
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

const formatFullDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric' 
  });
};

export const InsightsTab = ({ sessions, getTodaySessions }: InsightsTabProps) => {
  const todaySessions = getTodaySessions();
  const totalTodayTime = todaySessions.reduce((acc, s) => acc + s.duration, 0);
  const totalAllTime = sessions.reduce((acc, s) => acc + s.duration, 0);

  // Group sessions by date for session list
  const groupedSessions: Record<string, StudySession[]> = {};
  sessions.forEach(session => {
    const dateKey = formatSessionDate(session.startTime);
    if (!groupedSessions[dateKey]) {
      groupedSessions[dateKey] = [];
    }
    groupedSessions[dateKey].push(session);
  });

  // Calculate daily totals for the past 7 days
  const getDailyTotals = () => {
    const dailyTotals: { date: string; fullDate: string; total: number }[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dayStart = date.getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      
      const dayTotal = sessions
        .filter(s => s.startTime >= dayStart && s.startTime < dayEnd)
        .reduce((acc, s) => acc + s.duration, 0);
      
      dailyTotals.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: formatFullDate(date.getTime()),
        total: dayTotal,
      });
    }
    
    return dailyTotals;
  };

  const dailyTotals = getDailyTotals();
  const maxDailyTime = Math.max(...dailyTotals.map(d => d.total), 1);

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

      {/* Daily Summary Chart */}
      <div className="bg-card rounded-xl p-4 border border-border mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Last 7 Days
        </h3>
        <div className="flex items-end justify-between gap-1 h-24">
          {dailyTotals.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className="w-full bg-primary/20 rounded-t-sm relative overflow-hidden"
                style={{ height: '80px' }}
              >
                <div 
                  className={`absolute bottom-0 left-0 right-0 bg-primary transition-all ${
                    day.total > 0 ? 'timer-glow' : ''
                  }`}
                  style={{ 
                    height: `${(day.total / maxDailyTime) * 100}%`,
                    minHeight: day.total > 0 ? '4px' : '0'
                  }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{day.date}</span>
            </div>
          ))}
        </div>
        {/* Daily totals below chart */}
        <div className="flex justify-between mt-2 pt-2 border-t border-border/50">
          {dailyTotals.map((day, index) => (
            <div key={index} className="flex-1 text-center">
              <span className="text-[9px] text-muted-foreground/70">
                {day.total > 0 ? formatTime(day.total) : '-'}
              </span>
            </div>
          ))}
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
          {Object.entries(groupedSessions).map(([date, dateSessions]) => {
            const dayTotal = dateSessions.reduce((acc, s) => acc + s.duration, 0);
            return (
              <div key={date}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-medium text-primary">{date}</h4>
                  <span className="text-xs text-muted-foreground">
                    Total: {formatTime(dayTotal)}
                  </span>
                </div>
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
            );
          })}
        </div>
      )}
    </div>
  );
};
