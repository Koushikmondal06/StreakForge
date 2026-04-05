import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const TOKEN_KEY = 'streakforge_token';

export function useAuth() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

    useEffect(() => {
        const urlToken = searchParams.get('token');
        if (urlToken) {
            localStorage.setItem(TOKEN_KEY, urlToken);
            setToken(urlToken);
            // Clean the URL
            navigate('/dashboard', { replace: true });
        }
    }, [searchParams, navigate]);

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
