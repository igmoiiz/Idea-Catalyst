import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { authService } from '../services/auth.service';

interface SignInProps {
    onNavigate: (view: string) => void;
    onLoginSuccess?: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onNavigate, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login(email, password);
            if (onLoginSuccess) {
                onLoginSuccess();
            } else {
                onNavigate('home');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="relative w-full max-w-md">

                {/* Background Blobs */}
                <div className="absolute -top-10 -left-12 w-40 h-40 rounded-full bg-[#6D9773]/40 blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-[#FFBA00]/40 blur-3xl pointer-events-none"></div>

                {/* Glass Card */}
                <div className="relative rounded-2xl border border-white/20 bg-[#0f172a]/70 backdrop-blur-xl p-8 shadow-2xl">

                    {/* NEW STYLED BACK BUTTON (Top Left) */}
                    <button
                        onClick={() => onNavigate('home')}
                        className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-full bg-[#0f172a]/40 border border-white/10 text-white/70 hover:text-[#FFBA00] hover:border-[#FFBA00] hover:bg-[#0f172a]/60 transition-all duration-300 shadow-lg group"
                        title="Go Back"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>

                    {/* Header */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#FFBA00] flex items-center justify-center text-[#0C3B2E] text-xs font-bold">IC</div>
                        <span className="text-white font-semibold text-sm">Idea Catalyst</span>
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-[1.75rem] font-semibold mb-1 text-[#FFBA00]">Welcome Back</h2>
                        <p className="text-sm text-white/80">Sign in to continue your startup journey.</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-white/80 ml-1">Email</label>
                            <div className="flex items-center gap-2 rounded-xl bg-[#0f172a]/60 border border-white/10 px-3 py-2 focus-within:border-[#FFBA00] focus-within:ring-1 focus-within:ring-[#FFBA00] transition-all">
                                <span className="text-white/60 text-sm">✉️</span>
                                <input
                                    type="email"
                                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/40"
                                    placeholder="enter your email..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-white/80 ml-1">Password</label>
                            <div className="flex items-center gap-2 rounded-xl bg-[#0f172a]/60 border border-white/10 px-3 py-2 focus-within:border-[#FFBA00] focus-within:ring-1 focus-within:ring-[#FFBA00] transition-all">
                                <span className="text-white/60 text-sm">🔒</span>
                                <input
                                    type="password"
                                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/40"
                                    placeholder="•••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 text-sm text-white/80">
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-3.5 h-3.5 rounded border border-white/20 bg-[#0f172a]/60 accent-[#FFBA00]" />
                                <span>Remember me</span>
                            </label>
                            <button type="button" className="text-[11px] text-sky-300 hover:text-sky-200 underline-offset-2 hover:underline">Forgot Password?</button>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full mt-2 rounded-xl py-2.5 text-sm font-semibold shadow-lg shadow-black/40 hover:scale-[1.01] active:scale-100 transition-transform bg-gradient-to-br from-[#FFBA00] to-[#BB8A52] text-[#0C3B2E] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing In...' : 'Sign In →'}
                        </button>

                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 h-px bg-white/10"></div>
                            <span className="text-[11px] text-white/70">or continue with</span>
                            <div className="flex-1 h-px bg-white/10"></div>
                        </div>

                        <div className="flex gap-3 mt-1">
                            <button type="button" className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f172a]/70 border border-white/15 px-3 py-2 text-[11px] text-white font-medium hover:bg-[#0f172a] transition-colors">
                                <span></span> Google
                            </button>
                            <button type="button" className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f172a]/70 border border-white/15 px-3 py-2 text-[11px] text-white font-medium hover:bg-[#0f172a] transition-colors">
                                <span></span> GitHub
                            </button>
                        </div>
                    </form>

                    <p className="text-sm text-white/80 mt-6 text-center">
                        Don't have an account? <span onClick={() => onNavigate('signup')} className="text-sky-300 font-medium hover:text-sky-200 underline-offset-2 hover:underline cursor-pointer">Sign Up</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;