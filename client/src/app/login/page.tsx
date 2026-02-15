"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Employee } from '@/types'; // Assuming you have an Employee type, or we can define a local one

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetMessage, setResetMessage] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // 1. Login to get tokens
            const res = await fetch('http://127.0.0.1:8000/api/auth/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }), // proper username field for Django is 'username' usually but we set username=email
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || 'Login failed');
            }

            const { access, refresh } = await res.json();

            // 2. Fetch User Details
            const userRes = await fetch('http://127.0.0.1:8000/api/me/', {
                headers: { 'Authorization': `Bearer ${access}` }
            });

            if (!userRes.ok) throw new Error('Failed to fetch user data');

            const userData = await userRes.json();

            login(userData, access);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgot = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetMessage("");
        setError("");
        setLoading(true);

        try {
            const res = await fetch('http://127.0.0.1:8000/api/auth/password/forgot/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail }),
            });

            const data = await res.json();
            setResetMessage(data.message || "If an account exists, a new password has been sent.");
            setResetEmail("");
        } catch (err: any) {
            setError("Failed to send reset request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F4F9FD]">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#00337C]">GrowMont</h1>
                    <p className="text-gray-500 mt-2">
                        {showForgot ? "Reset your password" : "Sign in to your account"}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}
                {resetMessage && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm text-center">
                        {resetMessage}
                    </div>
                )}

                {showForgot ? (
                    <form onSubmit={handleForgot} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#2D8A4E] hover:bg-[#236b3d]'
                                }`}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => { setShowForgot(false); setResetMessage(""); setError(""); }}
                                className="text-sm text-[#00337C] hover:underline"
                            >
                                Back to Sign In
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => { setShowForgot(true); setError(""); }}
                                className="text-sm text-[#00337C] hover:underline"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#2D8A4E] hover:bg-[#236b3d]'
                                }`}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
