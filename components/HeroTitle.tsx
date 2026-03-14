"use client";

import { useEffect, useState } from "react";

// Approximate anchor points + bezier handles for "WEB3 JOBS"
// Positioned for Playfair Display 900 at ~102px in a 760×130 viewBox, baseline y=108
// h1/h2 = handle endpoint [x, y] (null = no handle on that side)
type HandleDef = { ax: number; ay: number; h1: [number, number] | null; h2: [number, number] | null };

const NODES: HandleDef[] = [
  // ── W ──────────────────────────────────────
  { ax: 18,  ay: 20,  h1: null,       h2: [40,  62]  },
  { ax: 62,  ay: 108, h1: [42,  80],  h2: [82,  80]  },
  { ax: 106, ay: 20,  h1: [84,  62],  h2: null       },
  { ax: 40,  ay: 62,  h1: [26,  42],  h2: [52,  78]  },
  { ax: 84,  ay: 62,  h1: [72,  78],  h2: [96,  42]  },

  // ── E ──────────────────────────────────────
  { ax: 120, ay: 20,  h1: null,       h2: [120, 65]  },
  { ax: 120, ay: 108, h1: [120, 78],  h2: null       },
  { ax: 182, ay: 20,  h1: [148, 20],  h2: null       },
  { ax: 172, ay: 64,  h1: [145, 64],  h2: null       },
  { ax: 182, ay: 108, h1: [148, 108], h2: null       },

  // ── B ──────────────────────────────────────
  { ax: 198, ay: 20,  h1: null,       h2: [198, 64]  },
  { ax: 198, ay: 108, h1: [198, 80],  h2: null       },
  { ax: 254, ay: 46,  h1: [252, 26],  h2: [252, 64]  },
  { ax: 236, ay: 64,  h1: null,       h2: null       },
  { ax: 258, ay: 84,  h1: [258, 64],  h2: [250, 104] },

  // ── 3 ──────────────────────────────────────
  { ax: 274, ay: 28,  h1: [290, 18],  h2: null       },
  { ax: 318, ay: 22,  h1: [295, 16],  h2: [336, 40]  },
  { ax: 336, ay: 55,  h1: [340, 38],  h2: [338, 68]  },
  { ax: 296, ay: 66,  h1: [312, 60],  h2: null       },
  { ax: 338, ay: 82,  h1: [340, 68],  h2: [336, 96]  },
  { ax: 318, ay: 104, h1: [338, 96],  h2: [294, 106] },
  { ax: 274, ay: 102, h1: null,       h2: [292, 108] },

  // ── J ──────────────────────────────────────
  { ax: 402, ay: 20,  h1: [374, 20],  h2: [430, 20]  },
  { ax: 430, ay: 20,  h1: [408, 20],  h2: [430, 75]  },
  { ax: 430, ay: 92,  h1: [430, 74],  h2: [420, 110] },
  { ax: 408, ay: 118, h1: [420, 114], h2: [390, 118] },
  { ax: 384, ay: 106, h1: [388, 118], h2: null       },

  // ── O ──────────────────────────────────────
  { ax: 476, ay: 14,  h1: [450, 16],  h2: [502, 16]  },
  { ax: 516, ay: 64,  h1: [514, 36],  h2: [514, 92]  },
  { ax: 476, ay: 114, h1: [502, 112], h2: [450, 112] },
  { ax: 436, ay: 64,  h1: [438, 92],  h2: [438, 36]  },

  // ── B (2nd) ────────────────────────────────
  { ax: 534, ay: 20,  h1: null,       h2: [534, 64]  },
  { ax: 534, ay: 108, h1: [534, 80],  h2: null       },
  { ax: 590, ay: 46,  h1: [588, 26],  h2: [588, 64]  },
  { ax: 572, ay: 64,  h1: null,       h2: null       },
  { ax: 594, ay: 84,  h1: [594, 64],  h2: [586, 104] },

  // ── S ──────────────────────────────────────
  { ax: 614, ay: 34,  h1: [630, 20],  h2: [600, 24]  },
  { ax: 656, ay: 28,  h1: [636, 18],  h2: [670, 48]  },
  { ax: 668, ay: 60,  h1: [672, 44],  h2: [666, 76]  },
  { ax: 620, ay: 72,  h1: [644, 66],  h2: [600, 78]  },
  { ax: 610, ay: 92,  h1: [606, 78],  h2: [612, 108] },
  { ax: 650, ay: 112, h1: [632, 122], h2: [668, 102] },
  { ax: 672, ay: 98,  h1: [674, 112], h2: null       },
];

export default function HeroTitle() {
  const [strokeOpacity, setStrokeOpacity] = useState(1);
  const [fillOpacity, setFillOpacity]     = useState(0);
  const [nodesOpacity, setNodesOpacity]   = useState(0);
  const [isAnimating, setIsAnimating]     = useState(true);

  useEffect(() => {
    // Nodes appear shortly after drawing starts
    const t0 = setTimeout(() => setNodesOpacity(1), 350);
    // Drawing finishes
    const t1 = setTimeout(() => setIsAnimating(false), 2400);
    // Solid fill fades in, stroke + nodes fade out
    const t2 = setTimeout(() => {
      setFillOpacity(1);
      setStrokeOpacity(0);
      setNodesOpacity(0);
    }, 2900);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // CSS vars for theme-aware colours
  const ink  = "hsl(var(--foreground))";
  const paper = "hsl(var(--background))";

  return (
    <svg
      viewBox="0 0 760 130"
      className="w-full"
      style={{ maxHeight: "clamp(52px, 11vw, 140px)" }}
      aria-label="Web3 Jobs"
    >
      {/* ── STROKE LAYER (draws in, then fades) ── */}
      <text
        x="2"
        y="108"
        style={{
          fontFamily: "var(--font-playfair), 'Times New Roman', serif",
          fontSize: "102px",
          fontWeight: 900,
          letterSpacing: "-1px",
          fill: "none",
          stroke: ink,
          strokeWidth: "1.5",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeDasharray: "6000",
          strokeDashoffset: "6000",
          opacity: strokeOpacity,
          transition: strokeOpacity === 0 ? "opacity 0.8s ease-out" : "none",
          animation: isAnimating
            ? "stroke-draw 2.4s cubic-bezier(0.4, 0, 0.2, 1) forwards"
            : "none",
        }}
      >
        WEB3 JOBS
      </text>

      {/* ── FILL LAYER (fades in over stroke) ── */}
      <text
        x="2"
        y="108"
        style={{
          fontFamily: "var(--font-playfair), 'Times New Roman', serif",
          fontSize: "102px",
          fontWeight: 900,
          letterSpacing: "-1px",
          fill: ink,
          stroke: "none",
          opacity: fillOpacity,
          transition: fillOpacity === 1 ? "opacity 1.1s ease-in" : "none",
        }}
      >
        WEB3 JOBS
      </text>

      {/* ── ANCHOR POINTS & BÉZIER HANDLES ── */}
      <g
        style={{
          opacity: nodesOpacity,
          transition:
            nodesOpacity === 1
              ? "opacity 0.25s ease-in"
              : nodesOpacity === 0
              ? "opacity 0.45s ease-out"
              : "none",
        }}
      >
        {NODES.map((pt, i) => (
          <g key={i}>
            {/* Handle 1 — line + endpoint circle */}
            {pt.h1 && (
              <>
                <line
                  x1={pt.ax} y1={pt.ay}
                  x2={pt.h1[0]} y2={pt.h1[1]}
                  stroke={ink} strokeWidth="0.6" opacity="0.55"
                />
                <circle
                  cx={pt.h1[0]} cy={pt.h1[1]} r="2.8"
                  fill={paper} stroke={ink} strokeWidth="0.7"
                />
              </>
            )}
            {/* Handle 2 — line + endpoint circle */}
            {pt.h2 && (
              <>
                <line
                  x1={pt.ax} y1={pt.ay}
                  x2={pt.h2[0]} y2={pt.h2[1]}
                  stroke={ink} strokeWidth="0.6" opacity="0.55"
                />
                <circle
                  cx={pt.h2[0]} cy={pt.h2[1]} r="2.8"
                  fill={paper} stroke={ink} strokeWidth="0.7"
                />
              </>
            )}
            {/* Anchor point — hollow square */}
            <rect
              x={pt.ax - 3} y={pt.ay - 3}
              width="6" height="6"
              fill={paper} stroke={ink} strokeWidth="0.9"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
