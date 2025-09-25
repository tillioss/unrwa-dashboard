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
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import LanguagePicker from "../components/LanguagePicker";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const allTips = [
    {
      title: t("tips.nameItToTameIt.title"),
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      content: t("tips.nameItToTameIt.content"),
      color: "bg-white border-yellow-200",
    },
    {
      title: t("tips.keepRoutinesPredictable.title"),
      icon: <Users className="w-5 h-5 text-blue-500" />,
      content: t("tips.keepRoutinesPredictable.content"),
      color: "bg-white border-blue-200",
    },
    {
      title: t("tips.growTheirFeelingWords.title"),
      icon: <BookOpen className="w-5 h-5 text-green-500" />,
      content: t("tips.growTheirFeelingWords.content"),
      color: "bg-white border-green-200",
    },
    {
      title: t("tips.checkInOneToOne.title"),
      icon: <TrendingUp className="w-5 h-5 text-purple-500" />,
      content: t("tips.checkInOneToOne.content"),
      color: "bg-white border-purple-200",
    },
  ];

  // Select one random tip
  const randomIndex = Math.floor(Math.random() * allTips.length);
  const tips = [allTips[randomIndex]];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <header className="w-full bg-[#82A4DE] shadow-sm border-b flex items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center">
              <Image
                src="/images/logo/logo.png"
                alt="Tilli Assessment Logo"
                width={40}
                height={20}
                priority
                className="h-8 w-auto object-contain"
              />
              <span className="ml-3 text-white font-semibold text-xl">
                {t("dashboard.title")}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <LanguagePicker />
              {user && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-white">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {user.name || user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </header>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-primary-700 mb-4">
              {t("dashboard.mainHeading")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("dashboard.mainDescription")}
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
              <span className="text-xs text-primary-600 font-medium">
                {t("common.home")}
              </span>
            </Link>
            <Link
              href="/chat"
              className="flex flex-col items-center gap-1 py-2"
            >
              <MessageCircle className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-400">
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
