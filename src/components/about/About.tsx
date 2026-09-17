"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/content/site";
import StatsStrip from "@/components/about/StatsStrip";
import ValuesRow from "@/components/about/ValuesRow";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const imageAref = useRef<HTMLDivElement>(null);
  const imageBref = useRef<HTMLDivElement>(null);
  const imageCref = useRef<HTMLDivElement>(null);
  const parallaxA = useRef<HTMLDivElement>(null);
  const parallaxB = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const words = statementRef.current?.querySelectorAll("[data-word]");

      if (prefersReducedMotion()) {
        gsap.set(words ?? [], { opacity: 1 });
        gsap.set([imageAref.current, imageBref.current, imageCref.current], {
          clipPath: "inset(0% 0% 0% 0%)",
        });
        return;
      }

      if (words?.length) {
        gsap.set(words, { opacity: 0.5 });
        gsap.to(words, {
          opacity: 1,
          stagger: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: statementRef.current,
            start: "top 80%",
            end: "bottom 55%",
            scrub: true,
          },
        });
      }

      [imageAref, imageBref, imageCref].forEach((ref, i) => {
        gsap.fromTo(
          ref.current,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            delay: i * 0.12,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 88%",
            },
          }
        );
      });

      gsap.to(parallaxA.current, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(parallaxB.current, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach((t) => {
          const trigger = t.trigger as Element | null;
          if (
            trigger === statementRef.current ||
            trigger === imageAref.current ||
            trigger === imageBref.current ||
            trigger === imageCref.current ||
            trigger === sectionRef.current
          ) {
            t.kill();
          }
        });
      };
    },
    { scope: sectionRef }
  );

  const words = site.about.statement.split(" ");

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-pad relative overflow-hidden bg-ivory text-ink"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <div className="font-mono-label text-stone">{site.about.label}</div>
            <p
              ref={statementRef}
              className="mt-6 font-display font-medium tracking-tight text-ink"
              style={{ fontSize: "clamp(28px, 3.6vw, 52px)", lineHeight: 1.15, letterSpacing: "-0.02em" }}
            >
              {words.map((word, i) => (
                <span key={i} data-word className="mr-[0.28em] inline-block">
                  {word}
                </span>
              ))}
            </p>
          </div>

          <div className="relative lg:col-span-5">
            <div className="grid grid-cols-5 gap-4">
              <div
                ref={imageAref}
                className="relative col-span-3 aspect-[3/4] overflow-hidden rounded-3xl"
              >
                <div ref={parallaxA} className="absolute inset-0 -top-[8%] h-[116%] w-full">
                  <Image
                    src={site.about.images[0]}
                    alt="Milford Sound, New Zealand"
                    fill
                    sizes="(min-width: 1024px) 30vw, 60vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div
                ref={imageBref}
                className="relative col-span-2 mt-10 aspect-[3/4] overflow-hidden rounded-3xl"
              >
                <div ref={parallaxB} className="absolute inset-0 -top-[8%] h-[116%] w-full">
                  <Image
                    src={site.about.images[1]}
                    alt="Queenstown and Lake Wakatipu, New Zealand"
                    fill
                    sizes="(min-width: 1024px) 20vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <div
              ref={imageCref}
              className="relative mt-4 aspect-[16/9] overflow-hidden rounded-3xl"
            >
              <Image
                src={site.about.images[2]}
                alt="Corporate group in New Zealand"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-16 sm:mt-20 lg:mt-24">
          <StatsStrip />
        </div>

        <div className="mt-10 sm:mt-12 lg:mt-14">
          <ValuesRow />
        </div>
      </div>
    </section>
  );
}
