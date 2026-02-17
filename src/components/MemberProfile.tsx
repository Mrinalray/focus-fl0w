import { useState } from 'react';
import { Bell, BarChart3, MoreVertical, Clock } from 'lucide-react';
import { OnlineMember } from '@/hooks/useGroupPresence';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
} from '@/components/ui/drawer';

interface MemberProfileProps {
  member: OnlineMember | null;
  open: boolean;
  onClose: () => void;
  isCurrentUser: boolean;
}

export const MemberProfile = ({ member, open, onClose, isCurrentUser }: MemberProfileProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'nudge' | 'insights'>('insights');

  if (!member) return null;

  const handleWakeUp = () => {
    toast({
      title: 'Wake up sent! 🔔',
      description: `Nudge sent to ${member.displayName || 'this member'}`,
    });
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startTime = member.isStudying ? new Date(member.lastSeen) : todayStart;

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="pb-0">
          <div className="flex items-center gap-3">
            {/* Desk icon */}
            <div className="w-14 h-14 flex items-center justify-center">
              <svg width="48" height="40" viewBox="0 0 48 40" className="text-muted-foreground">
                <line x1="12" y1="4" x2="12" y2="18" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 4 L12 4 L18 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M8 4 L12 12 L16 4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
                <rect x="4" y="22" width="40" height="2" rx="1" fill="currentColor" />
                <line x1="8" y1="24" x2="8" y2="36" stroke="currentColor" strokeWidth="2" />
                <line x1="40" y1="24" x2="40" y2="36" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-1 justify-center">
              {!isCurrentUser && (
                <Button
                  size="sm"
                  variant={activeTab === 'nudge' ? 'default' : 'outline'}
                  onClick={() => {
                    setActiveTab('nudge');
                    handleWakeUp();
                  }}
                  className="gap-1 rounded-full text-xs"
                >
                  😴 Nudge
                </Button>
              )}
              <Button
                size="sm"
                variant={activeTab === 'insights' ? 'default' : 'outline'}
                onClick={() => setActiveTab('insights')}
                className="gap-1 rounded-full text-xs"
              >
                <BarChart3 className="w-3 h-3" />
                Insights
              </Button>
            </div>

            <Button variant="ghost" size="icon" className="shrink-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-6 pt-3">
          {/* Name */}
          <h3 className="text-xl font-bold">
            {member.displayName || 'Anonymous'}
            {isCurrentUser && <span className="text-primary text-sm ml-1">(You)</span>}
          </h3>
          {member.currentSubject && (
            <p className="text-sm text-muted-foreground mt-1">
              📚 {member.currentSubject}
            </p>
          )}

          {/* Study Stats Card */}
          <div className="bg-card rounded-xl border border-border p-4 mt-4">
            {/* Total time */}
            <p className="text-3xl font-mono font-bold">
              {member.isStudying ? formatTime(0) : '0:00:00'}
            </p>

            {/* Start / Finish */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-xs text-primary">Start</p>
                <p className="text-lg font-medium">
                  {member.isStudying
                    ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '0:00'}
                </p>
              </div>
              <div>
                <p className="text-xs text-primary">Finish</p>
                <p className="text-lg font-medium">
                  {member.isStudying ? '--:--' : '0:00'}
                </p>
              </div>
            </div>

            {/* Max Focus / Current Subject */}
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <p className="text-xs text-muted-foreground">Max Focus</p>
                <p className="text-base font-medium">0:00:00</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Current Subject</p>
                <p className="text-base font-medium">
                  {member.currentSubject || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Status info */}
          <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Last seen: {new Date(member.lastSeen).toLocaleTimeString()}</span>
            </div>
            <span className={member.isStudying ? 'text-primary' : ''}>
              {member.isStudying ? '● Online' : '○ Offline'}
            </span>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
