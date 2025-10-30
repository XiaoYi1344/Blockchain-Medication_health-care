// "use client";

// import React, { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Button,
//   Stack,
//   Typography,
//   Modal,
//   Box,
//   CircularProgress,
// } from "@mui/material";
// import { useShipmentOnChainList, useOnChainShipment } from "@/hooks/database/useShipmentOnChain";

// export const ShipmentOnChainList: React.FC = () => {
//   const { data: records, isLoading } = useShipmentOnChainList();
//   const onChain = useOnChainShipment();
//   const [selected, setSelected] = useState<any>(null);

//   if (isLoading) return <CircularProgress />;

//   return (
//     <Box>
//       <Typography variant="h6" mb={2}>
//         Danh sách chuyến đi (on-chain)
//       </Typography>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Ship Code</TableCell>
//             <TableCell>Batch Code</TableCell>
//             <TableCell>Status</TableCell>
//             <TableCell>Tx Hash</TableCell>
//             <TableCell>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {records?.map((r) => (
//             <TableRow key={r.id}>
//               <TableCell>{r.ship_code}</TableCell>
//               <TableCell>{r.batch_code}</TableCell>
//               <TableCell>{r.onchain_status}</TableCell>
//               <TableCell>{r.tx_hash ? `${r.tx_hash.slice(0, 10)}...` : "-"}</TableCell>
//               <TableCell>
//                 <Stack direction="row" spacing={1}>
//                   <Button size="small" variant="outlined" onClick={() => setSelected(r)}>
//                     Xem
//                   </Button>
//                   {r.onchain_status === "pending" && (
//                     <Button
//                       size="small"
//                       variant="contained"
//                       color="primary"
//                       onClick={() => onChain.mutate(r)}
//                     >
//                       On-chain
//                     </Button>
//                   )}
//                 </Stack>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       <Modal open={!!selected} onClose={() => setSelected(null)}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 500,
//             bgcolor: "background.paper",
//             p: 3,
//             borderRadius: 2,
//           }}
//         >
//           <Typography variant="h6">Chi tiết On-chain</Typography>
//           {selected && (
//             <Box mt={2}>
//               <Typography>Ship Code: {selected.ship_code}</Typography>
//               <Typography>Batch Code: {selected.batch_code}</Typography>
//               <Typography>Quantity: {selected.quantity_batch}</Typography>
//               <Typography>From: {selected.from_company_id}</Typography>
//               <Typography>To: {selected.to_company_id}</Typography>
//               <Typography>Note: {selected.note}</Typography>
//               <Typography>
//                 Tx Hash:{" "}
//                 {selected.tx_hash ? (
//                   <a
//                     href={`https://sepolia.etherscan.io/tx/${selected.tx_hash}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     {selected.tx_hash}
//                   </a>
//                 ) : (
//                   "-"
//                 )}
//               </Typography>
//             </Box>
//           )}
//         </Box>
//       </Modal>
//     </Box>
//   );
// };
"use client";

import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Stack,
  Typography,
  Modal,
  CircularProgress,
  Link,
} from "@mui/material";
import { ethers } from "ethers";
import { useCreateShipmentOnChain } from "@/hooks/contract/useShipmentOnChain";
import { Shipment } from "@/types/shipment";

interface ShipmentOnChainListProps {
  data: Shipment[];
  onRefresh?: () => void;
}

export const ShipmentOnChainList: React.FC<ShipmentOnChainListProps> = ({
  data,
  onRefresh,
}) => {
  const createOnChain = useCreateShipmentOnChain();
  const [selected, setSelected] = useState<Shipment | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleOnChain = async (shipment: Shipment) => {
    if (!window.ethereum) {
      alert("⚠️ Vui lòng kết nối ví MetaMask!");
      return;
    }

    try {
      setLoadingId(shipment.shipCode);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const firstBatch = shipment.batches?.[0];
      if (!firstBatch) {
        alert("Không có batch nào trong shipment này!");
        return;
      }

      const payload = {
        shipCode: shipment.shipCode,
        batchCode: firstBatch.batchCode,
        quantityBatch: firstBatch.quantity,
        fromCompanyId: shipment.fromCompanyId,
        toCompanyId: shipment.toCompanyId,
        note: shipment.note,
      };

      await createOnChain.mutateAsync({ signer, payload });
      onRefresh?.();
    } catch (error) {
      console.error("On-chain error:", error);
      alert("❌ Ghi shipment lên blockchain thất bại.");
    } finally {
      setLoadingId(null);
    }
  };

  if (!data) return <CircularProgress />;

  return (
    <Box mt={4}>
      <Typography variant="h6" mb={2}>
        🌐 Shipment On-Chain
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ship Code</TableCell>
            <TableCell>Batch Code</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Tx Hash</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((s) => (
            <TableRow key={s.shipCode}>
              <TableCell>{s.shipCode}</TableCell>
              <TableCell>
                {s.batches?.map((b) => b.batchCode).join(", ") || "-"}
              </TableCell>
              <TableCell>{s.status}</TableCell>
              <TableCell>
                {s.txHash ? (
                  <Link
                    href={`https://sepolia.etherscan.io/tx/${s.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.txHash.slice(0, 10)}...
                  </Link>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setSelected(s)}
                  >
                    Xem
                  </Button>
                  {!s.txHash && (
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      disabled={loadingId === s.shipCode}
                      onClick={() => handleOnChain(s)}
                    >
                      {loadingId === s.shipCode ? "Đang xử lý..." : "On-Chain"}
                    </Button>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
          }}
        >
          {selected && (
            <>
              <Typography variant="h6" mb={2}>
                Chi tiết Shipment
              </Typography>
              <Typography>Ship Code: {selected.shipCode}</Typography>
              <Typography>
                Batch Code: {selected?.batches?.[0]?.batchCode ?? "N/A"}
              </Typography>
              <Typography>
                Quantity: {selected?.batches?.[0]?.quantity ?? "N/A"}
              </Typography>
              <Typography>From: {selected.fromCompanyId}</Typography>
              <Typography>To: {selected.toCompanyId}</Typography>
              <Typography>Note: {selected.note}</Typography>
              <Typography>
                Tx Hash:{" "}
                {selected.txHash ? (
                  <Link
                    href={`https://sepolia.etherscan.io/tx/${selected.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selected.txHash}
                  </Link>
                ) : (
                  "-"
                )}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};
