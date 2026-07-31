import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";
import {
  RootStore,
  StoresContext,
  useMobx,
} from "../core/viewmodels/RootStore";

const rootStore = new RootStore();

export { useMobx };

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StoresContext.Provider value={rootStore}>
        {children}
      </StoresContext.Provider>
    </ThemeProvider>
  );
}
