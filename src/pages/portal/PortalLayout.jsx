import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, LineChart, CalendarDays, CreditCard, MessageSquare, LogOut, Menu, X, Home } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const NAV = [
  { to: "/portal", end: true, icon: LayoutDashboard, label: "Overview" },
  { to: "/portal/progress", icon: LineChart, label: "Progress" },
  { to: "/portal/bookings", icon: CalendarDays, label: "Bookings" },
  { to: "/portal/payments", icon: CreditCard, label: "Payments" },
  { to: "/portal/messages", icon: MessageSquare, label: "Messages" },
];

export default function PortalLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const doLogout = () => {
    logout();
    navigate("/");
  };

  const initials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`.toUpperCase();

  const SidebarInner = (
    <>
      <Link to="/" className="font-display text-2xl tracking-[3px] text-gold">
        PEAK<span className="text-white">PHYSIQUE</span>
      </Link>
      <nav className="mt-10 flex-1 space-y-1">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-medium transition-colors ${
                isActive ? "bg-gold text-ink-950" : "text-white/60 hover:bg-ink-800 hover:text-white"
              }`
            }
          >
            <n.icon size={18} /> {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-6 space-y-1 border-t border-ink-800 pt-4">
        <Link to="/" className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-white/50 hover:text-white">
          <Home size={18} /> Back to site
        </Link>
        <button onClick={doLogout} className="flex w-full items-center gap-3 rounded-sm px-4 py-3 text-sm text-white/50 hover:text-danger">
          <LogOut size={18} /> Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-ink-950 lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-ink-800 bg-ink-900 p-6">
        {SidebarInner}
      </aside>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-ink-800 bg-ink-900 px-5 py-4 lg:hidden">
        <Link to="/" className="font-display text-xl tracking-[3px] text-gold">
          PEAK<span className="text-white">PHYSIQUE</span>
        </Link>
        <button onClick={() => setOpen(true)} className="text-white"><Menu size={24} /></button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-ink-800 bg-ink-900 p-6">
            <button onClick={() => setOpen(false)} className="absolute right-4 top-4 text-white/60"><X size={22} /></button>
            {SidebarInner}
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1">
        <header className="hidden items-center justify-between border-b border-ink-800 px-8 py-5 lg:flex">
          <div>
            <h1 className="font-display text-2xl tracking-[1px]">
              Hey, {user?.first_name} 👋
            </h1>
            <p className="text-xs text-white/40">Welcome back to your training hub</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium">{user?.first_name} {user?.last_name}</div>
              <div className="text-xs text-white/40">{user?.email}</div>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gold font-bold text-ink-950">
              {initials || "PP"}
            </div>
          </div>
        </header>
        <div className="p-5 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
