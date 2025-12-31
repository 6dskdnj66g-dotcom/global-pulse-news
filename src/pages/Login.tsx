import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import { Lock, Mail, Apple } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            setLoading(true);
            // Simulate API call
            setTimeout(() => {
                const name = email.split('@')[0];
                login(email, name);
                navigate('/');
            }, 500);
        }
    };

    const handleGoogleLogin = () => {
        // TODO: Integrate with Firebase Google Auth
        alert(isRtl ? 'تسجيل الدخول بجوجل قريباً!' : 'Google Sign-In coming soon!');
    };

    const handleAppleLogin = () => {
        // TODO: Integrate with Firebase Apple Auth
        alert(isRtl ? 'تسجيل الدخول بأبل قريباً!' : 'Apple Sign-In coming soon!');
    };

    return (
        <Layout>
            <SEO title={t('auth.signin_title')} />
            <div className={`min-h-[70vh] flex items-center justify-center bg-background py-12 px-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="max-w-md w-full space-y-8 bg-paper dark:bg-slate-900 p-8 rounded-2xl shadow-2xl border border-black/10 dark:border-white/10">

                    {/* Header */}
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <Lock className="text-primary" size={32} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-foreground">{t('auth.signin_title')}</h2>
                        <p className="mt-2 text-sm text-muted">
                            {isRtl ? 'أهلاً بعودتك! سجل الدخول للمتابعة' : 'Welcome back! Sign in to continue'}
                        </p>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 font-medium"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span>{isRtl ? 'تسجيل الدخول بـ Google' : 'Continue with Google'}</span>
                        </button>

                        <button
                            onClick={handleAppleLogin}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-black text-white rounded-xl hover:bg-gray-900 transition-all duration-300 font-medium"
                        >
                            <Apple size={20} />
                            <span>{isRtl ? 'تسجيل الدخول بـ Apple' : 'Continue with Apple'}</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-paper dark:bg-slate-900 text-muted">
                                {isRtl ? 'أو' : 'or'}
                            </span>
                        </div>
                    </div>

                    {/* Email Form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="relative">
                            <Mail className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-3.5 text-muted`} size={18} />
                            <input
                                type="email"
                                required
                                className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                                placeholder={isRtl ? 'البريد الإلكتروني' : 'Email address'}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Lock className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-3.5 text-muted`} size={18} />
                            <input
                                type="password"
                                required
                                className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                                placeholder={isRtl ? 'كلمة المرور' : 'Password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                isRtl ? 'تسجيل الدخول' : 'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm text-muted">
                        {isRtl ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
                        <Link to="/signup" className="font-bold text-primary hover:underline">
                            {isRtl ? 'إنشاء حساب' : 'Sign Up'}
                        </Link>
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default LoginPage;
