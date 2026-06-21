import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, size = '' }) {
  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal ${size ? `modal-${size}` : ''}`} onClick={(e) => e.stopPropagation()}>
        {title && <div className="modal-title">{title}</div>}
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={14} />
        </button>
        {children}
      </div>
    </div>
  )
}

export function ModalActions({ children }) {
  return (
    <div className="flex gap-8 mt-24" style={{ justifyContent: 'flex-end' }}>
      {children}
    </div>
  )
}
