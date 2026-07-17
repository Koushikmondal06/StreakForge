import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react'
import TopNav from '@/components/TopNav'
import { useAuth } from '@/hooks/useAuth'
import { API_BASE } from '@/services/api'

interface Message {
  role: 'user' | 'ai'
  content: string
}

export default function AiAssistant() {
  const { token, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { replace: true })
  }, [isAuthenticated, navigate])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!isAuthenticated) return null

  const send = async () => {
    if (!input.trim() || loading || !token) return
    const prompt = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: prompt }])
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/ai`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })
      if (!res.ok) throw new Error(`Failed: ${res.status}`)
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'ai', content: data.response }])
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', content: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const formatMessage = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('###')) return <h4 key={i} className="text-sm font-semibold text-text-primary mt-3 mb-1">{line.replace(/^###\s*/, '')}</h4>
      if (line.startsWith('##')) return <h3 key={i} className="text-base font-bold text-text-primary mt-4 mb-2">{line.replace(/^##\s*/, '')}</h3>
      if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="text-sm ml-4 list-disc">{line.slice(2)}</li>
      if (line.trim() === '') return <br key={i} />
      return <p key={i} className="text-sm leading-relaxed">{line}</p>
    })
  }

  const suggestions = [
    'How can I improve my coding consistency?',
    'Analyze my commit patterns',
    'What are best practices for daily commits?',
    'Help me set realistic coding goals',
  ]

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <TopNav />
      <main className="flex-1 pt-16 flex flex-col max-w-4xl mx-auto w-full px-4">
        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center mb-6 animate-float">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-2">AI Coding Assistant</h2>
              <p className="text-sm text-text-secondary text-center max-w-md mb-8">
                Ask me anything about your coding habits, get personalized tips, or analyze your GitHub activity.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="glass rounded-xl px-4 py-3 text-sm text-text-secondary hover:text-text-primary text-left transition-all hover:bg-bg-card-hover"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-accent-muted flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-accent text-white rounded-br-md'
                    : 'glass rounded-bl-md text-text-primary'
                }`}
              >
                {msg.role === 'ai' ? formatMessage(msg.content) : <p className="text-sm">{msg.content}</p>}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-text-muted" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-muted flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-accent" />
              </div>
              <div className="glass rounded-2xl rounded-bl-md px-4 py-3">
                <Loader2 className="w-4 h-4 text-accent animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="pb-4 sm:pb-6 pt-2">
          <div className="glass rounded-2xl p-2 flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your coding habits..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted px-4 py-3 resize-none focus:outline-none max-h-32"
              style={{ minHeight: '44px' }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="p-3 rounded-xl bg-accent text-white hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
