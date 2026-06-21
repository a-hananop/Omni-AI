export default function Badge({ children, variant = 'cyan', className = '' }) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  const map = { high: 'red', medium: 'amber', low: 'green' }
  return <Badge variant={map[priority] || 'cyan'}>{priority}</Badge>
}

export function StatusDot({ online = true }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8, height: 8,
        borderRadius: '50%',
        background: online ? 'var(--green)' : 'var(--t3)',
        boxShadow: online ? '0 0 6px rgba(52,211,153,0.6)' : 'none',
      }}
    />
  )
}
