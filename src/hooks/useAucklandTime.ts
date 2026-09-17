"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

const formatter = new Intl.DateTimeFormat("en-NZ", {
  timeZone: site.contact.timezone,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function useAucklandTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(formatter.format(new Date()));
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return time;
}
