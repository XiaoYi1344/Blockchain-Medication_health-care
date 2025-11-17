"use client";

import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { CssBaseline } from "@mui/material";
import { ThemeRegistry } from "@/components/theme/ThemeRegistry";
import { authService } from "@/services/authService";
import { Toaster as SonnerToaster } from "sonner";
import { Toaster as HotToaster } from "react-hot-toast";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  // Client-only dynamic effects
  useEffect(() => {
    let isMounted = true;

    const resume = async () => {
      try {
        await authService.resumeSession();
        if (isMounted) console.log("✅ Session resumed");
      } catch (error) {
        console.error("❌ Resume session failed:", error);
      }
    };

    resume();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={2500}
      >
        <ThemeRegistry>
          {children}
          {/* Hydration-safe client-only toasters */}
          <SonnerToaster
            position="top-right"
            theme="light"
            richColors
            toastOptions={{
              style: {
                borderRadius: "12px",
                background: "linear-gradient(135deg, #E8F5F2, #FFFFFF)",
                border: "1px solid rgba(0,169,157,0.2)",
              },
            }}
          />
          <HotToaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: "12px",
                background: "linear-gradient(135deg, #E8F5F2, #FFFFFF)",
                border: "1px solid rgba(0,169,157,0.2)",
              },
            }}
          />
        </ThemeRegistry>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}
