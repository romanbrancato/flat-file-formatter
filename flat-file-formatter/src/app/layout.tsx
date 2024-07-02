import type {Metadata} from "next";
import "../styles/globals.css";
import {Container} from "@/components/ui/container";
import {Header} from "@/components/header";
import {DataContextProvider} from "@/context/data-context";
import {ThemeProvider} from "@/context/theme-context";
import {ReactNode} from "react";
import {Toaster} from "@/components/ui/sonner";
import {PresetContextProvider} from "@/context/preset-context";
import {ModeProvider} from "@/context/mode-context";
import {ParserProvider} from "@/context/parser-context";
import {BatchParserProvider} from "@/context/batch-parser-context";

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
            <Header/>
            <Container>
                <DataContextProvider>
                    <PresetContextProvider>
                        <ModeProvider>
                            <ParserProvider>
                                <BatchParserProvider>
                                    {children}
                                </BatchParserProvider>
                            </ParserProvider>
                        </ModeProvider>
                    </PresetContextProvider>
                </DataContextProvider>
            </Container>
            <Toaster position="bottom-right" richColors/>
        </ThemeProvider>
        </body>
        </html>
    )

}
