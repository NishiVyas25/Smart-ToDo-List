"use client";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Task } from "../lib/types";

export default function TaskForm({ taskId }: { taskId?: number }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Task["status"]>("todo");
  const [category, setCategory] = useState<string>("");
  const [priority, setPriority] = useState(0);
  const [deadline, setDeadline] = useState<string>("");

  const editing = !!taskId;

  useEffect(() => {
    if (!editing) return;
    (async () => {
      const { data } = await api.get(`/tasks/${taskId}/`);
      setTitle(data.title ?? "");
      setDescription(data.description ?? "");
      setStatus(data.status ?? "todo");
      setCategory(data.category_name ?? "");
      setPriority(data.priority_score ?? 0);
      setDeadline(data.deadline ?? "");
    })();
  }, [editing, taskId]);

  async function aiSuggest() {
    const { data } = await api.post("/tasks/ai-suggest/", {
      title, description, category, complexity: "medium",
    });
    if (data.priority_score != null) setPriority(Math.round(data.priority_score));
    if (data.deadline) setDeadline(data.deadline);
    if (data.enhanced_description) setDescription(data.enhanced_description);
  }

  async function save() {
    const payload: any = {
      title, description,
      status, priority_score: priority,
      deadline: deadline || null,
      category_name: category || null,
    };
    if (editing) await api.patch(`/tasks/${taskId}/`, payload);
    else await api.post("/tasks/", payload);
    window.location.href = "/";
  }

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm grid gap-4">
      <div className="grid gap-1">
        <label className="text-sm font-medium">Title</label>
        <input className="rounded-lg border px-3 py-2" value={title} onChange={e=>setTitle(e.target.value)} />
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium">Description</label>
        <textarea className="rounded-lg border px-3 py-2 min-h-[120px]" value={description} onChange={e=>setDescription(e.target.value)} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="grid gap-1">
          <label className="text-sm font-medium">Status</label>
          <select className="rounded-lg border px-3 py-2" value={status} onChange={e=>setStatus(e.target.value as any)}>
            <option value="todo">To do</option>
            <option value="scheduled">Scheduled</option>
            <option value="doing">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-medium">Category</label>
          <input className="rounded-lg border px-3 py-2" value={category} onChange={e=>setCategory(e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="grid gap-1">
          <label className="text-sm font-medium">Priority</label>
          <input type="number" min={0} max={100} className="rounded-lg border px-3 py-2" value={priority} onChange={e=>setPriority(Number(e.target.value))} />
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-medium">Deadline</label>
          <input type="datetime-local" className="rounded-lg border px-3 py-2" value={deadline ?? ""} onChange={e=>setDeadline(e.target.value)} />
        </div>
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={aiSuggest} className="px-3 py-2 rounded-lg border bg-white hover:bg-slate-50">
          AI Suggest
        </button>
        <button type="button" onClick={save} className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">
          {editing ? "Save changes" : "Create task"}
        </button>
      </div>
    </div>
  );
}
