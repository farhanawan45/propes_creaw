import Image from "next/image";

interface BrandLogoProps {
  size?: "sm" | "md";
  className?: string;
}

export default function BrandLogo({ size = "sm", className = "" }: BrandLogoProps) {
  const medium = size === "md";

  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-[10px] border border-white/20 bg-[#fffdf8] shadow-[0_8px_28px_rgba(3,15,13,0.2)] ${medium ? "px-3 py-2" : "px-2.5 py-1.5"} ${className}`}>
      <Image
        src="/images/pnc-client-logo.svg"
        alt="Props-n-Crew"
        width={medium ? 150 : 110}
        height={medium ? 69 : 51}
        className={medium ? "h-[56px] w-[120px] object-contain" : "h-[38px] w-[82px] object-contain sm:h-[44px] sm:w-[96px]"}
        unoptimized
      />
    </span>
  );
}
