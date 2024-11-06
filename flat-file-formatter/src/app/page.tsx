"use client";
import { useContext, useEffect, useState } from "react";
import { Dropzone } from "@/components/dropzone";
import { ButtonParserConfig } from "@/components/button-parser-config";
import { ParserContext } from "@/context/parser-context";
import { PresetToolbar } from "@/components/preset-toolbar";
import { RecordTable } from "@/components/record-table";
import { FormOutput } from "@/components/forms/form-output";
import { ButtonExportFile } from "@/components/button-export-file";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { ButtonAddField } from "@/components/button-add-field";
import { ButtonRemoveField } from "@/components/button-remove-field";
import { ButtonOperations } from "@/components/button-operations";
import { PresetContext } from "@/context/preset-context";
// import { fromOverpunch, toOverpunch } from "@/lib/utils";
// import Decimal from "decimal.js";

export default function App() {
  const { preset } = useContext(PresetContext);
  const { isReady, data, setParams } = useContext(ParserContext);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!preset.parser || !files.length) return;
    setParams({
      file: files[files.length - 1],
      config: preset.parser,
    });
  }, [files]);

  // useEffect(() => {
  //   function assertEquals(actual: string, expected: string, message?: string) {
  //     if (actual !== expected) {
  //       throw new Error(`Expected "${expected}", but got "${actual}"`);
  //     }
  //   }
  //
  //   function testExtractNoDecimalPositive() {
  //     assertEquals(
  //       fromOverpunch("12345{"),
  //       "1234.50",
  //       "Test extract no decimal positive failed",
  //     );
  //   }
  //
  //   function testExtractNoDecimalNegative() {
  //     assertEquals(
  //       fromOverpunch("12345}"),
  //       "-1234.50",
  //       "Test extract no decimal negative failed",
  //     );
  //   }
  //
  //   function testExtract4DecimalNegative() {
  //     assertEquals(
  //       fromOverpunch("12345}", 4),
  //       "-12.3450",
  //       "Test extract 4 decimal negative failed",
  //     );
  //   }
  //
  //   function testExtract0DecimalNegative() {
  //     assertEquals(
  //       fromOverpunch("12345}", 0),
  //       "-123450",
  //       "Test extract 0 decimal negative failed",
  //     );
  //   }
  //
  //   function testFormatNoDecimalPositive() {
  //     assertEquals(
  //       toOverpunch(1234.5),
  //       "12345{",
  //       "Test format no decimal positive failed",
  //     );
  //   }
  //
  //   function testFormatNoDecimalNegative() {
  //     assertEquals(
  //       toOverpunch(-1234.5),
  //       "12345}",
  //       "Test format no decimal negative failed",
  //     );
  //   }
  //
  //   function testFormat4DecimalNegative() {
  //     assertEquals(
  //       toOverpunch(-12.345, 4),
  //       "12345}",
  //       "Test format 4 decimal negative failed",
  //     );
  //   }
  //
  //   function testFormat0DecimalNegative() {
  //     assertEquals(
  //       toOverpunch(-123450, 0),
  //       "12345}",
  //       "Test format 0 decimal negative failed",
  //     );
  //   }
  //
  //   function testFormat2DecimalRoundDefault() {
  //     assertEquals(
  //       toOverpunch(12.345, 2),
  //       "123E",
  //       "Test format 2 decimal round default failed",
  //     );
  //   }
  //
  //   function testFormat2DecimalNegativeRoundDefault() {
  //     assertEquals(
  //       toOverpunch(-12.345, 2),
  //       "123N",
  //       "Test format 2 decimal negative round default failed",
  //     );
  //   }
  //
  //   function testFormat2DecimalRoundCustom() {
  //     assertEquals(
  //       toOverpunch(12.345, 2, Decimal.ROUND_FLOOR as any),
  //       "123D",
  //       "Test format 2 decimal round custom failed",
  //     );
  //   }
  //
  //   function testFormat2DecimalNegativeRoundCustom() {
  //     assertEquals(
  //       toOverpunch(-12.345, 2, Decimal.ROUND_FLOOR as any),
  //       "123N",
  //       "Test format 2 decimal negative round custom failed",
  //     );
  //   }
  //
  //   function runTests() {
  //     testExtractNoDecimalPositive();
  //     testExtractNoDecimalNegative();
  //     testExtract4DecimalNegative();
  //     testExtract0DecimalNegative();
  //     testFormatNoDecimalPositive();
  //     testFormatNoDecimalNegative();
  //     testFormat4DecimalNegative();
  //     testFormat0DecimalNegative();
  //     testFormat2DecimalRoundDefault();
  //     testFormat2DecimalNegativeRoundDefault();
  //     testFormat2DecimalRoundCustom();
  //     testFormat2DecimalNegativeRoundCustom();
  //
  //     console.log("All tests passed!");
  //   }
  //
  //   runTests();
  // }, []);

  return (
    <main className="flex flex-col gap-y-3">
      <div className="relative flex">
        <div className="absolute left-[80%] top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center rounded-md border border-primary-foreground bg-primary-foreground md:flex-row">
          <ButtonParserConfig />
        </div>
        <Dropzone
          className="z-0 flex-grow"
          onChange={setFiles}
          accept={[".txt", ".csv"]}
        />
      </div>
      <div className="rounded-md border">
        <PresetToolbar />
        <div className="mx-5 my-3 flex flex-col gap-y-2 md:flex-row md:gap-x-3">
          {isReady ? (
            <>
              <div className="flex flex-grow flex-col gap-y-1 overflow-hidden">
                {Object.entries(data.records)
                  .filter(([_, records]) => records.fields.length > 0)
                  .map(([tag, records]) => (
                    <RecordTable
                      key={tag + Date.now()}
                      tag={tag}
                      fields={records.fields}
                      rows={records.rows}
                    />
                  ))}
                <div className="flex flex-row gap-x-1 md:w-2/3">
                  <ButtonAddField />
                  <ButtonRemoveField />
                  <ButtonOperations />
                </div>
              </div>
              <div className="flex min-w-[200px] flex-col gap-y-3">
                <FormOutput />
                <div className="md:mt-auto">
                  <ButtonExportFile files={files} />
                </div>
              </div>
            </>
          ) : (
            <div className="flex w-full items-center justify-center">
              <Alert className="m-3 min-w-fit md:w-1/2">
                <InfoCircledIcon />
                <AlertTitle>No File Uploaded</AlertTitle>
                <AlertDescription>
                  Upload a file above to get started.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
