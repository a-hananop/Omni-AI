export default function Card({ children, padding = true, className = '', hover = true }) {
  return (
    <div className={`card ${padding ? 'card-p' : ''} ${hover ? '' : 'no-hover'} ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-16">
      <div>
        {title    && <div className="fw6 f14">{title}</div>}
        {subtitle && <div className="f12 t3 mt-4">{subtitle}</div>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
