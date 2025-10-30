// "use client";
// import { useEffect, useState } from "react";
// import { Box, Typography, Chip, Stack } from "@mui/material";
// import { getUserBatches } from "@/lib/firebaseBatchStore";

// export default function TempBatchList() {
//   const [batches, setBatches] = useState<any[]>([]);

//   useEffect(() => {
//     getUserBatches().then(setBatches);
//   }, []);

//   return (
//     <Box sx={{ mt: 4 }}>
//       <Typography variant="h6" mb={2}>Hàng chờ Onchain</Typography>
//       <Stack direction="row" flexWrap="wrap" gap={1}>
//         {batches.map((b) => (
//           <Chip
//             key={b.batchCode}
//             label={`${b.batchCode} - ${b.productCode}`}
//             color="primary"
//             sx={{ borderRadius: "8px" }}
//           />
//         ))}
//       </Stack>
//     </Box>
//   );
// }
