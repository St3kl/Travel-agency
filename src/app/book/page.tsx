"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CreditCard, Calendar, Users, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, name: "Plan", icon: <MapPin size={20} /> },
  { id: 2, name: "Details", icon: <Users size={20} /> },
  { id: 3, name: "Payment", icon: <CreditCard size={20} /> },
  { id: 4, name: "Confirm", icon: <Check size={20} /> },
];

export default function BookPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingData, setBookingData] = useState({
    destination: "",
    experience: "",
    date: "",
    guests: "2",
    name: "",
    email: "",
    notes: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const simulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      nextStep();
    }, 3000);
  };

  return (
    <div className="pt-32 pb-24 bg-off-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-navy mb-4">Book Your Experience</h1>
          <p className="text-navy/60">Secure your premium travel experience with Ekeon Group.</p>
        </div>

        {/* Stepper */}
        <div className="flex justify-between items-center mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  currentStep >= step.id ? "bg-gold text-navy" : "bg-white text-gray-400 border border-gray-200"
                )}
              >
                {currentStep > step.id ? <Check size={20} /> : step.icon}
              </div>
              <span className={cn(
                "mt-2 text-xs font-bold uppercase tracking-wider",
                currentStep >= step.id ? "text-navy" : "text-gray-400"
              )}>
                {step.name}
              </span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-navy mb-8">Choose Your Journey</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy/70 uppercase tracking-wider">Destination</label>
                    <select
                      name="destination"
                      value={bookingData.destination}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-off-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold outline-none"
                    >
                      <option value="">Select Destination</option>
                      <option value="South Africa">South Africa</option>
                      <option value="Italy">Italy</option>
                      <option value="Thailand">Thailand</option>
                      <option value="Kenya">Kenya</option>
                      <option value="France">France</option>
                      <option value="Japan">Japan</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy/70 uppercase tracking-wider">Experience Type</label>
                    <select
                      name="experience"
                      value={bookingData.experience}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-off-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold outline-none"
                    >
                      <option value="">Select Experience</option>
                      <option value="Luxury Safari">Luxury Safari</option>
                      <option value="Adventure">Adventure & Exploration</option>
                      <option value="Cultural">Cultural & Heritage</option>
                      <option value="Culinary">Wine & Culinary</option>
                      <option value="Corporate">Group & Corporate</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-navy/70 uppercase tracking-wider">Preferred Date</label>
                  <input
                    type="date"
                    name="date"
                    value={bookingData.date}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-off-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold outline-none"
                  />
                </div>
                <button
                  onClick={nextStep}
                  disabled={!bookingData.destination || !bookingData.experience || !bookingData.date}
                  className="w-full py-4 bg-navy text-white rounded-lg font-bold hover:bg-navy/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Personal Details
                </button>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-navy mb-8">Personal Details</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy/70 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={bookingData.name}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-off-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy/70 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={bookingData.email}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-off-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy/70 uppercase tracking-wider">Number of Guests</label>
                    <input
                      type="number"
                      name="guests"
                      min="1"
                      value={bookingData.guests}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-off-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy/70 uppercase tracking-wider">Special Requirements</label>
                    <textarea
                      name="notes"
                      rows={3}
                      placeholder="Any dietary restrictions, accessibility needs, etc."
                      value={bookingData.notes}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-off-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-gold outline-none resize-none"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={prevStep}
                    className="flex-1 py-4 border border-navy text-navy rounded-lg font-bold hover:bg-navy/5 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!bookingData.name || !bookingData.email}
                    className="flex-[2] py-4 bg-navy text-white rounded-lg font-bold hover:bg-navy/90 transition-all disabled:opacity-50"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-navy mb-4">Secure Payment</h2>
                <div className="bg-navy/5 p-6 rounded-lg mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-navy/60">Selected Experience</span>
                    <span className="font-bold text-navy">{bookingData.experience} - {bookingData.destination}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-navy/60">Guests</span>
                    <span className="font-bold text-navy">{bookingData.guests}</span>
                  </div>
                  <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
                    <span className="text-lg font-bold text-navy">Total (Quote)</span>
                    <span className="text-lg font-bold text-gold">Calculated upon request</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border border-gold bg-gold/5 rounded-lg flex items-center space-x-4">
                    <CreditCard className="text-gold" />
                    <div>
                      <p className="font-bold text-navy">Secure Payment Integration</p>
                      <p className="text-xs text-navy/60">Accepting PayFast, Stripe, and PayPal</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-100 rounded-lg flex items-center justify-center grayscale hover:grayscale-0 cursor-pointer transition-all">
                      <span className="font-bold text-gray-400">STRIPE</span>
                    </div>
                    <div className="p-4 border border-gray-100 rounded-lg flex items-center justify-center grayscale hover:grayscale-0 cursor-pointer transition-all">
                      <span className="font-bold text-gray-400">PAYPAL</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={prevStep}
                    className="flex-1 py-4 border border-navy text-navy rounded-lg font-bold hover:bg-navy/5 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={simulatePayment}
                    disabled={isProcessing}
                    className="flex-[2] py-4 bg-navy text-white rounded-lg font-bold hover:bg-navy/90 transition-all flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      "Complete Secure Booking"
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Check size={40} />
                </div>
                <h2 className="text-3xl font-bold text-navy mb-4">Booking Confirmed!</h2>
                <p className="text-navy/60 text-lg mb-8 max-w-md mx-auto">
                  Thank you, {bookingData.name.split(' ')[0]}! We've sent a confirmation email to {bookingData.email}. Our travel experts will contact you within 24 hours to finalize your itinerary.
                </p>
                <div className="bg-off-white p-6 rounded-lg text-left mb-10">
                  <h3 className="font-bold text-navy mb-4 uppercase tracking-wider text-xs">Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-navy/60">Destination</span>
                      <span className="font-bold">{bookingData.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy/60">Experience</span>
                      <span className="font-bold">{bookingData.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy/60">Date</span>
                      <span className="font-bold">{bookingData.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy/60">Booking ID</span>
                      <span className="font-bold text-gold">EK-{Math.floor(100000 + Math.random() * 900000)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => window.location.href = "/"}
                  className="bg-navy text-white px-10 py-4 rounded-lg font-bold hover:bg-navy/90 transition-all"
                >
                  Return to Home
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Support Info */}
        {currentStep < 4 && (
          <div className="mt-8 text-center flex items-center justify-center space-x-6 text-sm text-navy/40">
            <div className="flex items-center">
              <ShieldCheck size={16} className="mr-2" />
              Secure 256-bit SSL Encryption
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              Flexible Cancellation Policies
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ShieldCheck({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
