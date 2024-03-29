"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

export interface ProvidersProps {
  children: React.ReactNode;
//   themeProps?: ThemeProviderProps;
}

export function Providers({children}: { children: React.ReactNode }) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
