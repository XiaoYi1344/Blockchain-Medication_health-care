// "use client";
// import { Batch } from "@/types/batch";
// import { motion } from "framer-motion";
// import { Clock } from "lucide-react";

// interface Props {
//   batch: Batch;
// }

// export default function AuditTimeline({ batch }: Props) {
//   const logs = batch.auditLogs || [
//     { id: 1, action: "Tạo lô", user: "Admin", createdAt: "2025-10-12" },
//     { id: 2, action: "Duyệt lô", user: "Dược sĩ trưởng", createdAt: "2025-10-13" },
//   ];

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white p-4 rounded-2xl shadow border mt-5"
//     >
//       <h3 className="text-lg font-semibold text-blue-700 mb-3">
//         Lịch sử thay đổi
//       </h3>
//       <div className="relative border-l-2 border-blue-300 pl-4">
//         {logs.map((log) => (
//           <div key={log.id} className="mb-4">
//             <div className="flex items-center gap-2 text-blue-600">
//               <Clock className="w-4 h-4" />
//               <span className="font-medium">{log.action}</span>
//             </div>
//             <p className="text-sm text-gray-600 ml-6">
//               {log.user} - {log.createdAt}
//             </p>
//           </div>
//         ))}
//       </div>
//     </motion.div>
//   );
// }
