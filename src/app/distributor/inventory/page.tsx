// pages/inventory.tsx
import { LocationTable } from "@/components/body/distributor/manager_location/locationManager";
import React from "react";

const InventoryPage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <h1>Quản lý kho & tồn kho</h1>
      <LocationTable />
    </div>
  );
};

export default InventoryPage;
