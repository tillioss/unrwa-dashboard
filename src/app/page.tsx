"use client";

import Image from "next/image";
import {
  Star,
  BookOpen,
  Users,
  TrendingUp,
  Home,
  MessageCircle,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const allTips = [
    {
      title: "Name it to tame it",
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      content:
        "Studies show that when kids label their emotions, their stress levels drop and they calm down faster. Trying this can help with classroom behavior.",
      color: "bg-white border-yellow-200",
    },
    {
      title: "Keep routines predictable",
      icon: <Users className="w-5 h-5 text-blue-500" />,
      content:
        "Research suggests that consistent rituals, like morning greetings or end-of-day reflections, create safety and support SEL growth.",
      color: "bg-white border-blue-200",
    },
    {
      title: "Grow their feeling words",
      icon: <BookOpen className="w-5 h-5 text-green-500" />,
      content:
        "Studies show that teaching one new emotion word at a time (like 'proud' or 'frustrated') improves children's self-control and communication.",
      color: "bg-white border-green-200",
    },
    {
      title: "Check in one-to-one",
      icon: <TrendingUp className="w-5 h-5 text-purple-500" />,
      content:
        "Research has found that short, personal check-ins build trust and make children feel seen. Even 2 minutes can matter.",
      color: "bg-white border-purple-200",
    },
  ];

  // Select one random tip
  const randomIndex = Math.floor(Math.random() * allTips.length);
  const tips = [allTips[randomIndex]];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <header className="w-full bg-[#82A4DE] shadow-sm border-b flex items-center px-4 py-3 sm:px-6">
          <Image
            src="/images/logo/logo.png"
            alt="Tilli Assessment Logo"
            width={40}
            height={20}
            priority
            className="h-8 w-auto object-contain"
          />
          <span className="ml-3 text-white font-semibold text-xl">
            Tilli Assessment Dashboard
          </span>
        </header>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-primary-700 mb-4">
            SEL Skills Development Tips
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Practical strategies to help children develop essential social and
            emotional learning skills
          </p>
        </div>

        {/* Tips Section */}
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <div
              key={index}
              className={`${tip.color} border rounded-xl p-6 shadow-sm transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">{tip.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary-700 text-xl mb-3">
                    {tip.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {tip.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="flex justify-around">
          <Link href="/" className="flex flex-col items-center gap-1 py-2">
            <Home className="w-6 h-6 text-primary-600" />
            <span className="text-xs text-primary-600 font-medium">Home</span>
          </Link>
          <Link href="/chat" className="flex flex-col items-center gap-1 py-2">
            <MessageCircle className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">AI Chat</span>
          </Link>
          <Link href="/data" className="flex flex-col items-center gap-1 py-2">
            <BarChart3 className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Data View</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
