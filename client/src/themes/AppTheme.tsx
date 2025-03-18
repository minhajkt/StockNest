import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState, createContext, useContext } from "react";
import CssBaseline from "@mui/material/CssBaseline";

const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: "light" as "light" | "dark",
});

export default function AppTheme({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = createTheme({
    palette: {
      mode,
    },
  });

  return (
    <ColorModeContext.Provider value={{ toggleColorMode, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export const useColorMode = () => useContext(ColorModeContext);
