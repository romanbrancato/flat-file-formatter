import { TerminalTable } from "./terminal-table";
import type { Response } from "./terminal-types";

export const TerminalResponse = ({ response }: { response: Response }) => (
  <>
    {/* Query prompt */}
    <pre className="ml-4 relative before:content-['>'] before:absolute before:-left-4 before:text-border">
      {response.query}
    </pre>

    {/* Response prompt */}
    {response.text && (
      <div className="ml-4 relative before:content-['<'] before:absolute before:-left-4 before:text-border">
        {response.text}
      </div>
    )}

    {response.error ? (
      <div className="ml-4 relative before:content-['!'] before:absolute before:-left-4 before:text-destructive text-destructive">
        {response.error}
      </div>
    ) : (
      response.results?.map((result, i) => (
        <div key={i} className="ml-4 my-2 relative before:content-['<'] before:absolute before:-left-4 before:text-border">
          {result.fields.length ? (
            <TerminalTable result={result} />
          ) : (
            <div className="text-border">null</div>
          )}
        </div>
      ))
    )}

    <div className="flex items-center text-border gap-x-2">
      <hr className="flex-1" />
      <div>{response.time.toFixed(1)}ms</div>
    </div>
  </>
);