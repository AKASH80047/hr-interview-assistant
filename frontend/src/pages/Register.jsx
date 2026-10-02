import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ThemeToggle } from "../components/ThemeToggle";
import { authApi } from "../api/auth";
import { color, font, radius, spacing } from "../styles/theme";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("register");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const update = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register(form.email, form.password, form.fullName);
      setStep("verify");
      setSuccess("Your account was created. We sent a 6-digit verification code to your email.");
    } catch (err) {
      setError(err?.message || "Unable to create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      await authApi.verifyOtp({ email: form.email, otp });
      setSuccess("Email verified successfully. Redirecting...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 700);
    } catch (err) {
      setError(err?.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setError("");
    setSuccess("");
    setResending(true);
    try {
      const response = await authApi.resendOtp({ email: form.email });
      setSuccess(response?.data?.message || "A new verification code has been sent.");
      setOtp("");
    } catch (err) {
      setError(err?.message || "Unable to resend the verification code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.themeToggleContainer}>
        <ThemeToggle />
      </div>

      <div style={styles.contentWrapper}>
        <div style={styles.brandContainer}>
          <div style={{...styles.logoMark, color: "white", fontSize: 20, fontWeight: 800}}>M</div>
          <h1 style={styles.brandTitle}>meetwise</h1>
        </div>

        <div style={styles.card}>
          {step === "register" ? (
            <>
              <div style={styles.cardHeader}>
                <h2 style={styles.welcomeText}>Create your workspace</h2>
                <p style={styles.subtitle}>Set up your account and start organizing interviews</p>
              </div>

              <form onSubmit={submit} style={styles.form}>
                {error && <div style={styles.error}>{error}</div>}

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    name="fullName"
                    type="text"
                    required
                    style={styles.input}
                    value={form.fullName}
                    onChange={update}
                    placeholder="Your name"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Work Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    style={styles.input}
                    value={form.email}
                    onChange={update}
                    placeholder="you@company.com"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Password</label>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    style={styles.input}
                    value={form.password}
                    onChange={update}
                    placeholder="At least 8 characters"
                  />
                </div>

                <button type="submit" disabled={loading} style={styles.button}>
                  {loading ? "Creating workspace..." : "Create Workspace"}
                </button>
              </form>

              <p style={styles.registerPrompt}>
                Already have an account? <Link to="/login" style={styles.registerLink}>Sign in</Link>
              </p>
            </>
          ) : (
            <>
              <div style={styles.cardHeader}>
                <h2 style={styles.welcomeText}>Check your inbox</h2>
                <p style={styles.subtitle}>
                  Enter the 6-digit verification code we sent to <strong style={{ color: color.textPrimary }}>{form.email}</strong>.
                </p>
              </div>

              <form onSubmit={verifyOtp} style={styles.form}>
                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Verification Code</label>
                  <input
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    required
                    maxLength={6}
                    style={{ ...styles.input, textAlign: "center", fontSize: "24px", letterSpacing: "4px", padding: spacing[16] }}
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setOtp(val);
                      if (error) setError("");
                    }}
                    placeholder="000000"
                  />
                </div>

                <button type="submit" disabled={loading || otp.length !== 6} style={styles.button}>
                  {loading ? "Verifying..." : "Verify Email"}
                </button>
              </form>

              <div style={{ marginTop: spacing[24], textAlign: "center" }}>
                <button type="button" onClick={resendOtp} disabled={resending} style={styles.linkButton}>
                  {resending ? "Sending..." : "Resend verification code"}
                </button>
              </div>

              <p style={styles.registerPrompt}>
                Entered the wrong email?{" "}
                <button
                  type="button"
                  style={styles.linkButton}
                  onClick={() => {
                    setStep("register");
                    setOtp("");
                    setError("");
                    setSuccess("");
                  }}
                >
                  Go back
                </button>
              </p>
            </>
          )}
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
    textDecoration: "none",
    display: "block",
    textAlign: "center",
    width: "100%",
    boxSizing: "border-box",
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
  success: {
    padding: spacing[12],
    background: color.successBg,
    color: color.success,
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
  linkButton: {
    background: "none",
    border: "none",
    color: color.primary,
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    padding: 0,
  },
};