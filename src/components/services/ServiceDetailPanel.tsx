"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import type { Service } from "@/content/site";
import { site } from "@/content/site";
import { scrollToHash } from "@/lib/scrollTo";
import { useEnquiry } from "@/context/EnquiryContext";

interface ServiceDetailPanelProps {
  service: Service;
  progress: number; // 0-1, autoplay progress toward next card
}

export default function ServiceDetailPanel({ service, progress }: ServiceDetailPanelProps) {
  const { requestEnquiry } = useEnquiry();
  const total = site.services.length;

  const handleEnquire = () => {
    requestEnquiry(service.id);
    scrollToHash("#contact");
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-deep-line bg-pounamu/70 backdrop-blur-sm">
      <div className="relative h-56 w-full sm:h-64">
        {site.services.map((s) => (
          <Image
            key={s.id}
            src={s.image}
            alt={s.name}
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className={`object-cover transition-opacity duration-500 ${
              s.id === service.id ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-pounamu via-pounamu/10 to-transparent" />
      </div>

      <div className="h-[2px] w-full bg-deep-line">
        <div
          className="h-full bg-copper transition-[width]"
          style={{ width: `${progress * 100}%`, transitionDuration: "120ms" }}
        />
      </div>

      <div className="p-6 sm:p-8">
        <div className="font-mono-label text-copper-light">
          {service.index} / {String(total).padStart(2, "0")}
        </div>
        <h3 className="mt-3 font-display text-2xl font-semibold text-ivory sm:text-3xl">{service.name}</h3>
        <p className="mt-4 text-base font-light leading-relaxed text-mist">{service.description}</p>

        <ul className="mt-5 space-y-2.5">
          {service.highlights.map((h) => (
            <li key={h} className="flex items-start gap-3 text-sm text-ivory/85">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 rotate-45 items-center justify-center rounded-[4px] bg-copper text-white"><Sparkles className="h-3 w-3 -rotate-45" strokeWidth={1.8} /></span>
              {h}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={handleEnquire}
          className="btn-gradient mt-7 w-full rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide text-pounamu-night focus-ring"
        >
          Enquire about this service
        </button>
      </div>
    </div>
  );
}
