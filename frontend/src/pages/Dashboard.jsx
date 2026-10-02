import { Link } from "react-router-dom";
import { dashboardApi } from "../api/dashboard";
import { candidatesApi } from "../api/candidates";
import { interviewsApi } from "../api/interviews";
import { useAuth } from "../hooks/useAuth";
import { useApi } from "../hooks/useApi";
import { formatLocalDateTime } from "../hooks/useCountdown";
import { color, radius, s, shadow, spacing } from "../styles/theme";

export default function Dashboard({ reminders }) {
  const { user } = useAuth();
  const { data: stats } = useApi(dashboardApi.stats, []);
  const { data: candidates } = useApi(candidatesApi.list, []);
  const { data: interviews } = useApi(interviewsApi.list, []);

  const candidateList = candidates ?? [];
  const interviewList = interviews ?? [];
  const recentCandidates = [...candidateList].slice(0, 5);

  const firstName = user?.full_name?.trim().split(/\s+/)[0] || "User";

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={s.h1}>Welcome back, {firstName}</h1>
          <p style={s.body}>Here's an overview of your hiring pipeline today.</p>
        </div>
        <div style={styles.actions}>
          <Link to="/jobs" style={s.buttonPrimary}>
            Create Job
          </Link>
          <Link to="/candidates" style={s.buttonSecondary}>
            Add Candidate
          </Link>
        </div>
      </header>

      {/* Metrics Row */}
      <section style={styles.metricsRow}>
        <MetricCard label="Total Candidates" value={stats?.total_candidates ?? "0"} />
        <MetricCard label="Active Jobs" value={stats?.active_jobs ?? "0"} />
        <MetricCard label="Interviews Today" value={stats?.today_interviews ?? "0"} />
        <MetricCard label="Upcoming Interviews" value={stats?.upcoming_interviews ?? "0"} />
      </section>

      <div style={styles.grid}>
        {/* Main Column */}
        <div style={styles.mainCol}>
          <section style={s.card}>
            <div style={styles.cardHeader}>
              <h2 style={s.h2}>Recent Candidates</h2>
              <Link to="/candidates" style={s.small}>View all →</Link>
            </div>
            
            {recentCandidates.length === 0 ? (
              <div style={s.emptyState}>No recent candidates. Add someone to get started.</div>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Name</th>
                    <th style={s.th}>Role</th>
                    <th style={s.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCandidates.map((c) => (
                    <tr key={c.id}>
                      <td style={s.td}>
                        <Link style={{ textDecoration: "none", color: color.textPrimary, fontWeight: 500 }} to={`/candidates/${c.id}`}>
                          {c.name}
                        </Link>
                      </td>
                      <td style={s.td}>{c.job_role}</td>
                      <td style={s.td}>
                        <span style={{ ...styles.statusBadge, background: color.infoBg, color: color.info }}>{c.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section style={{ ...s.card, marginTop: spacing[24] }}>
            <div style={styles.cardHeader}>
              <h2 style={s.h2}>Recent Activity</h2>
            </div>
            <div style={s.emptyState}>No recent activity</div>
          </section>
        </div>

        {/* Side Column */}
        <div style={styles.sideCol}>
          <section style={s.card}>
            <div style={styles.cardHeader}>
              <h2 style={s.h2}>Reminders</h2>
            </div>
            {reminders && reminders.length > 0 ? (
              <ul style={styles.list}>
                {reminders.map(r => (
                  <li key={r.id} style={styles.listItem}>
                    <strong>{r.title}</strong>
                    <span style={s.small}>{r.message}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={s.emptyState}>You're all caught up.</div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div style={styles.metricCard}>
      <div style={styles.metricLabel}>{label}</div>
      <div style={styles.metricValue}>{value}</div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[32],
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: spacing[16],
  },
  actions: {
    display: "flex",
    gap: spacing[12],
  },
  metricsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: spacing[16],
  },
  metricCard: {
    ...s.card,
    padding: spacing[20],
  },
  metricLabel: {
    fontSize: "13px",
    color: color.textSecondary,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: spacing[8],
  },
  metricValue: {
    fontSize: "32px",
    fontWeight: 700,
    color: color.textPrimary,
    letterSpacing: "-0.02em",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing[24],
    alignItems: "flex-start",
  },
  mainCol: {
    display: "flex",
    flexDirection: "column",
    flex: "2 1 500px",
    minWidth: 0,
  },
  sideCol: {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 300px",
    minWidth: 0,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[16],
  },
  statusBadge: {
    padding: `${spacing[4]} ${spacing[8]}`,
    borderRadius: radius.md,
    fontSize: "12px",
    fontWeight: 600,
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: spacing[12],
  },
  listItem: {
    display: "flex",
    flexDirection: "column",
    paddingBottom: spacing[12],
    borderBottom: `1px solid ${color.border}`,
  },
};
// Add responsive rules for grid if needed, though react inline styles make media queries hard. 
// A real app would use CSS-in-JS or regular CSS for media queries.
// To keep it simple, we'll let auto-fit handle the metrics row, and grid template columns for main/side might need handling for small screens.
