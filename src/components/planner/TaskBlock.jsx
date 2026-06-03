import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS }         from '@dnd-kit/utilities'
import { CATEGORIES }  from '../modals/TaskModal'

const MIN_SLOT_HEIGHT = 56 // px per hour

export default function TaskBlock({ task, onClick, onToggle, isDragging }) {
  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging: isSortableDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform:  CSS.Transform.toString(transform),
    transition: isSortableDragging ? 'none' : transition,
    opacity:    isSortableDragging ? 0 : 1,
    zIndex:     isSortableDragging ? 50 : 10,
    gridRow:    `${task.start_hour + 1} / span ${task.duration}`,
  }

  const cat   = CATEGORIES.find(c => c.value === task.category)
  const color = task.color || cat?.color || '#48484A'

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={`task-block absolute inset-x-1 overflow-hidden ${isDragging ? 'drag-overlay' : ''}`}
      {...attributes}
      onClick={() => onClick(task)}
    >
      <div
        className="h-full rounded-xl p-1.5 flex flex-col gap-0.5 relative overflow-hidden"
        style={{
          background:  `${color}22`,
          border:      `1px solid ${color}44`,
          minHeight:   `${task.duration * MIN_SLOT_HEIGHT - 4}px`,
        }}
      >
        {/* Color left bar */}
        <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full" style={{ background: color }} />

        {/* Drag handle */}
        <div
          {...listeners}
          className="absolute right-1 top-1 opacity-0 group-hover:opacity-60 cursor-grab active:cursor-grabbing text-text-tertiary"
          onClick={e => e.stopPropagation()}
        >
          <GripVertical size={10} />
        </div>

        {/* Content */}
        <div className="pl-2 flex items-start gap-1.5 min-h-0">
          {/* Checkbox */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(task.id, task.is_done) }}
            className={`task-checkbox mt-0.5 flex-shrink-0 ${task.is_done ? 'checked' : ''}`}
            style={task.is_done ? { background: color, borderColor: color } : { borderColor: `${color}88` }}
          >
            <AnimatePresence>
              {task.is_done && (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  <Check size={9} strokeWidth={3} className="text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <p
              className={`text-[11px] font-semibold leading-tight transition-all duration-200 ${
                task.is_done ? 'line-through text-text-tertiary' : 'text-text-primary'
              }`}
              style={{ wordBreak: 'break-word' }}
            >
              {task.title}
            </p>
            {task.duration >= 2 && (
              <p className="text-[9px] text-text-tertiary mt-0.5">
                {String(task.start_hour).padStart(2,'0')}:00 – {String(Math.min(task.start_hour + task.duration, 24)).padStart(2,'0')}:00
              </p>
            )}
          </div>

          {/* Emoji */}
          {task.duration >= 2 && (
            <span className="text-[10px] leading-none flex-shrink-0">{cat?.emoji}</span>
          )}
        </div>

        {/* Done overlay shimmer */}
        {task.is_done && (
          <div className="absolute inset-0 rounded-xl bg-black/20 pointer-events-none" />
        )}
      </div>
    </motion.div>
  )
}

/** Overlay clone shown while dragging */
export function TaskBlockOverlay({ task }) {
  const cat   = CATEGORIES.find(c => c.value === task.category)
  const color = task.color || cat?.color || '#48484A'
  return (
    <div
      className="rounded-xl p-1.5 drag-overlay"
      style={{
        background:  `${color}33`,
        border:      `1px solid ${color}66`,
        minHeight:   `${task.duration * MIN_SLOT_HEIGHT - 4}px`,
        width:       '100%',
      }}
    >
      <div className="pl-2 flex items-start gap-1.5">
        <div className="w-4 h-4 rounded-full mt-0.5 flex-shrink-0" style={{ background: color }} />
        <p className="text-[11px] font-semibold text-text-primary leading-tight">{task.title}</p>
      </div>
    </div>
  )
}
