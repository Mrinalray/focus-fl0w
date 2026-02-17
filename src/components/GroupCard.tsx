import { Users, MessageSquare } from 'lucide-react';
import { StudyGroup } from '@/hooks/useGroups';
import { useAuth } from '@/hooks/useAuth';

interface GroupCardProps {
  group: StudyGroup;
  isMember: boolean;
  onJoin: () => void;
  onLeave: () => void;
  onEnter: () => void;
  onDelete: () => void;
}

export const GroupCard = ({ 
  group, 
  isMember, 
  onJoin, 
  onEnter,
}: GroupCardProps) => {
  const { user } = useAuth();
  const isFull = group.memberCount >= group.maxMembers;

  return (
    <button
      onClick={() => isMember ? onEnter() : !isFull && onJoin()}
      className="w-full text-left p-4 border-b border-border flex items-center justify-between hover:bg-secondary/30 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate">{group.name}</h3>
        <p className="text-sm text-muted-foreground mt-0.5 truncate">
          {group.description ? `${group.description} · ` : ''}
          {group.memberCount}/{group.maxMembers} people
          {group.onlineCount > 0 && (
            <span className="text-primary"> · {group.onlineCount} studying</span>
          )}
        </p>
      </div>
      <div className="ml-3 relative">
        <MessageSquare className="w-6 h-6 text-muted-foreground" />
      </div>
    </button>
  );
};
