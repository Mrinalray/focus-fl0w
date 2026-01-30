import { Home, Calendar, MoreHorizontal } from 'lucide-react';
import { BottomNavType } from '@/types';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  id: BottomNavType;
}

interface BottomNavProps {
  activeNav: BottomNavType;
  onNavChange: (nav: BottomNavType) => void;
}

const navItems: NavItem[] = [
  { icon: <Home className="w-6 h-6" />, label: 'Home', id: 'home' },
  { icon: <Calendar className="w-6 h-6" />, label: 'Calendar', id: 'calendar' },
  { icon: <MoreHorizontal className="w-6 h-6" />, label: 'More', id: 'more' },
];

export const BottomNav = ({ activeNav, onNavChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-inset-bottom">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavChange(item.id)}
            className={`flex flex-col items-center gap-1 py-2 px-4 transition-colors ${
              activeNav === item.id 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
