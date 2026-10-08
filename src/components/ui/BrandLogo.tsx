import Image from "next/image";

interface BrandLogoProps {
  size?: "sm" | "md";
  animated?: boolean;
  className?: string;
}

export default function BrandLogo({
  size = "sm",
  animated = false,
  className = "",
}: BrandLogoProps) {
  const medium = size === "md";

  return (
    <span
      className={`brand-logo ${animated ? "brand-logo--animated" : ""} relative inline-flex shrink-0 items-center justify-center rounded-[9px] bg-white shadow-[0_8px_24px_rgba(4,22,63,.16)] ${
        medium
          ? "h-[82px] w-[184px] p-3"
          : "h-[56px] w-[128px] p-2 sm:h-[62px] sm:w-[142px]"
      } ${className}`}
    >
      <span className="relative block h-full w-full">
        <Image
          src="/images/pnc-client-logo-v2.png"
          alt="PNC Props-n-Crew"
          fill
          sizes={medium ? "160px" : "(min-width: 640px) 126px, 112px"}
          className="object-contain"
          priority={animated}
          unoptimized
        />
      </span>
    </span>
  );
}
