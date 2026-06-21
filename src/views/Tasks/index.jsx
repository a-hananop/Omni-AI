import { useState } from 'react'
import { Plus, CheckSquare } from 'lucide-react'
import TaskItem from './TaskItem.jsx'
import Modal, { ModalActions } from '../../components/ui/Modal.jsx'
import Button from '../../components/ui/Button.jsx'
import Input, { SelectInput } from '../../components/ui/Input.jsx'
import Tabs from '../../components/ui/Tabs.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { CATEGORIES, PRIORITIES } from '../../data/tasks.js'

const FILTER_TABS = [
  { id: 'all',    label: 'All'    },
  { id: 'active', label: 'Active' },
  { id: 'done',   label: 'Done'   },
  { id: 'high',   label: 'High'   },
  { id: 'medium', label: 'Medium' },
  { id: 'low',    label: 'Low'    },
]

export default function Tasks({ tasks, setTasks }) {
  const [filter,   setFilter]   = useState('all')
  const [showAdd,  setShowAdd]  = useState(false)
  const [form, setForm]         = useState({ text: '', priority: 'medium', category: 'Work' })

  const filtered = tasks.filter((t) => {
    if (filter === 'all')    return true
    if (filter === 'active') return !t.done
    if (filter === 'done')   return t.done
    return t.priority === filter
  })

  const addTask = () => {
    if (!form.text.trim()) return
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), text: form.text.trim(), priority: form.priority, done: false, category: form.category },
    ])
    setForm({ text: '', priority: 'medium', category: 'Work' })
    setShowAdd(false)
  }

  const toggleTask  = (id) => setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t))
  const deleteTask  = (id) => setTasks((prev) => prev.filter((t) => t.id !== id))
  const clearDone   = ()   => setTasks((prev) => prev.filter((t) => !t.done))

  return (
    <div className="page-enter">
      <div className="section-header flex items-center justify-between">
        <div>
          <div className="section-title">Tasks</div>
          <div className="section-subtitle">
            {tasks.filter((t) => !t.done).length} pending · {tasks.filter((t) => t.done).length} completed
          </div>
        </div>
        <div className="flex gap-8">
          {tasks.some((t) => t.done) && (
            <Button variant="ghost" size="sm" onClick={clearDone}>Clear Done</Button>
          )}
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setShowAdd(true)}>
            Add Task
          </Button>
        </div>
      </div>

      <Tabs tabs={FILTER_TABS} active={filter} onChange={setFilter} className="mb-20" />

      {filtered.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          message="No tasks here"
          sub={filter === 'done' ? 'Complete some tasks first' : 'Add a new task to get started'}
        />
      ) : (
        filtered.map((t) => (
          <TaskItem key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} />
        ))
      )}

      {/* Add Task Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Task">
        <Input
          label="Task description"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          placeholder="What needs to be done?"
          autoFocus
        />
        <div className="input-group">
          <label className="input-label">Priority</label>
          <div className="flex gap-8">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                className={`btn btn-sm ${form.priority === p ? 'btn-primary' : 'btn-ghost'}`}
                style={{ flex: 1, textTransform: 'capitalize' }}
                onClick={() => setForm({ ...form, priority: p })}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <SelectInput
          label="Category"
          value={form.category}
          onChange={(v) => setForm({ ...form, category: v })}
          options={CATEGORIES}
        />
        <ModalActions>
          <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
          <Button variant="primary" onClick={addTask} disabled={!form.text.trim()}>Add Task</Button>
        </ModalActions>
      </Modal>
    </div>
  )
}
