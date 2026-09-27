import Image from "next/image";

interface BrandLogoProps {
  size?: "sm" | "md";
  className?: string;
}

export default function BrandLogo({ size = "sm", className = "" }: BrandLogoProps) {
  const medium = size === "md";

  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-[9px] bg-white px-2.5 py-1.5 shadow-[0_8px_24px_rgba(4,22,63,.16)] ${medium ? "px-3 py-2" : ""} ${className}`}>
      <Image
        src="/images/pnc-client-logo-v2.png"
        alt="Props-n-Crew"
        width={780}
        height={371}
        className={medium ? "h-[52px] w-[110px] object-contain" : "h-[36px] w-[76px] object-contain sm:h-[42px] sm:w-[88px]"}
        unoptimized
      />
    </span>
  );
}
