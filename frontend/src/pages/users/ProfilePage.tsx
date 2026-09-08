import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <section className="max-w-2xl space-y-6">
      <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Account</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Your profile</h1><p className="mt-2 text-sm text-slate-500">The details connected to your library account.</p></div>
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-950 p-6 text-white sm:p-8">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-400 text-xl font-bold text-slate-950">{user?.name?.charAt(0).toUpperCase() ?? "U"}</span>
          <div><h2 className="text-xl font-bold">{user?.name}</h2><p className="mt-1 text-sm text-slate-300">{user?.email}</p></div>
        </div>
        <dl className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
          <div><dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Full name</dt><dd className="mt-1 font-semibold text-slate-800">{user?.name}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email address</dt><dd className="mt-1 break-words font-semibold text-slate-800">{user?.email}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Account role</dt><dd className="mt-1 font-semibold capitalize text-slate-800">{user?.role}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Member status</dt><dd className="mt-1 inline-flex items-center gap-2 font-semibold text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" />Active</dd></div>
        </dl>
      </div>
    </section>
  );
}