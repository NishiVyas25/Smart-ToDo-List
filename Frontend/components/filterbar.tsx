"use client";
type Filters = {
  status: "" | "todo" | "scheduled" | "doing" | "done";
  category: string;
  minPriority: number;
};
export default function FilterBar({
  filters, onChange,
  categories
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  categories: string[];
}) {
  return (
    <div className="rounded-xl border bg-white p-3 shadow-sm flex flex-wrap gap-3 items-center">
      <select
        className="rounded-lg border px-3 py-2 text-sm"
        value={filters.status}
        onChange={e => onChange({ ...filters, status: e.target.value as any })}
      >
        <option value="">All status</option>
        <option value="todo">To do</option>
        <option value="scheduled">Scheduled</option>
        <option value="doing">In progress</option>
        <option value="done">Done</option>
      </select>

      <select
        className="rounded-lg border px-3 py-2 text-sm"
        value={filters.category}
        onChange={e => onChange({ ...filters, category: e.target.value })}
      >
        <option value="">All categories</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-600">Min priority</label>
        <input
          type="range" min={0} max={100}
          value={filters.minPriority}
          onChange={e => onChange({ ...filters, minPriority: Number(e.target.value) })}
        />
        <span className="text-sm font-medium">{filters.minPriority}</span>
      </div>
    </div>
  );
}
