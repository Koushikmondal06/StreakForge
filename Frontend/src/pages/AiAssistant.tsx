import React, { useState } from 'react';

const AiAssistant: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        const userMessage = prompt;
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setPrompt('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
        <div className="flex flex-col h-screen bg-gray-50 text-gray-900">
            <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-blue-600">StreakForge AI Assistant</h1>
                <a href="/dashboard" className="text-gray-500 hover:text-blue-600">Back to Dashboard</a>
            </header>

            <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <p className="text-lg">Ask me anything about your GitHub stats or Streaks!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`max-w-2xl p-4 rounded-xl shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-white text-gray-800 self-start border border-gray-100'
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
                    <div className="bg-white text-gray-800 self-start border border-gray-100 max-w-2xl p-4 rounded-xl shadow-sm italic text-sm">
                        Thinking...
                    </div>
                )}
            </main>

            <footer className="bg-white p-4 border-t border-gray-200">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
                    <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type your message..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                        disabled={loading || !prompt.trim()}
                    >
                        Send
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default AiAssistant;
