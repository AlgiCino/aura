import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isAr = i18n.language?.startsWith("ar");
  const toggle = () => i18n.changeLanguage(isAr ? "en" : "ar");
  return (
    <button
      onClick={toggle}
      className="px-2 py-1 rounded-md border border-white/60 bg-white/40 text-sm"
      aria-label={isAr ? "Switch to English" : "التبديل إلى العربية"}
      title={isAr ? "Switch to English" : "التبديل إلى العربية"}
    >
      {isAr ? "EN" : "AR"}
    </button>
  );
}

