"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import SkillBridgeQuiz from "@/components/assessment/SkillBridgeQuiz";
import LeadershipPressureQuiz from "@/components/assessment/LeadershipPressureQuiz";

const VALID_TOKEN = "demo_key";

function AssessmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawToken = searchParams.get("token");
  const token = rawToken?.trim() ?? "";
  const type = searchParams.get("type")?.trim() ?? "";

  console.log("Current Token:", token, "| Type:", type);

  const isValidToken = token.toLowerCase() === VALID_TOKEN.toLowerCase();

  if (!token || !isValidToken) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-700/50 mx-auto">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="mb-3 text-xl font-bold text-white">
            Authorized Access Only
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-zinc-400">
            Please use the link provided in your X-Ray Report.
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
    return <SkillBridgeQuiz />;
  }
  if (type === "tech" || type === "behavioral") {
    return <LeadershipPressureQuiz />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10">
        <h2 className="mb-3 text-xl font-bold text-white">Invalid Assessment Type</h2>
        <p className="mb-8 text-sm leading-relaxed text-zinc-400">
          Please use a valid assessment link with type=gap, type=tech, or type=behavioral.
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
