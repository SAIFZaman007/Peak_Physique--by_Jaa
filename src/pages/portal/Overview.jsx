import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Scale, Dumbbell, CalendarClock, Target } from "lucide-react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatDateTime } from "../../lib/utils";

export default function Overview() {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/progress/me"), api.get("/bookings/me")])
      .then(([p, b]) => {
        setProgress(p.data);
        setBookings(b.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const latest = progress[progress.length - 1];
  const totalWorkouts = progress.reduce((s, e) => s + (e.workouts_completed || 0), 0);
  const upcoming = bookings
    .filter((b) => b.status !== "cancelled" && new Date(b.start_time) >= new Date())
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))[0];

  const cards = [
    { icon: Scale, label: "Current Weight", value: latest?.weight_lbs ? `${latest.weight_lbs} lbs` : "—" },
    { icon: Dumbbell, label: "Workouts Logged", value: totalWorkouts || "0" },
    { icon: CalendarClock, label: "Next Session", value: upcoming ? formatDateTime(upcoming.start_time) : "None booked" },
    { icon: Target, label: "Your Goal", value: user?.goal || "Set a goal" },
  ];

  if (loading) return <SkeletonGrid />;

  return (
    <div className="space-y-8">
      <div className="lg:hidden">
        <h1 className="font-display text-3xl tracking-[1px]">Hey, {user?.first_name} 👋</h1>
        <p className="text-sm text-white/40">Welcome back to your training hub</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card">
            <div className="flex items-center gap-3 text-gold">
              <c.icon size={20} />
              <span className="text-xs uppercase tracking-wider text-white/40">{c.label}</span>
            </div>
            <div className="mt-3 font-display text-2xl tracking-[1px] text-white">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="font-display text-xl tracking-[1px]">Next Up</h3>
          {upcoming ? (
            <div className="mt-4 rounded-sm border border-gold/30 bg-gold/[0.06] p-4">
              <div className="text-sm font-semibold text-gold">{upcoming.service}</div>
              <div className="mt-1 text-sm text-white/70">{formatDateTime(upcoming.start_time)}</div>
              <span className="mt-2 inline-block rounded-sm bg-gold/15 px-2 py-0.5 text-xs capitalize text-gold">
                {upcoming.status}
              </span>
            </div>
          ) : (
            <div className="mt-4 rounded-sm border border-ink-700 p-6 text-center">
              <p className="text-sm text-white/50">No upcoming sessions.</p>
              <a href="/#booking" className="btn-primary mt-4 !py-2.5">Book a session</a>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="font-display text-xl tracking-[1px]">Quick Actions</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link to="/portal/progress" className="btn-outline !py-3 !text-xs">Log Progress</Link>
            <a href="/#booking" className="btn-outline !py-3 !text-xs">Book a Call</a>
            <Link to="/portal/payments" className="btn-outline !py-3 !text-xs">View Payments</Link>
            <Link to="/portal/messages" className="btn-outline !py-3 !text-xs">Message Coach</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card h-28 animate-pulse bg-ink-900" />
      ))}
    </div>
  );
}
