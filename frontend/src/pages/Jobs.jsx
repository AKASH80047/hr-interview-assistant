import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { color, s } from "../styles/theme";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", department: "", status: "draft" });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await api.get("/jobs");
      setJobs(data);
    } catch (err) {
      setError(err.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const created = await api.post("/jobs", newJob);
      setJobs([created, ...jobs]);
      setIsCreating(false);
      setNewJob({ title: "", department: "", status: "draft" });
    } catch (err) {
      alert("Failed to create job: " + (err.message || "Unknown error"));
    }
  };

  if (loading) return <div>Loading jobs...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={s.h1}>Jobs</h1>
        <button style={s.buttonPrimary} onClick={() => setIsCreating(true)}>
          + New Job
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {isCreating && (
        <form style={styles.createForm} onSubmit={handleCreateJob}>
          <h3 style={s.h3}>Create New Job</h3>
          <div style={styles.inputGroup}>
            <label style={s.label}>Title</label>
            <input
              style={s.input}
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              required
              autoFocus
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={s.label}>Department</label>
            <input
              style={s.input}
              value={newJob.department}
              onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
            />
          </div>
          <div style={styles.actions}>
            <button type="submit" style={s.buttonPrimary}>Create</button>
            <button type="button" style={s.buttonSecondary} onClick={() => setIsCreating(false)}>Cancel</button>
          </div>
        </form>
      )}

      {jobs.length === 0 && !isCreating ? (
        <div style={styles.empty}>
          <p>No jobs found. Create one to get started.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {jobs.map((job) => (
            <Link key={job.id} to={`/jobs/${job.id}`} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={s.h3}>{job.title}</h3>
                <span style={styles.badge}>{job.status}</span>
              </div>
              <div style={styles.cardBody}>
                <p><strong>Department:</strong> {job.department || "N/A"}</p>
                <p><strong>Created:</strong> {new Date(job.created_at).toLocaleDateString()}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  error: {
    color: color.error,
    background: color.errorBg,
    padding: "16px",
    borderRadius: "8px",
    border: `1px solid ${color.border}`,
  },
  createForm: {
    background: color.surface,
    padding: "24px",
    borderRadius: "12px",
    border: `1px solid ${color.border}`,
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
  },
  empty: {
    textAlign: "center",
    padding: "48px",
    color: color.textSecondary,
    background: color.surfaceAlt,
    borderRadius: "12px",
    border: `1px dashed ${color.borderStrong}`,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: "12px",
    padding: "24px",
    textDecoration: "none",
    color: color.textPrimary,
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
    gap: "12px",
  },
  cardBody: {
    color: color.textSecondary,
    fontSize: "14px",
    lineHeight: 1.6,
  },
  badge: {
    background: color.infoBg,
    color: color.info,
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "capitalize",
    flexShrink: 0,
  }
};
