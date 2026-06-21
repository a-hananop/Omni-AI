import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Edit3, Trash2, X, Check } from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Modal, { ModalActions } from '../../components/ui/Modal.jsx'
import { COURSE_FLASHCARDS, DEFAULT_FLASHCARDS } from '../../data/flashcards.js'

export default function Flashcard({ courseId, courseName }) {
  // Load cards for this course or default
  const base = COURSE_FLASHCARDS[courseId] || DEFAULT_FLASHCARDS
  const [cards,       setCards]       = useState(base)
  const [idx,         setIdx]         = useState(0)
  const [showAnswer,  setShowAnswer]  = useState(false)
  const [known,       setKnown]       = useState(new Set())
  const [showAdd,     setShowAdd]     = useState(false)
  const [editCard,    setEditCard]    = useState(null) // card being edited
  const [form,        setForm]        = useState({ q: '', a: '' })

  const total = cards.length
  const card  = cards[idx]

  const next = () => { setIdx((i) => (i + 1) % total); setShowAnswer(false) }
  const prev = () => { setIdx((i) => (i - 1 + total) % total); setShowAnswer(false) }

  const markKnown = () => { setKnown((k) => { const n = new Set(k); n.add(card.id); return n }); next() }
  const markUnknown = () => { setKnown((k) => { const n = new Set(k); n.delete(card.id); return n }); next() }

  const addCard = () => {
    if (!form.q.trim() || !form.a.trim()) return
    setCards((prev) => [...prev, { id: `custom-${Date.now()}`, q: form.q.trim(), a: form.a.trim() }])
    setForm({ q: '', a: '' })
    setShowAdd(false)
  }

  const saveEdit = () => {
    if (!form.q.trim() || !form.a.trim()) return
    setCards((prev) => prev.map((c) => c.id === editCard.id ? { ...c, q: form.q, a: form.a } : c))
    setEditCard(null)
    setForm({ q: '', a: '' })
  }

  const deleteCard = (id) => {
    setCards((prev) => {
      const next = prev.filter((c) => c.id !== id)
      if (idx >= next.length) setIdx(Math.max(0, next.length - 1))
      return next
    })
    setShowAnswer(false)
  }

  const openEdit = (c) => {
    setEditCard(c)
    setForm({ q: c.q, a: c.a })
  }

  if (total === 0) return (
    <Card className="mb-0" style={{ textAlign: 'center', padding: 40 }}>
      <p className="t3 mb-16">No flashcards yet for this course.</p>
      <Button variant="primary" icon={<Plus size={14} />} onClick={() => setShowAdd(true)}>Add Flashcard</Button>
    </Card>
  )

  return (
    <>
      <Card className="mb-0" style={{ maxWidth: 580, margin: '0 auto' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <div>
            <span className="f12 t3">Card {idx + 1} / {total}</span>
            {courseName && <span className="f12 t3"> · {courseName}</span>}
          </div>
          <div className="flex gap-8">
            <Badge variant="green">{known.size} known</Badge>
            <Badge variant="amber">{total - known.size} left</Badge>
            <Button variant="ghost" size="xs" icon={<Plus size={12} />} onClick={() => { setForm({ q:'', a:'' }); setShowAdd(true) }}>Add</Button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: 'var(--bg2)', borderRadius: 2, marginBottom: 24 }}>
          <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, var(--cyan), var(--purple))', width: `${((idx + 1) / total) * 100}%`, transition: 'width 0.4s var(--ease)' }} />
        </div>

        {/* Card face */}
        <div style={{
          minHeight: 160, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', textAlign: 'center', padding: '0 12px', gap: 16,
        }}>
          <div style={{ fontSize: 11, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'var(--fm)' }}>QUESTION</div>
          <div className="fw7 f16 font-fh lh-16">{card.q}</div>

          {!showAnswer ? (
            <Button variant="ghost" onClick={() => setShowAnswer(true)}>Reveal Answer</Button>
          ) : (
            <div className="anim-fade-up" style={{ width: '100%' }}>
              <div style={{ fontSize: 11, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'var(--fm)', marginBottom: 8 }}>ANSWER</div>
              <div className="f14 lh-16" style={{ color: 'var(--green)' }}>{card.a}</div>
              {card.id?.startsWith('custom') && (
                <Badge variant="purple" className="mt-8" style={{ marginTop: 8 }}>Custom</Badge>
              )}
            </div>
          )}
        </div>

        <hr className="divider" style={{ margin: '18px 0' }} />

        {/* Navigation + actions */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" icon={<ChevronLeft size={14} />} onClick={prev}>Prev</Button>

          {showAnswer && (
            <div className="flex gap-8">
              <button onClick={markUnknown}
                style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(248,113,113,0.25)', background: 'rgba(248,113,113,0.1)', color: 'var(--red)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                <X size={13} /> Still learning
              </button>
              <button onClick={markKnown}
                style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(52,211,153,0.25)', background: 'rgba(52,211,153,0.1)', color: 'var(--green)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Check size={13} /> Got it!
              </button>
            </div>
          )}

          <div className="flex gap-6">
            <button title="Edit" onClick={() => openEdit(card)}
              style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t3)' }}>
              <Edit3 size={13} />
            </button>
            <button title="Delete" onClick={() => deleteCard(card.id)}
              style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)' }}>
              <Trash2 size={13} />
            </button>
            <Button variant="ghost" size="sm" iconRight={<ChevronRight size={14} />} onClick={next}>Next</Button>
          </div>
        </div>

        {/* All cards list */}
        <details style={{ marginTop: 20 }}>
          <summary style={{ fontSize: 12, color: 'var(--t3)', cursor: 'pointer', padding: '6px 0', listStyle: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>▸</span> View all {total} cards
          </summary>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {cards.map((c, i) => (
              <div key={c.id} onClick={() => { setIdx(i); setShowAnswer(false) }}
                style={{
                  padding: '8px 12px', borderRadius: 8, border: `1px solid ${i === idx ? 'var(--border2)' : 'var(--border)'}`,
                  background: i === idx ? 'rgba(56,189,248,0.07)' : 'var(--bg2)',
                  cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center',
                }}>
                <span style={{ fontFamily: 'var(--fm)', fontSize: 11, color: 'var(--t3)', flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 13, flex: 1 }}>{c.q}</span>
                {known.has(c.id) && <Badge variant="green">✓</Badge>}
                <button onClick={(e) => { e.stopPropagation(); openEdit(c) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', padding: 2 }}>
                  <Edit3 size={12} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); deleteCard(c.id) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', padding: 2 }}>
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </details>
      </Card>

      {/* Add flashcard modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Flashcard">
        <div className="input-group">
          <label className="input-label">Question</label>
          <textarea className="input" rows={3} placeholder="Enter question…"
            value={form.q} onChange={(e) => setForm({ ...form, q: e.target.value })}
            style={{ resize: 'vertical' }} />
        </div>
        <div className="input-group">
          <label className="input-label">Answer</label>
          <textarea className="input" rows={4} placeholder="Enter answer…"
            value={form.a} onChange={(e) => setForm({ ...form, a: e.target.value })}
            style={{ resize: 'vertical' }} />
        </div>
        <ModalActions>
          <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
          <Button variant="primary" onClick={addCard} disabled={!form.q.trim() || !form.a.trim()}>Add Card</Button>
        </ModalActions>
      </Modal>

      {/* Edit flashcard modal */}
      <Modal open={!!editCard} onClose={() => setEditCard(null)} title="Edit Flashcard">
        <div className="input-group">
          <label className="input-label">Question</label>
          <textarea className="input" rows={3} value={form.q} onChange={(e) => setForm({ ...form, q: e.target.value })} style={{ resize: 'vertical' }} />
        </div>
        <div className="input-group">
          <label className="input-label">Answer</label>
          <textarea className="input" rows={4} value={form.a} onChange={(e) => setForm({ ...form, a: e.target.value })} style={{ resize: 'vertical' }} />
        </div>
        <ModalActions>
          <Button variant="ghost" onClick={() => setEditCard(null)}>Cancel</Button>
          <Button variant="primary" onClick={saveEdit} disabled={!form.q.trim() || !form.a.trim()}>Save Changes</Button>
        </ModalActions>
      </Modal>
    </>
  )
}
