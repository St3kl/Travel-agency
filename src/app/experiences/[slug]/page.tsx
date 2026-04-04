import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  Landmark,
  Mountain,
  Utensils,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { notFound } from "next/navigation";

import { EXPERIENCES, getExperienceBySlug, type Experience } from "@/lib/experiences";

type ExperiencePageProps = {
  params: Promise<{ slug: string }>;
};

function getExperienceIcon(iconKey: Experience["iconKey"]) {
  switch (iconKey) {
    case "mountain":
      return <Mountain className="text-gold" size={34} />;
    case "landmark":
      return <Landmark className="text-gold" size={34} />;
    case "utensils":
      return <Utensils className="text-gold" size={34} />;
    case "users":
      return <Users className="text-gold" size={34} />;
    case "compass":
    default:
      return <Compass className="text-gold" size={34} />;
  }
}

export function generateStaticParams() {
  return EXPERIENCES.map((experience) => ({
    slug: experience.slug,
  }));
}

export async function generateMetadata({
  params,
}: ExperiencePageProps): Promise<Metadata> {
  const { slug } = await params;
  const experience = getExperienceBySlug(slug);

  if (!experience) {
    return {
      title: "Experience Not Found | Ekeon Group",
    };
  }

  return {
    title: `${experience.title} | Ekeon Group Experiences`,
    description: experience.summary,
  };
}

export default async function ExperienceDetailPage({
  params,
}: ExperiencePageProps) {
  const { slug } = await params;
  const experience = getExperienceBySlug(slug);

  if (!experience) {
    notFound();
  }

  return (
    <div className="bg-white pt-20">
      <section className="relative min-h-[62vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={experience.image}
            alt={experience.title}
            fill
            className="object-cover brightness-[0.38]"
            priority
          />
        </div>
        <div className="relative mx-auto flex min-h-[62vh] max-w-7xl items-end px-6 py-16">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur-sm">
              {getExperienceIcon(experience.iconKey)}
              <span>Signature Experience</span>
            </div>
            <h1 className="mb-5 text-5xl font-bold leading-tight text-white md:text-7xl">
              {experience.title}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
              {experience.summary}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-gold">
              Overview
            </p>
            <h2 className="mb-6 text-4xl font-bold text-navy">
              A More Detailed Look
            </h2>
            <div className="space-y-5 text-lg leading-relaxed text-navy/70">
              {experience.detailedOverview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-navy/10 bg-off-white p-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-gold">
              Highlights
            </p>
            <h3 className="mb-6 text-2xl font-bold text-navy">
              What Defines This Experience
            </h3>
            <div className="space-y-4">
              {experience.highlights.map((highlight) => (
                <div key={highlight} className="flex items-start gap-3 text-navy/75">
                  <CheckCircle2 className="mt-0.5 text-gold" size={18} />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-off-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-gold">
              Best For
            </p>
            <h2 className="text-4xl font-bold text-navy">
              Who This Experience Fits Best
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {experience.idealFor.map((item) => (
              <div
                key={item}
                className="rounded-[2rem] border border-navy/10 bg-white p-7 shadow-sm"
              >
                <p className="text-base leading-relaxed text-navy/75">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-gold">
              Visual Highlights
            </p>
            <h2 className="text-4xl font-bold text-navy">
              The Mood And Setting Of This Experience
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-navy/65">
              A more atmospheric look at how this experience feels on the
              ground, from the scenery and rhythm to the kind of moments we try
              to build into the journey.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="relative">
              <div className="absolute -top-6 -left-6 hidden h-32 w-32 rounded-full bg-gold/10 blur-2xl lg:block" />
              <div className="absolute right-6 -bottom-10 hidden h-36 w-36 rounded-full bg-navy/8 blur-3xl lg:block" />

              <div className="group relative min-h-[30rem] overflow-hidden rounded-[2.5rem] shadow-[0_30px_80px_rgba(7,18,30,0.12)]">
                <Image
                  src={experience.visualImages[0]?.src ?? experience.image}
                  alt={experience.visualImages[0]?.alt ?? experience.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/18 to-transparent" />
                <div className="absolute top-6 left-6 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm">
                  {experience.visualImages[0]?.label ?? "Signature mood"}
                </div>
                <div className="absolute right-6 bottom-6 left-6">
                  <p className="max-w-xl text-2xl font-semibold leading-snug text-white md:text-3xl">
                    {experience.visualImages[0]?.alt ?? experience.summary}
                  </p>
                </div>
              </div>

              <div className="relative z-10 mx-auto -mt-14 w-[86%] rounded-[2rem] border border-white/70 bg-white/92 p-6 shadow-2xl backdrop-blur-sm lg:mr-0 lg:ml-auto lg:w-[68%]">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-gold">
                  Experience Notes
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {experience.highlights.slice(0, 4).map((highlight) => (
                    <div
                      key={highlight}
                      className="rounded-2xl border border-navy/8 bg-off-white px-4 py-4"
                    >
                      <p className="text-sm font-medium leading-relaxed text-navy/75">
                        {highlight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-navy/10 bg-off-white p-8">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-gold">
                  Atmosphere
                </p>
                <p className="text-lg leading-relaxed text-navy/70">
                  {experience.detailedOverview[0]}
                </p>
              </div>

              <div className="group relative min-h-[20rem] overflow-hidden rounded-[2rem] shadow-[0_24px_60px_rgba(7,18,30,0.10)]">
                <Image
                  src={experience.visualImages[1]?.src ?? experience.image}
                  alt={experience.visualImages[1]?.alt ?? experience.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-gold">
                    {experience.visualImages[1]?.label ?? "Travel context"}
                  </p>
                  <p className="max-w-md text-lg text-white/85">
                    {experience.visualImages[1]?.alt ?? experience.summary}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[1.75rem] border border-navy/10 bg-white p-6 shadow-sm">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-navy/40">
                    Key Moments
                  </p>
                  <p className="text-3xl font-bold text-navy">
                    {experience.highlights.length}
                  </p>
                  <p className="mt-2 text-sm text-navy/60">
                    signature touchpoints layered into the trip
                  </p>
                </div>
                <div className="rounded-[1.75rem] border border-navy/10 bg-navy p-6 shadow-sm">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-gold">
                    Included
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {experience.inclusions.length}
                  </p>
                  <p className="mt-2 text-sm text-white/65">
                    curated elements shaping the experience flow
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-gold">
              Journey Design
            </p>
            <h2 className="text-4xl font-bold text-navy">
              What We Typically Include
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-navy/10 bg-off-white p-8">
              <h3 className="mb-6 text-2xl font-bold text-navy">Inclusions</h3>
              <div className="space-y-4">
                {experience.inclusions.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-navy/75">
                    <div className="mt-2 h-1.5 w-1.5 rounded-full bg-gold" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-navy/10 bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-2xl font-bold text-navy">Experience Flow</h3>
              <div className="space-y-4">
                {experience.experienceFlow.map((item) => (
                  <div key={item} className="flex items-start gap-4">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/15 text-sm font-bold text-navy">
                      {experience.experienceFlow.indexOf(item) + 1}
                    </span>
                    <p className="text-navy/75">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Interested In {experience.title}?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/65">
            We can tailor this experience around your travel style, destination
            priorities, and preferred pace. Let&apos;s shape something that feels
            specific to you.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
            <Link href="/book" className="btn-primary w-full text-center md:w-auto">
              Inquire Now
            </Link>
            <Link
              href="/experiences"
              className="group inline-flex w-full items-center justify-center text-center font-bold text-gold transition-colors hover:text-white md:w-auto"
            >
              Back to All Experiences
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
