import React, { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { addWeeks, subWeeks } from 'date-fns'

import { useAuth, useWorkspaces }       from './hooks/useAuth'
import { useTasks }                     from './hooks/useTasks'
import { useProgress, getWeekStart }    from './hooks/useProgress'

import NameGate    from './components/modals/NameGate'
import Sidebar     from './components/layout/Sidebar'
import Header      from './components/layout/Header'
import WeekGrid    from './components/planner/WeekGrid'
import TaskModal   from './components/modals/TaskModal'
import StatsPanel  from './components/stats/StatsPanel'

export default function App() {
  const { user, login, logout }     = useAuth()
  const { workspaces, createWorkspace, joinWorkspace, deleteWorkspace, updateWorkspace } = useWorkspaces(user?.id)

  const [view,            setView]            = useState('personal')      // 'personal' | 'group'
  const [activeWorkspace, setActiveWorkspace] = useState(null)
  const [currentDate,     setCurrentDate]     = useState(new Date())
  const [taskModal,       setTaskModal]       = useState(null)            // null | { mode:'add'|'edit', task?, day?, hour? }
  const [statsPanelOpen,  setStatsPanelOpen]  = useState(true)

  const weekStart = getWeekStart(currentDate)

  const { tasks, loading, addTask, updateTask, deleteTask, toggleDone } = useTasks(
    user?.id,
    weekStart,
    view === 'group' ? activeWorkspace?.id : null,
  )

  const progress = useProgress(tasks)

  /* ── Week navigation ─────────────────────────────── */
  const goToToday = () => setCurrentDate(new Date())
  const goPrev    = () => setCurrentDate(d => subWeeks(d, 1))
  const goNext    = () => setCurrentDate(d => addWeeks(d, 1))

  /* ── Task modal handlers ─────────────────────────── */
  const openAddModal  = useCallback((day, hour) => setTaskModal({ mode: 'add', day, hour }), [])
  const openEditModal = useCallback((task) =>       setTaskModal({ mode: 'edit', task }),     [])
  const closeModal    = useCallback(() =>           setTaskModal(null),                        [])

  const handleSave = useCallback(async (data) => {
    try {
      if (taskModal?.mode === 'edit' && taskModal.task?.id) {
        await updateTask(taskModal.task.id, data)
      } else {
        await addTask(data)
      }
      closeModal()
    } catch (e) {
      console.error('Save task error:', e)
    }
  }, [taskModal, addTask, updateTask, closeModal])

  const handleDelete = useCallback(async () => {
    if (taskModal?.task?.id) {
      await deleteTask(taskModal.task.id)
      closeModal()
    }
  }, [taskModal, deleteTask, closeModal])

  const handleMove = useCallback(async (taskId, patch) => {
    await updateTask(taskId, patch)
  }, [updateTask])

  /* ── Guard: name gate ────────────────────────────── */
  if (!user) {
    return <NameGate onLogin={login} />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      {/* Sidebar */}
      <Sidebar
        user={user}
        onLogout={logout}
        view={view}
        onViewChange={setView}
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        onSelectWorkspace={setActiveWorkspace}
        onCreateWorkspace={createWorkspace}
        onJoinWorkspace={joinWorkspace}
        onDeleteWorkspace={deleteWorkspace}
        progress={progress}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          weekStart={weekStart}
          onPrev={goPrev}
          onNext={goNext}
          onToday={goToToday}
          view={view}
          activeWorkspace={activeWorkspace}
        />

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Week grid */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={weekStart + view + (activeWorkspace?.id || '')}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="h-full"
              >
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="space-y-2 text-center">
                      <div className="w-8 h-8 border-2 border-accent-blue/40 border-t-accent-blue rounded-full animate-spin mx-auto" />
                      <p className="text-xs text-text-tertiary">Chargement…</p>
                    </div>
                  </div>
                ) : (
                  <WeekGrid
                    weekStart={weekStart}
                    tasks={tasks}
                    onAddTask={openAddModal}
                    onEditTask={openEditModal}
                    onToggle={toggleDone}
                    onMoveTask={handleMove}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stats panel */}
          <AnimatePresence>
            {statsPanelOpen && (
              <motion.aside
                initial={{ opacity: 0, x: 32, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 240 }}
                exit={{ opacity: 0, x: 32, width: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                className="flex-shrink-0 border-l border-bg-border/40 p-3 overflow-y-auto no-scrollbar"
              >
                <StatsPanel
                  progress={progress}
                  workspaceName={activeWorkspace?.name}
                />
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Toggle stats panel */}
          <button
            onClick={() => setStatsPanelOpen(v => !v)}
            className="self-center flex-shrink-0 w-4 h-12 flex items-center justify-center text-text-tertiary hover:text-text-secondary hover:bg-bg-hover rounded-l-xl transition-colors"
            title={statsPanelOpen ? 'Masquer les stats' : 'Afficher les stats'}
          >
            <span className="text-[10px]">{statsPanelOpen ? '›' : '‹'}</span>
          </button>
        </div>
      </div>

      {/* Task modal */}
      <AnimatePresence>
        {taskModal && (
          <TaskModal
            key="task-modal"
            task={taskModal.task}
            defaultDay={taskModal.day}
            defaultHour={taskModal.hour}
            onSave={handleSave}
            onDelete={handleDelete}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
