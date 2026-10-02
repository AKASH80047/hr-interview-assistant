// Mock Data Store for GitHub Pages / Offline Demo Mode
const STORAGE_PREFIX = "meetwise_demo_";

const INITIAL_DATA = {
  user: {
    id: 1,
    email: "demo@company.com",
    full_name: "Akash Sharma",
    name: "Akash Sharma",
    organization: "Meetwise HR Labs",
    role: "admin",
  },
  stats: {
    total_candidates: 12,
    active_jobs: 3,
    today_interviews: 2,
    upcoming_interviews: 5,
  },
  jobs: [
    {
      id: 1,
      title: "Senior Full-Stack Engineer",
      department: "Engineering",
      status: "active",
      candidates_count: 8,
      created_at: "2026-09-20T00:00:00Z",
    },
    {
      id: 2,
      title: "Product Designer (UI/UX)",
      department: "Design",
      status: "active",
      candidates_count: 5,
      created_at: "2026-09-22T00:00:00Z",
    },
    {
      id: 3,
      title: "AI / ML Research Engineer",
      department: "AI Labs",
      status: "active",
      candidates_count: 6,
      created_at: "2026-09-25T00:00:00Z",
    },
  ],
  candidates: [
    {
      id: 1,
      name: "Aarav Patel",
      full_name: "Aarav Patel",
      email: "aarav.patel@example.com",
      phone: "+91 98765 43210",
      job_role: "Senior Full-Stack Engineer",
      job_title: "Senior Full-Stack Engineer",
      status: "interviewing",
      stage: "Technical Round",
      ai_score: 92,
      summary: "7+ years React, Node.js, and Distributed Systems experience. Ex-Razorpay.",
      created_at: "2026-10-01T10:00:00Z",
    },
    {
      id: 2,
      name: "Priya Nair",
      full_name: "Priya Nair",
      email: "priya.nair@example.com",
      phone: "+91 98234 56789",
      job_role: "Product Designer (UI/UX)",
      job_title: "Product Designer (UI/UX)",
      status: "interviewed",
      stage: "HR Round",
      ai_score: 88,
      summary: "Figma design system specialist. Led design at high-growth SaaS startups.",
      created_at: "2026-10-01T11:30:00Z",
    },
    {
      id: 3,
      name: "Rohan Mehta",
      full_name: "Rohan Mehta",
      email: "rohan.mehta@example.com",
      phone: "+91 97123 45678",
      job_role: "AI / ML Research Engineer",
      job_title: "AI / ML Research Engineer",
      status: "offered",
      stage: "Offer Extended",
      ai_score: 95,
      summary: "Published research on LLM agents, RAG, and fine-tuning open source models.",
      created_at: "2026-09-28T09:15:00Z",
    },
    {
      id: 4,
      name: "Ananya Gupta",
      full_name: "Ananya Gupta",
      email: "ananya.gupta@example.com",
      phone: "+91 96543 21098",
      job_role: "Senior Full-Stack Engineer",
      job_title: "Senior Full-Stack Engineer",
      status: "interviewing",
      stage: "Screening",
      ai_score: 84,
      summary: "Strong TypeScript and frontend performance optimization background.",
      created_at: "2026-10-02T08:00:00Z",
    },
  ],
  interviews: [
    {
      id: 1,
      candidate_id: 1,
      candidate_name: "Aarav Patel",
      job_title: "Senior Full-Stack Engineer",
      scheduled_at: "2026-10-02T15:30:00Z",
      status: "scheduled",
      round: "Technical Architecture & Coding",
      interviewer: "Akash Sharma",
    },
    {
      id: 2,
      candidate_id: 2,
      candidate_name: "Priya Nair",
      job_title: "Product Designer (UI/UX)",
      scheduled_at: "2026-10-02T17:00:00Z",
      status: "scheduled",
      round: "Design System & Portfolio Review",
      interviewer: "Akash Sharma",
    },
  ],
};

function getStored(key, defaultValue) {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // Ignore storage quota
  }
}

export function handleMockRequest(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  let body = {};
  if (options.body && typeof options.body === "string") {
    try {
      body = JSON.parse(options.body);
    } catch {
      body = {};
    }
  }

  // --- Auth Endpoints ---
  if (path === "/auth/login") {
    return {
      access_token: "demo-jwt-token-meetwise-live",
      token_type: "bearer",
    };
  }

  if (path === "/auth/me") {
    return INITIAL_DATA.user;
  }

  if (path.startsWith("/auth/")) {
    return { message: "Success (Demo Mode)" };
  }

  // --- Dashboard Endpoints ---
  if (path === "/dashboard/stats") {
    const candidates = getStored("candidates", INITIAL_DATA.candidates);
    const jobs = getStored("jobs", INITIAL_DATA.jobs);
    const interviews = getStored("interviews", INITIAL_DATA.interviews);
    return {
      total_candidates: candidates.length,
      active_jobs: jobs.filter((j) => j.status === "active").length,
      today_interviews: interviews.length,
      upcoming_interviews: interviews.length,
    };
  }

  if (path === "/dashboard/pending-feedback") {
    return [];
  }

  // --- Jobs Endpoints ---
  if (path === "/jobs") {
    const jobs = getStored("jobs", INITIAL_DATA.jobs);
    if (method === "POST") {
      const newJob = {
        id: Date.now(),
        title: body.title || "Untitled Role",
        department: body.department || "General",
        status: body.status || "active",
        candidates_count: 0,
        created_at: new Date().toISOString(),
      };
      const updated = [newJob, ...jobs];
      setStored("jobs", updated);
      return newJob;
    }
    return jobs;
  }

  // --- Candidates Endpoints ---
  if (path === "/candidates" || path.startsWith("/candidates?")) {
    const candidates = getStored("candidates", INITIAL_DATA.candidates);
    if (method === "POST") {
      const newCandidate = {
        id: Date.now(),
        name: body.name || body.full_name || "New Candidate",
        full_name: body.full_name || body.name || "New Candidate",
        email: body.email || "candidate@example.com",
        phone: body.phone || "+91 99999 88888",
        job_role: body.job_role || body.job_title || "Senior Full-Stack Engineer",
        job_title: body.job_title || body.job_role || "Senior Full-Stack Engineer",
        status: "interviewing",
        stage: "Screening",
        ai_score: Math.floor(Math.random() * 15) + 85,
        created_at: new Date().toISOString(),
      };
      const updated = [newCandidate, ...candidates];
      setStored("candidates", updated);
      return newCandidate;
    }
    return candidates;
  }

  if (path.startsWith("/candidates/")) {
    const parts = path.split("/");
    const id = parts[2];
    const candidates = getStored("candidates", INITIAL_DATA.candidates);
    const candidate = candidates.find((c) => String(c.id) === String(id)) || candidates[0];

    if (method === "PATCH") {
      const updated = candidates.map((c) =>
        String(c.id) === String(id) ? { ...c, ...body } : c
      );
      setStored("candidates", updated);
      return { ...candidate, ...body };
    }

    if (method === "DELETE") {
      const updated = candidates.filter((c) => String(c.id) !== String(id));
      setStored("candidates", updated);
      return { message: "Candidate removed" };
    }

    if (path.includes("/resumes")) {
      return [];
    }

    return candidate;
  }

  // --- Interviews Endpoints ---
  if (path === "/interviews" || path.startsWith("/interviews?")) {
    const interviews = getStored("interviews", INITIAL_DATA.interviews);
    if (method === "POST") {
      const newInterview = {
        id: Date.now(),
        candidate_id: body.candidate_id || 1,
        candidate_name: body.candidate_name || "Aarav Patel",
        job_title: body.job_title || "Senior Full-Stack Engineer",
        scheduled_at: body.scheduled_at || new Date().toISOString(),
        status: "scheduled",
        round: body.round || "Technical Round",
        interviewer: "Akash Sharma",
      };
      const updated = [newInterview, ...interviews];
      setStored("interviews", updated);
      return newInterview;
    }
    return interviews;
  }

  if (path.startsWith("/interviews/")) {
    const parts = path.split("/");
    const id = parts[2];
    const interviews = getStored("interviews", INITIAL_DATA.interviews);
    return interviews.find((i) => String(i.id) === String(id)) || interviews[0];
  }

  // --- AI Briefing & Notes ---
  if (path.startsWith("/ai/")) {
    return {
      status: "completed",
      content: "Demonstrates strong foundational knowledge in system architecture, microservices, and React performance. Recommended for next stage.",
      error_message: null,
    };
  }

  if (path.startsWith("/notes") || path.startsWith("/questions")) {
    return [];
  }

  // --- Reminders & Notifications ---
  if (path.startsWith("/reminders")) {
    return [];
  }

  return [];
}
