import React from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { format, addWeeks, subWeeks, isThisWeek } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function Header({ weekStart, onPrev, onNext, onToday, view, activeWorkspace }) {
  const monday  = new Date(weekStart + 'T00:00:00')
  const sunday  = new Date(monday); sunday.setDate(sunday.getDate() + 6)
  const isCurr  = isThisWeek(monday, { weekStartsOn: 1 })

  const rangeLabel = `${format(monday, 'd MMM', { locale: fr })} – ${format(sunday, 'd MMM yyyy', { locale: fr })}`

  const contextLabel = view === 'personal'
    ? '👤 Planning personnel'
    : activeWorkspace
      ? `${activeWorkspace.emoji} ${activeWorkspace.name}`
      : '🤝 Groupe'

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-bg-border/40 flex-shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-text-secondary">{contextLabel}</span>
        <span className="text-text-tertiary/50">·</span>
        <h2 className="text-base font-semibold text-text-primary capitalize">{rangeLabel}</h2>
      </div>

      <div className="flex items-center gap-2">
        {!isCurr && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onToday}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-accent-blue/20 text-accent-blue hover:bg-accent-blue/30 transition-colors"
          >
            <Calendar size={12} />
            Aujourd'hui
          </motion.button>
        )}
        <button
          onClick={onPrev}
          className="p-2 rounded-xl hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={onNext}
          className="p-2 rounded-xl hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </header>
  )
}
