"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Globe2, Leaf, ShieldCheck, Trophy } from "lucide-react";

const values = [
  {
    title: "Authenticity",
    description: "We provide genuine experiences that connect you with the true heart of every destination.",
    icon: <Globe2 className="text-gold" size={40} />,
  },
  {
    title: "Excellence",
    description: "From planning to execution, we maintain the highest standards of service and luxury.",
    icon: <Trophy className="text-gold" size={40} />,
  },
  {
    title: "Sustainability",
    description: "We are committed to responsible travel that preserves the beauty of our planet.",
    icon: <Leaf className="text-gold" size={40} />,
  },
  {
    title: "Collaboration",
    description: "Our global success is built on strong, trusted partnerships with local experts.",
    icon: <ShieldCheck className="text-gold" size={40} />,
  },
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero Header */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop"
            alt="About Ekeon Group"
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
            Our Story
          </motion.h1>
          <div className="w-24 h-1 bg-gold mx-auto" />
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1974&auto=format&fit=crop"
                alt="Our Vision"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-gold font-semibold tracking-widest uppercase text-sm">Philosophy</span>
              <h2 className="text-4xl font-bold mt-4 mb-8 text-navy">Global Brand, Local Expertise</h2>
              <div className="space-y-6 text-navy/70 text-lg leading-relaxed">
                <p>
                  Ekeon Group was founded on a simple yet powerful vision: to bridge the gap between discerning international travelers and the world&apos;s most authentic, premium experiences.
                </p>
                <p>
                  As a global brand, we leverage our international presence to understand the needs of travelers from Europe, North America, Asia, and Africa. However, our heart beats with local knowledge.
                </p>
                <p>
                  We believe that the best travel experiences are those that are deeply rooted in local culture and expertise. That&apos;s why we&apos;ve built a network of trusted local partners who share our commitment to excellence and authenticity.
                </p>
              </div>
              
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Global Presence",
                  "Local Partnerships",
                  "Luxury Standards",
                  "Authentic Encounters",
                  "Sustainable Travel",
                  "Bespoke Planning"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <CheckCircle2 className="text-gold shrink-0" size={20} />
                    <span className="font-medium text-navy">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-gold font-semibold tracking-widest uppercase text-sm">Our Foundation</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">Core Values</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center group"
              >
                <div className="mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-white/60 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Partnerships Section */}
      <section className="py-24 bg-off-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-12 md:p-20 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <h2 className="text-4xl font-bold text-navy mb-8">Expanding Horizons</h2>
                <p className="text-navy/70 text-lg leading-relaxed mb-8">
                  While our vision is global, our recent expansion into South Africa marks a significant milestone in our journey. We are partnering with premier local operators to bring you the very best of the African continent—from the majestic safaris of the Kruger to the refined wine estates of the Cape.
                </p>
                <div className="bg-navy/5 border-l-4 border-gold p-6 rounded-r-lg">
                  <p className="italic text-navy font-medium">
                    &quot;We don&apos;t just sell trips; we curate life-changing moments through meaningful global connections.&quot;
                  </p>
                </div>
              </div>
              <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071&auto=format&fit=crop"
                  alt="Global Partnerships"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
