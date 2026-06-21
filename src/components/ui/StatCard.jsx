import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ icon: Icon, label, value, change, up, color, bg }) {
  return (
    <div className="card stat-card" style={{ '--stat-color': color }}>
      <div className="stat-icon" style={{ background: bg }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {change && (
        <div className={`stat-change ${up ? 'up' : 'down'}`}>
          {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {change}
        </div>
      )}
    </div>
  )
}
