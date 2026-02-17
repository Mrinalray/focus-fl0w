import { useState } from 'react';
import { Users, Plus, LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGroups, StudyGroup } from '@/hooks/useGroups';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GroupCard } from './GroupCard';
import { GroupRoom } from './GroupRoom';
import { LoginPrompt } from './LoginPrompt';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const GroupsTab = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { groups, myGroups, loading, createGroup, joinGroup, leaveGroup, deleteGroup } = useGroups();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    
    setCreating(true);
    const result = await createGroup(newGroupName.trim(), newGroupDescription.trim());
    setCreating(false);
    
    if (!result.error) {
      setNewGroupName('');
      setNewGroupDescription('');
      setShowCreateDialog(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    await joinGroup(groupId);
  };

  const handleLeaveGroup = async (groupId: string) => {
    await leaveGroup(groupId);
    if (selectedGroup?.id === groupId) {
      setSelectedGroup(null);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    await deleteGroup(groupId);
    if (selectedGroup?.id === groupId) {
      setSelectedGroup(null);
    }
  };

  const handleEnterGroup = (group: StudyGroup) => {
    setSelectedGroup(group);
  };

  if (selectedGroup) {
    return (
      <GroupRoom 
        group={selectedGroup} 
        onBack={() => setSelectedGroup(null)}
        onLeave={() => handleLeaveGroup(selectedGroup.id)}
        onGroupUpdated={() => {
          setSelectedGroup(null);
          // refetch handled by realtime
        }}
        onGroupDeleted={() => {
          setSelectedGroup(null);
        }}
      />
    );
  }

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold">My Groups</h2>
        
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="w-4 h-4" />
              Create
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Study Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                maxLength={50}
              />
              <Input
                placeholder="Description (optional)"
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                Max 30 members per group
              </p>
              <Button 
                onClick={handleCreateGroup} 
                disabled={!newGroupName.trim() || creating}
                className="w-full"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Group'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : groups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No study groups yet</p>
              <p className="text-sm">Create one to start studying with friends!</p>
            </div>
          ) : (
            groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                isMember={myGroups.includes(group.id)}
                onJoin={() => handleJoinGroup(group.id)}
                onLeave={() => handleLeaveGroup(group.id)}
                onEnter={() => handleEnterGroup(group)}
                onDelete={() => handleDeleteGroup(group.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
