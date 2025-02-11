import type { Metadata } from "next";
import "../styles/globals.css";
import { Container } from "@/components/ui/container";
import { ThemeProvider } from "@/context/theme-context";
import { ReactNode } from "react";
import { PresetProvider } from "@/context/preset-context";
import { DataProcessorProvider } from "@/context/data-processor-context";

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
        <ThemeProvider defaultTheme="system" enableSystem>
          <Container>
            <PresetProvider>
              <DataProcessorProvider>{children}</DataProcessorProvider>
            </PresetProvider>
          </Container>
        </ThemeProvider>
      </body>
    </html>
  );
}
