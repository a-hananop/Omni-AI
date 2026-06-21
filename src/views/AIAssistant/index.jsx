import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Send, Loader, Trash2, Mic, MicOff, Copy, RefreshCw,
  CheckCircle, AlertCircle, Server, ChevronDown
} from 'lucide-react'
import { useChat } from '../../hooks/useChat.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { StatusDot } from '../../components/ui/Badge.jsx'

// Simple markdown renderer (bold, code, bullets, newlines)
function renderMd(text) {
  return text.split('\n').map((line, i) => {
    // Bullet
    if (line.startsWith('- ') || line.startsWith('• ')) {
      const content = line.replace(/^[-•] /, '')
      return <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 3 }}>
        <span style={{ color: 'var(--cyan)', flexShrink: 0 }}>•</span>
        <span>{renderInline(content)}</span>
      </div>
    }
    // Numbered list
    if (/^\d+\. /.test(line)) {
      const [num, ...rest] = line.split('. ')
      return <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 3 }}>
        <span style={{ color: 'var(--cyan)', flexShrink: 0, fontFamily: 'var(--fm)', fontSize: 12 }}>{num}.</span>
        <span>{renderInline(rest.join('. '))}</span>
      </div>
    }
    return <span key={i}>{renderInline(line)}{i < text.split('\n').length - 1 && <br />}</span>
  })
}
function renderInline(text) {
  return text.split(/(\*\*.*?\*\*|`.*?`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} style={{ color: 'var(--t1)' }}>{part.slice(2,-2)}</strong>
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} style={{ background: 'rgba(56,189,248,0.1)', padding: '1px 5px', borderRadius: 4, fontFamily: 'var(--fm)', fontSize: '0.9em', color: 'var(--cyan)' }}>{part.slice(1,-1)}</code>
    return part
  })
}

const SUGGESTIONS = [
  { label: '🗓️ Plan my week', text: 'Help me plan a productive week. I have work tasks, gym sessions, and personal goals.' },
  { label: '😴 Better sleep', text: 'Give me a science-backed routine for better sleep quality.' },
  { label: '📚 Book rec', text: 'Recommend a book on productivity and habit building for a busy professional.' },
  { label: '✈️ Tokyo trip', text: 'Plan a 4-day trip to Tokyo for a solo traveler on a mid-range budget.' },
  { label: '🏋️ Workout', text: 'Create a 30-minute home workout routine with no equipment.' },
  { label: '🧘 Stress tips', text: 'I\'m feeling stressed with work. Give me 5 quick stress-relief techniques.' },
]

export default function AIAssistant() {
  const { messages, loading, status, serverOk, sendMessage, clearChat, deleteMessage, checkServer } = useChat()
  const { can } = useAuth()
  const [input,      setInput]      = useState('')
  const [listening,  setListening]  = useState(false)
  const [copied,     setCopied]     = useState(null)
  const [showSugg,   setShowSugg]   = useState(true)
  const bottomRef   = useRef(null)
  const textRef     = useRef(null)
  const recognRef   = useRef(null)

  const hasAI = can('use_ai')

  useEffect(() => { checkServer() }, [checkServer])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (messages.length > 1) setShowSugg(false)
  }, [messages])

  const handleSend = useCallback(() => {
    if (!input.trim() || loading || !hasAI) return
    sendMessage(input.trim())
    setInput('')
    textRef.current?.focus()
  }, [input, loading, sendMessage, hasAI])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  // Voice input via Web Speech API
  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return alert('Speech recognition not supported in this browser.')

    if (listening) {
      recognRef.current?.stop()
      setListening(false)
      return
    }
    const recog = new SpeechRecognition()
    recog.lang = 'en-US'
    recog.interimResults = false
    recog.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      setInput((prev) => prev + (prev ? ' ' : '') + transcript)
      setListening(false)
    }
    recog.onerror = () => setListening(false)
    recog.onend   = () => setListening(false)
    recog.start()
    recognRef.current = recog
    setListening(true)
  }

  const copyMessage = (content, ts) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(ts)
      setTimeout(() => setCopied(null), 1800)
    })
  }

  // Server status indicator
  const ServerStatus = () => {
    if (!serverOk) return <span className="badge badge-amber">Checking server…</span>
    if (serverOk.status !== 'ok') return (
      <span className="badge badge-red" style={{ cursor: 'pointer' }} onClick={checkServer}>
        <AlertCircle size={11} /> Server offline
      </span>
    )
    return (
      <span className="badge badge-green" style={{ gap: 5 }}>
        <StatusDot online /> {serverOk.hasKey ? 'Ready' : 'No API key'}
      </span>
    )
  }

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-16" style={{ flexShrink: 0 }}>
        <div>
          <div className="section-title">AI Assistant</div>
          <div className="section-subtitle flex items-center gap-8">
            Powered by Llama 3.3 · <ServerStatus />
          </div>
        </div>
        <div className="flex gap-8">
          {!hasAI && <span className="badge badge-red">Upgrade to use AI</span>}
          <button className="btn btn-ghost btn-sm" onClick={clearChat} style={{ gap: 6 }}>
            <RefreshCw size={13} /> New chat
          </button>
        </div>
      </div>

      {/* API key warning */}
      {serverOk && !serverOk.hasKey && (
        <div style={{
          background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)',
          borderRadius: 12, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: 'var(--amber)',
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <Server size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <strong>API key not configured.</strong> Add your Groq key to the <code style={{ fontFamily: 'var(--fm)', background: 'rgba(251,191,36,0.1)', padding: '1px 5px', borderRadius: 4 }}>.env</code> file:
            <br /><code style={{ fontFamily: 'var(--fm)', fontSize: 12 }}>GROQ_API_KEY=gsk_...</code>
            <br />Then restart the server with <code style={{ fontFamily: 'var(--fm)', fontSize: 12 }}>npm run dev</code>.
          </div>
        </div>
      )}

      {/* Chat window */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        {/* Messages */}
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={m.ts || i} className={`chat-msg ${m.role === 'user' ? 'user' : 'ai'}`}
              style={{ position: 'relative' }}
              onMouseEnter={(e) => { const btn = e.currentTarget.querySelector('.msg-actions'); if (btn) btn.style.opacity = '1' }}
              onMouseLeave={(e) => { const btn = e.currentTarget.querySelector('.msg-actions'); if (btn) btn.style.opacity = '0' }}>
              <div className="chat-avatar" style={{
                background: m.role === 'user' ? 'linear-gradient(135deg,var(--cyan2),var(--purple2))' : 'linear-gradient(135deg,#0d1526,#1e293b)',
                border: m.role === 'ai' ? '1px solid var(--border2)' : 'none',
                color: '#fff', fontFamily: 'var(--fh)',
              }}>
                {m.role === 'user' ? 'You' : 'AI'}
              </div>
              <div className="chat-bubble" style={{ position: 'relative' }}>
                <div style={{ lineHeight: 1.65 }}>{renderMd(m.content)}</div>
                {/* Actions */}
                <div className="msg-actions" style={{
                  position: 'absolute', top: -8, right: m.role === 'user' ? 'auto' : -8, left: m.role === 'user' ? -8 : 'auto',
                  display: 'flex', gap: 4, opacity: 0, transition: 'opacity 0.2s',
                }}>
                  <button title="Copy" onClick={() => copyMessage(m.content, m.ts)}
                    style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t3)' }}>
                    {copied === m.ts ? <CheckCircle size={12} style={{ color: 'var(--green)' }} /> : <Copy size={12} />}
                  </button>
                  {i > 0 && (
                    <button title="Delete" onClick={() => deleteMessage(m.ts)}
                      style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)' }}>
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
                {m.ts && (
                  <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 6, fontFamily: 'var(--fm)' }}>
                    {new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-msg ai">
              <div className="chat-avatar" style={{ background: 'linear-gradient(135deg,#0d1526,#1e293b)', border: '1px solid var(--border2)', color: '#fff', fontFamily: 'var(--fh)' }}>AI</div>
              <div className="chat-bubble">
                <div style={{ display: 'flex', gap: 5, padding: '3px 0' }}>
                  <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {showSugg && messages.length === 1 && (
          <div style={{ padding: '0 20px 14px' }}>
            <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 10, fontWeight: 500 }}>Try asking:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="btn btn-ghost"
                  style={{ fontSize: 12, padding: '6px 12px', borderRadius: 20 }}
                  onClick={() => { setInput(s.text); textRef.current?.focus() }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input row */}
        <div className="chat-input-row">
          <button
            title={listening ? 'Stop recording' : 'Voice input'}
            onClick={toggleVoice}
            style={{
              width: 44, height: 44, minWidth: 44, borderRadius: 12, border: '1px solid var(--border)',
              background: listening ? 'rgba(248,113,113,0.15)' : 'var(--bg2)',
              color: listening ? 'var(--red)' : 'var(--t3)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: listening ? 'pulse 1s infinite' : 'none',
              transition: 'all 0.2s',
            }}>
            {listening ? <MicOff size={17} /> : <Mic size={17} />}
          </button>
          <textarea
            ref={textRef}
            className="chat-textarea"
            placeholder={hasAI ? 'Ask me anything… (Shift+Enter for new line)' : 'Upgrade your plan to use AI Assistant'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            disabled={!hasAI}
            aria-label="Message input"
          />
          <button className="chat-send-btn" onClick={handleSend}
            disabled={loading || !input.trim() || !hasAI} aria-label="Send">
            {loading ? <Loader size={17} className="spin" /> : <Send size={17} />}
          </button>
        </div>
      </div>
    </div>
  )
}
