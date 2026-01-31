import { useEffect } from 'react';
import { ArrowLeft, Users, LogOut, Loader2 } from 'lucide-react';
import { StudyGroup } from '@/hooks/useGroups';
import { useGroupPresence, OnlineMember } from '@/hooks/useGroupPresence';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface GroupRoomProps {
  group: StudyGroup;
  onBack: () => void;
  onLeave: () => void;
}

export const GroupRoom = ({ group, onBack, onLeave }: GroupRoomProps) => {
  const { user } = useAuth();
  const { members, loading, updatePresence, clearPresence } = useGroupPresence(group.id);

  // Update presence when entering/leaving room
  useEffect(() => {
    updatePresence(false);
    
    return () => {
      clearPresence();
    };
  }, []);

  // Listen for local timer changes
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

    // Check initial state
    handleStorageChange();

    // Listen for changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also poll for changes (localStorage doesn't fire events in same tab)
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

  const studyingMembers = members.filter(m => m.isStudying);
  const idleMembers = members.filter(m => !m.isStudying);

  return (
    <div className="flex-1 flex flex-col">
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
              {members.length} members
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onLeave} className="gap-1">
          <LogOut className="w-4 h-4" />
          Leave
        </Button>
      </div>

      {/* Members List */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Studying Now Section */}
            {studyingMembers.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-primary flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Studying Now ({studyingMembers.length})
                </h3>
                <div className="space-y-2">
                  {studyingMembers.map((member) => (
                    <MemberRow 
                      key={member.userId} 
                      member={member} 
                      isCurrentUser={member.userId === user?.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Idle/Offline Section */}
            {idleMembers.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Members ({idleMembers.length})
                </h3>
                <div className="space-y-2">
                  {idleMembers.map((member) => (
                    <MemberRow 
                      key={member.userId} 
                      member={member}
                      isCurrentUser={member.userId === user?.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {members.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
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
          💡 Start a study timer in the Timer tab to show as "studying" to group members
        </p>
      </div>
    </div>
  );
};

interface MemberRowProps {
  member: OnlineMember;
  isCurrentUser: boolean;
}

const MemberRow = ({ member, isCurrentUser }: MemberRowProps) => {
  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${
      member.isStudying ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/50'
    }`}>
      <div className="relative">
        <Avatar className="w-10 h-10">
          <AvatarImage src={member.avatarUrl || undefined} />
          <AvatarFallback className="bg-muted text-muted-foreground">
            {getInitials(member.displayName)}
          </AvatarFallback>
        </Avatar>
        {member.isStudying && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">
          {member.displayName || 'Anonymous'}
          {isCurrentUser && <span className="text-primary ml-1">(You)</span>}
        </p>
        {member.isStudying && member.currentSubject && (
          <p className="text-xs text-primary truncate">
            📚 Studying {member.currentSubject}
          </p>
        )}
        {!member.isStudying && (
          <p className="text-xs text-muted-foreground">Idle</p>
        )}
      </div>
    </div>
  );
};
