// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   Button,
//   Paper,
//   Typography,
//   Alert,
//   Stack,
//   IconButton,
//   CircularProgress,
// } from "@mui/material";
// import AttachFileIcon from "@mui/icons-material/AttachFile";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { batchServiceMock } from "@/services/mock/batchService.mock";
// // import { batchService } from "@/services/batchService"; // comment khi chưa có backend

// interface Props {
//   batchId: number;
//   role: "company_admin" | "staff" | "staff_readonly";
//   useMock?: boolean;
// }

// interface FilePreview {
//   file: File;
//   url: string;
// }

// export default function BatchUpload({ batchId, role, useMock = true }: Props) {
//   const [files, setFiles] = useState<FileList | null>(null);
//   const [previews, setPreviews] = useState<FilePreview[]>([]);
//   const [msg, setMsg] = useState<{
//     type: "success" | "error";
//     text: string;
//   } | null>(null);
//   const [loading, setLoading] = useState(false);

//   const canUpload = role === "company_admin" || role === "staff";

//   const isMounted = useRef(true);

//   const prevPreviewsRef = useRef<FilePreview[]>([]);
//   // Tạo preview khi files thay đổi

//   useEffect(() => {
//     // Revoke old preview URLs
//     prevPreviewsRef.current.forEach((p) => URL.revokeObjectURL(p.url));

//     if (!files) {
//       setPreviews([]);
//       prevPreviewsRef.current = [];
//       return;
//     }

//     const newPreviews: FilePreview[] = Array.from(files).map((f) => ({
//       file: f,
//       url: URL.createObjectURL(f),
//     }));

//     setPreviews(newPreviews);
//     prevPreviewsRef.current = newPreviews; // save for next time

//     return () => {
//       newPreviews.forEach((p) => URL.revokeObjectURL(p.url));
//     };
//   }, [files]);

//   useEffect(() => {
//     isMounted.current = true;
//     return () => {
//       isMounted.current = false;
//     };
//   }, []);

//   const removeFile = (index: number) => {
//     if (!files) return;
//     const arr = Array.from(files);
//     const removed = arr.splice(index, 1)[0];
//     console.log("removed:", removed);

//     URL.revokeObjectURL(previews[index].url); // revoke URL cũ

//     const dataTransfer = new DataTransfer();
//     arr.forEach((f) => dataTransfer.items.add(f));
//     setFiles(dataTransfer.files);

//     setPreviews(
//       arr.map((f, i) => ({
//         file: f,
//         url: previews[i >= index ? i + 1 : i]?.url || URL.createObjectURL(f),
//       }))
//     );
//   };

//   const submit = async () => {
//     if (!files || files.length === 0) {
//       if (isMounted.current)
//         setMsg({ type: "error", text: "Vui lòng chọn ít nhất một file." });
//       return;
//     }

//     if (isMounted.current) setLoading(true);
//     const fd = new FormData();
//     Array.from(files).forEach((f) => fd.append("files", f));

//     try {
//       if (useMock) {
//         await batchServiceMock.uploadDocuments?.(batchId, fd);
//       } else {
//         console.warn("Backend chưa có, dùng mock tạm");
//       }

//       if (isMounted.current) {
//         setMsg({ type: "success", text: "Tải lên thành công." });
//         setFiles(null);
//         setPreviews([]);
//       }
//     } catch (err: unknown) {
//       let errorMsg = "Lỗi không xác định.";
//       if (err instanceof Error) errorMsg = err.message;
//       else if (typeof err === "string") errorMsg = err;
//       if (isMounted.current) setMsg({ type: "error", text: errorMsg });
//     } finally {
//       if (isMounted.current) setLoading(false);
//     }
//   };

//   if (!canUpload) return null;

//   return (
//     <Paper
//       elevation={3}
//       sx={{
//         p: 3,
//         mt: 2,
//         borderRadius: 3,
//         bgcolor: "#f9fafa",
//         width: "100%",
//         maxWidth: 720,
//       }}
//     >
//       <Typography variant="h6" fontWeight={700} gutterBottom color="primary">
//         Tải chứng từ y tế
//       </Typography>
//       <Typography variant="body2" color="text.secondary" gutterBottom>
//         Đính kèm chứng nhận, báo cáo hoặc tài liệu y tế liên quan cho lô sản
//         phẩm.
//       </Typography>

//       <Box display="flex" alignItems="center" gap={2} mt={1} flexWrap="wrap">
//         <Button
//           variant="outlined"
//           component="label"
//           startIcon={<AttachFileIcon />}
//         >
//           Chọn file
//           <input
//             type="file"
//             hidden
//             multiple
//             accept="image/*,application/pdf"
//             onChange={(e) => setFiles(e.target.files)}
//           />
//         </Button>
//         <Typography variant="body2" color="text.secondary">
//           {files ? `${files.length} file(s) được chọn` : "Chưa chọn file"}
//         </Typography>
//       </Box>

//       {previews.length > 0 && (
//         <Stack spacing={1} mt={2}>
//           {previews.map((p, i) => (
//             <Box
//               key={i}
//               display="flex"
//               alignItems="center"
//               justifyContent="space-between"
//               p={1}
//               sx={{
//                 bgcolor: "#ffffff",
//                 borderRadius: 2,
//                 border: "1px solid #e0e0e0",
//               }}
//             >
//               <Typography variant="body2" noWrap sx={{ maxWidth: "80%" }}>
//                 {p.file.name}
//               </Typography>
//               <IconButton onClick={() => removeFile(i)} size="small">
//                 <DeleteIcon fontSize="small" />
//               </IconButton>
//             </Box>
//           ))}
//         </Stack>
//       )}

//       <Box mt={3} display="flex" justifyContent="flex-end">
//         <Button
//           variant="contained"
//           onClick={submit}
//           disabled={!files || files.length === 0 || loading}
//         >
//           {loading ? <CircularProgress size={24} /> : "Tải lên"}
//         </Button>
//       </Box>

//       {msg && (
//         <Box mt={2}>
//           <Alert severity={msg.type}>{msg.text}</Alert>
//         </Box>
//       )}
//     </Paper>
//   );
// }

// // import React, { useState } from "react";
// // import { Box, Button, Typography, Paper, Alert } from "@mui/material";
// // import { batchService } from "@/services/batchService";

// // interface Props {
// //   batchId: number;
// //   role: "company_admin" | "staff" | "staff_readonly";
// // }

// // export default function BatchUpload({ batchId, role }: Props) {
// //   const [files, setFiles] = useState<FileList | null>(null);
// //   const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

// //   const canUpload = role === "company_admin" || role === "staff";

// //   async function submit() {
// //     if (!files) {
// //       setMsg({ type: "error", text: "Please select at least one file." });
// //       return;
// //     }

// //     const fd = new FormData();
// //     Array.from(files).forEach((f) => fd.append("files", f));

// //     try {
// //       await batchService.uploadDocuments(batchId, fd);
// //       setMsg({ type: "success", text: "Files uploaded successfully." });
// //       setFiles(null);
// //     } catch (err: unknown) {
// //       let errorMsg = "An unexpected error occurred.";
// //       if (err instanceof Error) errorMsg = err.message;
// //       else if (typeof err === "string") errorMsg = err;
// //       setMsg({ type: "error", text: errorMsg });
// //     }
// //   }

// //   if (!canUpload) return null;

// //   return (
// //     <Paper
// //       elevation={3}
// //       sx={{ p: 3, mt: 2, borderRadius: 3, bgcolor: "grey.50" }}
// //     >
// //       <Typography variant="h6" gutterBottom>
// //         Upload Supporting Documents
// //       </Typography>
// //       <Typography variant="body2" color="text.secondary" gutterBottom>
// //         Attach relevant certificates, reports, or supporting medical documents.
// //       </Typography>

// //       <Box display="flex" alignItems="center" gap={2} mt={1}>
// //         <Button variant="outlined" component="label">
// //           Select Files
// //           <input
// //             type="file"
// //             hidden
// //             multiple
// //             onChange={(e) => setFiles(e.target.files)}
// //           />
// //         </Button>
// //         <Typography variant="body2" color="text.secondary">
// //           {files ? `${files.length} file(s) selected` : "No files selected"}
// //         </Typography>
// //       </Box>

// //       <Box mt={2}>
// //         <Button
// //           variant="contained"
// //           onClick={submit}
// //           disabled={!files || files.length === 0}
// //         >
// //           Upload
// //         </Button>
// //       </Box>

// //       {msg && (
// //         <Box mt={2}>
// //           <Alert severity={msg.type}>{msg.text}</Alert>
// //         </Box>
// //       )}
// //     </Paper>
// //   );
// // }
