import { Moon, Sun } from "lucide-react";

import { useTheme } from "../../hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button type="button" onClick={toggle} className="btn btn-ghost px-3" aria-label={`Switch to ${next} theme`}>
      {theme === "dark" ? <Sun className="size-5" aria-hidden="true" /> : <Moon className="size-5" aria-hidden="true" />}
    </button>
  );
}
