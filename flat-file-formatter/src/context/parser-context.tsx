"use client";

import React, { createContext } from "react";
import { useParser } from "@/hooks/useParser";

export const ParserContext = createContext<ReturnType<typeof useParser>>(
  {} as ReturnType<typeof useParser>,
);

export const ParserProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ParserContext.Provider value={useParser()}>
      {children}
    </ParserContext.Provider>
  );
};
