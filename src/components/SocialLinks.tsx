import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";

import { SOCIAL_LINKS } from "@/lib/contact";

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 24 24"
      width={size}
      height={size}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.12v12.4a2.67 2.67 0 1 1-2.67-2.67c.26 0 .51.04.75.11V8.66a5.8 5.8 0 0 0-.75-.05A5.8 5.8 0 1 0 15.82 14V8.73a7.91 7.91 0 0 0 4.65 1.5V7.11c-.3 0-.59-.03-.88-.08Z" />
    </svg>
  );
}

function getSocialIcon(key: (typeof SOCIAL_LINKS)[number]["key"]) {
  switch (key) {
    case "instagram":
      return <Instagram size={20} />;
    case "linkedin":
      return <Linkedin size={20} />;
    case "tiktok":
    default:
      return <TikTokIcon size={20} />;
  }
}

export default function SocialLinks({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) {
  const sharedClasses =
    variant === "dark"
      ? "border-white/15 text-white/60 hover:border-gold hover:text-gold"
      : "border-navy/10 text-navy hover:border-gold hover:bg-gold hover:text-navy";

  return (
    <div className="flex flex-wrap gap-3">
      {SOCIAL_LINKS.map((social) =>
        social.url ? (
          <Link
            key={social.key}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            aria-label={social.label}
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all ${sharedClasses}`}
          >
            {getSocialIcon(social.key)}
          </Link>
        ) : (
          <span
            key={social.key}
            aria-label={`${social.label} placeholder`}
            title={`Add your ${social.label} link later in src/lib/contact.ts`}
            className={`flex h-11 w-11 items-center justify-center rounded-full border border-dashed transition-all ${sharedClasses} cursor-default`}
          >
            {getSocialIcon(social.key)}
          </span>
        ),
      )}
    </div>
  );
}
