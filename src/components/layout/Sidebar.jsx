import { ChevronLeft, Lock } from 'lucide-react'
import { NAV_ITEMS } from '../../constants/navigation.js'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function Sidebar({ active, onNavigate, collapsed, onToggle, taskCount, canAccess }) {
  const { user, roleInfo } = useAuth()

  return (
    <nav className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">Ω</div>
        <span className="logo-text">OmniAI</span>
      </div>

      {/* Navigation */}
      <div className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const allowed = canAccess ? canAccess(item.id) : true
          return (
            <div
              key={item.id}
              className={`nav-item ${active === item.id ? 'active' : ''} ${!allowed ? 'locked' : ''}`}
              onClick={() => allowed && onNavigate(item.id)}
              title={collapsed ? item.label : (!allowed ? 'Upgrade your plan' : undefined)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && allowed && onNavigate(item.id)}
              style={{ opacity: allowed ? 1 : 0.4, cursor: allowed ? 'pointer' : 'not-allowed' }}
            >
              <item.icon size={17} />
              <span className="nav-label">{item.label}</span>
              {item.id === 'tasks' && taskCount > 0 && allowed && (
                <span className="badge badge-cyan nav-badge" style={{ padding: '2px 7px', fontSize: 11 }}>
                  {taskCount}
                </span>
              )}
              {!allowed && !collapsed && (
                <Lock size={11} style={{ color: 'var(--t3)', marginLeft: 'auto' }} />
              )}
            </div>
          )
        })}
      </div>

      {/* User info */}
      {!collapsed && user && (
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-8">
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,var(--cyan),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: 'var(--fh)', flexShrink: 0 }}>
              {user.avatar}
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="f12 fw6 truncate">{user.name}</div>
              <span className={`badge ${roleInfo?.badge || 'badge-cyan'}`} style={{ fontSize: 10, padding: '1px 7px' }}>
                {roleInfo?.label}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <div className="sidebar-footer">
        <button className="sidebar-collapse-btn" onClick={onToggle} aria-label="Toggle sidebar">
          <ChevronLeft size={16} className="collapse-icon" />
          <span className="nav-label">Collapse</span>
        </button>
      </div>
    </nav>
  )
}
