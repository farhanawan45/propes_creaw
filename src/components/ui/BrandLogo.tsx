import Image from "next/image";

interface BrandLogoProps {
  size?: "sm" | "md";
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
  const mark = variant === "mark";
  const frameSize = mark
    ? medium
      ? "h-[76px] w-[240px] p-3"
      : "h-[54px] w-[170px] p-2 sm:h-[64px] sm:w-[204px]"
    : medium
      ? "h-[82px] w-[184px] p-3"
      : "h-[56px] w-[128px] p-2 sm:h-[62px] sm:w-[142px]";

  return (
    <span
      className={`brand-logo ${animated ? "brand-logo--animated" : ""} relative inline-flex shrink-0 items-center justify-center rounded-[9px] bg-white shadow-[0_8px_24px_rgba(4,22,63,.16)] ${frameSize} ${className}`}
    >
      <span className="relative block h-full w-full">
        <Image
          src={mark ? "/images/pnc-mark.svg" : "/images/pnc-client-logo-v2.png"}
          alt={mark ? "PNC" : "PNC Props-n-Crew"}
          fill
          sizes={mark ? "(min-width: 640px) 188px, 154px" : medium ? "160px" : "(min-width: 640px) 126px, 112px"}
          className="object-contain"
          priority={animated}
          unoptimized
        />
      </span>
    </span>
  );
}
