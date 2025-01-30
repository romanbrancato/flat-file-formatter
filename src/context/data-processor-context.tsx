"use client";

import React, { createContext } from "react";
import { useDataProcessor } from "@/hooks/useDataProcessor";

export const DataProcessorContext = createContext<
  ReturnType<typeof useDataProcessor>
>({} as ReturnType<typeof useDataProcessor>);

export const ProcessorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <DataProcessorContext.Provider value={useDataProcessor()}>
      {children}
    </DataProcessorContext.Provider>
  );
};
