import React from "react";
import { Provider } from "jotai";

interface JotaiProviderProps {
  children: React.ReactNode;
}

export default function JotaiProvider({ children }: JotaiProviderProps) {
  return <Provider>{children}</Provider>;
}
