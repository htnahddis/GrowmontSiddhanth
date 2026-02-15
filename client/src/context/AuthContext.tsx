"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    role: 'ADMIN' | 'EMPLOYEE';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check local storage on load
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('accessToken');
        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch (e) {
                console.error("Failed to parse user from local storage");
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (userData: User, accessToken: string) => {
        setUser(userData);
        setToken(accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('accessToken', accessToken);
        router.push('/dashboard');
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
