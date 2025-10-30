"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { staffService } from "@/services/staffService";
import { PermissionValue } from "@/config/permissionConfig";
import { PermissionType } from "@/types/staff";

/**
 * Hook cơ bản để load toàn bộ permission của user
 */
export function usePermission() {
  const [permissions, setPermissions] = useState<PermissionValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const uid = getCookie("userId") as string | null;
    const roleName = getCookie("roleName") as string | null;
    setUserId(uid);
    setRole(roleName);

    if (mounted) {
      setUserId(uid);
      setRole(roleName);
    }

    if (!uid) {
      if (mounted) setLoading(false);
      return;
    }

    (async () => {
      try {
        const res: PermissionType[] = await staffService.getPermissionsByUser(
          uid
        );
        if (!mounted) return;
        const perms = res.map((p) => p.name) as PermissionValue[];
        setPermissions(perms);
      } catch (error) {
        console.error("❌ Lỗi khi lấy permission:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const can = (perm: PermissionValue) => permissions.includes(perm);

  return { permissions, can, loading, userId, role };
}
