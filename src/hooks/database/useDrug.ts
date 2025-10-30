import { useEffect, useState, useMemo, useCallback } from "react";
import { backendService } from "@/services/drugService";
import { contractService } from "@/services/contract/drugContract";
import type { BackendProduct, ContractProduct } from "@/types/drug";

export interface MergedProduct extends BackendProduct {
  onChainData: ContractProduct | null;
}

export function useDrugServices() {
  const [backendProducts, setBackendProducts] = useState<
    BackendProduct[] | null
  >(null);
  const [contractProducts, setContractProducts] = useState<
    ContractProduct[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ================================
  // 🔁 HÀM FETCH CHÍNH (có thể gọi lại)
  // ================================
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    let cancelled = false;

    const cancel = () => {
      cancelled = true;
    };

    try {
      const beList = await backendService.getForUser();
      if (!cancelled) setBackendProducts(beList);

      try {
        const cp = await contractService.getAllProducts();
        if (!cancelled) setContractProducts(cp || []);
      } catch (contractErr) {
        console.error("❌ Contract error:", contractErr);
        if (!cancelled) setContractProducts([]);
      }
    } catch (err) {
      if (!cancelled)
        setError(err instanceof Error ? err.message : String(err));
    } finally {
      if (!cancelled) setLoading(false);
    }

    return cancel; // trả về hàm cancel nếu muốn dùng ngoài
  }, []);

  // Gọi lần đầu
  useEffect(() => {
    let cancelled = false;

    console.log("cancelled:", cancelled);

    const fetchDataAsync = async () => {
      await fetchData();
    };

    fetchDataAsync();

    return () => {
      cancelled = true;
    };
  }, [fetchData]);

  // ================================
  // MERGED LIST (memoized)
  // ================================
  const merged = useMemo<MergedProduct[] | null>(() => {
    if (!backendProducts) return null;
    if (!contractProducts)
      return backendProducts.map((b) => ({ ...b, onChainData: null }));

    const map = new Map<string, ContractProduct>();
    for (const c of contractProducts) {
      const key = c.gtin || c.productCode;
      if (key) map.set(key, c);
    }

    return backendProducts.map((b) => {
      const key = b.gtin || b.productCode || "";
      return { ...b, onChainData: map.get(key) || null };
    });
  }, [backendProducts, contractProducts]);

  // ================================
  // RETURN API
  // ================================
  return {
    backendProducts,
    contractProducts,
    merged,
    loading,
    error,
    setBackendProducts,
    reload: fetchData, // 🔁 Thêm hàm reload
  };
}
