import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { CheckSquare, Clock, Activity, Target } from 'lucide-react'
import StatCard from '../../components/ui/StatCard.jsx'
import Card, { CardHeader } from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { PriorityBadge } from '../../components/ui/Badge.jsx'
import { CHART_TOOLTIP, AXIS_TICK, fmtNum } from '../../utils/helpers.js'
import { HEALTH_WEEK } from '../../data/health.js'

const ACTIVITY = [
  { name: 'Mon', tasks: 3, focus: 2.5 },
  { name: 'Tue', tasks: 5, focus: 4.0 },
  { name: 'Wed', tasks: 2, focus: 1.5 },
  { name: 'Thu', tasks: 7, focus: 5.5 },
  { name: 'Fri', tasks: 4, focus: 3.0 },
  { name: 'Sat', tasks: 6, focus: 4.5 },
  { name: 'Sun', tasks: 3, focus: 2.0 },
]

export default function Dashboard({ tasks }) {
  const done    = tasks.filter((t) => t.done).length
  const pending = tasks.filter((t) => !t.done).length

  const stats = [
    { label: 'Tasks Done',    value: done,         change: '+12% this week', up: true,  icon: CheckSquare, color: 'var(--green)',  bg: 'rgba(52,211,153,0.12)'  },
    { label: 'Pending Tasks', value: pending,      change: `${pending} left`,up: false, icon: Clock,       color: 'var(--amber)',  bg: 'rgba(251,191,36,0.12)'  },
    { label: 'Steps Today',   value: fmtNum(8420), change: '+840 steps',     up: true,  icon: Activity,    color: 'var(--cyan)',   bg: 'rgba(56,189,248,0.12)'  },
    { label: 'Focus Hours',   value: '4.5h',       change: '+0.5h today',    up: true,  icon: Target,      color: 'var(--purple)', bg: 'rgba(167,139,250,0.12)' },
  ]

  return (
    <div className="page-enter">
      <div className="section-header">
        <div className="section-title">Good morning, Alex 👋</div>
        <div className="section-subtitle">Here's your daily overview — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
      </div>

      {/* Stats row */}
      <div className="grid-auto-200 mb-24">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid-2 mb-20">
        <Card>
          <CardHeader title="Weekly Activity" action={<Badge variant="cyan">This Week</Badge>} />
          <ResponsiveContainer width="100%" height={185}>
            <AreaChart data={ACTIVITY}>
              <defs>
                <linearGradient id="gCyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--cyan)"   stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--cyan)"   stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="gPurp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--purple)" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="var(--purple)" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <Tooltip {...CHART_TOOLTIP} />
              <Area type="monotone" dataKey="tasks" stroke="var(--cyan)"   strokeWidth={2} fill="url(#gCyan)" name="Tasks"       />
              <Area type="monotone" dataKey="focus" stroke="var(--purple)" strokeWidth={2} fill="url(#gPurp)" name="Focus (hrs)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader
            title="Today's Priorities"
            action={
              <Badge variant="red">
                {tasks.filter((t) => t.priority === 'high' && !t.done).length} High
              </Badge>
            }
          />
          <div style={{ maxHeight: 195, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tasks.filter((t) => !t.done).slice(0, 6).map((t) => (
              <div key={t.id} className="flex items-center gap-10">
                <div style={{
                  width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                  background: t.priority === 'high' ? 'var(--red)' : t.priority === 'medium' ? 'var(--amber)' : 'var(--green)',
                }} />
                <span className="f13 flex-1 truncate">{t.text}</span>
                <PriorityBadge priority={t.priority} />
              </div>
            ))}
            {tasks.filter((t) => !t.done).length === 0 && (
              <p className="f13 t3 text-center" style={{ padding: '20px 0' }}>All tasks complete! 🎉</p>
            )}
          </div>
        </Card>
      </div>

      {/* Health chart */}
      <Card>
        <CardHeader title="Health Overview — Steps This Week" action={<Badge variant="green">Weekly</Badge>} />
        <ResponsiveContainer width="100%" height={165}>
          <BarChart data={HEALTH_WEEK} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <Tooltip {...CHART_TOOLTIP} />
            <Bar dataKey="steps" fill="rgba(56,189,248,0.65)" radius={[5, 5, 0, 0]} name="Steps" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
