import { EnquiryProvider } from "@/context/EnquiryContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import ServicesSection from "@/components/services/ServicesSection";
import WorkSection from "@/components/work/WorkSection";
import ContactSection from "@/components/contact/ContactSection";
import JsonLd from "@/components/seo/JsonLd";

export default function Home() {
  return (
    <EnquiryProvider>
      <JsonLd />
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <About />
          <ServicesSection />
          <WorkSection />
          <ContactSection />
        </main>
      </div>
      <Footer />
    </EnquiryProvider>
  );
}
