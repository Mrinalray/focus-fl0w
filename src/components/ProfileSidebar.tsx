import { useState } from 'react';
import { X, User, Edit2, Check } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from '@/types';

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateName: (name: string) => void;
  totalStudyTime: number;
}

const formatTotalTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

export const ProfileSidebar = ({ 
  isOpen, 
  onClose, 
  profile, 
  onUpdateName,
  totalStudyTime 
}: ProfileSidebarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);

  const handleSave = () => {
    onUpdateName(editName);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditName(profile.name);
      setIsEditing(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] bg-background border-border">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-foreground">Profile</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col items-center">
          {/* Avatar */}
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={profile.avatarUrl} alt={profile.name} />
            <AvatarFallback className="bg-primary/20 text-primary text-2xl">
              {profile.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Name */}
          <div className="flex items-center gap-2 mb-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-secondary border border-border rounded-lg px-3 py-1 text-foreground text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  className="p-1 hover:bg-secondary rounded-full transition-colors"
                >
                  <Check className="w-5 h-5 text-primary" />
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-foreground">{profile.name}</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:bg-secondary rounded-full transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="w-full mt-6 space-y-3">
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-sm text-muted-foreground">Total Study Time</p>
              <p className="text-2xl font-bold text-primary">{formatTotalTime(totalStudyTime)}</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
