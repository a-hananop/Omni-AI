import { progressColor } from '../../utils/helpers.js'

export default function ProgressBar({
  value = 0,
  max   = 100,
  color,
  size  = 'default',
  className = '',
}) {
  const pct  = Math.min(Math.round((value / max) * 100), 100)
  const fill = color || progressColor(pct)

  return (
    <div className={`progress-bar ${size !== 'default' ? size : ''} ${className}`}>
      <div
        className="progress-fill"
        style={{ width: `${pct}%`, background: fill }}
      />
    </div>
  )
}
