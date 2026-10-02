import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ThemeToggle } from "../components/ThemeToggle";
import { color, font, radius, spacing } from "../styles/theme";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@company.com");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Invalid credentials. Try demo / demo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <div style={styles.brandContainer}>
          <div style={{...styles.logoMark, color: "white", fontSize: 20, fontWeight: 800}}>M</div>
          <h1 style={styles.brandTitle}>meetwise</h1>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.welcomeText}>Welcome back</h2>
            <p style={styles.subtitle}>Sign in to your workspace</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {error && <div style={styles.error}>{error}</div>}
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                required
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
            </div>
            
            <div style={styles.inputGroup}>
              <div style={styles.labelRow}>
                <label style={styles.label}>Password</label>
              </div>
              <input
                type="password"
                required
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p style={styles.registerPrompt}>
            Don't have an account? <Link to="/register" style={styles.registerLink}>Create workspace</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: font.family,
    background: color.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    padding: spacing[24],
  },
  themeToggleContainer: {
    position: "absolute",
    top: spacing[24],
    right: spacing[24],
    zIndex: 100,
  },
  contentWrapper: {
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  brandContainer: {
    display: "flex",
    alignItems: "center",
    gap: spacing[12],
    marginBottom: spacing[32],
  },
  logoMark: {
    width: "32px",
    height: "32px",
    background: color.primary,
    borderRadius: radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    fontSize: "28px",
    fontWeight: 700,
    margin: 0,
    letterSpacing: "-0.02em",
    color: color.textPrimary,
  },
  card: {
    width: "100%",
    background: color.surface,
    borderRadius: radius.xl,
    padding: spacing[40],
    boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1), 0 0 0 1px " + color.border,
  },
  cardHeader: {
    textAlign: "center",
    marginBottom: spacing[32],
  },
  welcomeText: {
    fontSize: "24px",
    fontWeight: 700,
    color: color.textPrimary,
    margin: `0 0 ${spacing[8]} 0`,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "15px",
    color: color.textSecondary,
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[20],
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[8],
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: "14px",
    fontWeight: 500,
    color: color.textPrimary,
  },
  input: {
    padding: `${spacing[12]} ${spacing[16]}`,
    borderRadius: radius.md,
    border: `1px solid ${color.borderStrong}`,
    background: color.surface,
    color: color.textPrimary,
    fontSize: "15px",
    fontFamily: font.family,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  button: {
    padding: spacing[16],
    borderRadius: radius.md,
    border: "none",
    background: color.primary,
    color: color.textOnPrimary,
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: spacing[8],
    transition: "background 0.2s",
  },
  error: {
    padding: spacing[12],
    background: color.errorBg,
    color: color.error,
    borderRadius: radius.md,
    fontSize: "14px",
    fontWeight: 500,
    textAlign: "center",
  },
  registerPrompt: {
    marginTop: spacing[32],
    textAlign: "center",
    fontSize: "14px",
    color: color.textSecondary,
  },
  registerLink: {
    color: color.primary,
    textDecoration: "none",
    fontWeight: 600,
  },
};
