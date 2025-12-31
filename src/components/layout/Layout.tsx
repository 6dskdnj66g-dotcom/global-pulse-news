import React from 'react';
import Header from './Header';
import Footer from './Footer';
import AIChatBot from '../common/AIChatBot';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <AIChatBot />
            <Footer />
        </div>
    );
};

export default Layout;
