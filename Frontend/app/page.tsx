"use client";

import { useEffect, useMemo, useState } from "react";

/** Minimal Task type matching your API */
type Task = {
  id: number;
  title: string;
  description?: string;
  category_name?: string;
  status: "todo" | "scheduled" | "doing" | "done";
  priority_score: number;
  deadline?: string | null;
};

/** Simple client that talks to your DRF API directly */
const api = {
  async listTasks(): Promise<Task[]> {
    const r = await fetch("http://127.0.0.1:8000/api/tasks/", { cache: "no-store" });
    if (!r.ok) throw new Error("Failed to load tasks");
    return r.json();
  },
  async createTask(payload: Partial<Task>) {
    await fetch("http://127.0.0.1:8000/api/tasks/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
};

/* ---------- UI helpers ---------- */
function barColor(score: number) {
  if (score >= 70) return "bg-rose-400";
  if (score >= 40) return "bg-amber-400";
  return "bg-emerald-400";
}
function statusMeta(s: Task["status"]) {
  switch (s) {
    case "done":      return { dot: "bg-emerald-500", label: "Done" };
    case "doing":     return { dot: "bg-sky-500",     label: "In progress" };
    case "scheduled": return { dot: "bg-amber-500",   label: "Scheduled" };
    default:          return { dot: "bg-slate-400",   label: "To do" };
  }
}
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border bg-slate-50 px-2 py-0.5 text-xs text-slate-700">
      {children}
    </span>
  );
}

function TaskCard({ t }: { t: Task }) {
  const due = t.deadline ? new Date(t.deadline) : null;
  const meta = statusMeta(t.status);
  return (
    <article className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      <div className={`h-1 ${barColor(t.priority_score)}`} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[17px] font-semibold leading-6">{t.title}</h3>
          <Badge>P{Math.round(t.priority_score)}</Badge>
        </div>

        {t.description && (
          <p className="mt-2 text-[13.5px] text-slate-700 whitespace-pre-wrap">
            {t.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-slate-600">
          <Badge>
            <span className={`mr-1 inline-block h-2 w-2 rounded-full ${meta.dot}`} />
            {meta.label}
          </Badge>
          {t.category_name && <Badge>{t.category_name}</Badge>}
          {due && (
            <span className="ml-auto inline-flex items-center rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
              Due: {due.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/* ---------- Quick add + Filters, styled ---------- */
function QuickAdd({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  async function add() {
    if (!title.trim()) return;
    setSaving(true);
    await api.createTask({ title, status: "todo", priority_score: 0 });
    setTitle("");
    setSaving(false);
    onCreated();
  }
  return (
    <div className="rounded-2xl border bg-white p-3 shadow-sm flex gap-2">
      <input
        className="flex-1 rounded-lg border px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-indigo-200"
        placeholder="Quick add a task…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        onClick={add}
        disabled={saving}
        className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        Add
      </button>
    </div>
  );
}

type Filters = {
  status: "" | "todo" | "scheduled" | "doing" | "done";
  category: string;
  priorityBand: "all" | "high" | "medium" | "low";
};

function Pill({
  active, children, onClick,
}: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3 py-1.5 rounded-full text-sm border transition",
        active
          ? "bg-indigo-600 text-white border-indigo-600"
          : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function FilterBar({
  filters, onChange, categories,
}: {
  filters: Filters; onChange: (f: Filters) => void; categories: string[];
}) {
  return (
    <div className="rounded-2xl border bg-white p-3 shadow-sm flex flex-wrap items-center gap-3">
      {/* Status */}
      <select
        className="rounded-lg border px-3 py-2 text-[14px]"
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value as any })}
      >
        <option value="">All status</option>
        <option value="todo">To do</option>
        <option value="scheduled">Scheduled</option>
        <option value="doing">In progress</option>
        <option value="done">Done</option>
      </select>

      {/* Category */}
      <select
        className="rounded-lg border px-3 py-2 text-[14px]"
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Priority pills */}
      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm text-slate-600">Priority:</span>
        <Pill active={filters.priorityBand === "all"} onClick={() => onChange({ ...filters, priorityBand: "all" })}>All</Pill>
        <Pill active={filters.priorityBand === "high"} onClick={() => onChange({ ...filters, priorityBand: "high" })}>High</Pill>
        <Pill active={filters.priorityBand === "medium"} onClick={() => onChange({ ...filters, priorityBand: "medium" })}>Medium</Pill>
        <Pill active={filters.priorityBand === "low"} onClick={() => onChange({ ...filters, priorityBand: "low" })}>Low</Pill>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */
export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    status: "",
    category: "",
    priorityBand: "all",
  });


  async function load() {
    setLoading(true);
    const data = await api.listTasks();
    setTasks(data);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const categories = useMemo(() => {
    const s = new Set<string>();
    tasks.forEach((t) => t.category_name && s.add(t.category_name));
    return Array.from(s).sort();
  }, [tasks]);

  const filtered = tasks
  .filter((t) => (filters.status ? t.status === filters.status : true))
  .filter((t) => (filters.category ? t.category_name === filters.category : true))
  .filter((t) => {
    const p = t.priority_score ?? 0;
    if (filters.priorityBand === "high") return p <= 3;
    if (filters.priorityBand === "medium") return p >= 4 && p < 8;
    if (filters.priorityBand === "low") return p >= 8;
    return true; // all
  })
  .sort((a, b) => {
    const byP = Math.sign((b.priority_score ?? 0) - (a.priority_score ?? 0));
    if (byP !== 0) return byP;
    const ad = a.deadline ? new Date(a.deadline).getTime() : Infinity;
    const bd = b.deadline ? new Date(b.deadline).getTime() : Infinity;
    return ad - bd;
  });


  return (
    <>
      {/* Controls */}
      <div className="grid gap-4">
        <QuickAdd onCreated={load} />
        <FilterBar filters={filters} onChange={setFilters} categories={categories} />
      </div>

      {/* Section heading */}
      <div className="mt-6 mb-2">
        <h2 className="text-lg font-semibold text-slate-800">Task list</h2>
        <p className="text-sm text-slate-500">Filtered & sorted</p>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="mt-3 rounded-2xl bg-white p-6 shadow-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="mt-3 rounded-2xl bg-white p-6 shadow-sm text-slate-600">
          Nothing matches your filters.
        </div>
      ) : (
        <section className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => <TaskCard key={t.id} t={t} />)}
        </section>
      )}
    </>
  );
}
