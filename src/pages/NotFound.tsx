import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SEO from '../components/common/SEO';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
    return (
        <Layout>
            <SEO title="Page Not Found | 404" />
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <div className="text-center space-y-6 max-w-lg">
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-12 h-12 text-red-500" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif font-black text-foreground">
                        404 - Page Not Found
                    </h1>

                    <p className="text-muted text-lg">
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>

                    <div className="pt-4">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                        >
                            <Home size={20} />
                            Go Back Home
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default NotFound;
