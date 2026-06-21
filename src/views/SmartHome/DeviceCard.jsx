import { Lightbulb, Thermometer, Volume2 } from 'lucide-react'
import ToggleSwitch from '../../components/ui/ToggleSwitch.jsx'

export default function DeviceCard({ device, onToggle, onSetValue }) {
  const { id, name, type, icon: Icon, color, on } = device

  return (
    <div className={`device-card ${on ? 'active' : ''}`}>
      {/* Top row */}
      <div className="flex items-center justify-between mb-14">
        <div
          className="device-icon-wrap"
          style={{ background: on ? `${color}20` : 'rgba(255,255,255,0.05)' }}
        >
          <Icon size={21} style={{ color: on ? color : 'var(--t3)', transition: 'color 0.2s' }} />
        </div>
        <ToggleSwitch
          checked={on}
          onChange={() => onToggle(id)}
          id={`toggle-${id}`}
        />
      </div>

      <div className="f14 fw6 mb-4 truncate">{name}</div>
      <div className="f12 t3">{type}</div>

      {/* Brightness slider */}
      {on && device.brightness !== undefined && (
        <div className="flex items-center gap-8 mt-12">
          <Lightbulb size={12} style={{ color: 'var(--amber)', flexShrink: 0 }} />
          <input
            type="range" min={10} max={100}
            value={device.brightness}
            onChange={(e) => onSetValue(id, 'brightness', Number(e.target.value))}
            aria-label={`${name} brightness`}
            style={{ flex: 1 }}
          />
          <span className="font-fm f11 t3" style={{ minWidth: 30, textAlign: 'right' }}>
            {device.brightness}%
          </span>
        </div>
      )}

      {/* Temperature slider */}
      {on && device.temp !== undefined && (
        <div className="flex items-center gap-8 mt-12">
          <Thermometer size={12} style={{ color: 'var(--red)', flexShrink: 0 }} />
          <input
            type="range" min={16} max={30}
            value={device.temp}
            onChange={(e) => onSetValue(id, 'temp', Number(e.target.value))}
            aria-label={`${name} temperature`}
            style={{ flex: 1 }}
          />
          <span className="font-fm f11 t3" style={{ minWidth: 36, textAlign: 'right' }}>
            {device.temp}°C
          </span>
        </div>
      )}

      {/* Volume slider */}
      {on && device.vol !== undefined && (
        <div className="flex items-center gap-8 mt-12">
          <Volume2 size={12} style={{ color: 'var(--green)', flexShrink: 0 }} />
          <input
            type="range" min={0} max={100}
            value={device.vol}
            onChange={(e) => onSetValue(id, 'vol', Number(e.target.value))}
            aria-label={`${name} volume`}
            style={{ flex: 1 }}
          />
          <span className="font-fm f11 t3" style={{ minWidth: 30, textAlign: 'right' }}>
            {device.vol}%
          </span>
        </div>
      )}
    </div>
  )
}
