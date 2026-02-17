import { useState } from 'react';
import { X, Edit2, Check, LogOut, LogIn, ChevronRight, User, Moon, Globe, Shield, Info } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserProfile } from '@/types';
import { useAuth } from '@/hooks/useAuth';

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
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
};

export const ProfileSidebar = ({ 
  isOpen, 
  onClose, 
  profile, 
  onUpdateName,
  totalStudyTime 
}: ProfileSidebarProps) => {
  const { user, profile: authProfile, isAuthenticated, signInWithGoogle, signOut } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [statusMessage, setStatusMessage] = useState('');
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  const handleSaveName = () => {
    onUpdateName(editName);
    setIsEditingName(false);
  };

  const displayName = isAuthenticated && authProfile?.displayName 
    ? authProfile.displayName 
    : profile.name;
    
  const avatarUrl = isAuthenticated && authProfile?.avatarUrl 
    ? authProfile.avatarUrl 
    : profile.avatarUrl;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[320px] bg-background border-border p-0 overflow-auto">
        <SheetHeader className="px-4 py-3 border-b border-border">
          <SheetTitle className="text-foreground text-center">Settings</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col">
          {/* Profile Avatar Section */}
          <div className="flex flex-col items-center py-5 border-b border-border">
            <Avatar className="w-20 h-20 mb-3">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="bg-primary/20 text-primary text-xl">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold text-foreground">{displayName}</h2>
            {isAuthenticated && user?.email && (
              <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
            )}
            <div className="mt-2 bg-primary/10 rounded-full px-3 py-1">
              <p className="text-xs text-primary font-medium">
                📚 Total: {formatTotalTime(totalStudyTime)}
              </p>
            </div>
          </div>

          {/* Account Settings */}
          <div className="px-4 py-3">
            <div className="bg-card rounded-xl border border-border divide-y divide-border">
              {/* Nickname */}
              <div className="p-3 flex items-center justify-between">
                {isEditingName ? (
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName();
                        if (e.key === 'Escape') setIsEditingName(false);
                      }}
                      className="h-8 text-sm"
                      autoFocus
                    />
                    <Button size="sm" variant="ghost" onClick={handleSaveName}>
                      <Check className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm">Nickname</span>
                    <button
                      onClick={() => !isAuthenticated && setIsEditingName(true)}
                      className="flex items-center gap-1 text-sm text-muted-foreground"
                    >
                      {displayName}
                      {!isAuthenticated && <ChevronRight className="w-4 h-4" />}
                    </button>
                  </>
                )}
              </div>

              {/* Status Message */}
              <div className="p-3 flex items-center justify-between">
                {isEditingStatus ? (
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      value={statusMessage}
                      onChange={(e) => setStatusMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === 'Escape') setIsEditingStatus(false);
                      }}
                      placeholder="Set a status..."
                      className="h-8 text-sm"
                      autoFocus
                    />
                    <Button size="sm" variant="ghost" onClick={() => setIsEditingStatus(false)}>
                      <Check className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm">Status Message</span>
                    <button
                      onClick={() => setIsEditingStatus(true)}
                      className="flex items-center gap-1 text-sm text-muted-foreground"
                    >
                      {statusMessage || 'Not set'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Category */}
              <div className="p-3 flex items-center justify-between">
                <span className="text-sm">Category</span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  Other <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="px-4 pb-3">
            <div className="bg-card rounded-xl border border-border divide-y divide-border">
              <div className="p-3 flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <Moon className="w-4 h-4 text-muted-foreground" />
                  Theme Settings
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  Dark <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>

          {/* App Info */}
          <div className="px-4 pb-3">
            <div className="bg-card rounded-xl border border-border divide-y divide-border">
              <div className="p-3 flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  Privacy Policy
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <Info className="w-4 h-4 text-muted-foreground" />
                  App Version
                </span>
                <span className="text-sm text-muted-foreground">1.0.0</span>
              </div>
            </div>
          </div>

          {/* Auth Actions */}
          <div className="px-4 pb-3">
            <div className="bg-card rounded-xl border border-border divide-y divide-border">
              {isAuthenticated ? (
                <button
                  onClick={signOut}
                  className="p-3 w-full text-left text-sm text-destructive flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="p-3 w-full text-left text-sm text-primary flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign in with Google
                </button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
