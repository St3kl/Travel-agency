export type Experience = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  visualImages: Array<{
    src: string;
    alt: string;
    label: string;
  }>;
  iconKey: "compass" | "mountain" | "landmark" | "utensils" | "users";
  highlights: string[];
  idealFor: string[];
  inclusions: string[];
  experienceFlow: string[];
  detailedOverview: string[];
};

export const EXPERIENCES: Experience[] = [
  {
    slug: "luxury-safaris",
    title: "Luxury Safaris",
    summary: "Immersive wildlife journeys with exclusive lodges, private guides, and seamless comfort throughout.",
    description:
      "Immerse yourself in the wild without compromising on comfort. Our luxury safaris feature exclusive lodges, private guides, and bespoke itineraries in the world's most iconic wildlife reserves.",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop",
    visualImages: [
      {
        src: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1974&auto=format&fit=crop",
        alt: "Safari landscape in East Africa",
        label: "Wildlife landscapes",
      },
      {
        src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop",
        alt: "Scenic luxury travel route",
        label: "Scenic arrival moments",
      },
    ],
    iconKey: "compass",
    highlights: [
      "Private Game Drives",
      "Eco-Luxury Lodges",
      "Expert Trackers",
      "Boutique Bush Dining",
    ],
    idealFor: [
      "Honeymooners seeking a once-in-a-lifetime safari",
      "Families wanting safe, elevated wildlife encounters",
      "Luxury travelers who want privacy and top-tier service",
    ],
    inclusions: [
      "Tailored lodge and camp selection",
      "Airport meets, transfers, and in-destination logistics",
      "Privately guided wildlife and conservation experiences",
      "Curated dining moments in the bush and lodge settings",
    ],
    experienceFlow: [
      "Arrival and private transfer into your selected reserve",
      "Game-viewing rhythm built around sunrise and sunset activity",
      "Downtime for spa, wellness, and lodge-based experiences",
      "Closing nights designed around signature dining or scenic stays",
    ],
    detailedOverview: [
      "Our safari itineraries are built around pace, privacy, and access. Rather than filling every hour, we shape the journey around the most rewarding moments of the landscape and the wildlife cycle.",
      "We work with premium operators and camps that understand discretion, hospitality, and detail. That means exceptional guiding, beautiful design, and a trip that feels considered from the first transfer to the final night.",
    ],
  },
  {
    slug: "adventure-exploration",
    title: "Adventure & Exploration",
    summary: "Bold, active itineraries designed for travelers who want challenge, motion, and memorable landscapes.",
    description:
      "For those who seek the thrill of the unknown. From trekking remote mountain ranges to diving in pristine coral reefs, we curate adventures that push boundaries and create lifelong memories.",
    image:
      "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=1974&auto=format&fit=crop",
    visualImages: [
      {
        src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop",
        alt: "Open road adventure through dramatic scenery",
        label: "Road and terrain",
      },
      {
        src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop",
        alt: "Wide landscape for active exploration",
        label: "Big open landscapes",
      },
    ],
    iconKey: "mountain",
    highlights: [
      "Expedition-Grade Gear",
      "Certified Adventure Guides",
      "Remote Destinations",
      "Active Itineraries",
    ],
    idealFor: [
      "Travelers who enjoy movement and outdoor challenge",
      "Couples or friends planning an active escape",
      "Explorers who want less scripted and more immersive trips",
    ],
    inclusions: [
      "Adventure-ready routing and timing",
      "Qualified local guides and safety-first planning",
      "Gear and support recommendations before departure",
      "Balance of activity, recovery, and scenic downtime",
    ],
    experienceFlow: [
      "Trip design based on fitness level, appetite for challenge, and terrain",
      "Active days with guide-led progression and support",
      "Recovery moments layered into the itinerary to avoid fatigue",
      "Optional add-ons for water, mountain, or remote exploration",
    ],
    detailedOverview: [
      "Adventure travel works best when it feels exciting without becoming chaotic. We build itineraries that respect your energy, your ability level, and the realities of the terrain.",
      "The result is an experience that still feels ambitious, but with the right structure behind it. Logistics, timing, and local support matter just as much as the adrenaline itself.",
    ],
  },
  {
    slug: "cultural-heritage",
    title: "Cultural & Heritage",
    summary: "Richer, slower journeys built around history, local narratives, art, and meaningful access.",
    description:
      "Connect with the soul of a destination through its history, art, and traditions. Our cultural tours offer privileged access to heritage sites and meaningful interactions with local communities.",
    image:
      "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?q=80&w=2070&auto=format&fit=crop",
    visualImages: [
      {
        src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
        alt: "Historic European city view",
        label: "Architectural heritage",
      },
      {
        src: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2066&auto=format&fit=crop",
        alt: "Cultural city atmosphere in Europe",
        label: "Cultural atmosphere",
      },
    ],
    iconKey: "landmark",
    highlights: [
      "Private Museum Access",
      "Local Artisan Workshops",
      "Historical Storytelling",
      "Heritage Accommodations",
    ],
    idealFor: [
      "Travelers who value context and storytelling",
      "Art, history, and architecture lovers",
      "Guests seeking depth over speed",
    ],
    inclusions: [
      "Privately guided visits and historical interpretation",
      "Meaningful access to local makers and communities",
      "Hotels and stays that reflect the destination's identity",
      "Balanced pacing that leaves space to absorb the place",
    ],
    experienceFlow: [
      "Arrival into cities or regions with strong cultural identity",
      "Expert-led exploration of key historical and artistic sites",
      "Slower afternoons for local neighborhoods, craft, and cuisine",
      "Evenings designed around atmosphere and authentic setting",
    ],
    detailedOverview: [
      "These trips are for travelers who want to understand a destination, not just move through it. We focus on context, human connection, and the texture of local life.",
      "Instead of overloaded sightseeing, we create room for conversation, interpretation, and moments that leave a more lasting impression than a standard checklist itinerary.",
    ],
  },
  {
    slug: "wine-culinary-tours",
    title: "Wine & Culinary Tours",
    summary: "Destination-led food and wine journeys that combine flavor, craft, setting, and hospitality.",
    description:
      "Savor the world's finest flavors. We take you behind the scenes of renowned vineyards and into the kitchens of master chefs for an authentic taste of local gastronomy.",
    image:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop",
    visualImages: [
      {
        src: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2066&auto=format&fit=crop",
        alt: "Elegant destination known for cuisine and wine",
        label: "Wine regions and scenery",
      },
      {
        src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
        alt: "European destination with culinary charm",
        label: "Dining atmosphere",
      },
    ],
    iconKey: "utensils",
    highlights: [
      "Private Wine Tastings",
      "Farm-to-Table Experiences",
      "Michelin-Star Dining",
      "Cooking Masterclasses",
    ],
    idealFor: [
      "Food and wine lovers planning a celebratory escape",
      "Couples seeking a romantic itinerary with strong atmosphere",
      "Travelers who want local flavor with premium access",
    ],
    inclusions: [
      "Curated tastings with estates, chefs, and producers",
      "Reservations at high-demand restaurants and experiences",
      "Regional routing built around seasonal flavor and scenery",
      "Optional culinary workshops and kitchen access moments",
    ],
    experienceFlow: [
      "Arrival into a food or wine region selected around your taste",
      "Tasting progression from classic labels to local discoveries",
      "Dining moments that vary between refined, rustic, and insider-led",
      "Scenic pacing that balances indulgence with atmosphere",
    ],
    detailedOverview: [
      "Great culinary travel is not only about prestige. It is also about place, mood, and the story behind what you taste. We design journeys where the food and wine feel rooted in the destination.",
      "That can mean celebrated estates, intimate producers, memorable markets, or private dining moments. The important thing is that every inclusion feels intentional and not generic.",
    ],
  },
  {
    slug: "group-corporate-travel",
    title: "Group & Corporate Travel",
    summary: "High-touch group planning with strong logistics, polished delivery, and room for personalization.",
    description:
      "Elevate your team's experience with flawlessly executed group travel. We handle every detail, from large-scale logistics to personalized team-building activities in inspiring locations.",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop",
    visualImages: [
      {
        src: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
        alt: "Corporate meeting and travel planning environment",
        label: "Leadership and planning",
      },
      {
        src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop",
        alt: "Group journey on the road",
        label: "Shared travel momentum",
      },
    ],
    iconKey: "users",
    highlights: [
      "Incentive Travel Programs",
      "Retreat Coordination",
      "Event Logistics",
      "Team Building Experiences",
    ],
    idealFor: [
      "Companies planning retreats, incentives, or leadership gatherings",
      "Private groups needing a fully coordinated journey",
      "Organizers who want one team managing complexity end to end",
    ],
    inclusions: [
      "Venue sourcing, routing, and scheduling",
      "Guest-facing coordination and operational oversight",
      "Team-building, celebration, or incentive moments",
      "Flexible planning around budget, size, and objectives",
    ],
    experienceFlow: [
      "Discovery around group profile, goals, and destination fit",
      "Operational planning across travel, stays, events, and timing",
      "On-ground delivery designed for clarity and smooth movement",
      "Post-event support for wrap-up, extensions, or follow-on travel",
    ],
    detailedOverview: [
      "Group travel becomes memorable when it feels seamless for the guests and strategically useful for the organizer. We plan with both outcomes in mind.",
      "That means strong logistics, clear communication, and enough customization that the program still feels elevated rather than generic or over-templated.",
    ],
  },
];

export function getExperienceBySlug(slug: string) {
  return EXPERIENCES.find((experience) => experience.slug === slug);
}
