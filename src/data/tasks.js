export const INITIAL_TASKS = [
  { id: 1, text: 'Complete project proposal', priority: 'high',   done: false, category: 'Work'     },
  { id: 2, text: 'Morning workout – 30 mins', priority: 'medium', done: true,  category: 'Health'   },
  { id: 3, text: 'Read 20 pages of book',     priority: 'low',    done: false, category: 'Learning' },
  { id: 4, text: 'Team meeting at 3 PM',      priority: 'high',   done: false, category: 'Work'     },
  { id: 5, text: 'Grocery shopping',          priority: 'medium', done: false, category: 'Personal' },
  { id: 6, text: 'Call dentist – appointment',priority: 'medium', done: true,  category: 'Health'   },
  { id: 7, text: 'Review PR #142',            priority: 'high',   done: false, category: 'Work'     },
  { id: 8, text: 'Meditate for 10 mins',      priority: 'low',    done: false, category: 'Health'   },
]

export const CATEGORIES = ['Work', 'Health', 'Personal', 'Learning', 'Finance', 'Social']
export const PRIORITIES  = ['high', 'medium', 'low']

export const PRIORITY_COLORS = {
  high:   'badge-red',
  medium: 'badge-amber',
  low:    'badge-green',
}
