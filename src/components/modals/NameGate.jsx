import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function NameGate({ onLogin }) {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim().length < 2) return
    onLogin(name)
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-6">
      {/* Background ambient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="glass rounded-3xl p-10 w-full max-w-sm text-center relative space-y-8"
        style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)' }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-accent-blue via-accent-indigo to-accent-purple flex items-center justify-center shadow-xl shadow-accent-blue/30">
            <span className="text-3xl">📅</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">WeekFlow</h1>
            <p className="text-sm text-text-secondary mt-1">Planning collaboratif</p>
          </div>
        </div>

        {/* Features */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-text-tertiary">
          {['Semaine complète', 'Équipes', 'Temps réel'].map((f, i) => (
            <React.Fragment key={f}>
              <div className="flex items-center gap-1">
                <Sparkles size={10} className="text-accent-blue" />
                {f}
              </div>
              {i < 2 && <span className="text-bg-border">·</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-text-secondary font-medium text-left block">
              Ton prénom ou pseudo
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="ex: Alex, Team Design…"
              autoFocus
              className="input-base text-center text-base py-3"
              maxLength={32}
            />
          </div>
          <motion.button
            type="submit"
            disabled={name.trim().length < 2}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)' }}
          >
            Commencer
            <ArrowRight size={15} />
          </motion.button>
        </form>

        <p className="text-[10px] text-text-tertiary">
          Aucun compte requis · Données locales + Supabase
        </p>
      </motion.div>
    </div>
  )
}
