"use client";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import * as React from "react";

let clientSideEmotionCache: ReturnType<typeof createCache> | null = null;

function createEmotionCache() {
  return createCache({ key: "css", prepend: true });
}

export default function EmotionRegistry({ children }: { children: React.ReactNode }) {
  const [emotionCache] = React.useState(() => {
    if (typeof window === "undefined") {
      // server
      return createEmotionCache();
    }
    if (!clientSideEmotionCache) {
      clientSideEmotionCache = createEmotionCache();
    }
    return clientSideEmotionCache;
  });

  return <CacheProvider value={emotionCache}>{children}</CacheProvider>;
}
