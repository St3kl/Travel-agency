import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

import SocialLinks from "@/components/SocialLinks";
import { CONTACT_EMAIL, CONTACT_WHATSAPP, CONTACT_WHATSAPP_URL } from "@/lib/contact";

const Footer = () => {
  return (
    <footer className="bg-navy text-white pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tighter">
              EKEON <span className="text-gold">GROUP</span>
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Connecting travelers worldwide to premium, authentic experiences. One world, Infinite experience.
            </p>
            <SocialLinks variant="dark" />
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-white/60 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/experiences" className="text-white/60 hover:text-white transition-colors">Our Experiences</Link></li>
              <li><Link href="/destinations" className="text-white/60 hover:text-white transition-colors">Destinations</Link></li>
              <li><Link href="/book" className="text-white/60 hover:text-white transition-colors">Book Online</Link></li>
              <li><Link href="/partner" className="text-white/60 hover:text-white transition-colors">Partner With Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-gold font-semibold mb-6">Our Services</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Luxury Safaris</Link></li>
              <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Adventure & Exploration</Link></li>
              <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Cultural & Heritage</Link></li>
              <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Wine & Culinary</Link></li>
              <li><Link href="#" className="text-white/60 hover:text-white transition-colors">Corporate Travel</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-gold font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-gold shrink-0" />
                <span className="text-white/60">Global Presence, Local Partners Worldwide</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-gold shrink-0" />
                <Link href={CONTACT_WHATSAPP_URL} className="text-white/60 hover:text-white transition-colors">{CONTACT_WHATSAPP}</Link>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-gold shrink-0" />
                <Link href={`mailto:${CONTACT_EMAIL}`} className="text-white/60 hover:text-white transition-colors">{CONTACT_EMAIL}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-white/40">
          <p>Copyright {new Date().getFullYear()} Ekeon Group. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

