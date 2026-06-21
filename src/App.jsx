import { useState } from 'react'
import { AuthProvider, useAuth, ROLES } from './contexts/AuthContext.jsx'
import LoginScreen from './components/auth/LoginScreen.jsx'
import Sidebar  from './components/layout/Sidebar.jsx'
import Topbar   from './components/layout/Topbar.jsx'

import Dashboard     from './views/Dashboard/index.jsx'
import Tasks         from './views/Tasks/index.jsx'
import AIAssistant   from './views/AIAssistant/index.jsx'
import Health        from './views/Health/index.jsx'
import CalendarView  from './views/Calendar/index.jsx'
import Learning      from './views/Learning/index.jsx'
import Entertainment from './views/Entertainment/index.jsx'
import SmartHome     from './views/SmartHome/index.jsx'
import PersonalSpace from './views/PersonalSpace/index.jsx'
import Settings      from './views/Settings/index.jsx'

import { INITIAL_TASKS } from './data/tasks.js'

const VIEWS = {
  dashboard    : Dashboard,
  tasks        : Tasks,
  ai           : AIAssistant,
  health       : Health,
  calendar     : CalendarView,
  learning     : Learning,
  entertainment: Entertainment,
  smarthome    : SmartHome,
  personal     : PersonalSpace,
  settings     : Settings,
}

// ── Inner shell (has access to auth context) ──────────────────────────────────
function Shell() {
  const { user, canAccess, roleInfo } = useAuth()
  const [active,    setActive]    = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [tasks,     setTasks]     = useState(INITIAL_TASKS)

  if (!user) return <LoginScreen />

  // Redirect if user tries to access a page they don't have permission for
  const safeActive = canAccess(active) ? active : (roleInfo?.pages?.[0] || 'dashboard')
  const navigate   = (page) => { if (canAccess(page)) setActive(page) }

  const ActiveView  = VIEWS[safeActive] || Dashboard
  const pendingCount = tasks.filter((t) => !t.done).length

  const viewProps = safeActive === 'tasks'
    ? { tasks, setTasks }
    : safeActive === 'dashboard'
    ? { tasks }
    : {}

  return (
    <div className="app-shell">
      <Sidebar
        active={safeActive}
        onNavigate={navigate}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        taskCount={pendingCount}
        canAccess={canAccess}
      />
      <div className="main-wrap">
        <Topbar pageTitle={safeActive} user={user} roleInfo={roleInfo} />
        <main className="content-area" key={safeActive}>
          <ActiveView {...viewProps} />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  )
}
