"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isHomePage = pathname === "/";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Experiences", href: "/experiences" },
    { name: "Destinations", href: "/destinations" },
    { name: "Book Online", href: "/book", highlight: true },
    { name: "Partner With Us", href: "/partner" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-[80] transition-all duration-300 px-4 py-3 sm:px-6",
          scrolled || !isHomePage
            ? "bg-navy/95 shadow-lg backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <Link href="/" className="flex items-center space-x-2 min-w-0">
            <span className="text-lg sm:text-2xl font-bold tracking-tight sm:tracking-tighter text-white leading-none">
              EKEON <span className="text-gold">GROUP</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-3 xl:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-gold px-3 py-2 rounded-md whitespace-nowrap",
                  pathname === link.href && !link.highlight && "text-gold",
                  link.highlight
                    ? "bg-gold text-navy hover:bg-gold-light shadow-sm"
                    : "text-white/90",
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2.5 rounded-full border border-white/15 bg-white/10 backdrop-blur-sm"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              type="button"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 z-[60] bg-navy/75 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div
            id="mobile-menu"
            className="fixed inset-x-4 top-20 z-[70] lg:hidden"
          >
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-navy text-white shadow-2xl ring-1 ring-black/10">
              <div className="border-b border-white/10 px-5 pt-5 pb-3">
                <p className="text-xs uppercase tracking-[0.3em] text-gold/80">
                  Navigation
                </p>
              </div>
              <div className="max-h-[calc(100dvh-7rem)] overflow-y-auto p-4">
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "rounded-2xl px-4 py-3 text-base font-medium transition-colors",
                        pathname === link.href && !link.highlight
                          ? "bg-white/10 text-gold"
                          : "text-white hover:bg-white/10",
                        link.highlight &&
                          "bg-gold text-center text-navy hover:bg-gold-light",
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
