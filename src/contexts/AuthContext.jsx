/**
 * AuthContext – Role-Based Access Control (RBAC) with Signup & Admin User Management
 *
 * Roles & Permissions:
 *  admin   → full access + user management + all settings
 *  premium → all features including AI assistant & smart home
 *  user    → core features: dashboard, tasks, health, calendar, learning, entertainment, personal
 *  guest   → read-only: dashboard, entertainment
 */
import { createContext, useContext, useState, useCallback } from 'react'

// ── Permission matrix ─────────────────────────────────────────────────────
export const ROLES = {
  admin: {
    label: 'Administrator',
    color: 'var(--red)',
    badge: 'badge-red',
    pages: ['dashboard','tasks','ai','health','calendar','learning','entertainment','smarthome','personal','settings'],
    can  : ['manage_users','export_data','delete_tasks','edit_settings','use_ai','smart_home_control','view_analytics'],
  },
  premium: {
    label: 'Premium',
    color: 'var(--amber)',
    badge: 'badge-amber',
    pages: ['dashboard','tasks','ai','health','calendar','learning','entertainment','smarthome','personal','settings'],
    can  : ['export_data','delete_tasks','edit_settings','use_ai','smart_home_control','view_analytics'],
  },
  user: {
    label: 'User',
    color: 'var(--cyan)',
    badge: 'badge-cyan',
    pages: ['dashboard','tasks','health','calendar','learning','entertainment','personal','settings'],
    can  : ['delete_tasks','edit_settings'],
  },
  guest: {
    label: 'Guest',
    color: 'var(--t3)',
    badge: 'badge-purple',
    pages: ['dashboard','entertainment'],
    can  : [],
  },
}

// ── Default demo accounts ────────────────────────────────────────────────
const DEFAULT_USERS = [
  { id: 1, name: 'Alex Johnson',  email: 'admin@omni.ai',   password: 'admin123',   role: 'admin',   avatar: 'AJ', bio: 'System Administrator' },
  { id: 2, name: 'Sara Lee',      email: 'sara@omni.ai',    password: 'premium123', role: 'premium', avatar: 'SL', bio: 'Premium subscriber'    },
  { id: 3, name: 'Mike Chen',     email: 'mike@omni.ai',    password: 'user123',    role: 'user',    avatar: 'MC', bio: 'Standard user'         },
  { id: 4, name: 'Guest User',    email: 'guest@omni.ai',   password: 'guest123',   role: 'guest',   avatar: 'GU', bio: 'Guest access'          },
]

const LS_USERS = 'omni_all_users'

function loadUsers() {
  try {
    const saved = localStorage.getItem(LS_USERS)
    return saved ? JSON.parse(saved) : DEFAULT_USERS
  } catch { return DEFAULT_USERS }
}

function saveUsers(users) {
  localStorage.setItem(LS_USERS, JSON.stringify(users))
}

// ── Context ───────────────────────────────────────────────────────────────
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('omni_user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })
  const [allUsers, setAllUsers] = useState(loadUsers)
  const [error, setError] = useState('')

  const login = useCallback((email, password) => {
    const users = loadUsers()
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) {
      setError('Invalid email or password.')
      return false
    }
    const { password: _pw, ...safe } = found
    setUser(safe)
    localStorage.setItem('omni_user', JSON.stringify(safe))
    setError('')
    return true
  }, [])

  const signup = useCallback((name, email, password) => {
    const users = loadUsers()
    // Check if email already exists
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setError('An account with this email already exists.')
      return false
    }
    if (!name.trim() || !email.trim() || password.length < 6) {
      setError('Please fill all fields. Password must be at least 6 characters.')
      return false
    }
    const initials = name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: 'user', // new signups get 'user' role by default
      avatar: initials || 'U',
      bio: '',
    }
    const updatedUsers = [...users, newUser]
    saveUsers(updatedUsers)
    setAllUsers(updatedUsers)
    // Auto-login after signup
    const { password: _pw, ...safe } = newUser
    setUser(safe)
    localStorage.setItem('omni_user', JSON.stringify(safe))
    setError('')
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('omni_user')
  }, [])

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates }
      localStorage.setItem('omni_user', JSON.stringify(next))
      // Also update in allUsers
      const users = loadUsers()
      const idx = users.findIndex(u => u.id === next.id)
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates }
        saveUsers(users)
        setAllUsers([...users])
      }
      return next
    })
  }, [])

  // ── Admin: change user role ────────────────────────────────────────────
  const changeUserRole = useCallback((userId, newRole) => {
    if (!user || user.role !== 'admin') return false
    if (!ROLES[newRole]) return false
    const users = loadUsers()
    const idx = users.findIndex(u => u.id === userId)
    if (idx === -1) return false
    users[idx].role = newRole
    saveUsers(users)
    setAllUsers([...users])
    // If admin is changing their own role (shouldn't normally happen)
    if (userId === user.id) {
      const { password: _pw, ...safe } = users[idx]
      setUser(safe)
      localStorage.setItem('omni_user', JSON.stringify(safe))
    }
    return true
  }, [user])

  // ── Admin: delete user ─────────────────────────────────────────────────
  const deleteUser = useCallback((userId) => {
    if (!user || user.role !== 'admin') return false
    if (userId === user.id) return false // can't delete yourself
    const users = loadUsers()
    const filtered = users.filter(u => u.id !== userId)
    saveUsers(filtered)
    setAllUsers(filtered)
    return true
  }, [user])

  // ── Admin: add user ────────────────────────────────────────────────────
  const addUser = useCallback((name, email, password, role) => {
    if (!user || user.role !== 'admin') return false
    const users = loadUsers()
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) return false
    const initials = name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: role || 'user',
      avatar: initials || 'U',
      bio: '',
    }
    const updated = [...users, newUser]
    saveUsers(updated)
    setAllUsers(updated)
    return true
  }, [user])

  const can = useCallback((permission) => {
    if (!user) return false
    return ROLES[user.role]?.can.includes(permission) ?? false
  }, [user])

  const canAccess = useCallback((page) => {
    if (!user) return false
    return ROLES[user.role]?.pages.includes(page) ?? false
  }, [user])

  const roleInfo = user ? ROLES[user.role] : null

  // Refresh allUsers from localStorage
  const refreshUsers = useCallback(() => {
    setAllUsers(loadUsers())
  }, [])

  return (
    <AuthContext.Provider value={{
      user, login, signup, logout, updateUser, can, canAccess, roleInfo, error, setError,
      allUsers, changeUserRole, deleteUser, addUser, refreshUsers,
      DEMO_USERS: allUsers.map(({ password: _, ...u }) => u)
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
