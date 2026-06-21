/**
 * useChat – AI chat hook using the local /api/chat proxy
 * The proxy (server.js) forwards requests to Groq API (Llama 3.3 70B).
 */
import { useState, useCallback, useRef } from 'react'

const SYSTEM_PROMPT = `You are OmniAI, a helpful personal assistant integrated into a productivity app.
You give short, direct, and exact answers. Do not over-explain unless the user explicitly asks for an explanation.
If the user asks "what is X?" give a concise 1-2 sentence definition.
If the user asks you to explain something, then give a thorough explanation.
Use markdown formatting (bold, bullets, code blocks) when helpful.
Keep answers practical and to the point. No filler or padding.`

const INITIAL_MESSAGE = {
  role   : 'assistant',
  content: "Hi! I'm **OmniAI**, your intelligent personal assistant 🤖\n\nI can help you with tasks, health tips, learning paths, travel planning, smart home control, and much more.\n\nWhat can I help you with today?",
  ts     : Date.now(),
}

export function useChat() {
  const [messages,  setMessages]  = useState([INITIAL_MESSAGE])
  const [loading,   setLoading]   = useState(false)
  const [status,    setStatus]    = useState('idle') // idle | loading | error | ok
  const [serverOk,  setServerOk]  = useState(null)   // null = unchecked
  const abortRef = useRef(null)

  // Check server health once
  const checkServer = useCallback(async () => {
    try {
      const res  = await fetch('/api/health')
      const data = await res.json()
      setServerOk(data)
      return data
    } catch {
      setServerOk({ status: 'error' })
      return null
    }
  }, [])

  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim() || loading) return

    const userMsg = { role: 'user', content: userText.trim(), ts: Date.now() }
    const history = [...messages, userMsg]
    setMessages(history)
    setLoading(true)
    setStatus('loading')

    // Build API payload (strip ts field)
    const apiMessages = history.map(({ role, content }) => ({ role, content }))

    try {
      const res  = await fetch('/api/chat', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ messages: apiMessages, system: SYSTEM_PROMPT }),
      })

      const data = await res.json()

      if (!res.ok) {
        const errText = data?.error || `Server error ${res.status}`
        setMessages((prev) => [...prev, { role: 'assistant', content: `⚠️ **Error:** ${errText}`, ts: Date.now(), isError: true }])
        setStatus('error')
        return
      }

      const reply = data.reply || 'Sorry, I could not process that.'
      setMessages((prev) => [...prev, { role: 'assistant', content: reply, ts: Date.now() }])
      setStatus('ok')
    } catch (err) {
      const msg = err.message.includes('fetch')
        ? '⚠️ **Cannot reach the API server.**\n\nMake sure you ran `npm run dev` (which starts both the frontend AND the backend server).\n\nIf the server is running, add your `GROQ_API_KEY` to the `.env` file.'
        : `⚠️ **Unexpected error:** ${err.message}`
      setMessages((prev) => [...prev, { role: 'assistant', content: msg, ts: Date.now(), isError: true }])
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }, [messages, loading])

  const clearChat = useCallback(() => {
    setMessages([{ ...INITIAL_MESSAGE, ts: Date.now() }])
    setStatus('idle')
  }, [])

  const deleteMessage = useCallback((ts) => {
    setMessages((prev) => prev.filter((m) => m.ts !== ts))
  }, [])

  return { messages, loading, status, serverOk, sendMessage, clearChat, deleteMessage, checkServer }
}
