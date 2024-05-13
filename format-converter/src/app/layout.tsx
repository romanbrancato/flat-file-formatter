import type {Metadata} from "next";
import "../styles/globals.css";
import {Container} from "@/components/ui/container";
import {Header} from "@/components/header";


export const metadata: Metadata = {
    title: ".csv Formatter",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
            <Header/>
            <Container>
                {children}
            </Container>
        </body>
        </html>
    );
}
