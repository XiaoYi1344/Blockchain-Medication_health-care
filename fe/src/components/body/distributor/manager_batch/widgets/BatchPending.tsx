import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import {
  useBatches,
  useApproveBatch,
  useUpdateBatchState,
} from "@/hooks/database/useBatch";
import { useSnackbar } from "notistack";
import { BatchWithInventory } from "@/types/location";

export const PendingBatchesTable = ({
  onView,
}: {
  onView: (batchCode: string) => void;
}) => {
  const { data: batches } = useBatches();
  const approveMutation = useApproveBatch();
  const updateStateMutation = useUpdateBatchState();
  const { enqueueSnackbar } = useSnackbar();

  // Chỉ lấy những batch DRAFT hoặc isActive = false
  const pendingBatches = batches?.filter(
    (b) => b.state === "DRAFT" || b.isActive === false
  );

  const [highlight, setHighlight] = useState<string | null>(null);

  const handleUpdateClick = (batchCode: string) => {
    setHighlight(batchCode);
    setTimeout(() => setHighlight(null), 1000);
  };

  const handleRecall = (batchCode: string) => {
    updateStateMutation.mutate(
      { batchCode, state: "RECALL" },
      {
        onSuccess: () => {
          enqueueSnackbar(
            `Lô ${batchCode} đã được chuyển sang trạng thái RECALL`,
            { variant: "success" }
          );
        },
        onError: () => {
          enqueueSnackbar(`Xảy ra lỗi khi cập nhật lô ${batchCode}`, {
            variant: "error",
          });
        },
      }
    );
  };

  const handleApprove = (batch: BatchWithInventory) => {
    const payload: { batchCode: string; isActive: boolean; state?: string } = {
      batchCode: batch.batchCode,
      isActive: true,
    };

    // Nếu batch đang DRAFT → gửi state = "APPROVAL"
    if (batch.state === "DRAFT") {
      payload.state = "APPROVAL";
    }

    approveMutation.mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar(`Lô ${batch.batchCode} đã được duyệt`, {
          variant: "success",
        });
      },
      onError: () => {
        enqueueSnackbar(`Duyệt lô ${batch.batchCode} thất bại`, {
          variant: "error",
        });
      },
    });
  };

  return (
    <Table sx={{ mt: 3 }}>
      <TableHead>
        <TableRow>
          <TableCell>Mã lô</TableCell>
          <TableCell>Số lượng</TableCell>
          <TableCell>Trạng thái</TableCell>
          <TableCell>Hành động</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {pendingBatches?.map((batch) => (
          <TableRow
            key={batch.batchCode}
            sx={{
              backgroundColor:
                highlight === batch.batchCode ? "#fff59d" : "inherit",
              transition: "background-color 0.3s",
            }}
          >
            <TableCell>{batch.batchCode}</TableCell>
            <TableCell>{batch.expectedQuantity}</TableCell>
            <TableCell>{batch.state}</TableCell>
            <TableCell>
              <Button onClick={() => onView(batch.batchCode)}>Xem</Button>
              <Button
                color="success"
                sx={{ ml: 1 }}
                onClick={() => handleApprove(batch)}
              >
                Duyệt
              </Button>
              <Button
                color="error"
                sx={{ ml: 1 }}
                onClick={() => handleRecall(batch.batchCode)}
              >
                Xóa (RECALL)
              </Button>
              <Button
                color="secondary"
                sx={{ ml: 1 }}
                onClick={() => handleUpdateClick(batch.batchCode)}
              >
                Cập nhật lô
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
