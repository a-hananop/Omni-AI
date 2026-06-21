import { useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { Activity, Droplets, Moon, Smile, Plus, Flame } from 'lucide-react'
import Card, { CardHeader } from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Modal, { ModalActions } from '../../components/ui/Modal.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import Input from '../../components/ui/Input.jsx'
import { HEALTH_WEEK, DEFAULT_TODAY, GOALS, MOOD_LABELS, MOOD_EMOJI } from '../../data/health.js'
import { CHART_TOOLTIP, AXIS_TICK, pct, fmtNum } from '../../utils/helpers.js'

export default function Health() {
  const [today, setToday] = useState(DEFAULT_TODAY)
  const [showLog, setShowLog] = useState(false)
  const [form, setForm] = useState({ steps: '', water: '', sleep: '', mood: 4, calories: '' })

  const logHealth = () => {
    setToday((prev) => ({
      steps:    form.steps    ? Number(form.steps)    : prev.steps,
      water:    form.water    ? Number(form.water)    : prev.water,
      sleep:    form.sleep    ? Number(form.sleep)    : prev.sleep,
      mood:     form.mood,
      calories: form.calories ? Number(form.calories) : prev.calories,
    }))
    setShowLog(false)
    setForm({ steps: '', water: '', sleep: '', mood: 4, calories: '' })
  }

  const metrics = [
    {
      label: 'Steps',    value: fmtNum(today.steps), icon: Activity,  color: 'var(--cyan)',
      sub: `Goal: ${fmtNum(GOALS.steps)}`,   pct: pct(today.steps, GOALS.steps),    bg: 'rgba(56,189,248,0.12)',
    },
    {
      label: 'Water',    value: `${today.water} glasses`, icon: Droplets, color: 'var(--green)',
      sub: `Goal: ${GOALS.water} glasses`,   pct: pct(today.water, GOALS.water),    bg: 'rgba(52,211,153,0.12)',
    },
    {
      label: 'Sleep',    value: `${today.sleep}h`, icon: Moon,    color: 'var(--purple)',
      sub: `Goal: ${GOALS.sleep} hours`,     pct: pct(today.sleep, GOALS.sleep),    bg: 'rgba(167,139,250,0.12)',
    },
    {
      label: 'Mood',     value: MOOD_EMOJI[today.mood], icon: Smile,   color: 'var(--amber)',
      sub: MOOD_LABELS[today.mood],          pct: pct(today.mood, GOALS.mood),      bg: 'rgba(251,191,36,0.12)',
    },
    {
      label: 'Calories', value: fmtNum(today.calories), icon: Flame,   color: 'var(--orange)',
      sub: `Goal: ${fmtNum(GOALS.calories)} kcal`, pct: pct(today.calories, GOALS.calories), bg: 'rgba(251,146,60,0.12)',
    },
  ]

  return (
    <div className="page-enter">
      <div className="section-header flex items-center justify-between">
        <div>
          <div className="section-title">Health & Lifestyle</div>
          <div className="section-subtitle">Track your daily wellbeing</div>
        </div>
        <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setShowLog(true)}>
          Log Today
        </Button>
      </div>

      {/* Metric cards */}
      <div className="grid-auto-200 mb-20" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))' }}>
        {metrics.map((m, i) => (
          <div key={i} className="card card-p" style={{ textAlign: 'center' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%', background: m.bg,
              margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <m.icon size={22} style={{ color: m.color }} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--fh)', marginBottom: 4 }}>{m.value}</div>
            <div className="f13 t2 mb-12">{m.label}</div>
            <ProgressBar value={m.pct} max={100} color={m.color} />
            <div className="f12 t3 mt-6">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid-2">
        <Card>
          <CardHeader title="Steps This Week" action={<Badge variant="cyan">7 days</Badge>} />
          <ResponsiveContainer width="100%" height={185}>
            <BarChart data={HEALTH_WEEK} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <Tooltip {...CHART_TOOLTIP} />
              <Bar dataKey="steps" fill="rgba(56,189,248,0.65)" radius={[5, 5, 0, 0]} name="Steps" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader title="Sleep Pattern" action={<Badge variant="purple">7 days</Badge>} />
          <ResponsiveContainer width="100%" height={185}>
            <LineChart data={HEALTH_WEEK}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <YAxis domain={[5, 10]} tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <Tooltip {...CHART_TOOLTIP} />
              <Line
                type="monotone" dataKey="sleep" stroke="var(--purple)"
                strokeWidth={2.5} dot={{ fill: 'var(--purple)', r: 4, strokeWidth: 0 }}
                name="Sleep (hrs)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Log Modal */}
      <Modal open={showLog} onClose={() => setShowLog(false)} title="Log Today's Health">
        <Input label="Steps" value={form.steps} onChange={(e) => setForm({ ...form, steps: e.target.value })}
          placeholder={`Current: ${fmtNum(today.steps)}`} type="number" />
        <Input label="Water Glasses" value={form.water} onChange={(e) => setForm({ ...form, water: e.target.value })}
          placeholder={`Current: ${today.water}`} type="number" />
        <Input label="Sleep Hours" value={form.sleep} onChange={(e) => setForm({ ...form, sleep: e.target.value })}
          placeholder={`Current: ${today.sleep}`} type="number" step="0.5" />
        <Input label="Calories" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })}
          placeholder={`Current: ${fmtNum(today.calories)}`} type="number" />
        <div className="input-group">
          <label className="input-label">Mood</label>
          <div className="flex gap-6">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n}
                className={`btn ${form.mood === n ? 'btn-primary' : 'btn-ghost'}`}
                style={{ flex: 1, fontSize: 20, padding: '8px 4px' }}
                onClick={() => setForm({ ...form, mood: n })}
              >
                {MOOD_EMOJI[n]}
              </button>
            ))}
          </div>
        </div>
        <ModalActions>
          <Button variant="ghost" onClick={() => setShowLog(false)}>Cancel</Button>
          <Button variant="primary" onClick={logHealth}>Save Log</Button>
        </ModalActions>
      </Modal>
    </div>
  )
}
