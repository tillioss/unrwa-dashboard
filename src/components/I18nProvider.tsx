"use client";

import { I18nextProvider } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "../lib/i18n";

interface I18nProviderProps {
  children: React.ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for i18n to be ready
    if (i18n.isInitialized) {
      setIsReady(true);
    } else {
      i18n.on("initialized", () => {
        setIsReady(true);
      });
    }
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
