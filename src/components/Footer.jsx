import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-ink-700 bg-ink-950 px-6 md:px-14 pt-16 pb-8">
      <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="font-display text-2xl tracking-[3px] text-gold">
            PEAK<span className="text-white">PHYSIQUE</span>
          </Link>
          <p className="mt-4 text-sm text-white/50 leading-relaxed">
            Certified personal training built for students and busy people who
            want real, lasting results.
          </p>
        </div>

        <div>
          <h4 className="eyebrow">Explore</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><a href="/#services" className="hover:text-gold">Services</a></li>
            <li><a href="/#tools" className="hover:text-gold">Training Tools</a></li>
            <li><a href="/#pricing" className="hover:text-gold">Pricing</a></li>
            <li><a href="/#testimonials" className="hover:text-gold">Results</a></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow">Account</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/login" className="hover:text-gold">Sign In</Link></li>
            <li><Link to="/register" className="hover:text-gold">Create Account</Link></li>
            <li><a href="/#booking" className="hover:text-gold">Book a Call</a></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow">Contact</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-gold" /> join@trainpeakphysique.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-gold" /> 888-323-1052
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={15} className="text-gold" /> Online &amp; In-Person
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-ink-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
        <p>© {year} Peak Physique. All rights reserved.</p>
        <p>Built for peak performance.</p>
      </div>
    </footer>
  );
}