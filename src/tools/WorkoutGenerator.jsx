import { useState } from "react";
import { Dumbbell } from "lucide-react";

const LIBRARY = {
  push: ["Barbell Bench Press", "Overhead Press", "Incline DB Press", "Lateral Raise", "Triceps Pushdown"],
  pull: ["Deadlift", "Pull-Ups", "Barbell Row", "Face Pull", "Barbell Curl"],
  legs: ["Back Squat", "Romanian Deadlift", "Leg Press", "Walking Lunge", "Calf Raise"],
  upper: ["Bench Press", "Barbell Row", "Overhead Press", "Lat Pulldown", "DB Curl"],
  lower: ["Squat", "Hip Thrust", "Leg Curl", "Leg Extension", "Calf Raise"],
  full: ["Squat", "Bench Press", "Barbell Row", "Overhead Press", "Plank"],
};

const SPLITS = {
  3: [["Full Body A", "full"], ["Full Body B", "upper"], ["Full Body C", "lower"]],
  4: [["Upper", "upper"], ["Lower", "lower"], ["Push", "push"], ["Pull", "pull"]],
  5: [["Push", "push"], ["Pull", "pull"], ["Legs", "legs"], ["Upper", "upper"], ["Lower", "lower"]],
};

const REP_SCHEME = {
  strength: "4 sets × 4–6 reps",
  hypertrophy: "3–4 sets × 8–12 reps",
  endurance: "3 sets × 15–20 reps",
};

export default function WorkoutGenerator() {
  const [days, setDays] = useState(4);
  const [goal, setGoal] = useState("hypertrophy");
  const [plan, setPlan] = useState(null);

  const generate = () => {
    const split = SPLITS[days];
    setPlan(
      split.map(([name, key]) => ({
        name,
        scheme: REP_SCHEME[goal],
        exercises: LIBRARY[key],
      }))
    );
  };

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="field-label">Days / week</label>
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="field-input">
            <option value={3}>3 days</option>
            <option value={4}>4 days</option>
            <option value={5}>5 days</option>
          </select>
        </div>
        <div>
          <label className="field-label">Primary goal</label>
          <select value={goal} onChange={(e) => setGoal(e.target.value)} className="field-input">
            <option value="strength">Strength</option>
            <option value="hypertrophy">Build muscle</option>
            <option value="endurance">Endurance</option>
          </select>
        </div>
        <div className="flex items-end">
          <button onClick={generate} className="btn-primary w-full">Generate Plan</button>
        </div>
      </div>

      {plan && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plan.map((day, i) => (
            <div key={i} className="rounded-sm border border-ink-700 bg-ink-950 p-5">
              <div className="flex items-center gap-2 text-gold">
                <Dumbbell size={16} />
                <h4 className="font-display text-xl tracking-[1px]">Day {i + 1} · {day.name}</h4>
              </div>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted">{day.scheme}</p>
              <ul className="mt-4 space-y-2">
                {day.exercises.map((ex) => (
                  <li key={ex} className="flex items-center gap-2 text-sm text-white/75">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold/70" /> {ex}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {plan && (
        <p className="mt-6 rounded-sm border border-gold/20 bg-gold/[0.05] p-4 text-sm text-white/50">
          <span className="font-semibold text-gold">Coach tip: </span>
          Progressive overload is everything — add a little weight or a rep each
          week. Want this tailored to your equipment and schedule?{" "}
          <a href="#booking" className="text-gold underline">Book a free call.</a>
        </p>
      )}
    </div>
  );
}
