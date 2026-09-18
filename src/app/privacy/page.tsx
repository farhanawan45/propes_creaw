import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects enquiry information.`,
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-ivory px-5 py-8 text-ink sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between border-b border-linen-border pb-6">
          <Link href="/" className="rounded-full bg-pounamu-night px-4 py-3"><BrandLogo /></Link>
          <Link href="/#contact" className="btn-gradient rounded-full px-5 py-3 text-sm font-semibold text-ivory">Contact us</Link>
        </div>
        <article className="py-14 sm:py-20">
          <div className="font-mono-label text-copper">Legal / Privacy</div>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-7xl">Privacy Policy</h1>
          <p className="mt-5 text-stone">Last updated: 18 September 2026</p>
          <div className="mt-12 space-y-10 text-base leading-8 text-stone">
            <section><h2 className="font-display text-2xl font-semibold text-ink">Information we collect</h2><p className="mt-3">When you submit an enquiry, we may collect your name, email address, phone number, event date, group size, selected services and the message you provide.</p></section>
            <section><h2 className="font-display text-2xl font-semibold text-ink">How we use it</h2><p className="mt-3">We use this information to respond to your enquiry, prepare proposals, plan requested services and maintain appropriate business records. We do not sell your personal information.</p></section>
            <section><h2 className="font-display text-2xl font-semibold text-ink">Storage and security</h2><p className="mt-3">Reasonable technical and organisational safeguards are used to protect submitted information. Information is retained only for as long as needed for the purpose it was collected or as required by law.</p></section>
            <section><h2 className="font-display text-2xl font-semibold text-ink">Service providers</h2><p className="mt-3">We may use trusted hosting, email, analytics and website service providers. They may process limited information only to provide those services to us.</p></section>
            <section><h2 className="font-display text-2xl font-semibold text-ink">Your choices</h2><p className="mt-3">You may request access to, correction of, or deletion of personal information we hold about you, subject to applicable New Zealand law.</p></section>
            <section><h2 className="font-display text-2xl font-semibold text-ink">Contact</h2><p className="mt-3">For privacy questions, contact <a className="text-copper underline" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.</p></section>
          </div>
        </article>
      </div>
    </main>
  );
}
