// components/theme/medicalTheme.ts
import { createTheme, ThemeOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    customLg: true;
  }
}

export type ThemeMode = "light" | "dark";

export function makeMedicalTheme(mode: ThemeMode) {
  const paletteLight = {
    mode: "light" as const,
    primary: { main: "#00A99D", contrastText: "#ffffff" },
    secondary: { main: "#1976d2" },
    background: { default: "#f6fbfb", paper: "#ffffff" },
    text: { primary: "#0b2b2a", secondary: "#50656a" },
    success: { main: "#5cc1a6" },
    info: { main: "#79d2ff" },
    divider: "rgba(11,43,42,0.08)",
  };

  const paletteDark = {
    mode: "dark" as const,
    primary: { main: "#00A99D", contrastText: "#012421" },
    secondary: { main: "#90cdf4" },
    background: { default: "#071821", paper: "#0a2421" },
    text: { primary: "#e6f6f4", secondary: "rgba(230,246,244,0.7)" },
    success: { main: "#2fb48c" },
    info: { main: "#58b8ff" },
    divider: "rgba(255,255,255,0.06)",
  };

  const commonOptions: ThemeOptions = {
    palette: mode === "light" ? paletteLight : paletteDark,
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        customLg: 1000,
        lg: 1280,
        xl: 1536,
      },
    },
    components: {
      MuiAppBar: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backdropFilter: "saturate(120%) blur(6px)",
            transition: "background-color 0.3s ease",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            transition: "background-color 0.3s ease, color 0.3s ease",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            paddingLeft: 12,
            paddingRight: 12,
          },
          containedPrimary: {
            boxShadow: "0 6px 18px rgba(0, 169, 157, 0.09)",
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            "&:hover": {
              backgroundColor:
                mode === "light"
                  ? "rgba(0,169,157,0.06)"
                  : "rgba(0,169,157,0.08)",
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: "none",
            backgroundColor:
              mode === "light" ? "#ffffff" : "#0d2623",
            color: mode === "light" ? "#0b2b2a" : "#e6f6f4",
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            fontSize: 13,
          },
        },
      },
    },
  };

  return createTheme(commonOptions);
}
