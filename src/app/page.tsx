"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApplicationEntry from "@/components/ApplicationEntry";

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<unknown | null>(null);

  const handleAnalysisComplete = (data: unknown) => {
    setAnalysisResult(data);
    console.log("[System] Analysis complete");
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!analysisResult ? (
          <motion.div
            key="entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
          >
            <ApplicationEntry onAnalysisComplete={handleAnalysisComplete} />
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4 font-sans sm:p-6 lg:p-8"
          >
            {/* Result placeholder — swap with XRayDashboard component */}
            <div className="w-full max-w-2xl rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5 text-center backdrop-blur-xl sm:p-8 lg:p-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 mx-auto shadow-lg shadow-violet-500/25">
                <svg
                  className="h-7 w-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </div>
              <h2 className="mb-3 text-2xl font-bold text-white">
                Analysis Complete 🎉
              </h2>
              <p className="mb-8 text-sm leading-relaxed text-zinc-400">
                The AI has finished evaluating your profile. Your X-Ray
                dashboard is ready below.
              </p>
              {(() => {
                const str = JSON.stringify(analysisResult, null, 2);
                const isEmpty = str === "{}" || str === "null" || str === "[]" || str.length < 10;
                if (isEmpty) return null;
                return (
                  <pre className="max-h-64 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-left text-xs leading-relaxed text-zinc-300">
                    {str}
                  </pre>
                );
              })()}
              <button
                onClick={() => setAnalysisResult(null)}
                className="mt-6 rounded-xl border border-zinc-700/50 bg-zinc-800/50 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700/50 hover:text-white"
              >
                ← Start Over
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
