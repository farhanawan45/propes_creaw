import Image from "next/image";

interface BrandLogoProps {
  size?: "header" | "sm" | "md";
  variant?: "mark" | "full";
  animated?: boolean;
  className?: string;
}

export default function BrandLogo({
  size = "sm",
  variant = "full",
  animated = false,
  className = "",
}: BrandLogoProps) {
  const medium = size === "md";
  const header = size === "header";
  const mark = variant === "mark";
  const frameSize = header
    ? "h-[38px] w-[142px] p-[3px] sm:h-[50px] sm:w-[187px] sm:p-1 lg:h-[55px] lg:w-[205px]"
    : mark
    ? medium
      ? "h-[64px] w-[239px] p-0"
      : "h-[46px] w-[172px] p-0 sm:h-[52px] sm:w-[194px]"
    : medium
      ? "h-[82px] w-[184px] p-3"
      : "h-[56px] w-[128px] p-2 sm:h-[62px] sm:w-[142px]";

  return (
    <span
      className={`brand-logo ${animated ? "brand-logo--animated" : ""} relative inline-flex shrink-0 items-center justify-center overflow-hidden ${header ? "rounded-[6px]" : "rounded-[9px]"} bg-white shadow-[0_8px_24px_rgba(4,22,63,.16)] ${frameSize} ${className}`}
    >
      <span className="relative block h-full w-full">
        <Image
          src={mark ? "/images/pnc-mark-crossline.svg" : "/images/pnc-client-logo-v2.png"}
          alt={mark ? "PNC" : "PNC Props-n-Crew"}
          fill
          sizes={header ? "(min-width: 1024px) 205px, (min-width: 640px) 187px, 142px" : mark ? "(min-width: 640px) 239px, 172px" : medium ? "160px" : "(min-width: 640px) 126px, 112px"}
          className="object-contain"
          priority={animated}
          unoptimized
        />
      </span>
    </span>
  );
}
