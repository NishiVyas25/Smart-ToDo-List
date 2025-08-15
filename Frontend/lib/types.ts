export type Category = {
  id: number;
  name: string;
};

export type Task = {
  id: number;                    // comes from backend
  title: string;
  description?: string;
  status: "todo" | "doing" | "done" | "scheduled";
  priority_score: number;        // comes from backend (or can be set)
  deadline: string | null;       // ISO string
  category: number | null;       // category id (backend returns it this way if you designed it so)
  created_at?: string;
  updated_at?: string;
};

export type TaskInput = {
  title: string;
  description?: string;
  status: "todo" | "doing" | "done" | "scheduled";
  category?: number | null;      // send id or null
  priority_score?: number;       // optional on create
  deadline?: string | null;      // ISO string or null
};


export type ContextEntry = {
  id: number;
  text: string;
  source: "whatsapp" | "email" | "note";
  created_at: string;
};

