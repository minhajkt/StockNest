import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useColorMode } from "./AppTheme";

export default function ColorModeSelect() {
  const { toggleColorMode, mode } = useColorMode();

  return (
    <IconButton
      onClick={toggleColorMode}
      sx={{ position: "fixed", top: "1rem", right: "1rem" }}
    >
      {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
}
