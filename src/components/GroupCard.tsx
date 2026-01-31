import { Users, LogIn, LogOut, Trash2, ArrowRight } from 'lucide-react';
import { StudyGroup } from '@/hooks/useGroups';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
  onLeave, 
  onEnter,
  onDelete 
}: GroupCardProps) => {
  const { user } = useAuth();
  const isOwner = user?.id === group.createdBy;
  const isFull = group.memberCount >= group.maxMembers;

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{group.name}</h3>
            {group.description && (
              <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                {group.description}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {group.memberCount}/{group.maxMembers}
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${group.onlineCount > 0 ? 'bg-green-500' : 'bg-muted'}`} />
                {group.onlineCount} studying
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isMember ? (
              <>
                <Button 
                  size="sm" 
                  onClick={onEnter}
                  className="gap-1"
                >
                  Enter
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
                {isOwner ? (
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={onDelete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={onLeave}
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                )}
              </>
            ) : (
              <Button 
                size="sm" 
                variant="secondary"
                onClick={onJoin}
                disabled={isFull}
              >
                <LogIn className="w-4 h-4 mr-1" />
                {isFull ? 'Full' : 'Join'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
