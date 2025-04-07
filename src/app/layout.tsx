import type { Metadata } from "next";
import "../styles/globals.css";
import { ReactNode } from "react";
import { PresetProvider } from "@/context/preset";
import { DBProvider } from "@/context/db";
import { ThemeProvider } from "@/context/theme";
import { TablesProvider } from "@/context/tables";
import { TerminalProvider } from "@/context/terminal";

export const metadata: Metadata = {
  title: "Flat File Formatter"
};

export default function RootLayout({
                                     children
                                   }: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
    <body>
    <DBProvider>
      <TablesProvider>
        <PresetProvider>
          <TerminalProvider>
            <ThemeProvider defaultTheme="system" enableSystem>
              {children}
            </ThemeProvider>
          </TerminalProvider>
        </PresetProvider>
      </TablesProvider>
    </DBProvider>
    </body>
    </html>
  );
}
