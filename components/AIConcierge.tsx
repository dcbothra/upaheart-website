import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Loader2, MessageCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from '../constants';

export const AIConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "Welcome to UpaHeart. I am your personal concierge. Are you looking for a gift for a specific occasion, or perhaps something to brighten your own home?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const productContext = PRODUCTS.map(p => `${p.name} ($${p.price}): ${p.description}`).join('\n');
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `You are the UpaHeart Concierge, a sophisticated, warm, and helpful personal shopper for a premium 3D printed gifting brand. 
          Your goal is to help customers find the perfect gift from our collection. 
          Our products: 
          ${productContext}
          
          Keep your tone elegant, concise, and focused on the emotional value of the gifts. 
          If a customer describes an occasion (anniversary, birthday, memorial), recommend 1-2 specific products and explain why they fit.
          Always mention that our "Lithophane" products are fully customizable with their own photos.`,
        },
      });

      const aiText = response.text || "I apologize, I'm having a moment of reflection. How else can I assist you with our collection?";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error("Concierge Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "I'm sorry, I'm unable to connect right now. Please feel free to browse our collection at your leisure." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[100] bg-warm-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest hidden md:inline">Gift Concierge</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-[100] w-[90vw] md:w-[400px] h-[500px] bg-white border border-warm-200 shadow-2xl rounded-sm flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-warm-900 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-display text-xl">UpaHeart Concierge</h3>
                <p className="text-[10px] uppercase tracking-widest opacity-60">AI Assistant</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:opacity-50 transition-opacity">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 text-sm leading-relaxed ${
                    m.role === 'user' 
                    ? 'bg-warm-100 text-warm-900 rounded-bl-xl rounded-t-xl' 
                    : 'bg-warm-50 border border-warm-100 text-gray-700 rounded-br-xl rounded-t-xl'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-warm-50 p-4 rounded-xl flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-warm-900" />
                    <span className="text-xs italic text-gray-400 font-serif">Concierge is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-warm-100 bg-warm-50">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for a recommendation..."
                  className="w-full bg-white border-0 py-3 pl-4 pr-12 text-sm outline-none focus:ring-1 focus:ring-warm-900 rounded-sm font-sans"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 p-2 text-warm-900 hover:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
