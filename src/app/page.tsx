"use client";
import React, { useContext } from "react";
import { DataProcessorContext } from "@/context/data-processor-context";
import { DataTable } from "@/components/data-table";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toolbar } from "@/components/toolbar";

export default function App() {
  const { isReady, data, focus } = useContext(DataProcessorContext);

  return (
    <main className="flex h-screen flex-col">
      <Header />
      <div className="flex items-center justify-between border-y py-2">
        <Toolbar />
      </div>
      <>
        {isReady && Object.keys(data).includes(focus) && (
          <DataTable fields={data[focus].fields} rows={data[focus].rows} />
        )}
      </>
      <Footer />
    </main>
  );
}
