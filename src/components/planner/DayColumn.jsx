import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import TaskBlock from './TaskBlock'
import { format, isToday } from 'date-fns'
import { fr } from 'date-fns/locale'
import { timeToMinutes } from '../../lib/timeUtils'
const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MIN_SLOT_HEIGHT = 56

export default function DayColumn({ date, dayIndex, tasks, onAddTask, onEditTask, onToggle }) {
  const isCurrentDay = isToday(date)

  return (
    <div className={`flex flex-col border-r border-bg-border/30 last:border-r-0 ${isCurrentDay ? 'bg-accent-blue/[0.03]' : ''}`}>
      {/* Day header */}
      <div className={`sticky top-0 z-20 flex flex-col items-center py-3 border-b border-bg-border/40 flex-shrink-0 ${
        isCurrentDay ? 'bg-bg-surface/90 backdrop-blur-md' : 'bg-bg-surface/80 backdrop-blur-md'
      }`}>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${
          isCurrentDay ? 'text-accent-blue' : 'text-text-tertiary'
        }`}>
          {format(date, 'EEE', { locale: fr })}
        </span>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center mt-1 text-sm font-bold ${
          isCurrentDay
            ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/40'
            : 'text-text-secondary'
        }`}>
          {format(date, 'd')}
        </div>
      </div>

      {/* Hour slots */}
      <div className="relative flex-1">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {/* Grid background */}
          {HOURS.map(hour => (
            <HourSlot
              key={hour}
              hour={hour}
              dayIndex={dayIndex}
              onAdd={onAddTask}
            />
          ))}

          {/* Task blocks — absolutely positioned */}
          <AnimatePresence>
            {tasks.map(task => {
              const startMins = timeToMinutes(task.start_time || `${String(task.start_hour).padStart(2,'0')}:00`)
              const endMins = timeToMinutes(task.end_time || `${String(Math.min(24, task.start_hour + task.duration)).padStart(2,'0')}:00`)
              const durationMins = Math.max(15, endMins - startMins)
              
              return (
                <div
                  key={task.id}
                  className="absolute inset-x-0 pointer-events-none group px-1"
                  style={{
                    top:    `${(startMins / 60) * MIN_SLOT_HEIGHT}px`,
                    height: `${(durationMins / 60) * MIN_SLOT_HEIGHT}px`,
                  }}
                >
                  <div className="relative h-full pointer-events-auto shadow-sm">
                    <TaskBlock
                      task={task}
                      onClick={onEditTask}
                      onToggle={onToggle}
                    />
                  </div>
                </div>
              )
            })}
          </AnimatePresence>
        </SortableContext>
      </div>
    </div>
  )
}

function HourSlot({ hour, dayIndex, onAdd }) {
  const [hover, setHover] = useState(false)
  const id = `slot-${dayIndex}-${hour}`

  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`time-slot border-b border-bg-border/30 relative group ${isOver ? 'bg-accent-blue/10' : ''}`}
      style={{ height: `${MIN_SLOT_HEIGHT}px` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Hover add button */}
      <AnimatePresence>
        {hover && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.1 }}
            onClick={() => onAdd(dayIndex, hour)}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-bg-hover border border-bg-border/60 text-text-tertiary hover:text-text-primary hover:border-accent-blue/40 hover:bg-accent-blue/10 transition-all duration-150">
              <Plus size={11} />
              <span className="text-[10px] font-medium">{String(hour).padStart(2,'0')}:00</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Drop indicator */}
      {isOver && (
        <div className="absolute inset-x-1 top-0 h-0.5 bg-accent-blue rounded-full" />
      )}
    </div>
  )
}
