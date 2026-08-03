import { useState } from "react";

const ACTIVITY = {
  sedentary: { label: "Sedentary", f: 1.2 },
  light: { label: "Lightly active", f: 1.375 },
  moderate: { label: "Moderately active", f: 1.55 },
  very: { label: "Very active", f: 1.725 },
};
const GOALS = {
  cut: { label: "Lose fat", cal: -0.2, p: 1.1, f: 0.35 },
  maintain: { label: "Maintain", cal: 0, p: 0.9, f: 0.35 },
  bulk: { label: "Build muscle", cal: 0.12, p: 1.0, f: 0.3 },
};

export default function MacroPlanner() {
  const [sex, setSex] = useState("male");
  const [age, setAge] = useState(24);
  const [lbs, setLbs] = useState(170);
  const [ft, setFt] = useState(5);
  const [inch, setInch] = useState(10);
  const [activity, setActivity] = useState("moderate");
  const [goal, setGoal] = useState("bulk");
  const [res, setRes] = useState(null);

  const calc = () => {
    const kg = Number(lbs) / 2.20462;
    const cm = (Number(ft) * 12 + Number(inch)) * 2.54;
    // Mifflin-St Jeor
    const bmr = 10 * kg + 6.25 * cm - 5 * Number(age) + (sex === "male" ? 5 : -161);
    const tdee = bmr * ACTIVITY[activity].f;
    const g = GOALS[goal];
    const cals = Math.round(tdee * (1 + g.cal));
    const protein = Math.round(Number(lbs) * g.p);
    const fat = Math.round((cals * g.f) / 9);
    const carbs = Math.round((cals - protein * 4 - fat * 9) / 4);
    setRes({ cals, protein, carbs, fat });
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">Sex</label>
            <select value={sex} onChange={(e) => setSex(e.target.value)} className="field-input">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="field-label">Age</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="field-input" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="field-label">Weight</label>
            <input type="number" value={lbs} onChange={(e) => setLbs(e.target.value)} className="field-input" />
          </div>
          <div>
            <label className="field-label">Ft</label>
            <input type="number" value={ft} onChange={(e) => setFt(e.target.value)} className="field-input" />
          </div>
          <div>
            <label className="field-label">In</label>
            <input type="number" value={inch} onChange={(e) => setInch(e.target.value)} className="field-input" />
          </div>
        </div>
        <div>
          <label className="field-label">Activity</label>
          <select value={activity} onChange={(e) => setActivity(e.target.value)} className="field-input">
            {Object.entries(ACTIVITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Goal</label>
          <select value={goal} onChange={(e) => setGoal(e.target.value)} className="field-input">
            {Object.entries(GOALS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <button onClick={calc} className="btn-primary w-full">Calculate Macros</button>
      </div>

      <div className="rounded-sm border border-ink-700 bg-ink-950 p-6">
        {res ? (
          <div className="flex h-full flex-col justify-center">
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-muted">Daily Target</div>
              <div className="font-display text-6xl text-gold">{res.cals}</div>
              <div className="text-xs uppercase tracking-wider text-muted">calories</div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[["Protein", res.protein], ["Carbs", res.carbs], ["Fat", res.fat]].map(([k, v]) => (
                <div key={k} className="rounded-sm border border-ink-700 py-3">
                  <div className="font-display text-2xl text-white">{v}g</div>
                  <div className="text-[11px] uppercase tracking-wider text-muted">{k}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid h-full place-items-center text-sm text-white/40">
            Fill in your stats to get a macro split.
          </div>
        )}
      </div>
    </div>
  );
}
