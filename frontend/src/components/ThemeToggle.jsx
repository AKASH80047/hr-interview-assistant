import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: "var(--mw-surface)",
        color: "var(--mw-ink)",
        border: "1px solid var(--mw-border-strong)",
        borderRadius: "20px",
        padding: "8px 16px",
        fontSize: "12px",
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "var(--mw-shadow)",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        transition: "all 0.2s ease"
      }}
    >
      {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
