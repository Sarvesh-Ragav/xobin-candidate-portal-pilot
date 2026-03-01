"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUESTIONS = [
  {
    id: 1,
    q: "A deployment fails 10 minutes before a product launch. What is your first action?",
    options: [
      "Immediately roll back and notify stakeholders",
      "Debug in production to fix the issue quickly",
      "Blame the developer who pushed the change",
      "Postpone the launch without informing anyone",
    ],
    correct: "Immediately roll back and notify stakeholders",
  },
  {
    id: 2,
    q: "A junior developer repeatedly misses deadlines. How do you intervene?",
    options: [
      "Escalate to HR without a conversation",
      "Have a 1:1 to understand blockers, pair on planning, and set realistic milestones",
      "Publicly call them out in standup",
      "Take over all their tasks yourself",
    ],
    correct: "Have a 1:1 to understand blockers, pair on planning, and set realistic milestones",
  },
  {
    id: 3,
    q: "Two senior engineers disagree strongly on architecture. The sprint is blocked. What do you do?",
    options: [
      "Let them argue until one gives in",
      "Facilitate a time-boxed discussion, document trade-offs, and make a call with a short-term experiment to validate",
      "Pick the louder person's approach",
      "Defer the decision indefinitely",
    ],
    correct: "Facilitate a time-boxed discussion, document trade-offs, and make a call with a short-term experiment to validate",
  },
  {
    id: 4,
    q: "A critical bug is reported in production. Your team is already overloaded. How do you respond?",
    options: [
      "Add it to the backlog for next sprint",
      "Assess severity, triage with the team, and either fix immediately or communicate a clear timeline to stakeholders",
      "Ignore it until someone complains again",
      "Work alone through the night to fix it",
    ],
    correct: "Assess severity, triage with the team, and either fix immediately or communicate a clear timeline to stakeholders",
  },
  {
    id: 5,
    q: "A stakeholder demands a feature that would compromise system stability. What do you do?",
    options: [
      "Build it exactly as requested",
      "Explain the risks, propose alternatives or phased delivery, and document the decision",
      "Refuse without explanation",
      "Promise to deliver and hope it works",
    ],
    correct: "Explain the risks, propose alternatives or phased delivery, and document the decision",
  },
];

export default function LeadershipPressureQuiz() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const question = QUESTIONS[current];
  const total = QUESTIONS.length;
  const progress = ((current + 1) / total) * 100;

  const handleSelect = (opt: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: opt }));
  };

  const handleNext = () => {
    if (current < total - 1) setCurrent((c) => c + 1);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const allAnswered = Object.keys(answers).length === total;

  return (
    <div className="min-h-screen bg-zinc-950">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-transparent"
      />

      <div className="relative mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10 lg:px-6 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5 shadow-2xl backdrop-blur-xl sm:p-6 lg:p-8"
        >
          <h1 className="mb-2 text-lg font-bold tracking-tight text-white sm:text-xl">
            Senior Leadership & Pressure Simulation
          </h1>
          <p className="mb-6 text-sm text-zinc-400">
            Evaluate soft skills and leadership under pressure for elite candidates.
          </p>

          {/* Progress */}
          <div className="mb-6">
            <div className="mb-2 flex justify-between text-xs text-zinc-500">
              <span>Question {current + 1} of {total}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
              <motion.div
                className="h-full rounded-full bg-violet-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {!submitted ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <p className="text-sm font-medium leading-relaxed text-zinc-200 sm:text-base">
                  {question.q}
                </p>
                <div className="space-y-3">
                  {question.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelect(opt)}
                      className={`w-full min-h-[44px] rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                        answers[question.id] === opt
                          ? "border-violet-500 bg-violet-500/10 text-white"
                          : "border-zinc-700/60 bg-zinc-800/50 text-zinc-300 hover:border-zinc-600"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={current === 0}
                    className="min-h-[44px] rounded-xl border border-zinc-700/50 bg-zinc-800/50 px-4 py-2.5 text-sm font-medium text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-700/50 sm:order-first"
                  >
                    Previous
                  </button>
                  {current < total - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="min-h-[44px] rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!allAnswered}
                      className="min-h-[44px] rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center"
            >
              <p className="text-lg font-medium text-emerald-400">
                Assessment submitted successfully.
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Thank you for completing the Leadership & Pressure Simulation.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
