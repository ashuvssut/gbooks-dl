import { deepmerge } from "@mui/utils";
import { createTheme, ThemeOptions, Theme } from "@mui/material/styles";

const systemFont = [
  "ui-sans-serif",
  "system-ui",
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Roboto",
  "Helvetica Neue",
  "Arial",
  "Noto Sans",
  "sans-serif",
  "Apple Color Emoji",
  "Segoe UI Emoji",
  "Segoe UI Symbol",
  "Noto Color Emoji",
];

export const getDesignTokens = (mode: "light" | "dark") =>
  ({
    palette: { mode },
    shape: { borderRadius: 10 },
    spacing: 10,
    typography: {
      htmlFontSize: 16,
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      fontFamily: systemFont.join(","),
    },
  } as ThemeOptions);

export function getThemedComponents(theme: Theme): {
  components: Theme["components"];
} {
  // const { primary } = theme.palette;
  return {
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: ({ theme, ownerState }) => ({
            ...(ownerState.size === "large" && {
              padding: "0.875rem 1rem",
              ...theme.typography.body1,
              lineHeight: 21 / 16,
              fontWeight: 700,
            }),
            ...(ownerState.size === "small" && {
              padding: theme.spacing(0.5, 1),
            }),
            ...(ownerState.variant === "contained" &&
              ownerState.color === "primary" && {
                backgroundColor: "#67B3FF",
                color: "#fff",
              }),
          }),
        },
      },
    },
  };
}

const lightTheme = createTheme(getDesignTokens("light"));
export const brandingLightTheme = deepmerge(
  lightTheme,
  getThemedComponents(lightTheme)
);

const darkTheme = createTheme(getDesignTokens("dark"));
export const brandingDarkTheme = deepmerge(
  darkTheme,
  getThemedComponents(darkTheme)
);
