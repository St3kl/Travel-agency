"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Briefcase, Handshake, TrendingUp, Zap } from "lucide-react";

const models = [
  {
    title: "Commission Model",
    description: "Earn competitive commissions by booking your clients into Ekeon Group's premium experiences.",
    icon: <TrendingUp className="text-gold" size={32} />
  },
  {
    title: "Co-Branding",
    description: "Collaborate on exclusive itineraries that leverage both our brands' strengths and reputations.",
    icon: <Handshake className="text-gold" size={32} />
  },
  {
    title: "White-Label Services",
    description: "Our local expertise, your brand. We operate the tours while you maintain the client relationship.",
    icon: <Zap className="text-gold" size={32} />
  }
];

export default function PartnerPage() {
  return (
    <div className="pt-20">
      {/* Hero Header */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
            alt="Partner With Us"
            fill
            className="object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl text-white font-bold mb-4"
          >
            Partner With Us
          </motion.h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Empowering local tour operators through global collaboration.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Briefcase className="text-gold mx-auto mb-6" size={48} />
          <h2 className="text-4xl font-bold text-navy mb-8">Collaborate for Global Success</h2>
          <p className="text-navy/70 text-lg leading-relaxed mb-12">
            Ekeon Group is constantly seeking professional, reliable local tour operators and destination management companies to join our global network. By partnering with us, you gain access to an international clientele seeking premium, authentic experiences.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {models.map((model, idx) => (
              <div key={idx} className="p-8 bg-off-white rounded-xl border border-gray-100 hover:border-gold/30 transition-all">
                <div className="mb-6">{model.icon}</div>
                <h3 className="text-xl font-bold text-navy mb-4">{model.title}</h3>
                <p className="text-navy/60 text-sm leading-relaxed">{model.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Form */}
      <section className="py-24 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8">Let&apos;s Grow Together</h2>
              <p className="text-white/60 text-lg mb-10 leading-relaxed">
                Interested in becoming an Ekeon Group partner? Fill out the form, and our partnership development team will be in touch to discuss potential collaboration models.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                  </div>
                  <span>Access to premium international markets</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                  </div>
                  <span>Marketing and brand support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                  </div>
                  <span>Simplified booking and payment processes</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-10 shadow-2xl">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-navy/70 uppercase tracking-widest">Company Name</label>
                    <input type="text" className="w-full p-3 bg-off-white border border-gray-100 rounded text-navy outline-none focus:ring-1 focus:ring-gold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-navy/70 uppercase tracking-widest">Contact Person</label>
                    <input type="text" className="w-full p-3 bg-off-white border border-gray-100 rounded text-navy outline-none focus:ring-1 focus:ring-gold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-navy/70 uppercase tracking-widest">Work Email</label>
                  <input type="email" className="w-full p-3 bg-off-white border border-gray-100 rounded text-navy outline-none focus:ring-1 focus:ring-gold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-navy/70 uppercase tracking-widest">Primary Destination</label>
                  <input type="text" placeholder="e.g., South Africa, France, etc." className="w-full p-3 bg-off-white border border-gray-100 rounded text-navy outline-none focus:ring-1 focus:ring-gold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-navy/70 uppercase tracking-widest">Brief Message</label>
                  <textarea rows={4} className="w-full p-3 bg-off-white border border-gray-100 rounded text-navy outline-none focus:ring-1 focus:ring-gold resize-none" />
                </div>
                <button className="btn-primary w-full">
                  Submit Partnership Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
