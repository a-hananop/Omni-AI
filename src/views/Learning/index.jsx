import { useState, useEffect, useRef } from 'react'
import { Plus, BookOpen, Clock, StickyNote, Save, Timer, Target, Award } from 'lucide-react'
import CourseItem from './CourseItem.jsx'
import Flashcard from './Flashcard.jsx'
import Button from '../../components/ui/Button.jsx'
import Modal, { ModalActions } from '../../components/ui/Modal.jsx'
import Input, { SelectInput } from '../../components/ui/Input.jsx'
import Tabs from '../../components/ui/Tabs.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Card, { CardHeader } from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { INITIAL_COURSES, COURSE_CATEGORIES } from '../../data/courses.js'
import { clamp, fmtNum } from '../../utils/helpers.js'

const TABS = [
  { id: 'courses',    label: 'Courses',    icon: BookOpen },
  { id: 'flashcards', label: 'Flashcards', icon: Award    },
  { id: 'notes',      label: 'Notes',      icon: StickyNote },
  { id: 'sessions',   label: 'Progress',   icon: Timer    },
]

const LS_NOTES    = 'omni_notes'
const LS_SESSIONS = 'omni_sessions'

export default function Learning() {
  const [courses,       setCourses]       = useState(INITIAL_COURSES)
  const [tab,           setTab]           = useState('courses')
  const [showAdd,       setShowAdd]       = useState(false)
  const [form,          setForm]          = useState({ name: '', total: '', cat: 'Development' })
  const [selectedCourse,setSelectedCourse]= useState(null)  // for flashcards/notes
  const [notes,         setNotes]         = useState(() => { try { return JSON.parse(localStorage.getItem(LS_NOTES) || '{}') } catch { return {} } })
  const [sessions,      setSessions]      = useState(() => { try { return JSON.parse(localStorage.getItem(LS_SESSIONS) || '[]') } catch { return [] } })
  const [studying,      setStudying]      = useState(null) // { courseId, start }
  const [elapsed,       setElapsed]       = useState(0)
  const timerRef = useRef(null)

  // ── Session timer ─────────────────────────────────────────────────────
  useEffect(() => {
    if (studying) {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - studying.start) / 1000))
      }, 1000)
    } else {
      clearInterval(timerRef.current)
      setElapsed(0)
    }
    return () => clearInterval(timerRef.current)
  }, [studying])

  const startSession = (courseId) => {
    setStudying({ courseId, start: Date.now() })
  }

  const endSession = () => {
    if (!studying) return
    const duration = Math.floor((Date.now() - studying.start) / 1000)
    const newSession = {
      id        : Date.now(),
      courseId  : studying.courseId,
      courseName: courses.find((c) => c.id === studying.courseId)?.name || 'Unknown',
      duration,
      date      : new Date().toLocaleDateString(),
      dateTs    : Date.now(),
    }
    setSessions((prev) => {
      const next = [newSession, ...prev].slice(0, 50)
      localStorage.setItem(LS_SESSIONS, JSON.stringify(next))
      return next
    })
    setStudying(null)
  }

  // ── Notes ─────────────────────────────────────────────────────────────
  const saveNote = (courseId, text) => {
    setNotes((prev) => {
      const next = { ...prev, [courseId]: text }
      localStorage.setItem(LS_NOTES, JSON.stringify(next))
      return next
    })
  }

  // ── Courses ───────────────────────────────────────────────────────────
  const updateCourse = (id, inc) => {
    setCourses((prev) => prev.map((c) => {
      if (c.id !== id) return c
      const done     = clamp(c.done + inc, 0, c.total)
      const progress = Math.round((done / c.total) * 100)
      return { ...c, done, progress }
    }))
  }

  const addCourse = () => {
    if (!form.name.trim() || !form.total) return
    setCourses((prev) => [...prev, {
      id: Date.now(), name: form.name.trim(),
      total: Number(form.total), done: 0, progress: 0, cat: form.cat,
    }])
    setForm({ name: '', total: '', cat: 'Development' })
    setShowAdd(false)
  }

  // ── Stats ─────────────────────────────────────────────────────────────
  const totalStudyTime = sessions.reduce((sum, s) => sum + s.duration, 0)
  const fmtTime = (s) => s >= 3600 ? `${Math.floor(s/3600)}h ${Math.floor((s%3600)/60)}m` : `${Math.floor(s/60)}m ${s%60}s`

  const activeCourse = selectedCourse ? courses.find((c) => c.id === selectedCourse) : null

  return (
    <div className="page-enter">
      <div className="section-header flex items-center justify-between">
        <div>
          <div className="section-title">Learning</div>
          <div className="section-subtitle">{courses.length} courses · {courses.filter((c) => c.progress === 100).length} completed · {fmtTime(totalStudyTime)} studied</div>
        </div>
        <div className="flex gap-8">
          {studying && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)', borderRadius: 10, padding: '7px 14px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', animation: 'pulse 1s infinite' }} />
              <span className="font-fm f13 t-cyan">{fmtTime(elapsed)}</span>
              <Button variant="danger" size="xs" onClick={endSession}>Stop</Button>
            </div>
          )}
          {tab === 'courses' && (
            <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setShowAdd(true)}>
              Add Course
            </Button>
          )}
        </div>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} className="mb-24" />

      {/* ── Courses tab ── */}
      {tab === 'courses' && (
        courses.length === 0 ? (
          <EmptyState icon={BookOpen} message="No courses yet" sub="Add your first course to start tracking" />
        ) : (
          courses.map((c) => (
            <div key={c.id} style={{ position: 'relative' }}>
              <CourseItem course={c} onUpdate={updateCourse} />
              <div style={{ position: 'absolute', top: 16, right: 20, display: 'flex', gap: 6 }}>
                {studying?.courseId === c.id ? (
                  <Button variant="danger" size="xs" onClick={endSession}><Clock size={11} /> Stop</Button>
                ) : (
                  <Button variant="ghost" size="xs" onClick={() => startSession(c.id)}><Clock size={11} /> Study</Button>
                )}
                <Button variant="ghost" size="xs" onClick={() => { setSelectedCourse(c.id); setTab('flashcards') }}>Flashcards</Button>
                <Button variant="ghost" size="xs" onClick={() => { setSelectedCourse(c.id); setTab('notes') }}>Notes</Button>
              </div>
            </div>
          ))
        )
      )}

      {/* ── Flashcards tab ── */}
      {tab === 'flashcards' && (
        <div>
          {/* Course selector */}
          <div className="flex gap-8 mb-20" style={{ flexWrap: 'wrap' }}>
            <button className={`btn btn-sm ${!selectedCourse ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setSelectedCourse(null)}>
              All Courses
            </button>
            {courses.map((c) => (
              <button key={c.id} className={`btn btn-sm ${selectedCourse === c.id ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setSelectedCourse(c.id)}>
                {c.name}
              </button>
            ))}
          </div>
          <Flashcard courseId={selectedCourse} courseName={activeCourse?.name} />
        </div>
      )}

      {/* ── Notes tab ── */}
      {tab === 'notes' && (
        <div>
          {/* Course selector for notes */}
          <div className="flex gap-8 mb-20" style={{ flexWrap: 'wrap' }}>
            {courses.map((c) => (
              <button key={c.id} className={`btn btn-sm ${selectedCourse === c.id ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setSelectedCourse(c.id)}>
                {c.name}
                {notes[c.id] && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', marginLeft: 4, display: 'inline-block' }} />}
              </button>
            ))}
          </div>

          {selectedCourse ? (
            <NoteEditor
              courseId={selectedCourse}
              courseName={activeCourse?.name}
              value={notes[selectedCourse] || ''}
              onSave={(text) => saveNote(selectedCourse, text)}
            />
          ) : (
            <EmptyState icon={StickyNote} message="Select a course to view notes" />
          )}
        </div>
      )}

      {/* ── Sessions/Progress tab ── */}
      {tab === 'sessions' && (
        <div>
          {/* Summary cards */}
          <div className="grid-4 mb-20">
            {[
              { label: 'Total Study Time', value: fmtTime(totalStudyTime), icon: Clock, color: 'var(--cyan)' },
              { label: 'Sessions',         value: sessions.length,          icon: Timer, color: 'var(--purple)' },
              { label: 'Avg Session',      value: sessions.length ? fmtTime(Math.floor(totalStudyTime / sessions.length)) : '0m', icon: Target, color: 'var(--amber)' },
              { label: 'Courses Active',   value: courses.filter((c) => c.progress > 0 && c.progress < 100).length, icon: BookOpen, color: 'var(--green)' },
            ].map((s, i) => (
              <div key={i} className="card card-p" style={{ textAlign: 'center' }}>
                <s.icon size={20} style={{ color: s.color, margin: '0 auto 10px' }} />
                <div style={{ fontFamily: 'var(--fh)', fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{s.value}</div>
                <div className="f12 t3">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Sessions list */}
          <Card>
            <CardHeader title="Recent Study Sessions" />
            {sessions.length === 0 ? (
              <EmptyState icon={Clock} message="No sessions recorded yet" sub="Click 'Study' on any course to start a session" />
            ) : (
              sessions.slice(0, 20).map((s) => (
                <div key={s.id} className="flex items-center gap-12 mb-10" style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cyan)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="f14 fw6">{s.courseName}</div>
                    <div className="f12 t3">{s.date}</div>
                  </div>
                  <Badge variant="cyan">{fmtTime(s.duration)}</Badge>
                </div>
              ))
            )}
          </Card>
        </div>
      )}

      {/* Add Course Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Course">
        <Input label="Course name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Advanced Python" autoFocus />
        <Input label="Total lessons" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} placeholder="e.g. 40" type="number" min="1" />
        <SelectInput label="Category" value={form.cat} onChange={(v) => setForm({ ...form, cat: v })} options={COURSE_CATEGORIES} />
        <ModalActions>
          <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
          <Button variant="primary" onClick={addCourse} disabled={!form.name.trim() || !form.total}>Add Course</Button>
        </ModalActions>
      </Modal>
    </div>
  )
}

// ── NoteEditor sub-component ─────────────────────────────────────────────────
function NoteEditor({ courseId, courseName, value, onSave }) {
  const [text,   setText]   = useState(value)
  const [saved,  setSaved]  = useState(false)

  useEffect(() => { setText(value) }, [courseId, value])

  const save = () => {
    onSave(text)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Card>
      <CardHeader
        title={`Notes – ${courseName || 'Course'}`}
        action={
          <Button variant={saved ? 'success' : 'primary'} size="sm" icon={<Save size={13} />} onClick={save}>
            {saved ? 'Saved!' : 'Save Notes'}
          </Button>
        }
      />
      <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 10 }}>
        Supports plain text. Your notes are saved locally in your browser.
      </div>
      <textarea
        className="input"
        rows={18}
        placeholder={`Write your notes for ${courseName || 'this course'} here…\n\nTip: use headers like == Chapter 1 ==, bullet points with -, code blocks with backticks.`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); save() } }}
        style={{ resize: 'vertical', fontFamily: 'var(--fm)', fontSize: 13, lineHeight: 1.7, minHeight: 360 }}
      />
      <div className="flex justify-between mt-8" style={{ marginTop: 8 }}>
        <span className="f12 t3">{text.length} characters · {text.split('\n').length} lines · Ctrl+S to save</span>
        {text !== value && <span className="f12" style={{ color: 'var(--amber)' }}>● Unsaved changes</span>}
      </div>
    </Card>
  )
}
