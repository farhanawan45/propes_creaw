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

  return (
    <span
      className={`brand-logo ${animated ? "brand-logo--animated" : ""} inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[9px] bg-white shadow-[0_8px_24px_rgba(4,22,63,.16)] ${
        mark
          ? medium
            ? "h-[62px] w-[180px] px-3"
            : "h-[50px] w-[142px] px-2 sm:h-[58px] sm:w-[166px]"
          : medium
            ? "px-3 py-2"
            : "px-2.5 py-1.5"
      } ${className}`}
    >
      {mark ? (
        <span className="relative block h-full w-full overflow-hidden" aria-hidden="true">
          <Image
            src="/images/pnc-client-logo-v2.png"
            alt=""
            width={780}
            height={371}
            className="absolute left-1/2 top-[4%] h-auto w-[106%] max-w-none -translate-x-1/2 object-contain"
            priority
            unoptimized
          />
        </span>
      ) : (
        <Image
          src="/images/pnc-client-logo-v2.png"
          alt="Props-n-Crew"
          width={780}
          height={371}
          className={medium ? "h-[64px] w-[136px] object-contain" : "h-[40px] w-[84px] object-contain sm:h-[46px] sm:w-[98px]"}
          unoptimized
        />
      )}
      {mark && <span className="sr-only">PNC</span>}
    </span>
  );
}
