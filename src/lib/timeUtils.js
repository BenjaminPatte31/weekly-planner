/**
 * timeUtils.js
 */

export function timeToMinutes(timeStr = '00:00') {
  if (!timeStr) return 0
  const [h, m] = timeStr.split(':').map(Number)
  return (h * 60) + (m || 0)
}

export function minutesToTime(mins) {
  const h = Math.floor(mins / 60)
  const m = Math.floor(mins % 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
