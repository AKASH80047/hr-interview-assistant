import { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { interviewsApi } from "../api/interviews";
import { candidatesApi } from "../api/candidates";
import { useApi } from "../hooks/useApi";
import { useCountdown, formatLocalDateTime } from "../hooks/useCountdown";
import InterviewForm from "../components/InterviewForm";
import ReminderAlert from "../components/ReminderAlert";
import { color, s, badge } from "../styles/theme";

function InterviewRow({ interview }) {
  const countdown = useCountdown(interview.scheduled_at);
  const { date, time } = formatLocalDateTime(interview.scheduled_at);
  
  return (
    <Link to={`/interviews/${interview.id}`} style={styles.interviewRow}>
      <div style={styles.rowSection}>
        <strong style={{ fontSize: "14px", color: color.textPrimary }}>{time}</strong>
        <span style={{ fontSize: "12px", color: color.textSecondary }}>{date}</span>
      </div>
      
      <div style={styles.verticalRule} />
      
      <div style={{ ...styles.rowSection, flex: 2 }}>
        <strong style={{ fontSize: "14px", color: color.textPrimary }}>{interview.candidate_name}</strong>
        <span style={{ fontSize: "12px", color: color.textSecondary }}>{interview.interviewer || "Interviewer not assigned"}</span>
      </div>
      
      <div style={{ ...styles.rowSection, flex: 1 }}>
        <span style={{ fontSize: "13px", color: color.textPrimary, textTransform: "capitalize" }}>{interview.interview_type}</span>
        <span style={{ fontSize: "12px", color: color.textSecondary }}>{interview.duration_minutes} min</span>
      </div>
      
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px" }}>
        {interview.status === "scheduled" && <span style={{ fontSize: "12px", color: color.info, fontWeight: 500 }}>{countdown}</span>}
        <span style={badge(interview.status)}>{interview.status.replaceAll("_", " ")}</span>
      </div>
    </Link>
  );
}

function InterviewGroup({ title, eyebrow, interviews, emptyTitle, emptyText }) {
  return (
    <section style={styles.groupCard}>
      <header style={styles.groupHeader}>
        <div>
          <span style={styles.eyebrow}>{eyebrow}</span>
          <h2 style={{ margin: "4px 0 0", fontSize: "18px", color: color.textPrimary }}>{title}</h2>
        </div>
        <span style={styles.countBadge}>{interviews.length}</span>
      </header>
      
      {interviews.length ? (
        <div style={styles.list}>
          {interviews.map((interview) => (
            <InterviewRow key={interview.id} interview={interview} />
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <strong>{emptyTitle}</strong>
          <p>{emptyText}</p>
        </div>
      )}
    </section>
  );
}

export default function Interviews({ reminders = [], onAcknowledge }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const preselectedCandidateId = searchParams.get("candidate");
  
  const { data: interviews, error, loading, refetch } = useApi(interviewsApi.list, []);
  const { data: candidates, loading: candidatesLoading, error: candidatesError } = useApi(candidatesApi.list, []);
  
  const [showForm, setShowForm] = useState(Boolean(preselectedCandidateId || location.state?.openSchedule));
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);

  const { upcoming, completed, previous } = useMemo(() => {
    const now = Date.now();
    const upcomingInterviews = (interviews ?? []).filter((interview) => interview.status === "scheduled" && new Date(interview.scheduled_at).getTime() > now)
      .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
    const upcomingIds = new Set(upcomingInterviews.map((interview) => interview.id));
    
    const previousInterviews = (interviews ?? []).filter((interview) => !upcomingIds.has(interview.id) && interview.status !== "completed")
      .sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at));
      
    const completedInterviews = (interviews ?? []).filter((interview) => interview.status === "completed")
      .sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at));
      
    return { upcoming: upcomingInterviews, completed: completedInterviews, previous: previousInterviews };
  }, [interviews]);

  useEffect(() => {
    if (preselectedCandidateId) setShowForm(true);
  }, [preselectedCandidateId]);

  async function handleCreate(payload) {
    setSubmitting(true);
    setActionError(null);
    try {
      await interviewsApi.create(payload);
      setShowForm(false);
      await refetch();
    } catch (err) {
      setActionError(err.message ?? "Could not schedule the interview.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <span style={styles.eyebrow}>CONVERSATIONS & FOLLOW-THROUGH</span>
          <h1 style={s.h1}>Interviews</h1>
          <p style={{ color: color.textSecondary, marginTop: "8px" }}>Coordinate the conversation and keep every next step clear.</p>
        </div>
        {!showForm && candidates?.length > 0 && (
          <button style={s.buttonPrimary} onClick={() => setShowForm(true)}>
            ＋ Schedule Interview
          </button>
        )}
      </header>

      {!candidatesLoading && !candidatesError && !candidates?.length && !showForm && (
        <div style={styles.emptyStateContainer}>
          <div style={styles.emptyState}>
            <strong>Add a candidate before scheduling</strong>
            <p>Interviews are linked to candidate profiles so their preparation and feedback stay together.</p>
          </div>
          <Link to="/candidates" state={{ openCreate: true }} style={s.buttonSecondary}>
            Add candidate →
          </Link>
        </div>
      )}
      
      {candidatesError && <p style={styles.error} role="alert">{candidatesError}</p>}

      {showForm && (
        <div style={s.card}>
          <InterviewForm
            candidates={candidates ?? []}
            preselectedCandidateId={preselectedCandidateId}
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            submitting={submitting}
          />
        </div>
      )}

      {actionError && <p style={styles.error} role="alert">{actionError}</p>}
      {loading && <div style={{ color: color.textSecondary }}>Loading interviews…</div>}
      {error && <p style={styles.error} role="alert">{error}</p>}

      {!loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {reminders.length > 0 && (
            <section style={styles.groupCard}>
              <header style={styles.groupHeader}>
                <div>
                  <span style={styles.eyebrow}>NEEDS YOUR ATTENTION</span>
                  <h2 style={{ margin: "4px 0 0", fontSize: "18px", color: color.error }}>Pending reminders</h2>
                </div>
                <span style={{ ...styles.countBadge, background: color.errorBg, color: color.error }}>{reminders.length}</span>
              </header>
              {reminders.map((reminder) => (
                <ReminderAlert key={reminder.id} reminder={reminder} onAcknowledge={onAcknowledge} />
              ))}
            </section>
          )}
          
          <InterviewGroup title="Upcoming interviews" eyebrow="ON THE CALENDAR" interviews={upcoming} emptyTitle="Nothing scheduled yet" emptyText={candidates?.length ? "Schedule an interview to see the plan and next steps here." : "Add a candidate first, then schedule the first conversation."} />
          <InterviewGroup title="Completed interviews" eyebrow="FEEDBACK & FOLLOW-THROUGH" interviews={completed} emptyTitle="No completed interviews yet" emptyText="Mark an interview completed to capture HR feedback and prepare a post-interview summary." />
          {previous.length > 0 && <InterviewGroup title="Cancelled, no-show & past" eyebrow="OTHER INTERVIEWS" interviews={previous} emptyTitle="No other interviews" emptyText="Cancelled, no-show, and past interviews appear here." />}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  eyebrow: {
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: color.textTertiary,
  },
  groupCard: {
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  },
  groupHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  countBadge: {
    background: color.surfaceAlt,
    color: color.textSecondary,
    fontSize: "12px",
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: "999px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  interviewRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: "8px",
    textDecoration: "none",
    transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
  },
  rowSection: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  verticalRule: {
    width: "4px",
    height: "36px",
    background: color.border,
    borderRadius: "2px",
    margin: "0 8px",
  },
  emptyStateContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "48px",
    background: color.surfaceAlt,
    border: `1px dashed ${color.borderStrong}`,
    borderRadius: "12px",
  },
  emptyState: {
    textAlign: "center",
    color: color.textSecondary,
    fontSize: "14px",
  },
  error: {
    color: color.error,
    background: color.errorBg,
    padding: "12px",
    borderRadius: "8px",
    border: `1px solid ${color.error}`,
  }
};
