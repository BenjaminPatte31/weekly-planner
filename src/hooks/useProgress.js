import { useMemo } from 'react'
import { startOfWeek, addDays, format } from 'date-fns'

export function useProgress(tasks) {
  return useMemo(() => {
    if (!tasks.length) return { total: 0, done: 0, pct: 0, byDay: Array(7).fill({ total: 0, done: 0, pct: 0 }) }

    const total = tasks.length
    const done  = tasks.filter(t => t.is_done).length
    const pct   = total > 0 ? Math.round((done / total) * 100) : 0

    const byDay = Array.from({ length: 7 }, (_, i) => {
      const dayTasks = tasks.filter(t => t.day_of_week === i)
      const d = dayTasks.filter(t => t.is_done).length
      return { total: dayTasks.length, done: d, pct: dayTasks.length > 0 ? Math.round((d / dayTasks.length) * 100) : 0 }
    })

    return { total, done, pct, byDay }
  }, [tasks])
}

/** Returns ISO string for Monday of the week containing `date` */
export function getWeekStart(date = new Date()) {
  const monday = startOfWeek(date, { weekStartsOn: 1 })
  return format(monday, 'yyyy-MM-dd')
}

/** Returns array of 7 Date objects (Mon–Sun) for the given weekStart string */
export function getWeekDays(weekStart) {
  const base = new Date(weekStart + 'T00:00:00')
  return Array.from({ length: 7 }, (_, i) => addDays(base, i))
}
