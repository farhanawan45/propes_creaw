import Image from "next/image";

const moments = [
  { src: "/images/showcase/wedding-celebration.webp", label: "Wedding Celebrations", title: "A real wedding celebration" },
  { src: "/images/showcase/corporate-networking.webp", label: "Corporate Events", title: "Guests networking at a corporate event" },
  { src: "/images/showcase/conference-audience.webp", label: "Conferences", title: "A live conference audience" },
  { src: "/images/showcase/concert-crowd.webp", label: "Live Entertainment", title: "A crowd enjoying a live concert" },
  { src: "/images/showcase/event-decor.webp", label: "Event Styling", title: "A styled event table" },
  { src: "/images/showcase/event-venue.webp", label: "Venue Transformations", title: "A decorated event venue" },
  { src: "/images/showcase/conference-production.webp", label: "Technical Production", title: "Conference production in action" },
  { src: "/images/showcase/helicopter-adventure.webp", label: "Helicopter Experiences", title: "A helicopter mountain experience" },
  { src: "/images/showcase/luxury-yacht.webp", label: "Private Cruises", title: "A private luxury yacht cruise" },
  { src: "/images/showcase/live-entertainment.webp", label: "Indian Entertainment Options", title: "A professionally produced live show" },
  { src: "/images/showcase/destination-event.webp", label: "Destination Events", title: "A destination wedding reception" },
  { src: "/images/showcase/private-cruise.webp", label: "Scenic Experiences", title: "A scenic alpine experience" },
  { src: "/images/showcase/wedding-table.webp", label: "Hospitality & Dining", title: "Outdoor event dining" },
  { src: "/images/showcase/technical-production.webp", label: "Adventure Experiences", title: "A guided mountain adventure" },
] as const;

// Mix bright, dark, people-led and scenic frames across both tracks so each
// row has an intentional editorial rhythm rather than a single colour mood.
const rows = [
  [moments[0], moments[2], moments[8], moments[5], moments[3], moments[10], moments[12]],
  [moments[7], moments[1], moments[9], moments[4], moments[11], moments[6], moments[13]],
] as const;

function MomentCard({ moment }: { moment: (typeof moments)[number] }) {
  return (
    <article className="event-moment-card group relative aspect-square w-[60vw] max-w-[220px] shrink-0 overflow-hidden rounded-[14px] border-2 border-pounamu-night/20 bg-white sm:w-[340px] sm:max-w-none sm:rounded-[18px] lg:w-[410px]">
      <Image src={moment.src} alt={moment.title} fill sizes="(max-width: 639px) 220px, (max-width: 1023px) 340px, 410px" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]" unoptimized />
      <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-full border border-pounamu-night/10 bg-white/95 px-3 py-2 text-pounamu-night shadow-[0_5px_16px_rgba(4,22,63,.14)] backdrop-blur-sm sm:left-4 sm:top-4 sm:max-w-[calc(100%-2rem)]">
        <span className="h-2 w-2 shrink-0 rounded-full bg-copper" />
        <span className="truncate text-xs font-semibold leading-none sm:text-sm">{moment.label}</span>
      </div>
    </article>
  );
}

export default function EventPossibilities() {
  return (
    <section className="overflow-hidden bg-ivory pb-10 pt-20 sm:pb-12 sm:pt-24 lg:pb-14 lg:pt-28" aria-labelledby="possibilities-title">
      <div className="mx-auto mb-12 max-w-[1440px] px-4 text-center sm:px-8 lg:mb-14 lg:px-10 xl:px-12">
        <div className="font-mono-label text-copper">REAL MOMENTS · LIMITLESS POSSIBILITIES</div>
        <h2 id="possibilities-title" className="mx-auto mt-4 max-w-5xl font-display font-semibold leading-[.94] tracking-[-0.045em] text-pounamu-night" style={{ fontSize: "clamp(44px, 6vw, 88px)" }}>
          See what we can <span className="text-copper">bring to life.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-ink/65 sm:text-base">
          From intimate celebrations to destination-scale productions, every experience is designed around your people, purpose and place.
        </p>
      </div>

      <div className="event-marquee relative space-y-3 sm:space-y-7">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-5 bg-gradient-to-r from-ivory/80 to-transparent sm:w-12" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-5 bg-gradient-to-l from-ivory/80 to-transparent sm:w-12" />
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="overflow-hidden">
            <div className={`event-marquee-track flex w-max gap-3 sm:gap-7 ${rowIndex === 1 ? "event-marquee-reverse" : ""}`}>
              {[0, 1, 2].map((copy) => (
                <div key={copy} className="flex gap-3 sm:gap-7" aria-hidden={copy > 0}>
                  {row.map((moment) => <MomentCard key={`${copy}-${moment.src}`} moment={moment} />)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-8 flex max-w-[1440px] items-center justify-center px-4 font-mono-label text-[8px] text-pounamu-night/55 sm:mt-10 sm:gap-3 sm:px-8 sm:text-[9px]">
        <span className="hidden h-px w-12 bg-copper/45 sm:block" />
        <span className="whitespace-nowrap text-center">Hover to pause · Crafted across New Zealand</span>
        <span className="hidden h-px w-12 bg-copper/45 sm:block" />
      </div>
    </section>
  );
}
