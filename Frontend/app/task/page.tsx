"use client";

import React, { useEffect, useState } from "react";
import { getCategories, createTask } from "../../lib/api";
import type { Category, TaskInput } from "../../lib/types";

export default function CreateTaskPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"todo"|"doing"|"done"|"scheduled">("todo");
  const [priority, setPriority] = useState<number>(0);
  const [deadline, setDeadline] = useState<string>(""); // ISO
  const [categoryId, setCategoryId] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingCats(true);
        const cats = await getCategories();
        if (alive) setCategories(cats);
      } catch (e: any) {
        if (alive) setCatError(e?.message ?? "Failed to load categories");
      } finally {
        if (alive) setLoadingCats(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: TaskInput = {
      title,
      description: description || undefined,
      status,
      category: categoryId ?? null,    // send id or null
      priority_score: priority || undefined,
      deadline: deadline ? new Date(deadline).toISOString() : null,
    };

    await createTask(payload);
    // redirect or clear form
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl mx-auto gap-6 p-4 space-y-4">
      {/* title */}
      <input
        className="w-full border rounded p-2"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      {/* description */}
      <textarea
        className="w-full border rounded p-2"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={4}
      />

      {/* status */}
      <select
        className="w-full border rounded p-2"
        value={status}
        onChange={e => setStatus(e.target.value as any)}
      >
        <option value="todo">To Do</option>
        <option value="doing">In Progress</option>
        <option value="done">Done</option>
        <option value="scheduled">Scheduled</option>
      </select>

      {/* category (populated from backend) */}
      <select
        className="w-full border rounded p-2"
        value={categoryId ?? ""}
        onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : null)}
        disabled={loadingCats}
      >
        <option value="">— Select category —</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      {catError && <p className="text-sm text-red-600">{catError}</p>}

      {/* priority */}
      <input
        type="number"
        className="w-full border rounded p-2"
        placeholder="Priority (0-5)"
        value={priority}
        onChange={e => setPriority(Number(e.target.value))}
        min={0}
        max={5}
      />

      {/* deadline */}
      <input
        type="datetime-local"
        className="w-full border rounded p-2"
        value={deadline}
        onChange={e => setDeadline(e.target.value)}
      />

      <button
        type="submit"
        className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500"
      >
        Create task
      </button>
    </form>
  );
}
