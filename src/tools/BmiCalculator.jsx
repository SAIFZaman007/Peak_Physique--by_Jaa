import { useState } from "react";

function category(bmi) {
  if (bmi < 18.5) return { label: "Underweight", color: "#60A5FA",
    advice: "Focus on a gentle calorie surplus with strength training to build healthy mass." };
  if (bmi < 25) return { label: "Healthy", color: "#34D399",
    advice: "Great range! Keep training consistently and eating for your performance goals." };
  if (bmi < 30) return { label: "Overweight", color: "#F5A623",
    advice: "A modest calorie deficit plus regular strength work will move you toward your goal." };
  return { label: "Obese", color: "#E63946",
    advice: "A structured plan with a coach can make fat loss sustainable and safe. Let's talk." };
}

export default function BmiCalculator() {
  const [ft, setFt] = useState(5);
  const [inch, setInch] = useState(10);
  const [lbs, setLbs] = useState(170);
  const [bmi, setBmi] = useState(null);

  const calc = () => {
    const totalIn = Number(ft) * 12 + Number(inch);
    if (!totalIn || !lbs) return;
    const value = (703 * Number(lbs)) / (totalIn * totalIn);
    setBmi(Math.round(value * 10) / 10);
  };

  const cat = bmi != null ? category(bmi) : null;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-5">
        <div>
          <label className="field-label">Height</label>
          <div className="flex gap-3">
            <div className="flex-1">
              <input type="number" value={ft} min={3} max={8} onChange={(e) => setFt(e.target.value)} className="field-input" />
              <span className="mt-1 block text-xs text-muted">feet</span>
            </div>
            <div className="flex-1">
              <input type="number" value={inch} min={0} max={11} onChange={(e) => setInch(e.target.value)} className="field-input" />
              <span className="mt-1 block text-xs text-muted">inches</span>
            </div>
          </div>
        </div>
        <div>
          <label className="field-label">Weight (lbs)</label>
          <input type="number" value={lbs} min={50} max={600} onChange={(e) => setLbs(e.target.value)} className="field-input" />
        </div>
        <button onClick={calc} className="btn-primary w-full">Calculate BMI</button>
      </div>

      <div className="flex flex-col items-center justify-center rounded-sm border border-ink-700 bg-ink-950 p-6 text-center">
        {cat ? (
          <>
            <div className="font-display text-7xl" style={{ color: cat.color }}>{bmi}</div>
            <div className="mt-1 text-sm font-semibold uppercase tracking-wider" style={{ color: cat.color }}>
              {cat.label}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/55">{cat.advice}</p>
          </>
        ) : (
          <p className="text-sm text-white/40">Enter your details to see your BMI and a tailored tip.</p>
        )}
      </div>
    </div>
  );
}
