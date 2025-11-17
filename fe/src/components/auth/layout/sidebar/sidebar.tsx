// "use client";

// import {
//   Box,
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
//   Tooltip,
//   useTheme,
// } from "@mui/material";
// import {
//   Healing,
//   Category,
//   ExpandLess,
//   ExpandMore,
//   LocalShipping,
//   Business,
//   DirectionsBus,
//   Person,
//   Inventory,
//   Assignment,
//   Inventory2,
//   Group,
// } from "@mui/icons-material";
// import { motion, AnimatePresence } from "framer-motion";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { usePathname, useSearchParams } from "next/navigation";
// import Cookies from "js-cookie";

// interface SidebarProps {
//   openMobile?: boolean;
//   onCloseMobile?: () => void;
// }

// export default function Sidebar({ openMobile, onCloseMobile }: SidebarProps) {
//   const theme = useTheme();
//   const pathname = usePathname() ?? "";
//   const searchParams = useSearchParams();
//   const currentStatus = searchParams?.get("status");

//   const [hovered, setHovered] = useState(false);
//   const [openMedicine, setOpenMedicine] = useState(false);
//   const [openCategory, setOpenCategory] = useState(false);
//   const [openShipping, setOpenShipping] = useState(false);
//   const [openBatch, setOpenBatch] = useState(false);
//   const [roleName, setRoleName] = useState<string | null>(null);

//   useEffect(() => {
//     setRoleName(Cookies.get("roleName") || null);
//   }, []);

//   const sidebarWidth = hovered ? 260 : 78;

//   // ============================
//   // 🔹 Sub links có query
//   // ============================
//   const medicineSubLinks = [
//     { label: "Bản nháp", href: "/distributor/manager_drug/local" },
//     { label: "Chờ duyệt", href: "/distributor/manager_drug/draft" },
//     { label: "Đã duyệt", href: "/distributor/manager_drug/approved" },
//   ];

//   const categorySubLinks = [
//     { label: "Chờ duyệt", href: "/distributor/manager_category/draft" },
//     {
//       label: "Đã duyệt",
//       href: "/distributor/manager_category/approved",
//     },
//   ];

//   const locativeSubLinks = [
//     {
//       label: "Chuyến đi",
//       href: "/distributor/manager_shipment",
//       icon: <DirectionsBus />,
//     },
//     {
//       label: "Người mua",
//       href: "/distributor/manager_buyer",
//       icon: <Person />,
//     },
//   ];

//   const batchSubLinks = [
//     { label: "Đã duyệt", href: "/distributor/manager_batch/approved" },
//     { label: "Chờ duyệt", href: "/distributor/manager_batch/draft" },
//   ];
//   // ============================
//   // 🔹 Link chính
//   // ============================
//   const mainLinks = [
//     // {
//     //   label: "Lô",
//     //   href: "/distributor/manager_batch",
//     //   icon: <Inventory2 />,
//     //   color: "#43a047",
//     // },
//     {
//       label: "Tồn kho",
//       href: "/distributor/inventory",
//       icon: <Inventory />,
//       color: "#00bcd4",
//     },
//     {
//       label: "Đơn hàng",
//       href: "/distributor/orders",
//       icon: <Assignment />,
//       color: "#26a69a",
//     },
//     {
//       label: "Công ty",
//       href: "/distributor/manager_company",
//       icon: <Business />,
//       color: "#26a69a",
//     },
//     //   { label: "Thông báo", href: "/distributor/notifications", icon: <Notifications />, color: "#ffa726" },
//   ];

//   if (roleName === "manufacturer") {
//     mainLinks.push({
//       label: "Nhân viên",
//       href: "/distributor/manager_employee",
//       icon: <Group />,
//       color: "#7e57c2",
//     });
//   }

//   // ============================
//   // 🔹 Xác định link đang active
//   // ============================
//   const isActiveLink = (href: string) => {
//     const url = new URL(href, "http://dummy"); // base giả
//     const subPath = url.pathname;
//     const subStatus = url.searchParams.get("status");
//     // Nếu có query thì so khớp cả path + status
//     if (subStatus) {
//       return pathname === subPath && currentStatus === subStatus;
//     }
//     // Nếu không có query, chỉ so path
//     return pathname === subPath;
//   };

//   const MotionBox = motion(Box);

//   return (
//     <>
//       {/* ===== Desktop Sidebar ===== */}
//       <MotionBox
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={() => {
//           setHovered(false);
//           setOpenMedicine(false);
//           setOpenCategory(false);
//           setOpenShipping(false);
//           setOpenBatch(false);
//         }}
//         animate={{ width: sidebarWidth }}
//         transition={{ type: "spring", stiffness: 180, damping: 22 }}
//         sx={{
//           display: { xs: "none", customLg: "block" },
//           height: "100vh",
//           position: "fixed",
//           top: 0,
//           left: 0,
//           backgroundColor: theme.palette.background.paper,
//           borderRight: `1px solid ${theme.palette.divider}`,
//           overflowX: "hidden",
//           zIndex: theme.zIndex.drawer,
//           boxShadow:
//             "0 4px 24px rgba(0,0,0,0.06), inset -1px 0 0 rgba(0,0,0,0.05)",
//         }}
//       >
//         <List sx={{ mt: 9, p: 1 }}>
//           {/* === THUỐC === */}
//           <Tooltip title={!hovered ? "Thuốc" : ""} placement="right">
//             <ListItemButton
//               onClick={() => setOpenMedicine(!openMedicine)}
//               sx={{ borderRadius: 2, mb: 0.5 }}
//             >
//               <ListItemIcon
//                 sx={{
//                   color: "#00a99d",
//                   minWidth: 40,
//                   justifyContent: "center",
//                 }}
//               >
//                 <Healing />
//               </ListItemIcon>
//               <AnimatePresence>
//                 {hovered && (
//                   <motion.div
//                     initial={{ opacity: 0, x: -10 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: -10 }}
//                     className="flex items-center justify-between w-full"
//                   >
//                     <ListItemText
//                       primary="Thuốc"
//                       primaryTypographyProps={{ fontSize: 15, fontWeight: 500 }}
//                     />
//                     {openMedicine ? <ExpandLess /> : <ExpandMore />}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </ListItemButton>
//           </Tooltip>
//           <Collapse in={hovered && openMedicine} timeout="auto" unmountOnExit>
//             <List component="div" disablePadding>
//               {medicineSubLinks.map((sub) => {
//                 const active = isActiveLink(sub.href);
//                 return (
//                   <Link
//                     key={sub.label}
//                     href={sub.href}
//                     style={{ textDecoration: "none" }}
//                   >
//                     <ListItemButton
//                       sx={{
//                         pl: 7,
//                         borderRadius: 1.5,
//                         bgcolor: active ? "action.selected" : "transparent",
//                         "&:hover": { bgcolor: "action.hover" },
//                       }}
//                     >
//                       <ListItemText
//                         primary={sub.label}
//                         primaryTypographyProps={{
//                           fontSize: 14,
//                           color: active ? "primary.main" : "text.secondary",
//                         }}
//                       />
//                     </ListItemButton>
//                   </Link>
//                 );
//               })}
//             </List>
//           </Collapse>

//           {/* === DANH MỤC === */}
//           <Tooltip title={!hovered ? "Danh mục" : ""} placement="right">
//             <ListItemButton
//               onClick={() => setOpenCategory(!openCategory)}
//               sx={{ borderRadius: 2, mb: 0.5 }}
//             >
//               <ListItemIcon
//                 sx={{
//                   color: "#00a99d",
//                   minWidth: 40,
//                   justifyContent: "center",
//                 }}
//               >
//                 <Category />
//               </ListItemIcon>
//               <AnimatePresence>
//                 {hovered && (
//                   <motion.div
//                     initial={{ opacity: 0, x: -10 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: -10 }}
//                     className="flex items-center justify-between w-full"
//                   >
//                     <ListItemText
//                       primary="Danh mục"
//                       primaryTypographyProps={{ fontSize: 15, fontWeight: 500 }}
//                     />
//                     {openCategory ? <ExpandLess /> : <ExpandMore />}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </ListItemButton>
//           </Tooltip>
//           <Collapse in={hovered && openCategory} timeout="auto" unmountOnExit>
//             <List component="div" disablePadding>
//               {categorySubLinks.map((sub) => {
//                 const active = isActiveLink(sub.href);
//                 return (
//                   <Link
//                     key={sub.label}
//                     href={sub.href}
//                     style={{ textDecoration: "none" }}
//                   >
//                     <ListItemButton
//                       sx={{
//                         pl: 7,
//                         borderRadius: 1.5,
//                         bgcolor: active ? "action.selected" : "transparent",
//                         "&:hover": { bgcolor: "action.hover" },
//                       }}
//                     >
//                       <ListItemText
//                         primary={sub.label}
//                         primaryTypographyProps={{
//                           fontSize: 14,
//                           color: active ? "primary.main" : "text.secondary",
//                         }}
//                       />
//                     </ListItemButton>
//                   </Link>
//                 );
//               })}
//             </List>
//           </Collapse>
//           {/* === VẬN CHUYỂN === */}
//           <Tooltip title={!hovered ? "Vận chuyển" : ""} placement="right">
//             <ListItemButton
//               onClick={() => setOpenShipping(!openShipping)}
//               sx={{ borderRadius: 2, mb: 0.5 }}
//             >
//               <ListItemIcon
//                 sx={{
//                   color: "#00a99d",
//                   minWidth: 40,
//                   justifyContent: "center",
//                 }}
//               >
//                 <LocalShipping />
//               </ListItemIcon>
//               <AnimatePresence>
//                 {hovered && (
//                   <motion.div
//                     initial={{ opacity: 0, x: -10 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: -10 }}
//                     className="flex items-center justify-between w-full"
//                   >
//                     <ListItemText
//                       primary="Vận chuyển"
//                       primaryTypographyProps={{ fontSize: 15, fontWeight: 500 }}
//                     />
//                     {openShipping ? <ExpandLess /> : <ExpandMore />}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </ListItemButton>
//           </Tooltip>
//           <Collapse in={hovered && openShipping} timeout="auto" unmountOnExit>
//             <List component="div" disablePadding>
//               {locativeSubLinks.map((sub) => {
//                 const active = isActiveLink(sub.href);
//                 return (
//                   <Link
//                     key={sub.label}
//                     href={sub.href}
//                     style={{ textDecoration: "none" }}
//                   >
//                     <ListItemButton
//                       sx={{
//                         pl: 7,
//                         borderRadius: 1.5,
//                         bgcolor: active ? "action.selected" : "transparent",
//                         "&:hover": { bgcolor: "action.hover" },
//                       }}
//                     >
//                       <ListItemIcon>{sub.icon}</ListItemIcon>
//                       <ListItemText
//                         primary={sub.label}
//                         primaryTypographyProps={{
//                           fontSize: 14,
//                           color: active ? "primary.main" : "text.secondary",
//                         }}
//                       />
//                     </ListItemButton>
//                   </Link>
//                 );
//               })}
//             </List>
//           </Collapse>

//           {/* === LÔ === */}
//           <Tooltip title={!hovered ? "Lô" : ""} placement="right">
//             <ListItemButton
//               onClick={() => setOpenBatch(!openBatch)}
//               sx={{ borderRadius: 2, mb: 0.5 }}
//             >
//               <ListItemIcon
//                 sx={{
//                   color: "#00a99d",
//                   minWidth: 40,
//                   justifyContent: "center",
//                 }}
//               >
//                 <Inventory2 />
//               </ListItemIcon>
//               <AnimatePresence>
//                 {hovered && (
//                   <motion.div
//                     initial={{ opacity: 0, x: -10 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: -10 }}
//                     className="flex items-center justify-between w-full"
//                   >
//                     <ListItemText
//                       primary="Lô"
//                       primaryTypographyProps={{ fontSize: 15, fontWeight: 500 }}
//                     />
//                     {openBatch ? <ExpandLess /> : <ExpandMore />}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </ListItemButton>
//           </Tooltip>
//           <Collapse in={hovered && openBatch} timeout="auto" unmountOnExit>
//             <List component="div" disablePadding>
//               {batchSubLinks.map((sub) => {
//                 const active = isActiveLink(sub.href);
//                 return (
//                   <Link
//                     key={sub.label}
//                     href={sub.href}
//                     style={{ textDecoration: "none" }}
//                   >
//                     <ListItemButton
//                       sx={{
//                         pl: 7,
//                         borderRadius: 1.5,
//                         bgcolor: active ? "action.selected" : "transparent",
//                         "&:hover": { bgcolor: "action.hover" },
//                       }}
//                     >
//                       <ListItemText
//                         primary={sub.label}
//                         primaryTypographyProps={{
//                           fontSize: 14,
//                           color: active ? "primary.main" : "text.secondary",
//                         }}
//                       />
//                     </ListItemButton>
//                   </Link>
//                 );
//               })}
//             </List>
//           </Collapse>

//           {/* === MAIN LINKS === */}
//           {mainLinks.map((item) => {
//             const active = isActiveLink(item.href);
//             return (
//               <Tooltip
//                 key={item.label}
//                 title={!hovered ? item.label : ""}
//                 placement="right"
//               >
//                 <Link href={item.href} style={{ textDecoration: "none" }}>
//                   <ListItemButton
//                     sx={{
//                       borderRadius: 2,
//                       mb: 0.5,
//                       transition: "all 0.2s ease",
//                       bgcolor: active ? "action.selected" : "transparent",
//                       "&:hover": { bgcolor: "action.hover" },
//                     }}
//                   >
//                     <ListItemIcon
//                       sx={{
//                         color: active ? "primary.main" : item.color,
//                         minWidth: 40,
//                         justifyContent: "center",
//                       }}
//                     >
//                       {item.icon}
//                     </ListItemIcon>
//                     <AnimatePresence>
//                       {hovered && (
//                         <motion.div
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           exit={{ opacity: 0, x: -10 }}
//                         >
//                           <ListItemText
//                             primary={item.label}
//                             primaryTypographyProps={{
//                               fontSize: 15,
//                               fontWeight: 500,
//                               color: active ? "primary.main" : "text.primary",
//                             }}
//                           />
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                   </ListItemButton>
//                 </Link>
//               </Tooltip>
//             );
//           })}
//         </List>
//       </MotionBox>

//       {/* ===== Mobile Drawer ===== */}
//       <Drawer
//         variant="temporary"
//         open={openMobile}
//         onClose={onCloseMobile}
//         ModalProps={{ keepMounted: true }}
//         sx={{
//           display: { xs: "block", lg: "none" },
//           "& .MuiDrawer-paper": {
//             width: 260,
//             boxSizing: "border-box",
//             background: "linear-gradient(145deg, #e3f2fd, #e8f5e9)",
//             borderRight: "1px solid rgba(0,0,0,0.08)",
//           },
//         }}
//       >
//         <Box sx={{ mt: 10, px: 2 }}>
//           {mainLinks.map((item, i) => {
//             const active = isActiveLink(item.href);
//             return (
//               <motion.div
//                 key={item.label}
//                 initial={{ opacity: 0, x: -15 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: i * 0.05 }}
//               >
//                 <Link href={item.href} style={{ textDecoration: "none" }}>
//                   <ListItemButton
//                     onClick={onCloseMobile}
//                     sx={{
//                       mb: 1,
//                       borderRadius: 2,
//                       bgcolor: active ? "action.selected" : "transparent",
//                       "&:hover": {
//                         bgcolor: "action.hover",
//                         transform: "scale(1.02)",
//                         transition: "0.2s ease",
//                       },
//                     }}
//                   >
//                     <ListItemIcon
//                       sx={{ color: active ? "primary.main" : item.color }}
//                     >
//                       {item.icon}
//                     </ListItemIcon>
//                     <ListItemText
//                       primary={item.label}
//                       primaryTypographyProps={{
//                         fontWeight: 500,
//                         color: active ? "primary.main" : "text.primary",
//                       }}
//                     />
//                   </ListItemButton>
//                 </Link>
//               </motion.div>
//             );
//           })}
//         </Box>
//       </Drawer>
//     </>
//   );
// }

"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  Healing,
  Category,
  ExpandLess,
  ExpandMore,
  LocalShipping,
  Business,
  DirectionsBus,
  Person,
  Inventory,
  Assignment,
  Inventory2,
  Group,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

interface SidebarProps {
  openMobile?: boolean;
  onCloseMobile?: () => void;
}

interface SidebarSectionProps {
  title: string;
  icon: React.ReactNode;
  hovered: boolean;
  open: boolean;
  setOpen: (val: boolean) => void;
  subLinks: Array<{ label: string; href: string; icon?: React.ReactNode }>;
  isActiveLink: (href: string) => boolean;
}

export default function Sidebar({ openMobile, onCloseMobile }: SidebarProps) {
  const theme = useTheme();
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const currentStatus = searchParams?.get("status");

  const [hovered, setHovered] = useState(false);
  const [openMedicine, setOpenMedicine] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openShipping, setOpenShipping] = useState(false);
  const [openBatch, setOpenBatch] = useState(false);
  const [roleName, setRoleName] = useState<string | null>(null);

  useEffect(() => {
    const role = Cookies.get("roleName") || null;
    setRoleName(role);
  }, []);

  const sidebarWidth = hovered ? 260 : 78;

  // -----------------------------
  // Sub links
  // -----------------------------
  const medicineSubLinks = [
    { label: "Bản nháp", href: "/distributor/manager_drug/local" },
    { label: "Chờ duyệt", href: "/distributor/manager_drug/draft" },
    { label: "Đã duyệt", href: "/distributor/manager_drug/approved" },
  ];

  const categorySubLinks = [
    { label: "Chờ duyệt", href: "/distributor/manager_category/draft" },
    { label: "Đã duyệt", href: "/distributor/manager_category/approved" },
  ];

  const locativeSubLinks = [
    {
      label: "Chuyến đi",
      href: "/distributor/manager_shipment",
      icon: <DirectionsBus />,
    },
    {
      label: "Người mua",
      href: "/distributor/manager_buyer",
      icon: <Person />,
    },
  ];

  const batchSubLinks = [
    { label: "Đã duyệt", href: "/distributor/manager_batch/approved" },
    { label: "Chờ duyệt", href: "/distributor/manager_batch/draft" },
  ];

  // -----------------------------
  // Main links
  // -----------------------------
  const mainLinks: Array<{
    label: string;
    href: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      label: "Tồn kho",
      href: "/distributor/inventory",
      icon: <Inventory />,
      color: "#00bcd4",
    },
    {
      label: "Đơn hàng",
      href: "/distributor/manager_order",
      icon: <Assignment />,
      color: "#26a69a",
    },
    {
      label: "Công ty",
      href: "/distributor/manager_company",
      icon: <Business />,
      color: "#26a69a",
    },
  ];

  if (roleName === "manufacturer") {
    mainLinks.push({
      label: "Nhân viên",
      href: "/distributor/manager_employee",
      icon: <Group />,
      color: "#7e57c2",
    });
  }

  // -----------------------------
  // Active link checker
  // -----------------------------
  const isActiveLink = useCallback(
    (href: string) => {
      const url = new URL(href, "http://dummy");
      const subPath = url.pathname;
      const subStatus = url.searchParams.get("status");
      if (subStatus) return pathname === subPath && currentStatus === subStatus;
      return pathname === subPath;
    },
    [pathname, currentStatus]
  );

const MotionBox = motion.create(Box);

  return (
    <>
      {/* ===== Desktop Sidebar ===== */}
      <MotionBox
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{ width: sidebarWidth }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        sx={{
          display: { xs: "none", customLg: "block" },
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
          overflowX: "hidden",
          zIndex: theme.zIndex.drawer,
          boxShadow:
            "0 4px 24px rgba(0,0,0,0.06), inset -1px 0 0 rgba(0,0,0,0.05)",
        }}
      >
        <List sx={{ mt: 9, p: 1 }}>
          <SidebarSection
            title="Thuốc"
            icon={<Healing />}
            hovered={hovered}
            open={openMedicine}
            setOpen={setOpenMedicine}
            subLinks={medicineSubLinks}
            isActiveLink={isActiveLink}
          />
          <SidebarSection
            title="Danh mục"
            icon={<Category />}
            hovered={hovered}
            open={openCategory}
            setOpen={setOpenCategory}
            subLinks={categorySubLinks}
            isActiveLink={isActiveLink}
          />
          <SidebarSection
            title="Vận chuyển"
            icon={<LocalShipping />}
            hovered={hovered}
            open={openShipping}
            setOpen={setOpenShipping}
            subLinks={locativeSubLinks}
            isActiveLink={isActiveLink}
          />
          <SidebarSection
            title="Lô"
            icon={<Inventory2 />}
            hovered={hovered}
            open={openBatch}
            setOpen={setOpenBatch}
            subLinks={batchSubLinks}
            isActiveLink={isActiveLink}
          />

          {/* Main Links */}
          {mainLinks.map((item) => {
            const active = isActiveLink(item.href);
            return (
              <Tooltip
                key={item.label}
                title={!hovered ? item.label : ""}
                placement="right"
              >
                <Link href={item.href} style={{ textDecoration: "none" }}>
                  <ListItemButton
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      bgcolor: active ? "action.selected" : "transparent",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: active ? "primary.main" : item.color,
                        minWidth: 40,
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <AnimatePresence>
                      {hovered && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                        >
                          <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{
                              fontSize: 15,
                              fontWeight: 500,
                              color: active ? "primary.main" : "text.primary",
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </ListItemButton>
                </Link>
              </Tooltip>
            );
          })}
        </List>
      </MotionBox>

      {/* ===== Mobile Drawer ===== */}
      <Drawer
        variant="temporary"
        open={openMobile}
        onClose={onCloseMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            width: 260,
            boxSizing: "border-box",
            background: "linear-gradient(145deg, #e3f2fd, #e8f5e9)",
            borderRight: "1px solid rgba(0,0,0,0.08)",
          },
        }}
      >
        <Box sx={{ mt: 10, px: 2 }}>
          {mainLinks.map((item, i) => {
            const active = isActiveLink(item.href);
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={item.href} style={{ textDecoration: "none" }}>
                  <ListItemButton
                    onClick={onCloseMobile}
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      bgcolor: active ? "action.selected" : "transparent",
                      "&:hover": {
                        bgcolor: "action.hover",
                        transform: "scale(1.02)",
                        transition: "0.2s ease",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{ color: active ? "primary.main" : item.color }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        color: active ? "primary.main" : "text.primary",
                      }}
                    />
                  </ListItemButton>
                </Link>
              </motion.div>
            );
          })}
        </Box>
      </Drawer>
    </>
  );
}

function SidebarSection({
  title,
  icon,
  hovered,
  open,
  setOpen,
  subLinks,
  isActiveLink,
}: SidebarSectionProps) {
  return (
    <>
      <Tooltip title={!hovered ? title : ""} placement="right">
        <ListItemButton
          onClick={() => setOpen(!open)}
          sx={{ borderRadius: 2, mb: 0.5 }}
        >
          <ListItemIcon
            sx={{ color: "#00a99d", minWidth: 40, justifyContent: "center" }}
          >
            {icon}
          </ListItemIcon>
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center justify-between w-full"
              >
                <ListItemText
                  primary={title}
                  primaryTypographyProps={{ fontSize: 15, fontWeight: 500 }}
                />
                {open ? <ExpandLess /> : <ExpandMore />}
              </motion.div>
            )}
          </AnimatePresence>
        </ListItemButton>
      </Tooltip>
      <Collapse in={hovered && open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {subLinks.map((sub) => {
            const active = isActiveLink(sub.href);
            return (
              <Link
                key={sub.label}
                href={sub.href}
                style={{ textDecoration: "none" }}
              >
                <ListItemButton
                  sx={{
                    pl: 7,
                    borderRadius: 1.5,
                    bgcolor: active ? "action.selected" : "transparent",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  {sub.icon && <ListItemIcon>{sub.icon}</ListItemIcon>}
                  <ListItemText
                    primary={sub.label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      color: active ? "primary.main" : "text.secondary",
                    }}
                  />
                </ListItemButton>
              </Link>
            );
          })}
        </List>
      </Collapse>
    </>
  );
}
