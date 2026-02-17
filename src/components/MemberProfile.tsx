import { ArrowLeft, Bell } from 'lucide-react';
import { OnlineMember } from '@/hooks/useGroupPresence';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface MemberProfileProps {
  member: OnlineMember;
  onBack: () => void;
  isCurrentUser: boolean;
}

export const MemberProfile = ({ member, onBack, isCurrentUser }: MemberProfileProps) => {
  const { toast } = useToast();

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleWakeUp = () => {
    toast({
      title: 'Wake up sent! 🔔',
      description: `Nudge sent to ${member.displayName || 'this member'}`,
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-semibold">Member Profile</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={member.avatarUrl || undefined} />
            <AvatarFallback className="bg-muted text-muted-foreground text-2xl">
              {getInitials(member.displayName)}
            </AvatarFallback>
          </Avatar>
          {member.isStudying && (
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-primary rounded-full border-3 border-background" />
          )}
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold">
            {member.displayName || 'Anonymous'}
            {isCurrentUser && <span className="text-primary ml-1">(You)</span>}
          </h3>
          <p className={`text-sm mt-1 ${member.isStudying ? 'text-primary' : 'text-muted-foreground'}`}>
            {member.isStudying ? `📚 Studying${member.currentSubject ? ` - ${member.currentSubject}` : ''}` : 'Idle'}
          </p>
        </div>

        {/* Status card */}
        <div className="w-full bg-card rounded-xl border border-border p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className={`text-sm font-medium ${member.isStudying ? 'text-green-500' : 'text-muted-foreground'}`}>
              {member.isStudying ? 'Online - Studying' : 'Offline'}
            </span>
          </div>
          {member.currentSubject && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Subject</span>
              <span className="text-sm font-medium">{member.currentSubject}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Last seen</span>
            <span className="text-sm">{new Date(member.lastSeen).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Wake up button - only for other members */}
        {!isCurrentUser && (
          <Button onClick={handleWakeUp} variant="outline" className="gap-2 w-full">
            <Bell className="w-4 h-4" />
            Wake Up
          </Button>
        )}
      </div>
    </div>
  );
};
