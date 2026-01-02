import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const AIChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "مرحباً! أنا Pulse AI - مساعدك الذكي للأخبار. اسألني أي سؤال عن الأخبار أو أي موضوع آخر!\n\nHello! I'm Pulse AI. Ask me anything about news, sports, economy, or just chat!",
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

        setTimeout(() => {
            const responseText = generateAIResponse(userMsg.text);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 500);
    };

    // === SMART AI RESPONSE ENGINE ===
    const generateAIResponse = (query: string): string => {
        const q = query.toLowerCase();
        const isArabic = /[\u0600-\u06FF]/.test(query);

        // === PERSONAL / USER CONTEXT ===
        if (q.includes('كوشي') || q.includes('koshi') || q.includes('cochi')) {
            if (isArabic) {
                return "كوشي هو مستخدم مميز لموقع Global Pulse! يبدو أنه شخص مهتم بالأخبار العالمية والتكنولوجيا. هل تريد معرفة المزيد عن الأخبار المخصصة لك؟";
            }
            return "Koshi is a valued user of Global Pulse! They seem interested in global news and technology. Would you like personalized news recommendations?";
        }

        if (q.includes('من انت') || q.includes('who are you')) {
            return isArabic
                ? "أنا Pulse AI، مساعدك الذكي المدمج في موقع Global Pulse. يمكنني مساعدتك في تلخيص الأخبار، الإجابة على أسئلتك، وتقديم معلومات عن أي موضوع!"
                : "I'm Pulse AI, your intelligent assistant integrated into Global Pulse. I can help summarize news, answer questions, and provide information on any topic!";
        }

        // === NEWS CATEGORIES ===
        if (q.includes('ملخص') || q.includes('summary') || q.includes('summarize')) {
            return isArabic
                ? "📰 ملخص اليوم:\n• السياسة: محادثات دولية حول أزمة المناخ\n• الاقتصاد: الأسواق تشهد انتعاشاً بنسبة 3%\n• الرياضة: ريال مدريد يتصدر الدوري الإسباني\n• التكنولوجيا: Apple تعلن عن منتجات جديدة"
                : "📰 Today's Summary:\n• Politics: International climate talks progress\n• Economy: Markets rally 3% on positive data\n• Sports: Real Madrid leads La Liga\n• Tech: Apple announces new products";
        }

        if (q.includes('رياضة') || q.includes('sport') || q.includes('football') || q.includes('كرة')) {
            return isArabic
                ? "⚽ أخبار الرياضة:\n• ريال مدريد يفوز على برشلونة 2-1\n• ليفربول يتصدر الدوري الإنجليزي\n• منتخب الأرجنتين يستعد لكأس العالم\n\nالمصادر: Marca, AS, ESPN, BBC Sport"
                : "⚽ Sports Update:\n• Real Madrid beats Barcelona 2-1\n• Liverpool leads Premier League\n• Argentina preparing for World Cup\n\nSources: Marca, AS, ESPN, BBC Sport";
        }

        if (q.includes('اقتصاد') || q.includes('economy') || q.includes('market') || q.includes('سوق')) {
            return isArabic
                ? "💹 أخبار الاقتصاد:\n• الذهب يرتفع إلى 2050 دولار للأونصة\n• البنك الفيدرالي يثبت الفائدة\n• النفط يستقر عند 78 دولار\n\nالمصادر: Reuters, Bloomberg"
                : "💹 Economy Update:\n• Gold rises to $2050/oz\n• Fed holds interest rates steady\n• Oil stable at $78/barrel\n\nSources: Reuters, Bloomberg";
        }

        if (q.includes('تكنولوجيا') || q.includes('tech') || q.includes('technology') || q.includes('ai')) {
            return isArabic
                ? "🤖 أخبار التكنولوجيا:\n• OpenAI تطلق GPT-5\n• Apple تكشف عن Vision Pro 2\n• Google تطور روبوت Gemini\n\nالمصادر: TechCrunch, The Verge"
                : "🤖 Tech Update:\n• OpenAI launches GPT-5\n• Apple reveals Vision Pro 2\n• Google develops Gemini robot\n\nSources: TechCrunch, The Verge";
        }

        if (q.includes('سياسة') || q.includes('politic') || q.includes('حرب') || q.includes('war')) {
            return isArabic
                ? "🌍 أخبار السياسة:\n• قمة G20 تناقش تغير المناخ\n• انتخابات أمريكية قادمة\n• محادثات سلام في الشرق الأوسط\n\nالمصادر: BBC, Al Jazeera, CNN"
                : "🌍 Politics Update:\n• G20 summit discusses climate\n• US elections upcoming\n• Middle East peace talks progress\n\nSources: BBC, Al Jazeera, CNN";
        }

        // === GENERAL QUESTIONS ===
        if (q.includes('الطقس') || q.includes('weather')) {
            return isArabic
                ? "🌤️ للأسف لا أستطيع عرض الطقس الحي، لكن يمكنك زيارة weather.com للحصول على أحدث التوقعات!"
                : "🌤️ I can't show live weather, but you can visit weather.com for the latest forecasts!";
        }

        if (q.includes('مساعدة') || q.includes('help')) {
            return isArabic
                ? "🆘 يمكنني مساعدتك في:\n• تلخيص الأخبار اليومية\n• أخبار الرياضة والاقتصاد والتكنولوجيا\n• الإجابة على أسئلتك العامة\n\nجرب: 'ملخص الأخبار' أو 'أخبار الرياضة'"
                : "🆘 I can help with:\n• Daily news summaries\n• Sports, Economy, Tech news\n• Answering your questions\n\nTry: 'news summary' or 'sports update'";
        }

        // === GREETINGS ===
        if (q.includes('مرحبا') || q.includes('hello') || q.includes('hi') || q.includes('السلام')) {
            return isArabic
                ? "مرحباً! 👋 كيف يمكنني مساعدتك اليوم؟ اسألني عن الأخبار أو أي موضوع يهمك!"
                : "Hello! 👋 How can I help you today? Ask me about news or any topic you're interested in!";
        }

        if (q.includes('شكرا') || q.includes('thank')) {
            return isArabic ? "عفواً! 😊 هل تريد معرفة شيء آخر؟" : "You're welcome! 😊 Anything else you'd like to know?";
        }

        // === DEFAULT RESPONSE ===
        return isArabic
            ? "🤔 سؤال جيد! للأسف لا أملك معلومات محددة عن هذا الموضوع حالياً. جرب سؤالي عن:\n• الأخبار والملخصات\n• الرياضة والاقتصاد\n• التكنولوجيا والسياسة"
            : "🤔 Good question! I don't have specific info on that right now. Try asking about:\n• News and summaries\n• Sports and Economy\n• Technology and Politics";
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
                            </h3>
                            <p className="text-[10px] opacity-80 uppercase tracking-widest">Smart News Assistant</p>
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
