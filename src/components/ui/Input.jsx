export default function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  autoFocus,
  step,
  min,
  max,
}) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input
        className={`input ${className}`}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        step={step}
        min={min}
        max={max}
      />
    </div>
  )
}

export function SelectInput({ label, value, onChange, options, className = '' }) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <select
        className={`input ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) =>
          typeof opt === 'string'
            ? <option key={opt} value={opt}>{opt}</option>
            : <option key={opt.value} value={opt.value}>{opt.label}</option>
        )}
      </select>
    </div>
  )
}
