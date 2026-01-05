import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // v1.2 force deploy
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/layout/ScrollToTop';

// Code-split all pages using React.lazy() for optimal bundle size
const Home = lazy(() => import('./pages/Home'));
const ArticlePage = lazy(() => import('./pages/Article'));
const CategoryPage = lazy(() => import('./pages/Category'));
const LoginPage = lazy(() => import('./pages/Login'));
const SignupPage = lazy(() => import('./pages/Signup'));
const PrivacyPage = lazy(() => import('./pages/Privacy'));
const TermsPage = lazy(() => import('./pages/Terms'));
const NotFound = lazy(() => import('./pages/NotFound'));
const SavedArticles = lazy(() => import('./pages/SavedArticles'));

// Loading fallback component
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Loading...</p>
        </div>
    </div>
);

function App() {
    return (
        <Router>
            <AuthProvider>
                <ScrollToTop />
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/article/:id" element={<ArticlePage />} />
                        <Route path="/saved" element={<SavedArticles />} />
                        <Route path="/category/:category" element={<CategoryPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </AuthProvider>
        </Router>
    );
}

export default App;
