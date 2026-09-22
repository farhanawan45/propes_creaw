import Image from "next/image";

interface BrandLogoProps {
  size?: "sm" | "md";
  className?: string;
}

export default function BrandLogo({ size = "sm", className = "" }: BrandLogoProps) {
  const medium = size === "md";

  return (
    <span className={`inline-flex shrink-0 items-center justify-center ${className}`}>
      <Image
        src="/images/pnc-client-logo-light-v1.png"
        alt="Props-n-Crew"
        width={medium ? 150 : 110}
        height={medium ? 69 : 51}
        className={medium ? "h-[56px] w-[120px] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,.55)]" : "h-[38px] w-[82px] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,.55)] sm:h-[44px] sm:w-[96px]"}
        unoptimized
      />
    </span>
  );
}
