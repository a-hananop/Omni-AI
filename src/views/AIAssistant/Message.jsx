export default function Message({ msg }) {
  const isUser = msg.role === 'user'

  // Simple markdown-like rendering for bold and line breaks
  const renderContent = (text) => {
    return text
      .split('\n')
      .map((line, i) => {
        // Bold: **text**
        const parts = line.split(/\*\*(.*?)\*\*/g)
        return (
          <span key={i}>
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j}>{part}</strong> : part
            )}
            {i < text.split('\n').length - 1 && <br />}
          </span>
        )
      })
  }

  return (
    <div className={`chat-msg ${isUser ? 'user' : 'ai'}`}>
      <div
        className="chat-avatar"
        style={{
          background: isUser
            ? 'linear-gradient(135deg, var(--cyan2), var(--purple2))'
            : 'linear-gradient(135deg, #0d1526, #1e293b)',
          border: isUser ? 'none' : '1px solid var(--border2)',
          color: '#fff',
        }}
      >
        {isUser ? 'You' : 'AI'}
      </div>
      <div className="chat-bubble">{renderContent(msg.content)}</div>
    </div>
  )
}
