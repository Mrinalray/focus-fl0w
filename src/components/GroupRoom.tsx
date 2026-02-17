import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Settings, Loader2 } from 'lucide-react';
import { StudyGroup } from '@/hooks/useGroups';
import { useGroupPresence, OnlineMember } from '@/hooks/useGroupPresence';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GroupSettings } from './GroupSettings';
import { MemberProfile } from './MemberProfile';

interface GroupRoomProps {
  group: StudyGroup;
  onBack: () => void;
  onLeave: () => void;
  onGroupUpdated?: () => void;
  onGroupDeleted?: () => void;
}

export const GroupRoom = ({ group, onBack, onLeave, onGroupUpdated, onGroupDeleted }: GroupRoomProps) => {
  const { user } = useAuth();
  const { members, loading, updatePresence, clearPresence } = useGroupPresence(group.id);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedMember, setSelectedMember] = useState<OnlineMember | null>(null);

  const isOwner = user?.id === group.createdBy;
  const studyingCount = members.filter(m => m.isStudying).length;

  useEffect(() => {
    updatePresence(false);
    return () => { clearPresence(); };
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const subjects = localStorage.getItem('focus-flow-subjects');
      if (subjects) {
        const parsed = JSON.parse(subjects);
        const activeSubject = parsed.find((s: any) => s.isRunning);
        if (activeSubject) {
          updatePresence(true, activeSubject.name);
        } else {
          updatePresence(false);
        }
      }
    };
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 2000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [updatePresence]);

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (showSettings && isOwner) {
    return (
      <GroupSettings
        group={group}
        memberCount={members.length}
        onBack={() => setShowSettings(false)}
        onGroupUpdated={onGroupUpdated}
        onGroupDeleted={onGroupDeleted}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Member Profile Drawer */}
      <MemberProfile
        member={selectedMember}
        open={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        isCurrentUser={selectedMember?.userId === user?.id}
      />
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="font-semibold">{group.name}</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="w-3 h-3" />
              {members.length}/{group.maxMembers} members
            </p>
          </div>
        </div>
        {isOwner && (
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
            <Settings className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Group intro */}
      {group.description && (
        <div className="px-4 py-2 border-b border-border">
          <p className="text-sm text-muted-foreground">{group.description}</p>
        </div>
      )}

      {/* Studying count */}
      <div className="px-4 py-2 border-b border-border">
        <p className="text-sm">
          Studying <span className="text-primary font-medium">{studyingCount} members</span>
        </p>
      </div>

      {/* Members Grid */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="p-4 grid grid-cols-4 gap-3">
            {members.map((member) => (
              <button
                key={member.userId}
                onClick={() => setSelectedMember(member)}
                className={`flex flex-col items-center p-2 rounded-lg border transition-colors ${
                  member.isStudying
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-border bg-card'
                } ${member.userId === user?.id ? 'ring-1 ring-primary' : ''}`}
              >
                {/* Desk icon */}
                <div className="relative w-14 h-14 flex items-center justify-center mb-1">
                  <svg width="48" height="40" viewBox="0 0 48 40" className="text-muted-foreground">
                    {/* Lamp */}
                    <line x1="12" y1="4" x2="12" y2="18" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M6 4 L12 4 L18 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <path d="M8 4 L12 12 L16 4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
                    {/* Desk */}
                    <rect x="4" y="22" width="40" height="2" rx="1" fill="currentColor" />
                    <line x1="8" y1="24" x2="8" y2="36" stroke="currentColor" strokeWidth="2" />
                    <line x1="40" y1="24" x2="40" y2="36" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  {member.isStudying && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
                  )}
                </div>
                <p className="text-xs font-medium truncate w-full text-center">
                  {member.displayName || 'Anon'}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {member.isStudying && member.currentSubject
                    ? member.currentSubject.slice(0, 8)
                    : '0:00:00'}
                </p>
              </button>
            ))}

            {members.length === 0 && (
              <div className="col-span-4 text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No members yet</p>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Tip */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-center text-muted-foreground">
          💡 Start a study timer in the Timer tab to show as "studying"
        </p>
      </div>
    </div>
  );
};
