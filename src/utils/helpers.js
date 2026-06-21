/** Format a number with commas */
export const fmtNum = (n) => Number(n).toLocaleString()

/** Clamp a value between min and max */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

/** Get today's date string YYYY-MM-DD */
export const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Format a date string to "Jan 5" */
export const fmtDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** Percent of goal reached */
export const pct = (val, goal) => Math.round(clamp((val / goal) * 100, 0, 100))

/** Progress bar color based on completion */
export const progressColor = (p) => {
  if (p >= 80) return 'var(--green)'
  if (p >= 40) return 'var(--cyan)'
  return 'var(--amber)'
}

/** Month names */
export const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

/** Day abbreviations */
export const DAY_ABBR = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

/** Common chart tooltip style */
export const CHART_TOOLTIP = {
  contentStyle: {
    background: 'var(--bg1)',
    border: '1px solid rgba(56,189,248,0.25)',
    borderRadius: '10px',
    color: 'var(--t1)',
    fontSize: '12px',
    fontFamily: 'var(--ff)',
  },
  cursor: { fill: 'rgba(56,189,248,0.05)' },
}

/** Common chart axis tick style */
export const AXIS_TICK = { fill: 'var(--t3)', fontSize: 11, fontFamily: 'var(--fm)' }
