"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Shield, Star, Users } from "lucide-react";

export default function Home() {
  const featuredDestinations = [
    {
      title: "South Africa",
      description: "Luxury safaris and breathtaking landscapes.",
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop",
    },
    {
      title: "Europe",
      description: "Cultural heritage and culinary excellence.",
      image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070&auto=format&fit=crop",
    },
    {
      title: "Asia",
      description: "Exotic adventures and ancient traditions.",
      image: "https://images.unsplash.com/photo-1528181304800-2f140819898f?q=80&w=2070&auto=format&fit=crop",
    },
  ];

  const services = [
    {
      title: "Luxury Safaris",
      icon: <Star className="text-gold" size={32} />,
      description: "Unforgettable wildlife encounters with premium accommodations.",
    },
    {
      title: "Adventure & Exploration",
      icon: <Globe className="text-gold" size={32} />,
      description: "Off-the-beaten-path experiences for the bold traveler.",
    },
    {
      title: "Cultural & Heritage",
      icon: <Shield className="text-gold" size={32} />,
      description: "Deep dives into local traditions and historical landmarks.",
    },
    {
      title: "Group & Corporate",
      icon: <Users className="text-gold" size={32} />,
      description: "Seamlessly organized travel for teams and large groups.",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
            alt="Global Travel Experience"
            fill
            className="object-cover brightness-50"
            priority
            sizes="100vw"
          />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-gold font-medium tracking-[0.3em] uppercase mb-4 text-sm md:text-base"
          >
            Ekeon Group Presents
          </motion.h2>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl text-white font-bold mb-8 leading-tight"
          >
            One World,<br />Infinite Experience.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light"
          >
            Connecting travelers worldwide to premium, authentic experiences across multiple destinations.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4"
          >
            <Link 
              href="/experiences" 
              className="bg-gold hover:bg-gold-light text-navy px-8 py-4 rounded-sm font-semibold transition-all duration-300 w-full md:w-auto text-center"
            >
              Explore Our Destinations
            </Link>
            <Link 
              href="/book" 
              className="border border-white/30 hover:bg-white hover:text-navy text-white px-8 py-4 rounded-sm font-semibold transition-all duration-300 w-full md:w-auto text-center backdrop-blur-sm"
            >
              Book Your Trip
            </Link>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-white/50" />
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-gold font-semibold tracking-widest uppercase text-sm">About Ekeon Group</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-8 text-navy leading-tight">
                Your Global Gateway to Authentic Travel
              </h2>
              <p className="text-navy/70 text-lg leading-relaxed mb-6">
                Ekeon Group is a global travel and tourism company that connects travelers worldwide to premium, authentic experiences across multiple destinations.
              </p>
              <p className="text-navy/70 text-lg leading-relaxed mb-10">
                We work with trusted local partners to operate luxury safaris, adventure tours, cultural trips, wine and culinary tours, and group travel experiences. Our vision is to present a sophisticated, international travel brand that remains simple, informative, and conversion‑focused.
              </p>
              <Link href="/about" className="inline-flex items-center text-gold font-bold hover:text-navy transition-colors group">
                Discover Our Story <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-64 rounded-lg overflow-hidden shadow-2xl">
                  <Image src="https://images.unsplash.com/photo-1512100356956-c1227c331f01?q=80&w=1000&auto=format&fit=crop" alt="Travel 1" fill className="object-cover" />
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden shadow-xl">
                  <Image src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop" alt="Travel 2" fill className="object-cover" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-48 rounded-lg overflow-hidden shadow-xl">
                  <Image src="https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop" alt="Travel 3" fill className="object-cover" />
                </div>
                <div className="relative h-64 rounded-lg overflow-hidden shadow-2xl">
                  <Image src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop" alt="Travel 4" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-24 bg-off-white">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <span className="text-gold font-semibold tracking-widest uppercase text-sm">Explore the World</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 text-navy">Featured Destinations</h2>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDestinations.map((dest, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="group relative h-[500px] overflow-hidden rounded-lg shadow-lg"
            >
              <Image src={dest.image} alt={dest.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full text-left">
                <h3 className="text-white text-3xl font-bold mb-2">{dest.title}</h3>
                <p className="text-white/80 mb-6 font-light">{dest.description}</p>
                <Link href="/destinations" className="inline-flex items-center text-gold font-semibold hover:text-white transition-colors">
                  View Highlights <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-navy text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 -skew-x-12 transform translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <span className="text-gold font-semibold tracking-widest uppercase text-sm">Our Services</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">Bespoke Travel Experiences</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="p-8 border border-white/10 rounded-lg hover:border-gold/50 transition-colors bg-white/5 backdrop-blur-sm">
                <div className="mb-6">{service.icon}</div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-white/60 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-20 text-center">
            <Link href="/experiences" className="bg-gold text-navy px-10 py-4 rounded-sm font-bold hover:bg-gold-light transition-colors inline-block">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-navy mb-8 leading-tight">
            Ready to Plan Your Next Extraordinary Journey?
          </h2>
          <p className="text-navy/60 text-xl mb-12 max-w-2xl mx-auto">
            Contact our travel experts today and let us craft a personalized experience that exceeds your expectations.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link href="/book" className="bg-navy text-white px-10 py-4 rounded-sm font-bold hover:bg-navy/90 transition-all shadow-xl w-full md:w-auto">
              Plan Your Experience
            </Link>
            <Link href="/contact" className="border-2 border-navy text-navy px-10 py-[14px] rounded-sm font-bold hover:bg-navy hover:text-white transition-all w-full md:w-auto">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
