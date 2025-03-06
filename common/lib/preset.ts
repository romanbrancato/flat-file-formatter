import { Preset, PresetSchema } from "@common/types/schemas";
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
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.transaction(async (tx) => {
      for (const query of queries) {
        await tx.query(query);
      }
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
