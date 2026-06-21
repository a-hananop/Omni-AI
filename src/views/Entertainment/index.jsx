import { useState, useRef, useCallback } from 'react'
import {
  Film, Music, BookOpen, Play, Pause, SkipForward, SkipBack,
  ExternalLink, Upload, Plus, Trash2, Star, X, Volume2,
  ShoppingCart, Download, Globe
} from 'lucide-react'
import Tabs from '../../components/ui/Tabs.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Modal, { ModalActions } from '../../components/ui/Modal.jsx'
import { MEDIA } from '../../data/media.js'

const TABS = [
  { id: 'movies', label: 'Movies & TV', icon: Film    },
  { id: 'music',  label: 'Music',       icon: Music   },
  { id: 'books',  label: 'Books',       icon: BookOpen },
]

// ── Real links for movies ─────────────────────────────────────────────────
const MOVIE_LINKS = {
  'Oppenheimer':       { imdb: 'https://www.imdb.com/title/tt15398776/', jw: 'https://www.justwatch.com/us/movie/oppenheimer' },
  'Dune: Part II':     { imdb: 'https://www.imdb.com/title/tt15239678/', jw: 'https://www.justwatch.com/us/movie/dune-part-two' },
  'The Bear':          { imdb: 'https://www.imdb.com/title/tt14452776/', jw: 'https://www.justwatch.com/us/tv-show/the-bear'   },
  'Poor Things':       { imdb: 'https://www.imdb.com/title/tt14230458/', jw: 'https://www.justwatch.com/us/movie/poor-things'  },
  'Interstellar':      { imdb: 'https://www.imdb.com/title/tt0816692/',  jw: 'https://www.justwatch.com/us/movie/interstellar' },
  'Past Lives':        { imdb: 'https://www.imdb.com/title/tt13238346/', jw: 'https://www.justwatch.com/us/movie/past-lives'   },
  'Civil War':         { imdb: 'https://www.imdb.com/title/tt17279496/', jw: 'https://www.justwatch.com/us/movie/civil-war-2024'},
  'Alien: Romulus':    { imdb: 'https://www.imdb.com/title/tt18412256/', jw: 'https://www.justwatch.com/us/movie/alien-romulus'},
}

// ── Real links for music ─────────────────────────────────────────────────
const MUSIC_LINKS = {
  'Midnights':        { spotify: 'https://open.spotify.com/album/151w1FgRZfnKZA9FEcg9Z3', yt: 'https://www.youtube.com/watch?v=jLZGSSCO-CM' },
  'SOS':              { spotify: 'https://open.spotify.com/album/4SZko61aMnmgvNhfhgTuD3', yt: 'https://www.youtube.com/watch?v=jnGDXNiIE1M' },
  'Un Verano Sin Ti': { spotify: 'https://open.spotify.com/album/3RQQmkQEvNCY4prGKE6oc5',  yt: 'https://www.youtube.com/watch?v=OL3oNRBhRos' },
  'Dawn FM':          { spotify: 'https://open.spotify.com/album/5NHm2TBHlLFkgBsHJFBNnT', yt: 'https://www.youtube.com/watch?v=7oJPeGBmqVY' },
  'Guts':             { spotify: 'https://open.spotify.com/album/4ZCNZN7S1YDstQSRLhfsCZ',  yt: 'https://www.youtube.com/watch?v=ZJxRKiTRQh8' },
  'GNX':              { spotify: 'https://open.spotify.com/album/0hvT3yIEysuuvkK73vgdcW',  yt: 'https://www.youtube.com/watch?v=qiBBJqxKj-Q' },
  'Short n Sweet':    { spotify: 'https://open.spotify.com/album/5hnbMN1ukKqPtTY5N5YUMW',  yt: 'https://www.youtube.com/watch?v=mJTEDilnbVw' },
  'Eternal Sunshine': { spotify: 'https://open.spotify.com/album/5hnbMN1ukKqPtTY5N5YUMW',  yt: 'https://www.youtube.com/watch?v=Qom0m2PBPlI' },
}

// ── Real links for books ─────────────────────────────────────────────────
const BOOK_LINKS = {
  'Atomic Habits':        { goodreads: 'https://www.goodreads.com/book/show/40121378', amazon: 'https://amzn.to/3Rg8Z6S', free: null },
  'Deep Work':            { goodreads: 'https://www.goodreads.com/book/show/25744928', amazon: 'https://amzn.to/3RfZpqr', free: null },
  'The Almanack':         { goodreads: 'https://www.goodreads.com/book/show/54898389', amazon: null, free: 'https://www.navalmanack.com/' },
  'Project Hail Mary':    { goodreads: 'https://www.goodreads.com/book/show/54493401', amazon: 'https://amzn.to/3pXb1Lv', free: null },
  '4000 Weeks':           { goodreads: 'https://www.goodreads.com/book/show/54785515', amazon: 'https://amzn.to/3RqXNKo', free: null },
  'Same As Ever':         { goodreads: 'https://www.goodreads.com/book/show/125116554', amazon: 'https://amzn.to/3SfKhKS', free: null },
  'Nexus':                { goodreads: 'https://www.goodreads.com/book/show/204927599', amazon: 'https://amzn.to/4bXrNKG', free: null },
  'The God of Small Things': { goodreads: 'https://www.goodreads.com/book/show/9777.', amazon: 'https://amzn.to/3pYV9Hx', free: 'https://standardebooks.org/ebooks/arundhati-roy/the-god-of-small-things' },
}

export default function Entertainment() {
  const [tab,          setTab]          = useState('movies')
  const [userMusic,    setUserMusic]    = useState([])   // uploaded tracks
  const [userMovies,   setUserMovies]   = useState([])
  const [userBooks,    setUserBooks]    = useState([])
  const [nowPlaying,   setNowPlaying]   = useState(null) // track index in combined list
  const [playing,      setPlaying]      = useState(false)
  const [progress,     setProgress]     = useState(0)
  const [duration,     setDuration]     = useState(0)
  const [showAddBook,  setShowAddBook]  = useState(false)
  const [showAddMovie, setShowAddMovie] = useState(false)
  const [addForm,      setAddForm]      = useState({ title: '', author: '', link: '' })
  const audioRef = useRef(null)

  const allMusic = [...MEDIA.music.map((m) => ({ ...m, isStream: true })), ...userMusic]

  // ── Audio player ──────────────────────────────────────────────────────
  const playTrack = useCallback((track, idx) => {
    if (!track.url) { window.open(MUSIC_LINKS[track.title]?.spotify || 'https://open.spotify.com', '_blank'); return }
    const audio = audioRef.current
    if (!audio) return
    if (nowPlaying === idx && playing) { audio.pause(); setPlaying(false); return }
    if (nowPlaying !== idx) {
      audio.src = track.url
      audio.load()
    }
    setNowPlaying(idx)
    audio.play().then(() => setPlaying(true)).catch(() => {})
  }, [nowPlaying, playing])

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || [])
    const tracks = files.filter((f) => f.type.startsWith('audio/')).map((f) => ({
      title  : f.name.replace(/\.[^.]+$/, ''),
      sub    : 'Uploaded',
      emoji  : '🎵',
      rating : 5,
      genre  : 'My Music',
      url    : URL.createObjectURL(f),
      isLocal: true,
    }))
    setUserMusic((prev) => [...prev, ...tracks])
    e.target.value = ''
  }

  const removeUserTrack = (idx) => {
    setUserMusic((prev) => {
      const t = prev[idx - MEDIA.music.length]
      if (t?.url) URL.revokeObjectURL(t.url)
      return prev.filter((_, i) => i !== (idx - MEDIA.music.length))
    })
  }

  const skipNext = () => {
    const next = (nowPlaying + 1) % allMusic.length
    playTrack(allMusic[next], next)
  }
  const skipPrev = () => {
    const prev = (nowPlaying - 1 + allMusic.length) % allMusic.length
    playTrack(allMusic[prev], prev)
  }

  return (
    <div className="page-enter">
      <div className="section-header">
        <div className="section-title">Entertainment</div>
        <div className="section-subtitle">AI-curated picks · Real links to streaming & stores</div>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} className="mb-24" />

      {/* ── Movies & TV ── */}
      {tab === 'movies' && (
        <div>
          <div className="flex items-center justify-between mb-16">
            <div className="f13 t3">{MEDIA.movies.length + userMovies.length} titles · Click to see links</div>
            <Button variant="ghost" size="sm" icon={<Plus size={13} />} onClick={() => { setAddForm({ title:'',author:'',link:'' }); setShowAddMovie(true) }}>
              Add Custom
            </Button>
          </div>
          <div className="grid-auto-160">
            {[...MEDIA.movies, ...userMovies].map((m, i) => (
              <MovieCard key={i} item={m} links={MOVIE_LINKS[m.title]} isCustom={i >= MEDIA.movies.length}
                onRemove={i >= MEDIA.movies.length ? () => setUserMovies((p) => p.filter((_,j) => j !== i - MEDIA.movies.length)) : null} />
            ))}
          </div>
        </div>
      )}

      {/* ── Music ── */}
      {tab === 'music' && (
        <div>
          {/* Upload bar */}
          <div className="card card-p mb-20" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div className="fw6 f14 mb-4">Upload Your Music</div>
              <div className="f13 t3">Upload MP3, AAC, WAV, FLAC or any audio file to play directly</div>
            </div>
            <label style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '9px 18px', borderRadius: 10, cursor: 'pointer',
              background: 'linear-gradient(135deg, var(--cyan2), var(--purple2))',
              color: '#fff', fontSize: 14, fontWeight: 500,
              boxShadow: 'var(--shadow-cyan)',
            }}>
              <Upload size={15} /> Upload Files
              <input type="file" accept="audio/*" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>

          {/* Now playing bar */}
          {nowPlaying !== null && allMusic[nowPlaying] && (
            <div className="card mb-16" style={{ padding: '14px 20px', background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.25)' }}>
              <div className="flex items-center gap-16">
                <span style={{ fontSize: 28 }}>{allMusic[nowPlaying].emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="fw6 f14 truncate">{allMusic[nowPlaying].title}</div>
                  <div className="f12 t3">{allMusic[nowPlaying].sub}</div>
                  {/* Progress */}
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 8, cursor: 'pointer' }}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const pct  = (e.clientX - rect.left) / rect.width
                      if (audioRef.current) audioRef.current.currentTime = pct * duration
                    }}>
                    <div style={{ height: '100%', borderRadius: 2, background: 'var(--cyan)', width: `${duration ? (progress / duration) * 100 : 0}%`, transition: 'width 0.5s linear' }} />
                  </div>
                  <div className="flex justify-between mt-4" style={{ marginTop: 4 }}>
                    <span className="font-fm f11 t3">{fmtAudioTime(progress)}</span>
                    <span className="font-fm f11 t3">{fmtAudioTime(duration)}</span>
                  </div>
                </div>
                <div className="flex gap-8">
                  <button onClick={skipPrev}  style={playerBtnStyle}><SkipBack size={16} /></button>
                  <button onClick={() => playTrack(allMusic[nowPlaying], nowPlaying)} style={{ ...playerBtnStyle, background: 'var(--cyan2)', color: '#fff', width: 40, height: 40, borderRadius: 10, boxShadow: 'var(--shadow-cyan)' }}>
                    {playing ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button onClick={skipNext}  style={playerBtnStyle}><SkipForward size={16} /></button>
                </div>
              </div>
            </div>
          )}

          {/* Track list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {allMusic.map((m, i) => (
              <MusicRow key={i} track={m} idx={i} isPlaying={nowPlaying === i && playing}
                links={MUSIC_LINKS[m.title]} onPlay={() => playTrack(m, i)}
                onRemove={m.isLocal ? () => removeUserTrack(i) : null} />
            ))}
          </div>

          {/* Hidden audio element */}
          <audio ref={audioRef} style={{ display: 'none' }}
            onTimeUpdate={() => setProgress(audioRef.current?.currentTime || 0)}
            onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
            onEnded={skipNext}
          />
        </div>
      )}

      {/* ── Books ── */}
      {tab === 'books' && (
        <div>
          <div className="flex items-center justify-between mb-16">
            <div className="f13 t3">{MEDIA.books.length + userBooks.length} books · Links to Goodreads, Amazon & free reads</div>
            <Button variant="ghost" size="sm" icon={<Plus size={13} />} onClick={() => { setAddForm({ title:'',author:'',link:'' }); setShowAddBook(true) }}>
              Add Custom
            </Button>
          </div>
          <div className="grid-auto-160">
            {[...MEDIA.books, ...userBooks].map((b, i) => (
              <BookCard key={i} item={b} links={BOOK_LINKS[b.title]} isCustom={i >= MEDIA.books.length}
                onRemove={i >= MEDIA.books.length ? () => setUserBooks((p) => p.filter((_,j) => j !== i - MEDIA.books.length)) : null} />
            ))}
          </div>
        </div>
      )}

      {/* Add Movie Modal */}
      <Modal open={showAddMovie} onClose={() => setShowAddMovie(false)} title="Add Custom Movie/Show">
        <div className="input-group"><label className="input-label">Title</label>
          <input className="input" value={addForm.title} onChange={(e) => setAddForm({ ...addForm, title: e.target.value })} placeholder="Movie or show title" autoFocus />
        </div>
        <div className="input-group"><label className="input-label">Type (e.g. Drama · 2024)</label>
          <input className="input" value={addForm.author} onChange={(e) => setAddForm({ ...addForm, author: e.target.value })} placeholder="Genre · Year" />
        </div>
        <ModalActions>
          <Button variant="ghost" onClick={() => setShowAddMovie(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => {
            if (!addForm.title.trim()) return
            setUserMovies((p) => [...p, { title: addForm.title, sub: addForm.author || 'Custom', emoji: '🎬', rating: 5, genre: 'Custom' }])
            setShowAddMovie(false)
          }}>Add</Button>
        </ModalActions>
      </Modal>

      {/* Add Book Modal */}
      <Modal open={showAddBook} onClose={() => setShowAddBook(false)} title="Add Custom Book">
        <div className="input-group"><label className="input-label">Title</label>
          <input className="input" value={addForm.title} onChange={(e) => setAddForm({ ...addForm, title: e.target.value })} placeholder="Book title" autoFocus />
        </div>
        <div className="input-group"><label className="input-label">Author</label>
          <input className="input" value={addForm.author} onChange={(e) => setAddForm({ ...addForm, author: e.target.value })} placeholder="Author name" />
        </div>
        <div className="input-group"><label className="input-label">Link (optional)</label>
          <input className="input" value={addForm.link} onChange={(e) => setAddForm({ ...addForm, link: e.target.value })} placeholder="https://..." type="url" />
        </div>
        <ModalActions>
          <Button variant="ghost" onClick={() => setShowAddBook(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => {
            if (!addForm.title.trim()) return
            setUserBooks((p) => [...p, { title: addForm.title, sub: addForm.author || 'Custom', emoji: '📖', rating: 5, genre: 'Custom', customLink: addForm.link }])
            setShowAddBook(false)
          }}>Add</Button>
        </ModalActions>
      </Modal>
    </div>
  )
}

// ── Sub components ────────────────────────────────────────────────────────────
function MovieCard({ item, links, isCustom, onRemove }) {
  const [showLinks, setShowLinks] = useState(false)
  return (
    <div className="media-card" style={{ position: 'relative' }}>
      {onRemove && (
        <button onClick={onRemove} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: 6, color: 'var(--red)', cursor: 'pointer', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <X size={12} />
        </button>
      )}
      <div className="media-thumb">{item.emoji}</div>
      <div className="media-info">
        <div className="media-title truncate">{item.title}</div>
        <div className="media-sub">{item.sub}</div>
        <div className="flex items-center gap-6 mt-8" style={{ marginTop: 6 }}>
          <Star size={11} fill="var(--amber)" color="var(--amber)" />
          <span className="font-fm f12 t-amber">{item.rating}</span>
        </div>
        {links && (
          <div className="flex gap-6 mt-8" style={{ marginTop: 8, flexWrap: 'wrap' }}>
            <a href={links.imdb} target="_blank" rel="noreferrer"
              style={{ fontSize: 11, color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}>
              IMDb <ExternalLink size={10} />
            </a>
            <a href={links.jw} target="_blank" rel="noreferrer"
              style={{ fontSize: 11, color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}>
              Where to Watch <ExternalLink size={10} />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

function MusicRow({ track, idx, isPlaying, links, onPlay, onRemove }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '12px 16px', borderRadius: 12,
      border: `1px solid ${isPlaying ? 'rgba(56,189,248,0.3)' : 'var(--border)'}`,
      background: isPlaying ? 'rgba(56,189,248,0.07)' : 'var(--bg2)',
      transition: 'all 0.2s',
    }}>
      <button onClick={onPlay} style={{
        width: 38, height: 38, borderRadius: 10, border: 'none',
        background: isPlaying ? 'var(--cyan2)' : 'rgba(255,255,255,0.07)',
        color: isPlaying ? '#fff' : 'var(--t2)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s', flexShrink: 0,
      }}>
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>

      <span style={{ fontSize: 22, flexShrink: 0 }}>{track.emoji}</span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="fw6 f14 truncate">{track.title}
          {track.isLocal && <Badge variant="purple" style={{ marginLeft: 8 }}>Local</Badge>}
        </div>
        <div className="f12 t3">{track.sub}{track.genre && ` · ${track.genre}`}</div>
      </div>

      <div className="flex gap-8 items-center">
        <span className="font-fm f12 t-amber flex items-center gap-4"><Star size={11} fill="var(--amber)" color="var(--amber)" /> {track.rating}</span>

        {!track.isLocal && links && (
          <>
            <a href={links.spotify} target="_blank" rel="noreferrer" title="Open in Spotify"
              style={{ padding: '5px 10px', borderRadius: 7, background: 'rgba(30,215,96,0.12)', border: '1px solid rgba(30,215,96,0.2)', color: '#1ED760', fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Spotify <ExternalLink size={10} />
            </a>
            <a href={links.yt} target="_blank" rel="noreferrer" title="Open on YouTube"
              style={{ padding: '5px 10px', borderRadius: 7, background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.2)', color: '#ff4444', fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              YT <ExternalLink size={10} />
            </a>
          </>
        )}
        {track.isLocal && onRemove && (
          <button onClick={onRemove} style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 7, color: 'var(--red)', cursor: 'pointer', padding: '5px 8px' }}>
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  )
}

function BookCard({ item, links, isCustom, onRemove }) {
  return (
    <div className="media-card" style={{ position: 'relative' }}>
      {onRemove && (
        <button onClick={onRemove} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: 6, color: 'var(--red)', cursor: 'pointer', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <X size={12} />
        </button>
      )}
      <div className="media-thumb">{item.emoji}</div>
      <div className="media-info">
        <div className="media-title truncate">{item.title}</div>
        <div className="media-sub truncate">{item.sub}</div>
        <div className="flex items-center gap-6 mt-6" style={{ marginTop: 6 }}>
          <Star size={11} fill="var(--amber)" color="var(--amber)" />
          <span className="font-fm f12 t-amber">{item.rating}</span>
        </div>
        {(links || item.customLink) && (
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {links?.goodreads && <a href={links.goodreads} target="_blank" rel="noreferrer" style={bookLinkStyle('#e07133')}>Goodreads <ExternalLink size={10} /></a>}
            {links?.amazon   && <a href={links.amazon}    target="_blank" rel="noreferrer" style={bookLinkStyle('var(--amber)')}>Amazon <ShoppingCart size={10} /></a>}
            {links?.free     && <a href={links.free}      target="_blank" rel="noreferrer" style={bookLinkStyle('var(--green)')}>Free Read <Download size={10} /></a>}
            {item.customLink && <a href={item.customLink} target="_blank" rel="noreferrer" style={bookLinkStyle('var(--cyan)')}>Open Link <ExternalLink size={10} /></a>}
          </div>
        )}
      </div>
    </div>
  )
}

const bookLinkStyle = (color) => ({
  fontSize: 11, color, display: 'flex', alignItems: 'center', gap: 3,
  textDecoration: 'none', fontWeight: 500,
})
const playerBtnStyle = {
  width: 34, height: 34, borderRadius: 8, border: '1px solid var(--border)',
  background: 'var(--bg2)', color: 'var(--t2)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
const fmtAudioTime = (s) => {
  const m = Math.floor(s / 60), sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}
