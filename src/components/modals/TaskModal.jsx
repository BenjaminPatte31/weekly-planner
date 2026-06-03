import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Trash2, Clock, Tag } from 'lucide-react'

export const CATEGORIES = [
  { value: 'work',     label: 'Travail',   color: '#0A84FF', emoji: '💼' },
  { value: 'personal', label: 'Perso',     color: '#30D158', emoji: '🌱' },
  { value: 'health',   label: 'Santé',     color: '#FF9F0A', emoji: '🏋️' },
  { value: 'creative', label: 'Créatif',   color: '#BF5AF2', emoji: '🎨' },
  { value: 'learning', label: 'Formation', color: '#5AC8FA', emoji: '📚' },
  { value: 'other',    label: 'Autre',     color: '#48484A', emoji: '📌' },
]

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}
const modal = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 28 } },
  exit:    { opacity: 0, scale: 0.94, y: 12, transition: { duration: 0.15 } },
}

export default function TaskModal({ task, defaultDay, defaultHour, onSave, onDelete, onClose }) {
  const isEditing = Boolean(task?.id)
  const [title,       setTitle]       = useState(task?.title       ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [day,         setDay]         = useState(task?.day_of_week ?? defaultDay ?? 0)

  const initStart = task?.start_time ?? `${String(defaultHour ?? 8).padStart(2,'0')}:00`
  const initEnd   = task?.end_time   ?? `${String((defaultHour ?? 8) + 1).padStart(2,'0')}:00`

  const [startTime, setStartTime] = useState(initStart)
  const [endTime,   setEndTime]   = useState(initEnd)
  const [category,  setCategory]  = useState(task?.category ?? 'work')
  const [color,     setColor]     = useState(task?.color    ?? '#0A84FF')
  const titleRef = useRef(null)

  useEffect(() => { titleRef.current?.focus() }, [])
  useEffect(() => {
    const cat = CATEGORIES.find(c => c.value === category)
    if (cat) setColor(cat.color)
  }, [category])

  const handleSave = () => {
    if (!title.trim()) return
    const startHourNum = parseInt(startTime.split(':')[0] || '0', 10)
    onSave({
      title: title.trim(),
      description,
      day_of_week: day,
      start_time: startTime,
      end_time: endTime,
      start_hour: startHourNum,
      duration: 1,
      category,
      color,
    })
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSave()
    if (e.key === 'Escape') onClose()
  }

  const cat = CATEGORIES.find(c => c.value === category)

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        variants={backdrop}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <motion.div
          key="modal"
          variants={modal}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={e => e.stopPropagation()}
          onKeyDown={handleKey}
          className="w-full max-w-sm glass rounded-3xl shadow-2xl flex flex-col"
          style={{
            maxHeight: '90vh',
            boxShadow: `0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)`,
          }}
        >
          {/* ── Scrollable body ── */}
          <div className="overflow-y-auto flex-1 p-5 space-y-4">

            {/* Top bar */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-primary">
                {isEditing ? 'Modifier la tâche' : 'Nouvelle tâche'}
              </h3>
              <div className="flex items-center gap-1.5">
                {isEditing && (
                  <button onClick={onDelete} className="p-1.5 rounded-xl hover:bg-accent-red/20 text-text-tertiary hover:text-accent-red transition-colors">
                    <Trash2 size={14} />
                  </button>
                )}
                <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-bg-hover text-text-tertiary hover:text-text-secondary transition-colors">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Category chips */}
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map(c => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border transition-all ${
                    category === c.value
                      ? 'border-transparent text-white'
                      : 'border-bg-border text-text-secondary hover:text-text-primary'
                  }`}
                  style={category === c.value ? { background: c.color } : {}}
                >
                  <span>{c.emoji}</span>{c.label}
                </button>
              ))}
            </div>

            {/* Title */}
            <input
              ref={titleRef}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Titre de la tâche…"
              className="input-base text-sm font-medium"
            />

            {/* Description */}
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description (optionnel)…"
              rows={2}
              className="input-base resize-none text-xs"
            />

            {/* Jour + Horaires — compact 3 cols */}
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-text-tertiary font-medium flex items-center gap-1">
                  <Tag size={9}/> Jour
                </label>
                <select
                  value={day}
                  onChange={e => setDay(Number(e.target.value))}
                  className="input-base text-xs py-1.5"
                >
                  {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-text-tertiary font-medium flex items-center gap-1">
                  <Clock size={9}/> Début
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="input-base text-xs py-1.5"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-text-tertiary font-medium flex items-center gap-1">
                  <Clock size={9}/> Fin
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="input-base text-xs py-1.5"
                />
              </div>
            </div>

            {/* Preview strip */}
            <div
              className="rounded-xl p-2.5 flex items-center gap-2.5"
              style={{ background: `${color}18`, border: `1px solid ${color}30` }}
            >
              <div className="w-0.5 self-stretch rounded-full" style={{ background: color }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate">{title || 'Aperçu'}</p>
                <p className="text-[10px] text-text-secondary">{DAYS[day]}, {startTime} → {endTime}</p>
              </div>
              <span className="text-base">{cat?.emoji}</span>
            </div>
          </div>

          {/* ── Sticky footer ── */}
          <div className="flex-shrink-0 px-5 pb-5 pt-2 flex gap-2 border-t border-bg-border/30">
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-2xl text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="flex-1 py-2 rounded-2xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
            >
              <Check size={13} />
              {isEditing ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
