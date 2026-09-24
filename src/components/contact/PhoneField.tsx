"use client";

import { ChevronDown } from "lucide-react";
import FieldLabel from "@/components/contact/FieldLabel";

export const countryCodes = [
  { code: "+64", flag: "🇳🇿", label: "New Zealand" },
  { code: "+91", flag: "🇮🇳", label: "India" },
  { code: "+61", flag: "🇦🇺", label: "Australia" },
  { code: "+1", flag: "🇺🇸", label: "United States" },
  { code: "+44", flag: "🇬🇧", label: "United Kingdom" },
];

interface PhoneFieldProps {
  countryCode: string;
  phoneNumber: string;
  onCountryChange: (code: string) => void;
  onNumberChange: (value: string) => void;
  error?: string;
}

export default function PhoneField({ countryCode, phoneNumber, onCountryChange, onNumberChange, error }: PhoneFieldProps) {
  return (
    <div>
      <FieldLabel htmlFor="phoneNumber" required>
        Phone
      </FieldLabel>
      <div
        className={`flex h-12 items-stretch rounded-[14px] border bg-white transition-colors focus-within:ring-[3px] ${
          error
            ? "border-[#E5484D] focus-within:border-[#E5484D] focus-within:ring-[#E5484D]/20"
            : "border-pounamu-night/15 focus-within:border-copper focus-within:ring-copper/25"
        }`}
      >
        <div className="relative flex shrink-0 items-center pl-[16px] pr-7">
          <select
            value={countryCode}
            onChange={(e) => onCountryChange(e.target.value)}
            aria-label="Country code"
            className="appearance-none bg-transparent text-base text-pounamu-night outline-none"
          >
            {countryCodes.map((c) => (
              <option key={c.code} value={c.code} className="bg-white text-pounamu-night">
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-1.5 h-3.5 w-3.5 text-stone" strokeWidth={2} />
        </div>
        <div className="my-2.5 w-px shrink-0 bg-pounamu-night/15" />
        <input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={(e) => onNumberChange(e.target.value)}
          placeholder="21 234 5678"
          className="min-w-0 flex-1 bg-transparent px-[18px] text-base text-pounamu-night placeholder:text-stone/70 outline-none"
        />
      </div>
      {error && <p className="mt-1.5 text-[13px] text-[#E5484D]">{error}</p>}
    </div>
  );
}
