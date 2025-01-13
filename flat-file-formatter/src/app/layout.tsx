import type { Metadata } from "next";
import "../styles/globals.css";
import { Container } from "@/components/ui/container";
import { ThemeProvider } from "@/context/theme-context";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { PresetProvider } from "@/context/preset-context";
import { ProcessorProvider } from "@/context/data-processor-context";

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
              <ProcessorProvider>{children}</ProcessorProvider>
            </PresetProvider>
          </Container>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
