<p align="center">
  <img src="public/banner.png" alt="OmniAI Banner" width="100%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Claude_AI-Anthropic-7C3AED?style=for-the-badge&logo=anthropic&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/version-2.0.0-brightgreen?style=for-the-badge" />
</p>

<p align="center">
  A fully-featured personal AI assistant with role-based access control, real AI chat, music upload, smart home voice control, health tracking, task management, and much more.
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Assistant** | Real Claude AI chat with voice input, message history, copy & delete |
| 🔐 **RBAC System** | 4 user roles (Admin, Premium, User, Guest) with permission-gated views |
| 🏠 **Smart Home** | Voice commands, real Battery/Notification APIs, Home Assistant integration |
| 🎵 **Music Upload** | Upload MP3/AAC/WAV/FLAC files, plays directly in browser via HTML5 Audio |
| 📋 **Task Manager** | Create, complete, and track personal tasks |
| 📅 **Calendar** | Schedule and view events |
| 🏋️ **Health Tracker** | Log fitness and health metrics with charts |
| 📚 **Learning Hub** | Courses, session timer, notes, editable flashcards |
| 🎬 **Entertainment** | Media cards with real Spotify & YouTube links |
| ⚙️ **Settings** | RBAC panel, password change, data export |

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/omni-ai.git
cd omni-ai

# 2. Install dependencies
npm install

# 3. Configure your API key
cp .env.example .env
# Open .env and add your Anthropic API key:
# ANTHROPIC_API_KEY=sk-ant-...

# 4. Start everything (frontend + backend together)
npm run dev
```

Visit **http://localhost:3000** 🎉

---

## 🔐 Demo Accounts (RBAC)

| Email | Password | Role | Access |
|-------|----------|------|--------|
| admin@omni.ai | admin123 | **Admin** | Full access + user management |
| sara@omni.ai | premium123 | **Premium** | All features including AI |
| mike@omni.ai | user123 | **User** | Core features, no AI |
| guest@omni.ai | guest123 | **Guest** | Dashboard & Entertainment only |

---

## 🤖 How the AI Works

Browsers block direct Anthropic API calls (CORS). A local Express proxy server handles it server-side:

```
Browser  →  /api/chat  →  server.js  →  Anthropic Claude API
```

Run `npm run dev` to start both the frontend (Vite) and backend (Express) together.

---

## 🏠 Smart Home

Runs in **Demo Mode** by default — all controls are simulated locally.

**Real Web APIs used:**
- 🔋 Battery Status API (real device battery level)
- 🎤 Web Speech API (voice commands — Chrome/Edge only)
- 🔔 Web Notifications API (device change alerts)

**Voice command examples:**
```
"Turn on living room lights"
"All lights off"
"Set brightness to 80"
"Set temperature to 22"
```

**To connect real smart home devices:**
1. **Home Assistant** — Click ⚙ in Smart Home → enter your HA URL + access token
2. See the ℹ info panel inside the app for Google Home, SmartThings, Philips Hue guides

---

## 🎵 Music Upload

In **Entertainment → Music**, click **Upload Files** to add any local audio file.
- Supported formats: `MP3`, `AAC`, `WAV`, `FLAC`
- Plays directly via the HTML5 Audio API — no server needed
- Uploaded tracks show a ▶ play button; external tracks link to Spotify/YouTube

---

## 📁 Project Structure

```
omni-ai/
├── server.js               ← Express API proxy for Anthropic
├── vite.config.js          ← Vite config + /api/* proxy
├── .env.example            ← Environment variable template
├── public/
│   └── banner.png          ← Project banner
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── contexts/
    │   └── AuthContext.jsx         ← RBAC with 4 roles
    ├── components/
    │   ├── auth/
    │   │   └── LoginScreen.jsx     ← Login UI with demo accounts
    │   ├── layout/
    │   │   ├── Sidebar.jsx         ← Collapsible, role-aware sidebar
    │   │   └── Topbar.jsx          ← User info + logout
    │   └── ui/                     ← Badge, Button, Card, Modal, Tabs...
    ├── hooks/
    │   ├── useChat.js              ← AI chat via /api/chat proxy
    │   └── useLocalStorage.js
    ├── data/
    │   ├── tasks.js
    │   ├── health.js
    │   ├── courses.js
    │   ├── media.js
    │   ├── devices.js
    │   └── flashcards.js
    ├── views/
    │   ├── AIAssistant/            ← Voice input, copy, delete messages
    │   ├── Dashboard/
    │   ├── Tasks/
    │   ├── Calendar/
    │   ├── Health/
    │   ├── Learning/               ← Session timer, notes, flashcards
    │   ├── Entertainment/          ← Music upload, media cards
    │   ├── SmartHome/              ← Voice control, HA integration
    │   ├── PersonalSpace/
    │   └── Settings/               ← RBAC panel, data export
    ├── constants/
    │   └── navigation.js
    ├── utils/
    │   └── helpers.js
    └── styles/
        ├── globals.css
        ├── variables.css
        ├── components.css
        └── animations.css
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite 5 |
| **Backend** | Node.js + Express 4 |
| **AI** | Anthropic Claude API |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Web APIs** | Audio, Speech Recognition, Notifications, Battery |
| **Styling** | Vanilla CSS with custom design system |

---

## 📜 Scripts

```bash
npm run dev       # Start frontend + backend together (recommended)
npm run server    # Start Express backend only
npm run client    # Start Vite frontend only
npm run build     # Build for production
npm run preview   # Preview production build
```

---

## 🔑 Environment Variables

Create a `.env` file from the template:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | ✅ Yes | Your Anthropic API key — get one at [console.anthropic.com](https://console.anthropic.com/keys) |
| `HA_BASE_URL` | ❌ Optional | Home Assistant base URL (e.g. `http://homeassistant.local:8123`) |
| `HA_TOKEN` | ❌ Optional | Home Assistant long-lived access token |
| `PORT` | ❌ Optional | Backend server port (default: `3001`) |

---

## 📄 License

This project is open source. Feel free to use it, modify it, and build on top of it.

---

<p align="center">
  Built with ❤️ using React, Vite & Claude AI
</p>
