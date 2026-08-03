import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { cn } from "../lib/utils";

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#tools", label: "Tools" },
  { href: "#pricing", label: "Pricing" },
  { href: "#testimonials", label: "Results" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 md:px-14 backdrop-blur-md",
        "bg-ink-950/90 border-b transition-all duration-300",
        scrolled ? "py-3 border-gold/30" : "py-4 border-gold/10"
      )}
    >
      <Link to="/" className="font-display text-2xl tracking-[3px] text-gold">
        PEAK<span className="text-white">PHYSIQUE</span>
      </Link>

      <ul className="hidden md:flex items-center gap-8">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="text-xs font-medium uppercase tracking-wider text-white/75 hover:text-gold transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <Link to="/portal" className="btn-primary !px-6 !py-2.5">
            My Portal
          </Link>
        ) : (
          <>
            <Link to="/login" className="btn-ghost">
              Sign In
            </Link>
            <a href="#booking" className="btn-primary !px-6 !py-2.5">
              Book Free Call
            </a>
          </>
        )}
      </div>

      <button
        className="md:hidden text-white p-1"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-ink-950 border-b border-gold/20 md:hidden px-6 py-5 flex flex-col gap-4">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm uppercase tracking-wider text-white/80 hover:text-gold"
            >
              {l.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-3">
            {user ? (
              <Link to="/portal" className="btn-primary" onClick={() => setOpen(false)}>
                My Portal
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-outline" onClick={() => setOpen(false)}>
                  Sign In
                </Link>
                <a href="#booking" className="btn-primary" onClick={() => setOpen(false)}>
                  Book Free Call
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
