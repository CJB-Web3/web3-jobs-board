import React from "react";

const HeroBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Base gradient like the reference */}
        <rect width="100%" height="100%" className="fill-primary/10" />

        {/* Circles in the exact positions from reference */}
        <circle cx="900" cy="50" r="250" className="fill-primary/20" />
        <circle cx="950" cy="150" r="200" className="fill-primary/15" />
        <circle cx="950" cy="150" r="150" className="fill-primary/10" />

        {/* The EXACT wave pattern from your reference */}
        <path
          d="M0 400 C 150 360, 300 440, 500 400 C 700 360, 850 440, 1000 400 L1000 500 L0 500 Z"
          className="fill-white dark:fill-[#030712]"
        />
      </svg>

      <div className="relative">{children}</div>
    </div>
  );
};

export default HeroBackground;
