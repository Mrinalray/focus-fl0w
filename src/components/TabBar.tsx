import { TabType } from '@/types';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: 'timer', label: 'Timer' },
  { id: 'books', label: 'Books' },
  { id: 'insights', label: 'Insights' },
  { id: 'planner', label: 'Planner' },
];

export const TabBar = ({ activeTab, onTabChange }: TabBarProps) => {
  return (
    <div className="flex border-b border-border">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-3 text-sm font-medium transition-all ${
            activeTab === tab.id ? 'tab-active' : 'tab-inactive'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
