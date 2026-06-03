import React from 'react'
import { motion } from 'framer-motion'
import ProgressRing from './ProgressRing'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const DAYS_SHORT = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const TODAY_IDX  = (new Date().getDay() + 6) % 7 // 0=Mon

export default function StatsPanel({ progress, workspaceName }) {
  const { pct, done, total, byDay } = progress
  const todayPct = byDay[TODAY_IDX]?.pct ?? 0

  return (
    <div className="glass rounded-3xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Progression
        </span>
        <span className="text-xs text-text-tertiary">
          {done}/{total} tâches
        </span>
      </div>

      {/* Rings row */}
      <div className="flex items-center justify-around py-2">
        {/* Week ring */}
        <div className="flex flex-col items-center gap-1.5">
          <ProgressRing pct={pct} color="#0A84FF" size={72} strokeW={7} />
          <span className="text-[10px] text-text-secondary font-medium">Semaine</span>
        </div>

        {/* Today ring */}
        <div className="flex flex-col items-center gap-1.5">
          <ProgressRing pct={todayPct} color="#30D158" size={72} strokeW={7} />
          <span className="text-[10px] text-text-secondary font-medium">Aujourd'hui</span>
        </div>

        {/* Bonus ring: streak or workspace */}
        <div className="flex flex-col items-center gap-1.5">
          <ProgressRing pct={Math.min(done * 10, 100)} color="#BF5AF2" size={72} strokeW={7} />
          <span className="text-[10px] text-text-secondary font-medium">Score</span>
        </div>
      </div>

      {/* Day bars */}
      <div>
        <div className="flex items-end justify-between gap-1 h-12">
          {byDay.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex-1 relative rounded-full overflow-hidden bg-bg-border/40">
                <motion.div
                  className="absolute bottom-0 w-full rounded-full"
                  style={{
                    background: i === TODAY_IDX
                      ? 'linear-gradient(to top, #0A84FF, #5AC8FA)'
                      : 'linear-gradient(to top, #3A3A3C, #48484A)',
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${day.pct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
                />
              </div>
              <span className={`text-[9px] font-medium ${i === TODAY_IDX ? 'text-accent-blue' : 'text-text-tertiary'}`}>
                {DAYS_SHORT[i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
