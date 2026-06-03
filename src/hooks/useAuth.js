import { useState, useEffect } from 'react'

const USER_KEY      = 'wp_user'
const WORKSPACES_KEY = 'wp_workspaces'

function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
}

export function useAuth() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY)
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch (_) { localStorage.removeItem(USER_KEY) }
    }
  }, [])

  const login = (name) => {
    const u = { id: generateId(), name: name.trim() }
    localStorage.setItem(USER_KEY, JSON.stringify(u))
    setUser(u)
    return u
  }

  const logout = () => {
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  return { user, login, logout }
}

/**
 * useWorkspaces — manages workspaces in localStorage + Supabase.
 * For the free-tier demo, we persist workspace list locally and
 * load tasks from Supabase using the workspace id.
 */
export function useWorkspaces(userId) {
  const [workspaces, setWorkspaces] = useState([])

  useEffect(() => {
    if (!userId) return
    const stored = localStorage.getItem(WORKSPACES_KEY + '_' + userId)
    if (stored) {
      try { setWorkspaces(JSON.parse(stored)) } catch (_) {}
    }
  }, [userId])

  const persist = (list) => {
    setWorkspaces(list)
    localStorage.setItem(WORKSPACES_KEY + '_' + userId, JSON.stringify(list))
  }

  const createWorkspace = (name, emoji = '🗂️') => {
    const ws = {
      id:        generateId(),
      name:      name.trim(),
      emoji,
      createdBy: userId,
      members:   [userId],
      createdAt: new Date().toISOString(),
    }
    persist([...workspaces, ws])
    return ws
  }

  const joinWorkspace = (code) => {
    // code = workspace id (share via URL / copy)
    const existing = workspaces.find(w => w.id === code)
    if (existing) return existing // already member
    const ws = { id: code, name: 'Workspace partagé', emoji: '🤝', createdBy: null, members: [userId], createdAt: new Date().toISOString() }
    persist([...workspaces, ws])
    return ws
  }

  const deleteWorkspace = (id) => {
    persist(workspaces.filter(w => w.id !== id))
  }

  const updateWorkspace = (id, patch) => {
    persist(workspaces.map(w => w.id === id ? { ...w, ...patch } : w))
  }

  return { workspaces, createWorkspace, joinWorkspace, deleteWorkspace, updateWorkspace }
}
