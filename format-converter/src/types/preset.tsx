export interface Preset {
    name: string,
    initial: string[], // The initial fields, used to confirm that preset is compatible with the uploaded file
    removed: string[] | null, // The fields that were removed
    added: Record<string, string>[] | null, // The fields that were added: {field, value}
    edited: Record<string, string>[] | null, // The fields that were edited: {field, value}
    order: string[], // The order of the fields
    export: "csv" | "txt",
    widths: Record<string, number>[] | null, // The width of each field in characters (if applicable): {field, width}
    symbol: string // The delimiter or padding symbol
}