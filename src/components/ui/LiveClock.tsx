"use client";

import { useAucklandTime } from "@/hooks/useAucklandTime";
import { site } from "@/content/site";

export default function LiveClock({ className = "inline-flex" }: { className?: string }) {
  const time = useAucklandTime();

  return (
    <span className={`items-center gap-2 font-mono-label text-mist ${className}`}>
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-copper opacity-75 animate-[pulseDot_2s_ease-in-out_infinite]" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-copper" />
      </span>
      {site.contact.timezoneLabel} {time ?? "--:--"}
    </span>
  );
}
