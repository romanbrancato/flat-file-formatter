import { PGlite, PGliteInterfaceExtensions } from '@electric-sql/pglite';
import { live } from '@electric-sql/pglite/live';
import { makePGliteProvider } from '@electric-sql/pglite-react';

export type ExtendedPGlite = PGlite &
  PGliteInterfaceExtensions<{ live: typeof live }> & {
  resetDB: () => Promise<void>;
};

const { PGliteProvider, usePGlite } = makePGliteProvider<ExtendedPGlite>();

export { PGliteProvider, usePGlite };