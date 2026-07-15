import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/Sidebar';
import { API_BASE } from '@/services/api';

const AiAssistant: React.FC = () => {
    const { token, isAuthenticated, logout } = useAuth();
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
    const [loading, setLoading] = useState(false);

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
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <Sidebar activeTab="dashboard" onTabChange={() => {}} onLogout={logout} />

            <main className="min-h-screen lg:ml-[240px]">
                <div className="flex flex-col h-screen">
                    <header className="px-6 py-4 border-b border-[var(--color-border)]">
                        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">AI Assistant</h1>
                        <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">Ask me anything about your GitHub stats or Streaks!</p>
                    </header>

                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                        {messages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-[var(--color-text-muted)]">
                                <p className="text-lg">Ask me anything about your GitHub stats or Streaks!</p>
                            </div>
                        ) : (
                            messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`max-w-2xl p-4 rounded-xl ${msg.role === 'user'
                                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white self-end'
                                        : 'bg-[var(--color-bg-card)] text-[var(--color-text-primary)] self-start border border-[var(--color-border)]'
                                    }`}
                                >
                                    <React.Fragment>
                                        {msg.content.split('\n').map((line, i) => (
                                            <span key={i}>
                                                {line}
                                                <br />
                                            </span>
                                        ))}
                                    </React.Fragment>
                                </div>
                            ))
                        )}
                        {loading && (
                            <div className="bg-[var(--color-bg-card)] text-[var(--color-text-muted)] self-start border border-[var(--color-border)] max-w-2xl p-4 rounded-xl italic text-sm">
                                Thinking...
                            </div>
                        )}
                    </div>

                    <footer className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
                            <input
                                type="text"
                                className="flex-1 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-violet-500"
                                placeholder="Type your message..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                                disabled={loading || !prompt.trim()}
                            >
                                Send
                            </button>
                        </form>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default AiAssistant;
