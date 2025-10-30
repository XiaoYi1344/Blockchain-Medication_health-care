// "use client";
// import { useState } from "react";
// import { Box, Tabs, Tab } from "@mui/material";
// import BatchTable from "./widgets/BatchTable";
// import BatchForm from "./widgets/BatchForm";
// import BatchDetailDrawer from "./widgets/BatchDetailDrawer";
// import { Batch } from "@/types/batch";

// export default function BatchManagerPage() {
//   const [tab, setTab] = useState(0);
//   const [selected, setSelected] = useState<Batch | null>(null);

//   return (
//     <Box sx={{ p: 4 }}>
//       <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 4 }}>
//         <Tab label="Danh sách lô" />
//         <Tab label="Tạo lô mới" />
//       </Tabs>

//       {tab === 0 && (
//         <BatchTable role="company_admin" onSelect={(b) => setSelected(b)} />
//       )}
//       {tab === 1 && <BatchForm onClose={() => setTab(0)} />}

//       <BatchDetailDrawer
//         batch={selected}
//         open={!!selected}
//         onClose={() => setSelected(null)}
//       />
//     </Box>
//   );
// }
