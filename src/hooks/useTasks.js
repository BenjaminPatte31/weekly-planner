import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

/**
 * useTasks — fetches tasks for a given week_start + filter (personal or workspace),
 * and subscribes to real-time changes.
 *
 * @param {string} userId       – local UUID from localStorage
 * @param {string} weekStart    – ISO date string (Monday of the week)
 * @param {string|null} workspaceId – null → personal; string → workspace tasks
 */
export function useTasks(userId, weekStart, workspaceId) {
  const [tasks,   setTasks]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const channelRef = useRef(null)

  const fetchTasks = useCallback(async () => {
    if (!userId || !weekStart) return
    setLoading(true)
    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .eq('week_start', weekStart)

      if (workspaceId) {
        query = query.eq('workspace_id', workspaceId)
      } else {
        query = query.eq('user_id', userId).is('workspace_id', null)
      }

      const { data, error: err } = await query.order('start_hour', { ascending: true })
      if (err) throw err
      setTasks(data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [userId, weekStart, workspaceId])

  // Subscribe to realtime
  useEffect(() => {
    if (!userId || !weekStart) return

    fetchTasks()

    // Clean up previous subscription
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }

    const filter = workspaceId
      ? `workspace_id=eq.${workspaceId}`
      : `user_id=eq.${userId}`

    const channel = supabase
      .channel(`tasks:${weekStart}:${workspaceId || userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks', filter },
        () => fetchTasks()
      )
      .subscribe()

    channelRef.current = channel
    return () => { supabase.removeChannel(channel) }
  }, [userId, weekStart, workspaceId, fetchTasks])

  const addTask = useCallback(async (taskData) => {
    const { error: err } = await supabase.from('tasks').insert([{
      ...taskData,
      user_id:      userId,
      workspace_id: workspaceId || null,
      week_start:   weekStart,
    }])
    if (err) throw err
    await fetchTasks()
  }, [userId, weekStart, workspaceId, fetchTasks])

  const updateTask = useCallback(async (id, updates) => {
    const { error: err } = await supabase.from('tasks').update(updates).eq('id', id)
    if (err) throw err
    await fetchTasks()
  }, [fetchTasks])

  const deleteTask = useCallback(async (id) => {
    const { error: err } = await supabase.from('tasks').delete().eq('id', id)
    if (err) throw err
    await fetchTasks()
  }, [fetchTasks])

  const toggleDone = useCallback(async (id, current) => {
    await updateTask(id, { is_done: !current })
  }, [updateTask])

  return { tasks, loading, error, addTask, updateTask, deleteTask, toggleDone, refetch: fetchTasks }
}
