"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useActionState, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Handshake,
  TrendingUp,
  Zap,
  Check,
  Loader2,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import { submitPartnerInquiry } from "@/app/partner/actions";
import { initialPartnerInquiryState } from "@/app/partner/form-state";

const models = [
  {
    title: "Commission Model",
    description:
      "Earn competitive commissions by booking your clients into Ekeon Group's premium experiences.",
    icon: <TrendingUp className="text-gold" size={32} />,
  },
  {
    title: "Co-Branding",
    description:
      "Collaborate on exclusive itineraries that leverage both our brands' strengths and reputations.",
    icon: <Handshake className="text-gold" size={32} />,
  },
  {
    title: "White-Label Services",
    description:
      "Our local expertise, your brand. We operate the tours while you maintain the client relationship.",
    icon: <Zap className="text-gold" size={32} />,
  },
];

export default function PartnerPage() {
  const [state, formAction, isSubmitting] = useActionState(
    submitPartnerInquiry,
    initialPartnerInquiryState,
  );
  const [formValues, setFormValues] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    primaryDestination: "",
    whatsapp: "",
    message: "",
  });

  const isSuccess = state.success;

  function updateField(field: keyof typeof formValues, value: string) {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <div className="pt-20">
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

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Briefcase className="text-gold mx-auto mb-6" size={48} />
          <h2 className="text-4xl font-bold text-navy mb-8">
            Collaborate for Global Success
          </h2>
          <p className="text-navy/70 text-lg leading-relaxed mb-12">
            Ekeon Group is constantly seeking professional, reliable local tour
            operators and destination management companies to join our global
            network. By partnering with us, you gain access to an international
            clientele seeking premium, authentic experiences.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {models.map((model, idx) => (
              <div
                key={idx}
                className="p-8 bg-off-white rounded-xl border border-gray-100 hover:border-gold/30 transition-all"
              >
                <div className="mb-6">{model.icon}</div>
                <h3 className="text-xl font-bold text-navy mb-4">
                  {model.title}
                </h3>
                <p className="text-navy/60 text-sm leading-relaxed">
                  {model.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8">Let&apos;s Grow Together</h2>
              <p className="text-white/60 text-lg mb-10 leading-relaxed">
                Interested in becoming an Ekeon Group partner? Fill out the
                form, and our partnership development team will be in touch to
                discuss potential collaboration models.
              </p>
              <div className="mb-10 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-gold">
                  What helps us review faster
                </p>
                <div className="space-y-4 text-sm text-white/75">
                  <div className="flex items-start gap-3">
                    <Handshake className="mt-0.5 text-gold" size={18} />
                    <p>Your strongest destinations and the kind of travelers you serve best.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageCircle className="mt-0.5 text-gold" size={18} />
                    <p>A direct WhatsApp number so our team can reach you quickly if needed.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 text-gold" size={18} />
                    <p>A short message explaining the kind of partnership you would like to build with us.</p>
                  </div>
                </div>
              </div>
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
              {!isSuccess ? (
                <>
                  <div className="mb-8">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-gold">
                      Partnership Request
                    </p>
                    <h2 className="text-3xl font-bold text-navy">
                      Submit Partnership Inquiry
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-navy/60">
                      Share a few essentials about your company and operating destinations. We will review your request and reply by email.
                    </p>
                  </div>
                  {state.message ? (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {state.message}
                    </div>
                  ) : null}
                  <form action={formAction} className="space-y-6">
                    <div className="rounded-[1.5rem] border border-navy/8 bg-off-white p-5">
                      <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-navy/45">
                        Company Details
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field
                          label="Company Name"
                          error={state.fieldErrors?.companyName?.[0]}
                        >
                          <input
                            type="text"
                            name="companyName"
                            value={formValues.companyName}
                            onChange={(event) =>
                              updateField("companyName", event.target.value)
                            }
                            placeholder="Your company or DMC name"
                            className="w-full rounded-xl border border-gray-100 bg-white p-3 text-navy outline-none focus:ring-1 focus:ring-gold"
                          />
                        </Field>
                        <Field
                          label="Contact Person"
                          error={state.fieldErrors?.contactPerson?.[0]}
                        >
                          <input
                            type="text"
                            name="contactPerson"
                            value={formValues.contactPerson}
                            onChange={(event) =>
                              updateField("contactPerson", event.target.value)
                            }
                            placeholder="Full name"
                            className="w-full rounded-xl border border-gray-100 bg-white p-3 text-navy outline-none focus:ring-1 focus:ring-gold"
                          />
                        </Field>
                        <Field label="Work Email" error={state.fieldErrors?.email?.[0]}>
                          <input
                            type="email"
                            name="email"
                            value={formValues.email}
                            onChange={(event) =>
                              updateField("email", event.target.value)
                            }
                            placeholder="name@company.com"
                            className="w-full rounded-xl border border-gray-100 bg-white p-3 text-navy outline-none focus:ring-1 focus:ring-gold"
                          />
                        </Field>
                        <Field
                          label="WhatsApp"
                          error={state.fieldErrors?.whatsapp?.[0]}
                        >
                          <div className="relative">
                            <MessageCircle
                              size={16}
                              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy/35"
                            />
                            <input
                              type="text"
                              name="whatsapp"
                              value={formValues.whatsapp}
                              onChange={(event) =>
                                updateField("whatsapp", event.target.value)
                              }
                              placeholder="+27..."
                              className="w-full rounded-xl border border-gray-100 bg-white py-3 pr-3 pl-10 text-navy outline-none focus:ring-1 focus:ring-gold"
                            />
                          </div>
                        </Field>
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-navy/8 bg-off-white p-5">
                      <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-navy/45">
                        Collaboration Scope
                      </p>
                      <div className="grid grid-cols-1 gap-6">
                        <Field
                          label="Primary Destination"
                          error={state.fieldErrors?.primaryDestination?.[0]}
                        >
                          <input
                            type="text"
                            name="primaryDestination"
                            value={formValues.primaryDestination}
                            onChange={(event) =>
                              updateField("primaryDestination", event.target.value)
                            }
                            placeholder="e.g., Africa, France, Italy"
                            className="w-full rounded-xl border border-gray-100 bg-white p-3 text-navy outline-none focus:ring-1 focus:ring-gold"
                          />
                        </Field>
                      </div>
                    </div>

                    <Field label="Brief Message" error={state.fieldErrors?.message?.[0]}>
                      <textarea
                        name="message"
                        rows={5}
                        value={formValues.message}
                        onChange={(event) => updateField("message", event.target.value)}
                        placeholder="Tell us about your operation, ideal clients, and how you would like to collaborate."
                        className="w-full rounded-2xl border border-gray-100 bg-off-white p-4 text-navy outline-none focus:ring-1 focus:ring-gold resize-none"
                      />
                    </Field>
                    <button
                      className="btn-primary w-full flex items-center justify-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 animate-spin" />
                          Sending partnership inquiry...
                        </>
                      ) : (
                        "Submit Partnership Inquiry"
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Check size={40} />
                  </div>
                  <h2 className="mb-4 text-3xl font-bold text-navy">
                    Thank You For Reaching Out
                  </h2>
                  <p className="mx-auto mb-8 max-w-xl text-lg text-navy/60">
                    Check your email. Your partnership inquiry has been received
                    successfully and our team will contact you soon.
                  </p>
                  <div className="rounded-2xl border border-gray-100 bg-off-white p-6 text-center">
                    <p className="mb-2 font-semibold text-navy">
                      Partnership inquiry received
                    </p>
                    <p className="text-navy/60">
                      We will review your details and reply by email after our
                      partnership team has assessed your request.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  children,
  label,
  error,
}: {
  children: ReactNode;
  label: string;
  error?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-bold text-navy/70 uppercase tracking-widest">
        {label}
      </span>
      {children}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </label>
  );
}
