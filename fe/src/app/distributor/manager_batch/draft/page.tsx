"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { PendingBatchesTable } from "@/components/body/distributor/manager_batch/widgets/BatchPending";
import { BatchDetailModal } from "@/components/body/distributor/manager_batch/widgets/BatchDetail";
// import { ApprovedBatchesTable } from "@/components/body/distributor/manager_batch/widgets/BatchTable";

export default function PendingPage() {
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleView = (batchCode: string) => {
    setSelectedBatch(batchCode);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBatch(null);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Danh sách lô chờ duyệt
      </Typography>

      <PendingBatchesTable onView={handleView} />
      {/* <ApprovedBatchesTable
  onView={handleView}
  
/> */}

      {selectedBatch && (
        <BatchDetailModal
          batchCode={selectedBatch}
          open={modalOpen}
          onClose={handleCloseModal}
        />
      )}
    </Box>
  );
}
