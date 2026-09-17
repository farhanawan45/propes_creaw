interface BrandLogoProps {
  size?: "sm" | "md";
  className?: string;
}

export default function BrandLogo({ size = "sm", className = "" }: BrandLogoProps) {
  const medium = size === "md";

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border border-copper/40 bg-pounamu-night/80 shadow-[0_8px_28px_rgba(3,15,13,0.22),inset_0_1px_0_rgba(245,241,232,0.08)] backdrop-blur-md ${
        medium ? "gap-3 p-1.5 pr-4" : "gap-2.5 p-1 pr-3"
      } ${className}`}
      aria-label="Props & Crew"
    >
      <span
        className={`relative flex shrink-0 items-center justify-center rounded-full border border-ivory/25 bg-[linear-gradient(135deg,#f5c298_0%,#d67d4d_48%,#a94f2d_100%)] text-pounamu-night shadow-[0_0_22px_rgba(201,119,74,0.38),inset_0_1px_0_rgba(255,255,255,0.5)] ${
          medium ? "h-11 w-11" : "h-9 w-9"
        }`}
      >
        <span className="absolute inset-[3px] rounded-full border border-pounamu-night/20" />
        <span className={`relative font-display font-bold tracking-[-0.08em] ${medium ? "text-[12px]" : "text-[10px]"}`}>P&amp;C</span>
      </span>

      <span className="flex items-baseline whitespace-nowrap leading-none">
        <span className={`font-display font-semibold tracking-[0.08em] text-ivory ${medium ? "text-[14px]" : "text-[12px]"}`}>PROPS</span>
        <span className={`ml-1.5 font-display font-semibold tracking-[0.06em] text-copper-light ${medium ? "text-[11px]" : "text-[9px]"}`}>&amp; CREW</span>
      </span>
    </span>
  );
}
