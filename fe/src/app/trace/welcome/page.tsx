// "use client";

// import { useState } from "react";
// import {
//   Box,
//   Typography,
//   Card,
//   Stack,
//   Button,
//   TextField,
//   Alert,
//   CircularProgress,
//   Stepper,
//   Step,
//   StepLabel,
// } from "@mui/material";
// import { CompanyV6 } from "@/types/company";

// const API_BASE = process.env.NEXT_PUBLIC_BE_API_BASE || "";

// const roles = [
//   {
//     roleIds: ["68cbb698458c69dd7d43dbbe"],
//     name: "Manufacturer",
    
//     loginUrl: "http://192.168.157.1:3001/",
//   },
//   {
//     roleIds: ["68e63ceb557a2b54666ba3d5"],
//     name: "Hospital",
    
//     loginUrl: "http://192.168.1.160:3000/en/auth/login",
//   },
// ];

// export default function RegisterStepper() {
//   const [activeStep, setActiveStep] = useState(0);
//   const [selectedRole, setSelectedRole] = useState<number | null>(null);
//   const [companies, setCompanies] = useState<{ id: string; name: string }[]>(
//     []
//   );
//   const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
//   const [form, setForm] = useState({
//     userName: "",
//     email: "",
//     phone: "",
//     password: "",
//     dob: "",
//   });
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const steps = [
//     "Chọn vai trò",
//     "Chọn công ty",
//     "Điền thông tin",
//     "Xác thực OTP",
//     "Hoàn tất",
//   ];

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   // Step 0 → 1: Chọn role, lấy danh sách company
//   const handleNextFromRole = async () => {
//     if (selectedRole === null) {
//       setError("Vui lòng chọn vai trò");
//       return;
//     }

//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch(`${API_BASE}/api/company/get-all`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//       });
//       const data = await res.json();

//       if (!res.ok)
//         throw new Error(data.message || "Lấy danh sách company thất bại");

//       // Lọc company status 'approved'
//       const companies = (data as CompanyV6[]) || [];
//       const validCompanies = companies.filter((c) => c.status === "active");

//       setCompanies(
//         validCompanies.map((c) => ({ id: c.id.toString(), name: c.name }))
//       );

//       setActiveStep(1);
//     } catch (err) {
//       if (err instanceof Error) setError(err.message);
//       else setError(String(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRegister = async () => {
//     if (selectedRole === null || !selectedCompany) {
//       setError("Vui lòng chọn vai trò và công ty");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch(`${API_BASE}/api/authentication/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...form,
//           roleIds: roles[selectedRole].roleIds,
//           companyId: selectedCompany,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Đăng ký thất bại");

//       setSuccess("Đăng ký thành công! Vui lòng nhập OTP.");
//       setActiveStep(3);
//     } catch (err) {
//       if (err instanceof Error) setError(err.message);
//       else setError(String(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch(`${API_BASE}/api/authentication/verify-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: form.email, otp, type: "register" }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Xác thực thất bại");
//       setSuccess("Xác thực thành công!");
//       setActiveStep(4);
//     } catch (err) {
//       if (err instanceof Error) setError(err.message);
//       else setError(String(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendOtp = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch(`${API_BASE}/api/authentication/resend-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: form.email }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Gửi lại OTP thất bại");
//       setSuccess("OTP đã được gửi lại");
//     } catch (err) {
//       if (err instanceof Error) setError(err.message);
//       else setError(String(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStopVerify = () => {
//     setActiveStep(0);
//     setSelectedRole(null);
//     setSelectedCompany(null);
//     setForm({ userName: "", email: "", phone: "", password: "", dob: "" });
//     setOtp("");
//     setSuccess("Đã dừng xác thực");
//   };

//   return (
//     <Box sx={{ p: 4, maxWidth: 500, mx: "auto" }}>
//       <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
//         Đăng ký tài khoản
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}
//       {success && (
//         <Alert severity="success" sx={{ mb: 2 }}>
//           {success}
//         </Alert>
//       )}

//       <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
//         {steps.map((label) => (
//           <Step key={label}>
//             <StepLabel>{label}</StepLabel>
//           </Step>
//         ))}
//       </Stepper>

//       {/* Step 0: Chọn Role */}
//       {activeStep === 0 && (
//         <Stack spacing={2}>
//           <Typography>Chọn vai trò:</Typography>
//           <Stack direction="row" spacing={2}>
//             {roles.map((r, idx) => (
//               <Card
//                 key={r.name}
//                 variant={selectedRole === idx ? "elevation" : "outlined"}
//                 sx={{
//                   cursor: "pointer",
//                   p: 2,
//                   borderColor: selectedRole === idx ? "primary.main" : "#ddd",
//                 }}
//                 onClick={() => setSelectedRole(idx)}
//               >
//                 <Typography>{r.name}</Typography>
//               </Card>
//             ))}
//           </Stack>
//           <Button
//             variant="contained"
//             onClick={handleNextFromRole}
//             disabled={selectedRole === null || loading}
//           >
//             {loading ? <CircularProgress size={24} /> : "Tiếp tục"}
//           </Button>
//         </Stack>
//       )}

//       {/* Step 1: Chọn Company */}
//       {activeStep === 1 && (
//         <Stack spacing={2}>
//           <Typography>Chọn công ty:</Typography>
//           <Stack direction="column" spacing={1}>
//             {companies.map((c) => (
//               <Card
//                 key={c.id}
//                 variant={selectedCompany === c.id ? "elevation" : "outlined"}
//                 sx={{
//                   cursor: "pointer",
//                   p: 2,
//                   borderColor:
//                     selectedCompany === c.id ? "primary.main" : "#ddd",
//                 }}
//                 onClick={() => setSelectedCompany(c.id)}
//               >
//                 <Typography>{c.name}</Typography>
//               </Card>
//             ))}
//           </Stack>
//           <Stack direction="row" spacing={2}>
//             <Button
//               variant="contained"
//               disabled={!selectedCompany}
//               onClick={() => setActiveStep(2)}
//             >
//               Tiếp tục
//             </Button>
//             <Button
//               variant="text"
//               color="error"
//               onClick={() => setActiveStep(0)}
//             >
//               Quay lại
//             </Button>
//           </Stack>
//         </Stack>
//       )}

//       {/* Step 2: Điền thông tin */}
//       {activeStep === 2 && (
//         <Stack spacing={2}>
//           <TextField
//             label="User Name"
//             name="userName"
//             value={form.userName}
//             onChange={handleInputChange}
//             fullWidth
//           />
//           <TextField
//             label="Email"
//             name="email"
//             type="email"
//             value={form.email}
//             onChange={handleInputChange}
//             fullWidth
//           />
//           <TextField
//             label="Phone"
//             name="phone"
//             value={form.phone}
//             onChange={handleInputChange}
//             fullWidth
//           />
//           <TextField
//             label="Password"
//             name="password"
//             type="password"
//             value={form.password}
//             onChange={handleInputChange}
//             fullWidth
//           />
//           <TextField
//             label="Ngày sinh"
//             name="dob"
//             type="date"
//             value={form.dob}
//             onChange={handleInputChange}
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//           />
//           <Stack direction="row" spacing={2}>
//             <Button
//               variant="contained"
//               onClick={handleRegister}
//               disabled={loading}
//             >
//               {loading ? <CircularProgress size={24} /> : "Đăng ký"}
//             </Button>
//             <Button
//               variant="text"
//               color="error"
//               onClick={() => setActiveStep(1)}
//               disabled={loading}
//             >
//               Quay lại
//             </Button>
//           </Stack>
//         </Stack>
//       )}

//       {/* Step 3: Xác thực OTP */}
//       {activeStep === 3 && (
//         <Stack spacing={2}>
//           <TextField
//             label="Nhập OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             fullWidth
//           />
//           <Button
//             variant="contained"
//             onClick={handleVerifyOtp}
//             disabled={loading}
//           >
//             {loading ? <CircularProgress size={24} /> : "Xác thực OTP"}
//           </Button>
//           <Stack direction="row" spacing={2}>
//             <Button
//               variant="outlined"
//               onClick={handleResendOtp}
//               disabled={loading}
//             >
//               Gửi lại OTP
//             </Button>
//             <Button
//               variant="text"
//               color="error"
//               onClick={handleStopVerify}
//               disabled={loading}
//             >
//               Dừng xác thực
//             </Button>
//           </Stack>
//         </Stack>
//       )}

//       {/* Step 4: Hoàn tất */}
//       {activeStep === 4 && selectedRole !== null && (
//         <Box textAlign="center">
//           <Alert severity="success" sx={{ mb: 2 }}>
//             Xác thực thành công!
//           </Alert>
//           <Button
//             variant="contained"
//             color="primary"
//             href={roles[selectedRole].loginUrl}
//           >
//             Đi đến trang đăng nhập
//           </Button>
//         </Box>
//       )}
//     </Box>
//   );
// }

"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Stack,
  Button,
  TextField,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";

export default function RegisterStepperMock() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [form, setForm] = useState({
    userName: "",
    email: "",
    phone: "",
    password: "",
    dob: "",
  });
  const [otp, setOtp] = useState("");

  const steps = [
    "Chọn loại",
    "Chọn công ty",
    "Chọn role",
    "Điền thông tin",
    "Xác thực OTP",
    "Hoàn tất",
  ];

  const types = [
    { name: "Manufacturer", loginUrl: "http://192.168.157.1:3001/" },
    { name: "Hospital", loginUrl: "http://192.168.1.160:3000/en/auth/login" },
  ];

  // Mock companies theo type
  const allCompanies = [
    { id: 1, name: "ABC Pharma", type: 0 },
    { id: 2, name: "Global Pharma", type: 0 },
    { id: 3, name: "City Hospital", type: 1 },
    { id: 4, name: "Central Hospital", type: 1 },
  ];

  const mockRoles = [
    { id: 1, name: "Admin", companyId: 1 },
    { id: 2, name: "Manager", companyId: 1 },
    { id: 3, name: "Doctor", companyId: 3 },
    { id: 4, name: "Nurse", companyId: 3 },
  ];

  const filteredCompanies =
    selectedType !== null
      ? allCompanies.filter((c) => c.type === selectedType)
      : [];

  const filteredRoles =
    selectedCompany !== null
      ? mockRoles.filter((r) => r.companyId === selectedCompany)
      : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Box sx={{ p: 4, maxWidth: 500, mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
        Đăng ký tài khoản 
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step 0: Chọn loại */}
      {activeStep === 0 && (
        <Stack spacing={2}>
          <Typography>Chọn loại:</Typography>
          <Stack direction="row" spacing={2}>
            {types.map((t, idx) => (
              <Card
                key={t.name}
                variant={selectedType === idx ? "elevation" : "outlined"}
                sx={{
                  cursor: "pointer",
                  p: 2,
                  borderColor: selectedType === idx ? "primary.main" : "#ddd",
                }}
                onClick={() => setSelectedType(idx)}
              >
                <Typography>{t.name}</Typography>
              </Card>
            ))}
          </Stack>
        </Stack>
      )}

      {/* Step 1: Chọn công ty */}
      {activeStep === 1 && (
        <Stack spacing={2}>
          <Typography>Chọn công ty:</Typography>
          <Stack direction="column" spacing={1}>
            {filteredCompanies.map((c) => (
              <Card
                key={c.id}
                variant={selectedCompany === c.id ? "elevation" : "outlined"}
                sx={{
                  cursor: "pointer",
                  p: 2,
                  borderColor: selectedCompany === c.id ? "primary.main" : "#ddd",
                }}
                onClick={() => setSelectedCompany(c.id)}
              >
                <Typography>{c.name}</Typography>
              </Card>
            ))}
          </Stack>
        </Stack>
      )}

      {/* Step 2: Chọn role */}
      {activeStep === 2 && (
        <Stack spacing={2}>
          <Typography>Chọn role:</Typography>
          <Stack direction="column" spacing={1}>
            {filteredRoles.map((r) => (
              <Card
                key={r.id}
                variant={selectedRole === r.id ? "elevation" : "outlined"}
                sx={{
                  cursor: "pointer",
                  p: 2,
                  borderColor: selectedRole === r.id ? "primary.main" : "#ddd",
                }}
                onClick={() => setSelectedRole(r.id)}
              >
                <Typography>{r.name}</Typography>
              </Card>
            ))}
          </Stack>
        </Stack>
      )}

      {/* Step 3: Điền thông tin */}
      {activeStep === 3 && (
        <Stack spacing={2}>
          <TextField
            label="User Name"
            name="userName"
            value={form.userName}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Ngày sinh"
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      )}

      {/* Step 4: OTP */}
      {activeStep === 4 && (
        <Stack spacing={2}>
          <TextField
            label="Nhập OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
          />
          <Alert severity="info">Bước xác thực OTP (Mock)</Alert>
        </Stack>
      )}

      {/* Step 5: Hoàn tất */}
      {activeStep === 5 && selectedType !== null && (
        <Box textAlign="center">
          <Alert severity="success" sx={{ mb: 2 }}>
            Xác thực thành công! (Mock)
          </Alert>
          <Button
            variant="contained"
            color="primary"
            href={types[selectedType].loginUrl}
          >
            Đi đến trang đăng nhập
          </Button>
        </Box>
      )}

      {/* Free navigation */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="outlined"
          sx={{ mr: 2 }}
          onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
        >
          Back
        </Button>
        <Button
          variant="outlined"
          onClick={() =>
            setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))
          }
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}

