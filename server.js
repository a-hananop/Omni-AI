/**
 * OmniAI Backend Server
 * Proxies Groq API calls (avoids CORS/key exposure in browser)
 * Run: node server.js  OR  npm run dev (starts both server + frontend)
 */
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app   = express()
const PORT  = process.env.PORT || 3001
const KEY   = process.env.GROQ_API_KEY || ''
const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'] }))
app.use(express.json({ limit: '10mb' }))

// ── Health check ──────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status  : 'ok',
    hasKey  : !!KEY,
    model   : MODEL,
    version : '2.0.0',
  })
})

// ── AI Chat proxy (Groq) ─────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  if (!KEY) {
    return res.status(400).json({
      error: 'GROQ_API_KEY not found. Add it to your .env file:\n\nGROQ_API_KEY=gsk_...',
    })
  }

  const { messages, system, max_tokens = 1024 } = req.body

  // Build messages array with system prompt as first message
  const groqMessages = []
  if (system) {
    groqMessages.push({ role: 'system', content: system })
  }
  groqMessages.push(...messages)

  try {
    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method : 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': `Bearer ${KEY}`,
      },
      body: JSON.stringify({
        model      : MODEL,
        max_tokens,
        messages   : groqMessages,
        temperature: 0.7,
      }),
    })

    const data = await upstream.json()

    if (!upstream.ok) {
      console.error('[AI] Upstream error:', data)
      return res.status(upstream.status).json({ error: data?.error?.message || 'Groq API error' })
    }

    // Return in a normalized format
    const reply = data.choices?.[0]?.message?.content || ''
    res.json({ reply, usage: data.usage })
  } catch (err) {
    console.error('[AI] Fetch error:', err.message)
    res.status(502).json({ error: 'Could not reach Groq API', detail: err.message })
  }
})

// ── Start ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🤖  OmniAI API Server  →  http://localhost:${PORT}`)
  console.log(`   API Key : ${KEY ? '✅  Loaded from .env' : '❌  Missing – add GROQ_API_KEY to .env'}`)
  console.log(`   Model   : ${MODEL}`)
  console.log(`   Health  : http://localhost:${PORT}/api/health\n`)
})
