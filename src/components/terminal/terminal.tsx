"use client";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CodeMirror from "@uiw/react-codemirror";
import { defaultKeymap } from "@codemirror/commands";
import { keymap } from "@codemirror/view";
import { PostgreSQL } from "@codemirror/lang-sql";
import { usePGlite } from "@electric-sql/pglite-react";
import { makeSqlExt } from "./sql-support";
import { getSchema, runQuery } from "./terminal-utils";
import { TerminalResponse } from "./terminal-response";
import type { Response } from "./terminal-types";
import { githubDarkInit, githubLight } from "@uiw/codemirror-theme-github";
import { useTheme } from "next-themes";
import { useTerminal } from "@/context/terminal";
import { PresetContext } from "@/context/preset";
import { useTables } from "@/context/tables";
import { minifySQL } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { TerminalContextMenu } from "./terminal-context-menu";

const baseKeymap = defaultKeymap.filter(({ key }) => key !== "Enter");
const lightTheme = githubLight;
const darkTheme = githubDarkInit({
  settings: {
    background: "hsl(var(--background))",
    lineHighlight: "hsl(var(--accent) / 0.5)",
  },
});

export function Terminal() {
  const { theme } = useTheme();
  const { updateTables } = useTables();
  const { setPreset } = useContext(PresetContext);
  const { value, setValue, terminalRef } = useTerminal();
  const [loading, setLoading] = useState(true);
  const [output, setOutput] = useState<Response[]>([]);
  const [schema, setSchema] = useState<Record<string, string[]>>({});
  const valueNoHistory = useRef("");
  const historyPos = useRef(-1);
  const outputRef = useRef<HTMLDivElement>(null);
  const pg = usePGlite();

  useEffect(() => {
    let active = true;
    setLoading(true);

    pg.waitReady.then(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [pg]);

  const handleQuery = async (query: string) => {
    const response = await runQuery(query, pg);
    if (!response.error) {
      setPreset((prev) => ({
        ...prev,
        queries: [...prev.queries, minifySQL(query)],
      }));
      updateTables();
    }
    setOutput((prev) => [...prev, response]);
    outputRef.current?.scrollTo(0, outputRef.current.scrollHeight);
    setSchema(await getSchema(pg));
  };

  const updateHistory = (direction: "up" | "down") => {
    const maxPos = output.length - 1;
    historyPos.current = Math.max(
      -1,
      Math.min(historyPos.current + (direction === "up" ? 1 : -1), maxPos),
    );

    const newValue =
      historyPos.current === -1
        ? valueNoHistory.current
        : output[output.length - historyPos.current - 1].query;

    setValue(newValue);
  };

  const extensions = useMemo(
    () => [
      keymap.of([
        {
          key: "Enter",
          preventDefault: true,
          run: () => {
            if (!value.trim()) return false;
            handleQuery(value);
            historyPos.current = -1;
            valueNoHistory.current = "";
            setValue("");
            return true;
          },
        },
        {
          key: "ArrowUp",
          run: ({ state }) => {
            const line = state.doc.lineAt(state.selection.main.head);
            return line.number === 1 ? (updateHistory("up"), true) : false;
          },
        },
        {
          key: "ArrowDown",
          run: ({ state }) => {
            const line = state.doc.lineAt(state.selection.main.head);
            return line.number === state.doc.lines
              ? (updateHistory("down"), true)
              : false;
          },
        },
        ...baseKeymap,
      ]),
      makeSqlExt({
        dialect: PostgreSQL,
        schema,
        tables: [{ label: "d", displayLabel: "\\d" }],
        defaultSchema: "public",
      }),
    ],
    [pg, schema, value, output.length],
  );

  return (
    <div className="flex h-full w-full flex-col border text-xs">
      <div className="flex-1 overflow-y-auto border-b p-2" ref={outputRef}>
        {loading && <div className="text-border">Loading...</div>}
        {output.map((response, i) => (
          <TerminalResponse key={`${i}-${response.time}`} response={response} />
        ))}
      </div>
      <div className="overflow-y-auto">
      <ContextMenu>
        <ContextMenuTrigger>
          <CodeMirror
            ref={terminalRef}
            className="[&_.cm-gutter.cm-lineNumbers]:min-h-[75px]"
            value={value}
            basicSetup={{ defaultKeymap: false }}
            extensions={extensions}
            theme={theme === "dark" ? darkTheme : lightTheme}
            onChange={useCallback(
              (val: string) => {
                setValue(val);
                historyPos.current === -1 && (valueNoHistory.current = val);
              },
              [setValue],
            )}
            editable={!loading}
            onCreateEditor={() => getSchema(pg).then(setSchema)}
          />
        </ContextMenuTrigger>
        <TerminalContextMenu />
      </ContextMenu>
      </div>
    </div>
  );
}
