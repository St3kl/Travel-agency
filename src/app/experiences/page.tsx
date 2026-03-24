"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mountain, Utensils, Landmark, Users, Compass } from "lucide-react";

const experiences = [
  {
    title: "Luxury Safaris",
    description: "Immerse yourself in the wild without compromising on comfort. Our luxury safaris feature exclusive lodges, private guides, and bespoke itineraries in the world's most iconic wildlife reserves.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop",
    icon: <Compass size={32} className="text-gold" />,
    highlights: ["Private Game Drives", "Eco-Luxury Lodges", "Expert Trackers", "Boutique Bush Dining"]
  },
  {
    title: "Adventure & Exploration",
    description: "For those who seek the thrill of the unknown. From trekking remote mountain ranges to diving in pristine coral reefs, we curate adventures that push boundaries and create lifelong memories.",
    image: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=1974&auto=format&fit=crop",
    icon: <Mountain size={32} className="text-gold" />,
    highlights: ["Expedition-Grade Gear", "Certified Adventure Guides", "Remote Destinations", "Active Itineraries"]
  },
  {
    title: "Cultural & Heritage",
    description: "Connect with the soul of a destination through its history, art, and traditions. Our cultural tours offer privileged access to heritage sites and meaningful interactions with local communities.",
    image: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?q=80&w=2070&auto=format&fit=crop",
    icon: <Landmark size={32} className="text-gold" />,
    highlights: ["Private Museum Access", "Local Artisan Workshops", "Historical Storytelling", "Heritage Accommodations"]
  },
  {
    title: "Wine & Culinary Tours",
    description: "Savor the world's finest flavors. We take you behind the scenes of renowned vineyards and into the kitchens of master chefs for an authentic taste of local gastronomy.",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop",
    icon: <Utensils size={32} className="text-gold" />,
    highlights: ["Private Wine Tastings", "Farm-to-Table Experiences", "Michelin-Star Dining", "Cooking Masterclasses"]
  },
  {
    title: "Group & Corporate Travel",
    description: "Elevate your team's experience with flawlessly executed group travel. We handle every detail, from large-scale logistics to personalized team-building activities in inspiring locations.",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop",
    icon: <Users size={32} className="text-gold" />,
    highlights: ["Incentive Travel Programs", "Retreat Coordination", "Event Logistics", "Team Building Experiences"]
  }
];

export default function ExperiencesPage() {
  return (
    <div className="pt-20">
      {/* Hero Header */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
            alt="Experiences"
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
            Our Experiences
          </motion.h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Bespoke travel services tailored to your unique vision of discovery.
          </p>
        </div>
      </section>

      {/* Experience List */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}
            >
              <div className="w-full lg:w-1/2">
                <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-navy/10 group-hover:bg-transparent transition-colors duration-300" />
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <div className="mb-6">{exp.icon}</div>
                <h2 className="text-4xl font-bold text-navy mb-6">{exp.title}</h2>
                <p className="text-navy/70 text-lg leading-relaxed mb-8">
                  {exp.description}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {exp.highlights.map((highlight, hIdx) => (
                    <div key={hIdx} className="flex items-center space-x-3 text-navy/80">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/book"
                    className="bg-gold hover:bg-gold-light text-navy px-8 py-3 rounded-sm font-bold transition-all"
                  >
                    Inquire Now
                  </Link>
                  <Link
                    href="/contact"
                    className="border border-navy text-navy hover:bg-navy hover:text-white px-8 py-3 rounded-sm font-bold transition-all"
                  >
                    View Packages
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Not sure which experience to choose?</h2>
          <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
            Our expert consultants are here to help you design the perfect journey tailored to your interests and preferences.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center text-gold font-bold text-xl hover:text-white transition-colors group"
          >
            Consult with an Expert <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
