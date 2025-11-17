// // "use client";
// // import React, { useState, useEffect } from "react";
// // import {
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Button,
// //   TextField,
// //   FormHelperText,
// //   Stack,
// //   Chip,
// // } from "@mui/material";
// // import { Role, PermissionType } from "@/types/staff";

// // interface RoleFormProps {
// //   open: boolean;
// //   initial?: Role | null;
// //   permissions: PermissionType[];
// //   onClose: () => void;
// //   onSubmit: (data: {
// //     name: string;
// //     displayName: string;
// //     permissionIds: string[];
// //   }) => void;
// // }

// // const RoleForm: React.FC<RoleFormProps> = ({
// //   open,
// //   initial,
// //   permissions,
// //   onClose,
// //   onSubmit,
// // }) => {
// //   const [name, setName] = useState("");
// //   const [displayName, setDisplayName] = useState("");
// //   const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
// //   const [error, setError] = useState("");

// //   // Reset state **chỉ khi form mở**
// //   useEffect(() => {
// //     if (open) {
// //       setName(initial?.name || "");
// //       setDisplayName(initial?.displayName || "");
// //       setSelectedPermissions(initial?.permissions?.map((p) => p._id) || []);
// //       setError("");
// //     }
// //   }, [open, initial]);

// //   const handleChipToggle = (id: string) => {
// //   setSelectedPermissions((prev) => {
// //     // Nếu đã chọn thì bỏ chọn
// //     if (prev.includes(id)) {
// //       setError("");
// //       return prev.filter((p) => p !== id);
// //     }

// //     // Nếu chưa chọn mà đã đạt giới hạn
// //     if (prev.length >= 3) {
// //       setError("Chỉ được chọn tối đa 3 permission");
// //       return prev; // không thêm mới
// //     }

// //     // Nếu hợp lệ -> thêm mới
// //     setError("");
// //     return [...prev, id];
// //   });
// // };

// //   const handleSubmit = () => {
// //     if (!name || !displayName) {
// //       setError("Name và Display Name không được để trống");
// //       return;
// //     }
// //     if (selectedPermissions.length === 0) {
// //       setError("Phải chọn ít nhất 1 permission");
// //       return;
// //     }
// //     onSubmit({
// //       name,
// //       displayName,
// //       permissionIds: selectedPermissions,
// //     });
// //     onClose();
// //   };

// //   return (
// //     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
// //       <DialogTitle>{initial ? "Sửa Role" : "Thêm Role"}</DialogTitle>
// //       <DialogContent>
// //         <TextField
// //           label="Name"
// //           fullWidth
// //           margin="normal"
// //           value={name}
// //           onChange={(e) => setName(e.target.value)}
// //         />
// //         <TextField
// //           label="Display Name"
// //           fullWidth
// //           margin="normal"
// //           value={displayName}
// //           onChange={(e) => setDisplayName(e.target.value)}
// //         />

// //         <Stack direction="row" spacing={1} flexWrap="wrap" mt={2}>
// //           {permissions.map((p, index) => (
// //             <Chip
// //               key={p._id ?? index} // đảm bảo key duy nhất
// //               label={p.displayName}
// //               color={
// //                 selectedPermissions.includes(p._id) ? "primary" : "default"
// //               }
// //               variant={
// //                 selectedPermissions.includes(p._id) ? "filled" : "outlined"
// //               }
// //               onClick={() => handleChipToggle(p._id)}
// //             />
// //           ))}
// //         </Stack>

// //         {error && <FormHelperText error>{error}</FormHelperText>}
// //       </DialogContent>
// //       <DialogActions>
// //         <Button onClick={onClose}>Hủy</Button>
// //         <Button onClick={handleSubmit} variant="contained">
// //           {initial ? "Cập nhật" : "Tạo"}
// //         </Button>
// //       </DialogActions>
// //     </Dialog>
// //   );
// // };

// // export default RoleForm;

// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   FormHelperText,
//   Stack,
//   Chip,
//   Typography,
//   Divider,
//   Paper,
// } from "@mui/material";
// import { Role, PermissionType } from "@/types/staff";

// interface RoleFormProps {
//   open: boolean;
//   initial?: Role | null;
//   permissions: PermissionType[];
//   onClose: () => void;
//   onSubmit: (data: {
//     name: string;
//     displayName: string;
//     permissionIds: string[];
//   }) => void;
// }

// const RoleForm: React.FC<RoleFormProps> = ({
//   open,
//   initial,
//   permissions,
//   onClose,
//   onSubmit,
// }) => {
//   const [name, setName] = useState("");
//   const [displayName, setDisplayName] = useState("");
//   const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
//   const [error, setError] = useState("");

//   // ✅ Khởi tạo lại khi form mở
//   useEffect(() => {
//     if (open) {
//       setName(initial?.name || "");
//       setDisplayName(initial?.displayName || "");
//       setSelectedPermissions(initial?.permissions?.map((p) => p._id) || []);
//       setError("");
//     }
//   }, [open, initial]);

//   // ✅ Gom nhóm permission theo tiền tố (vd: product, category, batch)
//   const groupedPermissions = useMemo(() => {
//     const groups: Record<string, PermissionType[]> = {};
//     permissions.forEach((p) => {
//       const prefix = p.displayName.split(" ")[0]; // tách phần đầu
//       if (!groups[prefix]) groups[prefix] = [];
//       groups[prefix].push(p);
//     });
//     return groups;
//   }, [permissions]);

//   // ✅ Toggle chọn/bỏ permission
//   const handleChipToggle = (id: string) => {
//     setSelectedPermissions((prev) => {
//       if (prev.includes(id)) {
//         setError("");
//         return prev.filter((p) => p !== id);
//       }

//       if (prev.length >= 10) { // ví dụ giới hạn 10
//         setError("Chỉ được chọn tối đa 10 permission");
//         return prev;
//       }

//       setError("");
//       return [...prev, id];
//     });
//   };

//   // ✅ Submit
//   const handleSubmit = () => {
//     if (!name.trim() || !displayName.trim()) {
//       setError("Name và Display Name không được để trống");
//       return;
//     }
//     if (selectedPermissions.length === 0) {
//       setError("Phải chọn ít nhất 1 permission");
//       return;
//     }

//     onSubmit({
//       name,
//       displayName,
//       permissionIds: selectedPermissions,
//     });
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
//       <DialogTitle>{initial ? "Sửa Role" : "Thêm Role"}</DialogTitle>

//       <DialogContent dividers>
//         {/* --- Name fields --- */}
//         <TextField
//           label="Name"
//           fullWidth
//           margin="normal"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <TextField
//           label="Display Name"
//           fullWidth
//           margin="normal"
//           value={displayName}
//           onChange={(e) => setDisplayName(e.target.value)}
//         />

//         {/* --- Permissions grouped display --- */}
//         <Stack spacing={3} mt={2}>
//           {Object.entries(groupedPermissions).map(([group, perms]) => (
//             <Paper key={group} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
//               <Typography
//                 variant="subtitle2"
//                 sx={{ textTransform: "capitalize", mb: 1, fontWeight: 600 }}
//               >
//                 {group}
//               </Typography>
//               <Divider sx={{ mb: 1 }} />
//               <Stack direction="row" flexWrap="wrap" gap={1}>
//                 {perms.map((p) => {
//                   const isSelected = selectedPermissions.includes(p._id);
//                   return (
//                     <Chip
//                       key={p._id}
//                       label={p.displayName.replace(`${group} `, "")}
//                       color={isSelected ? "primary" : "default"}
//                       variant={isSelected ? "filled" : "outlined"}
//                       onClick={() => handleChipToggle(p._id)}
//                       sx={{
//                         borderRadius: "10px",
//                         fontSize: "0.8rem",
//                         fontWeight: 500,
//                         cursor: "pointer",
//                       }}
//                     />
//                   );
//                 })}
//               </Stack>
//             </Paper>
//           ))}
//         </Stack>

//         {/* --- Error display --- */}
//         {error && (
//           <FormHelperText error sx={{ mt: 2 }}>
//             {error}
//           </FormHelperText>
//         )}
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={onClose}>Hủy</Button>
//         <Button onClick={handleSubmit} variant="contained">
//           {initial ? "Cập nhật" : "Tạo"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default RoleForm;

"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormHelperText,
  Stack,
  Chip,
  Typography,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
  Zoom,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Role, PermissionType } from "@/types/staff";
import { useSyncCompaniesAndRoles } from "@/hooks/cookie/useSyncStaff";

interface RoleFormProps {
  open: boolean;
  initial?: Role | null;
  permissions: PermissionType[];
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    displayName: string;
    permissionIds: string[];
  }) => void;
}

const RoleForm: React.FC<RoleFormProps> = ({
  open,
  initial,
  permissions,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");

  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [error, setError] = useState("");


   const syncMutation = useSyncCompaniesAndRoles();
  // 🧠 Reset state khi dialog mở
  // 🧠 Reset state khi dialog mở (có kiểm tra mount)
  useEffect(() => {
    let isMounted = true;

    if (open && isMounted) {
      setName(initial?.name || "");
      setDisplayName(initial?.displayName || "");
      setSelectedPermissions(initial?.permissions?.map((p) => p._id) || []);
      setError("");
    }

    return () => {
      isMounted = false;
    };
  }, [open, initial]);

  // 🧩 Gom nhóm permission theo tiền tố
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, PermissionType[]> = {};
    permissions.forEach((p) => {
      const prefix = p.displayName.split(" ")[0];
      if (!groups[prefix]) groups[prefix] = [];
      groups[prefix].push(p);
    });
    return groups;
  }, [permissions]);

  // 🔘 Toggle chọn permission
  const handleChipToggle = (id: string) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(id)) {
        setError("");
        return prev.filter((p) => p !== id);
      }
      if (prev.length >= 10) {
        setError("Chỉ được chọn tối đa 10 permission");
        return prev;
      }
      setError("");
      return [...prev, id];
    });
  };

  // ✅ Submit
  const handleSubmit = () => {
    if (!name.trim() || !displayName.trim()) {
      setError("Name và Display Name không được để trống");
      return;
    }
    if (selectedPermissions.length === 0) {
      setError("Phải chọn ít nhất 1 permission");
      return;
    }

    let isMounted = true;

    onSubmit({
      name,
      displayName,
      permissionIds: selectedPermissions,
    });

    syncMutation.mutate(undefined, {
  onSuccess: () => {
    console.log("✅ Sync thành công");
  },
  onError: (error) => {
    console.error("❌ Sync thất bại:", error);
  },
});

    if (isMounted) onClose();

    return () => {
      isMounted = false;
    };
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          fullWidth
          maxWidth="md"
          PaperProps={{
            component: motion.div,
            initial: { opacity: 0, y: 40, scale: 0.98 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: 40 },
            transition: { duration: 0.25, ease: "easeOut" },
            sx: {
              borderRadius: 4,
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(145deg, #081e24, #07201f)"
                  : "linear-gradient(145deg, #ffffff, #f6fbfb)",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 0 40px rgba(0, 169, 157, 0.15)"
                  : "0 0 20px rgba(0,0,0,0.06)",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 700,
              fontSize: isMobile ? "1.2rem" : "1.4rem",
              textAlign: "center",
              color: theme.palette.primary.main,
            }}
          >
            {initial ? "Cập nhật Role" : "Thêm Role mới"}
          </DialogTitle>

          <DialogContent dividers sx={{ px: isMobile ? 2 : 4, py: 3 }}>
            {/* --- Name Fields --- */}
            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={2}
              sx={{ mb: 2 }}
            >
              <TextField
                label="Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="Display Name"
                fullWidth
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </Stack>

            {/* --- Permission Groups --- */}
            <Stack spacing={3}>
              {Object.entries(groupedPermissions).map(([group, perms]) => (
                <Zoom key={group} in={open} style={{ transitionDelay: "50ms" }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: isMobile ? 1.5 : 2,
                      borderRadius: 1.5,
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(0,169,157,0.08)"
                          : "rgba(0,169,157,0.04)",
                      borderColor:
                        theme.palette.mode === "dark"
                          ? "rgba(0,169,157,0.3)"
                          : "rgba(0,169,157,0.15)",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow:
                          theme.palette.mode === "dark"
                            ? "0 0 15px rgba(0,169,157,0.2)"
                            : "0 0 10px rgba(0,169,157,0.15)",
                      },
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        textTransform: "capitalize",
                        mb: 1,
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {group}
                    </Typography>
                    <Divider sx={{ mb: 1.5 }} />

                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {perms.map((p) => {
                        const isSelected = selectedPermissions.includes(p._id);
                        return (
                          <Chip
                            key={p._id}
                            label={p.displayName.replace(`${group} `, "")}
                            color={isSelected ? "primary" : "default"}
                            variant={isSelected ? "filled" : "outlined"}
                            onClick={() => handleChipToggle(p._id)}
                            sx={{
                              borderRadius: "12px",
                              fontSize: "0.8rem",
                              fontWeight: 500,
                              cursor: "pointer",
                              boxShadow: isSelected
                                ? "0 0 10px rgba(0,169,157,0.4)"
                                : "none",
                              "&:hover": {
                                transform: "scale(1.05)",
                                boxShadow:
                                  theme.palette.mode === "dark"
                                    ? "0 0 8px rgba(0,169,157,0.3)"
                                    : "0 0 6px rgba(0,169,157,0.2)",
                              },
                              transition: "all 0.2s ease",
                            }}
                          />
                        );
                      })}
                    </Stack>
                  </Paper>
                </Zoom>
              ))}
            </Stack>

            {error && (
              <FormHelperText error sx={{ mt: 2, textAlign: "center" }}>
                {error}
              </FormHelperText>
            )}
          </DialogContent>

          <DialogActions sx={{ justifyContent: "center", py: 2 }}>
            <Button onClick={onClose} sx={{ minWidth: 100 }}>
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                minWidth: 120,
                boxShadow: "0 6px 12px rgba(0,169,157,0.25)",
                "&:hover": {
                  boxShadow: "0 8px 20px rgba(0,169,157,0.35)",
                },
              }}
            >
              {initial ? "Cập nhật" : "Tạo"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default RoleForm;
