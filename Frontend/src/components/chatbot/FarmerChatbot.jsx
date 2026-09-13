import React, { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const FarmerChatbot = () => {
    const { backendURL } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [language, setLanguage] = useState('Hindi');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'नमस्ते! मैं आपकी कृषि सहायता के लिए हूँ। आप क्या पूछना चाहते हैं?' }
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
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chatbot Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="bg-green-600 hover:bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {/* Chatbot Window */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-[#0a1f1a] border border-green-900/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden h-[500px]">
                    <div className="bg-[#112B24] p-4 border-b border-green-900/50 flex justify-between items-center">
                        <div>
                            <h3 className="text-white font-bold">Kisan Sahayak (AI)</h3>
                            <p className="text-xs text-green-400">Ask any farming questions</p>
                        </div>
                        <select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-[#0a1f1a] text-xs text-white border border-green-900/50 rounded p-1"
                        >
                            <option value="Hindi">हिंदी</option>
                            <option value="Marathi">मराठी</option>
                            <option value="Punjabi">ਪੰਜਾਬੀ</option>
                            <option value="English">English</option>
                        </select>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-xl p-3 text-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-green-600 text-white rounded-br-none' 
                                    : 'bg-[#1f3a33] text-gray-200 rounded-bl-none'
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-[#1f3a33] text-gray-400 rounded-xl rounded-bl-none p-3 text-xs flex gap-1">
                                    <span className="animate-bounce">●</span>
                                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
                                    <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="p-3 bg-[#112B24] border-t border-green-900/50 flex gap-2">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-[#0a1f1a] text-white text-sm rounded-lg px-3 py-2 border border-green-900/30 focus:outline-none focus:border-green-500"
                        />
                        <button 
                            type="submit" 
                            disabled={loading || !input.trim()}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default FarmerChatbot;
