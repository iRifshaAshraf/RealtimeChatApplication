"use client";

import React, { useState, useEffect, useRef } from "react";
import { BiSolidSend } from "react-icons/bi";

// --- Type Definitions ---
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ApiResponse {
  reply: string;
  error?: string;
}

// --- Constants backend URL ---
// ! using exclamatory symbol becasue in typescript - '!' means it has to be here (like it's important)
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

// --- API Helper ---
const fetchChatResponse = async (payload: object): Promise<ApiResponse> => {
  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `Backend error (${res.status}): ${errorData.error || res.statusText}`
    );
  }

  return (await res.json()) as ApiResponse;
};

// --- Avatar (Bot and User - using R as a User cause fo my first letter :D) ---
const Avatar = ({ role }: { role: "user" | "assistant" }) => {
  if (role === "user") {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0">
        R
      </div>
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0">
      A
    </div>
  );
};

// --- Chat UI Component ---
export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey! How can I help you today?",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  //smooth auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // to kkeep focus on input..
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading, messages]);

  const sendMessage = async () => {
    const userMessageContent = input.trim();
    if (!userMessageContent || isLoading) return;

    const userMsg: Message = { role: "user", content: userMessageContent };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const chatHistory = updatedMessages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      const payload = { contents: chatHistory };
      const data = await fetchChatResponse(payload);

      const modelResponseText =
        data.reply || "Sorry, I couldn't get a response. Please try again.";

      const botMsg: Message = {
        role: "assistant",
        content: modelResponseText,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Connection error occurred.";
      console.error("Backend Error:", err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I'm having trouble connecting right now. ${errorMessage}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-3xl h-[90vh] flex flex-col rounded-2xl shadow-2xl bg-white overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br bg-purple-400 to-indigo-400 flex items-center justify-center text-white font-bold shadow-lg">
              A
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">Assistant</h1>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
        </div>

        {/* COnversation screen */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 custom-scrollbar">
          <style>{`
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { 
              background-color: #cbd5e1; 
              border-radius: 10px; 
            }
            .custom-scrollbar::-webkit-scrollbar-track { 
              background-color: transparent; 
            }
          `}</style>

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Avatar role={msg.role} />

              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-blue-500 to-blue-300 text-white rounded-tr-sm"
                    : "bg-white text-gray-800 rounded-tl-sm border border-gray-100"
                }`}
              >
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                  {msg.content}
                </p>
                <span
                  className={`text-[11px] mt-1 block ${
                    msg.role === "user" ? "text-blue-100" : "text-gray-400"
                  }`}
                >
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}

          {/* message loader for the better UX */}
          {isLoading && (
            <div className="flex gap-3 flex-row">
              <Avatar role="assistant" />
              <div className="bg-white text-gray-500 px-4 py-3 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm">
                <div className="flex space-x-1.5">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message box or input area where user type its message */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex items-end gap-3">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className="flex-1 h-12 rounded-3xl border border-gray-300 bg-gray-50 px-5 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400 transition-all"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="h-12 w-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <BiSolidSend className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
