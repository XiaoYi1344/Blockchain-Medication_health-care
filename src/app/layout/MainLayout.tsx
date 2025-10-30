"use client";

import { useState } from "react";
import { Box, ThemeProvider } from "@mui/material";
import Navbar from "@/components/auth/layout/navbar/navbar";
import Sidebar from "@/components/auth/layout/sidebar/sidebar";
import { makeMedicalTheme as medicalTheme } from "@/components/theme/medicalTheme";
import { AnimatePresence } from "framer-motion";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleMode = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  const handleToggleSidebar = () => setSidebarOpen((p) => !p);

  return (
    <ThemeProvider theme={medicalTheme(mode)}>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        <Navbar
          onToggleSidebar={handleToggleSidebar}
          mode={mode}
          onToggleMode={handleToggleMode}
        />

        <AnimatePresence>
          <Sidebar openMobile={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />
        </AnimatePresence>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: "64px",
            px: 3,
            transition: "all 0.3s ease",
            ml: { md: "80px" },
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
