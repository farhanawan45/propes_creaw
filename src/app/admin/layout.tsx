import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin | Props N Crew", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-[#f3f6fb] text-[#061a4a]">{children}</div>;
}

