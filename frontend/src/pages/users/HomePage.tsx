import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl sm:p-10">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[36px] border-sky-400/10" aria-hidden="true" />
        <div className="relative max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">Your reading space</p>
          <h1 className="display-font mt-3 text-4xl leading-tight sm:text-5xl">Welcome back, {user?.name}.</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">Find something worth your time, keep your borrowed books organized, and make your next reading choice a little easier.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/books" className="rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-sky-300">Browse collection <span aria-hidden="true">→</span></Link>
            <Link to="/my-borrowings" className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15">View my borrowings</Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/books" className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-md">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-lg font-bold text-sky-700" aria-hidden="true">+</span>
          <h2 className="mt-5 font-bold text-slate-900">Discover a title</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Search the collection by title, author, or category.</p>
          <span className="mt-4 block text-sm font-semibold text-sky-700 group-hover:text-sky-800">Explore books →</span>
        </Link>
        <Link to="/my-borrowings" className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg font-bold text-emerald-700" aria-hidden="true">✓</span>
          <h2 className="mt-5 font-bold text-slate-900">Keep track of loans</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">See due dates, return finished books, and review your history.</p>
          <span className="mt-4 block text-sm font-semibold text-emerald-700 group-hover:text-emerald-800">Open borrowings →</span>
        </Link>
        <Link to="/profile" className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-md">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-lg font-bold text-amber-700" aria-hidden="true">{user?.name?.charAt(0).toUpperCase() ?? "U"}</span>
          <h2 className="mt-5 font-bold text-slate-900">Your account</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Review your profile details and library membership information.</p>
          <span className="mt-4 block text-sm font-semibold text-amber-700 group-hover:text-amber-800">View profile →</span>
        </Link>
      </div>
    </section>
  );
}