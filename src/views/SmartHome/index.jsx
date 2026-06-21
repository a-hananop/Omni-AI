import { useState, useEffect, useRef, useCallback } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import {
  Mic, MicOff, Battery, BatteryCharging, Bell, Wifi, Info,
  ExternalLink, CheckCircle, AlertCircle, Settings, Zap, Globe
} from 'lucide-react'
import DeviceCard from './DeviceCard.jsx'
import Card, { CardHeader } from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Modal, { ModalActions } from '../../components/ui/Modal.jsx'
import { StatusDot } from '../../components/ui/Badge.jsx'
import { INITIAL_DEVICES, ENERGY_DATA } from '../../data/devices.js'
import { CHART_TOOLTIP, AXIS_TICK } from '../../utils/helpers.js'
import { useAuth } from '../../contexts/AuthContext.jsx'

// ── Voice command parser ──────────────────────────────────────────────────
const parseVoiceCommand = (text, devices) => {
  const t = text.toLowerCase()
  const results = []

  // "turn on/off [device name]"
  const onMatch  = t.match(/turn on (.+)/)
  const offMatch = t.match(/turn off (.+)/)
  const target   = onMatch?.[1] || offMatch?.[1]
  const turnOn   = !!onMatch

  if (target) {
    const matched = devices.filter((d) =>
      d.name.toLowerCase().includes(target) || d.type.toLowerCase().includes(target) ||
      target.includes(d.name.toLowerCase().split(' ')[0].toLowerCase())
    )
    matched.forEach((d) => results.push({ action: 'toggle', id: d.id, value: turnOn, name: d.name }))
  }

  // "set brightness/temperature/volume to [value]"
  const brightMatch = t.match(/(?:set |brightness |dim )?brightness.*?(\d+)/)
  const tempMatch   = t.match(/(?:set )?(?:temperature|temp).*?(\d+)/)
  const volMatch    = t.match(/(?:set )?(?:volume|vol).*?(\d+)/)

  if (brightMatch) results.push({ action: 'setBrightness', value: parseInt(brightMatch[1]) })
  if (tempMatch)   results.push({ action: 'setTemp',       value: parseInt(tempMatch[1])   })
  if (volMatch)    results.push({ action: 'setVol',        value: parseInt(volMatch[1])    })

  // "all lights on/off"
  if (t.includes('all lights on'))  devices.filter((d) => d.type === 'Lights').forEach((d) => results.push({ action: 'toggle', id: d.id, value: true,  name: d.name }))
  if (t.includes('all lights off')) devices.filter((d) => d.type === 'Lights').forEach((d) => results.push({ action: 'toggle', id: d.id, value: false, name: d.name }))

  return results
}

export default function SmartHome() {
  const { can } = useAuth()
  const hasControl = can('smart_home_control')

  const [devices,    setDevices]    = useState(INITIAL_DEVICES)
  const [battery,    setBattery]    = useState(null)
  const [listening,  setListening]  = useState(false)
  const [transcript, setTranscript] = useState('')
  const [cmdLog,     setCmdLog]     = useState([])
  const [showInfo,   setShowInfo]   = useState(false)
  const [showHA,     setShowHA]     = useState(false)
  const [haForm,     setHaForm]     = useState({ url: 'http://homeassistant.local:8123', token: '' })
  const [haStatus,   setHaStatus]   = useState(null)   // null | 'connecting' | 'ok' | 'error'
  const recognRef = useRef(null)
  const notifGranted = useRef(false)

  // ── Get real battery status via Web API ──────────────────────────────
  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then((bat) => {
        const update = () => setBattery({ level: Math.round(bat.level * 100), charging: bat.charging })
        update()
        bat.addEventListener('levelchange',    update)
        bat.addEventListener('chargingchange', update)
        return () => { bat.removeEventListener('levelchange', update); bat.removeEventListener('chargingchange', update) }
      }).catch(() => {})
    }
  }, [])

  // ── Request notifications permission ─────────────────────────────────
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((p) => { notifGranted.current = p === 'granted' })
    } else {
      notifGranted.current = Notification.permission === 'granted'
    }
  }, [])

  const sendNotif = (title, body) => {
    if (notifGranted.current) new Notification(title, { body, icon: '/favicon.svg' })
  }

  const toggleDevice  = (id) => {
    setDevices((prev) => {
      const next = prev.map((d) => d.id === id ? { ...d, on: !d.on } : d)
      const dev  = next.find((d) => d.id === id)
      if (dev) sendNotif(`${dev.name} ${dev.on ? 'turned on' : 'turned off'}`, `Smart Home · ${dev.type}`)
      return next
    })
  }
  const setDeviceValue = (id, key, val) => setDevices((prev) => prev.map((d) => d.id === id ? { ...d, [key]: val } : d))

  // ── Voice control ─────────────────────────────────────────────────────
  const handleVoiceCommand = useCallback((text) => {
    setTranscript(text)
    const cmds = parseVoiceCommand(text, devices)

    if (cmds.length === 0) {
      setCmdLog((prev) => [{ text, result: '❓ Command not recognized', ts: Date.now() }, ...prev.slice(0, 9)])
      return
    }

    cmds.forEach((cmd) => {
      if (cmd.action === 'toggle')        { setDevices((prev) => prev.map((d) => d.id === cmd.id ? { ...d, on: cmd.value } : d)); sendNotif(`${cmd.name} ${cmd.value ? 'on' : 'off'}`, 'Voice command') }
      if (cmd.action === 'setBrightness') { setDevices((prev) => prev.map((d) => d.brightness !== undefined ? { ...d, brightness: Math.min(100, Math.max(10, cmd.value)) } : d)) }
      if (cmd.action === 'setTemp')       { setDevices((prev) => prev.map((d) => d.temp !== undefined ? { ...d, temp: Math.min(30, Math.max(16, cmd.value)) } : d)) }
      if (cmd.action === 'setVol')        { setDevices((prev) => prev.map((d) => d.vol !== undefined ? { ...d, vol: Math.min(100, Math.max(0, cmd.value)) } : d)) }
    })

    setCmdLog((prev) => [{
      text,
      result: cmds.map((c) => c.name ? `${c.name} → ${c.value ? 'ON' : 'OFF'}` : `${c.action}(${c.value})`).join(', '),
      ts: Date.now(),
    }, ...prev.slice(0, 9)])
  }, [devices])

  const toggleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return alert('Speech recognition not supported in this browser. Try Chrome or Edge.')
    if (listening) { recognRef.current?.stop(); setListening(false); return }
    const r = new SR()
    r.lang = 'en-US'
    r.interimResults = false
    r.onresult = (e) => { handleVoiceCommand(e.results[0][0].transcript); setListening(false) }
    r.onerror  = () => setListening(false)
    r.onend    = () => setListening(false)
    r.start()
    recognRef.current = r
    setListening(true)
  }

  // ── Home Assistant test connection ────────────────────────────────────
  const testHA = async () => {
    setHaStatus('connecting')
    try {
      const res = await fetch(`${haForm.url}/api/`, {
        headers: { Authorization: `Bearer ${haForm.token}`, 'Content-Type': 'application/json' },
      })
      setHaStatus(res.ok ? 'ok' : 'error')
    } catch {
      setHaStatus('error')
    }
  }

  const onCount = devices.filter((d) => d.on).length

  const VOICE_EXAMPLES = [
    'Turn on living room lights',
    'Turn off bedroom',
    'Set brightness to 80',
    'Set temperature to 22',
    'Set volume to 60',
    'All lights off',
  ]

  return (
    <div className="page-enter">
      <div className="section-header flex items-center justify-between">
        <div>
          <div className="section-title">Smart Home</div>
          <div className="section-subtitle flex items-center gap-8">
            <StatusDot online /> {onCount} of {devices.length} devices active
          </div>
        </div>
        <div className="flex gap-8">
          {battery && (
            <div className="flex items-center gap-6 badge badge-green" style={{ padding: '5px 12px' }}>
              {battery.charging ? <BatteryCharging size={14} /> : <Battery size={14} />}
              {battery.level}%
            </div>
          )}
          <Badge variant="green"><StatusDot online /> Demo Mode</Badge>
          <button className="icon-btn" onClick={() => setShowInfo(true)} title="How real control works"><Info size={15} /></button>
          <button className="icon-btn" onClick={() => setShowHA(true)}   title="Home Assistant setup"><Settings size={15} /></button>
        </div>
      </div>

      {!hasControl && (
        <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, color: 'var(--amber)', fontSize: 13 }}>
          ⚠️ Smart Home control requires Premium or Admin access. You can view but not control devices.
        </div>
      )}

      {/* Voice control bar */}
      <div className="card card-p mb-20">
        <div className="flex items-center gap-16" style={{ flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="fw6 f14 mb-4">Voice Control</div>
            <div className="f13 t3">Use your microphone to control devices with natural language</div>
            {transcript && <div className="f12 t-cyan mt-4" style={{ marginTop: 4, fontFamily: 'var(--fm)' }}>"{transcript}"</div>}
          </div>
          <button
            onClick={toggleVoice}
            disabled={!hasControl}
            style={{
              width: 48, height: 48, borderRadius: 14, border: '1px solid',
              borderColor: listening ? 'var(--red)' : 'var(--border2)',
              background: listening ? 'rgba(248,113,113,0.15)' : 'rgba(56,189,248,0.08)',
              color: listening ? 'var(--red)' : 'var(--cyan)',
              cursor: hasControl ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: listening ? 'pulse 1s infinite' : 'none',
              opacity: hasControl ? 1 : 0.5, flexShrink: 0,
            }}>
            {listening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
        </div>
        {/* Examples */}
        <div className="flex gap-6 mt-12" style={{ marginTop: 12, flexWrap: 'wrap' }}>
          {VOICE_EXAMPLES.map((ex, i) => (
            <button key={i} className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, opacity: 0.8 }}
              onClick={() => { if (hasControl) handleVoiceCommand(ex) }}>
              "{ex}"
            </button>
          ))}
        </div>
        {/* Command log */}
        {cmdLog.length > 0 && (
          <div style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
            <div className="f12 t3 mb-8" style={{ marginBottom: 8 }}>Recent commands:</div>
            {cmdLog.slice(0, 3).map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, fontSize: 12 }}>
                <span style={{ color: 'var(--t3)', fontFamily: 'var(--fm)', flexShrink: 0 }}>{new Date(c.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span style={{ color: 'var(--t2)' }}>"{c.text}"</span>
                <span style={{ color: c.result.startsWith('❓') ? 'var(--red)' : 'var(--green)', marginLeft: 'auto' }}>→ {c.result}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Device grid */}
      <div className="grid-auto-170 mb-24">
        {devices.map((dev) => (
          <DeviceCard key={dev.id} device={dev}
            onToggle={hasControl ? toggleDevice : () => {}}
            onSetValue={hasControl ? setDeviceValue : () => {}}
          />
        ))}
      </div>

      {/* Energy chart */}
      <Card>
        <CardHeader title="Energy Usage Today (kWh)" action={<Badge variant="green">Simulated</Badge>} />
        <ResponsiveContainer width="100%" height={165}>
          <AreaChart data={ENERGY_DATA}>
            <defs>
              <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="var(--green)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--green)" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="h" tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <Tooltip {...CHART_TOOLTIP} formatter={(v) => [`${v} kWh`, 'Usage']} />
            <Area type="monotone" dataKey="kw" stroke="var(--green)" strokeWidth={2} fill="url(#energyGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Info Modal – how real control works */}
      <Modal open={showInfo} onClose={() => setShowInfo(false)} title="How Smart Home Control Works" size="lg">
        <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--t2)' }}>
          <p className="mb-16">This app currently runs in <strong style={{ color: 'var(--cyan)' }}>Demo Mode</strong> — all device controls are simulated. Here's how to connect to real smart home systems:</p>

          {[
            { name: 'Home Assistant', color: '#41BDF5', desc: 'Open-source hub supporting 3000+ integrations. Run locally and connect via REST API.', url: 'https://www.home-assistant.io/', guide: 'Configure HA URL + API Token below (⚙ icon)', supported: true },
            { name: 'Google Home',    color: '#4285F4', desc: 'Control Nest, Chromecast, and Google devices via the Smart Home API.', url: 'https://developers.home.google.com/', guide: 'OAuth 2.0 + Google Developer project required', supported: false },
            { name: 'Apple HomeKit',  color: '#999',    desc: 'Control HomeKit-compatible devices on Apple ecosystem.', url: 'https://developer.apple.com/homekit/', guide: 'Requires iOS/macOS WebKit, not available in browser', supported: false },
            { name: 'SmartThings',    color: '#1CACEC', desc: 'Samsung\'s platform supporting zigbee, Z-Wave, and WiFi devices.', url: 'https://developer.smartthings.com/', guide: 'REST API with OAuth 2.0 token', supported: false },
            { name: 'Philips Hue',    color: '#F5A623', desc: 'Control Hue lights via local bridge REST API on your network.', url: 'https://developers.meethue.com/', guide: 'Bridge IP + Username via mDNS discovery', supported: false },
          ].map((p, i) => (
            <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, marginTop: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="fw6 f14" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {p.name}
                  {p.supported && <Badge variant="green">Configurable below</Badge>}
                </div>
                <div className="f13 t3">{p.desc}</div>
                <div style={{ fontSize: 12, color: 'var(--amber)', marginTop: 4 }}>Setup: {p.guide}</div>
              </div>
              <a href={p.url} target="_blank" rel="noreferrer" style={{ color: 'var(--cyan)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                Docs <ExternalLink size={11} />
              </a>
            </div>
          ))}

          <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(56,189,248,0.07)', borderRadius: 10, border: '1px solid var(--border2)', fontSize: 13 }}>
            <strong style={{ color: 'var(--cyan)' }}>Browser Web APIs currently active:</strong>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4, color: 'var(--t2)' }}>
              <span>{'getBattery' in navigator ? '✅' : '❌'} Battery Status API {battery ? `(${battery.level}%, ${battery.charging ? 'charging' : 'discharging'})` : '(not available)'}</span>
              <span>{'SpeechRecognition' in window || 'webkitSpeechRecognition' in window ? '✅' : '❌'} Web Speech Recognition (voice commands)</span>
              <span>{'Notification' in window ? '✅' : '❌'} Web Notifications API (device alerts)</span>
              <span>{'bluetooth' in navigator ? '✅' : '❌'} Web Bluetooth API (experimental – Chrome only)</span>
            </div>
          </div>
        </div>
        <ModalActions><Button variant="primary" onClick={() => setShowInfo(false)}>Got it</Button></ModalActions>
      </Modal>

      {/* Home Assistant setup modal */}
      <Modal open={showHA} onClose={() => setShowHA(false)} title="Home Assistant Integration">
        <p className="f13 t2 mb-16">Connect to a running Home Assistant instance to control real devices.</p>
        <div className="input-group"><label className="input-label">Base URL</label>
          <input className="input" value={haForm.url} onChange={(e) => setHaForm({ ...haForm, url: e.target.value })} placeholder="http://homeassistant.local:8123" />
        </div>
        <div className="input-group"><label className="input-label">Long-Lived Access Token</label>
          <input className="input" type="password" value={haForm.token} onChange={(e) => setHaForm({ ...haForm, token: e.target.value })} placeholder="eyJhbGci..." />
          <p className="f12 t3 mt-4" style={{ marginTop: 6 }}>
            Get it from: HA Profile → Long-Lived Access Tokens → Create Token.<br/>
            Docs: <a href="https://www.home-assistant.io/docs/authentication/" target="_blank" rel="noreferrer" style={{ color: 'var(--cyan)' }}>home-assistant.io</a>
          </p>
        </div>
        {haStatus === 'ok'    && <div style={{ color: 'var(--green)', fontSize: 13, marginBottom: 12 }}>✅ Connected to Home Assistant!</div>}
        {haStatus === 'error' && <div style={{ color: 'var(--red)',   fontSize: 13, marginBottom: 12 }}>❌ Could not connect. Check URL and token.</div>}
        <ModalActions>
          <Button variant="ghost" onClick={() => setShowHA(false)}>Cancel</Button>
          <Button variant="ghost" onClick={testHA} disabled={haStatus === 'connecting'}>{haStatus === 'connecting' ? 'Testing…' : 'Test Connection'}</Button>
          <Button variant="primary" disabled={haStatus !== 'ok'}>Save & Enable</Button>
        </ModalActions>
      </Modal>
    </div>
  )
}
