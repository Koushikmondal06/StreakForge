import { Link } from 'react-router-dom'
import { Flame, ArrowRight, GitCommit, BarChart3, Sparkles, Shield, Zap, Globe } from 'lucide-react'

const features = [
  {
    icon: GitCommit,
    title: 'Track Every Commit',
    description: 'Monitor your daily coding activity across all repositories with real-time GitHub integration.',
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    description: 'Beautiful charts and insights that reveal your coding patterns, peak hours, and productivity trends.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Insights',
    description: 'Get personalized recommendations and behavioral analysis powered by Google Gemini AI.',
  },
  {
    icon: Shield,
    title: 'Secure by Default',
    description: 'OAuth authentication means we never see your password. Your data stays private and encrypted.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Smart caching ensures instant load times. Your analytics are always ready when you are.',
  },
  {
    icon: Globe,
    title: 'Works Everywhere',
    description: 'Fully responsive design that looks great on desktop, tablet, and mobile devices.',
  },
]

const stats = [
  { value: '10K+', label: 'Developers' },
  { value: '2M+', label: 'Commits Tracked' },
  { value: '99.9%', label: 'Uptime' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border-default">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-streak to-accent flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-text-primary">StreakForge</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-all"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-streak/15 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-text-secondary mb-6">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Built for developers who ship
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
            Forge your{' '}
            <span className="gradient-text-streak">coding streak</span>
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Track your GitHub activity, visualize your commit patterns, and get AI-powered insights
            to become a more consistent developer.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-accent to-purple-500 text-white font-semibold hover:shadow-lg hover:shadow-accent/25 transition-all duration-300 text-base"
            >
              Start Tracking
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl glass text-text-secondary font-medium hover:text-text-primary transition-all text-base"
            >
              Learn More
            </a>
          </div>

          <div className="flex items-center justify-center gap-8 sm:gap-12 mt-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</p>
                <p className="text-xs sm:text-sm text-text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 sm:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Everything you need to{' '}
              <span className="gradient-text">build better habits</span>
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              StreakForge combines beautiful analytics with AI intelligence to help you stay consistent and improve your development workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className={`glass rounded-2xl p-6 hover:bg-bg-card-hover transition-all duration-300 animate-fade-in opacity-0 stagger-${Math.min(i + 1, 4)}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-accent-muted flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-base font-semibold text-text-primary mb-2">{feature.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-streak/10" />
            <div className="relative">
              <Flame className="w-12 h-12 text-streak mx-auto mb-4 animate-float" />
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
                Ready to start your streak?
              </h2>
              <p className="text-text-secondary mb-8 max-w-lg mx-auto">
                Join thousands of developers who are building better coding habits with StreakForge.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-streak to-orange-400 text-white font-semibold hover:shadow-lg hover:shadow-streak/25 transition-all duration-300"
              >
                Sign in with GitHub
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border-default py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-streak" />
            <span className="text-sm font-semibold text-text-primary">StreakForge</span>
          </div>
          <p className="text-xs text-text-muted">
            Built with passion for developers who never miss a day.
          </p>
        </div>
      </footer>
    </div>
  )
}
