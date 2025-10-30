// // ✅ File: src/lib/supabaseClient.ts
// import { createClient } from "@supabase/supabase-js";

// const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;


// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
//   auth: { persistSession: false },
// });

// // Kiểm tra kết nối khi dev
// if (process.env.NODE_ENV === "development") {
//   (async () => {
//     const { data, error } = await supabase
//       .from("draft_products")
//       .select("id")
//       .limit(1);
//     if (error) console.error("❌ Supabase connection failed:", error.message);
//     else console.log("✅ Supabase connected:", data?.length, "rows in draft_products");
//   })();
// }

// ✅ src/lib/supabaseClient.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

// Dùng const với kiểu rõ ràng
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (SUPABASE_URL && SUPABASE_ANON) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: { persistSession: false },
  });

  if (process.env.NODE_ENV === "development") {
    (async () => {
      try {
        const { data, error } = await supabase.from("draft_products").select("id").limit(1);
        if (error) console.error("❌ Supabase connection failed:", error.message);
        else console.log("✅ Supabase connected:", data?.length, "rows in draft_products");
      } catch (err) {
        console.error("⚠️ Supabase check error:", err);
      }
    })();
  }
} else {
  console.warn("⚠️ Missing Supabase env vars. Skipping client init.");
}

export { supabase };
