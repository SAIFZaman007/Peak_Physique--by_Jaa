import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Hero from "../sections/Hero.jsx";
import Services from "../sections/Services.jsx";
import About from "../sections/About.jsx";
import FocusStrip from "../sections/FocusStrip.jsx";
import Tools from "../sections/Tools.jsx";
import Pricing from "../sections/Pricing.jsx";
import Testimonials from "../sections/Testimonials.jsx";
import Booking from "../sections/Booking.jsx";
import { api } from "../lib/api";

const CTA_FALLBACK = {
  eyebrow: "The Peak Physique Standard",
  heading_line1: "Your Goals Are",
  heading_line2: "Not Optional.",
  body: "Discipline builds the body. Consistency builds the life. We build both — with programs designed around where you are and engineered to get you where you want to be.",
  cta_label: "Start Today",
  background_image_url:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&q=80&auto=format&fit=crop&crop=center",
};

// Was previously hardcoded and never read the `cta_bottom` section the
// backend already exposes — now it's actually editable from the
// dashboard, same as Hero/About.
function CtaBand() {
  const [c, setC] = useState(CTA_FALLBACK);

  useEffect(() => {
    api.get("/content/cta_bottom")
      .then(({ data }) => data?.data && setC({ ...CTA_FALLBACK, ...data.data }))
      .catch(() => {});
  }, []);

  return (
    <section className="relative flex min-h-[380px] items-center justify-center overflow-hidden px-6 py-24 text-center">
      <img
        src={c.background_image_url}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-[center_30%] brightness-[0.2] saturate-[0.7]"
      />
      <div className="relative">
        <p className="eyebrow">{c.eyebrow}</p>
        <h2 className="h-display text-5xl md:text-7xl">
          {c.heading_line1} <span className="text-gold">{c.heading_line2}</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-white/65">{c.body}</p>
        <a href="#booking" className="btn-primary mt-8">{c.cta_label}</a>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-gold px-6 py-16 text-center text-ink-950">
      <h2 className="h-display text-5xl md:text-7xl">Stop Waiting. Start Building.</h2>
      <a
        href="#booking"
        className="mt-6 inline-block rounded-sm bg-ink-950 px-8 py-4 text-sm font-bold uppercase tracking-[2px] text-gold transition-transform hover:-translate-y-0.5"
      >
        Book Your Free Call
      </a>
    </section>
  );
}

// Was entirely missing — the demo's pre-footer image band that funnels
// anyone who scrolled past everything else into one last booking CTA.
function PreFooterBand() {
  return (
    <section className="relative flex h-[220px] items-center justify-center overflow-hidden text-center">
      <img
        src="https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=1920&q=80&auto=format&fit=crop&crop=center"
        alt="Gym training environment"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-[center_40%] brightness-[0.3] saturate-[0.6]"
      />
      <div className="relative flex flex-col items-center gap-4">
        <p className="h-display text-3xl tracking-[4px] text-white md:text-5xl">
          READY TO REACH YOUR PEAK?
        </p>
        <a
          href="#booking"
          className="inline-block rounded-sm bg-gold px-8 py-3 text-xs font-extrabold uppercase tracking-[2px] text-ink-950 transition-transform hover:-translate-y-0.5"
        >
          Book Free Intro Call
        </a>
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Services />
      <About />
      <FocusStrip />
      <Tools />
      <Pricing />
      <CtaBand />
      <Testimonials />
      <Booking />
      <FinalCta />
      <PreFooterBand />
      <Footer />
    </div>
  );
}