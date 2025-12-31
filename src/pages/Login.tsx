import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import { Lock, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        if (email && password) {
            // Extract name from email for demo
            const name = email.split('@')[0];
            login(email, name);
            navigate('/');
        }
    };

    return (
        <Layout>
            <SEO title={t('auth.signin_title')} />
            <div className={`min-h-[60vh] flex items-center justify-center bg-background py-12 px-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="max-w-md w-full space-y-8 bg-paper dark:bg-slate-900 p-8 rounded-xl shadow-lg border border-black/10 dark:border-white/10">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-serif font-bold text-foreground">{t('auth.signin_title')}</h2>
                        <p className="mt-2 text-sm text-muted">
                            {t('auth.no_account', {
                                link: (
                                    <Link to="/signup" className="font-medium text-primary-accent hover:underline">
                                        {t('auth.create_account')}
                                    </Link>
                                )
                            })}
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div className="relative mb-4">
                                <Mail className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-muted`} size={20} />
                                <input
                                    type="email"
                                    required
                                    className={`appearance-none rounded-none relative block w-full ${isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-3 border border-gray-300 placeholder-gray-500 text-foreground bg-background focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                                    placeholder={t('auth.email_placeholder')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <Lock className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-muted`} size={20} />
                                <input
                                    type="password"
                                    required
                                    className={`appearance-none rounded-none relative block w-full ${isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-3 border border-gray-300 placeholder-gray-500 text-foreground bg-background focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                                    placeholder={t('auth.password_placeholder')}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors"
                            >
                                {t('auth.submit_signin')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default LoginPage;
