"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Zap,
  User,
  GraduationCap,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */
interface ApplicationEntryProps {
  onAnalysisComplete: (data: unknown) => void;
}


/* ─── Constants ──────────────────────────────────────────────── */
const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

const MOCK_JOB_DESCRIPTION = {
  role: "Senior Frontend Engineer",
  company: "Xobin",
  location: "Remote · India",
  type: "Full-time",
  salary: "₹30L – ₹55L",
  summary:
    "We're looking for a craftsperson who loves turning complex problems into beautiful, intuitive UIs. You'll be embedded in our core product team, shaping the experience for thousands of candidates and hiring managers.",
  responsibilities: [
    "Lead the architecture of our next-generation candidate portal built on Next.js 14 and TypeScript.",
    "Establish design system standards using Tailwind CSS with a focus on accessibility and consistency.",
    "Drive performance culture — own Core Web Vitals and build real-time features using WebSockets.",
    "Mentor 2–3 junior engineers through code reviews and pairing sessions.",
    "Collaborate directly with design and product to shape the product roadmap.",
  ],
  requirements: [
    "5+ years of professional frontend development experience.",
    "Deep expertise in React (hooks, context, server components) and TypeScript.",
    "Production experience with Next.js App Router and SSR/SSG patterns.",
    "Strong command of CSS-in-JS, Tailwind, or design tokens.",
    "Familiarity with Framer Motion, GSAP, or other animation libraries.",
  ],
  niceToHave: [
    "Contributions to open-source projects.",
    "Experience with AI/ML product integrations.",
    "Prior startup or fast-growth company experience.",
  ],
};

/* ─── Server‑side PDF extraction via /api/parse-pdf ───────────────────── */
async function parsePdfOnServer(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const response = await fetch("/api/parse-pdf", {
    method: "POST",
    body: form,
  });

  const rawText = await response.text();

  if (!response.ok) {
    let errMsg = `Server returned ${response.status}`;
    try {
      const parsed = JSON.parse(rawText);
      if (parsed?.error) errMsg = parsed.error;
    } catch {
      if (rawText) errMsg = rawText;
    }
    throw new Error(errMsg);
  }

  const data = JSON.parse(rawText) as { text?: string };
  return data?.text ?? "";
}

/* ─── Micro components ───────────────────────────────────────── */

const GlowDot = () => (
  <span className="relative flex h-2 w-2">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
  </span>
);

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full bg-zinc-800/80 px-3 py-1 text-xs font-medium text-zinc-300 border border-zinc-700/50">
    {children}
  </span>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
    {children}
  </p>
);

const BulletItem = ({ text }: { text: string }) => (
  <li className="flex items-start gap-3 text-sm leading-relaxed text-zinc-300">
    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-violet-400/70" />
    {text}
  </li>
);

/* ─── Left Panel: Job Description ───────────────────────────── */
const JobDescriptionPanel = () => {
  const jd = MOCK_JOB_DESCRIPTION;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col lg:h-full">
      {/* Ambient gradient – fixed */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-violet-950/30 to-transparent z-10"
      />
      {/* Content: flows on mobile, scrolls on desktop */}
      <div className="relative flex-1 overflow-y-auto scrollbar-hide px-4 py-8 sm:px-6 sm:py-10 lg:overflow-y-auto lg:px-12 lg:py-12">
        {/* Header */}
        <div>
          <div className="mb-6 flex items-center gap-2">
            <GlowDot />
            <span className="text-xs font-medium text-emerald-400">Now Hiring</span>
          </div>

          <h1 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {jd.role}
          </h1>
          <p className="mb-6 text-base font-medium text-zinc-400">{jd.company}</p>

          <div className="mb-8 flex flex-wrap gap-2">
            <Tag>📍 {jd.location}</Tag>
            <Tag>⏱ {jd.type}</Tag>
            <Tag>💰 {jd.salary}</Tag>
          </div>

          <div className="mb-8 h-px bg-gradient-to-r from-violet-500/30 via-zinc-700/50 to-transparent" />
        </div>

        {/* Summary */}
        <div className="mb-8">
          <SectionLabel>About the Role</SectionLabel>
          <p className="text-sm leading-7 text-zinc-400">{jd.summary}</p>
        </div>

        {/* Responsibilities */}
        <div className="mb-8">
          <SectionLabel>What You'll Do</SectionLabel>
          <ul className="space-y-3">
            {jd.responsibilities.map((r, i) => (
              <BulletItem key={i} text={r} />
            ))}
          </ul>
        </div>

        {/* Requirements */}
        <div className="mb-8">
          <SectionLabel>Requirements</SectionLabel>
          <ul className="space-y-3">
            {jd.requirements.map((r, i) => (
              <BulletItem key={i} text={r} />
            ))}
          </ul>
        </div>

        {/* Nice to have */}
        <div className="pb-4">
          <SectionLabel>Nice to Have</SectionLabel>
          <ul className="space-y-3">
            {jd.niceToHave.map((r, i) => (
              <BulletItem key={i} text={r} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

/* ─── Right Panel: Application Form ─────────────────────────── */
const ApplicationFormPanel = ({
  onAnalysisComplete,
}: {
  onAnalysisComplete: (data: unknown) => void;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isReady =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    college.trim().length > 0 &&
    gradYear.length > 0 &&
    resumeText.length > 0;

  /* ── Handle file selection: POST to /api/parse, save to resumeText ── */
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = ""; // Reset so same file can be re-selected
      if (!file) return;

      setIsParsing(true);
      setParseError(null);
      setSubmitError(null);

      try {
        const text = await parsePdfOnServer(file);
        if (!text || text.trim().length < 20) {
          throw new Error("No readable text found. Is this a scanned PDF?");
        }
        setResumeText(text);
        setFileName(file.name);
        setParseError(null);
      } catch {
        setParseError("Resource issue. Please try again later.");
        setResumeText("");
        setFileName(null);
      } finally {
        setIsParsing(false);
      }
    },
    []
  );

  const handleRemoveResume = useCallback(() => {
    setResumeText("");
    setFileName(null);
    setParseError(null);
    setSubmitError(null);
  }, []);

  /* ── Submit: same logic – email, jobDescription, resumeText to n8n webhook ── */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isReady || isSubmitting) return;

      setIsSubmitting(true);
      setSubmitError(null);

      if (!WEBHOOK_URL) {
        setSubmitError("Resource issue. Please try again later.");
        setIsSubmitting(false);
        return;
      }

      try {
        const response = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            name: name.trim(),
            college: college.trim(),
            gradYear,
            resumeText,
            jobDescription: MOCK_JOB_DESCRIPTION,
          }),
        });

        const rawText = await response.text();

        if (!response.ok) {
          throw new Error("RESOURCE_ISSUE");
        }

        let data: unknown;
        try {
          data = rawText.trim() ? JSON.parse(rawText) : {};
        } catch {
          throw new Error("RESOURCE_ISSUE");
        }

        console.log("[System] Application submitted successfully");
        onAnalysisComplete(data);
      } catch {
        setSubmitError("Resource issue. Please try again later.");
        setIsSubmitting(false);
      }
    },
    [name, email, college, gradYear, resumeText, isReady, isSubmitting, onAnalysisComplete]
  );

  return (
    <div className="flex min-h-0 flex-1 items-start justify-center py-8 pb-12 pt-6 sm:items-center sm:py-10 sm:pb-16 lg:min-h-0 lg:items-center lg:py-10">
      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-violet-600/8 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Glass card */}
        <div className="w-full rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5 shadow-2xl backdrop-blur-xl sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-7">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h2 className="mb-1.5 text-xl font-bold tracking-tight text-white">
              Apply with AI X-Ray
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              Upload your resume PDF and our AI will evaluate your fit in seconds.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Row 1: Name + Email */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="group">
                <label
                  htmlFor="application-name"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500 transition-colors group-focus-within:text-violet-400"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <User className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-violet-400" />
                  </div>
                  <input
                    id="application-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                    autoComplete="name"
                    className="w-full rounded-xl border border-zinc-700/60 bg-zinc-800/50 py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:border-violet-500/70 focus:bg-zinc-800/80 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="group">
                <label
                  htmlFor="application-email"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500 transition-colors group-focus-within:text-violet-400"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Mail className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-violet-400" />
                  </div>
                  <input
                    id="application-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                    autoComplete="email"
                    className="w-full rounded-xl border border-zinc-700/60 bg-zinc-800/50 py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:border-violet-500/70 focus:bg-zinc-800/80 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: College + Grad Year */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="group">
                <label
                  htmlFor="application-college"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500 transition-colors group-focus-within:text-violet-400"
                >
                  College / University
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <GraduationCap className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-violet-400" />
                  </div>
                  <input
                    id="application-college"
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="Enter college or university name"
                    disabled={isSubmitting}
                    autoComplete="organization"
                    className="w-full rounded-xl border border-zinc-700/60 bg-zinc-800/50 py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:border-violet-500/70 focus:bg-zinc-800/80 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="group">
                <label
                  htmlFor="application-grad-year"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500 transition-colors group-focus-within:text-violet-400"
                >
                  Graduation Year
                </label>
                <select
                  id="application-grad-year"
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full appearance-none rounded-xl border border-zinc-700/60 bg-zinc-800/50 py-3 pl-4 pr-10 text-sm text-white outline-none transition-all duration-200 focus:border-violet-500/70 focus:bg-zinc-800/80 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-zinc-800 [&>option]:text-white"
                >
                  <option value="">Select graduation year</option>
                  {[2024, 2025, 2026, 2027, 2028].map((year) => (
                    <option key={year} value={String(year)}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* PDF Upload – simple file input */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Resume PDF
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={isSubmitting || isParsing}
                className="block w-full max-w-full text-sm text-zinc-400 file:mr-2 file:max-w-[50%] file:truncate file:rounded-lg file:border-0 file:bg-violet-500/20 file:px-3 file:py-2 file:text-sm file:font-medium file:text-violet-300 sm:file:mr-4 sm:file:max-w-none hover:file:bg-violet-500/30"
              />
              {isParsing && (
                <p className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Reading document…
                </p>
              )}
              {parseError && (
                <div className="mt-2 flex flex-col gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
                  <p className="flex items-center gap-2 text-xs font-medium text-red-400">
                    <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                    {parseError}
                  </p>
                  <button
                    type="button"
                    onClick={handleRemoveResume}
                    className="mt-1 self-start rounded border border-zinc-700/50 bg-zinc-800/50 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-700/50"
                  >
                    Try again
                  </button>
                </div>
              )}
              {fileName && resumeText && !parseError && (
                <p className="mt-2 flex items-center gap-2 overflow-hidden text-xs text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{fileName}</span>
                  <span className="shrink-0">– {resumeText.trim().split(/\s+/).filter(Boolean).length} words</span>
                </p>
              )}
            </div>

            {/* Submit error */}
            <AnimatePresence>
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3"
                >
                  <p className="flex items-center gap-2 text-xs font-medium text-red-400">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    {submitError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.button
              id="application-submit-btn"
              type="submit"
              disabled={!isReady || isSubmitting}
              whileHover={isReady && !isSubmitting ? { scale: 1.015 } : {}}
              whileTap={isReady && !isSubmitting ? { scale: 0.985 } : {}}
              className="relative z-10 w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 [touch-action:manipulation]"
              style={{
                background: isSubmitting
                  ? "linear-gradient(135deg, #4c1d95, #3730a3)"
                  : "linear-gradient(135deg, #7c3aed, #4f46e5)",
                boxShadow:
                  isReady && !isSubmitting
                    ? "0 0 24px rgba(124,58,237,0.35), 0 4px 16px rgba(79,70,229,0.3)"
                    : "none",
              }}
            >
              {/* Shimmer sweep on idle ready state */}
              {!isSubmitting && isReady && (
                <motion.div
                  className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
                />
              )}

              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center justify-center gap-2.5"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing…
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    Submit Application
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          <p className="mt-6 text-center text-[11px] leading-5 text-zinc-600">
            Your resume is processed securely. We never store your file.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────── */
export default function ApplicationEntry({ onAnalysisComplete }: ApplicationEntryProps) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-zinc-950 font-sans lg:h-screen lg:overflow-hidden">
      {/* Background radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-full w-1/2 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 20%, rgb(109,40,217), transparent)",
        }}
      />

      {/* ── Nav bar ── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 shrink-0 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md"
      >
        <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="truncate text-sm font-semibold tracking-tight text-white">Xobin</span>
            <span className="hidden text-zinc-600 sm:inline">/</span>
            <span className="hidden truncate text-sm text-zinc-400 sm:inline">Application X-Ray</span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <GlowDot />
            <span className="hidden text-xs text-zinc-500 sm:inline">AI Model Active</span>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile: stacked, document scrolls | Desktop: side-by-side grid ── */}
      <div className="mx-auto flex w-full flex-col lg:grid lg:h-[calc(100vh-56px)] lg:max-w-screen-2xl lg:grid-cols-2 lg:overflow-hidden lg:divide-x lg:divide-zinc-800/50">
        {/* Left — Job Description */}
        <section
          aria-label="Job Description"
          className="min-h-0 flex-1 lg:overflow-hidden"
        >
          <JobDescriptionPanel />
        </section>

        {/* Right — Application Form */}
        <section
          aria-label="Application Form"
          className="relative flex min-h-0 flex-1 flex-col lg:overflow-hidden"
        >
          <ApplicationFormPanel onAnalysisComplete={onAnalysisComplete} />
        </section>
      </div>
    </div>
  );
}
