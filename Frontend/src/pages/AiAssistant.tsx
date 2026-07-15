import React, { useState, useRef, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { API_BASE } from '@/services/api';
import { Send, Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';

const AiAssistant: React.FC = () => {
    const { token, isAuthenticated } = useAuth();
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || !token) return;

        const userMessage = prompt;
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setPrompt('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/ai`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ prompt: userMessage }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch AI response');
            }

            const data = await response.json();
            setMessages((prev) => [...prev, { role: 'ai', content: data.response }]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-[var(--color-bg-primary)]">
            <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3.5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-accent-subtle)]">
                            <Bot className="h-4 w-4 text-[var(--color-accent-hover)]" />
                        </div>
                        <div>
                            <h1 className="text-sm font-semibold text-[var(--color-text-primary)]">AI Assistant</h1>
                            <p className="text-[11px] text-[var(--color-text-muted)]">Ask about your coding habits</p>
                        </div>
                    </div>
                    <a
                        href="/dashboard"
                        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-[12px] font-medium text-[var(--color-text-muted)] transition-all duration-200 hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-secondary)]"
                    >
                        Dashboard
                    </a>
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
                    {messages.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] mb-4">
                                <Bot className="h-6 w-6 text-[var(--color-text-muted)]" />
                            </div>
                            <p className="text-sm font-medium text-[var(--color-text-secondary)]">Ask me anything</p>
                            <p className="mt-1 text-xs text-[var(--color-text-muted)]">About your GitHub stats, streaks, or coding habits</p>
                        </div>
                    ) : (
                        <div className="mx-auto max-w-2xl space-y-3">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.role === 'ai' && (
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-subtle)] mt-0.5">
                                            <Bot className="h-3.5 w-3.5 text-[var(--color-accent-hover)]" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${msg.role === 'user'
                                            ? 'bg-[var(--color-accent)] text-white rounded-br-md'
                                            : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-bl-md'
                                        }`}
                                    >
                                        {msg.content.split('\n').map((line, i) => (
                                            <span key={i}>
                                                {line}
                                                {i < msg.content.split('\n').length - 1 && <br />}
                                            </span>
                                        ))}
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] mt-0.5">
                                            <User className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3"
                                >
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-subtle)]">
                                        <Bot className="h-3.5 w-3.5 text-[var(--color-accent-hover)]" />
                                    </div>
                                    <div className="rounded-2xl rounded-bl-md bg-[var(--color-bg-card)] border border-[var(--color-border)] px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-text-muted)] animate-pulse" />
                                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-text-muted)] animate-pulse [animation-delay:0.2s]" />
                                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-text-muted)] animate-pulse [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>

                <div className="border-t border-[var(--color-border)] p-4">
                    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl flex gap-2">
                        <input
                            type="text"
                            className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-2.5 text-[13px] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/20"
                            placeholder="Ask about your coding habits..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="flex items-center justify-center rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-white transition-all duration-200 hover:bg-[var(--color-accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
                            disabled={loading || !prompt.trim()}
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AiAssistant;
