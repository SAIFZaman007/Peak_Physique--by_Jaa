import { useState } from "react";

const ACTIVITY = {
  "1.2": { label: "Sedentary (desk life, minimal movement)" },
  "1.375": { label: "Lightly Active (light exercise 1-3x/week)" },
  "1.55": { label: "Moderately Active (gym 3-5x/week)" },
  "1.725": { label: "Very Active (intense training 6-7x/week)" },
  "1.9": { label: "Athlete (2x/day training)" },
};

const GOALS = {
  cut: { label: "Lose Fat (Caloric Deficit)", delta: -400, detail: "~400 cal deficit — aggressive enough for fat loss, conservative enough to preserve muscle.", rate: "Est. 0.75–1 lb fat loss/week" },
  maintain: { label: "Maintain Weight", delta: 0, detail: "Calories in = calories out — best for recomposition, performance, and skill building.", rate: "Body weight stays stable" },
  bulk: { label: "Build Muscle (Caloric Surplus)", delta: 250, detail: "~250 cal surplus — lean mass gains with minimal fat accumulation.", rate: "Est. 0.25–0.5 lb muscle/week" },
};

export default function CalorieCalculator() {
  const [lbs, setLbs] = useState(175);
  const [inches, setInches] = useState(70);
  const [age, setAge] = useState(19);
  const [sex, setSex] = useState("male");
  const [activity, setActivity] = useState("1.2");
  const [goal, setGoal] = useState("cut");
  const [res, setRes] = useState(null);

  const calc = () => {
    if (!lbs || !inches || !age) return;
    const kg = Number(lbs) * 0.453592;
    const cm = Number(inches) * 2.54;
    const bmr = sex === "male"
      ? 10 * kg + 6.25 * cm - 5 * Number(age) + 5
      : 10 * kg + 6.25 * cm - 5 * Number(age) - 161;
    const tdee = Math.round(bmr * Number(activity));

    const g = GOALS[goal];
    const target = tdee + g.delta;
    const protein = Math.round(Number(lbs) * (goal === "bulk" ? 1.0 : 0.85));
    const fat = Math.round((target * 0.28) / 9);
    const carbs = Math.round((target - protein * 4 - fat * 9) / 4);

    setRes({ bmr: Math.round(bmr), tdee, target, protein, carbs, fat, goal: g });
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">Weight (lbs)</label>
            <input type="number" min={50} max={600} value={lbs} onChange={(e) => setLbs(e.target.value)} className="field-input" />
          </div>
          <div>
            <label className="field-label">Height (inches)</label>
            <input type="number" min={40} max={100} value={inches} onChange={(e) => setInches(e.target.value)} className="field-input" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">Age</label>
            <input type="number" min={13} max={80} value={age} onChange={(e) => setAge(e.target.value)} className="field-input" />
          </div>
          <div>
            <label className="field-label">Biological Sex</label>
            <select value={sex} onChange={(e) => setSex(e.target.value)} className="field-input">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <div>
          <label className="field-label">Activity Level</label>
          <select value={activity} onChange={(e) => setActivity(e.target.value)} className="field-input">
            {Object.entries(ACTIVITY).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">Goal</label>
          <select value={goal} onChange={(e) => setGoal(e.target.value)} className="field-input">
            {Object.entries(GOALS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        <button onClick={calc} className="btn-primary w-full">Calculate My Calories</button>
      </div>

      <div className="rounded-sm border border-ink-700 bg-ink-950 p-6">
        {res ? (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-sm border border-ink-700 py-3">
                <div className="font-display text-3xl text-white">{res.bmr}</div>
                <div className="text-[11px] uppercase tracking-wider text-muted">BMR (at rest)</div>
              </div>
              <div className="rounded-sm border border-gold/30 bg-gold/5 py-3">
                <div className="font-display text-3xl text-gold">{res.target}</div>
                <div className="text-[11px] uppercase tracking-wider text-muted">{res.goal.label.split(" (")[0]}</div>
              </div>
            </div>

            <div className="rounded-sm bg-gold/5 p-4 text-sm">
              <p className="text-[11px] uppercase tracking-wider text-white/40">Strategy</p>
              <p className="mt-1 text-white/75">{res.goal.detail}</p>
              <p className="mt-1.5 font-semibold text-gold">{res.goal.rate}</p>
            </div>

            <div>
              <p className="mb-2 text-[11px] uppercase tracking-wider text-muted">Daily Macro Targets</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[["Protein", res.protein], ["Carbs", res.carbs], ["Fat", res.fat]].map(([k, v]) => (
                  <div key={k} className="rounded-sm border border-ink-700 py-3">
                    <div className="font-display text-xl text-white">{v}g</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted">{k}</div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-white/40">TDEE: {res.tdee} cal/day at your current activity level.</p>
          </div>
        ) : (
          <div className="grid h-full place-items-center text-sm text-white/40">
            Fill in your stats to see your daily calorie and macro targets.
          </div>
        )}
      </div>
    </div>
  );
}