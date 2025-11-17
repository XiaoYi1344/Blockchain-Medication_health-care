// File: src/hooks/database/useTrace.ts
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // ✅ import từ file chung

const generateRandomCode = (length = 12) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
};

export const useTrace = (batchCode?: string) => {
  const [trace, setTrace] = useState<{
    traceCode: string;
    traceUrl: string;
  } | null>(null);

  useEffect(() => {
    if (!batchCode) return;

    const fetchTrace = async () => {
      // ✅ Lấy trace cũ
      const { data: existing, error: selectErr } = await supabase
        .from("batch_traces")
        .select("*")
        .eq("batch_code", batchCode)
        .maybeSingle();

      if (selectErr) console.warn("⚠️ Lỗi truy xuất trace:", selectErr);

      // ✅ Nếu đã có trace rồi thì dùng lại (không tạo mới)
      if (existing) {
        setTrace({
          traceCode: existing.trace_code,
          traceUrl: existing.trace_url,
        });
        return;
      }

      // ✅ Tạo mã mới
      const newCode = generateRandomCode(12);
      // ⚙️ Tự động chọn domain thật nếu đang trong mạng LAN hoặc production
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      const newUrl = `${baseUrl}/trace/${batchCode}?token=${newCode}`;

      const { error: insertErr } = await supabase.from("batch_traces").insert({
        batch_code: batchCode,
        trace_code: newCode,
        trace_url: newUrl,
      });

      if (insertErr) {
        console.error("❌ Lỗi khi thêm trace:", insertErr.message);
        return;
      }

      setTrace({ traceCode: newCode, traceUrl: newUrl });
    };

    fetchTrace();
  }, [batchCode]);

  return trace;
};
