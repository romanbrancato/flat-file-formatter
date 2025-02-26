"use client";

import { usePGlite } from "@electric-sql/pglite-react";
import { Repl, ReplTheme } from "@electric-sql/pglite-repl";
import {
  githubLight,
  githubDarkInit,
} from "@uiw/codemirror-theme-github";
import { useTheme } from "next-themes";

const darkTheme = githubDarkInit({
  settings: {
    background: "hsl(var(--background))",
    lineHighlight: "hsl(var(--accent) / 0.5)",
  },
});

export function SqlTerminal() {
  const pg = usePGlite();
  const { theme } = useTheme();

  return (
    <Repl
      pg={pg}
      border={true}
      lightTheme={githubLight}
      darkTheme={darkTheme}
      theme={theme as ReplTheme}
    />
  );
}
