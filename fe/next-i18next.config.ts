// next-i18next.config.ts
import type { UserConfig } from "next-i18next";

const config: UserConfig = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "vi"],
    localeDetection: false,
  },
  localePath: "./public/locales",
  defaultNS: "common",
  ns: ["common"],
};

export default config;
