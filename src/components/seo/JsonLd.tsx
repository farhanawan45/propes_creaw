import { site } from "@/content/site";

export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    logo: `${site.url}/brand/logo.svg`,
    image: `${site.url}${site.meta.ogImage}`,
    description: site.meta.description,
    telephone: site.contact.phone,
    email: site.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Queen Street",
      addressLocality: "Auckland",
      addressCountry: "NZ",
    },
    areaServed: {
      "@type": "Country",
      name: "New Zealand",
    },
    sameAs: site.social.map((s) => s.href),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
