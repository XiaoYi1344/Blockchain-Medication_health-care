// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   "https://wtqvnatnrgkxiwhsrwqy.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0cXZuYXRucmdreGl3aHNyd3F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NDMwODksImV4cCI6MjA3NjIxOTA4OX0.tpiXPdmcIEzI_1lPG-4D7TeMqLWiP_8ww1XV7gAD70g"
// );

// (async () => {
//   const { data, error } = await supabase
//     .from("draft_products")
//     .select("*")
//     .limit(1);
//   if (error) {
//     console.error("❌ Supabase connection failed:", error.message);
//   } else {
//     console.log("✅ Supabase connected successfully!");
//     console.log("Sample data:", data);
//   }
// })();
