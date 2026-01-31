import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface StudyGroup {
  id: string;
  name: string;
  description: string | null;
  createdBy: string | null;
  maxMembers: number;
  createdAt: string;
  memberCount: number;
  onlineCount: number;
}

export interface GroupMember {
  id: string;
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  isStudying: boolean;
  currentSubject: string | null;
  lastSeen: string;
}

export const useGroups = () => {
  const { user, isAuthenticated } = useAuth();
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [myGroups, setMyGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    
    // Fetch all groups
    const { data: groupsData, error } = await supabase
      .from('study_groups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching groups:', error);
      setLoading(false);
      return;
    }

    // Fetch member counts and online counts for each group
    const groupsWithCounts = await Promise.all(
      (groupsData || []).map(async (group) => {
        const { count: memberCount } = await supabase
          .from('group_memberships')
          .select('*', { count: 'exact', head: true })
          .eq('group_id', group.id);

        const { count: onlineCount } = await supabase
          .from('group_presence')
          .select('*', { count: 'exact', head: true })
          .eq('group_id', group.id)
          .eq('is_studying', true);

        return {
          id: group.id,
          name: group.name,
          description: group.description,
          createdBy: group.created_by,
          maxMembers: group.max_members,
          createdAt: group.created_at,
          memberCount: memberCount || 0,
          onlineCount: onlineCount || 0,
        };
      })
    );

    setGroups(groupsWithCounts);
    setLoading(false);
  }, []);

  const fetchMyGroups = useCallback(async () => {
    if (!user) {
      setMyGroups([]);
      return;
    }

    const { data } = await supabase
      .from('group_memberships')
      .select('group_id')
      .eq('user_id', user.id);

    setMyGroups((data || []).map(m => m.group_id));
  }, [user]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyGroups();
    }
  }, [isAuthenticated, fetchMyGroups]);

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('groups-presence')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'group_presence' },
        () => {
          fetchGroups();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'group_memberships' },
        () => {
          fetchGroups();
          fetchMyGroups();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchGroups, fetchMyGroups]);

  const createGroup = useCallback(async (name: string, description?: string) => {
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('study_groups')
      .insert({
        name,
        description: description || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    // Auto-join the created group
    await joinGroup(data.id);
    await fetchGroups();
    
    return { data };
  }, [user]);

  const joinGroup = useCallback(async (groupId: string) => {
    if (!user) return { error: 'Not authenticated' };

    // Check if group is full
    const group = groups.find(g => g.id === groupId);
    if (group && group.memberCount >= group.maxMembers) {
      return { error: 'Group is full (max 30 members)' };
    }

    const { error } = await supabase
      .from('group_memberships')
      .insert({
        group_id: groupId,
        user_id: user.id,
      });

    if (error) {
      if (error.code === '23505') {
        return { error: 'Already a member' };
      }
      return { error: error.message };
    }

    await fetchMyGroups();
    await fetchGroups();
    return {};
  }, [user, groups, fetchMyGroups, fetchGroups]);

  const leaveGroup = useCallback(async (groupId: string) => {
    if (!user) return { error: 'Not authenticated' };

    // First remove presence
    await supabase
      .from('group_presence')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user.id);

    // Then remove membership
    const { error } = await supabase
      .from('group_memberships')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user.id);

    if (error) {
      return { error: error.message };
    }

    await fetchMyGroups();
    await fetchGroups();
    return {};
  }, [user, fetchMyGroups, fetchGroups]);

  const deleteGroup = useCallback(async (groupId: string) => {
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
      .from('study_groups')
      .delete()
      .eq('id', groupId)
      .eq('created_by', user.id);

    if (error) {
      return { error: error.message };
    }

    await fetchGroups();
    return {};
  }, [user, fetchGroups]);

  return {
    groups,
    myGroups,
    loading,
    createGroup,
    joinGroup,
    leaveGroup,
    deleteGroup,
    refetch: fetchGroups,
  };
};
