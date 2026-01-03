import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // v1.2 force deploy
import Home from './pages/Home';
import ArticlePage from './pages/Article';
import CategoryPage from './pages/Category';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import PrivacyPage from './pages/Privacy';
import TermsPage from './pages/Terms';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/layout/ScrollToTop';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <Router>
            <AuthProvider>
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/article/:id" element={<ArticlePage />} />
                    <Route path="/category/:category" element={<CategoryPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
