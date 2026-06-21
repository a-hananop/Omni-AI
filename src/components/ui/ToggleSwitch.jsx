export default function ToggleSwitch({ checked, onChange, id }) {
  const uid = id || `toggle-${Math.random().toString(36).slice(2)}`
  return (
    <label className="toggle" htmlFor={uid} style={{ cursor: 'pointer' }}>
      <input
        id={uid}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle-track" />
    </label>
  )
}
