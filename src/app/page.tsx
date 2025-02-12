"use client";
import { DataTable } from "@/components/data-table";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toolbar } from "@/components/toolbar";

export default function App() {

  return (
    <main className="flex h-screen flex-col">
      <Header />
      <Toolbar />
      <DataTable />
      <Footer />
    </main>
  );
}
