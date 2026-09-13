import React, { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import FarmerSidebar from '../../components/necessary/FarmerSidebar';

const FarmerChat = () => {
    const { backendURL } = useContext(AuthContext);
    const [language, setLanguage] = useState('Hindi');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'नमस्ते! मैं ऑप्टिमंडी किसान सहायक हूँ। आप अपनी फसल, मौसम या मंडी के बारे में क्या जानना चाहते हैं?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await axios.post(`${backendURL}/api/ai/farmer-chat`, {
                question: userMsg,
                language
            });

            if (data.success) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'माफ़ करें, एक त्रुटि हुई। कृपया फिर से प्रयास करें।' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-[#031700] min-h-screen text-white font-sans">
            <FarmerSidebar />
            
            <main className="flex-1 p-4 md:p-8 md:ml-64 flex flex-col h-screen">
                <header className="mb-6 mt-4 md:mt-0 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">Kisan Sahayak AI</h1>
                        <p className="text-gray-400 text-sm">Ask any farming questions in your language</p>
                    </div>
                    
                    <div className="bg-[#112B24] border border-green-900/50 rounded-lg p-1">
                        <select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-transparent text-sm text-green-400 font-bold px-2 py-1 outline-none cursor-pointer"
                        >
                            <option value="Hindi">हिंदी (Hindi)</option>
                            <option value="Marathi">मराठी (Marathi)</option>
                            <option value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
                            <option value="English">English</option>
                        </select>
                    </div>
                </header>

                <div className="flex-1 bg-[#112B24] rounded-2xl border border-green-900/30 flex flex-col overflow-hidden shadow-2xl">
                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-md ${
                                    msg.role === 'user' 
                                    ? 'bg-green-600 text-white rounded-br-none' 
                                    : 'bg-[#0a1f1a] border border-green-900/30 text-gray-200 rounded-bl-none'
                                }`}>
                                    <div className="flex items-start gap-3">
                                        {msg.role === 'assistant' && (
                                            <div className="w-8 h-8 rounded-full bg-green-900/50 flex-shrink-0 flex items-center justify-center border border-green-500/30 mt-1">
                                                <i className="fa-solid fa-robot text-green-400 text-sm"></i>
                                            </div>
                                        )}
                                        <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-[#0a1f1a] border border-green-900/30 text-gray-400 rounded-2xl rounded-bl-none p-4 shadow-md flex items-center gap-2 w-24 h-12">
                                    <span className="animate-bounce text-green-500">●</span>
                                    <span className="animate-bounce text-green-500" style={{ animationDelay: '0.2s' }}>●</span>
                                    <span className="animate-bounce text-green-500" style={{ animationDelay: '0.4s' }}>●</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 bg-[#0a1f1a] border-t border-green-900/30">
                        <div className="relative flex items-center">
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="अपनी फसल या मंडी के बारे में कोई भी प्रश्न पूछें..."
                                className="flex-1 bg-[#112B24] text-white text-base rounded-xl pl-4 pr-14 py-4 border border-green-900/50 focus:outline-none focus:border-green-500 transition-colors shadow-inner"
                            />
                            <button 
                                type="submit" 
                                disabled={loading || !input.trim()}
                                className="absolute right-2 bg-green-600 hover:bg-green-500 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <i className="fa-solid fa-paper-plane"></i>
                            </button>
                        </div>
                        <p className="text-center text-xs text-gray-500 mt-2">
                            AI can make mistakes. Please verify important agricultural decisions.
                        </p>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default FarmerChat;
