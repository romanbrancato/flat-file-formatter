"use client";

import React, { useState, useEffect } from "react";
import { PGliteProvider } from "@electric-sql/pglite-react";
import { live, PGliteWithLive } from "@electric-sql/pglite/live";
import { PGlite } from "@electric-sql/pglite";
import { initFunctions } from "@common/lib/utils";

export function DbProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const [pg, setPg] = useState<PGliteWithLive>();

  const initializeDb = async () => {
    const pglite = await PGlite.create({
      dataDir: "memory://",
      extensions: { live },
      debug: 0,
    });
    setPg(pglite);
    initFunctions(pglite);
  };

  useEffect(() => {
    if (!pg) {
      initializeDb();
    }
  }, [pg]);

  if (!pg) return null;

  return <PGliteProvider db={pg}>{children}</PGliteProvider>;
}
