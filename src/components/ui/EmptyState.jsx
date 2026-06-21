export default function EmptyState({ icon: Icon, message = 'Nothing here yet', sub }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={38} />}
      <p className="fw5 f14">{message}</p>
      {sub && <p className="f13">{sub}</p>}
    </div>
  )
}
