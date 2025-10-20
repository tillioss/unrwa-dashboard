"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogIn, Loader2 } from "lucide-react";
import LanguagePicker from "@/components/LanguagePicker";

export default function LoginPage() {
  const { login, loading, isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleGoogleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      {/* Language Picker */}
      <div className={`absolute top-4 ${isRTL ? "right-4" : "left-4"}`}>
        <LanguagePicker />
      </div>

      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo/logo.png"
              alt="Tilli Assessment Logo"
              width={80}
              height={40}
              priority
              className="h-12 w-auto object-contain"
            />
          </div>
          <h1 className="text-3xl font-semibold text-primary-700 mb-2">
            {t("auth.welcome")}
          </h1>
          <p className="text-gray-600">{t("auth.signInDescription")}</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {t("auth.signIn")}
            </h2>
            <p className="text-gray-600">{t("auth.useGoogleAccount")}</p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border-2 border-gray-300 rounded-lg px-6 py-3 flex items-center justify-center gap-3 text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            {loading ? t("auth.signingIn") : t("auth.signInWithGoogle")}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">{t("auth.secureLogin")}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">{t("auth.needHelp")}</p>
        </div>
      </div>
    </div>
  );
}
