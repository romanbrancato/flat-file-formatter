import type { Metadata } from "next";
import "../styles/globals.css";
import { ReactNode } from "react";
import { DataProcessorProvider } from "@/context/data-processor";
import { PresetProvider } from "@/context/preset";
import { DbProvider } from "@/context/db";
import { ThemeProvider } from "@/context/theme";
import { SqlTerminalProvider } from "@/context/sql-terminal";
import { TablesProvider } from "@/context/tables";

export const metadata: Metadata = {
  title: "Flat File Formatter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <DbProvider>
          <TablesProvider>
            <SqlTerminalProvider>
              <PresetProvider>
                <DataProcessorProvider>
                  <ThemeProvider defaultTheme="system" enableSystem>
                    {children}
                  </ThemeProvider>
                </DataProcessorProvider>
              </PresetProvider>
            </SqlTerminalProvider>
          </TablesProvider>
        </DbProvider>
      </body>
    </html>
  );
}
