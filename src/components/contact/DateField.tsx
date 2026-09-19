"use client";

import * as Popover from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { CalendarDays } from "lucide-react";
import { useState } from "react";
import FieldLabel from "@/components/contact/FieldLabel";

function formatDate(d: Date) {
  return d.toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" });
}

interface DateFieldProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  error?: string;
}

export default function DateField({ value, onChange, error }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div>
      <FieldLabel htmlFor="eventDate" required>
        Event / Travel Date
      </FieldLabel>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            id="eventDate"
            className={`flex h-12 w-full items-center justify-between rounded-[14px] border bg-[rgba(245,241,232,0.04)] px-4 text-left text-base outline-none transition-colors focus:ring-[3px] ${
              value ? "text-ivory" : "text-mist/60"
            } ${
              error
                ? "border-[#E5484D] focus:border-[#E5484D] focus:ring-[#E5484D]/20"
                : "border-deep-line focus:border-copper focus:ring-copper/25"
            }`}
          >
            <span>{value ? formatDate(value) : "Select a date"}</span>
            <CalendarDays className="h-[18px] w-[18px] shrink-0 text-copper" strokeWidth={1.5} />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={8}
            className="pc-datepicker-popover z-50 rounded-2xl border border-deep-line bg-pounamu p-4 shadow-2xl"
          >
            <DayPicker
              mode="single"
              selected={value}
              onSelect={(date) => {
                onChange(date);
                setOpen(false);
              }}
              disabled={{ before: today }}
              defaultMonth={value ?? today}
              className="pc-daypicker"
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {error && <p className="mt-1.5 text-[13px] text-[#E5484D]">{error}</p>}
    </div>
  );
}
