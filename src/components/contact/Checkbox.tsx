"use client";

import { Check } from "lucide-react";
import type { ReactNode } from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}

export default function Checkbox({ checked, onChange, children }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <span
          className={`pointer-events-none absolute inset-0 rounded-[6px] border transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-copper ${
            checked ? "border-copper bg-copper" : "border-deep-line"
          }`}
        />
        {checked && <Check className="relative h-3.5 w-3.5 text-pounamu-night" strokeWidth={3} />}
      </span>
      <span className="text-sm text-mist">{children}</span>
    </label>
  );
}
