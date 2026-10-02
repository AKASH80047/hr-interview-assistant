import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useReminderPolling } from "../hooks/useReminderPolling";
import { color, s } from "../styles/theme";
import { useState, useEffect } from "react";

export default function Layout({ children, navItems = [] }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { reminders = [], permission, requestPermission } = useReminderPolling();
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const current = (navItems || []).find((item) => location.pathname.startsWith(item.to))?.label ?? "Workspace";

  return (
    <div className="hr-shell" style={styles.shell}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="hr-sidebar" style={styles.sidebar}>
          <div style={styles.logo}>
            <span className="hr-brand-symbol" style={{ ...styles.logoMark, fontSize: 20, fontWeight: 800 }}>M</span>
            <span>meetwise</span>
          </div>
          <nav aria-label="Workspace navigation" style={styles.nav}>
            {(navItems || []).map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => isActive ? "active" : ""}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div style={styles.sidebarFooter}>
            <div style={styles.userName}>{user?.full_name || user?.name || user?.email || "Workspace User"}</div>
            <button onClick={logout} style={styles.logoutButton}>Log out</button>
          </div>
        </aside>
      )}

      <div className="hr-main" style={styles.main}>
        <header className="workspace-topbar" style={styles.topbar}>
          <div className="workspace-topbar-inner" style={styles.topbarInner}>
            <div className="workspace-topbar-title" style={styles.topbarTitle}>
              {isMobile && <span className="hr-brand-symbol" style={{ ...styles.logoMark, width: 24, height: 24, marginRight: 8, fontSize: 14, fontWeight: 800 }}>M</span>}
              <strong>{current}</strong>
            </div>
            <div className="workspace-topbar-actions" style={styles.topbarActions}>
              {(reminders?.length ?? 0) > 0 && <span style={styles.bell}>● {reminders.length}</span>}
              {!isMobile && permission !== "granted" && permission !== "unsupported" && (
                <button onClick={requestPermission} style={s.buttonSecondary}>Enable notifications</button>
              )}
              {isMobile && <button onClick={logout} style={{ ...s.buttonSecondary, padding: "4px 8px", minHeight: 28 }}>Logout</button>}
            </div>
          </div>
        </header>

        <div className="hr-content" style={styles.content}>
          {children}
        </div>
      </div>
      
      {/* Mobile Bottom Nav */}
      {isMobile && (
        <nav style={styles.bottomNav}>
          {(navItems || []).map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} style={({ isActive }) => isActive ? { ...styles.bottomNavItem, ...styles.bottomNavItemActive } : styles.bottomNavItem}>
              <span style={styles.bottomNavLabel}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}

const styles = {
  shell: { display: "flex", minHeight: "100vh", fontFamily: s.page.fontFamily, background: color.canvas },
  sidebar: { flexShrink: 0, display: "flex", flexDirection: "column", width: 248, background: color.surface, borderRight: `1px solid ${color.border}`, padding: "24px 16px" },
  logo: { display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 18, marginBottom: 32, padding: "0 8px" },
  logoMark: { display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 11, background: color.accent, color: "#fff" },
  nav: { display: "flex", flexDirection: "column", gap: 6 },
  sidebarFooter: { marginTop: "auto", paddingTop: 16, borderTop: `1px solid ${color.border}` },
  userName: { fontSize: 13, fontWeight: 700, marginBottom: 12, padding: "0 8px" },
  logoutButton: { ...s.buttonSecondary, width: "100%" },
  
  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0, paddingBottom: 60 },
  topbar: { position: "sticky", top: 0, zIndex: 20, background: "rgba(24, 24, 27, 0.8)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${color.border}`, padding: "0 24px", minHeight: 64, display: "flex", alignItems: "center" },
  topbarInner: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" },
  topbarTitle: { display: "flex", alignItems: "center", fontSize: 16, fontWeight: 700 },
  topbarActions: { display: "flex", alignItems: "center", gap: 12 },
  bell: { padding: "4px 8px", borderRadius: 999, background: color.accentSoft, color: color.accentText, fontSize: 12, fontWeight: 700 },
  
  content: { flex: 1, padding: "24px", maxWidth: 1200, margin: "0 auto", width: "100%", boxSizing: "border-box" },
  
  bottomNav: { position: "fixed", bottom: 0, left: 0, right: 0, background: color.surface, borderTop: `1px solid ${color.border}`, display: "flex", justifyContent: "space-around", padding: "8px 0", paddingBottom: "env(safe-area-inset-bottom, 8px)", zIndex: 30 },
  bottomNavItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 12px", color: color.textLow, textDecoration: "none", borderRadius: 8 },
  bottomNavItemActive: { color: color.accentText, background: color.accentSoft },
  bottomNavLabel: { fontSize: 11, fontWeight: 600 },
};
