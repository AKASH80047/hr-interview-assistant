/** Meetwise shared design tokens. */

export const color = {
  // Main surfaces
  canvas: "var(--mw-canvas)",
  surface: "var(--mw-surface)",
  surfaceAlt: "var(--mw-surface-alt)",

  // Text Hierarchy
  textPrimary: "var(--mw-text-primary)",
  textSecondary: "var(--mw-text-secondary)",
  textTertiary: "var(--mw-text-tertiary)",

  // Strong / dark controls
  primary: "var(--mw-primary)",
  primaryHover: "var(--mw-primary-hover)",
  textOnPrimary: "var(--mw-text-on-primary)",

  // Borders
  border: "var(--mw-border)",
  borderStrong: "var(--mw-border-strong)",

  // Status
  success: "var(--mw-success)",
  successBg: "var(--mw-success-bg)",
  warning: "var(--mw-warning)",
  warningBg: "var(--mw-warning-bg)",
  error: "var(--mw-error)",
  errorBg: "var(--mw-error-bg)",
  info: "var(--mw-info)",
  infoBg: "var(--mw-info-bg)",

  // Legacy / convenience aliases
  textLow: "var(--mw-text-secondary)",
  textMuted: "var(--mw-text-tertiary)",
  accent: "var(--mw-primary)",
  accentSoft: "var(--mw-primary-hover)",
  accentText: "var(--mw-text-on-primary)",
};

export const font = {
  family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

export const spacing = {
  4: "4px",
  8: "8px",
  12: "12px",
  16: "16px",
  20: "20px",
  24: "24px",
  32: "32px",
  40: "40px",
  48: "48px",
};

export const radius = {
  sm: "6px",
  md: "8px",
  lg: "12px",
  xl: "16px",
};

export const shadow = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  card: "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 4px 16px -4px rgba(0, 0, 0, 0.02)",
};

export const s = {
  page: {
    fontFamily: font.family,
    color: color.textPrimary,
    background: color.canvas,
    minHeight: "100vh",
  },

  card: {
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.lg,
    padding: spacing[24],
    boxShadow: shadow.card,
  },

  h1: { fontSize: "28px", fontWeight: 700, color: color.textPrimary, margin: `0 0 ${spacing[16]} 0`, letterSpacing: "-0.02em" },
  h2: { fontSize: "22px", fontWeight: 600, color: color.textPrimary, margin: `0 0 ${spacing[16]} 0`, letterSpacing: "-0.01em" },
  h3: { fontSize: "16px", fontWeight: 600, color: color.textPrimary, margin: `0 0 ${spacing[12]} 0` },
  body: { fontSize: "14px", color: color.textSecondary, lineHeight: 1.5, margin: `0 0 ${spacing[12]} 0` },
  small: { fontSize: "12px", color: color.textTertiary, margin: 0 },

  label: {
    display: "block",
    marginBottom: spacing[8],
    fontSize: "13px",
    color: color.textPrimary,
    fontWeight: 500,
  },

  input: {
    width: "100%",
    padding: `${spacing[8]} ${spacing[12]}`,
    minHeight: "36px",
    boxSizing: "border-box",
    borderRadius: radius.md,
    border: `1px solid ${color.borderStrong}`,
    fontSize: "14px",
    fontFamily: font.family,
    color: color.textPrimary,
    background: color.surface,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },

  buttonPrimary: {
    padding: `0 ${spacing[16]}`,
    minHeight: "36px",
    borderRadius: radius.md,
    border: "none",
    background: color.primary,
    color: color.textOnPrimary,
    fontWeight: 500,
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: font.family,
    transition: "background 0.2s",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[8],
  },

  buttonSecondary: {
    padding: `0 ${spacing[16]}`,
    minHeight: "36px",
    borderRadius: radius.md,
    border: `1px solid ${color.borderStrong}`,
    background: color.surface,
    color: color.textPrimary,
    fontWeight: 500,
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: font.family,
    transition: "background 0.2s",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[8],
  },

  buttonDanger: {
    padding: `0 ${spacing[16]}`,
    minHeight: "36px",
    borderRadius: radius.md,
    border: "none",
    background: color.error,
    color: color.textOnPrimary,
    fontWeight: 500,
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: font.family,
    transition: "background 0.2s",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },

  th: {
    textAlign: "left",
    borderBottom: `1px solid ${color.border}`,
    padding: `${spacing[12]} ${spacing[16]}`,
    fontSize: "12px",
    fontWeight: 500,
    color: color.textTertiary,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },

  td: {
    borderBottom: `1px solid ${color.border}`,
    padding: spacing[16],
    color: color.textPrimary,
  },

  emptyState: {
    textAlign: "center",
    color: color.textSecondary,
    fontSize: "14px",
    padding: spacing[48],
    background: color.surfaceAlt,
    borderRadius: radius.lg,
    border: `1px dashed ${color.borderStrong}`,
  },
};

export function badge(kind) {
  const map = {
    new: {
      bg: color.infoSoft,
      fg: color.info,
    },

    scheduled: {
      bg: color.infoSoft,
      fg: color.info,
    },

    interviewed: {
      bg: color.accentSoft,
      fg: color.accentText,
    },

    hired: {
      bg: color.successSoft,
      fg: color.success,
    },

    rejected: {
      bg: color.alarmSoft,
      fg: color.alarm,
    },

    completed: {
      bg: color.successSoft,
      fg: color.success,
    },

    cancelled: {
      bg: color.neutralSoft,
      fg: color.textLow,
    },

    no_show: {
      bg: color.alarmSoft,
      fg: color.alarm,
    },

    pending: {
      bg: color.neutralSoft,
      fg: color.textLow,
    },

    selected: {
      bg: color.successSoft,
      fg: color.success,
    },

    hold: {
      bg: color.accentSoft,
      fg: color.accentText,
    },
  };

  const { bg, fg } =
    map[kind] ?? {
      bg: color.neutralSoft,
      fg: color.textMid,
    };

  return {
    display: "inline-block",
    background: bg,
    color: fg,
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    textTransform: "capitalize",
  };
}