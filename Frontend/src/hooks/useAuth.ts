import { useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const TOKEN_KEY = 'streakforge_token';

function getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

function getInitialToken(searchParams: URLSearchParams): string | null {
    const urlToken = searchParams.get('token');
    if (urlToken) {
        localStorage.setItem(TOKEN_KEY, urlToken);
        window.history.replaceState({}, '', '/dashboard');
        return urlToken;
    }
    return getStoredToken();
}

export function useAuth() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(() => getInitialToken(searchParams));

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        navigate('/');
    }, [navigate]);

    return {
        token,
        isAuthenticated: !!token,
        logout,
    };
}
