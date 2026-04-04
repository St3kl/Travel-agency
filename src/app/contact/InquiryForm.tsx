"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Check,
  Loader2,
} from "lucide-react";

import { submitInquiry } from "@/app/contact/actions";
import { initialInquiryState } from "@/app/contact/form-state";
import SocialLinks from "@/components/SocialLinks";
import {
  CONTACT_EMAIL,
  CONTACT_WHATSAPP,
  CONTACT_WHATSAPP_URL,
} from "@/lib/contact";

const serviceOptions = [
  "Luxury Safari",
  "Adventure & Exploration",
  "Cultural & Heritage",
  "Wine & Culinary Tours",
  "Group & Corporate Travel",
];

export default function ContactInquiryForm() {
  const [state, formAction, isSubmitting] = useActionState(
    submitInquiry,
    initialInquiryState,
  );
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    interestedIn: "",
    message: "",
  });

  const isSuccess = state.success;

  function updateField(
    field: keyof typeof formValues,
    value: string,
  ) {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <div className="pt-20">
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074&auto=format&fit=crop"
            alt="Contact Us"
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
            Get in Touch
          </motion.h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-light">
            We&apos;re here to help you plan your next extraordinary journey.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-4xl font-bold text-navy mb-8">Contact Information</h2>
              <p className="text-navy/60 text-lg mb-12 leading-relaxed">
                Whether you have a question about our experiences, destinations, or want a custom proposal, our team is ready to assist you.
              </p>

              <div className="space-y-8 mb-12">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="text-gold" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy mb-1 uppercase tracking-widest text-xs">Our Location</h3>
                    <p className="text-navy/70">Global Presence, Local Partners Worldwide</p>
                    <p className="text-navy/70">Headquarters in South Africa & Europe</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="text-gold" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy mb-1 uppercase tracking-widest text-xs">Phone</h3>
                    <p className="text-navy/70">{CONTACT_WHATSAPP}</p>
                    <p className="text-navy/70">Available on WhatsApp</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="text-gold" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy mb-1 uppercase tracking-widest text-xs">Email</h3>
                    <p className="text-navy/70">{CONTACT_EMAIL}</p>
                    <p className="text-navy/70">Primary reservations and inquiries inbox</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-navy mb-6 uppercase tracking-widest text-xs">Follow Us</h3>
                <SocialLinks variant="light" />
              </div>

              <div className="mt-12">
                <Link
                  href={CONTACT_WHATSAPP_URL}
                  className="inline-flex items-center space-x-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold hover:shadow-lg transition-all"
                >
                  <MessageCircle size={24} />
                  <span>Chat with us on WhatsApp</span>
                </Link>
              </div>
            </div>

            <div className="bg-off-white rounded-3xl p-10 md:p-16 shadow-lg border border-gray-100">
              {!isSuccess ? (
                <>
                  <h2 className="text-3xl font-bold text-navy mb-8">Send an Inquiry</h2>
                  {state.message ? (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {state.message}
                    </div>
                  ) : null}
                  <form action={formAction} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field label="First Name" error={state.fieldErrors?.firstName?.[0]}>
                        <input
                          type="text"
                          name="firstName"
                          value={formValues.firstName}
                          onChange={(event) => updateField("firstName", event.target.value)}
                          className="w-full p-4 bg-white border border-gray-100 rounded-lg outline-none focus:ring-1 focus:ring-gold"
                        />
                      </Field>
                      <Field label="Last Name" error={state.fieldErrors?.lastName?.[0]}>
                        <input
                          type="text"
                          name="lastName"
                          value={formValues.lastName}
                          onChange={(event) => updateField("lastName", event.target.value)}
                          className="w-full p-4 bg-white border border-gray-100 rounded-lg outline-none focus:ring-1 focus:ring-gold"
                        />
                      </Field>
                    </div>
                    <Field label="Email Address" error={state.fieldErrors?.email?.[0]}>
                      <input
                        type="email"
                        name="email"
                        value={formValues.email}
                        onChange={(event) => updateField("email", event.target.value)}
                        className="w-full p-4 bg-white border border-gray-100 rounded-lg outline-none focus:ring-1 focus:ring-gold"
                      />
                    </Field>
                    <Field label="Interested In" error={state.fieldErrors?.interestedIn?.[0]}>
                      <select
                        name="interestedIn"
                        value={formValues.interestedIn}
                        onChange={(event) => updateField("interestedIn", event.target.value)}
                        className="w-full p-4 bg-white border border-gray-100 rounded-lg outline-none focus:ring-1 focus:ring-gold"
                      >
                        <option value="">Select Service</option>
                        {serviceOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Message" error={state.fieldErrors?.message?.[0]}>
                      <textarea
                        name="message"
                        rows={5}
                        value={formValues.message}
                        onChange={(event) => updateField("message", event.target.value)}
                        className="w-full p-4 bg-white border border-gray-100 rounded-lg outline-none focus:ring-1 focus:ring-gold resize-none"
                      />
                    </Field>
                    <button className="btn-primary w-full py-5 flex items-center justify-center" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin mr-2" />
                          Sending inquiry...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Check size={40} />
                  </div>
                  <h2 className="text-3xl font-bold text-navy mb-4">
                    Thank You For Reaching Out
                  </h2>
                  <p className="text-navy/60 text-lg mb-8 max-w-xl mx-auto">
                    Check your email. Your inquiry has been received and is currently pending review.
                  </p>
                  <div className="bg-white rounded-2xl p-6 text-center mb-8 border border-gray-100">
                    <p className="text-navy font-semibold mb-2">Inquiry status: pending</p>
                    <p className="text-navy/60">
                      We will contact you as soon as we finish processing your request.
                    </p>
                  </div>
                  <Link href="/" className="btn-primary inline-flex items-center justify-center">
                    Return Home
                  </Link>
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
    <label className="space-y-2 block">
      <span className="text-xs font-bold text-navy/70 uppercase tracking-widest">{label}</span>
      {children}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </label>
  );
}
