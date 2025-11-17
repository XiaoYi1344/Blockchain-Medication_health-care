// "use client";

// import React, { useState } from "react";
// import { Box, Tabs, Tab } from "@mui/material";
// import { ProductFilterSearch, TableApproved, TablePending } from "./widgets/DrugFilter";
// import { Category } from "./widgets/DrugFilter";
// import { useDrug } from "@/hooks/database/useDrug";

// interface TabPanelProps {
//   children?: React.ReactNode;
//   index: number;
//   value: number;
// }

// function TabPanel({ children, value, index }: TabPanelProps) {
//   return (
//     <div role="tabpanel" hidden={value !== index}>
//       {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
//     </div>
//   );
// }

// export const DrugManager = ({ categories }: { categories: Category[] }) => {
//   const [tabIndex, setTabIndex] = useState(0);
//   const { pending, approved } = useDrug();

//   const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
//     setTabIndex(newValue);
//   };

//   return (
//     <Box>
//       <Tabs value={tabIndex} onChange={handleChange} aria-label="Drug Manager Tabs">
//         <Tab label="Pending" />
//         <Tab label="Approved" />
//       </Tabs>

//       <TabPanel value={tabIndex} index={0}>
//         <TablePending />
//         <Box mt={2}>
//           <ProductFilterSearch
//             categories={categories}
//             products={pending.data}
//             isLoading={pending.isLoading}
//           />
//         </Box>
//       </TabPanel>

//       <TabPanel value={tabIndex} index={1}>
//         <TableApproved />
//         <Box mt={2}>
//           <ProductFilterSearch
//             categories={categories}
//             products={approved.data}
//             isLoading={approved.isLoading}
//           />
//         </Box>
//       </TabPanel>
//     </Box>
//   );
// };
