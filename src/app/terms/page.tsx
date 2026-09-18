import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Terms of Service", description: `Website terms for ${site.name}.` };

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-ivory px-5 py-8 text-ink sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between border-b border-linen-border pb-6">
          <Link href="/" className="rounded-full bg-pounamu-night px-4 py-3"><BrandLogo /></Link>
          <Link href="/#contact" className="btn-gradient rounded-full px-5 py-3 text-sm font-semibold text-ivory">Request a quote</Link>
        </div>
        <article className="py-14 sm:py-20">
          <div className="font-mono-label text-copper">Legal / Terms</div>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-7xl">Terms of Service</h1>
          <p className="mt-5 text-stone">Last updated: 18 September 2026</p>
          <div className="mt-12 space-y-10 text-base leading-8 text-stone">
            <section><h2 className="font-display text-2xl font-semibold text-ink">Website information</h2><p className="mt-3">This website provides general information about Props &amp; Crew and its event, destination management and travel-related services. Website content is not a binding quotation.</p></section>
            <section><h2 className="font-display text-2xl font-semibold text-ink">Enquiries and bookings</h2><p className="mt-3">Submitting an enquiry does not create a booking. Services, pricing, availability, payment terms and cancellation conditions will be confirmed in a separate written proposal or agreement.</p></section>
            <section><h2 className="font-display text-2xl font-semibold text-ink">Third-party services</h2><p className="mt-3">Experiences may involve independent venues, transport operators, caterers and activity providers. Their availability and applicable conditions will be identified during planning.</p></section>
            <section><h2 className="font-display text-2xl font-semibold text-ink">Intellectual property</h2><p className="mt-3">Unless otherwise stated, website design, copy and brand materials may not be reproduced commercially without permission. Third-party media remains subject to its applicable licence.</p></section>
            <section><h2 className="font-display text-2xl font-semibold text-ink">Liability</h2><p className="mt-3">To the extent permitted by law, Props &amp; Crew is not responsible for losses caused by reliance on incomplete website information or by external websites linked from this site.</p></section>
            <section><h2 className="font-display text-2xl font-semibold text-ink">Contact</h2><p className="mt-3">Questions can be sent to <a className="text-copper underline" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.</p></section>
          </div>
        </article>
      </div>
    </main>
  );
}
