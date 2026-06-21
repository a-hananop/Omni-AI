import { useState } from 'react'
import { Play, ExternalLink, ChevronDown, ChevronUp, Video, Link2 } from 'lucide-react'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import { CAT_BADGE } from '../../data/courses.js'

export default function CourseItem({ course, onUpdate }) {
  const pct = Math.round((course.done / course.total) * 100)
  const [showResources, setShowResources] = useState(false)

  const videos = course.videos || []
  const resources = course.resources || []
  const hasResources = videos.length > 0 || resources.length > 0

  return (
    <div className="course-item">
      <div className="flex items-center justify-between mb-12">
        <div style={{ flex: 1, minWidth: 0, marginRight: 12 }}>
          <div className="f14 fw6 truncate mb-6" style={{ marginBottom: 6 }}>{course.name}</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <Badge variant={CAT_BADGE[course.cat]?.replace('badge-', '') || 'cyan'}>{course.cat}</Badge>
            {videos.length > 0 && (
              <Badge variant="purple">
                <Video size={10} style={{ marginRight: 3, verticalAlign: -1 }} />
                {videos.length} video{videos.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
        <div className="text-right" style={{ flexShrink: 0 }}>
          <div className="font-fm f13 t-cyan">{pct}%</div>
          <div className="f12 t3">{course.done}/{course.total} lessons</div>
        </div>
      </div>

      <ProgressBar value={course.done} max={course.total} className="mb-12" />

      <div className="flex gap-8" style={{ marginBottom: hasResources ? 8 : 0 }}>
        <Button variant="ghost" size="sm" onClick={() => onUpdate(course.id, -1)} disabled={course.done === 0}>
          − Lesson
        </Button>
        <Button variant="primary" size="sm" onClick={() => onUpdate(course.id, 1)} disabled={course.done >= course.total}>
          + Complete Lesson
        </Button>
        {hasResources && (
          <Button
            variant="ghost" size="sm"
            onClick={() => setShowResources(!showResources)}
            style={{ marginLeft: 'auto' }}
          >
            {showResources ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {showResources ? ' Hide' : ' Resources'}
          </Button>
        )}
      </div>

      {/* ── Videos & Resources Section ── */}
      {showResources && hasResources && (
        <div style={{
          marginTop: 12,
          padding: 14,
          borderRadius: 10,
          background: 'rgba(56,189,248,0.04)',
          border: '1px solid rgba(56,189,248,0.1)',
          animation: 'fadeIn 0.25s ease',
        }}>
          {/* Videos */}
          {videos.length > 0 && (
            <div style={{ marginBottom: resources.length > 0 ? 14 : 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Video size={13} style={{ color: 'var(--purple)' }} />
                Learning Videos
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {videos.map((v, i) => (
                  <a
                    key={i}
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-resource-link"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                      borderRadius: 8, background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.12)',
                      textDecoration: 'none', transition: 'all 0.2s ease', cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(167,139,250,0.12)'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(167,139,250,0.06)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    <div style={{
                      width: 30, height: 30, borderRadius: 8,
                      background: 'linear-gradient(135deg, #FF0000, #CC0000)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Play size={13} fill="#fff" color="#fff" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {v.title}
                      </div>
                      {v.duration && (
                        <div style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--fm)' }}>
                          Duration: {v.duration}
                        </div>
                      )}
                    </div>
                    <ExternalLink size={12} style={{ color: 'var(--t3)', flexShrink: 0 }} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Resource Links */}
          {resources.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Link2 size={13} style={{ color: 'var(--cyan)' }} />
                Additional Resources
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {resources.map((r, i) => (
                  <a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '5px 12px', borderRadius: 20,
                      background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.15)',
                      fontSize: 12, fontWeight: 600, color: 'var(--cyan)',
                      textDecoration: 'none', transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.16)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.08)' }}
                  >
                    <ExternalLink size={10} />
                    {r.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
