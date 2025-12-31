import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 hover:text-primary"
            title="Toggle Theme"
        >
            <span className="sr-only">Toggle theme</span>
            {theme === "light" ? (
                <Moon size={20} className="transition-all" />
            ) : (
                <Sun size={20} className="transition-all" />
            )}
        </button>
    );
}
