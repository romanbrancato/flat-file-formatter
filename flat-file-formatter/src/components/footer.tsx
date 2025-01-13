import { useContext } from "react";
import { DataProcessorContext } from "@/context/data-processor-context";
import { Button } from "@/components/ui/button";

export function Footer() {
  const { isReady, data } = useContext(DataProcessorContext);
  const { focus, setFocus } = useContext(DataProcessorContext);

  return (
    <>
      {isReady && (
        <footer className="sticky bottom-0 mt-auto border-t">
          <div className="flex">
            {Object.keys(data.records).map((tag) => (
              <Button
                key={tag}
                onClick={() => setFocus(tag)}
                className={`rounded-none px-3 py-1.5 shadow-none ${focus !== tag && "bg-background text-muted-foreground hover:bg-accent hover:text-foreground"}`}
              >
                {tag}
              </Button>
            ))}
          </div>
        </footer>
      )}
    </>
  );
}
