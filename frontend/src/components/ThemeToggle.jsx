import { useTheme } from "../hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        zIndex: 9999,
        background: "var(--mw-surface)",
        color: "var(--mw-ink)",
        border: "1px solid var(--mw-border-strong)",
        borderRadius: "20px",
        padding: "6px 14px",
        fontSize: "12px",
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "var(--mw-shadow)",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        transition: "all 0.2s ease",
      }}
    >
      {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
