import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface OnlineMember {
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  isStudying: boolean;
  currentSubject: string | null;
  lastSeen: string;
}

export const useGroupPresence = (groupId: string | null) => {
  const { user, isAuthenticated } = useAuth();
  const [members, setMembers] = useState<OnlineMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    if (!groupId) {
      setMembers([]);
      setLoading(false);
      return;
    }

    // Fetch all members with their presence status
    const { data: memberships } = await supabase
      .from('group_memberships')
      .select('user_id')
      .eq('group_id', groupId);

    if (!memberships || memberships.length === 0) {
      setMembers([]);
      setLoading(false);
      return;
    }

    const userIds = memberships.map(m => m.user_id);

    // Fetch profiles
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('user_id', userIds);

    // Fetch presence
    const { data: presenceData } = await supabase
      .from('group_presence')
      .select('*')
      .eq('group_id', groupId);

    const presenceMap = new Map(presenceData?.map(p => [p.user_id, p]) || []);

    const membersWithPresence: OnlineMember[] = (profiles || []).map(profile => {
      const presence = presenceMap.get(profile.user_id);
      return {
        userId: profile.user_id,
        displayName: profile.display_name,
        avatarUrl: profile.avatar_url,
        isStudying: presence?.is_studying || false,
        currentSubject: presence?.current_subject || null,
        lastSeen: presence?.last_seen || new Date().toISOString(),
      };
    });

    // Sort: studying users first
    membersWithPresence.sort((a, b) => {
      if (a.isStudying && !b.isStudying) return -1;
      if (!a.isStudying && b.isStudying) return 1;
      return 0;
    });

    setMembers(membersWithPresence);
    setLoading(false);
  }, [groupId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!groupId) return;

    const channel = supabase
      .channel(`group-presence-${groupId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'group_presence',
          filter: `group_id=eq.${groupId}` 
        },
        () => {
          fetchMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId, fetchMembers]);

  const updatePresence = useCallback(async (isStudying: boolean, currentSubject?: string) => {
    if (!user || !groupId) return;

    const { data: existing } = await supabase
      .from('group_presence')
      .select('id')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      await supabase
        .from('group_presence')
        .update({
          is_studying: isStudying,
          current_subject: currentSubject || null,
          last_seen: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('group_presence')
        .insert({
          group_id: groupId,
          user_id: user.id,
          is_studying: isStudying,
          current_subject: currentSubject || null,
        });
    }
  }, [user, groupId]);

  const clearPresence = useCallback(async () => {
    if (!user || !groupId) return;

    await supabase
      .from('group_presence')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user.id);
  }, [user, groupId]);

  return {
    members,
    loading,
    updatePresence,
    clearPresence,
    refetch: fetchMembers,
  };
};
