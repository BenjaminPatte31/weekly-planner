import React from 'react'
import { motion } from 'framer-motion'

/**
 * Toggle — smooth pill switch between two options.
 * @param {string}   value      current value
 * @param {Function} onChange   callback(newValue)
 * @param {{ value, label, icon }[]} options  exactly 2 options
 */
export default function Toggle({ value, onChange, options }) {
  const activeIdx = options.findIndex(o => o.value === value)

  return (
    <div className="relative flex items-center bg-bg-hover rounded-2xl p-1 gap-0.5">
      {/* Sliding background */}
      <motion.div
        className="absolute top-1 bottom-1 rounded-xl bg-bg-card border border-bg-border/60"
        style={{ width: `calc(50% - 4px)` }}
        animate={{ x: activeIdx === 0 ? 0 : 'calc(100% + 4px)' }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />

      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors duration-200 flex-1 justify-center ${
              active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {opt.icon && <span className="text-base">{opt.icon}</span>}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
