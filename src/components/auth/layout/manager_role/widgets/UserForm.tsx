// "use client";

// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Paper } from "@mui/material";
// import { useForm } from "react-hook-form";
// import { CreateUserRequest } from "@/types/staff";

// type Props = { open: boolean; onClose: () => void; onSubmit: (data: CreateUserRequest) => void };

// export default function UserForm({ open, onClose, onSubmit }: Props) {
//   const { register, handleSubmit, reset } = useForm<CreateUserRequest>();

//   const handleFormSubmit = (data: CreateUserRequest) => {
//     onSubmit(data);
//     reset();
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//       <DialogTitle sx={{ bgcolor: "#4FC3F7", color: "#fff", fontWeight: "bold", borderRadius: "12px 12px 0 0" }}>
//         Tạo tài khoản nhân viên
//       </DialogTitle>
//       <DialogContent sx={{ bgcolor: "#E1F5FE", p: 3, borderRadius: "0 0 12px 12px" }}>
//         <Paper sx={{ p: 2, bgcolor: "#F0F7FA", borderRadius: 2 }}>
//           <TextField label="UserName" {...register("userName")} fullWidth margin="normal" sx={{ bgcolor: "#fff", borderRadius: 1 }} />
//           <TextField label="Email" {...register("email")} fullWidth margin="normal" sx={{ bgcolor: "#fff", borderRadius: 1 }} />
//           <TextField label="Phone" {...register("phone")} fullWidth margin="normal" sx={{ bgcolor: "#fff", borderRadius: 1 }} />
//           <TextField label="Password" type="password" {...register("password")} fullWidth margin="normal" sx={{ bgcolor: "#fff", borderRadius: 1 }} />
//         </Paper>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} sx={{ bgcolor: "#F5F5F5", textTransform: "none", borderRadius: 2 }}>
//           Hủy
//         </Button>
//         <Button
//           onClick={handleSubmit(handleFormSubmit)}
//           variant="contained"
//           sx={{ bgcolor: "#4FC3F7", textTransform: "none", borderRadius: 2 }}
//         >
//           Tạo
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// "use client";

// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Paper,
// } from "@mui/material";
// import { useForm } from "react-hook-form";
// import { CreateUserRequest } from "@/types/staff";
// import { getCookie } from "cookies-next";

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: CreateUserRequest) => void;
// };

// export default function UserForm({ open, onClose, onSubmit }: Props) {
//   const { register, handleSubmit, reset } = useForm<CreateUserRequest>();

//   const handleFormSubmit = (data: Partial<CreateUserRequest>) => {
//     // Lấy companyId từ cookie (hoặc hardcode để test)
//     const companyId = (getCookie("companyId") as string) || "1";

//     const payload: CreateUserRequest = {
//       userName: data.userName || "",
//       email: data.email || "",
//       phone: data.phone || "",
//       password: data.password || "",
//       dob: data.dob || undefined,
//       companyId,
//       roleIds: data.roleIds || [],
//       permissionIds: data.permissionIds || [],
//     };

//     console.log("📡 Gửi createUser payload:", payload);
//     onSubmit(payload);
//     reset();
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//       <form onSubmit={handleSubmit(handleFormSubmit)}>
//         <DialogTitle
//           sx={{
//             bgcolor: "#4FC3F7",
//             color: "#fff",
//             fontWeight: "bold",
//             borderRadius: "12px 12px 0 0",
//           }}
//         >
//           Tạo tài khoản nhân viên
//         </DialogTitle>
//         <DialogContent
//           sx={{ bgcolor: "#E1F5FE", p: 3, borderRadius: "0 0 12px 12px" }}
//         >
//           <Paper sx={{ p: 2, bgcolor: "#F0F7FA", borderRadius: 2 }}>
//             <TextField
//               label="UserName"
//               {...register("userName")}
//               fullWidth
//               margin="normal"
//               sx={{ bgcolor: "#fff", borderRadius: 1 }}
//             />
//             <TextField
//               label="Email"
//               {...register("email")}
//               fullWidth
//               margin="normal"
//               sx={{ bgcolor: "#fff", borderRadius: 1 }}
//             />
//             <TextField
//               label="Phone"
//               {...register("phone")}
//               fullWidth
//               margin="normal"
//               sx={{ bgcolor: "#fff", borderRadius: 1 }}
//             />
//             <TextField
//               label="Password"
//               type="password"
//               {...register("password")}
//               fullWidth
//               margin="normal"
//               sx={{ bgcolor: "#fff", borderRadius: 1 }}
//             />
//           </Paper>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={onClose}
//             sx={{ bgcolor: "#F5F5F5", textTransform: "none", borderRadius: 2 }}
//           >
//             Hủy
//           </Button>
//           <Button
//             type="submit"
//             variant="contained"
//             sx={{ bgcolor: "#4FC3F7", textTransform: "none", borderRadius: 2 }}
//           >
//             Tạo
//           </Button>
//         </DialogActions>
//       </form>
//     </Dialog>
//   );
// }

// "use client";

// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Paper,
// } from "@mui/material";
// import { useForm } from "react-hook-form";
// import { CreateUserRequest } from "@/types/staff";
// import { getCookie } from "cookies-next";

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: CreateUserRequest) => void;
// };

// export default function UserForm({ open, onClose, onSubmit }: Props) {
//   const { register, handleSubmit, reset } = useForm<CreateUserRequest>();

//   const handleFormSubmit = (data: Partial<CreateUserRequest>) => {
//     const companyId = (getCookie("companyId") as string) || "";

//     const payload: CreateUserRequest = {
//       userName: data.userName || "",
//       email: data.email || "",
//       phone: data.phone || "",
//       password: data.password || "",
//       dob: data.dob || undefined,
//       companyId,
//       roleIds: data.roleIds || [],
//       permissionIds: data.permissionIds || [],
//     };

//     onSubmit(payload);
//     reset();
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//       <form onSubmit={handleSubmit(handleFormSubmit)}>
//         <DialogTitle
//           sx={{
//             bgcolor: "#4FC3F7",
//             color: "#fff",
//             fontWeight: "bold",
//             borderRadius: "12px 12px 0 0",
//           }}
//         >
//           Tạo tài khoản nhân viên
//         </DialogTitle>
//         <DialogContent
//           sx={{ bgcolor: "#E1F5FE", p: 3, borderRadius: "0 0 12px 12px" }}
//         >
//           <Paper sx={{ p: 2, bgcolor: "#F0F7FA", borderRadius: 2 }}>
//             <TextField
//               label="UserName"
//               {...register("userName", { required: true })}
//               fullWidth
//               margin="normal"
//               sx={{ bgcolor: "#fff", borderRadius: 1 }}
//             />
//             <TextField
//               label="Email"
//               {...register("email", { required: true })}
//               fullWidth
//               margin="normal"
//               sx={{ bgcolor: "#fff", borderRadius: 1 }}
//             />
//             <TextField
//               label="Phone"
//               {...register("phone", { required: true })}
//               fullWidth
//               margin="normal"
//               sx={{ bgcolor: "#fff", borderRadius: 1 }}
//             />
//             <TextField
//               label="Password"
//               type="password"
//               {...register("password", { required: true })}
//               fullWidth
//               margin="normal"
//               sx={{ bgcolor: "#fff", borderRadius: 1 }}
//             />
//           </Paper>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={onClose}
//             sx={{ bgcolor: "#F5F5F5", textTransform: "none", borderRadius: 2 }}
//           >
//             Hủy
//           </Button>
//           <Button
//             type="submit"
//             variant="contained"
//             sx={{ bgcolor: "#4FC3F7", textTransform: "none", borderRadius: 2 }}
//           >
//             Tạo
//           </Button>
//         </DialogActions>
//       </form>
//     </Dialog>
//   );
// }

// "use client";
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Chip, Paper, Typography } from "@mui/material";
// import { useForm } from "react-hook-form";
// import { useState, useEffect } from "react";
// import { Role, PermissionType, CreateUserRequest, User } from "@/types/staff";
// import { getCookie } from "cookies-next";

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: CreateUserRequest) => void;
//   roles: Role[];
//   permissions: PermissionType[];
//    initialUser?: User | null;
// };

// type Step1Values = {
//   userName: string;
//   email: string;
//   phone: string;
//   password: string;
//   dob?: string;
// };

// export default function UserForm({ open, onClose, onSubmit, roles, permissions }: Props) {
//   const [step, setStep] = useState(1);
//   const { register, handleSubmit, reset, watch } = useForm<Step1Values>({
//     defaultValues: { userName: "", email: "", phone: "", password: "", dob: "" },
//   });

//   const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
//   const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

//   // Reset state khi đóng form
//   useEffect(() => {
//     if (!open) {
//       reset();
//       setSelectedRoles([]);
//       setSelectedPermissions([]);
//       setStep(1);
//     }
//   }, [open, reset]);

//   const toggleRole = (id: string) => {
//     setSelectedRoles(prev => (prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]));
//   };

//   const togglePermission = (id: string) => {
//     setSelectedPermissions(prev => (prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]));
//   };

//   const handleNext = (data: Step1Values) => setStep(2);
//   const handleBack = () => setStep(1);

//   const handleFinish = () => {
//     const companyId = (getCookie("companyId") as string) || "";
//     const step1Values = watch();
//     const payload: CreateUserRequest = {
//       ...step1Values,
//       companyId,
//       roleIds: selectedRoles,
//       permissionIds: selectedPermissions,
//     };
//     onSubmit(payload);
//     reset();
//     setSelectedRoles([]);
//     setSelectedPermissions([]);
//     setStep(1);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//       {step === 1 && (
//         <form onSubmit={handleSubmit(handleNext)}>
//           <DialogTitle sx={{ bgcolor: "#4FC3F7", color: "#fff", fontWeight: "bold", borderRadius: "12px 12px 0 0" }}>
//             Tạo tài khoản nhân viên – Bước 1
//           </DialogTitle>
//           <DialogContent sx={{ bgcolor: "#E1F5FE", p: 3 }}>
//             <Paper sx={{ p: 2, bgcolor: "#F0F7FA", borderRadius: 2 }}>
//               <TextField label="UserName" {...register("userName", { required: true })} fullWidth margin="normal" />
//               <TextField label="Email" {...register("email", { required: true })} fullWidth margin="normal" />
//               <TextField label="Phone" {...register("phone", { required: true })} fullWidth margin="normal" />
//               <TextField label="Password" type="password" {...register("password", { required: true })} fullWidth margin="normal" />
//               <TextField label="Ngày sinh" type="date" {...register("dob")} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
//             </Paper>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={onClose} sx={{ bgcolor: "#F5F5F5" }}>Hủy</Button>
//             <Button type="submit" variant="contained" sx={{ bgcolor: "#4FC3F7" }}>Tiếp</Button>
//           </DialogActions>
//         </form>
//       )}

//       {step === 2 && (
//         <>
//           <DialogTitle sx={{ bgcolor: "#4FC3F7", color: "#fff", fontWeight: "bold", borderRadius: "12px 12px 0 0" }}>
//             Tạo tài khoản nhân viên – Bước 2
//           </DialogTitle>
//           <DialogContent sx={{ bgcolor: "#E1F5FE", p: 3 }}>
//             <Typography variant="subtitle1" sx={{ mb: 1 }}>Chọn Role:</Typography>
//             <Paper sx={{ p: 2, bgcolor: "#F0F7FA", borderRadius: 2, mb: 2 }}>
//               {roles.map(r => (
//   <Chip
//     key={r._id} // <-- dùng _id, đảm bảo unique
//     label={r.displayName}
//     clickable
//     color={selectedRoles.includes(r._id) ? "primary" : "default"}
//     onClick={() => toggleRole(r._id)}
//     sx={{ mr: 1, mb: 1 }}
//   />
// ))}

//             </Paper>

//             <Typography variant="subtitle1" sx={{ mb: 1 }}>Chọn Permission độc quyền (tuỳ chọn):</Typography>
//             <Paper sx={{ p: 2, bgcolor: "#F0F7FA", borderRadius: 2 }}>
//               {permissions.map(p => (
//   <Chip
//     key={p._id} // hoặc p.id nếu API có id duy nhất
//     label={p.displayName}
//     clickable
//     color={selectedPermissions.includes(p._id) ? "primary" : "default"}
//     onClick={() => togglePermission(p._id)}
//     sx={{ mr: 1, mb: 1 }}
//   />
// ))}

//             </Paper>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleBack} sx={{ bgcolor: "#F5F5F5" }}>Quay lại</Button>
//             <Button onClick={handleFinish} variant="contained" sx={{ bgcolor: "#4FC3F7" }}>Hoàn tất</Button>
//           </DialogActions>
//         </>
//       )}
//     </Dialog>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Paper,
  Typography,
  FormHelperText,
  Stack,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Role, PermissionType, CreateUserRequest, User } from "@/types/staff";
import { getCookie } from "cookies-next";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserRequest) => void;
  roles: Role[];
  permissions: PermissionType[];
  initialUser?: User | null;
};

type Step1Values = {
  userName: string;
  email: string;
  phone: string;
  password: string;
  dob?: string;
};

export default function UserForm({
  open,
  onClose,
  onSubmit,
  roles,
  permissions,
  initialUser,
}: Props) {
  const theme = useTheme();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const { register, handleSubmit, reset, watch } = useForm<Step1Values>({
    defaultValues: {
      userName: "",
      email: "",
      phone: "",
      password: "",
      dob: "",
    },
  });

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Reset dữ liệu khi mở form
  useEffect(() => {
    let isMounted = true;

    if (open) {
      if (isMounted) {
        if (initialUser) {
          reset({
            userName: initialUser.userName,
            email: initialUser.email,
            phone: initialUser.phone,
            password: "",
            dob: initialUser.dob || "",
          });
          setSelectedRoles(
            Array.isArray(initialUser.roleId)
              ? initialUser.roleId
              : [initialUser.roleId]
          );
          setSelectedPermissions(initialUser.permissionIds || []);
        } else {
          reset();
          setSelectedRoles([]);
          setSelectedPermissions([]);
        }
        setStep(1);
        setError("");
      }
    }

    return () => {
      isMounted = false;
    };
  }, [open, initialUser, reset]);

  // Toggle chọn Role (chỉ 1)
  const toggleRole = (id: string) => setSelectedRoles([id]);

  // Toggle chọn Permission (tối đa 3)
  const togglePermission = (id: string) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length < 3) return [...prev, id];
      setError("Chỉ được chọn tối đa 3 permission");
      return prev;
    });
  };

  const handleNext = handleSubmit(() => setStep(2));
  const handleBack = () => setStep(1);

  const handleFinish = () => {
    if (selectedRoles.length === 0) return setError("Phải chọn ít nhất 1 Role");
    if (selectedPermissions.length === 0)
      return setError("Phải chọn ít nhất 1 Permission");

    const companyId = (getCookie("companyId") as string) || "";
    const step1Values = watch();

    const payload: CreateUserRequest & { userId?: string } = {
      ...step1Values,
      companyId,
      roleIds: selectedRoles,
      permissionIds: selectedPermissions,
      ...(initialUser?._id && { userId: initialUser._id }),
    };

    onSubmit(payload);
    reset();
    setSelectedRoles([]);
    setSelectedPermissions([]);
    setStep(1);
    setError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            component: motion.div,
            initial: { opacity: 0, scale: 0.9, y: 40 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.9, y: 40 },
            transition: { duration: 0.3, ease: "easeOut" },
            sx: { borderRadius: 4 },
          }}
        >
          {/* Step 1 */}
          {step === 1 && (
            <form onSubmit={handleNext}>
              <DialogTitle
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: "16px 16px 0 0",
                  textAlign: "center",
                }}
              >
                {initialUser
                  ? "Cập nhật nhân viên – Bước 1"
                  : "Tạo nhân viên – Bước 1"}
              </DialogTitle>

              <DialogContent
                sx={{
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(145deg, #061d22, #082524)"
                      : "linear-gradient(145deg, #f7ffff, #e9f7f7)",
                  p: 3,
                }}
              >
                <Stack spacing={2}>
                  <TextField
                    label="Tên đăng nhập"
                    {...register("userName", { required: true })}
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    {...register("email", { required: true })}
                    fullWidth
                  />
                  <TextField
                    label="Số điện thoại"
                    {...register("phone", { required: true })}
                    fullWidth
                  />
                  <TextField
                    label="Mật khẩu"
                    type="password"
                    {...register("password", { required: !initialUser })}
                    fullWidth
                  />
                  <TextField
                    label="Ngày sinh"
                    type="date"
                    {...register("dob")}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
              </DialogContent>

              <DialogActions sx={{ justifyContent: "center", py: 2 }}>
                <Button onClick={onClose}>Hủy</Button>
                <Button variant="contained" type="submit">
                  Tiếp
                </Button>
              </DialogActions>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <DialogTitle
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: "16px 16px 0 0",
                  textAlign: "center",
                }}
              >
                {initialUser
                  ? "Cập nhật nhân viên – Bước 2"
                  : "Tạo nhân viên – Bước 2"}
              </DialogTitle>

              <DialogContent
                sx={{
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(145deg, #061d22, #082524)"
                      : "linear-gradient(145deg, #f7ffff, #e9f7f7)",
                  p: 3,
                }}
              >
                <Typography fontWeight={600} mb={1}>
                  Chọn Role:
                </Typography>
                <Paper sx={{ p: 2, mb: 2 }}>
                  {roles.map((r) => (
                    <Chip
                      key={r._id}
                      label={r.displayName}
                      color={
                        selectedRoles.includes(r._id) ? "primary" : "default"
                      }
                      onClick={() => toggleRole(r._id)}
                      clickable
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Paper>

                <Typography fontWeight={600} mb={1}>
                  Chọn Permission (tối đa 3):
                </Typography>
                <Paper sx={{ p: 2 }}>
                  {permissions.map((p) => (
                    <Chip
                      key={p._id}
                      label={p.displayName}
                      color={
                        selectedPermissions.includes(p._id)
                          ? "primary"
                          : "default"
                      }
                      onClick={() => togglePermission(p._id)}
                      clickable
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Paper>

                {error && (
                  <FormHelperText error sx={{ mt: 2 }}>
                    {error}
                  </FormHelperText>
                )}
              </DialogContent>

              <DialogActions sx={{ justifyContent: "center", py: 2 }}>
                <Button onClick={handleBack}>Quay lại</Button>
                <Button variant="contained" onClick={handleFinish}>
                  Hoàn tất
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      )}
    </AnimatePresence>
  );
}
