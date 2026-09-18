import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import BrandLogo from "@/components/ui/BrandLogo";
import { site } from "@/content/site";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return site.work.projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = site.work.projects.find((item) => item.id === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/work/${project.id}` },
    openGraph: { title: project.title, description: project.description, images: [project.image], type: "article" },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const index = site.work.projects.findIndex((item) => item.id === slug);
  if (index === -1) notFound();
  const project = site.work.projects[index];
  const nextProject = site.work.projects[(index + 1) % site.work.projects.length];

  return (
    <main className="min-h-screen bg-pounamu-night text-ivory">
      <header className="absolute inset-x-0 top-0 z-20 px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
          <Link href="/" aria-label="Props & Crew home"><BrandLogo /></Link>
          <Link href="/#work" className="flex items-center gap-2 rounded-full border border-ivory/20 bg-pounamu-night/45 px-4 py-2.5 text-sm backdrop-blur-xl transition-colors hover:border-copper"><ArrowLeft className="h-4 w-4" /> All work</Link>
        </div>
      </header>

      <section className="relative flex min-h-[82svh] items-end overflow-hidden px-5 pb-12 pt-32 sm:px-8 lg:px-12 lg:pb-20">
        <Image
          src={project.image}
          alt={`${project.title} in ${project.location}`}
          fill
          priority
          quality={72}
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover bg-pounamu-night"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pounamu-night via-pounamu-night/35 to-black/15" />
        <div className="relative mx-auto w-full max-w-[1440px]">
          <div className="font-mono-label text-copper-light">{project.category} / {String(index + 1).padStart(2, "0")}</div>
          <h1 className="mt-5 max-w-5xl font-display text-[clamp(48px,8vw,118px)] font-semibold leading-[.92] tracking-[-.045em]">{project.title}</h1>
          <div className="mt-6 flex items-center gap-2 text-ivory/80"><MapPin className="h-5 w-5 text-copper" /><span>{project.location}, New Zealand</span></div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div><div className="font-mono-label text-copper">Case overview</div><h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">An experience designed end to end.</h2></div>
          <div>
            <p className="text-xl font-light leading-relaxed text-mist sm:text-2xl">{project.description}</p>
            <div className="mt-10 grid grid-cols-3 border-y border-deep-line py-7">
              {project.keyFacts.map((fact) => <div key={fact.label}><div className="text-lg font-semibold sm:text-2xl">{fact.value}</div><div className="mt-2 font-mono-label text-[8px] text-mist">{fact.label}</div></div>)}
            </div>
            <p className="mt-8 text-sm leading-7 text-mist/75">Full project photography, scope and verified results will be added when supplied by the client.</p>
          </div>
        </div>
      </section>

      <section className="border-t border-deep-line px-5 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div><div className="font-mono-label text-copper">Next project</div><div className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{nextProject.title}</div></div>
          <Link href={`/work/${nextProject.id}`} prefetch className="btn-gradient flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-ivory">Explore case study <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </main>
  );
}
