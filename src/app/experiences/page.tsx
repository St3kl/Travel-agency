"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mountain,
  Utensils,
  Landmark,
  Users,
  Compass,
} from "lucide-react";

import { EXPERIENCES, type Experience } from "@/lib/experiences";

function getExperienceIcon(iconKey: Experience["iconKey"]): ReactNode {
  switch (iconKey) {
    case "mountain":
      return <Mountain size={32} className="text-gold" />;
    case "landmark":
      return <Landmark size={32} className="text-gold" />;
    case "utensils":
      return <Utensils size={32} className="text-gold" />;
    case "users":
      return <Users size={32} className="text-gold" />;
    case "compass":
    default:
      return <Compass size={32} className="text-gold" />;
  }
}

export default function ExperiencesPage() {
  return (
    <div className="pt-20">
      <section className="relative flex h-[40vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
            alt="Experiences"
            fill
            className="object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-5xl font-bold text-white md:text-7xl"
          >
            Our Experiences
          </motion.h1>
          <p className="mx-auto max-w-2xl text-lg font-light text-white/80 md:text-xl">
            Bespoke travel services tailored to your unique vision of discovery.
          </p>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl space-y-32 px-6">
          {EXPERIENCES.map((experience, idx) => (
            <motion.div
              key={experience.slug}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col items-center gap-16 ${
                idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
            >
              <div className="w-full lg:w-1/2">
                <div className="group relative h-[400px] overflow-hidden rounded-2xl shadow-2xl md:h-[500px]">
                  <Image
                    src={experience.image}
                    alt={experience.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-navy/10 transition-colors duration-300 group-hover:bg-transparent" />
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <div className="mb-6">{getExperienceIcon(experience.iconKey)}</div>
                <h2 className="mb-6 text-4xl font-bold text-navy">
                  {experience.title}
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-navy/70">
                  {experience.description}
                </p>

                <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {experience.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-center space-x-3 text-navy/80"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-gold" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link href="/book" className="btn-primary">
                    Inquire Now
                  </Link>
                  <Link
                    href={`/experiences/${experience.slug}`}
                    className="btn-secondary"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-navy py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="mb-8 text-3xl font-bold text-white md:text-5xl">
            Not sure which experience to choose?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/60">
            Our expert consultants are here to help you design the perfect
            journey tailored to your interests and preferences.
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center text-xl font-bold text-gold transition-colors hover:text-white"
          >
            Consult with an Expert
            <ArrowRight className="ml-2 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
