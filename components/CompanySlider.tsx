const LOGOS_TOP = [
  { name: "Uniswap",   src: "https://cryptologos.cc/logos/uniswap-uni-logo.svg" },
  { name: "Aave",      src: "https://cryptologos.cc/logos/aave-aave-logo.svg" },
  { name: "Polygon",   src: "https://cryptologos.cc/logos/polygon-matic-logo.svg" },
  { name: "Chainlink", src: "https://cryptologos.cc/logos/chainlink-link-logo.svg" },
  { name: "Algorand",  src: "https://cryptologos.cc/logos/algorand-algo-logo.svg" },
  { name: "Aragon",    src: "https://cryptologos.cc/logos/aragon-ant-logo.svg" },
];

const LOGOS_BOTTOM = [
  { name: "Ethereum",  src: "https://cryptologos.cc/logos/ethereum-eth-logo.svg" },
  { name: "Solana",    src: "https://cryptologos.cc/logos/solana-sol-logo.svg" },
  { name: "Avalanche", src: "https://cryptologos.cc/logos/avalanche-avax-logo.svg" },
  { name: "Compound",  src: "https://cryptologos.cc/logos/compound-comp-logo.svg" },
  { name: "The Graph", src: "https://cryptologos.cc/logos/the-graph-grt-logo.svg" },
  { name: "Maker",     src: "https://cryptologos.cc/logos/maker-mkr-logo.svg" },
];

const fadeEdges = {
  maskImage: "linear-gradient(to right, transparent, black 16%, black 84%, transparent)",
  WebkitMaskImage: "linear-gradient(to right, transparent, black 16%, black 84%, transparent)",
} as React.CSSProperties;

function LogoStrip({
  logos,
  direction,
  ariaLabel,
}: {
  logos: typeof LOGOS_TOP;
  direction: "ltr" | "rtl";
  ariaLabel: string;
}) {
  const animClass = direction === "ltr" ? "animate-marquee-ltr" : "animate-marquee";

  return (
    <div
      className="overflow-hidden py-4 select-none"
      style={fadeEdges}
      aria-label={ariaLabel}
    >
      <div className={`flex ${animClass}`} style={{ width: "max-content" }}>
        {[false, true].map((hidden) => (
          <div
            key={String(hidden)}
            className="flex items-center shrink-0"
            aria-hidden={hidden}
          >
            {logos.map((logo) => (
              <div
                key={logo.name}
                className="flex items-center justify-center w-24 px-5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={hidden ? "" : `${logo.name} logo`}
                  referrerPolicy="no-referrer"
                  className="h-16 w-auto object-contain grayscale opacity-40 dark:invert dark:opacity-60 hover:grayscale-0 hover:invert-0 hover:opacity-90 transition-all duration-300"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CompanySlider() {
  return (
    <div className="flex flex-col justify-center py-8 px-2">
      {/* Labels — padded to align with left column */}
      <p className="font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-[#CC0000] px-4 sm:px-6 lg:px-8 mb-1">
        ■ Web3 Ecosystem
      </p>
      <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground px-4 sm:px-6 lg:px-8 mb-3">
        Protocols &amp; Companies Hiring
      </p>

      {/* Top strip — left to right */}
      <LogoStrip logos={LOGOS_TOP} direction="ltr" ariaLabel="Web3 protocols strip one" />

      <div className="h-px bg-foreground/10 mx-4 sm:mx-6 lg:mx-8" />

      {/* Bottom strip — right to left */}
      <LogoStrip logos={LOGOS_BOTTOM} direction="rtl" ariaLabel="Web3 protocols strip two" />

      {/* Footer line */}
      <p className="font-body text-xs italic text-muted-foreground px-4 sm:px-6 lg:px-8 mt-3">
        Join the teams building the decentralized web.
      </p>
    </div>
  );
}
