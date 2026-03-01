"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import ResumeGapMitigation from "@/components/assessment/ResumeGapMitigation";
import AdvancedArchitectureChallenge from "@/components/assessment/AdvancedArchitectureChallenge";

const VALID_TOKEN = "assessment_v1";

function AssessmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const type = searchParams.get("type");

  if (!token || token !== VALID_TOKEN) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-8">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-10 text-center shadow-2xl backdrop-blur-xl">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-700/50 mx-auto">
            <svg
              className="h-7 w-7 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="mb-3 text-xl font-bold text-white">Private Link Only</h2>
          <p className="mb-8 text-sm leading-relaxed text-zinc-400">
            This assessment requires a valid invitation link. Please use the link
            sent to you by your recruiter.
          </p>
          <button
            onClick={() => router.push("/")}
            className="rounded-xl border border-zinc-700/50 bg-zinc-800/50 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700/50 hover:text-white"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (type === "gap") {
    return <ResumeGapMitigation />;
  }

  if (type === "tech") {
    return <AdvancedArchitectureChallenge />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-8">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-10 text-center shadow-2xl backdrop-blur-xl">
        <h2 className="mb-3 text-xl font-bold text-white">Invalid Assessment Type</h2>
        <p className="mb-8 text-sm leading-relaxed text-zinc-400">
          Please use a valid assessment link with type=gap or type=tech.
        </p>
        <button
          onClick={() => router.push("/")}
          className="rounded-xl border border-zinc-700/50 bg-zinc-800/50 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700/50 hover:text-white"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-950">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
        </div>
      }
    >
      <AssessmentContent />
    </Suspense>
  );
}
