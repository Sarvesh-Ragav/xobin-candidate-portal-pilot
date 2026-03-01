"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Upload,
  X,
  Mail,
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Zap,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */
interface ApplicationEntryProps {
  onAnalysisComplete: (data: unknown) => void;
}

type UploadState =
  | { status: "idle" }
  | { status: "parsing"; fileName: string }
  | { status: "ready"; fileName: string; text: string; wordCount: number }
  | { status: "error"; fileName: string; message: string };

/* ─── Constants ──────────────────────────────────────────────── */
const WEBHOOK_URL =
  "https://sarveshragav123.app.n8n.cloud/webhook/99a4a459-2aa0-4b0c-9520-ff31fdd80c5b";

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
  // Build FormData with the PDF file
  const form = new FormData();
  form.append("file", file);

  const response = await fetch("/api/parse-pdf", {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `Server returned ${response.status}`);
  }

  const data = await response.json();
  // Expected shape: { text: string }
  return data.text ?? "";
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
    <div className="relative flex h-full flex-col">
      {/* Ambient gradient – fixed */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-violet-950/30 to-transparent z-10"
      />
      {/* Scrollable content – hidden scrollbar */}
      <div className="relative flex-1 overflow-y-auto scrollbar-hide px-8 py-10 lg:px-12 lg:py-12">
        {/* Header */}
        <div>
          <div className="mb-6 flex items-center gap-2">
            <GlowDot />
            <span className="text-xs font-medium text-emerald-400">Now Hiring</span>
          </div>

          <h1 className="mb-2 text-3xl font-bold tracking-tight text-white lg:text-4xl">
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

/* ─── PDF Drop Zone ──────────────────────────────────────────── */
interface DropZoneProps {
  uploadState: UploadState;
  onFile: (file: File) => void;
  onRemove: () => void;
  disabled: boolean;
}

const DropZone = ({ uploadState, onFile, onRemove, disabled }: DropZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file && file.type === "application/pdf") {
        onFile(file);
      }
    },
    [disabled, onFile]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    // Reset so the same file can be re-selected after removal
    e.target.value = "";
  };

  /* ── Idle / drag state ── */
  if (uploadState.status === "idle" || isDragging) {
    return (
      <div
        id="pdf-dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
        className={[
          "relative flex cursor-pointer flex-col items-center justify-center gap-3",
          "rounded-xl border-2 border-dashed px-6 py-10 text-center",
          "transition-all duration-200",
          isDragging
            ? "border-violet-500/80 bg-violet-500/10 scale-[1.01]"
            : "border-zinc-700/60 bg-zinc-800/30 hover:border-violet-500/50 hover:bg-zinc-800/50",
          disabled ? "pointer-events-none opacity-50" : "",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled}
          id="pdf-file-input"
        />

        {/* Icon */}
        <div
          className={[
            "flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200",
            isDragging
              ? "bg-violet-500/20 text-violet-400"
              : "bg-zinc-700/50 text-zinc-400 group-hover:text-violet-400",
          ].join(" ")}
        >
          <Upload className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-300">
            {isDragging ? "Drop your PDF here" : "Drag & drop your resume PDF"}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            or{" "}
            <span className="text-violet-400 underline underline-offset-2">
              click to browse
            </span>{" "}
            — PDF only
          </p>
        </div>
      </div>
    );
  }

  /* ── Parsing state ── */
  if (uploadState.status === "parsing") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-violet-500/40 bg-violet-500/5 px-6 py-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
          <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-300">Reading Document…</p>
          <p className="mt-1 text-xs text-zinc-500 truncate max-w-[200px]">
            {uploadState.fileName}
          </p>
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (uploadState.status === "error") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-red-500/40 bg-red-500/5 px-6 py-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-red-400">Failed to parse PDF</p>
          <p className="mt-1 text-xs text-zinc-500">{uploadState.message}</p>
        </div>
        <button
          onClick={onRemove}
          className="mt-1 rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-4 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700/50"
        >
          Try again
        </button>
      </div>
    );
  }

  /* ── Ready state ── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/5 px-4 py-3.5"
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
        <FileText className="h-4 w-4 text-emerald-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-200">
          {uploadState.fileName}
        </p>
        <p className="flex items-center gap-1.5 text-xs text-zinc-500">
          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
          {uploadState.wordCount.toLocaleString()} words extracted
        </p>
      </div>
      <button
        onClick={onRemove}
        disabled={disabled}
        aria-label="Remove file"
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-700/50 hover:text-zinc-300 disabled:pointer-events-none"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
};

/* ─── Right Panel: Application Form ─────────────────────────── */
const ApplicationFormPanel = ({
  onAnalysisComplete,
}: {
  onAnalysisComplete: (data: unknown) => void;
}) => {
  const [email, setEmail] = useState("");
  const [uploadState, setUploadState] = useState<UploadState>({ status: "idle" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isReady =
    email.trim().length > 0 && uploadState.status === "ready";

  /* ── Handle file selection ── */
  const handleFile = useCallback(async (file: File) => {
    setUploadState({ status: "parsing", fileName: file.name });
    setSubmitError(null);
    try {
      const text = await parsePdfOnServer(file);
      if (!text || text.trim().length < 20) {
        throw new Error("No readable text found. Is this a scanned PDF?");
      }
      const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
      setUploadState({ status: "ready", fileName: file.name, text, wordCount });
    } catch (err) {
      setUploadState({
        status: "error",
        fileName: file.name,
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }, []);

  const handleRemove = useCallback(() => {
    setUploadState({ status: "idle" });
    setSubmitError(null);
  }, []);

  /* ── Submit ── */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isReady || isSubmitting || uploadState.status !== "ready") return;

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const response = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            jobDescription: MOCK_JOB_DESCRIPTION,
            resumeText: uploadState.text,
          }),
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        onAnalysisComplete(data);
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : "Something went wrong. Please try again."
        );
        setIsSubmitting(false);
      }
    },
    [email, isReady, isSubmitting, uploadState, onAnalysisComplete]
  );

  return (
    /* Full-height flex column to keep form card vertically centred */
    <div className="flex h-full items-center justify-center p-6 lg:p-10">
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
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur-xl">
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
            {/* Email */}
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
                  placeholder="you@example.com"
                  disabled={isSubmitting}
                  autoComplete="email"
                  className="w-full rounded-xl border border-zinc-700/60 bg-zinc-800/50 py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:border-violet-500/70 focus:bg-zinc-800/80 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {/* PDF Upload */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Resume PDF
              </label>
              <AnimatePresence mode="wait">
                <motion.div
                  key={uploadState.status}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                >
                  <DropZone
                    uploadState={uploadState}
                    onFile={handleFile}
                    onRemove={handleRemove}
                    disabled={isSubmitting}
                  />
                </motion.div>
              </AnimatePresence>
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
              className="relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40"
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
                    AI Evaluating Profile…
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
            Your resume is processed entirely in your browser. We never store your file.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────── */
export default function ApplicationEntry({ onAnalysisComplete }: ApplicationEntryProps) {
  return (
    /* h-screen + overflow-hidden = strict no-scroll viewport lock */
    <div className="relative h-screen w-full overflow-hidden bg-zinc-950 font-sans">
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
        className="relative z-20 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md"
      >
        <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">Xobin</span>
            <span className="hidden text-zinc-600 sm:inline">/</span>
            <span className="hidden text-sm text-zinc-400 sm:inline">Application X-Ray</span>
          </div>
          <div className="flex items-center gap-2">
            <GlowDot />
            <span className="text-xs text-zinc-500">AI Model Active</span>
          </div>
        </div>
      </motion.header>

      {/* ── Split grid — fills exactly the remaining viewport height ── */}
      {/*  h-[calc(100vh-56px)] = viewport minus 56px nav                */}
      <div className="mx-auto grid h-[calc(100vh-56px)] max-w-screen-2xl lg:grid-cols-2 lg:divide-x lg:divide-zinc-800/50">
        {/* Left — scrollable JD, scrollbar hidden */}
        <section
          aria-label="Job Description"
          className="h-full min-h-0 overflow-hidden"
        >
          <JobDescriptionPanel />
        </section>

        {/* Right — vertically centred form, no overflow */}
        <section
          aria-label="Application Form"
          className="relative h-full min-h-0 overflow-hidden"
        >
          <ApplicationFormPanel onAnalysisComplete={onAnalysisComplete} />
        </section>
      </div>
    </div>
  );
}
