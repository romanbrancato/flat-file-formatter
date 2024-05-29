"use client";
import { Container } from "@/components/ui/container";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function Header() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <header className="py-3 mb-3 z-10">
      <Container>
        <div className="flex flex-row items-center justify-between">
          <span className="text-md font-medium peer-disabled:cursor-not-allowed">
            .csv Formatter
          </span>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <MoonIcon /> : <SunIcon />}
          </Button>
        </div>
      </Container>
    </header>
  );
}
