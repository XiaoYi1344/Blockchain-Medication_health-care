// import { supabase } from "@/lib/supabaseClient";
// import { NextResponse } from "next/server";

// // GET drafts theo userId lấy từ header hoặc cookie
// export async function GET(req: Request) {
//   // Lấy userId từ cookie nếu frontend gửi trong cookie
//   const cookie = req.headers.get("cookie") || "";
//   const userIdMatch = cookie.match(/userId=([^;]+)/);
//   const userId = userIdMatch ? userIdMatch[1] : null;

//   if (!userId)
//     return NextResponse.json({ error: "Missing userId" }, { status: 400 });

//   const { data, error } = await supabase
//     .from("draft_products")
//     .select("*")
//     .eq("userId", userId) // 🔹 dùng đúng tên cột DB
//     .order("updated_at", { ascending: false });

//   if (error) return NextResponse.json({ error }, { status: 500 });
//   return NextResponse.json({ drafts: data });
// }

// // POST hoặc upsert draft
// export async function POST(req: Request) {
//   const body = await req.json();
//   const { formData } = body;

//   // Lấy userId từ cookie nếu không có trong body
//   const cookie = req.headers.get("cookie") || "";
//   const userIdMatch = cookie.match(/userId=([^;]+)/);
//   const userId = body.userId || (userIdMatch ? userIdMatch[1] : null);

//   if (!userId)
//     return NextResponse.json({ error: "Missing userId" }, { status: 400 });

//   const { error } = await supabase.from("draft_products").upsert({
//     userId: userId, // 🔹 đúng cột DB
//     name: formData.name || "Untitled",
//     data: formData,
//     updated_at: new Date().toISOString(),
//   });

//   if (error) return NextResponse.json({ error }, { status: 500 });
//   return NextResponse.json({ success: true });
// }

// // DELETE draft theo id
// export async function DELETE(req: Request) {
//   const { id } = await req.json();
//   const { error } = await supabase.from("draft_products").delete().eq("id", id);

//   if (error) return NextResponse.json({ error }, { status: 500 });
//   return NextResponse.json({ success: true });
// }


import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  if (!supabase)
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const cookie = req.headers.get("cookie") || "";
  const userId = cookie.match(/userId=([^;]+)/)?.[1];
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const { data, error } = await supabase
    .from("draft_products")
    .select("*")
    .eq("userId", userId)
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ drafts: data });
}
