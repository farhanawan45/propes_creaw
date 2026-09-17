"use client";

import type { ReactNode } from "react";

export default function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-ivory">
      {children}
      {required && <span className="text-copper"> *</span>}
    </label>
  );
}
