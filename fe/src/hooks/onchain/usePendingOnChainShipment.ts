// hooks/usePendingOnChainShipment.ts
import { useCallback } from "react";
import Cookies from "js-cookie";
import { ShipmentOnChain } from "@/types/shipment";

const COOKIE_KEY = "pendingOnChainShipment";

export const usePendingOnChainShipment = () => {
  // Lưu tạm vào cookie (hoặc localStorage)
  const savePendingShipment = useCallback((shipment: ShipmentOnChain) => {
    Cookies.set(COOKIE_KEY, JSON.stringify(shipment), { expires: 1 });
    // Nếu muốn dùng localStorage thay cookie:
    // localStorage.setItem(COOKIE_KEY, JSON.stringify(shipment));
  }, []);

  // Lấy dữ liệu tạm
  const getPendingShipment = useCallback((): ShipmentOnChain | null => {
    const cookie = Cookies.get(COOKIE_KEY);
    if (!cookie) return null;
    try {
      return JSON.parse(cookie);
    } catch (err) {
      console.error("Invalid pending shipment in cookie", err);
      return null;
    }
    // Nếu dùng localStorage:
    // const item = localStorage.getItem(COOKIE_KEY);
    // return item ? JSON.parse(item) : null;
  }, []);

  // Xóa dữ liệu tạm
  const clearPendingShipment = useCallback(() => {
    Cookies.remove(COOKIE_KEY);
    // Nếu dùng localStorage:
    // localStorage.removeItem(COOKIE_KEY);
  }, []);

  return { savePendingShipment, getPendingShipment, clearPendingShipment };
};
