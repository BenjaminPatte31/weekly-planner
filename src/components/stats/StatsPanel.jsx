import React from 'react'
import { motion } from 'framer-motion'
import ProgressRing from './ProgressRing'

const DAYS_SHORT = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const DAYS_FULL  = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const TODAY_IDX  = (new Date().getDay() + 6) % 7 // 0=Mon

export default function StatsPanel({ progress, workspaceName }) {
  const { pct, done, total, byDay } = progress
  const todayPct = byDay[TODAY_IDX]?.pct ?? 0

  return (
    <div className="space-y-3">

      {/* Header */}
      {workspaceName && (
        <div className="glass-light rounded-2xl px-3 py-2 flex items-center gap-2">
          <span className="text-sm">🤝</span>
          <span className="text-[11px] font-semibold text-text-secondary truncate">{workspaceName}</span>
        </div>
      )}

      {/* Big week ring */}
      <div className="glass rounded-2xl p-4 flex flex-col items-center gap-2">
        <ProgressRing pct={pct} color="#0A84FF" size={88} strokeW={8}>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-text-primary leading-none">{pct}%</span>
            <span className="text-[9px] text-text-tertiary mt-0.5">semaine</span>
          </div>
        </ProgressRing>
        <p className="text-[11px] text-text-secondary">
          <span className="font-semibold text-text-primary">{done}</span> / {total} tâches faites
        </p>
      </div>

      {/* Today + Score — 2 small rings */}
      <div className="grid grid-cols-2 gap-2">
        <div className="glass rounded-2xl p-3 flex flex-col items-center gap-1.5">
          <ProgressRing pct={todayPct} color="#30D158" size={56} strokeW={6}>
            <span className="text-[11px] font-bold text-text-primary">{todayPct}%</span>
          </ProgressRing>
          <span className="text-[10px] text-text-tertiary">Aujourd'hui</span>
        </div>
        <div className="glass rounded-2xl p-3 flex flex-col items-center gap-1.5">
          <ProgressRing pct={Math.min(done * 10, 100)} color="#BF5AF2" size={56} strokeW={6}>
            <span className="text-[11px] font-bold text-text-primary">{Math.min(done * 10, 100)}%</span>
          </ProgressRing>
          <span className="text-[10px] text-text-tertiary">Score</span>
        </div>
      </div>

      {/* Day-by-day bars */}
      <div className="glass rounded-2xl p-3 space-y-2">
        <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">Par jour</p>
        <div className="flex items-end justify-between gap-1" style={{ height: 48 }}>
          {byDay.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full">
              <div className="w-full flex-1 relative rounded-full overflow-hidden bg-bg-border/40">
                <motion.div
                  className="absolute bottom-0 w-full rounded-full"
                  style={{
                    background: i === TODAY_IDX
                      ? 'linear-gradient(to top, #0A84FF, #5AC8FA)'
                      : 'linear-gradient(to top, #3A3A3C, #636366)',
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(day.pct, day.pct > 0 ? 15 : 0)}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
                />
              </div>
              <span className={`text-[9px] font-semibold ${i === TODAY_IDX ? 'text-accent-blue' : 'text-text-tertiary'}`}>
                {DAYS_SHORT[i]}
              </span>
            </div>
          ))}
        </div>
        {/* Done counts per day */}
        <div className="flex justify-between">
          {byDay.map((day, i) => (
            <div key={i} className="flex-1 flex justify-center">
              {day.done > 0 && (
                <span className={`text-[8px] font-bold ${i === TODAY_IDX ? 'text-accent-blue' : 'text-text-tertiary'}`}>
                  {day.done}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="glass-light rounded-2xl p-3 space-y-2">
        <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">Astuces</p>
        {[
          { icon: '🖱️', text: 'Glisse pour déplacer' },
          { icon: '✅', text: 'Coche pour valider' },
          { icon: '🤝', text: 'Partage l\'ID équipe' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-2">
            <span className="text-xs">{icon}</span>
            <p className="text-[10px] text-text-secondary leading-snug">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
