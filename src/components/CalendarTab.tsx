import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarTabProps {
  studyDates?: number[]; // timestamps of days with study sessions
}

export const CalendarTab = ({ studyDates = [] }: CalendarTabProps) => {
  const [selectedMonth, setSelectedMonth] = useState(0); // January = 0
  const year = 2026;

  const getDaysInMonth = (month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const hasStudySession = (day: number, month: number) => {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    const dayStart = date.getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    
    return studyDates.some(d => d >= dayStart && d < dayEnd);
  };

  const isToday = (day: number, month: number) => {
    const today = new Date();
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === day;
  };

  const renderMonth = (month: number) => {
    const daysInMonth = getDaysInMonth(month);
    const firstDay = getFirstDayOfMonth(month);
    const days = [];

    // Empty cells for days before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const hasSession = hasStudySession(day, month);
      const todayClass = isToday(day, month);
      
      days.push(
        <div
          key={day}
          className={`w-8 h-8 flex items-center justify-center text-xs rounded-full transition-all ${
            todayClass 
              ? 'bg-primary text-primary-foreground font-bold' 
              : hasSession 
                ? 'bg-primary/20 text-primary' 
                : 'text-foreground hover:bg-secondary'
          }`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="flex-1 overflow-auto p-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setSelectedMonth(prev => Math.max(0, prev - 1))}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          disabled={selectedMonth === 0}
        >
          <ChevronLeft className={`w-5 h-5 ${selectedMonth === 0 ? 'text-muted-foreground/50' : 'text-foreground'}`} />
        </button>
        <h2 className="text-lg font-semibold text-foreground">
          {MONTHS[selectedMonth]} {year}
        </h2>
        <button
          onClick={() => setSelectedMonth(prev => Math.min(11, prev + 1))}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          disabled={selectedMonth === 11}
        >
          <ChevronRight className={`w-5 h-5 ${selectedMonth === 11 ? 'text-muted-foreground/50' : 'text-foreground'}`} />
        </button>
      </div>

      {/* Current Month Calendar */}
      <div className="bg-card rounded-xl p-4 mb-6 border border-border">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(day => (
            <div key={day} className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground font-medium">
              {day}
            </div>
          ))}
        </div>
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {renderMonth(selectedMonth)}
        </div>
      </div>

      {/* All Months Overview */}
      <h3 className="text-sm font-medium text-muted-foreground mb-3">All Months</h3>
      <div className="grid grid-cols-3 gap-2">
        {MONTHS.map((month, index) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(index)}
            className={`p-3 rounded-lg text-sm font-medium transition-all ${
              selectedMonth === index
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-foreground hover:bg-secondary border border-border'
            }`}
          >
            {month.slice(0, 3)}
          </button>
        ))}
      </div>
    </div>
  );
};
