"use client";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { ContextEntry } from "../../lib/types";

export default function ContextPage() {
  const [text, setText] = useState("");
  const [items, setItems] = useState<ContextEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await api.get("/context/");
    setItems(data);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function add() {
    if (!text.trim()) return;
    await api.post("/context/", { text });
    setText(""); load();
  }

  return (
    <div className="grid gap-4">
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Daily context</h2>
        <p className="text-sm text-slate-500 mb-3">Paste notes, emails, reminders. Use this to power AI suggestions.</p>
        <div className="flex gap-2">
          <textarea
            className="flex-1 rounded-lg border px-3 py-2 min-h-[100px]"
            value={text} onChange={e=>setText(e.target.value)}
            placeholder="What happened today…"
          />
          <button onClick={add} className="self-start px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">
            Save
          </button>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <h3 className="font-semibold mb-2">History</h3>
        {loading ? (
          <div>Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-slate-600">No context yet.</div>
        ) : (
          <ul className="space-y-2">
            {items.map(i => (
              <li key={i.id} className="rounded-lg border bg-slate-50 p-3">
                <div className="text-xs text-slate-500 mb-1">
                  {new Date(i.created_at).toLocaleString()}
                </div>
                <div className="text-sm whitespace-pre-wrap">{i.text}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
