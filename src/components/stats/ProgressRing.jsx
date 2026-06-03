import React from 'react'
import { motion } from 'framer-motion'

const SIZE        = 64
const STROKE      = 6
const RADIUS      = (SIZE - STROKE) / 2
const CIRCUMF     = 2 * Math.PI * RADIUS

/**
 * ProgressRing — Apple Fitness style circular progress ring.
 * @param {number}  pct        0–100
 * @param {string}  color      hex or CSS color
 * @param {string}  label      center label text
 * @param {number}  size       SVG size in px (default 64)
 * @param {number}  strokeW    stroke width (default 6)
 */
export default function ProgressRing({ pct = 0, color = '#0A84FF', label, size = SIZE, strokeW = STROKE, children }) {
  const radius = (size - strokeW) / 2
  const circumf = 2 * Math.PI * radius
  const offset  = circumf - (pct / 100) * circumf

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeW}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={circumf}
          initial={{ strokeDashoffset: circumf }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children || (
          <span className="text-xs font-semibold text-text-primary leading-none">
            {label ?? `${pct}%`}
          </span>
        )}
      </div>
    </div>
  )
}
