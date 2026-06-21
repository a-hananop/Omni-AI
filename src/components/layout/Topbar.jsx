import { useState, useRef, useEffect } from 'react'
import { Bell, Search, Cpu, LogOut, X, Clock, CheckCircle, AlertTriangle, Info, Trash2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext.jsx'

// ── Default notifications ────────────────────────────────────────────────
const DEFAULT_NOTIFS = [
  { id: 1, type: 'info',    title: 'Welcome to OmniAI',             body: 'Explore all features from the sidebar.', time: 'Just now',    read: false },
  { id: 2, type: 'success', title: 'AI Assistant Ready',            body: 'Llama 3.3 is connected and ready.',       time: '2 min ago',   read: false },
  { id: 3, type: 'warning', title: 'Complete your profile',         body: 'Add a bio in Settings → Profile.',       time: '10 min ago',  read: false },
  { id: 4, type: 'info',    title: 'New learning courses available', body: 'Check out React, Data Science & more.',  time: '1 hour ago',  read: true  },
  { id: 5, type: 'success', title: 'Task completed',                body: 'You completed 3 tasks today. Keep going!', time: '3 hours ago', read: true  },
]

// ── Searchable items ────────────────────────────────────────────────────
const SEARCH_ITEMS = [
  { label: 'Dashboard',         page: 'dashboard',     keywords: 'home overview stats' },
  { label: 'Tasks',             page: 'tasks',         keywords: 'todo checklist work' },
  { label: 'AI Assistant',      page: 'ai',            keywords: 'chat bot llama groq' },
  { label: 'Health',            page: 'health',        keywords: 'fitness steps calories sleep' },
  { label: 'Calendar',          page: 'calendar',      keywords: 'events schedule date' },
  { label: 'Learning',          page: 'learning',      keywords: 'courses study flashcards notes' },
  { label: 'Entertainment',     page: 'entertainment', keywords: 'music movies media' },
  { label: 'Smart Home',        page: 'smarthome',     keywords: 'devices lights thermostat' },
  { label: 'Personal Space',    page: 'personal',      keywords: 'notes bookmarks todo personal' },
  { label: 'Settings',          page: 'settings',      keywords: 'profile account security' },
  { label: 'Profile Settings',  page: 'settings',      keywords: 'name email avatar bio' },
  { label: 'Notifications',     page: 'settings',      keywords: 'alerts push notification' },
  { label: 'Access Control',    page: 'settings',      keywords: 'rbac roles admin permissions' },
  { label: 'Add Course',        page: 'learning',      keywords: 'new course create' },
  { label: 'Flashcards',        page: 'learning',      keywords: 'study review cards quiz' },
  { label: 'Study Notes',       page: 'learning',      keywords: 'note write text' },
  { label: 'Quick Notes',       page: 'personal',      keywords: 'sticky note write memo' },
  { label: 'Bookmarks',         page: 'personal',      keywords: 'links saved favorites' },
]

const NOTIF_ICON = {
  info:    { icon: Info,           color: 'var(--cyan)'  },
  success: { icon: CheckCircle,    color: 'var(--green)' },
  warning: { icon: AlertTriangle,  color: 'var(--amber)' },
  error:   { icon: AlertTriangle,  color: 'var(--red)'   },
}

export default function Topbar({ pageTitle, user, roleInfo, onNavigate }) {
  const { logout } = useAuth()
  const [searchOpen,  setSearchOpen]  = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifOpen,   setNotifOpen]   = useState(false)
  const [aiOpen,      setAiOpen]      = useState(false)
  const [notifs,      setNotifs]      = useState(DEFAULT_NOTIFS)
  const searchRef = useRef(null)
  const notifRef  = useRef(null)
  const aiRef     = useRef(null)

  const unreadCount = notifs.filter(n => !n.read).length

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
      if (notifRef.current  && !notifRef.current.contains(e.target))  setNotifOpen(false)
      if (aiRef.current     && !aiRef.current.contains(e.target))     setAiOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Filter search results
  const filteredSearch = searchQuery.trim()
    ? SEARCH_ITEMS.filter(item => {
        const q = searchQuery.toLowerCase()
        return item.label.toLowerCase().includes(q) || item.keywords.includes(q)
      })
    : []

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  const deleteNotif = (id) => setNotifs(prev => prev.filter(n => n.id !== id))
  const clearNotifs = () => setNotifs([])

  return (
    <header className="topbar">
      {/* ── Search bar ── */}
      <div className="topbar-search" ref={searchRef} style={{ position: 'relative' }}>
        <Search size={14} />
        <input
          className="search-input"
          type="search"
          placeholder="Search anything…"
          aria-label="Search"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true) }}
          onFocus={() => setSearchOpen(true)}
        />
        {searchQuery && (
          <button onClick={() => { setSearchQuery(''); setSearchOpen(false) }}
            style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', padding: 2, display: 'flex' }}>
            <X size={14} />
          </button>
        )}

        {/* Search results dropdown */}
        {searchOpen && searchQuery.trim() && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6,
            background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 100, maxHeight: 320, overflowY: 'auto',
            padding: 6,
          }}>
            {filteredSearch.length > 0 ? filteredSearch.map((item, i) => (
              <button key={i} onClick={() => { onNavigate && onNavigate(item.page); setSearchQuery(''); setSearchOpen(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px',
                  background: 'none', border: 'none', color: 'var(--t1)', cursor: 'pointer', borderRadius: 8,
                  fontSize: 13, textAlign: 'left', transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                <Search size={13} style={{ color: 'var(--t3)', flexShrink: 0 }} />
                <span>{item.label}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--fm)' }}>{item.page}</span>
              </button>
            )) : (
              <div style={{ padding: '16px 12px', textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>
                No results for "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      <div className="topbar-right">
        {/* ── Notifications ── */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button className="icon-btn" aria-label="Notifications" style={{ position: 'relative' }}
            onClick={() => { setNotifOpen(!notifOpen); setAiOpen(false) }}>
            <Bell size={15} />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {notifOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 8,
              width: 360, background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 14,
              boxShadow: '0 12px 48px rgba(0,0,0,0.5)', zIndex: 100, overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--fh)', fontWeight: 700, fontSize: 15 }}>Notifications</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead}
                      style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                      Mark all read
                    </button>
                  )}
                  {notifs.length > 0 && (
                    <button onClick={clearNotifs}
                      style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 12 }}>
                      Clear all
                    </button>
                  )}
                </div>
              </div>
              <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                {notifs.length === 0 ? (
                  <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>
                    <Bell size={28} style={{ opacity: 0.3, marginBottom: 10 }} /><br />
                    No notifications
                  </div>
                ) : notifs.map(n => {
                  const { icon: NIcon, color } = NOTIF_ICON[n.type] || NOTIF_ICON.info
                  return (
                    <div key={n.id} style={{
                      display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border)',
                      background: n.read ? 'transparent' : 'rgba(56,189,248,0.04)', cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                    onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(56,189,248,0.04)'}
                    onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <NIcon size={15} style={{ color }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>{n.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.4 }}>{n.body}</div>
                        <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4, fontFamily: 'var(--fm)' }}>
                          <Clock size={10} style={{ marginRight: 4, verticalAlign: -1 }} />{n.time}
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); deleteNotif(n.id) }}
                        style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', padding: 4, opacity: 0.5, alignSelf: 'flex-start' }}>
                        <X size={12} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── AI Status ── */}
        <div ref={aiRef} style={{ position: 'relative' }}>
          <button className="icon-btn" aria-label="AI Status"
            onClick={() => { setAiOpen(!aiOpen); setNotifOpen(false) }}>
            <Cpu size={15} />
          </button>

          {aiOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 8,
              width: 280, background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 14,
              boxShadow: '0 12px 48px rgba(0,0,0,0.5)', zIndex: 100, padding: 16,
            }}>
              <div style={{ fontFamily: 'var(--fh)', fontWeight: 700, fontSize: 14, marginBottom: 14 }}>AI Status</div>
              {[
                { label: 'Model',    value: 'Llama 3.3 70B',   color: 'var(--cyan)' },
                { label: 'Provider', value: 'Groq',            color: 'var(--purple)' },
                { label: 'Status',   value: '● Online',        color: 'var(--green)' },
                { label: 'Latency',  value: '~200ms',          color: 'var(--amber)' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', fontSize: 13 }}>
                  <span style={{ color: 'var(--t3)' }}>{item.label}</span>
                  <span style={{ color: item.color, fontWeight: 600, fontFamily: 'var(--fm)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10 }}>
          <div className="avatar" style={{ width: 28, height: 28, borderRadius: 7, fontSize: 11 }}>
            {user?.avatar || 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>{user?.name?.split(' ')[0]}</span>
            <span style={{ fontSize: 10, color: roleInfo?.color || 'var(--t3)', fontFamily: 'var(--fm)' }}>{roleInfo?.label}</span>
          </div>
          <button onClick={logout} title="Sign out"
            style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2 }}>
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </header>
  )
}
