import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function useDirection() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const dir = i18n.language?.startsWith("ar") ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", i18n.language || "en");
  }, [i18n.language]);
}

