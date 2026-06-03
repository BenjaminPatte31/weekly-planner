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
  const [title,      setTitle]      = useState(task?.title      ?? '')
  const [description,setDescription]= useState(task?.description ?? '')
  const [day,        setDay]        = useState(task?.day_of_week ?? defaultDay ?? 0)
  
  // Default to whole hour, or task's precise time
  const initStart = task?.start_time ?? `${String(defaultHour ?? 8).padStart(2,'0')}:00`
  const initEnd   = task?.end_time   ?? `${String((defaultHour ?? 8) + 1).padStart(2,'0')}:00`
  
  const [startTime,  setStartTime]  = useState(initStart)
  const [endTime,    setEndTime]    = useState(initEnd)
  const [category,   setCategory]   = useState(task?.category    ?? 'work')
  const [color,      setColor]      = useState(task?.color       ?? '#0A84FF')
  const titleRef = useRef(null)

  useEffect(() => { titleRef.current?.focus() }, [])

  // Sync color when category changes
  useEffect(() => {
    const cat = CATEGORIES.find(c => c.value === category)
    if (cat) setColor(cat.color)
  }, [category])

  const handleSave = () => {
    if (!title.trim()) return
    
    // Fallback for strict DB columns
    const startHourNum = parseInt(startTime.split(':')[0] || '0', 10)
    
    onSave({ 
      title: title.trim(), 
      description, 
      day_of_week: day, 
      start_time: startTime,
      end_time: endTime,
      start_hour: startHourNum, // old DB column compat
      duration: 1,              // old DB column compat
      category, 
      color 
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
          className="w-full max-w-md glass rounded-3xl p-6 shadow-2xl space-y-5"
          style={{ boxShadow: `0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)` }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-text-primary">
              {isEditing ? 'Modifier la tâche' : 'Nouvelle tâche'}
            </h3>
            <div className="flex items-center gap-2">
              {isEditing && (
                <button onClick={onDelete} className="p-2 rounded-xl hover:bg-accent-red/20 text-text-tertiary hover:text-accent-red transition-colors">
                  <Trash2 size={15} />
                </button>
              )}
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-bg-hover text-text-tertiary hover:text-text-secondary transition-colors">
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${
                  category === c.value
                    ? 'border-transparent text-white'
                    : 'border-bg-border text-text-secondary hover:text-text-primary hover:border-bg-hover'
                }`}
                style={category === c.value ? { background: c.color } : {}}
              >
                <span>{c.emoji}</span>
                {c.label}
              </button>
            ))}
          </div>

          {/* Title */}
          <div className="space-y-1">
            <input
              ref={titleRef}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Titre de la tâche…"
              className="input-base text-base font-medium"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description (optionnel)…"
              rows={2}
              className="input-base resize-none text-sm"
            />
          </div>

          {/* Day + Time row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] text-text-tertiary font-medium flex items-center gap-1"><Tag size={10}/>Jour</label>
              <select value={day} onChange={e => setDay(Number(e.target.value))} className="input-base text-sm py-2">
                {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] text-text-tertiary font-medium flex items-center gap-1"><Clock size={10}/>Début</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="input-base text-sm py-2" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] text-text-tertiary font-medium flex items-center gap-1"><Clock size={10}/>Fin</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="input-base text-sm py-2" />
            </div>
          </div>

          {/* Preview strip */}
          <div className="rounded-2xl p-3 flex items-center gap-3" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
            <div className="w-1 self-stretch rounded-full" style={{ background: color }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">{title || 'Aperçu de la tâche'}</p>
              <p className="text-xs text-text-secondary">{DAYS[day]}, {startTime} → {endTime}</p>
            </div>
            <span className="text-xl">{cat?.emoji}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-2xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors">
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="flex-1 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
            >
              <Check size={15} />
              {isEditing ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>

          <p className="text-center text-[10px] text-text-tertiary">⌘ + Entrée pour sauvegarder</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
