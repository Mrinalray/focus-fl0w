import { useState } from 'react';
import { ArrowLeft, Trash2, Loader2, Users, ChevronRight } from 'lucide-react';
import { StudyGroup } from '@/hooks/useGroups';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface GroupSettingsProps {
  group: StudyGroup;
  memberCount: number;
  onBack: () => void;
  onGroupUpdated?: () => void;
  onGroupDeleted?: () => void;
}

export const GroupSettings = ({ group, memberCount, onBack, onGroupUpdated, onGroupDeleted }: GroupSettingsProps) => {
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description || '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await supabase
      .from('study_groups')
      .update({ name: name.trim(), description: description.trim() || null })
      .eq('id', group.id);
    setSaving(false);
    onGroupUpdated?.();
    onBack();
  };

  const handleDelete = async () => {
    setDeleting(true);
    // Delete presence, memberships, then group
    await supabase.from('group_presence').delete().eq('group_id', group.id);
    await supabase.from('group_memberships').delete().eq('group_id', group.id);
    await supabase.from('study_groups').delete().eq('id', group.id);
    setDeleting(false);
    onGroupDeleted?.();
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-semibold">Group Info/Settings</h2>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Group Leader Menu */}
        <div>
          <h3 className="text-sm font-medium text-primary mb-3">Group Leader Menu</h3>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            <div className="p-4">
              <label className="text-sm text-muted-foreground mb-1 block">Group Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                className="mt-1"
              />
            </div>
            <div className="p-4">
              <label className="text-sm text-muted-foreground mb-1 block">Description / Rules</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={200}
                placeholder="Group introduction or rules..."
                className="mt-1"
              />
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="text-sm">Capacity</span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                {group.maxMembers} people <ChevronRight className="w-4 h-4" />
              </span>
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="text-sm">Members</span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {memberCount}/{group.maxMembers}
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} disabled={!name.trim() || saving} className="w-full">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
        </Button>

        {/* Delete Group */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full gap-2">
              <Trash2 className="w-4 h-4" />
              Delete Group
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Group</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{group.name}" and remove all members. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
