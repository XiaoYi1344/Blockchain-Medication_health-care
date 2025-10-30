"use client";

import React from "react";
import { Box } from "@mui/material";
import DrugTableApproved from "@/components/body/distributor/manager_mediced/manager_drug/widgets/DrugTable";

export default function ApprovedPage() {
  return (
    <Box mt={5}>
      <DrugTableApproved />
    </Box>
  );
}
