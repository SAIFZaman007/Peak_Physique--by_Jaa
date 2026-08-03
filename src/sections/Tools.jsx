import { useState } from "react";
import { Dumbbell, Scale, Calculator, Flame } from "lucide-react";
import WorkoutGenerator from "../tools/WorkoutGenerator.jsx";
import BmiCalculator from "../tools/BmiCalculator.jsx";
import MacroPlanner from "../tools/MacroPlanner.jsx";
import CalorieCalculator from "../tools/CalorieCalculator.jsx";

const TABS = [
  { key: "workout", label: "Workout Generator", icon: Dumbbell, Comp: WorkoutGenerator },
  { key: "bmi", label: "BMI Calculator", icon: Scale, Comp: BmiCalculator },
  { key: "calories", label: "Calorie Calculator", icon: Flame, Comp: CalorieCalculator },
  { key: "macro", label: "Macro Planner", icon: Calculator, Comp: MacroPlanner },
];

export default function Tools() {
  const [active, setActive] = useState("workout");
  const Active = TABS.find((t) => t.key === active).Comp;

  return (
    <section id="tools" className="relative overflow-hidden px-6 md:px-14 py-24">
      <div className="gold-grid absolute inset-0 opacity-40" />
      <div className="relative max-w-5xl mx-auto">
        <p className="eyebrow">Free Training Tools</p>
        <h2 className="h-display text-5xl md:text-6xl">Smart Training Tools</h2>
        <p className="mt-4 max-w-xl text-white/55">
          Get a taste of the science behind your plan. Try our calculators — then
          let a coach make it truly yours.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`inline-flex items-center gap-2 rounded-sm border px-5 py-2.5 text-sm font-medium transition-colors ${
                active === t.key
                  ? "border-gold bg-gold text-ink-950"
                  : "border-ink-700 text-white/70 hover:border-gold/50"
              }`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-sm border border-ink-700 bg-ink-900/70 p-6 md:p-8 backdrop-blur">
          <Active />
        </div>
      </div>
    </section>
  );
}