import './MessageBubble.css'

function MessageBubble({ message }) {
  const { type, content, timestamp } = message

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`message-wrapper ${type}`}>
      <div className={`message-bubble ${type}`}>
        <p className="message-content">{content}</p>
        <span className="message-time">{formatTime(timestamp)}</span>
      </div>
    </div>
  )
}

export default MessageBubble
