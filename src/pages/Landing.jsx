import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Hero from "../sections/Hero.jsx";
import Services from "../sections/Services.jsx";
import About from "../sections/About.jsx";
import Tools from "../sections/Tools.jsx";
import Pricing from "../sections/Pricing.jsx";
import Testimonials from "../sections/Testimonials.jsx";
import Booking from "../sections/Booking.jsx";

function CtaBand() {
  return (
    <section className="relative overflow-hidden px-6 py-20 text-center">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #1a1000, #0A0A0A)" }}
      />
      <div className="gold-grid absolute inset-0 opacity-50" />
      <div className="relative">
        <h2 className="h-display text-5xl md:text-7xl">
          Your Goals Are <span className="text-gold">Not Optional</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/55">
          The best time to start was yesterday. The second best time is right now.
        </p>
        <a href="#booking" className="btn-primary mt-8">Start Today</a>
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

export default function Landing() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Tools />
      <Pricing />
      <CtaBand />
      <Testimonials />
      <Booking />
      <FinalCta />
      <Footer />
    </div>
  );
}
