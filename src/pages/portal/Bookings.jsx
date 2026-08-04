import { useEffect, useState } from "react";
import { CalendarClock, CalendarDays, X } from "lucide-react";
import { api } from "../../lib/api";
import { formatDateTime, STATUS_STYLES } from "../../lib/utils";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    api.get("/bookings/me").then(({ data }) => setBookings(data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    await api.post(`/bookings/${id}/cancel`);
    load();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl tracking-[1px]">My Bookings</h2>
          <p className="text-sm text-white/40">Your sessions and intro calls.</p>
        </div>
        <a href="/#booking" className="btn-primary !py-2.5">Book New</a>
      </div>

      {loading ? (
        <div className="card text-sm text-white/40">Loading…</div>
      ) : bookings.length === 0 ? (
        <div className="card flex flex-col items-center py-14 text-center">
          <CalendarDays size={40} className="text-gold" />
          <p className="mt-4 text-white/60">You haven't booked any sessions yet.</p>
          <a href="/#booking" className="btn-primary mt-5">Book your first call</a>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b) => {
            // A purchased session with no time yet (see Booking.start_time)
            // is still cancellable, same as anything upcoming — only a
            // scheduled slot that's already passed, or an already-cancelled
            // booking, hides the button.
            const upcoming = (!b.start_time || new Date(b.start_time) >= new Date()) && b.status !== "cancelled";
            return (
              <div key={b.id} className="card flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{b.service}</h3>
                    <span className={`rounded-sm border px-2 py-0.5 text-xs capitalize ${STATUS_STYLES[b.status] || ""}`}>
                      {b.status}
                    </span>
                  </div>
                  {b.start_time ? (
                    <p className="mt-1 text-sm text-white/50">{formatDateTime(b.start_time)}</p>
                  ) : (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-gold">
                      <CalendarClock size={14} /> Awaiting scheduling — we'll confirm a time shortly
                    </p>
                  )}
                  {b.goal && <p className="mt-1 text-xs text-white/40">Goal: {b.goal}</p>}
                </div>
                {upcoming && (
                  <button
                    onClick={() => cancel(b.id)}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-ink-700 px-3 py-2 text-xs text-white/60 hover:border-danger hover:text-danger"
                  >
                    <X size={14} /> Cancel
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}