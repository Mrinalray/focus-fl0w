import { useState } from 'react';
import { Menu } from 'lucide-react';
import { formatDate } from '@/utils/time';
import { ProfileSidebar } from '@/components/ProfileSidebar';
import { UserProfile } from '@/types';

interface HeaderProps {
  profile: UserProfile;
  onUpdateName: (name: string) => void;
  totalStudyTime: number;
}

export const Header = ({ profile, onUpdateName, totalStudyTime }: HeaderProps) => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3">
        <button 
          onClick={() => setShowProfile(true)}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>
        <span className="text-foreground font-medium">{formatDate()}</span>
        <span className="text-muted-foreground text-sm">D-Day</span>
      </header>

      <ProfileSidebar
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        profile={profile}
        onUpdateName={onUpdateName}
        totalStudyTime={totalStudyTime}
      />
    </>
  );
};
