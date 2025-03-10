import { useEffect, useState } from "react";
import type { Results } from "./terminal-types";

const ROW_INCREMENT = 100;
const MAX_CELL = 200;
const BASE_CELL = "p-0 px-0.5 border";

const formatValue = (value: unknown): string => {
  if (value === null) return "null";
  if (typeof value === "number") return value.toString();
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return `[${value.map(formatValue).join(", ")}]`;
  if (typeof value === "object") return JSON.stringify(value);
  if (ArrayBuffer.isView(value)) return `${value.byteLength} bytes`;
  return String(value).slice(0, MAX_CELL) + (String(value).length > MAX_CELL ? "…" : "");
};

export const TerminalTable = ({ result }: { result: Results }) => {
  const [maxRows, setMaxRows] = useState(ROW_INCREMENT);

  useEffect(() => setMaxRows(ROW_INCREMENT), [result]);

  const rows = result.rows.slice(0, maxRows);
  const hasMore = result.rows.length > maxRows;
  const cellStyle = (value: unknown) => [
    BASE_CELL,
    value === null ? "text-border" : "",
    typeof value === "number" ? "text-right tabular-nums" : "",
    typeof value === "boolean" ? "text-center" : ""
  ].join(" ");

  return (
    <>
      <div className="overflow-x-auto">
        <table className="border-collapse">
          <thead>
          <tr>
            {result.fields.map(({ name }) => (
              <th key={name} className={`${BASE_CELL} font-semibold`}>{name}</th>
            ))}
          </tr>
          </thead>
          <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((value, j) => (
                <td
                  key={j}
                  className={`${cellStyle(value)} max-w-[400px] truncate`}
                >
                  {formatValue(value)}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      <div className="text-muted-foreground">
        {`${hasMore ? `${maxRows} of ` : ""}${result.rows.length} row(s)`}
        {hasMore && (
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              setMaxRows(p => p + ROW_INCREMENT);
            }}
            className="ml-2 no-underline cursor-pointer"
          >
            Show more
          </a>
        )}
      </div>
    </>
  );
};