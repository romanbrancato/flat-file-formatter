"use client"
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toolbar } from "@/components/toolbar";
import { Terminal } from "@/components/terminal/terminal";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import { QueryTable } from "@/components/query-table";
import { Toaster } from "sonner";

export default function App() {

  return (
    <main className="mx-auto flex h-screen max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
      <Header />
      <Toolbar />
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={70}>
          <QueryTable />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30}>
          <Terminal />
        </ResizablePanel>
      </ResizablePanelGroup>
      <Footer />
      <Toaster richColors />
    </main>
  );
}
