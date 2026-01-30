import { CalendarDays } from 'lucide-react';
import { TabType } from '@/types';

interface PlaceholderTabProps {
  tab: TabType;
}

const tabConfig: Record<string, { icon: typeof CalendarDays; title: string; description: string }> = {
  planner: {
    icon: CalendarDays,
    title: 'Planner',
    description: 'Plan your study schedule and set goals',
  },
};

export const PlaceholderTab = ({ tab }: PlaceholderTabProps) => {
  if (tab === 'timer' || tab === 'calendar' || tab === 'insights') return null;
  
  const config = tabConfig[tab];
  if (!config) return null;
  
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
