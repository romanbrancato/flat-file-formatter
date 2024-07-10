"use client";
import React, { createContext } from "react";
import { useBatchParser } from "@/hooks/useBatchParser";

export const BatchParserContext = createContext<
  ReturnType<typeof useBatchParser>
>({} as ReturnType<typeof useBatchParser>);

export const BatchParserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <BatchParserContext.Provider value={useBatchParser()}>
      {children}
    </BatchParserContext.Provider>
  );
};
