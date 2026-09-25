"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Plus, Check } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
// import { useOrderContext } from "@/store/useOrderContext";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  suggestionCard?: {
    id: string;
    title: string;
    vendor: string;
    price: number;
    priceFormatted: string;
    image: string;
  };
}

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export default function AIChatModal({ isOpen, onClose, initialQuery = "" }: AIChatModalProps) {
  const [input, setInput] = useState(initialQuery);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Hey! I'm your ChopnChop AI concierge. What are you craving today? I can help you find the best local meals in Lagos!"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Track which items have been added to cart in this session to show a green check state
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Cart store hook
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response & recommendation
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "Based on your craving, I found this freshly batched hot meal ready for today's delivery window! Want me to toss it into your cart?",
        suggestionCard: {
          id: "deal-3",
          title: "Smoky Party Jollof & Turkey",
          vendor: "Taste & See Kitchen",
          price: 4500,
          priceFormatted: "₦4,500",
          image: "/hero-food-illustration.png"
        }
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1200);
  };

  const handleAddToCart = (card: NonNullable<Message["suggestionCard"]>) => {
    // 1. Trigger actual cart addition logic here
    addToCart({
      id: card.id,
      name: card.title,
      desc: `${card.vendor} • Standard`,
      price: card.price,
      image: card.image
    });

    // 2. Mark this specific card item as added to show confirmation state
    setAddedItemIds((prev) => ({ ...prev, [card.id]: true }));

    // 3. Have the AI respond naturally to keep the conversation flowing
    const confirmationMsg: Message = {
      id: Date.now().toString(),
      sender: "ai",
      text: `Added **${card.title}** to your single consolidated cart! Anything else you'd like to add before checkout?`
    };
    setMessages((prev) => [...prev, confirmationMsg]);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg h-[85vh] sm:h-[650px] bg-white dark:bg-zinc-900 rounded-t-[32px] sm:rounded-[32px] shadow-2xl border border-gray-100 dark:border-zinc-800 flex flex-col overflow-hidden">
        
        {/* Chat Header */}
        <div className="px-5 py-4 bg-[#FC6B31] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold">ChopnChop AI Concierge</h3>
              <p className="text-[10px] text-orange-100">Always here to feed your cravings</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message History Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50 dark:bg-zinc-950/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
              <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === "user" 
                  ? "bg-[#FC6B31] text-white rounded-br-none" 
                  : "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm rounded-bl-none border border-gray-100 dark:border-zinc-700"
              }`}>
                {msg.text}
              </div>

              {/* Rich Suggestion Card Inside Chat */}
              {msg.suggestionCard && (
                <div className="mt-2.5 w-full max-w-[280px] bg-white dark:bg-zinc-800 rounded-2xl p-3 border border-orange-100 dark:border-zinc-700 shadow-md space-y-2.5 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-zinc-700 flex items-center justify-center shrink-0 overflow-hidden">
                      <img src={msg.suggestionCard.image} alt="Meal" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">{msg.suggestionCard.title}</h4>
                      <p className="text-[10px] text-gray-400">{msg.suggestionCard.vendor}</p>
                      <span className="text-xs font-black text-[#FC6B31]">{msg.suggestionCard.priceFormatted}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleAddToCart(msg.suggestionCard!)}
                    disabled={addedItemIds[msg.suggestionCard.id]}
                    className={`w-full py-2 rounded-xl text-[11px] font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                      addedItemIds[msg.suggestionCard.id]
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 cursor-default"
                        : "bg-orange-50 dark:bg-zinc-700 hover:bg-[#FC6B31] hover:text-white text-[#FC6B31]"
                    }`}
                  >
                    {addedItemIds[msg.suggestionCard.id] ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Added to Cart!
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Quick Add to Cart
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 p-3 bg-white dark:bg-zinc-800 rounded-2xl rounded-bl-none w-fit shadow-sm border border-gray-100 dark:border-zinc-700">
              <span className="w-2 h-2 bg-[#FC6B31] rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-[#FC6B31] rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 bg-[#FC6B31] rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 flex gap-2 overflow-x-auto no-scrollbar">
          {["Local Swallow", "Fast Lunch", "Party Jollof", "Healthy Salads"].map((pill) => (
            <button
              key={pill}
              onClick={() => handleSendMessage(pill)}
              className="shrink-0 px-3 py-1 bg-orange-50 dark:bg-zinc-800 text-[#FC6B31] dark:text-orange-400 text-[11px] font-bold rounded-full hover:bg-orange-100 transition-colors"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask AI for food recommendations..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
            className="flex-1 py-3 px-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-xs text-gray-900 dark:text-white outline-none focus:border-[#FC6B31]"
          />
          <button
            onClick={() => handleSendMessage(input)}
            className="p-3 rounded-2xl bg-[#FC6B31] text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}