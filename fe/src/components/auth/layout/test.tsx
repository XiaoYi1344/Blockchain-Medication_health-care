// // "use client";

// // import React, { useMemo, useState } from "react";
// // import {
// //   CssBaseline,
// //   ThemeProvider,
// //   createTheme,
// //   useMediaQuery,
// //   AppBar,
// //   Toolbar,
// //   IconButton,
// //   Box,
// //   InputBase,
// //   Badge,
// //   Avatar,
// //   Menu,
// //   MenuItem,
// //   Drawer,
// //   List,
// //   ListItemButton,
// //   ListItemIcon,
// //   ListItemText,
// //   Collapse,
// //   Divider,
// //   Typography,
// //   Paper,
// //   Tooltip,
// //   Button,
// // } from "@mui/material";
// // import { motion, AnimatePresence } from "framer-motion";
// // import {
// //   Menu as MenuIcon,
// //   Search,
// //   Bell,
// //   ShoppingBag,
// //   Package,
// //   Truck,
// //   Layers,
// //   ClipboardList,
// //   ChevronRight,
// //   ChevronDown,
// //   Sun,
// //   Moon,
// // } from "lucide-react";

// // // -------------------------- Theme factory --------------------------
// // function makeTheme(mode: "light" | "dark") {
// //   return createTheme({
// //     palette: {
// //       mode,
// //       primary: { main: mode === "light" ? "#0b7a6b" : "#58e6c3" },
// //       secondary: { main: mode === "light" ? "#1976d2" : "#90cdf4" },
// //       background: {
// //         default: mode === "light" ? "#f6fbfb" : "#06121a",
// //         paper: mode === "light" ? "#ffffff" : "#071821",
// //       },
// //       success: { main: "#5cc1a6" },
// //       info: { main: "#79d2ff" },
// //     },
// //     shape: { borderRadius: 12 },
// //     typography: {
// //       fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial',
// //       button: { textTransform: "none", fontWeight: 600 },
// //       h6: { fontWeight: 700 },
// //     },
// //     components: {
// //       MuiAppBar: { defaultProps: { elevation: 0 } },
// //       MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } },
// //       MuiListItemButton: { styleOverrides: { root: { borderRadius: 10 } } },
// //     },
// //   });
// // }

// // // -------------------------- Navbar --------------------------
// // interface NavbarProps {
// //   onMenuClick: () => void;
// //   onToggleTheme: () => void;
// //   darkMode: boolean;
// // }

// // function Navbar({ onMenuClick, onToggleTheme, darkMode }: NavbarProps) {
// //   const [anchorNotif, setAnchorNotif] = useState<null | HTMLElement>(null);
// //   const [anchorUser, setAnchorUser] = useState<null | HTMLElement>(null);

// //   return (
// //     <AppBar
// //       color="transparent"
// //       sx={{
// //         backdropFilter: "saturate(120%) blur(6px)",
// //         borderBottom: (t) => `1px solid ${t.palette.divider}`,
// //         background: darkMode
// //           ? "linear-gradient(90deg, rgba(3,10,14,0.6), rgba(8,15,22,0.6))"
// //           : "linear-gradient(90deg, rgba(232,249,240,0.9), rgba(197,241,255,0.7))",
// //       }}
// //     >
// //       <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
// //         {/* Left: Logo */}
// //         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
// //           <IconButton onClick={onMenuClick} aria-label="open sidebar">
// //             <MenuIcon />
// //           </IconButton>

// //           <motion.div
// //             initial={{ opacity: 0, x: -10 }}
// //             animate={{ opacity: 1, x: 0 }}
// //             transition={{ duration: 0.32 }}
// //           >
// //             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
// //               <Box
// //                 sx={{
// //                   width: 40,
// //                   height: 40,
// //                   borderRadius: 2,
// //                   display: "flex",
// //                   alignItems: "center",
// //                   justifyContent: "center",
// //                   bgcolor: (t) => t.palette.primary.main,
// //                   color: "white",
// //                 }}
// //               >
// //                 MD
// //               </Box>
// //               <Typography variant="h6">MedixCare Admin</Typography>
// //             </Box>
// //           </motion.div>
// //         </Box>

// //         {/* Center: Search */}
// //         <Box
// //           sx={{
// //             flex: 1,
// //             display: "flex",
// //             justifyContent: "center",
// //             px: 2,
// //           }}
// //         >
// //           <Paper
// //             component="form"
// //             elevation={0}
// //             sx={{
// //               display: "flex",
// //               alignItems: "center",
// //               width: { xs: "100%", md: "60%" },
// //               maxWidth: 720,
// //               p: "6px 12px",
// //               borderRadius: 8,
// //             }}
// //           >
// //             <Search size={16} />
// //             <InputBase
// //               placeholder="Tìm thuốc, lô, đơn hàng hoặc nhà cung cấp..."
// //               sx={{ ml: 1, flex: 1 }}
// //               inputProps={{ "aria-label": "search" }}
// //             />
// //             <Button size="small" sx={{ ml: 1 }} variant="contained">
// //               Tìm
// //             </Button>
// //           </Paper>
// //         </Box>

// //         {/* Right: Actions */}
// //         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
// //           <Tooltip title={darkMode ? "Chuyển sáng" : "Chuyển tối"}>
// //             <IconButton onClick={onToggleTheme} aria-label="toggle theme">
// //               {darkMode ? <Sun size={18} /> : <Moon size={18} />}
// //             </IconButton>
// //           </Tooltip>

// //           <IconButton
// //             aria-label="notifications"
// //             onClick={(e) => setAnchorNotif(e.currentTarget)}
// //           >
// //             <Badge badgeContent={4} color="error">
// //               <Bell />
// //             </Badge>
// //           </IconButton>
// //           <Menu
// //             anchorEl={anchorNotif}
// //             open={Boolean(anchorNotif)}
// //             onClose={() => setAnchorNotif(null)}
// //             PaperProps={{ sx: { width: 320, borderRadius: 2 } }}
// //           >
// //             <MenuItem>🟢 Đơn hàng #145 đang giao</MenuItem>
// //             <MenuItem>🟠 Thuốc &quot;Paracetamol&quot; chờ duyệt</MenuItem>
// //             <MenuItem>🔵 Tồn kho &quot;Vitamin C&quot; dưới ngưỡng</MenuItem>
// //           </Menu>

// //           <IconButton aria-label="orders">
// //             <Badge badgeContent={2} color="primary">
// //               <ShoppingBag />
// //             </Badge>
// //           </IconButton>

// //           <IconButton
// //             onClick={(e) => setAnchorUser(e.currentTarget)}
// //             aria-label="account"
// //           >
// //             <Avatar sx={{ bgcolor: (t) => t.palette.success.main }}>U</Avatar>
// //           </IconButton>
// //           <Menu
// //             anchorEl={anchorUser}
// //             open={Boolean(anchorUser)}
// //             onClose={() => setAnchorUser(null)}
// //             PaperProps={{ sx: { width: 200 } }}
// //           >
// //             <MenuItem>Hồ sơ</MenuItem>
// //             <MenuItem>Cài đặt</MenuItem>
// //             <MenuItem>Đăng xuất</MenuItem>
// //           </Menu>
// //         </Box>
// //       </Toolbar>
// //     </AppBar>
// //   );
// // }

// // // -------------------------- Sidebar --------------------------
// // interface SidebarProps {
// //   open: boolean;
// //   variant: "temporary" | "persistent";
// //   onClose: () => void;
// // }

// // function Sidebar({ open, variant, onClose }: SidebarProps) {
// //   const [openDrugs, setOpenDrugs] = useState(true);
// //   const [openShip, setOpenShip] = useState(false);

// //   return (
// //     <Drawer open={open} onClose={onClose} variant={variant} PaperProps={{ sx: { width: 260 } }}>
// //       <Box sx={{ width: 260, p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
// //         <Box sx={{ mb: 1 }}>
// //           <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
// //             Bảng điều khiển
// //           </Typography>
// //           <Typography variant="caption" color="text.secondary">
// //             Quản lý thuốc & đơn hàng
// //           </Typography>
// //         </Box>

// //         <Divider sx={{ my: 1 }} />

// //         <List sx={{ flex: 1 }}>
// //           <ListItemButton onClick={() => setOpenDrugs(!openDrugs)}>
// //             <ListItemIcon>
// //               <Package />
// //             </ListItemIcon>
// //             <ListItemText primary="Danh mục & Thuốc" />
// //             {openDrugs ? <ChevronDown /> : <ChevronRight />}
// //           </ListItemButton>
// //           <Collapse in={openDrugs} timeout="auto" unmountOnExit>
// //             <List component="div" disablePadding>
// //               <ListItemButton sx={{ pl: 6 }} onClick={() => setOpenThuocChild(!openThuocChild)}>
// //   <ListItemText primary="Thuốc" />
// //   {openThuocChild ? <ChevronDown /> : <ChevronRight />}
// // </ListItemButton>
// // <Collapse in={openThuocChild}>
// //   <List disablePadding sx={{ pl: 8 }}>
// //     <ListItemButton><ListItemText primary="Chờ duyệt" /></ListItemButton>
// //     <ListItemButton><ListItemText primary="Đã duyệt" /></ListItemButton>
// //   </List>
// // </Collapse>


// //               <ListItemButton sx={{ pl: 6 }} onClick={() => setOpenThuocChild(!openThuocChild)}>
// //   <ListItemText primary="Danh mục" />
// //   {openThuocChild ? <ChevronDown /> : <ChevronRight />}
// // </ListItemButton>
// // <Collapse in={openThuocChild}>
// //   <List disablePadding sx={{ pl: 8 }}>
// //     <ListItemButton><ListItemText primary="Chờ duyệt" /></ListItemButton>
// //     <ListItemButton><ListItemText primary="Đã duyệt" /></ListItemButton>
// //   </List>
// // </Collapse>

// //             </List>
// //           </Collapse>

// //           <ListItemButton>
// //             <ListItemIcon>
// //               <Layers />
// //             </ListItemIcon>
// //             <ListItemText primary="Lô" />
// //           </ListItemButton>

// //           <ListItemButton>
// //             <ListItemIcon>
// //               <ClipboardList />
// //             </ListItemIcon>
// //             <ListItemText primary="Tồn kho" />
// //           </ListItemButton>

// //           <ListItemButton onClick={() => setOpenShip(!openShip)}>
// //             <ListItemIcon>
// //               <Truck />
// //             </ListItemIcon>
// //             <ListItemText primary="Vận chuyển" />
// //             {openShip ? <ChevronDown /> : <ChevronRight />}
// //           </ListItemButton>
// //           <Collapse in={openShip} timeout="auto" unmountOnExit>
// //             <List component="div" disablePadding sx={{ pl: 4 }}>
// //               <ListItemButton>
// //                 <ListItemText primary="Chuyến đi" />
// //               </ListItemButton>
// //               <ListItemButton>
// //                 <ListItemText primary="Người mua" />
// //               </ListItemButton>
// //             </List>
// //           </Collapse>

// //           <ListItemButton>
// //             <ListItemIcon>
// //               <Package />
// //             </ListItemIcon>
// //             <ListItemText primary="Đơn hàng" />
// //           </ListItemButton>

// //           <ListItemButton>
// //             <ListItemIcon>
// //               <Bell />
// //             </ListItemIcon>
// //             <ListItemText primary="Thông báo" />
// //           </ListItemButton>
// //         </List>

// //         <Divider sx={{ my: 1 }} />
// //         <Box sx={{ mt: "auto" }}>
// //           <Typography variant="caption">Phiên bản</Typography>
// //           <Typography variant="body2">MedixCare v1.0</Typography>
// //         </Box>
// //       </Box>
// //     </Drawer>
// //   );
// // }

// // // -------------------------- MainLayout --------------------------
// // interface MainLayoutProps {
// //   children?: React.ReactNode;
// // }

// // export default function MainLayout({ children }: MainLayoutProps) {
// //   const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
// //   const [darkMode, setDarkMode] = useState(prefersDark);
// //   const [sidebarOpen, setSidebarOpen] = useState(true);
// //   const mdUp = useMediaQuery("(min-width:900px)");

// //   const theme = useMemo(() => makeTheme(darkMode ? "dark" : "light"), [darkMode]);

// //   React.useEffect(() => {
// //     setSidebarOpen(mdUp);
// //   }, [mdUp]);

// //   return (
// //     <ThemeProvider theme={theme}>
// //       <CssBaseline />
// //       <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
// //         <Navbar
// //           onMenuClick={() => setSidebarOpen((s) => !s)}
// //           onToggleTheme={() => setDarkMode((d) => !d)}
// //           darkMode={darkMode}
// //         />

// //         <Sidebar
// //           open={sidebarOpen}
// //           onClose={() => setSidebarOpen(false)}
// //           variant={mdUp ? "persistent" : "temporary"}
// //         />

// //         <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
// //           <AnimatePresence>
// //             <motion.div
// //               key={darkMode ? "dark" : "light"}
// //               initial={{ opacity: 0, y: 8 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               exit={{ opacity: 0 }}
// //               transition={{ duration: 0.28 }}
// //             >
// //               <Box sx={{ mb: 2 }}>
// //                 <Typography variant="h5" sx={{ fontWeight: 700 }}>
// //                   Xin chào, quản trị viên
// //                 </Typography>
// //                 <Typography variant="body2" color="text.secondary">
// //                   Tổng quan hệ thống và các thông báo nhanh
// //                 </Typography>
// //               </Box>

// //               <Box>{children ?? <DemoCards />}</Box>
// //             </motion.div>
// //           </AnimatePresence>
// //         </Box>
// //       </Box>
// //     </ThemeProvider>
// //   );
// // }

// // // -------------------------- Demo cards --------------------------
// // function DemoCards() {
// //   return (
// //     <Box
// //       sx={{
// //         display: "grid",
// //         gap: 2,
// //         gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
// //       }}
// //     >
// //       {[
// //         { title: "Đơn hàng hôm nay", value: 128 },
// //         { title: "Tồn kho cảnh báo", value: 12 },
// //         { title: "Thuốc chờ duyệt", value: 7 },
// //       ].map((item) => (
// //         <motion.div key={item.title} whileHover={{ y: -6 }} style={{ borderRadius: 12 }}>
// //           <Paper sx={{ p: 2 }}>
// //             <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
// //               {item.title}
// //             </Typography>
// //             <Typography variant="h4">{item.value}</Typography>
// //           </Paper>
// //         </motion.div>
// //       ))}
// //     </Box>
// //   );
// // }


// // "use client";

// // import React, { useMemo, useState } from "react";
// // import {
// //   Box,
// //   CssBaseline,
// //   ThemeProvider,
// //   useMediaQuery,
// //   Typography,
// // } from "@mui/material";
// // import { AnimatePresence, motion } from "framer-motion";
// // import { makeMedicalTheme as medicalTheme } from "../../theme/medicalTheme";
// // import Navbar from "./navbar/navbar";
// // import Sidebar from "./sidebar/sidebar";

// // interface MainLayoutProps {
// //   children?: React.ReactNode;
// // }

// // export default function MainLayout({ children }: MainLayoutProps) {
// //   const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
// //   const [darkMode, setDarkMode] = useState(prefersDark);
// //   const [mobileOpen, setMobileOpen] = useState(false);

// //   const theme = useMemo(
// //     () => medicalTheme(darkMode ? "dark" : "light"),
// //     [darkMode]
// //   );

// //   return (
// //     <ThemeProvider theme={theme}>
// //       <CssBaseline />

// //       <Box
// //         sx={{
// //           display: "flex",
// //           bgcolor: "background.default",
// //           minHeight: "100vh",
// //           color: "text.primary",
// //           transition: "background-color 0.3s",
// //         }}
// //       >
// //         {/* Navbar */}
// //         {/* <Navbar
// //           onMenuClick={() => setMobileOpen(true)}
// //           darkMode={darkMode}
// //           onToggleTheme={() => setDarkMode((m) => !m)}
// //         /> */}
// //         <Navbar
// //   onToggleSidebar={() => setMobileOpen(true)}
// //   mode={darkMode ? "dark" : "light"}
// //   onToggleMode={() => setDarkMode((m) => !m)}
// // />


// //         {/* Sidebar */}
// //         <Sidebar openMobile={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

// //         {/* Main Content */}
// //         <Box
// //           component="main"
// //           sx={{
// //             flexGrow: 1,
// //             p: { xs: 2, md: 3 },
// //             mt: 10,
// //             ml: { md: "80px" }, // giữ khoảng khi sidebar thu gọn
// //             transition: "margin-left 0.3s ease",
// //           }}
// //         >
// //           <AnimatePresence mode="wait">
// //             <motion.div
// //               key={darkMode ? "dark" : "light"}
// //               initial={{ opacity: 0, y: 10 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               exit={{ opacity: 0, y: -10 }}
// //               transition={{ duration: 0.4 }}
// //             >
// //               <Box sx={{ mb: 3 }}>
// //                 <Typography variant="h5" fontWeight={700}>
// //                   Xin chào, quản trị viên 👩‍⚕️
// //                 </Typography>
// //                 <Typography variant="body2" color="text.secondary">
// //                   Tổng quan hệ thống và thông báo nhanh
// //                 </Typography>
// //               </Box>

// //               {children ?? <DemoDashboard />}
// //             </motion.div>
// //           </AnimatePresence>
// //         </Box>

// //         <Footer />
// //       </Box>
// //     </ThemeProvider>
// //   );
// // }

// // // Demo dashboard cards
// // import { Paper, Grid } from "@mui/material";
// // import Footer from "./footer/footer";

// // function DemoDashboard() {
// //   const cards = [
// //     { label: "Đơn hàng hôm nay", value: 128 },
// //     { label: "Tồn kho cảnh báo", value: 12 },
// //     { label: "Thuốc chờ duyệt", value: 7 },
// //   ];
// //   return (
// //     <Grid container spacing={2}>
// //       {cards.map((card) => (
// //         <Grid size={{ xs: 12, md: 4 }} key={card.label}>
// //           <motion.div whileHover={{ y: -6 }}>
// //             <Paper
// //               sx={{
// //                 p: 2,
// //                 borderRadius: 3,
// //                 textAlign: "center",
// //                 boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
// //                 transition: "all 0.3s ease",
// //               }}
// //             >
// //               <Typography variant="subtitle1" fontWeight={700}>
// //                 {card.label}
// //               </Typography>
// //               <Typography variant="h4" color="primary" fontWeight={700}>
// //                 {card.value}
// //               </Typography>
// //             </Paper>
// //           </motion.div>
// //         </Grid>
// //       ))}
// //     </Grid>
// //   );
// // }


// "use client";

// import React, { useMemo, useState } from "react";
// import {
//   Box,
//   CssBaseline,
//   ThemeProvider,
//   useMediaQuery,
//   Typography,
//   Paper,
//   Grid,
// } from "@mui/material";
// import { AnimatePresence, motion } from "framer-motion";
// import { makeMedicalTheme as medicalTheme } from "../../theme/medicalTheme";
// import Navbar from "./navbar/navbar";
// import Sidebar from "./sidebar/sidebar";
// import Footer from "./footer/footer";

// interface MainLayoutProps {
//   children?: React.ReactNode;
// }

// export default function MainLayout({ children }: MainLayoutProps) {
//   const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
//   const [darkMode, setDarkMode] = useState(prefersDark);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const theme = useMemo(
//     () => medicalTheme(darkMode ? "dark" : "light"),
//     [darkMode]
//   );

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />

//       <Box
//         sx={{
//           display: "flex",
//           bgcolor: "background.default",
//           minHeight: "100vh",
//           color: "text.primary",
//           transition: "background-color 0.3s",
//         }}
//       >
//         {/* Navbar */}
//         <Navbar
//           onToggleSidebar={() => setMobileOpen(true)}
//           mode={darkMode ? "dark" : "light"}
//           onToggleMode={() => setDarkMode((m) => !m)}
//         />

//         {/* Sidebar */}
//         <Sidebar
//           openMobile={mobileOpen}
//           onCloseMobile={() => setMobileOpen(false)}
//         />

//         {/* ✅ Main content area */}
//         <Box
//           component="main"
//           sx={{
//             flexGrow: 1,
//             p: { xs: 2, md: 3 },
//             mt: 10,
//             ml: { md: "80px" }, // giữ khoảng khi sidebar thu gọn
//             transition: "margin-left 0.3s ease",
//             display: "flex",
//             flexDirection: "column",
//             minHeight: "100vh", // đảm bảo footer luôn ở dưới
//           }}
//         >
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={darkMode ? "dark" : "light"}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               transition={{ duration: 0.4 }}
//             >
//               <Box sx={{ mb: 3 }}>
//                 <Typography variant="h5" fontWeight={700}>
//                   Xin chào, quản trị viên 👩‍⚕️
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Tổng quan hệ thống và thông báo nhanh
//                 </Typography>
//               </Box>

//               {/* Nội dung chính hoặc demo */}
//               <Box sx={{ flexGrow: 1 }}>
//                 {children ?? <DemoDashboard />}
//               </Box>
//             </motion.div>
//           </AnimatePresence>

//           {/* ✅ Footer nằm trong main, ở cuối trang */}
//           <Footer />
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// }

// // -------------------------- Demo Dashboard --------------------------
// function DemoDashboard() {
//   const cards = [
//     { label: "Đơn hàng hôm nay", value: 128 },
//     { label: "Tồn kho cảnh báo", value: 12 },
//     { label: "Thuốc chờ duyệt", value: 7 },
//   ];

//   return (
//     <Grid container spacing={2}>
//       {cards.map((card) => (
//         <Grid size={{ xs: 12, md: 4 }} key={card.label}>
//           <motion.div whileHover={{ y: -6 }}>
//             <Paper
//               sx={{
//                 p: 2,
//                 borderRadius: 3,
//                 textAlign: "center",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//                 transition: "all 0.3s ease",
//               }}
//             >
//               <Typography variant="subtitle1" fontWeight={700}>
//                 {card.label}
//               </Typography>
//               <Typography variant="h4" color="primary" fontWeight={700}>
//                 {card.value}
//               </Typography>
//             </Paper>
//           </motion.div>
//         </Grid>
//       ))}
//     </Grid>
//   );
// }
