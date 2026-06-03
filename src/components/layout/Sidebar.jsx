import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2, Share2, Users, ChevronRight, Check, Copy } from 'lucide-react'

const EMOJIS = ['🗂️','💼','🎯','🚀','💡','🏋️','📚','🎨','🔬','🌱','⚡','🎵']

function WorkspaceItem({ ws, active, onSelect, onDelete }) {
  const [copied, setCopied] = useState(false)
  const copyId = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(ws.id).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      onClick={() => onSelect(ws)}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer transition-all duration-150 ${
        active ? 'bg-accent-blue/20 border border-accent-blue/30' : 'hover:bg-bg-hover'
      }`}
    >
      <span className="text-xl">{ws.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${active ? 'text-accent-blue' : 'text-text-primary'}`}>{ws.name}</p>
        <p className="text-[10px] text-text-tertiary truncate">{ws.id.slice(0, 8)}…</p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={copyId} className="p-1 rounded-lg hover:bg-bg-border" title="Copier l'ID">
          {copied ? <Check size={12} className="text-accent-green" /> : <Copy size={12} className="text-text-secondary" />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(ws.id) }} className="p-1 rounded-lg hover:bg-accent-red/20" title="Supprimer">
          <Trash2 size={12} className="text-accent-red/70" />
        </button>
      </div>
      {active && <ChevronRight size={14} className="text-accent-blue flex-shrink-0" />}
    </motion.div>
  )
}

export default function Sidebar({
  user, onLogout,
  view, onViewChange,
  workspaces, activeWorkspace, onSelectWorkspace,
  onCreateWorkspace, onJoinWorkspace, onDeleteWorkspace,
  progress,
}) {
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin,   setShowJoin]   = useState(false)
  const [newName,    setNewName]    = useState('')
  const [newEmoji,   setNewEmoji]   = useState('🗂️')
  const [joinCode,   setJoinCode]   = useState('')

  const handleCreate = () => {
    if (!newName.trim()) return
    onCreateWorkspace(newName, newEmoji)
    setNewName(''); setShowCreate(false)
  }

  const handleJoin = () => {
    if (!joinCode.trim()) return
    onJoinWorkspace(joinCode.trim())
    setJoinCode(''); setShowJoin(false)
  }

  return (
    <aside className="w-72 h-full flex flex-col glass border-r border-bg-border/60 py-6 px-4 gap-4 overflow-y-auto no-scrollbar flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-1 mb-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
          <span className="text-sm">📅</span>
        </div>
        <div>
          <h1 className="text-sm font-bold text-text-primary leading-none">WeekFlow</h1>
          <p className="text-[10px] text-text-tertiary">Planning collaboratif</p>
        </div>
      </div>

      {/* View toggle */}
      <div className="space-y-1">
        <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-1 mb-2">Vue</p>
        <button
          onClick={() => { onViewChange('personal'); onSelectWorkspace(null) }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl text-sm font-medium transition-all duration-150 ${
            view === 'personal' ? 'bg-accent-blue/20 text-accent-blue' : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
          }`}
        >
          <span className="text-base">👤</span> Planning personnel
        </button>
      </div>

      {/* Workspaces */}
      <div className="space-y-2 flex-1">
        <div className="flex items-center justify-between px-1">
          <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">Espaces équipe</p>
          <div className="flex gap-1">
            <button onClick={() => setShowJoin(v => !v)} className="p-1 rounded-lg hover:bg-bg-hover text-text-secondary hover:text-text-primary" title="Rejoindre">
              <Users size={13} />
            </button>
            <button onClick={() => setShowCreate(v => !v)} className="p-1 rounded-lg hover:bg-bg-hover text-text-secondary hover:text-text-primary" title="Créer">
              <Plus size={13} />
            </button>
          </div>
        </div>

        {/* Create form */}
        <AnimatePresence>
          {showCreate && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="glass-light rounded-2xl p-3 space-y-2">
                <p className="text-xs font-semibold text-text-secondary">Créer un espace</p>
                <div className="flex gap-2 flex-wrap">
                  {EMOJIS.map(e => (
                    <button key={e} onClick={() => setNewEmoji(e)}
                      className={`text-lg p-0.5 rounded-lg transition-all ${newEmoji === e ? 'bg-accent-blue/30 scale-110' : 'hover:bg-bg-hover'}`}
                    >{e}</button>
                  ))}
                </div>
                <input value={newName} onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                  placeholder="Nom de l'espace…"
                  className="input-base text-xs py-2" autoFocus />
                <div className="flex gap-2">
                  <button onClick={() => setShowCreate(false)} className="flex-1 py-1.5 rounded-xl text-xs text-text-secondary hover:text-text-primary transition-colors">Annuler</button>
                  <button onClick={handleCreate} className="flex-1 py-1.5 rounded-xl text-xs bg-accent-blue text-white font-medium hover:bg-accent-blue/80 transition-colors">Créer</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Join form */}
        <AnimatePresence>
          {showJoin && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="glass-light rounded-2xl p-3 space-y-2">
                <p className="text-xs font-semibold text-text-secondary">Rejoindre un espace</p>
                <input value={joinCode} onChange={e => setJoinCode(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleJoin()}
                  placeholder="Coller l'ID de l'espace…"
                  className="input-base text-xs py-2 font-mono" autoFocus />
                <div className="flex gap-2">
                  <button onClick={() => setShowJoin(false)} className="flex-1 py-1.5 rounded-xl text-xs text-text-secondary hover:text-text-primary transition-colors">Annuler</button>
                  <button onClick={handleJoin} className="flex-1 py-1.5 rounded-xl text-xs bg-accent-green text-white font-medium hover:bg-accent-green/80 transition-colors">Rejoindre</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Workspace list */}
        <AnimatePresence>
          {workspaces.length === 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-text-tertiary text-center py-4 px-2">
              Aucun espace pour l'instant.<br/>Crée ou rejoins-en un !
            </motion.p>
          )}
          {workspaces.map(ws => (
            <WorkspaceItem
              key={ws.id}
              ws={ws}
              active={activeWorkspace?.id === ws.id}
              onSelect={(ws) => { onSelectWorkspace(ws); onViewChange('group') }}
              onDelete={onDeleteWorkspace}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* User footer */}
      <div className="pt-3 border-t border-bg-border/40">
        <div className="flex items-center gap-2.5 px-1">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
            <p className="text-[10px] text-text-tertiary">En ligne</p>
          </div>
          <button onClick={onLogout} className="text-[10px] text-text-tertiary hover:text-accent-red transition-colors px-1.5 py-1 rounded-lg hover:bg-accent-red/10">
            Déco.
          </button>
        </div>
      </div>
    </aside>
  )
}
