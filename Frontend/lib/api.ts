import axios from "axios";
import type { Category, Task, TaskInput } from "./types";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API || "http://127.0.0.1:8000/api",
});

// --- Categories ---
export async function getCategories(): Promise<Category[]> {
  const r = await api.get<Category[]>("/categories/");
  return r.data;
}

// --- Tasks ---
export async function createTask(payload: TaskInput): Promise<Task> {
  const r = await api.post<Task>("/tasks/", payload);
  return r.data;
}

export async function getTasks(): Promise<Task[]> {
  const r = await api.get<Task[]>("/tasks/");
  return r.data;
}

