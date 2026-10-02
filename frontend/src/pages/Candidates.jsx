import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { candidatesApi } from "../api/candidates";
import { useApi } from "../hooks/useApi";
import CandidateForm from "../components/CandidateForm";
import ResumeUploadForm from "../components/ResumeUploadForm";
import { color, s, radius, spacing, shadow } from "../styles/theme";

// Helper for status colors
function getStatusStyle(status) {
  switch (status?.toLowerCase()) {
    case "hired":
    case "offered":
      return { bg: color.successBg, fg: color.success };
    case "interviewed":
    case "interviewing":
      return { bg: color.infoBg, fg: color.info };
    case "rejected":
      return { bg: color.errorBg, fg: color.error };
    default:
      return { bg: color.surfaceAlt, fg: color.textSecondary };
  }
}

export default function Candidates() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showArchived, setShowArchived] = useState(false);
  const { data: candidates, error, loading, refetch } = useApi(() => showArchived ? candidatesApi.archived() : candidatesApi.list(), [showArchived]);
  const [formMode, setFormMode] = useState(location.state?.openCreate ? "create" : null);
  const [showUpload, setShowUpload] = useState(Boolean(location.state?.openUpload));
  const [duplicateCandidate, setDuplicateCandidate] = useState(null);
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);

  const filteredCandidates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return candidates ?? [];
    return (candidates ?? []).filter((c) =>
      [c.name, c.email, c.phone, c.job_role].some((value) => value?.toLowerCase().includes(normalizedQuery))
    );
  }, [candidates, query]);

  async function handleCreate(values) {
    setSubmitting(true);
    try {
      const candidate = await candidatesApi.create(values);
      setDuplicateCandidate(null);
      setFormMode(null);
      if (location.state?.uploadAfterCreate && candidate?.id) {
        navigate(`/candidates/${candidate.id}`, { state: { openResumePicker: true } });
        return;
      }
      await refetch();
    } catch (createError) {
      if (createError.status === 409) {
        try {
          setDuplicateCandidate(await candidatesApi.getByEmail(values.email.trim()));
          setFormMode(null);
          return;
        } catch {
          setActionError("A profile already uses this email, but it is archived. Check Archived Candidates.");
          setFormMode(null);
          return;
        }
      }
      throw createError;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(values) {
    setSubmitting(true);
    try {
      await candidatesApi.update(formMode.id, values);
      setFormMode(null);
      await refetch();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(candidate) {
    if (!window.confirm(`Archive ${candidate.name}?`)) return;
    setActionError(null);
    try {
      await candidatesApi.remove(candidate.id);
      await refetch();
    } catch (deleteError) {
      setActionError(deleteError.message ?? "Failed to delete candidate");
    }
  }

  async function handleRestore(candidate) {
    setActionError(null);
    try {
      await candidatesApi.restore(candidate.id);
      await refetch();
    } catch (restoreError) {
      setActionError(restoreError.message ?? "Could not restore this candidate.");
    }
  }

  function finishUpload(candidateId) {
    setShowUpload(false);
    setDuplicateCandidate(null);
    navigate(`/candidates/${candidateId}`);
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={s.h1}>Candidates</h1>
          <p style={s.body}>Keep profiles, resume context, and interview preparation together.</p>
        </div>
        <div style={styles.actions}>
          <button style={s.buttonSecondary} onClick={() => { setShowArchived(v => !v); setShowUpload(false); setFormMode(null); setDuplicateCandidate(null); }}>
            {showArchived ? "Active candidates" : "Archived candidates"}
          </button>
          <button style={s.buttonSecondary} onClick={() => { setShowUpload(true); setFormMode(null); }}>↑ Upload Resume</button>
          <button style={s.buttonPrimary} onClick={() => { setFormMode("create"); setShowUpload(false); }}>＋ Add Candidate</button>
        </div>
      </header>

      {/* Forms & Notifications */}
      {showUpload && <ResumeUploadForm existingCandidate={duplicateCandidate} onCancel={() => setShowUpload(false)} onComplete={finishUpload} />}
      {formMode === "create" && <CandidateForm onSubmit={handleCreate} onCancel={() => setFormMode(null)} submitting={submitting} />}
      {formMode && formMode !== "create" && <CandidateForm initialValues={formMode} onSubmit={handleUpdate} onCancel={() => setFormMode(null)} submitting={submitting} />}

      {duplicateCandidate && !showUpload && (
        <div style={styles.noticeAlert}>
          <div><strong>A candidate with this email already exists.</strong><br/>{duplicateCandidate.name} · {duplicateCandidate.email}</div>
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <button style={s.buttonSecondary} onClick={() => navigate(`/candidates/${duplicateCandidate.id}`)}>Open Profile</button>
            <button style={s.buttonPrimary} onClick={() => setShowUpload(true)}>Upload Resume</button>
          </div>
        </div>
      )}

      {actionError && <div style={{ ...styles.noticeAlert, background: color.errorBg, color: color.error }}>{actionError}</div>}
      {error && <div style={{ ...styles.noticeAlert, background: color.errorBg, color: color.error }}>{error}</div>}

      {/* Directory section */}
      <section style={s.card}>
        <div style={styles.toolbar}>
          <input 
            type="search" 
            placeholder="Search by name, email, or role..." 
            style={{ ...s.input, maxWidth: 300 }}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <span style={s.small}>{loading ? "Loading..." : `${filteredCandidates.length} candidate(s)`}</span>
        </div>

        {loading ? (
          <div style={s.emptyState}>Loading candidates...</div>
        ) : filteredCandidates.length === 0 ? (
          <div style={s.emptyState}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>＋</div>
            <h3 style={s.h3}>{showArchived ? "No archived candidates" : "No candidates found"}</h3>
            <p style={s.body}>Add a profile or upload a resume to start preparing for a better interview.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Candidate</th>
                  <th style={s.th}>Contact</th>
                  <th style={s.th}>Job Role</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Resume</th>
                  <th style={s.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map(c => {
                  const statusSty = getStatusStyle(c.status);
                  const initials = c.name.split(/\s+/).map(p => p[0]).slice(0, 2).join("").toUpperCase();
                  
                  return (
                    <tr key={c.id} style={{ transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = color.surfaceAlt} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                      <td style={s.td}>
                        <Link style={styles.profileLink} to={`/candidates/${c.id}`}>
                          <div style={styles.avatar}>{initials}</div>
                          <div>
                            <strong>{c.name}</strong>
                          </div>
                        </Link>
                      </td>
                      <td style={s.td}>
                        <div>{c.email}</div>
                        <div style={s.small}>{c.phone || "No phone"}</div>
                      </td>
                      <td style={s.td}>{c.job_role}</td>
                      <td style={s.td}>
                        <span style={{ padding: "4px 8px", borderRadius: radius.md, fontSize: "12px", fontWeight: 600, background: statusSty.bg, color: statusSty.fg }}>
                          {c.status}
                        </span>
                      </td>
                      <td style={s.td}>
                        {c.has_resume ? (
                          <span style={{ color: color.success, fontWeight: 500, fontSize: "13px" }}>✓ On file</span>
                        ) : showArchived ? "—" : (
                          <Link to={`/candidates/${c.id}`} state={{ openResumePicker: true }} style={{ fontSize: "13px", color: color.info, textDecoration: "none", fontWeight: 500 }}>Upload PDF</Link>
                        )}
                      </td>
                      <td style={s.td}>
                        <div style={{ display: "flex", gap: 8 }}>
                          {showArchived ? (
                            <button style={{ ...s.buttonSecondary, padding: "4px 8px", minHeight: 28, fontSize: "12px" }} onClick={() => handleRestore(c)}>Restore</button>
                          ) : (
                            <>
                              <button style={{ ...s.buttonSecondary, padding: "4px 8px", minHeight: 28, fontSize: "12px" }} onClick={() => setFormMode(c)}>Edit</button>
                              <button style={{ ...s.buttonSecondary, padding: "4px 8px", minHeight: 28, fontSize: "12px", color: color.error }} onClick={() => handleDelete(c)}>Archive</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[24],
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
    flexWrap: "wrap",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[16],
    gap: spacing[16],
  },
  noticeAlert: {
    padding: spacing[16],
    background: color.warningBg,
    color: color.warning,
    borderRadius: radius.md,
    border: `1px solid ${color.border}`,
  },
  profileLink: {
    display: "flex",
    alignItems: "center",
    gap: spacing[12],
    textDecoration: "none",
    color: color.textPrimary,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 999,
    background: color.primary,
    color: color.textOnPrimary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 700,
  }
};
