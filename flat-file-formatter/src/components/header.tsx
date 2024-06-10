"use client";
import { Container } from "@/components/ui/container";
import { GitHubLogoIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function Header() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="py-3 mb-3 z-10">
      <Container>
        <div className="flex flex-row items-center justify-between">
          <span className="text-md font-medium peer-disabled:cursor-not-allowed">
            Flat File Formatter
          </span>
          <div className="flex flex-row items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                window.open(
                  "https://github.com/romanbrancato/flat-file-formatter",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            >
              <GitHubLogoIcon />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <MoonIcon /> : <SunIcon />}
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
