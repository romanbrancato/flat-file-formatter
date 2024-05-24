import type {Metadata} from "next";
import "../styles/globals.css";
import {Container} from "@/components/ui/container";
import {Header} from "@/components/header";
import {DataContextProvider} from "@/context/data-context";
import {ThemeProvider} from "@/context/theme-context";
import {ReactNode} from "react";


export const metadata: Metadata = {
    title: ".csv Formatter"
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <ThemeProvider
            defaultTheme="system"
            enableSystem
        >
            <Header/>
            <Container>
                <DataContextProvider>
                    {children}
                </DataContextProvider>
            </Container>
        </ThemeProvider>
        </body>
        </html>
    );
}
