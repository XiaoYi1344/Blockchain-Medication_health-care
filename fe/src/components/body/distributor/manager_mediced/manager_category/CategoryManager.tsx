"use client";

import { useState, useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { Role } from "@/types/role";
import CategoryTableBase from "./widgets/CategoryTableBase";
import { useEntityPermission } from "@/hooks/database/useEntityPermission";

interface CategoryManagerProps {
  role: Role;
  onSuccess?: () => void;
  onError?: () => void;
}

export default function CategoryManager({
  role,
  onSuccess,
  onError,
}: CategoryManagerProps) {
  const [tab, setTab] = useState(0);

  // Lấy quyền của user với entity "category"
  const { canApprove } = useEntityPermission("category");

  // Chọn tab mặc định nếu không có quyền duyệt
  useEffect(() => {
    let isMounted = true;

    if (!canApprove && isMounted) {
      setTab(0);
    }

    return () => {
      isMounted = false;
    };
  }, [canApprove]);

  // Tạo danh sách tab dựa trên quyền
  const tabs = canApprove
    ? [
        { label: "Chờ duyệt", isActive: false },
        { label: "Danh mục đã duyệt", isActive: true },
      ]
    : [{ label: "Danh mục đã duyệt", isActive: true }];

  return (
    <Box mt={4}>
      {tabs.length > 1 && (
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          {tabs.map((t, idx) => (
            <Tab key={idx} label={t.label} />
          ))}
        </Tabs>
      )}

      {tabs.map((t, idx) =>
        tab === idx ? (
          <CategoryTableBase
            key={idx}
            isActive={t.isActive}
            title={t.label}
            role={role}
            onSuccess={onSuccess}
            onError={onError}
          />
        ) : null
      )}
    </Box>
  );
}
