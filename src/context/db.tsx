"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PGlite, PGliteInterfaceExtensions } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { initFunctions } from "@common/lib/utils";
import { makePGliteProvider } from '@electric-sql/pglite-react';

export type ExtendedPGlite = PGlite &
  PGliteInterfaceExtensions<{ live: typeof live }> & {
  resetDB: () => Promise<void>;
};

const { PGliteProvider, usePGlite } = makePGliteProvider<ExtendedPGlite>();

export { PGliteProvider, usePGlite };

export function DBProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  const [pg, setPG] = useState<ExtendedPGlite>();
  const pgRef = React.useRef(pg);

  // Sync ref with current pg state
  useEffect(() => {
    pgRef.current = pg;
  }, [pg]);

  const resetDB = useCallback(async function (this: ExtendedPGlite) {
    try {
      await this.close();
      const newInstance = await PGlite.create({
        dataDir: "memory://",
        extensions: { live },
        debug: 0,
      }) as ExtendedPGlite;

      newInstance.resetDB = resetDB.bind(newInstance);
      await initFunctions(newInstance);
      setPG(newInstance);
    } catch (error) {
      console.error("Failed to reset database:", error);
    }
  }, [setPG]);

  // Initialize database
  const initializeDB = useCallback(async () => {
    try {
      const pglite = await PGlite.create({
        dataDir: "memory://",
        extensions: { live },
        debug: 0,
      }) as ExtendedPGlite;

      pglite.resetDB = resetDB.bind(pglite);
      await initFunctions(pglite);
      setPG(pglite);
    } catch (error) {
      console.error("Failed to initialize database:", error);
    }
  }, [resetDB]);

  useEffect(() => {
    if (!pgRef.current) {
      initializeDB();
    }

    return () => {
      if (pgRef.current) {
        pgRef.current.close().catch(error => {
          console.error("Failed to close database:", error);
        });
      }
    };
  }, [initializeDB]);

  if (!pg) return null;

  return <PGliteProvider db={pg}>{children}</PGliteProvider>;
}