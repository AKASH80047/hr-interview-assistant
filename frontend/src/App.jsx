import { NavLink, Navigate, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { useReminderPolling } from "./hooks/useReminderPolling";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import CandidateDetail from "./pages/CandidateDetail";
import Interviews from "./pages/Interviews";
import InterviewDetail from "./pages/InterviewDetail";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import { color, s } from "./styles/theme";
import "./styles/workspace.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", end: true },
  { to: "/jobs", label: "Jobs" },
  { to: "/candidates", label: "Candidates" },
  { to: "/interviews", label: "Interviews" },
];

import Layout from "./components/Layout";

function ProtectedShell() {
  const { user, loading } = useAuth();
  const { reminders, acknowledge } = useReminderPolling();

  if (loading) return <div style={styles.loadingScreen}>Loading your workspace…</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <Layout navItems={NAV_ITEMS}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard reminders={reminders} onAcknowledge={acknowledge} />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/candidates/:id" element={<CandidateDetail />} />
        <Route path="/interviews" element={<Interviews reminders={reminders} onAcknowledge={acknowledge} />} />
        <Route path="/interviews/:id" element={<InterviewDetail />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={styles.loadingScreen}>Loading…</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

import { ThemeToggle } from "./components/ThemeToggle";

export default function App() {
  return (
    <AuthProvider>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path="/*" element={<ProtectedShell />} />
      </Routes>
    </AuthProvider>
  );
}

const styles = {
  loadingScreen: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: s.page.fontFamily, color: color.textLow, background: color.canvas },
  shell: { display: "flex", minHeight: "100vh", fontFamily: s.page.fontFamily, background: color.canvas },
  sidebar: { flexShrink: 0, display: "flex", flexDirection: "column" },
  logo: { display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 17, letterSpacing: "-.02em" },
  logoMark: { display: "flex", alignItems: "center", justifyContent: "center" },
  sidebarFooter: { marginTop: "auto" },
  userName: {},
  logoutButton: { cursor: "pointer", fontFamily: s.page.fontFamily },
  main: { flex: 1, minWidth: 0 },
  topbar: { display: "flex", alignItems: "center" },
  content: { flex: 1 },
  bell: { padding: "7px 10px", borderRadius: 999, background: "var(--mw-accent-soft)", color: "var(--mw-accent-strong)", fontSize: 11, fontWeight: 800 },
};
