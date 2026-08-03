import { useEffect, useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { api, apiError } from "../../lib/api";
import { formatDate } from "../../lib/utils";

const todayStr = new Date().toISOString().split("T")[0];

export default function Progress() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    entry_date: todayStr, weight_lbs: "", body_fat_pct: "", workouts_completed: "",
  });

  const load = () =>
    api.get("/progress/me").then(({ data }) => setEntries(data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const add = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/progress/me", {
        entry_date: form.entry_date,
        weight_lbs: form.weight_lbs ? Number(form.weight_lbs) : null,
        body_fat_pct: form.body_fat_pct ? Number(form.body_fat_pct) : null,
        workouts_completed: form.workouts_completed ? Number(form.workouts_completed) : null,
      });
      setForm({ entry_date: todayStr, weight_lbs: "", body_fat_pct: "", workouts_completed: "" });
      await load();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    await api.delete(`/progress/me/${id}`);
    setEntries((e) => e.filter((x) => x.id !== id));
  };

  const chartData = entries
    .filter((e) => e.weight_lbs != null)
    .map((e) => ({ date: formatDate(e.entry_date, { month: "short", day: "numeric" }), weight: e.weight_lbs }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl tracking-[1px]">Progress Tracker</h2>
        <p className="text-sm text-white/40">Log your numbers and watch the trend — synced across every device.</p>
      </div>

      <div className="card">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/50">Weight Trend</h3>
        {chartData.length > 1 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="date" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} domain={["dataMin - 3", "dataMax + 3"]} />
                <Tooltip
                  contentStyle={{ background: "#111", border: "1px solid #222", borderRadius: 4, color: "#fff" }}
                  labelStyle={{ color: "#F5A623" }}
                />
                <Line type="monotone" dataKey="weight" stroke="#F5A623" strokeWidth={2.5} dot={{ fill: "#F5A623", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-white/40">
            Add at least two weight entries to see your trend line.
          </p>
        )}
      </div>

      <form onSubmit={add} className="card">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/50">Log New Entry</h3>
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label className="field-label">Date</label>
            <input type="date" max={todayStr} value={form.entry_date} onChange={set("entry_date")} className="field-input" />
          </div>
          <div>
            <label className="field-label">Weight (lbs)</label>
            <input type="number" step="0.1" value={form.weight_lbs} onChange={set("weight_lbs")} className="field-input" placeholder="175" />
          </div>
          <div>
            <label className="field-label">Body fat %</label>
            <input type="number" step="0.1" value={form.body_fat_pct} onChange={set("body_fat_pct")} className="field-input" placeholder="18" />
          </div>
          <div>
            <label className="field-label">Workouts</label>
            <input type="number" value={form.workouts_completed} onChange={set("workouts_completed")} className="field-input" placeholder="4" />
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        <button disabled={saving} className="btn-primary mt-4">
          {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><Plus size={16} /> Add Entry</>}
        </button>
      </form>

      <div className="card !p-0 overflow-hidden">
        <div className="border-b border-ink-800 px-6 py-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">History</h3>
        </div>
        {loading ? (
          <div className="p-6 text-sm text-white/40">Loading…</div>
        ) : entries.length === 0 ? (
          <div className="p-8 text-center text-sm text-white/40">No entries yet. Log your first above!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-white/40">
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Weight</th>
                  <th className="px-6 py-3 font-medium">Body Fat</th>
                  <th className="px-6 py-3 font-medium">Workouts</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {[...entries].reverse().map((e) => (
                  <tr key={e.id} className="border-t border-ink-800">
                    <td className="px-6 py-3">{formatDate(e.entry_date)}</td>
                    <td className="px-6 py-3">{e.weight_lbs ? `${e.weight_lbs} lbs` : "—"}</td>
                    <td className="px-6 py-3">{e.body_fat_pct != null ? `${e.body_fat_pct}%` : "—"}</td>
                    <td className="px-6 py-3">{e.workouts_completed ?? "—"}</td>
                    <td className="px-6 py-3 text-right">
                      <button onClick={() => remove(e.id)} className="text-white/30 hover:text-danger">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
