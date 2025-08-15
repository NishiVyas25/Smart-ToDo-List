"use client";
import { useState } from "react";
import { api } from "../lib/api";

export default function QuickAdd({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  async function add() {
    if (!title.trim()) return;
    setSaving(true);
    await api.post("/tasks/", { title, status: "todo", priority_score: 0 });
    setTitle(""); setSaving(false); onCreated();
  }
  return (
    <div className="rounded-xl border bg-white p-3 shadow-sm flex gap-2">
      <input
        className="flex-1 rounded-lg border px-3 py-2 text-sm"
        placeholder="Quick add a task…"
        value={title}
        onChange={e => setTitle(e.target.value)}
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
