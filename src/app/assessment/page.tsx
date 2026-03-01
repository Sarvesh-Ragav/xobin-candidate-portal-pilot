"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import SkillBridgeQuiz from "@/components/assessment/SkillBridgeQuiz";
import LeadershipPressureQuiz from "@/components/assessment/LeadershipPressureQuiz";

function AssessmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = (searchParams.get("type") ?? "").trim();

  if (type === "gap") {
    return <SkillBridgeQuiz />;
  }
  if (type === "tech" || type === "behavioral") {
    return <LeadershipPressureQuiz />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-8 text-center shadow-2xl backdrop-blur-xl">
        <h2 className="mb-2 text-xl font-bold text-white">Choose Assessment</h2>
        <p className="mb-8 text-sm text-zinc-400">
          Select an assessment to begin.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/assessment?type=gap")}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white hover:opacity-95"
          >
            Technical Gap Mitigation Quiz
          </button>
          <button
            onClick={() => router.push("/assessment?type=tech")}
            className="w-full rounded-xl border border-zinc-600 bg-zinc-800/50 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-700/50"
          >
            Senior Leadership & Pressure Simulation
          </button>
        </div>
        <button
          onClick={() => router.push("/")}
          className="mt-6 text-sm text-zinc-500 hover:text-zinc-400"
        >
          ← Back to Home
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
