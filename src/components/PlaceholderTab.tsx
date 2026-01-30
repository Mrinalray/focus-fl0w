import { BookOpen, BarChart3, CalendarDays } from 'lucide-react';
import { TabType } from '@/types';

interface PlaceholderTabProps {
  tab: TabType;
}

const tabConfig = {
  books: {
    icon: BookOpen,
    title: 'Books',
    description: 'Track your reading progress and book collection',
  },
  insights: {
    icon: BarChart3,
    title: 'Insights',
    description: 'View your study statistics and progress charts',
  },
  planner: {
    icon: CalendarDays,
    title: 'Planner',
    description: 'Plan your study schedule and set goals',
  },
};

export const PlaceholderTab = ({ tab }: PlaceholderTabProps) => {
  if (tab === 'timer') return null;
  
  const config = tabConfig[tab];
  const Icon = config.icon;

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center fade-in">
        <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">{config.title}</h2>
        <p className="text-muted-foreground text-sm max-w-[250px]">
          {config.description}
        </p>
        <p className="text-muted-foreground/60 text-xs mt-4">
          Coming soon...
        </p>
      </div>
    </div>
  );
};
