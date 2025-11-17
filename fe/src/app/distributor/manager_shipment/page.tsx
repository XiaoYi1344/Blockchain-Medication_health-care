"use client";

import { ShipmentManagerPage } from "@/components/body/distributor/manager_shipment/ShipmentManager";
import React from "react";

const ManagerShipmentPage: React.FC = () => {
  return (
    <div>
      <h1>Quản lý chuyến đi</h1>
      <ShipmentManagerPage />
    </div>
  );
};

export default ManagerShipmentPage;
