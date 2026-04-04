"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import {
  Calendar,
  Check,
  ClipboardCheck,
  Loader2,
  MapPin,
  MessageCircle,
  Users,
} from "lucide-react";

import {
  submitReservation,
} from "@/app/book/actions";
import { initialReservationState } from "@/app/book/form-state";
import { cn } from "@/lib/utils";

type BookingData = {
  destination: string;
  experience: string;
  travelDate: string;
  flexibleDates: "Yes" | "No";
  duration: string;
  guestCount: string;
  fullName: string;
  email: string;
  whatsapp: string;
  country: string;
  budget: string;
  accommodation: string;
  specialOccasion: string;
  notes: string;
  preferredContact: "Email" | "WhatsApp";
};

const steps = [
  { id: 1, name: "Trip", icon: <MapPin size={20} /> },
  { id: 2, name: "Traveler", icon: <Users size={20} /> },
  { id: 3, name: "Review", icon: <ClipboardCheck size={20} /> },
  { id: 4, name: "Done", icon: <Check size={20} /> },
];

const initialBookingData: BookingData = {
  destination: "",
  experience: "",
  travelDate: "",
  flexibleDates: "No",
  duration: "",
  guestCount: "2",
  fullName: "",
  email: "",
  whatsapp: "",
  country: "",
  budget: "",
  accommodation: "",
  specialOccasion: "",
  notes: "",
  preferredContact: "WhatsApp",
};

export default function ReservationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData);
  const [state, formAction, isSubmitting] = useActionState(
    submitReservation,
    initialReservationState,
  );


  const activeStep = state.success ? 4 : currentStep;

  const summaryItems = useMemo(
    () => [
      ["Destination", bookingData.destination],
      ["Experience", bookingData.experience],
      ["Preferred travel date", bookingData.travelDate],
      ["Flexible dates", bookingData.flexibleDates],
      ["Duration", bookingData.duration],
      ["Guests", bookingData.guestCount],
      ["Budget", bookingData.budget],
      ["Accommodation", bookingData.accommodation],
      ["Lead traveler", bookingData.fullName],
      ["Email", bookingData.email],
      ["WhatsApp", bookingData.whatsapp],
      ["Country", bookingData.country],
      ["Preferred contact", bookingData.preferredContact],
      ["Special occasion", bookingData.specialOccasion || "None specified"],
    ],
    [bookingData],
  );

  function updateField<K extends keyof BookingData>(
    field: K,
    value: BookingData[K],
  ) {
    setBookingData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  const canContinueTrip =
    Boolean(bookingData.destination) &&
    Boolean(bookingData.experience) &&
    Boolean(bookingData.travelDate) &&
    Boolean(bookingData.duration) &&
    Number(bookingData.guestCount) > 0;

  const canContinueTraveler =
    Boolean(bookingData.fullName) &&
    Boolean(bookingData.email) &&
    Boolean(bookingData.whatsapp) &&
    Boolean(bookingData.country) &&
    Boolean(bookingData.budget) &&
    Boolean(bookingData.accommodation);

  return (
    <div className="pt-32 pb-24 bg-off-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-navy mb-4">
            Reserve Your Experience
          </h1>
          <p className="text-navy/60 max-w-2xl mx-auto">
            Complete the reservation request and we will review it, send it to
            your preferred contact channel, and keep it marked as pending until
            it is approved or rejected by the team.
          </p>
        </div>

        <div className="flex justify-between items-center mb-12 relative gap-3">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  activeStep >= step.id
                    ? "bg-gold text-navy"
                    : "bg-white text-gray-400 border border-gray-200",
                )}
              >
                {activeStep > step.id ? <Check size={20} /> : step.icon}
              </div>
              <span
                className={cn(
                  "mt-2 text-[11px] md:text-xs font-bold uppercase tracking-wider text-center",
                  activeStep >= step.id ? "text-navy" : "text-gray-400",
                )}
              >
                {step.name}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {state.message && !state.success ? (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.message}
            </div>
          ) : null}

          {activeStep === 1 ? (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-navy">Trip Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Destination" error={state.fieldErrors?.destination?.[0]}>
                  <select
                    value={bookingData.destination}
                    onChange={(event) =>
                      updateField("destination", event.target.value)
                    }
                    className="w-full p-4 bg-off-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold outline-none"
                  >
                    <option value="">Select destination</option>
                    <option value="South Africa">South Africa</option>
                    <option value="Italy">Italy</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Kenya">Kenya</option>
                    <option value="France">France</option>
                    <option value="Japan">Japan</option>
                  </select>
                </Field>
                <Field label="Experience Type" error={state.fieldErrors?.experience?.[0]}>
                  <select
                    value={bookingData.experience}
                    onChange={(event) =>
                      updateField("experience", event.target.value)
                    }
                    className="w-full p-4 bg-off-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold outline-none"
                  >
                    <option value="">Select experience</option>
                    <option value="Luxury Safari">Luxury Safari</option>
                    <option value="Adventure & Exploration">
                      Adventure & Exploration
                    </option>
                    <option value="Cultural & Heritage">
                      Cultural & Heritage
                    </option>
                    <option value="Wine & Culinary Tours">
                      Wine & Culinary Tours
                    </option>
                    <option value="Group & Corporate Travel">
                      Group & Corporate Travel
                    </option>
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Field label="Preferred Travel Date" error={state.fieldErrors?.travelDate?.[0]}>
                  <input
                    type="date"
                    value={bookingData.travelDate}
                    onChange={(event) => updateField("travelDate", event.target.value)}
                    className="w-full p-4 bg-off-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold outline-none"
                  />
                </Field>
                <Field label="Trip Duration" error={state.fieldErrors?.duration?.[0]}>
                  <input
                    type="text"
                    placeholder="7 nights"
                    value={bookingData.duration}
                    onChange={(event) => updateField("duration", event.target.value)}
                    className="w-full p-4 bg-off-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold outline-none"
                  />
                </Field>
                <Field label="Guests" error={state.fieldErrors?.guestCount?.[0]}>
                  <input
                    type="number"
                    min="1"
                    value={bookingData.guestCount}
                    onChange={(event) => updateField("guestCount", event.target.value)}
                    className="w-full p-4 bg-off-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold outline-none"
                  />
                </Field>
              </div>

              <Field label="Are your dates flexible?" error={state.fieldErrors?.flexibleDates?.[0]}>
                <div className="flex flex-wrap gap-3">
                  {(["No", "Yes"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => updateField("flexibleDates", option)}
                      className={cn(
                        "px-5 py-3 rounded-full border text-sm font-semibold transition-colors",
                        bookingData.flexibleDates === option
                          ? "bg-navy text-white border-navy"
                          : "bg-white text-navy border-gray-200 hover:border-gold",
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={!canContinueTrip}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Traveler Details
                </button>
              </div>
            </section>
          ) : null}

          {activeStep === 2 ? (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-navy">Traveler Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Lead Traveler Name" error={state.fieldErrors?.fullName?.[0]}>
                  <input
                    type="text"
                    value={bookingData.fullName}
                    onChange={(event) => updateField("fullName", event.target.value)}
                    className="w-full p-4 bg-off-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold outline-none"
                    placeholder="Full name"
                  />
                </Field>
                <Field label="Email Address" error={state.fieldErrors?.email?.[0]}>
                  <input
                    type="email"
                    value={bookingData.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    className="w-full p-4 bg-off-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold outline-none"
                    placeholder="you@example.com"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="WhatsApp Number" error={state.fieldErrors?.whatsapp?.[0]}>
                  <input
                    type="tel"
                    value={bookingData.whatsapp}
                    onChange={(event) => updateField("whatsapp", event.target.value)}
                    className="w-full p-4 bg-off-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold outline-none"
                    placeholder="+27..."
                  />
                </Field>
                <Field label="Country of Residence" error={state.fieldErrors?.country?.[0]}>
                  <input
                    type="text"
                    value={bookingData.country}
                    onChange={(event) => updateField("country", event.target.value)}
                    className="w-full p-4 bg-off-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold outline-none"
                    placeholder="Country"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Budget Range" error={state.fieldErrors?.budget?.[0]}>
                  <select
                    value={bookingData.budget}
                    onChange={(event) => updateField("budget", event.target.value)}
                    className="w-full p-4 bg-off-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold outline-none"
                  >
                    <option value="">Select budget</option>
                    <option value="Under $2,500">Under $2,500</option>
                    <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                    <option value="$10,000+">$10,000+</option>
                  </select>
                </Field>
                <Field label="Accommodation Style" error={state.fieldErrors?.accommodation?.[0]}>
                  <select
                    value={bookingData.accommodation}
                    onChange={(event) =>
                      updateField("accommodation", event.target.value)
                    }
                    className="w-full p-4 bg-off-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold outline-none"
                  >
                    <option value="">Select style</option>
                    <option value="Luxury Lodge">Luxury Lodge</option>
                    <option value="Boutique Hotel">Boutique Hotel</option>
                    <option value="Family Friendly">Family Friendly</option>
                    <option value="Private Villa">Private Villa</option>
                    <option value="Open to Suggestions">Open to Suggestions</option>
                  </select>
                </Field>
              </div>

              <Field
                label="Preferred Contact Method"
                error={state.fieldErrors?.preferredContact?.[0]}
              >
                <div className="flex flex-wrap gap-3">
                  {(["WhatsApp", "Email"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => updateField("preferredContact", option)}
                      className={cn(
                        "px-5 py-3 rounded-full border text-sm font-semibold transition-colors",
                        bookingData.preferredContact === option
                          ? "bg-navy text-white border-navy"
                          : "bg-white text-navy border-gray-200 hover:border-gold",
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Special Occasion">
                  <input
                    type="text"
                    value={bookingData.specialOccasion}
                    onChange={(event) =>
                      updateField("specialOccasion", event.target.value)
                    }
                    className="w-full p-4 bg-off-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold outline-none"
                    placeholder="Honeymoon, birthday, anniversary..."
                  />
                </Field>
                <Field label="Additional Notes">
                  <textarea
                    rows={4}
                    value={bookingData.notes}
                    onChange={(event) => updateField("notes", event.target.value)}
                    className="w-full p-4 bg-off-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold outline-none resize-none"
                    placeholder="Dietary, accessibility, room preferences..."
                  />
                </Field>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 py-4 border border-navy text-navy rounded-md font-bold hover:bg-navy/5 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  disabled={!canContinueTraveler}
                  className="flex-[2] btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Review
                </button>
              </div>
            </section>
          ) : null}

          {activeStep === 3 ? (
            <form action={formAction} className="space-y-8">
              <input type="hidden" name="destination" value={bookingData.destination} />
              <input type="hidden" name="experience" value={bookingData.experience} />
              <input type="hidden" name="travelDate" value={bookingData.travelDate} />
              <input type="hidden" name="flexibleDates" value={bookingData.flexibleDates} />
              <input type="hidden" name="duration" value={bookingData.duration} />
              <input type="hidden" name="guestCount" value={bookingData.guestCount} />
              <input type="hidden" name="fullName" value={bookingData.fullName} />
              <input type="hidden" name="email" value={bookingData.email} />
              <input type="hidden" name="whatsapp" value={bookingData.whatsapp} />
              <input type="hidden" name="country" value={bookingData.country} />
              <input type="hidden" name="budget" value={bookingData.budget} />
              <input type="hidden" name="accommodation" value={bookingData.accommodation} />
              <input
                type="hidden"
                name="specialOccasion"
                value={bookingData.specialOccasion}
              />
              <input type="hidden" name="notes" value={bookingData.notes} />
              <input
                type="hidden"
                name="preferredContact"
                value={bookingData.preferredContact}
              />

              <div>
                <h2 className="text-2xl font-bold text-navy mb-3">
                  Review Reservation Request
                </h2>
                <p className="text-navy/60">
                  Once submitted, this request is saved with status
                  <span className="font-semibold text-navy"> pending</span> and sent
                  to the booking inbox for review.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {summaryItems.map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-gray-100 bg-off-white px-4 py-4"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-navy/40 mb-2">
                      {label}
                    </p>
                    <p className="text-sm text-navy">{value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-gold/30 bg-gold/5 px-5 py-4 text-sm text-navy/70">
                The reservation notification will be sent to the internal inbox and
                tracked from the admin list where it can move from pending to
                approved or rejected.
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 py-4 border border-navy text-navy rounded-md font-bold hover:bg-navy/5 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] btn-primary flex items-center justify-center disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Sending reservation...
                    </>
                  ) : (
                    "Submit Reservation Request"
                  )}
                </button>
              </div>
            </form>
          ) : null}

          {activeStep === 4 ? (
            <section className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <Check size={40} />
              </div>
              <h2 className="text-3xl font-bold text-navy mb-4">
                Thank You For Applying
              </h2>
              <p className="text-navy/60 text-lg mb-8 max-w-2xl mx-auto">
                Check your email. Your reservation request is currently
                <span className="font-semibold text-navy"> pending</span>, and we
                have sent a PDF summary with your reservation details.
              </p>
              <div className="bg-off-white p-6 rounded-lg text-center mb-10 max-w-2xl mx-auto">
                <p className="text-navy font-semibold mb-2">
                  Reservation status: pending
                </p>
                <p className="text-navy/60">
                  We will get in touch with you as soon as we finish processing
                  your request.
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Link href="/" className="btn-primary">
                  Return Home
                </Link>
              </div>
            </section>
          ) : null}
        </div>

        {activeStep < 4 ? (
          <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-navy/50 text-center">
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              Requests are reviewed manually before confirmation.
            </div>
            <div className="flex items-center">
              <MessageCircle size={16} className="mr-2" />
              You can choose email or WhatsApp as your preferred contact method.
            </div>
          </div>
        ) : null}
      </div>
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
      <span className="text-sm font-bold text-navy/70 uppercase tracking-wider">
        {label}
      </span>
      {children}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </label>
  );
}
