"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, ChevronRight } from "lucide-react";

export default function AdvancedArchitectureChallenge() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Ambient gradient */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-transparent"
      />

      <div className="relative mx-auto max-w-2xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur-xl"
        >
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Advanced Architecture Challenge
              </h1>
              <p className="text-sm text-zinc-400">
                Design and explain a scalable system architecture
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8 flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-violet-500" : "bg-zinc-800"
                }`}
              />
            ))}
          </div>

          {/* Step content */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Describe the system you would design
                </label>
                <textarea
                  placeholder="e.g., A real-time chat platform serving 1M users..."
                  className="w-full rounded-xl border border-zinc-700/60 bg-zinc-800/50 py-3 px-4 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20"
                  rows={4}
                />
              </div>
              <button
                onClick={() => setStep(2)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-95"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  High-level architecture diagram (describe components)
                </label>
                <textarea
                  placeholder="API Gateway, Load Balancers, Databases, Caches, Message Queues..."
                  className="w-full rounded-xl border border-zinc-700/60 bg-zinc-800/50 py-3 px-4 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20"
                  rows={4}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-zinc-700/50 bg-zinc-800/50 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-700/50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-95"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  How would you handle scaling and failure modes?
                </label>
                <textarea
                  placeholder="Horizontal scaling, redundancy, circuit breakers, fallbacks..."
                  className="w-full rounded-xl border border-zinc-700/60 bg-zinc-800/50 py-3 px-4 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20"
                  rows={4}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="rounded-xl border border-zinc-700/50 bg-zinc-800/50 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-700/50"
                >
                  Back
                </button>
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-95"
                >
                  Submit Assessment
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
