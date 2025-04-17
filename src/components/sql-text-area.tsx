"use client";
import { useEffect, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { PostgreSQL } from "@codemirror/lang-sql";
import { usePGlite } from "@/context/pglite";
import { makeSqlExt } from "./terminal/sql-support";
import { getSchema } from "./terminal/terminal-utils";
import { githubDarkInit, githubLight } from "@uiw/codemirror-theme-github";
import { useTheme } from "next-themes";

const lightTheme = githubLight;
const darkTheme = githubDarkInit({
  settings: {
    background: "hsl(var(--background))",
    lineHighlight: "hsl(var(--accent) / 0.5)"
  }
});

export function SqlTextArea({
  value,
  onChange,
}: {
  value: string;
  onChange?: (value: string) => void;
}) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [schema, setSchema] = useState<Record<string, string[]>>({});
  const pg = usePGlite();

  useEffect(() => {
    let active = true;
    setLoading(true);

    pg.waitReady.then(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [pg]);

  const extensions = useMemo(() => [
    makeSqlExt({
      dialect: PostgreSQL,
      schema,
      tables: [{ label: "d", displayLabel: "\\d" }],
      defaultSchema: "public"
    })
  ], [pg, schema]);

  return (
    <div className="border">
      <CodeMirror
        className="[&_.cm-gutter.cm-lineNumbers]:min-h-[75px] max-h-[400px] overflow-auto"
        value={value}
        onChange={onChange}
        extensions={extensions}
        theme={theme === "dark" ? darkTheme : lightTheme}
        editable={!loading}
        onCreateEditor={() => getSchema(pg).then(setSchema)}
      />
    </div>
  );
}