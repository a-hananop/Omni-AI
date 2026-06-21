import { useState, useEffect } from 'react'
import {
  StickyNote, Plus, Trash2, BookmarkPlus, ExternalLink, CheckSquare,
  Star, Edit3, Save, X, Clock, Hash, Folder, ArrowRight
} from 'lucide-react'
import Card, { CardHeader } from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Tabs from '../../components/ui/Tabs.jsx'

const LS_QNOTES     = 'omni_quick_notes'
const LS_BOOKMARKS   = 'omni_bookmarks'
const LS_PERSONAL_TODOS = 'omni_personal_todos'
const LS_JOURNAL     = 'omni_journal'

const TABS = [
  { id: 'notes',     label: 'Quick Notes',  icon: StickyNote },
  { id: 'todos',     label: 'Personal To-Do', icon: CheckSquare },
  { id: 'bookmarks', label: 'Bookmarks',    icon: BookmarkPlus },
  { id: 'journal',   label: 'Journal',      icon: Edit3 },
]

const NOTE_COLORS = [
  'rgba(56,189,248,0.12)',
  'rgba(167,139,250,0.12)',
  'rgba(251,191,36,0.12)',
  'rgba(52,211,153,0.12)',
  'rgba(248,113,113,0.12)',
  'rgba(244,114,182,0.12)',
]

export default function PersonalSpace() {
  const [tab, setTab] = useState('notes')
  // ── Quick Notes ──
  const [notes, setNotes] = useState(() => { try { return JSON.parse(localStorage.getItem(LS_QNOTES) || '[]') } catch { return [] } })
  const [newNote, setNewNote] = useState('')
  // ── Personal Todos ──
  const [todos, setTodos] = useState(() => { try { return JSON.parse(localStorage.getItem(LS_PERSONAL_TODOS) || '[]') } catch { return [] } })
  const [newTodo, setNewTodo] = useState('')
  // ── Bookmarks ──
  const [bookmarks, setBookmarks] = useState(() => { try { return JSON.parse(localStorage.getItem(LS_BOOKMARKS) || '[]') } catch { return [] } })
  const [bmForm, setBmForm] = useState({ title: '', url: '' })
  const [showBmForm, setShowBmForm] = useState(false)
  // ── Journal ──
  const [journal, setJournal] = useState(() => { try { return JSON.parse(localStorage.getItem(LS_JOURNAL) || '[]') } catch { return [] } })
  const [journalText, setJournalText] = useState('')
  const [journalMood, setJournalMood] = useState('😊')

  // Persist
  useEffect(() => localStorage.setItem(LS_QNOTES, JSON.stringify(notes)), [notes])
  useEffect(() => localStorage.setItem(LS_PERSONAL_TODOS, JSON.stringify(todos)), [todos])
  useEffect(() => localStorage.setItem(LS_BOOKMARKS, JSON.stringify(bookmarks)), [bookmarks])
  useEffect(() => localStorage.setItem(LS_JOURNAL, JSON.stringify(journal)), [journal])

  // ── Notes ─────────────────────────────────────────────────────────────
  const addNote = () => {
    if (!newNote.trim()) return
    const color = NOTE_COLORS[notes.length % NOTE_COLORS.length]
    setNotes(prev => [{ id: Date.now(), text: newNote.trim(), color, created: new Date().toLocaleString(), pinned: false }, ...prev])
    setNewNote('')
  }
  const deleteNote = (id) => setNotes(prev => prev.filter(n => n.id !== id))
  const togglePin = (id) => setNotes(prev => {
    const updated = prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n)
    return [...updated.filter(n => n.pinned), ...updated.filter(n => !n.pinned)]
  })

  // ── Todos ─────────────────────────────────────────────────────────────
  const addTodo = () => {
    if (!newTodo.trim()) return
    setTodos(prev => [{ id: Date.now(), text: newTodo.trim(), done: false, created: new Date().toLocaleDateString() }, ...prev])
    setNewTodo('')
  }
  const toggleTodo = (id) => setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const deleteTodo = (id) => setTodos(prev => prev.filter(t => t.id !== id))

  // ── Bookmarks ─────────────────────────────────────────────────────────
  const addBookmark = () => {
    if (!bmForm.title.trim() || !bmForm.url.trim()) return
    let url = bmForm.url.trim()
    if (!url.startsWith('http')) url = 'https://' + url
    setBookmarks(prev => [{ id: Date.now(), title: bmForm.title.trim(), url, created: new Date().toLocaleDateString() }, ...prev])
    setBmForm({ title: '', url: '' })
    setShowBmForm(false)
  }
  const deleteBookmark = (id) => setBookmarks(prev => prev.filter(b => b.id !== id))

  // ── Journal ───────────────────────────────────────────────────────────
  const addJournalEntry = () => {
    if (!journalText.trim()) return
    setJournal(prev => [{
      id: Date.now(), text: journalText.trim(), mood: journalMood,
      date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }, ...prev])
    setJournalText('')
  }

  const stats = {
    notes: notes.length,
    todos: todos.filter(t => !t.done).length,
    done: todos.filter(t => t.done).length,
    bookmarks: bookmarks.length,
    entries: journal.length,
  }

  return (
    <div className="page-enter">
      <div className="section-header flex items-center justify-between">
        <div>
          <div className="section-title">My Space</div>
          <div className="section-subtitle">{stats.notes} notes · {stats.todos} pending · {stats.bookmarks} bookmarks · {stats.entries} journal entries</div>
        </div>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} className="mb-24" />

      {/* ── Quick Notes Tab ── */}
      {tab === 'notes' && (
        <div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <input
              className="input" placeholder="Write a quick note…" value={newNote}
              onChange={e => setNewNote(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addNote()}
              style={{ flex: 1 }}
            />
            <Button variant="primary" onClick={addNote} icon={<Plus size={14} />} disabled={!newNote.trim()}>Add</Button>
          </div>
          {notes.length === 0 ? (
            <EmptyState icon={StickyNote} message="No notes yet" sub="Type a note above and press Enter" />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {notes.map(n => (
                <div key={n.id} className="card" style={{ padding: 16, background: n.color, borderLeft: n.pinned ? '3px solid var(--amber)' : 'none', position: 'relative', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--t1)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {n.text}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                    <span style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--fm)' }}>
                      <Clock size={10} style={{ marginRight: 4, verticalAlign: -1 }} />{n.created}
                    </span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => togglePin(n.id)} title={n.pinned ? 'Unpin' : 'Pin'}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: n.pinned ? 'var(--amber)' : 'var(--t3)', padding: 4 }}>
                        <Star size={13} fill={n.pinned ? 'var(--amber)' : 'none'} />
                      </button>
                      <button onClick={() => deleteNote(n.id)} title="Delete"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', padding: 4 }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Personal To-Do Tab ── */}
      {tab === 'todos' && (
        <div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <input
              className="input" placeholder="Add a personal to-do…" value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTodo()}
              style={{ flex: 1 }}
            />
            <Button variant="primary" onClick={addTodo} icon={<Plus size={14} />} disabled={!newTodo.trim()}>Add</Button>
          </div>

          {stats.done > 0 && (
            <div style={{ marginBottom: 14, display: 'flex', gap: 8 }}>
              <Badge variant="green">{stats.done} done</Badge>
              <Badge variant="cyan">{stats.todos} pending</Badge>
            </div>
          )}

          {todos.length === 0 ? (
            <EmptyState icon={CheckSquare} message="No personal to-dos" sub="Add items to your personal checklist" />
          ) : (
            <Card>
              {todos.map((t, i) => (
                <div key={t.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  borderBottom: i < todos.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <button onClick={() => toggleTodo(t.id)}
                    style={{
                      width: 22, height: 22, borderRadius: 6, flexShrink: 0, cursor: 'pointer',
                      border: t.done ? 'none' : '2px solid var(--border2)',
                      background: t.done ? 'var(--green)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                    }}>
                    {t.done && <span style={{ fontSize: 12 }}>✓</span>}
                  </button>
                  <span style={{ flex: 1, fontSize: 14, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'var(--t3)' : 'var(--t1)' }}>
                    {t.text}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--fm)' }}>{t.created}</span>
                  <button onClick={() => deleteTodo(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', padding: 4 }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </Card>
          )}
        </div>
      )}

      {/* ── Bookmarks Tab ── */}
      {tab === 'bookmarks' && (
        <div>
          <div style={{ marginBottom: 20 }}>
            {!showBmForm ? (
              <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setShowBmForm(true)}>Add Bookmark</Button>
            ) : (
              <Card>
                <div style={{ padding: 16, display: 'flex', gap: 10, alignItems: 'end' }}>
                  <div style={{ flex: 1 }}>
                    <label className="input-label">Title</label>
                    <input className="input" placeholder="e.g. MDN Docs" value={bmForm.title}
                      onChange={e => setBmForm({ ...bmForm, title: e.target.value })} autoFocus />
                  </div>
                  <div style={{ flex: 2 }}>
                    <label className="input-label">URL</label>
                    <input className="input" placeholder="https://example.com" value={bmForm.url}
                      onChange={e => setBmForm({ ...bmForm, url: e.target.value })}
                      onKeyDown={e => e.key === 'Enter' && addBookmark()} />
                  </div>
                  <Button variant="primary" onClick={addBookmark} disabled={!bmForm.title.trim() || !bmForm.url.trim()}>Save</Button>
                  <Button variant="ghost" onClick={() => setShowBmForm(false)}><X size={14} /></Button>
                </div>
              </Card>
            )}
          </div>

          {bookmarks.length === 0 ? (
            <EmptyState icon={BookmarkPlus} message="No bookmarks yet" sub="Save your favorite links here" />
          ) : (
            <Card>
              {bookmarks.map((b, i) => (
                <div key={b.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  borderBottom: i < bookmarks.length - 1 ? '1px solid var(--border)' : 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(56,189,248,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ExternalLink size={14} style={{ color: 'var(--cyan)' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)' }}>{b.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--t3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.url}</div>
                  </div>
                  <a href={b.url} target="_blank" rel="noopener noreferrer"
                    style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 8, padding: '6px 12px', color: 'var(--cyan)', textDecoration: 'none', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    Open <ArrowRight size={11} />
                  </a>
                  <button onClick={() => deleteBookmark(b.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', padding: 4 }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </Card>
          )}
        </div>
      )}

      {/* ── Journal Tab ── */}
      {tab === 'journal' && (
        <div>
          <Card>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <div>
                  <label className="input-label">Mood</label>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    {['😊', '😐', '😔', '😤', '🤩', '😴'].map(m => (
                      <button key={m} onClick={() => setJournalMood(m)}
                        style={{
                          fontSize: 22, padding: 4, borderRadius: 8, cursor: 'pointer',
                          border: journalMood === m ? '2px solid var(--cyan)' : '2px solid transparent',
                          background: journalMood === m ? 'rgba(56,189,248,0.1)' : 'transparent',
                        }}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <textarea
                className="input" rows={4} placeholder="How was your day? Write your thoughts…"
                value={journalText} onChange={e => setJournalText(e.target.value)}
                style={{ resize: 'vertical', fontFamily: 'var(--fm)', fontSize: 13, lineHeight: 1.7 }}
              />
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="primary" icon={<Save size={13} />} onClick={addJournalEntry} disabled={!journalText.trim()}>
                  Save Entry
                </Button>
              </div>
            </div>
          </Card>

          <div style={{ marginTop: 20 }}>
            {journal.length === 0 ? (
              <EmptyState icon={Edit3} message="No journal entries" sub="Start writing about your day" />
            ) : journal.map((entry, i) => (
              <div key={entry.id} className="card" style={{ padding: 16, marginBottom: 12, position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 22 }}>{entry.mood}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>{entry.date}</div>
                    <div style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--fm)' }}>{entry.time}</div>
                  </div>
                  <button onClick={() => setJournal(prev => prev.filter(j => j.id !== entry.id))}
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', padding: 4 }}>
                    <Trash2 size={13} />
                  </button>
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--t2)', whiteSpace: 'pre-wrap' }}>{entry.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
