import { Preset, PresetSchema } from "@common/types/preset";
import { PGliteWithLive } from "@electric-sql/pglite/live";

export function loadPresetFromFile(
  presetData: Uint8Array,
): { success: true; preset: Preset } | { success: false; error: string } {
  const textDecoder = new TextDecoder();
  try {
    const preset = PresetSchema.parse(
      JSON.parse(textDecoder.decode(presetData)),
    );
    return { success: true, preset };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function runQueriesFromPreset(
  db: PGliteWithLive,
  queries: string[],
): Promise<{ success: boolean; error?: string; failedQueryIndex?: number }> {
  try {
    await db.transaction(async (tx) => {
      for (let i = 0; i < queries.length; i++) {
        try {
          await tx.query(queries[i]);
        } catch (error) {
          // Attach the index to the error and rethrow
          throw new Error(`Query at index ${i} failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}


