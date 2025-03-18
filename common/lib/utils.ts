import { PGliteWithLive } from "@electric-sql/pglite/live";

export async function initFunctions(db: PGliteWithLive) {
  // Overpunch Extraction Function
  await db.query(`
CREATE OR REPLACE FUNCTION extract_overpunch(raw TEXT, decimals INT DEFAULT 2)
RETURNS NUMERIC AS $$
DECLARE
    length INT;
    last_char CHAR;
    sign CHAR;
    cent CHAR;
    core TEXT;
    extract_ref JSONB;
BEGIN
    -- Define the extraction reference mapping
    extract_ref := '{
        "0": ["+", "0"],
        "1": ["+", "1"],
        "2": ["+", "2"],
        "3": ["+", "3"],
        "4": ["+", "4"],
        "5": ["+", "5"],
        "6": ["+", "6"],
        "7": ["+", "7"],
        "8": ["+", "8"],
        "9": ["+", "9"],
        "{": ["+", "0"],
        "A": ["+", "1"],
        "B": ["+", "2"],
        "C": ["+", "3"],
        "D": ["+", "4"],
        "E": ["+", "5"],
        "F": ["+", "6"],
        "G": ["+", "7"],
        "H": ["+", "8"],
        "I": ["+", "9"],
        "}": ["-", "0"],
        "J": ["-", "1"],
        "K": ["-", "2"],
        "L": ["-", "3"],
        "M": ["-", "4"],
        "N": ["-", "5"],
        "O": ["-", "6"],
        "P": ["-", "7"],
        "Q": ["-", "8"],
        "R": ["-", "9"]
    }';

    -- Pad with leading zeros based on decimals
    raw := LPAD(raw, LENGTH(raw) + CASE WHEN LENGTH(raw) < decimals THEN decimals - LENGTH(raw) ELSE 0 END, '0');
    
    length := LENGTH(raw);
    last_char := SUBSTRING(raw FROM length FOR 1);
    
    -- Extract sign and cent digit
    sign := (extract_ref->last_char->>0)::CHAR;
    cent := (extract_ref->last_char->>1)::CHAR;
    
    -- Build the numeric string
    IF decimals = 0 THEN
        core := SUBSTRING(raw FROM 1 FOR length - 1);
    ELSE
        core := SUBSTRING(raw FROM 1 FOR length - decimals) || '.' || 
                SUBSTRING(raw FROM length - decimals + 1 FOR decimals - 1);
    END IF;
    
    -- Return the numeric value
    RETURN (sign || core || cent)::NUMERIC;
END;
$$ LANGUAGE plpgsql;`
  );
}
