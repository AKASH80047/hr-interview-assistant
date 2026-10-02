import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Meetwise UI rendering failed:", error, info.componentStack);
  }

  handleReset = () => {
    try {
      localStorage.removeItem("hr_assistant_token");
    } catch {
      // ignore
    }
    this.setState({ hasError: false, error: null });
    window.location.hash = "#/login";
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main role="alert" className="app-error-boundary" style={{ padding: "40px 20px", textAlign: "center", maxWidth: "600px", margin: "40px auto", fontFamily: "sans-serif" }}>
          <span className="workspace-overline" style={{ fontSize: "12px", letterSpacing: "2px", color: "var(--mw-primary)", fontWeight: 700 }}>MEETWISE</span>
          <h1 style={{ fontSize: "24px", margin: "16px 0 8px" }}>This page could not be displayed</h1>
          <p style={{ color: "#888", fontSize: "14px", marginBottom: "24px" }}>
            {this.state.error?.message || "An unexpected error occurred while rendering the workspace."}
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              type="button"
              className="workspace-primary-action"
              onClick={() => window.location.reload()}
              style={{ padding: "10px 20px", borderRadius: "8px", background: "var(--mw-primary)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}
            >
              Reload page
            </button>
            <button
              type="button"
              onClick={this.handleReset}
              style={{ padding: "10px 20px", borderRadius: "8px", background: "transparent", color: "var(--mw-text-primary)", border: "1px solid #ccc", cursor: "pointer", fontWeight: 600 }}
            >
              Reset Session & Sign In
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}