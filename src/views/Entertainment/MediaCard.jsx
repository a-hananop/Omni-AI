import { Star } from 'lucide-react'

export default function MediaCard({ item, index }) {
  return (
    <div className="media-card anim-fade-up" style={{ animationDelay: `${index * 0.04}s` }}>
      <div className="media-thumb">
        <span>{item.emoji}</span>
      </div>
      <div className="media-info">
        <div className="media-title truncate">{item.title}</div>
        <div className="media-sub truncate">{item.sub}</div>
        <div className="flex items-center gap-6 mt-8" style={{ marginTop: 8 }}>
          <Star size={11} fill="var(--amber)" color="var(--amber)" />
          <span className="font-fm f12 t-amber">{item.rating}</span>
          {item.genre && (
            <span className="f11 t3" style={{ marginLeft: 4 }}>· {item.genre}</span>
          )}
        </div>
      </div>
    </div>
  )
}
