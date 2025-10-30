// app/api/tracebility/route.ts
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BE_API_BASE;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { batchCode, token } = body;

    if (!batchCode) {
      return NextResponse.json({ error: "Thiếu batchCode trong body" }, { status: 400 });
    }

    console.log("📦 Gửi batchCode:", batchCode);

    // Gọi backend thật qua ngrok
    const res = await fetch(`${BACKEND_URL}/api/traceability`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ batchCode }),
    });

    const text = await res.text();
    console.log("📥 Phản hồi từ backend:", text);

    if (!res.ok) {
      return NextResponse.json(
        { error: `Backend trả lỗi ${res.status}` },
        { status: res.status }
      );
    }

    const data = JSON.parse(text);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("❌ Lỗi xử lý API:", err);
    return NextResponse.json({ error: "Lỗi máy chủ khi truy xuất" }, { status: 500 });
  }
}


// import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// export async function POST(req: Request) {
//   try {
//     const { batchCode } = await req.json();
//     if (!batchCode)
//       return NextResponse.json({ error: "Thiếu batchCode" }, { status: 400 });

//     // 1️⃣ Kiểm tra cache Supabase
//     const { data: cached } = await supabase
//       .from("batch_traces")
//       .select("*")
//       .eq("batch_code", batchCode)
//       .single();

//     if (cached) return NextResponse.json({ success: true, data: cached });

//     // 2️⃣ Fetch backend thật
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BE_API_BASE}/api/traceability`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ batchCode }),
//     });

//     if (!res.ok)
//       return NextResponse.json(
//         { error: `Backend trả lỗi ${res.status}` },
//         { status: res.status }
//       );

//     const data = await res.json();

//     // 3️⃣ Lưu vào Supabase
//     await supabase.from("batch_traces").upsert({
//       batch_code: batchCode,
//       trace_code: data.traceCode,
//       trace_url: data.traceUrl,
//     });

//     return NextResponse.json({ success: true, data });
//   } catch (err) {
//     console.error("❌ Lỗi xử lý API:", err);
//     return NextResponse.json(
//       { error: "Lỗi máy chủ khi truy xuất" },
//       { status: 500 }
//     );
//   }
// }
