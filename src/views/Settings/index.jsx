import { useState } from 'react'
import {
  Shield, User, Globe, Bell, Link, Download, Trash2,
  AlertTriangle, Check, Key, Users, Eye, EyeOff, Plus, X, UserPlus, UserMinus,
} from 'lucide-react'
import Card, { CardHeader } from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Input, { SelectInput } from '../../components/ui/Input.jsx'
import ToggleSwitch from '../../components/ui/ToggleSwitch.jsx'
import Modal, { ModalActions } from '../../components/ui/Modal.jsx'
import { useAuth, ROLES } from '../../contexts/AuthContext.jsx'

const TIMEZONES = ['UTC-8', 'UTC-5', 'UTC+0', 'UTC+1', 'UTC+3', 'UTC+5', 'UTC+5:30', 'UTC+8']
const THEMES    = ['Dark (default)', 'Darker', 'OLED Black']
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Arabic', 'Urdu']

const TABS_CFG = [
  { id: 'profile',  label: 'Profile'       },
  { id: 'security', label: 'Security'      },
  { id: 'notifs',   label: 'Notifications' },
  { id: 'rbac',     label: 'Access Control'},
  { id: 'data',     label: 'Data & Privacy'},
  { id: 'apps',     label: 'Connected Apps'},
]

export default function Settings() {
  const { user, updateUser, logout, can, DEMO_USERS, changeUserRole, deleteUser, addUser, refreshUsers } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [tab,       setTab]       = useState('profile')
  const [profile,   setProfile]   = useState({ name: user?.name || '', email: user?.email || '', timezone: user?.timezone || 'UTC+5', bio: user?.bio || '', language: 'English', theme: 'Dark (default)' })
  const [saved,     setSaved]     = useState(false)
  const [notifs,    setNotifs]    = useState({ tasks: true, health: true, ai: false, updates: true, reminders: true })
  const [apps,      setApps]      = useState([
    { id: 'gcal', name: 'Google Calendar', emoji: '📅', connected: true  },
    { id: 'spotify', name: 'Spotify',      emoji: '🎵', connected: true  },
    { id: 'health',  name: 'Apple Health', emoji: '🏃', connected: false },
    { id: 'notion',  name: 'Notion',       emoji: '📝', connected: false },
    { id: 'slack',   name: 'Slack',        emoji: '💬', connected: false },
    { id: 'github',  name: 'GitHub',       emoji: '🐙', connected: true  },
  ])
  const [showPwModal,   setShowPwModal]   = useState(false)
  const [showDelModal,  setShowDelModal]  = useState(false)
  const [pwForm,        setPwForm]        = useState({ current: '', next: '', confirm: '' })
  const [pwVisible,     setPwVisible]     = useState({})
  const [pwMsg,         setPwMsg]         = useState('')
  const [sessions2FA,   setSessions2FA]   = useState(true)

  // ── Admin: Add User Modal ──
  const [showAddUser,   setShowAddUser]   = useState(false)
  const [addForm,       setAddForm]       = useState({ name: '', email: '', password: '', role: 'user' })
  const [addMsg,        setAddMsg]        = useState('')

  // ── Admin: Delete User Confirmation ──
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null) // userId to delete

  // ── Admin: Role Change ──
  const [roleDropdown, setRoleDropdown] = useState(null) // userId showing dropdown
  const [roleMsg, setRoleMsg] = useState('')

  const saveProfile = () => {
    updateUser({ name: profile.name, email: profile.email, bio: profile.bio })
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  const changePw = () => {
    if (!pwForm.current)              { setPwMsg('Enter current password.'); return }
    if (pwForm.next.length < 6)       { setPwMsg('New password must be ≥ 6 chars.'); return }
    if (pwForm.next !== pwForm.confirm){ setPwMsg('Passwords do not match.'); return }
    setPwMsg('✅ Password updated successfully!')
    setTimeout(() => { setShowPwModal(false); setPwForm({ current:'', next:'', confirm:'' }); setPwMsg('') }, 1500)
  }

  const exportData = () => {
    const data = {
      user: { name: user.name, email: user.email, role: user.role },
      exportedAt: new Date().toISOString(),
      tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
      notes: JSON.parse(localStorage.getItem('omni_notes') || '{}'),
      sessions: JSON.parse(localStorage.getItem('omni_sessions') || '[]'),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `omni-ai-data-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const clearAllData = () => {
    ['tasks', 'omni_notes', 'omni_sessions'].forEach((k) => localStorage.removeItem(k))
    setShowDelModal(false)
  }

  // ── Admin handlers ──
  const handleAddUser = () => {
    if (!addForm.name.trim() || !addForm.email.trim() || addForm.password.length < 6) {
      setAddMsg('All fields required. Password must be ≥ 6 characters.')
      return
    }
    const result = addUser(addForm.name, addForm.email, addForm.password, addForm.role)
    if (!result) {
      setAddMsg('Email already exists or operation failed.')
      return
    }
    setAddMsg('')
    setAddForm({ name: '', email: '', password: '', role: 'user' })
    setShowAddUser(false)
    refreshUsers()
  }

  const handleDeleteUser = (userId) => {
    const result = deleteUser(userId)
    if (result) {
      refreshUsers()
    }
    setShowDeleteConfirm(null)
  }

  const handleRoleChange = (userId, newRole) => {
    const result = changeUserRole(userId, newRole)
    if (result) {
      setRoleMsg(`Role updated successfully!`)
      setTimeout(() => setRoleMsg(''), 2000)
      refreshUsers()
    }
    setRoleDropdown(null)
  }

  const deleteTargetUser = DEMO_USERS.find(u => u.id === showDeleteConfirm)

  return (
    <div className="page-enter">
      <div className="section-header">
        <div className="section-title">Settings</div>
        <div className="section-subtitle">Manage your account and preferences</div>
      </div>

      {/* Horizontal tabs */}
      <div className="tabs mb-24">
        {TABS_CFG.map((t) => (
          (t.id === 'rbac' && !isAdmin) ? null : (
            <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          )
        ))}
      </div>

      {/* ── Profile tab ── */}
      {tab === 'profile' && (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <Card>
            <CardHeader title="Profile Information" />
            <div className="flex items-center gap-16 mb-20">
              <div style={{ width: 58, height: 58, borderRadius: 14, background: 'linear-gradient(135deg,var(--cyan),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--fh)', fontWeight: 700, fontSize: 20, color: '#fff', boxShadow: 'var(--shadow-cyan)' }}>
                {user?.avatar || 'U'}
              </div>
              <div>
                <div className="fw7 f15">{profile.name}</div>
                <div className="f13 t3 mt-4">{profile.email}</div>
                <div className="mt-8" style={{ marginTop: 6 }}>
                  <span className={`badge ${ROLES[user?.role]?.badge || 'badge-cyan'}`}>{ROLES[user?.role]?.label}</span>
                </div>
              </div>
            </div>
            <Input label="Display name"  value={profile.name}  onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            <Input label="Email address" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} type="email" />
            <Input label="Bio"           value={profile.bio}   onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="A short bio…" />
            <SelectInput label="Timezone" value={profile.timezone} onChange={(v) => setProfile({ ...profile, timezone: v })} options={TIMEZONES} />
            <SelectInput label="Language" value={profile.language} onChange={(v) => setProfile({ ...profile, language: v })} options={LANGUAGES} />
            <SelectInput label="Theme"    value={profile.theme}    onChange={(v) => setProfile({ ...profile, theme: v })}    options={THEMES}    />
            <Button variant={saved ? 'success' : 'primary'} full onClick={saveProfile}>
              {saved ? '✓ Saved!' : 'Save Changes'}
            </Button>
          </Card>

          <Card>
            <CardHeader title="Account" />
            <div className="settings-row">
              <div style={{ flex: 1 }}>
                <div className="f14 fw6">Change Password</div>
                <div className="f12 t3 mt-4">Update your login credentials</div>
              </div>
              <Button variant="ghost" size="sm" icon={<Key size={13} />} onClick={() => setShowPwModal(true)}>Change</Button>
            </div>
            <div className="settings-row">
              <div style={{ flex: 1 }}>
                <div className="f14 fw6">Sign Out</div>
                <div className="f12 t3 mt-4">Sign out of your account</div>
              </div>
              <Button variant="danger" size="sm" onClick={logout}>Sign Out</Button>
            </div>
          </Card>
        </div>
      )}

      {/* ── Security tab ── */}
      {tab === 'security' && (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <Card>
            <CardHeader title="Authentication" />
            {[
              { icon: Shield, label: 'Two-Factor Authentication', sub: 'Extra layer via authenticator app', color: 'var(--green)', state: sessions2FA, setState: setSessions2FA, key: '2fa' },
            ].map((s, i) => (
              <div key={i} className="settings-row">
                <div className="settings-icon"><s.icon size={16} style={{ color: s.color }} /></div>
                <div style={{ flex: 1 }}><div className="f14 fw6">{s.label}</div><div className="f12 t3 mt-4">{s.sub}</div></div>
                <ToggleSwitch checked={s.state} onChange={s.setState} id={s.key} />
              </div>
            ))}
            {[
              { icon: User,  label: 'Biometric Login',      sub: 'Face ID / Fingerprint',         color: 'var(--cyan)'   },
              { icon: Globe, label: 'End-to-End Encryption',sub: 'All local data encrypted',      color: 'var(--purple)' },
            ].map((s, i) => (
              <div key={i} className="settings-row">
                <div className="settings-icon"><s.icon size={16} style={{ color: s.color }} /></div>
                <div style={{ flex: 1 }}><div className="f14 fw6">{s.label}</div><div className="f12 t3 mt-4">{s.sub}</div></div>
                <Badge variant="green">Active</Badge>
              </div>
            ))}
          </Card>

          <Card>
            <CardHeader title="Active Sessions" />
            {[
              { device: 'This device',   location: 'Current session',   time: 'Now',         active: true  },
              { device: 'Chrome – Win',  location: 'Rawalpindi, PK',    time: '2 hours ago',  active: false },
              { device: 'Safari – iOS',  location: 'Mobile',            time: 'Yesterday',    active: false },
            ].map((s, i) => (
              <div key={i} className="settings-row">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.active ? 'var(--green)' : 'var(--t3)', marginTop: 2, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="f14 fw6">{s.device}</div>
                  <div className="f12 t3">{s.location} · {s.time}</div>
                </div>
                {!s.active && <Button variant="danger" size="xs">Revoke</Button>}
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ── Notifications tab ── */}
      {tab === 'notifs' && (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <Card>
            <CardHeader title="Notification Preferences" />
            {Object.entries(notifs).map(([key, val]) => (
              <div key={key} className="settings-row">
                <div className="settings-icon"><Bell size={16} style={{ color: 'var(--cyan)' }} /></div>
                <div style={{ flex: 1 }}>
                  <div className="f14 fw6" style={{ textTransform: 'capitalize' }}>{key} Alerts</div>
                  <div className="f12 t3 mt-4">Push notifications for {key}</div>
                </div>
                <ToggleSwitch checked={val} onChange={(v) => setNotifs((p) => ({ ...p, [key]: v }))} id={`n-${key}`} />
              </div>
            ))}
          </Card>
          <Card>
            <CardHeader title="Browser Notifications" />
            <div style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.7 }}>
              <p className="mb-12">OmniAI can send browser notifications for device changes, task reminders, and health alerts.</p>
              <Button variant="primary" onClick={() => Notification.requestPermission().then((p) => alert(`Permission: ${p}`))}>
                <Bell size={14} /> Request Permission
              </Button>
              <p className="f12 t3 mt-12" style={{ marginTop: 12 }}>
                Status: <strong style={{ color: Notification.permission === 'granted' ? 'var(--green)' : 'var(--amber)' }}>
                  {Notification.permission || 'unknown'}
                </strong>
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* ── RBAC tab (admin only) ── */}
      {tab === 'rbac' && isAdmin && (
        <div>
          <div className="card card-p mb-20" style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.2)' }}>
            <div className="fw6 f14 mb-8">Role-Based Access Control (RBAC)</div>
            <div className="f13 t2 lh-16">Manage what each role can access. Change roles, add or remove users below.</div>
          </div>

          {/* Role overview cards */}
          <div className="grid-2 mb-20">
            {Object.entries(ROLES).map(([roleKey, role]) => (
              <div key={roleKey} className="card card-p">
                <div className="flex items-center gap-10 mb-12">
                  <span className={`badge ${role.badge}`} style={{ fontSize: 13 }}>{role.label}</span>
                </div>
                <div className="f13 fw6 t3 mb-8">Pages</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {role.pages.map((p) => <span key={p} className="badge badge-cyan" style={{ fontSize: 10 }}>{p}</span>)}
                </div>
                <div className="f13 fw6 t3 mb-8">Permissions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {['manage_users','use_ai','smart_home_control','export_data','delete_tasks','edit_settings','view_analytics'].map((perm) => (
                    <div key={perm} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                      {role.can.includes(perm)
                        ? <Check size={13} style={{ color: 'var(--green)', flexShrink: 0 }} />
                        : <span style={{ width: 13, height: 13, flexShrink: 0 }}>·</span>}
                      <span style={{ color: role.can.includes(perm) ? 'var(--t1)' : 'var(--t3)' }}>{perm}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* User Management */}
          <Card>
            <CardHeader
              title="System Users"
              action={
                <Button variant="primary" size="sm" icon={<UserPlus size={13} />} onClick={() => setShowAddUser(true)}>
                  Add User
                </Button>
              }
            />

            {roleMsg && (
              <div style={{ padding: '8px 16px', margin: '0 16px 12px', borderRadius: 8, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>
                ✓ {roleMsg}
              </div>
            )}

            {DEMO_USERS.map((u) => (
              <div key={u.id} className="settings-row" style={{ position: 'relative' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,var(--cyan3),var(--purple3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--fh)', fontWeight: 700, fontSize: 13, color: '#fff', flexShrink: 0 }}>
                  {u.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="f14 fw6">{u.name} {u.id === user?.id && <span style={{ fontSize: 11, color: 'var(--cyan)' }}>(You)</span>}</div>
                  <div className="f12 t3">{u.email}</div>
                </div>
                <span className={`badge ${ROLES[u.role]?.badge || 'badge-cyan'}`}>{ROLES[u.role]?.label}</span>

                {u.id !== user?.id && (
                  <div style={{ display: 'flex', gap: 6, position: 'relative' }}>
                    {/* Role Change Button */}
                    <div style={{ position: 'relative' }}>
                      <Button variant="ghost" size="xs" onClick={() => setRoleDropdown(roleDropdown === u.id ? null : u.id)}>
                        Change Role
                      </Button>

                      {/* Role Dropdown */}
                      {roleDropdown === u.id && (
                        <div style={{
                          position: 'absolute', top: '100%', right: 0, marginTop: 4, zIndex: 100,
                          background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 10,
                          boxShadow: '0 8px 32px rgba(0,0,0,0.4)', padding: 6, minWidth: 160,
                          animation: 'fadeIn 0.15s ease',
                        }}>
                          <div style={{ fontSize: 11, color: 'var(--t3)', padding: '4px 10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Assign Role
                          </div>
                          {Object.entries(ROLES).map(([roleKey, role]) => (
                            <button
                              key={roleKey}
                              onClick={() => handleRoleChange(u.id, roleKey)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                                padding: '8px 10px', border: 'none', borderRadius: 6,
                                background: u.role === roleKey ? 'rgba(56,189,248,0.1)' : 'transparent',
                                color: 'var(--t1)', fontSize: 13, cursor: 'pointer',
                                fontWeight: u.role === roleKey ? 700 : 400,
                                transition: 'background 0.15s',
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(56,189,248,0.1)'}
                              onMouseLeave={e => e.currentTarget.style.background = u.role === roleKey ? 'rgba(56,189,248,0.1)' : 'transparent'}
                            >
                              <span className={`badge ${role.badge}`} style={{ fontSize: 10, padding: '1px 6px' }}>{role.label}</span>
                              {u.role === roleKey && <Check size={12} style={{ color: 'var(--green)', marginLeft: 'auto' }} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Delete User Button */}
                    <Button variant="danger" size="xs" icon={<UserMinus size={11} />} onClick={() => setShowDeleteConfirm(u.id)}>
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ── Data & Privacy tab ── */}
      {tab === 'data' && (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <Card>
            <CardHeader title="Your Data" />
            <div className="settings-row">
              <div style={{ flex: 1 }}><div className="f14 fw6">Export All Data</div><div className="f12 t3 mt-4">Download JSON of tasks, notes, sessions</div></div>
              {can('export_data')
                ? <Button variant="ghost" size="sm" icon={<Download size={13} />} onClick={exportData}>Export</Button>
                : <Badge variant="red">Requires Premium</Badge>}
            </div>
            <div className="settings-row">
              <div style={{ flex: 1 }}><div className="f14 fw6">Clear All Local Data</div><div className="f12 t3 mt-4">Delete tasks, notes, sessions from this browser</div></div>
              <Button variant="danger" size="sm" icon={<Trash2 size={13} />} onClick={() => setShowDelModal(true)}>Clear</Button>
            </div>
          </Card>
          <Card>
            <CardHeader title="Privacy" />
            <p className="f13 t2 lh-16 mb-16">OmniAI stores all personal data locally in your browser's localStorage. No data is sent to external servers except AI messages (routed through your local server.js proxy to Anthropic).</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['localStorage (tasks, notes, sessions)','Anthropic API (AI messages only)'].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13 }}>
                  <Check size={14} style={{ color: 'var(--green)', flexShrink: 0, marginTop: 2 }} />
                  <span style={{ color: 'var(--t2)' }}>{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── Connected Apps tab ── */}
      {tab === 'apps' && (
        <Card>
          <CardHeader title="Connected Apps & Integrations" />
          {apps.map((a) => (
            <div key={a.id} className="settings-row">
              <span style={{ fontSize: 22 }}>{a.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="f14 fw6">{a.name}</div>
                <div className="f12 t3 mt-4">{a.connected ? 'Connected · Last synced just now' : 'Not connected'}</div>
              </div>
              <Button variant={a.connected ? 'ghost' : 'primary'} size="sm"
                onClick={() => setApps((prev) => prev.map((x) => x.id === a.id ? { ...x, connected: !x.connected } : x))}>
                {a.connected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          ))}
        </Card>
      )}

      {/* Change Password Modal */}
      <Modal open={showPwModal} onClose={() => setShowPwModal(false)} title="Change Password">
        {['current','next','confirm'].map((field, i) => (
          <div key={field} className="input-group">
            <label className="input-label">{['Current password','New password','Confirm new password'][i]}</label>
            <div style={{ position: 'relative' }}>
              <input className="input" type={pwVisible[field] ? 'text' : 'password'}
                value={pwForm[field]} onChange={(e) => setPwForm({ ...pwForm, [field]: e.target.value })}
                style={{ paddingRight: 44 }} />
              <button onClick={() => setPwVisible((p) => ({ ...p, [field]: !p[field] }))}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer' }}>
                {pwVisible[field] ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        ))}
        {pwMsg && <div style={{ fontSize: 13, color: pwMsg.startsWith('✅') ? 'var(--green)' : 'var(--red)', marginBottom: 12 }}>{pwMsg}</div>}
        <ModalActions>
          <Button variant="ghost" onClick={() => setShowPwModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={changePw}>Update Password</Button>
        </ModalActions>
      </Modal>

      {/* Confirm delete data modal */}
      <Modal open={showDelModal} onClose={() => setShowDelModal(false)} title="Clear All Data">
        <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
          <AlertTriangle size={24} style={{ color: 'var(--red)', flexShrink: 0 }} />
          <p className="f14 lh-16" style={{ color: 'var(--t2)' }}>This will permanently delete all your local tasks, notes, and study sessions. This cannot be undone.</p>
        </div>
        <ModalActions>
          <Button variant="ghost" onClick={() => setShowDelModal(false)}>Cancel</Button>
          <Button variant="danger" icon={<Trash2 size={13} />} onClick={clearAllData}>Yes, Clear Everything</Button>
        </ModalActions>
      </Modal>

      {/* ── Admin: Add User Modal ── */}
      <Modal open={showAddUser} onClose={() => { setShowAddUser(false); setAddMsg('') }} title="Add New User">
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '10px 14px', borderRadius: 8, background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.12)' }}>
            <UserPlus size={16} style={{ color: 'var(--cyan)' }} />
            <span className="f13 t2">Create a new user account with a specified role.</span>
          </div>
          <Input label="Full Name" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} placeholder="e.g. John Doe" autoFocus />
          <Input label="Email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} placeholder="e.g. john@omni.ai" type="email" />
          <Input label="Password" value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} placeholder="Min 6 characters" type="password" />
          <SelectInput label="Role" value={addForm.role} onChange={(v) => setAddForm({ ...addForm, role: v })} options={Object.keys(ROLES)} />
          <div style={{ marginTop: 4, padding: '8px 12px', borderRadius: 8, background: `rgba(167,139,250,0.06)`, fontSize: 12, color: 'var(--t3)' }}>
            <strong style={{ color: 'var(--t2)' }}>Role preview:</strong> {ROLES[addForm.role]?.label} — Pages: {ROLES[addForm.role]?.pages.length}, Permissions: {ROLES[addForm.role]?.can.length}
          </div>
        </div>
        {addMsg && <div style={{ fontSize: 13, color: 'var(--red)', marginTop: 8 }}>{addMsg}</div>}
        <ModalActions>
          <Button variant="ghost" onClick={() => { setShowAddUser(false); setAddMsg('') }}>Cancel</Button>
          <Button variant="primary" icon={<UserPlus size={13} />} onClick={handleAddUser} disabled={!addForm.name.trim() || !addForm.email.trim() || addForm.password.length < 6}>
            Create User
          </Button>
        </ModalActions>
      </Modal>

      {/* ── Admin: Delete User Confirmation Modal ── */}
      <Modal open={!!showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)} title="Remove User">
        <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
          <AlertTriangle size={24} style={{ color: 'var(--red)', flexShrink: 0 }} />
          <div>
            <p className="f14 lh-16" style={{ color: 'var(--t2)', marginBottom: 8 }}>
              Are you sure you want to remove this user? This action cannot be undone.
            </p>
            {deleteTargetUser && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,var(--cyan3),var(--purple3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--fh)', fontWeight: 700, fontSize: 12, color: '#fff' }}>
                  {deleteTargetUser.avatar}
                </div>
                <div>
                  <div className="f13 fw6">{deleteTargetUser.name}</div>
                  <div className="f11 t3">{deleteTargetUser.email} · {ROLES[deleteTargetUser.role]?.label}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <ModalActions>
          <Button variant="ghost" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" icon={<UserMinus size={13} />} onClick={() => handleDeleteUser(showDeleteConfirm)}>Yes, Remove User</Button>
        </ModalActions>
      </Modal>
    </div>
  )
}
