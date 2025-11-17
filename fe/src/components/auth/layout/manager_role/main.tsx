// main.tsx
"use client"; // bắt buộc nếu dùng useState, hooks
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CssBaseline from "@mui/material/CssBaseline";
import RolePage from "./pages/RolePage";
import UserPage from "./pages/UserPage";

const queryClient = new QueryClient();

export default function Main() {
  return (
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/roles" />} />
          <Route path="/roles" element={<RolePage />} />
          <Route path="/users" element={<UserPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
