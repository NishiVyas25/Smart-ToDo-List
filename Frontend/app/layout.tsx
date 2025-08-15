import "./global.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = { title: "Smart Todo" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[linear-gradient(180deg,#f8fafc,70%,#eef2ff)] text-slate-900 text-[15px]`}>
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
            <a href="/" className="font-semibold hover:opacity-80">HOME</a>
            <a href="/task" className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">+ Add task</a>
            <a href="/context" className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">+ Add Context</a>
          </div>
        </header>

        <section className="mx-auto max-w-5xl px-4 pt-6">
          <div className="rounded-2xl bg-white shadow-sm">
            <div className="px-6 py-8 text-center">
              <h1 style={{ fontSize: "2.5rem" }}
                className="text-6xl font-bold tracking-tight" >Smart Todo</h1>
              <p></p>
            </div>
          </div>
        </section>

        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
