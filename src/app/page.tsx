"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Lightbulb,
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
  const [expandedTips, setExpandedTips] = useState<number[]>([]);

  const toggleTip = (index: number) => {
    setExpandedTips((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const tips = [
    {
      title: "Building Self-Awareness in Children",
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      content:
        "Help children recognize their emotions, strengths, and areas for growth. Use daily check-ins, emotion charts, and reflection activities. Encourage them to identify what makes them happy, sad, or frustrated, and validate their feelings.",
      color: "bg-yellow-50 border-yellow-200",
    },
    {
      title: "Developing Self-Management Skills",
      icon: <Users className="w-5 h-5 text-blue-500" />,
      content:
        "Teach children to regulate their emotions and behaviors. Practice deep breathing exercises, use calm-down corners, and create routines. Help them set goals and celebrate small achievements. Model patience and self-control.",
      color: "bg-blue-50 border-blue-200",
    },
    {
      title: "Enhancing Social Awareness",
      icon: <BookOpen className="w-5 h-5 text-green-500" />,
      content:
        "Help children understand others' perspectives and emotions. Read books about different cultures, discuss how characters feel, and practice active listening. Encourage them to notice when someone needs help or comfort.",
      color: "bg-green-50 border-green-200",
    },
    {
      title: "Strengthening Relationship Skills",
      icon: <TrendingUp className="w-5 h-5 text-purple-500" />,
      content:
        "Teach children to communicate effectively, cooperate, and resolve conflicts. Use role-playing games, group activities, and teach 'I feel' statements. Help them practice sharing, taking turns, and being a good friend.",
      color: "bg-purple-50 border-purple-200",
    },
    {
      title: "Fostering Responsible Decision-Making",
      icon: <Lightbulb className="w-5 h-5 text-orange-500" />,
      content:
        "Guide children to make thoughtful choices by considering consequences. Ask 'What could happen if...?' questions, discuss real-life scenarios, and help them think through problems step by step. Praise good decisions.",
      color: "bg-orange-50 border-orange-200",
    },
    {
      title: "Building Empathy and Kindness",
      icon: <Star className="w-5 h-5 text-pink-500" />,
      content:
        "Encourage children to understand and care about others' feelings. Read stories about helping others, practice acts of kindness, and discuss how their actions affect others. Model empathy in your daily interactions.",
      color: "bg-pink-50 border-pink-200",
    },
    {
      title: "Developing Critical Thinking",
      icon: <Users className="w-5 h-5 text-indigo-500" />,
      content:
        "Help children think creatively and solve problems. Ask open-ended questions, encourage curiosity, and let them explore different solutions. Provide opportunities for hands-on learning and experimentation.",
      color: "bg-indigo-50 border-indigo-200",
    },
    {
      title: "Supporting Metacognition",
      icon: <BookOpen className="w-5 h-5 text-teal-500" />,
      content:
        "Teach children to think about their thinking and learning process. Help them reflect on what they learned, what strategies worked, and what they can improve. Use learning journals and self-assessment tools.",
      color: "bg-teal-50 border-teal-200",
    },
  ];

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
          <h1 className="text-3xl font-bold text-primary-700 mb-4">
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
              className={`${tip.color} border rounded-xl p-4 shadow-sm transition-all duration-200 hover:shadow-md`}
            >
              <button
                onClick={() => toggleTip(index)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  {tip.icon}
                  <h3 className="font-semibold text-primary-700 text-lg">
                    {tip.title}
                  </h3>
                </div>
                {expandedTips.includes(index) ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {expandedTips.includes(index) && (
                <div className="mt-4 pl-8">
                  <p className="text-gray-700 leading-relaxed">{tip.content}</p>
                </div>
              )}
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
