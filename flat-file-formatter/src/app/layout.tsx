import type { Metadata } from "next";
import "../styles/globals.css";
import { Container } from "@/components/ui/container";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/context/theme-context";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { PresetProvider } from "@/context/preset-context";
import { ParserProvider } from "@/context/parser-context";

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
          <Header />
          <Container>
            <PresetProvider>
              <ParserProvider>{children}</ParserProvider>
            </PresetProvider>
          </Container>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
