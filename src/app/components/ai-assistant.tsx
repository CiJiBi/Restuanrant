"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles } from "lucide-react";

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Xin chào! Mình là CIJIBI AI. Bạn cần tư vấn món ăn hay phân tích dữ liệu hôm nay?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Thêm tin nhắn của user
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    const userText = input;
    setInput("");

    // Giả lập AI trả lời mượt mà sau 1s
    setTimeout(() => {
      let reply = "Xin lỗi, mình chưa hiểu ý bạn.";
      if (
        userText.toLowerCase().includes("calo") ||
        userText.toLowerCase().includes("giảm cân")
      ) {
        reply =
          'Dựa trên thực đơn, mình gợi ý món "Salad cá hồi Na Uy" chỉ có 210 kcal, rất phù hợp cho thực đơn giảm cân của bạn!';
      } else if (userText.toLowerCase().includes("doanh thu")) {
        reply =
          "Doanh thu hôm nay tăng 12.5% so với hôm qua. Kênh đặt tại bàn đang chiếm ưu thế (55%).";
      }

      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9000]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 h-[450px] glass-card rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden bg-slate-900/95"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary to-accent flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-white">
                <Sparkles size={20} />
                <h3 className="font-bold text-sm">Trợ lý CIJIBI AI</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Khung Chat */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.sender === "user"
                        ? "bg-primary text-white rounded-tr-sm"
                        : "bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700/50"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Khung Input */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0">
              <form
                onSubmit={handleSend}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Hỏi AI bất kỳ điều gì..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-full pl-4 pr-12 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 p-1.5 bg-primary hover:bg-secondary rounded-full text-white transition-colors"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nút bật/tắt (Floating Button) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary hover:bg-secondary text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-colors relative"
      >
        <Bot size={28} />
        {/* Đốm chấm online */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full"></span>
      </motion.button>
    </div>
  );
}
