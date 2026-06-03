import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import DayColumn from './DayColumn'
import { TaskBlockOverlay } from './TaskBlock'
import { getWeekDays } from '../../hooks/useProgress'
import { timeToMinutes, minutesToTime } from '../../lib/timeUtils'

const START_HOUR       = 7
const END_HOUR         = 23
const HOURS            = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => i + START_HOUR)
const MIN_SLOT_HEIGHT  = 48   // 17 × 48px = 816px
const TIME_COL_WIDTH   = 44
export { START_HOUR, END_HOUR, MIN_SLOT_HEIGHT }

const currentHour = new Date().getHours()

export default function WeekGrid({ weekStart, tasks, onAddTask, onEditTask, onToggle, onMoveTask }) {
  const days          = getWeekDays(weekStart)
  const [activeTask, setActiveTask] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragStart = ({ active }) => {
    setActiveTask(tasks.find(t => t.id === active.id) || null)
  }

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null)
    if (!over || active.id === over.id) return

    // over.id = 'slot-{dayIndex}-{hour}' or another task id
    if (typeof over.id === 'string' && over.id.startsWith('slot-')) {
      const parts    = over.id.split('-')
      const newDay   = Number(parts[1])
      const newHour  = Number(parts[2])
      
      const oldStartMins = timeToMinutes(activeTask.start_time || `${String(activeTask.start_hour).padStart(2,'0')}:00`)
      const oldEndMins   = timeToMinutes(activeTask.end_time || `${String(Math.min(24, activeTask.start_hour + activeTask.duration)).padStart(2,'0')}:00`)
      const durationMins = oldEndMins - oldStartMins
      
      const newStartMins = newHour * 60
      const newEndMins   = newStartMins + durationMins
      
      onMoveTask(active.id, { 
        day_of_week: newDay, 
        start_hour: newHour,
        start_time: minutesToTime(newStartMins),
        end_time: minutesToTime(newEndMins)
      })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Scrollable area */}
        <div className="flex flex-1 overflow-auto relative">
          {/* Time gutter */}
          <div className="flex-shrink-0 sticky left-0 z-30 bg-bg-surface/90 backdrop-blur-sm border-r border-bg-border/40" style={{ width: TIME_COL_WIDTH }}>
            {/* Spacer matching sticky day-header */}
            <div className="sticky top-0 z-40 bg-bg-surface/95 backdrop-blur-md border-b border-bg-border/40" style={{ height: 68 }} />
            {HOURS.map(h => (
              <div
                key={h}
                className="flex items-start justify-end pr-2 pt-1 text-[10px] text-text-tertiary font-medium select-none"
                style={{ height: MIN_SLOT_HEIGHT }}
              >
                {String(h).padStart(2,'0')}
              </div>
            ))}
            {/* Extra space so 23h label + its slot is fully visible */}
            <div style={{ height: MIN_SLOT_HEIGHT }} />
          </div>

          {/* 7-column grid */}
          <div className="flex flex-1 relative">
            {days.map((date, i) => (
              <div key={i} className="flex-1 relative flex flex-col min-w-[110px]">
                <DayColumn
                  date={date}
                  dayIndex={i}
                  tasks={tasks.filter(t => t.day_of_week === i)}
                  onAddTask={onAddTask}
                  onEditTask={onEditTask}
                  onToggle={onToggle}
                />
              </div>
            ))}

            {/* Current time indicator */}
            <CurrentTimeBar />
          </div>
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeTask ? (
          <div style={{ width: 120 }}>
            <TaskBlockOverlay task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function CurrentTimeBar() {
  const now     = new Date()
  const hours   = now.getHours()
  const minutes = now.getMinutes()
  // Only show if within visible range 7-23
  if (hours < START_HOUR || hours > END_HOUR) return null
  const top = ((hours - START_HOUR) + minutes / 60) * MIN_SLOT_HEIGHT + 68

  return (
    <div
      className="absolute left-0 right-0 pointer-events-none z-40 flex items-center gap-1"
      style={{ top }}
    >
      <div className="w-2 h-2 rounded-full bg-accent-red flex-shrink-0 animate-pulse-dot shadow-lg shadow-accent-red/50" />
      <div className="flex-1 h-px bg-accent-red/60" />
    </div>
  )
}
