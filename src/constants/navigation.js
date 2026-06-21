import {
  LayoutDashboard, CheckSquare, MessageCircle, Heart,
  Calendar, BookOpen, Tv, Home, Settings, User
} from 'lucide-react'

export const NAV_ITEMS = [
  { id: 'dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'tasks',         label: 'Tasks',          icon: CheckSquare    },
  { id: 'ai',            label: 'AI Assistant',   icon: MessageCircle  },
  { id: 'health',        label: 'Health',         icon: Heart          },
  { id: 'calendar',      label: 'Calendar',       icon: Calendar       },
  { id: 'learning',      label: 'Learning',       icon: BookOpen       },
  { id: 'entertainment', label: 'Entertainment',  icon: Tv             },
  { id: 'smarthome',     label: 'Smart Home',     icon: Home           },
  { id: 'personal',      label: 'My Space',       icon: User           },
  { id: 'settings',      label: 'Settings',       icon: Settings       },
]
