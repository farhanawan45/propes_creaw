// =============================================================
// PROPS & CREW — SITE CONTENT
// -------------------------------------------------------------
// Every piece of copy, service, project and contact detail on
// the site lives in this single file. Replace the DEMO values
// below with the client's real content — nothing else needs to
// change.
// =============================================================

export type ServiceId =
  | "event-management"
  | "mice"
  | "luxury-coaches-cars"
  | "location-management"
  | "sites-seeing"
  | "indian-food"
  | "adventure-experiences"
  | "private-cruises"
  | "scenic-chopper-rides"
  | "event-technical-support"
  | "decor-fabrications"
  | "gifts-souvenirs"
  | "hindi-english-crew"
  | "local-hindi-entertainment";

export interface Service {
  id: ServiceId;
  index: string; // "01" ... "14"
  name: string; // EXACT client-specified name — never shorten
  image: string;
  description: string;
  highlights: [string, string, string];
}

export interface WorkKeyFact {
  label: string;
  value: string;
}

export interface WorkProject {
  id: string;
  title: string;
  location: string;
  category: string;
  image: string;
  description: string;
  keyFacts: [WorkKeyFact, WorkKeyFact, WorkKeyFact];
}

export interface NavLink {
  label: string;
  href: string;
  index: string;
}

export const site = {
  name: "Props & Crew",
  shortName: "P&C",
  domain: "propsncrew.co.nz",
  url: "https://propsncrew.co.nz",

  meta: {
    title: "Props & Crew | Luxury Events, MICE & Destination Management, New Zealand",
    description:
      "Props & Crew (P&C) is a New Zealand event and destination management company crafting bespoke events, MICE, luxury transport, tours and entertainment for Indian corporate groups, weddings and luxury travellers.",
    keywords: [
      "New Zealand event management",
      "MICE New Zealand",
      "destination management company New Zealand",
      "Indian wedding New Zealand",
      "luxury travel New Zealand",
      "corporate events New Zealand",
      "Props and Crew",
    ],
    ogImage: "/images/og-cover.jpg",
  },

  nav: [
    { label: "Home", href: "#home", index: "01" },
    { label: "About", href: "#about", index: "02" },
    { label: "Work", href: "#work", index: "03" },
    { label: "Contact", href: "#contact", index: "04" },
  ] satisfies NavLink[],

  preloader: {
    durationSeconds: 0.75,
  },

  hero: {
    label: "NEW ZEALAND · EVENTS · MICE",
    headline: [
      { text: "Unforgettable", emphasis: true },
      { text: " experiences." },
    ],
    lead: "Luxury events, MICE and journeys across New Zealand, thoughtfully crafted from first idea to final farewell.",
    ctaPrimary: { label: "Explore Services", href: "#services" },
    ctaSecondary: { label: "Get a Quote", href: "#contact" },
    video: {
      mp4: [
        "/videos/client-intro.mp4",
      ],
      showreelMp4: "https://videos.pexels.com/video-files/7791920/7791920-hd_1920_1080_25fps.mp4",
      poster: "/images/hero-event-poster.jpg",
    },
    kenBurnsFallback: [
      "/images/kenburns-1.jpg",
      "/images/kenburns-2.jpg",
      "/images/kenburns-3.jpg",
      "/images/kenburns-4.jpg",
    ],
  },

  about: {
    label: "01 WHO WE ARE",
    title: "About Props & Crew",
    statement:
      "We create and deliver exceptional events, corporate programmes and journeys across New Zealand, combining local expertise with a crew that understands your culture, expectations and every detail.",
    images: [
      "/images/service-event-management.jpg",
      "/images/service-decor-fabrications.jpg",
      "/images/about-corporate-group.jpg",
    ],
    stats: [
      { value: 500, suffix: "+", label: "Events Delivered" },
      { value: 10, suffix: "+", label: "Years Experience" },
      { value: 14, suffix: "", label: "Specialist Services" },
      { value: 100, suffix: "%", label: "New Zealand Coverage" },
    ],
    values: [
      {
        title: "Trustworthy",
        text: "Transparent planning and honest guidance, every step of the way.",
        icon: "ShieldCheck",
      },
      {
        title: "Reliable",
        text: "On-ground teams and contingency plans so nothing is left to chance.",
        icon: "Compass",
      },
      {
        title: "Personal",
        text: "Every itinerary is shaped around your culture, pace and taste.",
        icon: "HeartHandshake",
      },
      {
        title: "Professional",
        text: "A decade of destination expertise, delivered with quiet precision.",
        icon: "Award",
      },
    ],
  },

  services: [
    {
      id: "event-management",
      index: "01",
      name: "Event Management",
      image: "/images/service-event-management.webp",
      description:
        "End-to-end planning and on-ground execution for weddings, corporate events and celebrations across New Zealand.",
      highlights: ["Full-cycle planning", "On-site delivery team", "Vendor & budget management"],
    },
    {
      id: "mice",
      index: "02",
      name: "MICE",
      image: "/images/service-mice.webp",
      description:
        "Meetings, incentives, conferences and exhibitions, flawlessly produced for Indian corporate groups.",
      highlights: ["Conference production", "Incentive travel design", "Delegate management"],
    },
    {
      id: "luxury-coaches-cars",
      index: "03",
      name: "Luxury Coaches & Cars",
      image: "/images/service-luxury-coaches-cars.webp",
      description:
        "Premium chauffeured coaches and cars for groups of every size, all across the North and South Islands.",
      highlights: ["Chauffeured fleet", "North & South Island routes", "Group & private transfers"],
    },
    {
      id: "location-management",
      index: "04",
      name: "Location Management",
      image: "/images/service-location-management.webp",
      description:
        "Scouting and securing New Zealand's most breathtaking venues and filming-worthy locations.",
      highlights: ["Venue scouting", "Permits & logistics", "Iconic NZ locations"],
    },
    {
      id: "sites-seeing",
      index: "05",
      name: "Sites Seeing",
      image: "/images/service-sites-seeing.webp",
      description:
        "Curated sightseeing itineraries that showcase the very best of Aotearoa's landscapes and culture.",
      highlights: ["Curated itineraries", "Expert local guides", "Iconic landmarks"],
    },
    {
      id: "indian-food",
      index: "06",
      name: "Indian Food",
      image: "/images/service-indian-food.webp",
      description:
        "Authentic Indian catering and menus, tailored for weddings, corporate dinners and private events.",
      highlights: ["Authentic regional menus", "Dietary customisation", "Live counters"],
    },
    {
      id: "adventure-experiences",
      index: "07",
      name: "Adventure Experiences",
      image: "/images/service-adventure-experiences.webp",
      description:
        "Thrilling, safely managed adventure activities across New Zealand's iconic outdoors.",
      highlights: ["Safety-certified operators", "Group & private options", "All fitness levels"],
    },
    {
      id: "private-cruises",
      index: "08",
      name: "Private Cruises",
      image: "/images/service-private-cruises.webp",
      description:
        "Exclusive harbour and lake cruises, private-chartered for celebrations and intimate gatherings.",
      highlights: ["Private charters", "Harbour & lake routes", "Catering on board"],
    },
    {
      id: "scenic-chopper-rides",
      index: "09",
      name: "Scenic Chopper Rides",
      image: "/images/service-scenic-chopper-rides.webp",
      description:
        "Helicopter tours over glaciers, fiords and vineyards for an unforgettable aerial perspective.",
      highlights: ["Glacier & fiord routes", "Licensed pilots", "Private proposals & photo flights"],
    },
    {
      id: "event-technical-support",
      index: "10",
      name: "Event Technical Support",
      image: "/images/service-event-technical-support.webp",
      description:
        "Sound, lighting, staging and AV production delivered by experienced technical crews.",
      highlights: ["Sound & lighting rigs", "Staging & AV", "Experienced crew"],
    },
    {
      id: "decor-fabrications",
      index: "11",
      name: "Decor & Fabrications",
      image: "/images/service-decor-fabrications.webp",
      description:
        "Bespoke decor, sets and fabrication that bring your theme and vision to life.",
      highlights: ["Custom set builds", "Floral & theming", "Concept to install"],
    },
    {
      id: "gifts-souvenirs",
      index: "12",
      name: "Gifts & Souvenirs",
      image: "/images/service-gifts-souvenirs.webp",
      description:
        "Thoughtfully curated New Zealand gifts and souvenirs for guests and delegates.",
      highlights: ["Curated NZ gifting", "Bulk delegate packs", "Custom branding"],
    },
    {
      id: "hindi-english-crew",
      index: "13",
      name: "Hindi/English Speaking Crew",
      image: "/images/service-hindi-english-crew.webp",
      description:
        "A dedicated on-ground crew fluent in Hindi and English, present throughout your journey.",
      highlights: ["Bilingual guides", "24/7 on-ground support", "Cultural familiarity"],
    },
    {
      id: "local-hindi-entertainment",
      index: "14",
      name: "Local/Hindi Entertainment",
      image: "/images/service-local-hindi-entertainment.webp",
      description:
        "Live music, dance and performers spanning local New Zealand talent and Hindi entertainment.",
      highlights: ["Live music & dance", "Local & Hindi performers", "Full stage production"],
    },
  ] satisfies Service[],

  work: {
    label: "03 SELECTED EVENTS",
    title: "Our Work",
    intro:
      "From destination weddings and leadership summits to incentive journeys and private celebrations, explore a selection of experiences brought to life across New Zealand through thoughtful planning, creative production and seamless on-ground delivery.",
    projects: [
      {
        id: "queenstown-wedding",
        title: "A Destination Wedding in the Mountains",
        location: "Queenstown",
        category: "Wedding",
        image: "/images/work-queenstown-wedding.webp",
        description: "A lakeside ceremony and reception staged against the Remarkables for 140 guests.",
        keyFacts: [
          { label: "Guests", value: "140" },
          { label: "Duration", value: "3 Days" },
          { label: "Location", value: "Queenstown" },
        ],
      },
      {
        id: "auckland-mice",
        title: "Corporate Summit for 300 Delegates",
        location: "Auckland",
        category: "MICE",
        image: "/images/work-auckland-mice.webp",
        description: "Three-day conference production, from keynote AV to delegate travel logistics.",
        keyFacts: [
          { label: "Delegates", value: "300" },
          { label: "Duration", value: "3 Days" },
          { label: "Location", value: "Auckland" },
        ],
      },
      {
        id: "rotorua-incentive",
        title: "Incentive Retreat in Geothermal Country",
        location: "Rotorua",
        category: "Incentive Travel",
        image: "/images/work-rotorua-incentive.webp",
        description: "A five-day reward trip blending geothermal spas, culture and team experiences.",
        keyFacts: [
          { label: "Guests", value: "60" },
          { label: "Duration", value: "5 Days" },
          { label: "Location", value: "Rotorua" },
        ],
      },
      {
        id: "bayofislands-cruise",
        title: "Private Charter Celebration",
        location: "Bay of Islands",
        category: "Private Cruise",
        image: "/images/work-bay-of-islands-cruise.webp",
        description: "A sunset charter and celebration dinner across the islands for 40 guests.",
        keyFacts: [
          { label: "Guests", value: "40" },
          { label: "Duration", value: "1 Evening" },
          { label: "Location", value: "Bay of Islands" },
        ],
      },
      {
        id: "wanaka-heli",
        title: "Scenic Helicopter Proposal",
        location: "Wanaka",
        category: "Bespoke Experience",
        image: "/images/work-wanaka-heli.webp",
        description: "An alpine helicopter landing staged for a private proposal above Lake Wanaka.",
        keyFacts: [
          { label: "Guests", value: "2" },
          { label: "Duration", value: "1 Day" },
          { label: "Location", value: "Wanaka" },
        ],
      },
      {
        id: "wellington-gala",
        title: "Gala Dinner & Live Entertainment",
        location: "Wellington",
        category: "Corporate Gala",
        image: "/images/work-wellington-gala.webp",
        description: "A black-tie gala for 220 guests with full staging, catering and live entertainment.",
        keyFacts: [
          { label: "Guests", value: "220" },
          { label: "Duration", value: "1 Evening" },
          { label: "Location", value: "Wellington" },
        ],
      },
    ] satisfies WorkProject[],
  },

  contact: {
    label: "04 GET IN TOUCH",
    title: "Let's create something extraordinary",
    sub: "Tell us about your event or journey and share your dates, group size and vision. Our New Zealand-based team will review every detail and respond within one business day with the right next steps.",
    phone: "+64 9 123 4567",
    phoneHref: "tel:+6491234567",
    whatsapp: "+64 21 123 4567",
    whatsappHref: "https://wa.me/6421123456",
    email: "hello@propsncrew.co.nz",
    address: "Level 4, 123 Queen Street, Auckland CBD, Auckland 1010, New Zealand",
    timezone: "Pacific/Auckland",
    timezoneLabel: "AKL",
  },

  social: [
    { label: "Instagram", href: "https://instagram.com/propsncrew" },
    { label: "Facebook", href: "https://facebook.com/propsncrew" },
    { label: "LinkedIn", href: "https://linkedin.com/company/propsncrew" },
  ],

  footer: {
    brandLine:
      "New Zealand event and destination management. Events, MICE, luxury travel and entertainment, crafted end to end.",
  },
} as const;
