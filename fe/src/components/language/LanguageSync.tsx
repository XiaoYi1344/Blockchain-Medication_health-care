"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import i18n from "i18next";

const SUPPORTED_LOCALES = ["vi", "en"];
const fallbackLocale = "en";

export default function LanguageSync() {
  const pathname = usePathname();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!pathname) return;

    let mounted = true;

    const pathLocale = pathname.split("/")[1] || "";
    const savedLocale = localStorage.getItem("app_locale");

    const nextLocale =
      savedLocale && SUPPORTED_LOCALES.includes(savedLocale)
        ? savedLocale
        : SUPPORTED_LOCALES.includes(pathLocale)
        ? pathLocale
        : fallbackLocale;

    if (i18n.language !== nextLocale) {
      i18n.changeLanguage(nextLocale).then(() => {
        if (mounted) {
          localStorage.setItem("app_locale", nextLocale);
          setLoaded(true);
        }
      });
    } else {
      setLoaded(true);
    }

    return () => {
      mounted = false;
    };
  }, [pathname]);

  if (!loaded) return null;
  return null;
}
