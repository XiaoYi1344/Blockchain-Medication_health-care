// hooks/useStaffSync.ts
import { useMutation } from "@tanstack/react-query";
import { staffService } from "@/services/staffService";
import { supabase } from "@/lib/supabaseClient";

export const useSyncCompaniesAndRoles = () => {
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      try {
        // 1️⃣ Lấy danh sách companies từ API
        const companies = await staffService.getAllCompanies();

        // 2️⃣ Lặp qua từng company
        for (const c of companies) {
          // Chỉ upsert khi đã có quyền thao tác với bảng "companies"
          await supabase
            .from("companies")
            .upsert(
              { id: c._id, name: c.name, status: c.status || "approved" },
              { onConflict: "id" }
            );

          // 3️⃣ Lấy roles của company
          const roles = await staffService.getRolesByCompany(c._id);
          for (const r of roles) {
            // Chỉ upsert khi đã có quyền thao tác với bảng "roles"
            await supabase
              .from("roles")
              .upsert(
                {
                  id: r._id,
                  company_id: c._id,
                  name: r.name,
                  display_name: r.displayName,
                  type: r.type,
                },
                { onConflict: "id" }
              );
          }
        }

        console.log("✅ Sync companies & roles thành công");
      } catch (error: unknown) {
  if (error instanceof Error) {
    console.error("❌ Lỗi sync:", error.message);
  } else {
    console.error("❌ Lỗi sync:", error);
  }
  throw error;
}

    },
  });
};
