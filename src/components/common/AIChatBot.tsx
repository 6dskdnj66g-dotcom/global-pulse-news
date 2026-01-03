import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { askGeminiAI } from '../../services/geminiService';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const AIChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const { user } = useAuth();
    const { i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: isRtl
                ? `مرحباً${user?.name ? ' ' + user.name : ''}! أنا Pulse AI - مساعدك الذكي للأخبار. كيف يمكنني مساعدتك اليوم؟`
                : `Hello${user?.name ? ' ' + user.name : ''}! I'm Pulse AI. How can I help you today?`,
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Call Gemini AI for intelligent response
        try {
            const responseText = await askGeminiAI(userMsg.text);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: i18n.language === 'ar'
                    ? 'عذراً، حدث خطأ. حاول مرة أخرى.'
                    : 'Sorry, an error occurred. Please try again.',
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        }
    };

    return (
        <>
            {/* FAB */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-40 bg-primary hover:bg-primary-hover text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
            >
                <Bot size={28} />
                <div className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </div>
            </button>

            {/* Chat Window */}
            <div className={`fixed bottom-6 right-6 z-50 w-[350px] md:w-[400px] bg-background border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10 pointer-events-none'}`} style={{ height: '500px' }}>

                {/* Header */}
                <div className="bg-primary text-white p-4 rounded-t-2xl flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Bot size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold flex items-center gap-2">
                                Pulse AI <Sparkles size={14} className="text-yellow-300" />
                                <span className="text-[8px] bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                    BETA
                                </span>
                            </h3>
                            <p className="text-[10px] opacity-80 uppercase tracking-widest">
                                {isRtl ? 'مساعد الأخبار الذكي' : 'Smart News Assistant'}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm text-sm whitespace-pre-line ${msg.sender === 'user'
                                ? 'bg-primary text-white rounded-br-none'
                                : 'bg-white dark:bg-slate-800 border border-black/5 dark:border-white/5 rounded-bl-none'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-black/5 dark:border-white/5 flex gap-1 items-center">
                                <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 border-t border-black/5 dark:border-white/5 bg-background rounded-b-2xl">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="اكتب سؤالك... / Ask anything..."
                            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-3 pl-4 pr-12 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AIChatBot;
