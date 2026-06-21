import { useState } from 'react'
import { Eye, EyeOff, Zap, Shield, Star, User, UserPlus, ArrowLeft } from 'lucide-react'
import { useAuth, ROLES } from '../../contexts/AuthContext.jsx'

const DEMO_CREDS = [
  { role: 'admin',   email: 'admin@omni.ai',  pass: 'admin123',   icon: Shield, desc: 'Full access + RBAC management' },
  { role: 'premium', email: 'sara@omni.ai',   pass: 'premium123', icon: Star,   desc: 'All features + AI + Smart Home'  },
  { role: 'user',    email: 'mike@omni.ai',   pass: 'user123',    icon: User,   desc: 'Core features'                   },
  { role: 'guest',   email: 'guest@omni.ai',  pass: 'guest123',   icon: Zap,    desc: 'Dashboard + Entertainment only'  },
]

export default function LoginScreen() {
  const { login, signup, error, setError } = useAuth()
  const [mode,    setMode]    = useState('login') // 'login' | 'signup'
  const [form,    setForm]    = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPw,  setShowPw]  = useState(false)
  const [loading, setLoading] = useState(false)

  const switchMode = (m) => {
    setMode(m)
    setForm({ name: '', email: '', password: '', confirmPassword: '' })
    setError('')
  }

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError('Please enter email and password.'); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    login(form.email, form.password)
    setLoading(false)
  }

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) { setError('Please fill all fields.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    signup(form.name, form.email, form.password)
    setLoading(false)
  }

  const quickLogin = (cred) => {
    setForm({ name: '', email: cred.email, password: cred.pass, confirmPassword: '' })
    login(cred.email, cred.pass)
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg0)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, fontFamily: 'var(--ff)',
    }}>
      {/* Glow orbs */}
      <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 440, zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 60, height: 60, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
            borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--fh)', fontWeight: 800, fontSize: 24, color: '#fff',
            boxShadow: '0 0 30px rgba(56,189,248,0.3)',
          }}>Ω</div>
          <div style={{ fontFamily: 'var(--fh)', fontSize: 26, fontWeight: 800, background: 'linear-gradient(135deg, var(--cyan), var(--purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            OmniAI
          </div>
          <div style={{ color: 'var(--t3)', fontSize: 14, marginTop: 6 }}>Your intelligent personal assistant</div>
        </div>

        {/* ── Login Form ── */}
        {mode === 'login' && (
          <>
            <div className="card card-p" style={{ marginBottom: 20 }}>
              <div style={{ marginBottom: 20 }}>
                <label className="input-label">Email address</label>
                <input className="input" type="email" placeholder="you@omni.ai"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label className="input-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input className="input" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    style={{ paddingRight: 44 }} />
                  <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer' }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 8, padding: '10px 14px', color: 'var(--red)', fontSize: 13, marginBottom: 16 }}>
                  {error}
                </div>
              )}

              <button className="btn btn-primary btn-full" onClick={handleLogin} disabled={loading} style={{ marginBottom: 12 }}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>

              <div style={{ textAlign: 'center' }}>
                <button onClick={() => switchMode('signup')}
                  style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <UserPlus size={14} /> Don't have an account? Sign Up
                </button>
              </div>
            </div>

            {/* Quick demo login */}
            <div className="card card-p">
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14, textAlign: 'center' }}>
                Quick Demo Login
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {DEMO_CREDS.map((c) => {
                  const role = ROLES[c.role]
                  return (
                    <button key={c.role} className="btn btn-ghost btn-sm"
                      onClick={() => quickLogin(c)}
                      style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '10px 12px', height: 'auto', gap: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <c.icon size={13} style={{ color: role.color }} />
                        <span style={{ fontWeight: 600, color: role.color }}>{role.label}</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--t3)', textAlign: 'left', lineHeight: 1.3 }}>{c.desc}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* ── Signup Form ── */}
        {mode === 'signup' && (
          <div className="card card-p" style={{ marginBottom: 20 }}>
            <button onClick={() => switchMode('login')}
              style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, padding: 0 }}>
              <ArrowLeft size={14} /> Back to login
            </button>

            <div style={{ fontFamily: 'var(--fh)', fontSize: 20, fontWeight: 700, color: 'var(--t1)', marginBottom: 6 }}>Create Account</div>
            <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 20 }}>Join OmniAI and get started for free</div>

            <div style={{ marginBottom: 16 }}>
              <label className="input-label">Full Name</label>
              <input className="input" type="text" placeholder="John Doe"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoFocus />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="input-label">Email address</label>
              <input className="input" type="email" placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPw ? 'text' : 'password'} placeholder="Min 6 characters"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={{ paddingRight: 44 }} />
                <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="input-label">Confirm Password</label>
              <input className="input" type="password" placeholder="Re-enter password"
                value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleSignup()} />
            </div>

            {error && (
              <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 8, padding: '10px 14px', color: 'var(--red)', fontSize: 13, marginBottom: 16 }}>
                {error}
              </div>
            )}

            <button className="btn btn-primary btn-full" onClick={handleSignup} disabled={loading} style={{ marginBottom: 12 }}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button onClick={() => switchMode('login')}
                style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', fontSize: 13 }}>
                Already have an account? Sign In
              </button>
            </div>

            <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: 8, fontSize: 12, color: 'var(--t3)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--t2)' }}>Note:</strong> New accounts are created with the <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>User</span> role. An admin can upgrade your role later.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
