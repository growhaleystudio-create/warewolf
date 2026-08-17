"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/lib/types";
import { MessageSquare, Send, Bot, User, Sparkles, Flame, ShieldAlert } from "lucide-react";
import { audioEngine } from "@/lib/audioEngine";

interface ChatBoxProps {
  messages: ChatMessage[];
  currentUserId: string;
  currentUserName: string;
  onSendMessage: (text: string) => void;
  className?: string;
}

const QUICK_SHOUTS = [
  "Bukan aku serigalanya!",
  "Aku curiga sama yang dari tadi diam!",
  "Peramal, ada petunjuk?",
  "Jangan sampai salah gantung warga!",
];

export function ChatBox({
  messages,
  currentUserId,
  currentUserName,
  onSendMessage,
  className = "",
}: ChatBoxProps) {
  const [inputText, setInputText] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevMsgLengthRef = useRef<number>(0);

  useEffect(() => {
    if (messages.length > prevMsgLengthRef.current) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
      prevMsgLengthRef.current = messages.length;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    audioEngine.playTap();
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleQuickShout = (shout: string) => {
    audioEngine.playTap();
    onSendMessage(shout);
  };

  return (
    <div className={`bg-stone-900/95 border border-stone-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col backdrop-blur-md ${className}`}>
      {/* Header */}
      <div className="p-3.5 px-5 bg-stone-950/90 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-300">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span className="font-serif font-bold text-xs sm:text-sm text-stone-100">
            Balai Musyawarah (Chat Desa & Tuduhan AI)
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/40 font-bold">
          Live AI Debate
        </span>
      </div>

      {/* Messages Stream */}
      <div
        ref={scrollContainerRef}
        className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[180px] max-h-[70vh] lg:max-h-none text-xs"
      >
        {messages.length === 0 ? (
          <div className="text-center py-6 text-stone-500 text-xs italic">
            Belum ada obrolan. Mulai diskusi atau tunggu warga lain bersuara!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            const isSystem = msg.senderId === "system";

            if (isSystem) {
              return (
                <div key={msg.id} className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center text-[11px] text-amber-200">
                  📢 {msg.text}
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"} space-y-1`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-medium">
                  {msg.isBot ? (
                    <span className="inline-flex items-center gap-1 text-indigo-300 font-bold">
                      <Bot className="w-3 h-3" />
                      {msg.senderName}
                    </span>
                  ) : (
                    <span className={`inline-flex items-center gap-1 font-bold ${isMe ? "text-amber-300" : "text-emerald-300"}`}>
                      <User className="w-3 h-3" />
                      {msg.senderName} {isMe && "(Anda)"}
                    </span>
                  )}
                </div>

                <div
                  className={`p-2.5 px-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                    isMe
                      ? "bg-amber-500 text-stone-950 font-medium rounded-tr-none shadow-md"
                      : msg.isBot
                      ? "bg-stone-950/90 border border-indigo-500/30 text-stone-200 rounded-tl-none"
                      : "bg-stone-800 border border-stone-700 text-stone-100 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Reaction Buttons */}
      <div className="px-3 pt-2 pb-1 border-t border-stone-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-stone-500 shrink-0 flex items-center gap-1 font-bold">
          <Flame className="w-3 h-3 text-amber-500" />
          Cepat:
        </span>
        {QUICK_SHOUTS.map((shout, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickShout(shout)}
            className="px-2.5 py-1 rounded-full bg-stone-950/80 hover:bg-stone-800 text-[10px] text-stone-300 border border-stone-800 hover:border-amber-500/40 shrink-0 transition-colors"
          >
            {shout}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="p-3 bg-stone-950/80 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ketik tuduhan atau pembelaan Anda..."
          className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
