"use client";

import React, { useState, useEffect } from "react";
import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { initFunctions } from "@common/lib/utils";
import { PGliteProvider, ExtendedPGlite } from "@/context/pglite";

export function DBProvider({
                             children,
                           }: {
  children: React.ReactNode;
}): React.ReactNode {
  const [pg, setPG] = useState<ExtendedPGlite>();

  const initializeDB = async () => {
    const pglite = await PGlite.create({
      dataDir: "memory://",
      extensions: { live },
      debug: 0,
    }) as ExtendedPGlite;

    pglite.resetDB = async function () {
      await this.close();
      const newInstance = await PGlite.create({
        dataDir: "memory://",
        extensions: { live },
        debug: 0,
      }) as ExtendedPGlite;
      newInstance.resetDB = pglite.resetDB;
      await initFunctions(newInstance);
      setPG(newInstance);
    };

    await initFunctions(pglite);
    setPG(pglite);
  };

  useEffect(() => {
    if (!pg) initializeDB();
  }, [pg]);

  if (!pg) return null;

  return <PGliteProvider db={pg}>{children}</PGliteProvider>;
}
