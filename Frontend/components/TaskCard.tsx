"use client";
import { Task } from "../lib/types";

function bar(score: number) {
  if (score >= 70) return "bg-rose-400";
  if (score >= 40) return "bg-amber-400";
  return "bg-emerald-400";
}
function statusMeta(status: Task["status"]) {
  switch (status) {
    case "done":      return { dot: "bg-emerald-500", text: "Done" };
    case "doing":     return { dot: "bg-sky-500",     text: "In progress" };
    case "scheduled": return { dot: "bg-amber-500",   text: "Scheduled" };
    default:          return { dot: "bg-slate-400",   text: "To do" };
  }
}

export default function TaskCard({ t }: { t: Task }) {
  const due = t.deadline ? new Date(t.deadline) : null;
  const meta = statusMeta(t.status);

  return (
    <article className="max-w-sm mx-auto rounded-[var(--radius)] bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      <div className={`h-1 ${bar(t.priority_score)}`} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[16px] font-semibold leading-6">{t.title}</h3>
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-50">
            P{Math.round(t.priority_score)}
          </span>
        </div>

        {t.description && (
          <p className="mt-2 text-[13px] text-slate-700 whitespace-pre-wrap">
            {t.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-slate-600">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50">
            <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
            {meta.text}
          </span> 
          {due && (
            <span className="ml-auto px-2 py-0.5 rounded-md bg-indigo-50 border-indigo-200 text-indigo-700">
              Due: {due.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
