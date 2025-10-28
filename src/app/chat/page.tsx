"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Star,
  Home,
  MessageCircle,
  BarChart3,
  LogOut,
  User as UserIcon,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import LanguagePicker from "../../components/LanguagePicker";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";
import { getAllScores } from "../../lib/appwrite";
import { Score } from "../../types";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function ChatPage() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("chat");
      if (stored) {
        const parsedMessages = JSON.parse(stored);
        return parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
    }
    return [
      {
        id: "1",
        text: t("chat.welcomeMessage"),
        sender: "ai",
        timestamp: new Date(),
      },
    ];
  });

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [assessmentScores, setAssessmentScores] = useState<Score[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAllScores().then((scores: Score[]) => {
      setAssessmentScores(scores);
    });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("chat", JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const currentInput = inputText;
    setInputText("");
    setIsTyping(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          scores: assessmentScores,
          history: newMessages.map((m) => ({
            role: m.sender === "user" ? "user" : "bot",
            text: m.text,
          })),
        }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message || "Sorry, I couldn't generate a response.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages([...newMessages, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Fallback to simulated response if API fails
      const aiResponses = [
        t("chat.responses.response1"),
        t("chat.responses.response2"),
        t("chat.responses.response3"),
        t("chat.responses.response4"),
        t("chat.responses.response5"),
      ];

      const randomResponse =
        aiResponses[Math.floor(Math.random() * aiResponses.length)];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages([...newMessages, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleStartNewChat = () => {
    const welcomeMessage: Message = {
      id: "1",
      text: t("chat.welcomeMessage"),
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    setInputText("");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("chat");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-primary-50 flex flex-col pb-20">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-medium text-gray-900">
                  {t("chat.title")}
                </h1>
                <p className="text-sm text-gray-600">{t("chat.subtitle")}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleStartNewChat}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                title="Start New Chat"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">New Chat</span>
              </button>
              <LanguagePicker />
              {user && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <UserIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {user.name || user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 shadow-sm ${
                  message.sender === "user"
                    ? "bg-primary-600 text-white"
                    : "bg-white border border-gray-200 text-gray-900"
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.sender === "ai" && (
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    {message.sender === "ai" ? (
                      <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-900 prose-strong:text-gray-900 prose-ul:text-gray-900 prose-ol:text-gray-900 prose-li:text-gray-900 prose-code:text-gray-900 prose-pre:bg-gray-100 prose-pre:text-gray-900">
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    )}
                    <p
                      className={`text-xs mt-2 ${
                        message.sender === "user"
                          ? "text-primary-100"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                  {message.sender === "user" && (
                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-4 py-4 shadow-lg mb-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t("chat.inputPlaceholder")}
                className="w-full text-black px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none shadow-sm"
                rows={3}
                style={{ minHeight: "48px", maxHeight: "120px" }}
              />
              <div className="absolute right-3 bottom-3">
                <Star className="w-4 h-4 text-primary-500" />
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="px-4 py-3 bg-primary-600 rounded-xl hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
          <div className="flex justify-around">
            <Link href="/" className="flex flex-col items-center gap-1 py-2">
              <Home className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-400">{t("common.home")}</span>
            </Link>
            <Link
              href="/chat"
              className="flex flex-col items-center gap-1 py-2"
            >
              <MessageCircle className="w-6 h-6 text-primary-600" />
              <span className="text-xs text-primary-600 font-medium">
                {t("common.aiChat")}
              </span>
            </Link>
            <Link
              href="/data"
              className="flex flex-col items-center gap-1 py-2"
            >
              <BarChart3 className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-400">
                {t("common.dataView")}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
