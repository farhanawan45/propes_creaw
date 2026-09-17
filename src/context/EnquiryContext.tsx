"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { ServiceId } from "@/content/site";

interface EnquiryContextValue {
  pendingService: ServiceId | null;
  requestEnquiry: (id: ServiceId) => void;
  clearPendingService: () => void;
}

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [pendingService, setPendingService] = useState<ServiceId | null>(null);

  const requestEnquiry = useCallback((id: ServiceId) => {
    setPendingService(id);
  }, []);

  const clearPendingService = useCallback(() => setPendingService(null), []);

  return (
    <EnquiryContext.Provider value={{ pendingService, requestEnquiry, clearPendingService }}>
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error("useEnquiry must be used within EnquiryProvider");
  return ctx;
}
