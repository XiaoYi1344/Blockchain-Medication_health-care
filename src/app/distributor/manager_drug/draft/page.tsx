"use client";

import React from "react";
import { Box } from "@mui/material";
// import DrugTableApproved from "@/components/body/distributor/manager_mediced/manager_drug/widgets/DrugTable";
import DrugTablePending from "@/components/body/distributor/manager_mediced/manager_drug/widgets/ApprovalQueueTable";
import DrugTableOnchain from "@/components/body/distributor/manager_mediced/manager_drug/widgets/DrugTableOnchain";

export default function ApprovedPage() {
  return (
    <Box mt={5}>
      <DrugTablePending />
      <Box mt={5}>
        <DrugTableOnchain />
      </Box>
    </Box>
  );
}
