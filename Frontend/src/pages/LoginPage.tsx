import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Flame, ArrowLeft, Shield, Zap, BarChart3 } from 'lucide-react'

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}
import { API_BASE, getAnalytics } from '@/services/api'

function getStoredToken() {
  return localStorage.getItem('streakforge_token')
}

const benefits = [
  { icon: BarChart3, text: 'Visual commit analytics' },
  { icon: Zap, text: 'AI-powered insights' },
  { icon: Shield, text: 'Secure OAuth login' },
]

export default function LoginPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = getStoredToken()
    if (token) {
      getAnalytics(token)
        .then(() => navigate('/dashboard'))
        .catch(() => localStorage.removeItem('streakforge_token'))
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-streak/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="glass rounded-2xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-streak to-accent flex items-center justify-center mx-auto mb-4">
              <Flame className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Welcome back</h1>
            <p className="text-sm text-text-secondary">
              Sign in to view your coding analytics
            </p>
          </div>

          <a
            href={`${API_BASE}/auth/github`}
            className="flex items-center justify-center gap-3 w-full px-6 py-3.5 rounded-xl bg-[#24292e] hover:bg-[#2f363d] text-white font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#24292e]/25"
          >
            <GithubIcon className="w-5 h-5" />
            Continue with GitHub
          </a>

          <div className="mt-8 space-y-3">
            {benefits.map((b) => {
              const Icon = b.icon
              return (
                <div key={b.text} className="flex items-center gap-3 text-sm text-text-muted">
                  <Icon className="w-4 h-4 text-accent" />
                  {b.text}
                </div>
              )
            })}
          </div>
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          By signing in, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  )
}
