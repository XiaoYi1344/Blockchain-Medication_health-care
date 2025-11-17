// // ================================
// // File: src/hooks/useSupabaseDrafts.ts
// // ================================

// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import type { DraftProductRow } from "@/types/drug";

// export function useSupabaseDrafts(userId?: string) {
//   const [rows, setRows] = useState<DraftProductRow[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!userId) {
//       setRows([]);
//       setError("No userId provided");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     (async () => {
//       try {
//         const { data, error: supaError } = await supabase
//           .from("draft_products")
//           .select("*")
//           .eq("userid", userId)
//           .order("created_at", { ascending: false });

//         if (supaError) {
//           console.error("❌ Supabase query error:", supaError.message);
//           setError(supaError.message);
//           setRows([]);
//         } else if (!data || data.length === 0) {
//           console.warn("⚠️ Supabase connected, nhưng không tìm thấy row nào.");
//           setRows([]);
//         } else {
//           setRows(data as DraftProductRow[]);
//         }
//       } catch (e: unknown) {
//         console.error("⚠️ Supabase fetch failed:", e);
//         setError(e instanceof Error ? e.message : String(e));
//         setRows([]);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [userId]);

//   return { rows, loading, error };
// }import { useState, useEffect } from "react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { DraftProductRow } from "@/types/drug";

// Lấy cookie đơn giản
function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function useSupabaseDrafts() {
  const [rows, setRows] = useState<DraftProductRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = getCookie("userId"); // 🔹 Lấy userId từ cookie
    if (!userId) {
      setRows([]);
      setError("No userId in cookie");
      return;
    }

    let cancelled = false;

    const fetchDrafts = async () => {
      setLoading(true);
      setError(null);

      const { data, error: supaError } = await supabase
        .from("draft_products")
        .select("*")
        .eq("userId", userId) // 🔹 Tên cột trùng DB
        .order("updated_at", { ascending: false });

      if (!cancelled) {
        if (supaError) {
          setError(supaError.message);
          setRows([]);
        } else {
          setRows(data || []);
        }
        setLoading(false);
      }
    };

    fetchDrafts();

    return () => {
      cancelled = true;
    };
  }, []);

  return { rows, loading, error };
}
