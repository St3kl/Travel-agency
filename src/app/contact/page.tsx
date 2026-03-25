"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Phone, MapPin, Camera, Globe, Send, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="pt-20">
      {/* Hero Header */}
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
            {/* Contact Information */}
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
                    <p className="text-navy/70">+1 (234) 567-890</p>
                    <p className="text-navy/70">+27 (12) 345-6789 (South Africa)</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="text-gold" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy mb-1 uppercase tracking-widest text-xs">Email</h3>
                    <p className="text-navy/70">info@ekeongroup.com</p>
                    <p className="text-navy/70">support@ekeongroup.com</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-navy mb-6 uppercase tracking-widest text-xs">Follow Us</h3>
                <div className="flex space-x-4">
                  {[Camera, Globe, Send].map((Icon, idx) => (
                    <Link key={idx} href="#" className="w-10 h-10 border border-navy/10 rounded-full flex items-center justify-center text-navy hover:bg-gold hover:border-gold hover:text-navy transition-all">
                      <Icon size={20} />
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="mt-12">
                <Link
                  href="https://wa.me/1234567890"
                  className="inline-flex items-center space-x-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold hover:shadow-lg transition-all"
                >
                  <MessageCircle size={24} />
                  <span>Chat with us on WhatsApp</span>
                </Link>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="bg-off-white rounded-3xl p-10 md:p-16 shadow-lg border border-gray-100">
              <h2 className="text-3xl font-bold text-navy mb-8">Send an Inquiry</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-navy/70 uppercase tracking-widest">First Name</label>
                    <input type="text" className="w-full p-4 bg-white border border-gray-100 rounded-lg outline-none focus:ring-1 focus:ring-gold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-navy/70 uppercase tracking-widest">Last Name</label>
                    <input type="text" className="w-full p-4 bg-white border border-gray-100 rounded-lg outline-none focus:ring-1 focus:ring-gold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-navy/70 uppercase tracking-widest">Email Address</label>
                  <input type="email" className="w-full p-4 bg-white border border-gray-100 rounded-lg outline-none focus:ring-1 focus:ring-gold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-navy/70 uppercase tracking-widest">Interested In</label>
                  <select className="w-full p-4 bg-white border border-gray-100 rounded-lg outline-none focus:ring-1 focus:ring-gold">
                    <option value="">Select Service</option>
                    <option value="Luxury Safari">Luxury Safari</option>
                    <option value="Adventure">Adventure & Exploration</option>
                    <option value="Cultural">Cultural & Heritage</option>
                    <option value="Culinary">Wine & Culinary Tours</option>
                    <option value="Corporate">Group & Corporate Travel</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-navy/70 uppercase tracking-widest">Message</label>
                  <textarea rows={5} className="w-full p-4 bg-white border border-gray-100 rounded-lg outline-none focus:ring-1 focus:ring-gold resize-none" />
                </div>
                <button className="btn-primary w-full py-5">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
