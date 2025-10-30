// "use client";
// import { Menu, MenuItem, IconButton, Typography } from "@mui/material";
// import LanguageIcon from "@mui/icons-material/Language";
// import { useState } from "react";
// import i18n from "@/lib/i18n";

// const SUPPORTED_LOCALES = ["en", "vi", "fr"];

// export default function LanguageSwitcher() {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);

//   const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
//   const handleClose = () => setAnchorEl(null);

//   const handleChange = (lng: string) => {
//     i18n.changeLanguage(lng).then(() => {
//       localStorage.setItem("app_locale", lng);
//       handleClose();
//     });
//   };

//   return (
//     <>
//       <IconButton color="inherit" onClick={handleOpen}>
//         <LanguageIcon />
//       </IconButton>

//       <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
//         {SUPPORTED_LOCALES.map((lng) => (
//           <MenuItem key={lng} onClick={() => handleChange(lng)}>
//             <Typography>{lng.toUpperCase()}</Typography>
//           </MenuItem>
//         ))}
//       </Menu>
//     </>
//   );
// }
