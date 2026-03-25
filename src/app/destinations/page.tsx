"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowUpRight } from "lucide-react";

const destinations = [
  {
    country: "South Africa",
    region: "Africa",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop",
    highlights: ["Kruger National Park", "Cape Town", "Garden Route", "Stellenbosch Winelands"],
    description: "A world in one country, offering diverse wildlife, stunning landscapes, and vibrant cultures."
  },
  {
    country: "Italy",
    region: "Europe",
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2066&auto=format&fit=crop",
    highlights: ["Amalfi Coast", "Tuscany", "Rome & Florence", "Sicily"],
    description: "From historic ruins to world-class cuisine and breathtaking coastal views."
  },
  {
    country: "Thailand",
    region: "Asia",
    image: "https://images.unsplash.com/photo-1528181304800-2f140819898f?q=80&w=2070&auto=format&fit=crop",
    highlights: ["Chiang Mai", "Phuket & Islands", "Bangkok", "Ayutthaya"],
    description: "Exotic temples, pristine beaches, and some of the world's most welcoming hospitality."
  },
  {
    country: "Kenya",
    region: "Africa",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1974&auto=format&fit=crop",
    highlights: ["Maasai Mara", "Amboseli", "Lamu Island", "Samburu"],
    description: "The heart of the African safari, home to the Great Migration and majestic Mount Kilimanjaro views."
  },
  {
    country: "France",
    region: "Europe",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
    highlights: ["Paris", "French Riviera", "Bordeaux", "Loire Valley"],
    description: "The epitome of romance, art, and culinary excellence in the heart of Europe."
  },
  {
    country: "Japan",
    region: "Asia",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop",
    highlights: ["Kyoto", "Tokyo", "Mount Fuji", "Hokkaido"],
    description: "A seamless blend of ancient traditions and futuristic innovation."
  }
];

export default function DestinationsPage() {
  return (
    <div className="pt-20">
      {/* Hero Header */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?q=80&w=2070&auto=format&fit=crop"
            alt="Global Destinations"
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
            Our Destinations
          </motion.h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Exploring the world&apos;s most extraordinary corners, one journey at a time.
          </p>
        </div>
      </section>

      {/* Destination Gallery */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {destinations.map((dest, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative h-[600px] rounded-2xl overflow-hidden shadow-xl"
              >
                <Image
                  src={dest.image}
                  alt={dest.country}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="mb-4">
                    <span className="text-gold font-bold tracking-widest uppercase text-xs bg-navy/50 px-3 py-1 rounded-full backdrop-blur-sm">
                      {dest.region}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3 flex items-center">
                    <MapPin className="mr-2 text-gold" size={24} />
                    {dest.country}
                  </h3>
                  <p className="text-white/70 text-sm mb-6 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                    {dest.description}
                  </p>
                  
                  <div className="space-y-2 mb-8 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <h4 className="text-gold font-semibold text-xs uppercase tracking-wider">Highlights</h4>
                    <ul className="grid grid-cols-1 gap-1">
                      {dest.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="text-white/80 text-xs flex items-center">
                          <span className="w-1 h-1 bg-gold rounded-full mr-2" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link
                    href="/book"
                    className="inline-flex items-center justify-center bg-white text-navy px-6 py-3 rounded-md font-bold hover:bg-gold transition-all group/btn"
                  >
                    Explore Packages <ArrowUpRight className="ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Callout */}
      <section className="py-24 bg-off-white border-t border-navy/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-navy mb-8">Looking for something specific?</h2>
          <p className="text-navy/70 text-lg mb-12 leading-relaxed">
            Our global network of local partners allows us to organize bespoke travel experiences in almost any corner of the globe. If you don&apos;t see your desired destination here, contact us for a custom proposal.
          </p>
          <Link
            href="/contact"
            className="btn-primary"
          >
            Request Custom Destination
          </Link>
        </div>
      </section>
    </div>
  );
}
