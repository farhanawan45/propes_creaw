"use client";

import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import FieldLabel from "@/components/contact/FieldLabel";

const baseInput =
  "w-full rounded-[14px] border bg-[rgba(245,241,232,0.04)] text-base text-ivory placeholder:text-mist/60 outline-none transition-colors focus:ring-[3px]";
const okBorder = "border-deep-line focus:border-copper focus:ring-copper/25";
const errBorder = "border-[#E5484D] focus:border-[#E5484D] focus:ring-[#E5484D]/20";

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
}

export function TextField({ label, name, required, error, className = "", ...rest }: TextFieldProps) {
  return (
    <div>
      <FieldLabel htmlFor={name} required={required}>
        {label}
      </FieldLabel>
      <input
        id={name}
        name={name}
        className={`h-12 px-4 ${baseInput} ${error ? errBorder : okBorder} ${className}`}
        {...rest}
      />
      {error && <p className="mt-1.5 text-[13px] text-[#E5484D]">{error}</p>}
    </div>
  );
}

interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
}

export function TextAreaField({ label, name, required, error, className = "", ...rest }: TextAreaFieldProps) {
  return (
    <div>
      <FieldLabel htmlFor={name} required={required}>
        {label}
      </FieldLabel>
      <textarea
        id={name}
        name={name}
        rows={4}
        className={`min-h-[104px] resize-y px-4 py-3 ${baseInput} ${error ? errBorder : okBorder} ${className}`}
        {...rest}
      />
      {error && <p className="mt-1.5 text-[13px] text-[#E5484D]">{error}</p>}
    </div>
  );
}
