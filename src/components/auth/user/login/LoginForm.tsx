// "use client";
// import { useState } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Paper,
//   useTheme,
//   useMediaQuery,
//   InputAdornment,
//   IconButton,
// } from "@mui/material";
// import { authService } from "@/services/authService";
// import { useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { LoginRequest } from "@/types/auth";
// import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
// import LockIcon from "@mui/icons-material/Lock";
// import PersonIcon from "@mui/icons-material/Person";
// import ForgotPasswordDialog from "../forgot_password/ForgotPasswordDialog";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// export default function LoginForm() {
//   const router = useRouter();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const [identifier, setIdentifier] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [openForgot, setOpenForgot] = useState(false);
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const errorMap: Record<string, string> = {
//     D1: "Your account is not verified",
//     D2: "Invalid password",
//     D3: "User does not exist.",
//     D4: "User already authenticated",
//     D5: "Enter wrong otp",
//     D6: "User is in the process of authentication",
//     D7: "User is not authenticated",
//     D8: "You are not logged in",
//     D9: "Invalid refresh token",
//     F2: "User not found",
//   };
//   const handleLogin = async () => {
//     setLoading(true);
//     try {
//       const payload: LoginRequest = identifier.includes("@")
//         ? { email: identifier, password }
//         : { userName: identifier, password };
//       const res = await authService.login(payload);
//       if (res.message === "Login successfully") {
//         toast.success(res.message);
//         router.push("/distributor/manager_batch/approved");
//       } else {
//         toast.error("Login failed");
//       }
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err) && err.response?.data) {
//         const code = err.response.data.message;
//         toast.error(code && errorMap[code] ? errorMap[code] : "Login failed");
//       } else {
//         toast.error("Network or server error");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         px: 2,
//         background: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
//       }}
//     >
//       {" "}
//       <Paper
//         component={motion.form}
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleLogin();
//         }}
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         sx={{
//           p: { xs: 3, sm: 5 },
//           width: { xs: "100%", sm: 400 },
//           borderRadius: 3,
//           boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
//           background: "rgba(255,255,255,0.95)",
//           display: "flex",
//           flexDirection: "column",
//           gap: 3,
//         }}
//       >
//         {" "}
//         <Box textAlign="center" mb={1}>
//           {" "}
//           <Box
//             sx={{
//               width: 70,
//               height: 70,
//               margin: "0 auto",
//               borderRadius: "50%",
//               background: "linear-gradient(135deg,#42a5f5,#1e88e5)",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               boxShadow: "0 4px 20px rgba(33,150,243,0.4)",
//             }}
//           >
//             {" "}
//             <LocalHospitalIcon sx={{ fontSize: 36, color: "#fff" }} />{" "}
//           </Box>{" "}
//         </Box>{" "}
//         <Typography
//           variant="h5"
//           align="center"
//           sx={{ fontWeight: 600, color: "#0d47a1" }}
//         >
//           {" "}
//           Hệ thống Quản lý Y tế{" "}
//         </Typography>{" "}
//         <TextField
//           label="Email hoặc Tên đăng nhập"
//           value={identifier}
//           onChange={(e) => setIdentifier(e.target.value)}
//           required
//           fullWidth
//           variant="outlined"
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 {" "}
//                 <PersonIcon color="primary" />{" "}
//               </InputAdornment>
//             ),
//           }}
//         />{" "}
//         <TextField
//           label="Mật khẩu"
//           type={showPassword ? "text" : "password"}
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           fullWidth
//           variant="outlined"
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 {" "}
//                 <LockIcon color="primary" />{" "}
//               </InputAdornment>
//             ),
//             endAdornment: (
//               <InputAdornment position="end">
//                 {" "}
//                 <IconButton
//                   onClick={() => setShowPassword((prev) => !prev)}
//                   edge="end"
//                   size="small"
//                 >
//                   {" "}
//                   {showPassword ? (
//                     <VisibilityOff color="secondary" />
//                   ) : (
//                     <Visibility color="secondary" />
//                   )}{" "}
//                 </IconButton>{" "}
//               </InputAdornment>
//             ),
//           }}
//         />{" "}
//         <Typography
//           onClick={() => setOpenForgot(true)}
//           sx={{
//             color: "#1565c0",
//             cursor: "pointer",
//             textAlign: "center",
//             textDecoration: "underline",
//             fontSize: 14,
//             "&:hover": { color: "#0d47a1" },
//           }}
//         >
//           {" "}
//           Quên mật khẩu?{" "}
//         </Typography>{" "}
//         <ForgotPasswordDialog
//           open={openForgot}
//           onClose={() => setOpenForgot(false)}
//         />{" "}
//         <Button
//           type="submit"
//           variant="contained"
//           disabled={loading}
//           sx={{
//             background: "linear-gradient(135deg, #42a5f5, #1e88e5)",
//             borderRadius: 3,
//             py: 1.5,
//             fontWeight: 600,
//             boxShadow: "0 6px 20px rgba(33,150,243,0.4)",
//             "&:hover": { boxShadow: "0 8px 25px rgba(33,150,243,0.6)" },
//           }}
//         >
//           {" "}
//           {loading ? "Đang đăng nhập..." : "Đăng nhập"}{" "}
//         </Button>{" "}
//       </Paper>{" "}
//     </Box>
//   );
// }

"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { LoginRequest } from "@/types/auth";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import ForgotPasswordDialog from "../forgot_password/ForgotPasswordDialog";
import { motion } from "framer-motion";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function LoginForm() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [openForgot, setOpenForgot] = useState(false);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const errorMap: Record<string, string> = {
    D1: "Your account is not verified",
    D2: "Invalid password",
    D3: "User does not exist.",
    D4: "User already authenticated",
    D5: "Enter wrong otp",
    D6: "User is in the process of authentication",
    D7: "User is not authenticated",
    D8: "You are not logged in",
    D9: "Invalid refresh token",
    F2: "User not found",
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const payload: LoginRequest = identifier.includes("@")
        ? { email: identifier, password }
        : { userName: identifier, password };
      const res = await authService.login(payload);
      if (res.message === "Login successfully") {
        toast.success(res.message);
        router.push("/distributor/manager_batch/approved");
      } else {
        toast.error("Login failed");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const code = err.response.data.message;
        toast.error(code && errorMap[code] ? errorMap[code] : "Login failed");
      } else {
        toast.error("Network or server error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        background: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
      }}
    >
      <Paper
        component={motion.form}
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{
          p: { xs: 3, sm: 5 },
          width: isMobile ? "100%" : 400, // 👈 dùng ở đây
          borderRadius: 3,
          boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
          background: "rgba(255,255,255,0.95)",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box textAlign="center" mb={1}>
          <Box
            sx={{
              width: 70,
              height: 70,
              margin: "0 auto",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#42a5f5,#1e88e5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(33,150,243,0.4)",
            }}
          >
            <LocalHospitalIcon sx={{ fontSize: 36, color: "#fff" }} />
          </Box>
        </Box>

        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: 600, color: "#0d47a1" }}
        >
          Hệ thống Quản lý Y tế
        </Typography>

        <TextField
          label="Email hoặc Tên đăng nhập"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Mật khẩu"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? (
                    <VisibilityOff color="secondary" />
                  ) : (
                    <Visibility color="secondary" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Typography
          onClick={() => setOpenForgot(true)}
          sx={{
            color: "#1565c0",
            cursor: "pointer",
            textAlign: "center",
            textDecoration: "underline",
            fontSize: 14,
            "&:hover": { color: "#0d47a1" },
          }}
        >
          Quên mật khẩu?
        </Typography>

        <ForgotPasswordDialog
          open={openForgot}
          onClose={() => setOpenForgot(false)}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            background: "linear-gradient(135deg, #42a5f5, #1e88e5)",
            borderRadius: 3,
            py: 1.5,
            fontWeight: 600,
            boxShadow: "0 6px 20px rgba(33,150,243,0.4)",
            "&:hover": { boxShadow: "0 8px 25px rgba(33,150,243,0.6)" },
          }}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </Paper>
    </Box>
  );
}
