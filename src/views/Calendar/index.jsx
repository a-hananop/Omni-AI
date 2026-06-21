import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import Card, { CardHeader } from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Modal, { ModalActions } from '../../components/ui/Modal.jsx'
import Input from '../../components/ui/Input.jsx'
import { MONTH_NAMES, DAY_ABBR, todayStr } from '../../utils/helpers.js'

const COLOR_MAP = {
  cyan:   'var(--cyan)',
  red:    'var(--red)',
  amber:  'var(--amber)',
  purple: 'var(--purple)',
  green:  'var(--green)',
  pink:   'var(--pink)',
}

const makeInitialEvents = () => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = (n) => String(Math.min(n, 28)).padStart(2, '0')
  const today = now.getDate()
  return [
    { id: 1, date: `${y}-${m}-${d(today)}`,       title: 'Team Standup',       time: '09:00', color: 'cyan'   },
    { id: 2, date: `${y}-${m}-${d(today + 2)}`,   title: 'Doctor Appointment', time: '14:30', color: 'red'    },
    { id: 3, date: `${y}-${m}-${d(today + 5)}`,   title: 'Project Deadline',   time: '18:00', color: 'amber'  },
    { id: 4, date: `${y}-${m}-${d(today + 8)}`,   title: 'Team Retrospective', time: '15:00', color: 'purple' },
    { id: 5, date: `${y}-${m}-${d(today - 2 < 1 ? 1 : today - 2)}`, title: 'Sprint Planning', time: '10:00', color: 'green' },
  ]
}

export default function CalendarView() {
  const now = new Date()
  const [year,     setYear]     = useState(now.getFullYear())
  const [month,    setMonth]    = useState(now.getMonth())
  const [selected, setSelected] = useState(now.getDate())
  const [events,   setEvents]   = useState(makeInitialEvents)
  const [showAdd,  setShowAdd]  = useState(false)
  const [form, setForm]         = useState({ title: '', time: '09:00', color: 'cyan' })

  const firstDay     = new Date(year, month, 1).getDay()
  const daysInMonth  = new Date(year, month + 1, 0).getDate()

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const dateStr = (d) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  const isToday = (d) => d === now.getDate() && month === now.getMonth() && year === now.getFullYear()
  const hasEvent = (d) => events.some((e) => e.date === dateStr(d))
  const dayEvents = events.filter((e) => e.date === dateStr(selected))

  const prevMonth = () => { if (month === 0)  { setMonth(11); setYear((y) => y - 1) } else setMonth((m) => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0);  setYear((y) => y + 1) } else setMonth((m) => m + 1) }

  const addEvent = () => {
    if (!form.title.trim()) return
    setEvents((prev) => [...prev, { id: Date.now(), ...form, date: dateStr(selected) }])
    setForm({ title: '', time: '09:00', color: 'cyan' })
    setShowAdd(false)
  }

  const deleteEvent = (id) => setEvents((prev) => prev.filter((e) => e.id !== id))

  return (
    <div className="page-enter">
      <div className="section-header">
        <div className="section-title">Calendar</div>
        <div className="section-subtitle">Manage your schedule and events</div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Calendar grid */}
        <Card>
          {/* Month nav */}
          <div className="flex items-center justify-between mb-20">
            <button className="icon-btn" onClick={prevMonth} aria-label="Previous month">
              <ChevronLeft size={15} />
            </button>
            <span className="fw7 f15 font-fh">{MONTH_NAMES[month]} {year}</span>
            <button className="icon-btn" onClick={nextMonth} aria-label="Next month">
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="cal-grid">
            {DAY_ABBR.map((d) => (
              <div key={d} className="cal-day-label">{d}</div>
            ))}
            {cells.map((day, i) => (
              <div
                key={i}
                className={[
                  'cal-day',
                  !day            ? 'other-month'  : '',
                  day && isToday(day)  ? 'today'   : '',
                  day && day === selected ? 'selected' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => day && setSelected(day)}
                role={day ? 'button' : undefined}
                tabIndex={day ? 0 : undefined}
                onKeyDown={(e) => e.key === 'Enter' && day && setSelected(day)}
              >
                {day || ''}
                {day && hasEvent(day) && (
                  <span
                    className="cal-event-dot"
                    style={{ background: events.find((e) => e.date === dateStr(day))?.color ? COLOR_MAP[events.find((e) => e.date === dateStr(day)).color] : 'var(--purple)' }}
                  />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Right panel */}
        <div>
          <Card className="mb-16">
            <CardHeader
              title={`${MONTH_NAMES[month]} ${selected}`}
              action={
                <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => setShowAdd(true)}>
                  Event
                </Button>
              }
            />
            {dayEvents.length === 0 ? (
              <p className="f13 t3 text-center" style={{ padding: '16px 0' }}>No events – click + to add one</p>
            ) : (
              dayEvents.map((e) => (
                <div key={e.id} className="flex items-center gap-12 mb-10"
                  style={{ padding: '10px 12px', background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ width: 4, height: 38, borderRadius: 2, background: COLOR_MAP[e.color], flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="f14 fw6 truncate">{e.title}</div>
                    <div className="f12 t3 font-fm">{e.time}</div>
                  </div>
                  <button className="btn btn-danger btn-xs" onClick={() => deleteEvent(e.id)} aria-label="Delete event">✕</button>
                </div>
              ))
            )}
          </Card>

          <Card>
            <CardHeader title="Upcoming Events" />
            {events
              .slice()
              .sort((a, b) => a.date.localeCompare(b.date))
              .slice(0, 5)
              .map((e) => (
                <div key={e.id} className="flex items-center gap-12 mb-12">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLOR_MAP[e.color], flexShrink: 0, display: 'block' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="f13 fw6 truncate">{e.title}</div>
                    <div className="f12 t3 font-fm">{e.date} · {e.time}</div>
                  </div>
                </div>
              ))}
          </Card>
        </div>
      </div>

      {/* Add Event Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={`Add Event — ${MONTH_NAMES[month]} ${selected}`}>
        <Input label="Event title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="e.g. Team meeting" autoFocus />
        <Input label="Time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} type="time" />
        <div className="input-group">
          <label className="input-label">Color</label>
          <div className="flex gap-10" style={{ marginTop: 4 }}>
            {Object.entries(COLOR_MAP).map(([key, val]) => (
              <div
                key={key}
                onClick={() => setForm({ ...form, color: key })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setForm({ ...form, color: key })}
                style={{
                  width: 28, height: 28, borderRadius: '50%', background: val, cursor: 'pointer',
                  border: form.color === key ? '3px solid #fff' : '3px solid transparent',
                  transition: 'all 0.15s', boxShadow: form.color === key ? `0 0 8px ${val}` : 'none',
                }}
              />
            ))}
          </div>
        </div>
        <ModalActions>
          <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
          <Button variant="primary" onClick={addEvent} disabled={!form.title.trim()}>Add Event</Button>
        </ModalActions>
      </Modal>
    </div>
  )
}
