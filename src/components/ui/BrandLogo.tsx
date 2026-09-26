import Image from "next/image";

interface BrandLogoProps {
  size?: "sm" | "md";
  className?: string;
}

export default function BrandLogo({ size = "sm", className = "" }: BrandLogoProps) {
  const medium = size === "md";

  return (
    <span className={`inline-flex shrink-0 items-center gap-2.5 rounded-[9px] bg-white px-3 py-2 shadow-[0_8px_24px_rgba(4,22,63,.16)] ${medium ? "sm:gap-3 sm:px-4 sm:py-2.5" : ""} ${className}`}>
      <span className={`relative block shrink-0 overflow-hidden ${medium ? "h-[27px] w-[88px]" : "h-[22px] w-[72px]"}`}>
        <Image
          src="/images/pnc-client-logo-original-transparent-v1.png"
          alt=""
          width={780}
          height={371}
          className="absolute left-0 top-0 h-auto w-full max-w-none"
          unoptimized
        />
      </span>
      <span className={`whitespace-nowrap font-display font-semibold leading-none tracking-[-0.03em] text-pounamu-night ${medium ? "text-lg sm:text-xl" : "text-sm sm:text-base"}`}>
        Props N Crew
      </span>
    </span>
  );
}
