import { Menu } from 'lucide-react';
import { formatDate } from '@/utils/time';

export const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3">
      <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
        <Menu className="w-6 h-6 text-foreground" />
      </button>
      <span className="text-foreground font-medium">{formatDate()}</span>
      <span className="text-muted-foreground text-sm">D-Day</span>
    </header>
  );
};
