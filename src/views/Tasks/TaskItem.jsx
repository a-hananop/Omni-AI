import { Check, Trash2 } from 'lucide-react'
import { PriorityBadge } from '../../components/ui/Badge.jsx'
import Badge from '../../components/ui/Badge.jsx'

const CAT_VARIANT = {
  Work: 'cyan', Health: 'green', Personal: 'purple',
  Learning: 'amber', Finance: 'pink', Social: 'orange',
}

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className={`task-item ${task.done ? 'done' : ''}`}>
      <button
        className={`task-check ${task.done ? 'checked' : ''}`}
        onClick={() => onToggle(task.id)}
        aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.done && <Check size={12} color="#fff" strokeWidth={3} />}
      </button>

      <span className="task-text truncate">{task.text}</span>

      <PriorityBadge priority={task.priority} />
      <Badge variant={CAT_VARIANT[task.category] || 'cyan'}>{task.category}</Badge>

      <button
        className="task-del"
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}
