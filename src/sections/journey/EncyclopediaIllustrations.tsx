import type { CSSProperties } from 'react'

/**
 * Vintage encyclopedia-style SVG illustrations with engraving detail:
 * crosshatching, stippling, multiple stroke weights — inspired by
 * 18th/19th century natural history plates (Alambique style).
 */

/* ── Shared wrapper ── */
interface IllustrationProps {
  style?: CSSProperties
  className?: string
  flip?: boolean
}

function Wrapper({ children, style, className, flip }: IllustrationProps & { children: React.ReactNode }) {
  return (
    <div
      className={`pointer-events-none select-none ${className ?? ''}`}
      style={{
        color: 'var(--text-primary)',
        ...style,
        transform: flip ? `${style?.transform ?? ''} scaleX(-1)` : style?.transform,
      }}
    >
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   CROSSHATCH / STIPPLE PATTERN DEFINITIONS
   ═══════════════════════════════════════════════ */

function EngravingDefs() {
  return (
    <defs>
      {/* Fine crosshatch fill */}
      <pattern id="crosshatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="4" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
      </pattern>
      <pattern id="crosshatch-dense" width="2.5" height="2.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="2.5" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
      </pattern>
      <pattern id="crosshatch-cross" width="4" height="4" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="4" y2="4" stroke="currentColor" strokeWidth="0.25" opacity="0.3" />
        <line x1="4" y1="0" x2="0" y2="4" stroke="currentColor" strokeWidth="0.25" opacity="0.3" />
      </pattern>
      {/* Stipple dots */}
      <pattern id="stipple" width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.35" fill="currentColor" opacity="0.35" />
        <circle cx="4" cy="3" r="0.3" fill="currentColor" opacity="0.25" />
        <circle cx="2" cy="5" r="0.3" fill="currentColor" opacity="0.3" />
        <circle cx="5" cy="5.5" r="0.25" fill="currentColor" opacity="0.2" />
      </pattern>
      <pattern id="stipple-dense" width="4" height="4" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.35" fill="currentColor" opacity="0.4" />
        <circle cx="3" cy="2" r="0.3" fill="currentColor" opacity="0.35" />
        <circle cx="1.5" cy="3.5" r="0.3" fill="currentColor" opacity="0.3" />
        <circle cx="3.5" cy="0.5" r="0.25" fill="currentColor" opacity="0.25" />
      </pattern>
    </defs>
  )
}

/* ═══════════════════════════════════════════════
   HORNBILL — detailed engraving portrait
   (inspired by the Alambique toucan/hornbill)
   ═══════════════════════════════════════════════ */

export function Hornbill(props: IllustrationProps) {
  return (
    <Wrapper {...props}>
      <svg width="200" height="220" viewBox="0 0 200 220" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <EngravingDefs />
        {/* Head crest/casque */}
        <path d="M95 35 C100 18, 115 8, 135 10 C145 12, 150 18, 148 28 C146 35, 140 38, 130 38" strokeWidth="1.2" />
        <path d="M95 35 C98 28, 105 22, 115 18" strokeWidth="0.5" opacity="0.5" />
        <path d="M110 14 C118 12, 130 14, 140 20" strokeWidth="0.5" opacity="0.5" />
        {/* Casque shading */}
        <path d="M100 30 C105 22, 115 16, 128 16" strokeWidth="0.4" opacity="0.3" />
        <path d="M105 32 C108 26, 118 20, 132 19" strokeWidth="0.4" opacity="0.3" />
        <path d="M108 34 C112 28, 122 22, 136 22" strokeWidth="0.4" opacity="0.3" />

        {/* Large curved beak — upper mandible */}
        <path d="M130 38 C145 36, 165 30, 180 28 C188 27, 192 30, 188 35 C184 40, 170 44, 155 46" strokeWidth="1.4" />
        {/* Lower mandible */}
        <path d="M100 52 C115 50, 140 46, 155 46" strokeWidth="1.2" />
        <path d="M100 52 C112 54, 130 54, 148 50" strokeWidth="0.5" opacity="0.4" />
        {/* Beak ridges */}
        <path d="M135 36 C150 34, 170 30, 182 30" strokeWidth="0.4" opacity="0.5" />
        <path d="M138 38 C152 36, 168 34, 180 33" strokeWidth="0.4" opacity="0.4" />
        <path d="M140 40 C155 38, 168 36, 178 36" strokeWidth="0.4" opacity="0.3" />
        <path d="M142 42 C156 40, 168 38, 176 38" strokeWidth="0.4" opacity="0.3" />
        {/* Nostril */}
        <ellipse cx="140" cy="38" rx="2" ry="1" strokeWidth="0.6" />

        {/* Head */}
        <path d="M95 35 C88 38, 82 42, 80 48 C78 54, 80 60, 85 65 C90 68, 95 68, 100 65" strokeWidth="1.2" />
        {/* Eye */}
        <circle cx="92" cy="48" r="5" strokeWidth="1" />
        <circle cx="92" cy="48" r="2.5" fill="currentColor" />
        <circle cx="91" cy="47" r="0.8" fill="var(--card-bg)" />
        {/* Eye ring */}
        <circle cx="92" cy="48" r="7" strokeWidth="0.4" opacity="0.5" />

        {/* Head feather texture — fine lines */}
        <path d="M88 38 C86 40, 84 44, 84 48" strokeWidth="0.4" opacity="0.4" />
        <path d="M90 36 C88 38, 86 42, 86 46" strokeWidth="0.4" opacity="0.4" />
        <path d="M86 55 C84 58, 83 62, 85 65" strokeWidth="0.4" opacity="0.4" />
        <path d="M90 56 C88 60, 88 63, 90 66" strokeWidth="0.4" opacity="0.4" />

        {/* Neck */}
        <path d="M100 65 C105 70, 108 80, 106 90 C104 100, 98 110, 90 118" strokeWidth="1.2" />
        <path d="M85 65 C78 72, 72 82, 70 92 C68 102, 70 112, 75 120" strokeWidth="1.2" />
        {/* Neck feather hatching */}
        <path d="M96 72 C94 76, 92 80, 90 84" strokeWidth="0.4" opacity="0.4" />
        <path d="M100 75 C98 79, 96 83, 94 87" strokeWidth="0.4" opacity="0.4" />
        <path d="M103 80 C101 84, 99 88, 97 92" strokeWidth="0.4" opacity="0.3" />
        <path d="M82 72 C80 76, 78 80, 76 84" strokeWidth="0.4" opacity="0.4" />
        <path d="M78 78 C76 82, 74 86, 73 90" strokeWidth="0.4" opacity="0.3" />
        <path d="M86 80 C84 85, 82 90, 80 95" strokeWidth="0.4" opacity="0.3" />

        {/* Breast / body */}
        <path d="M75 120 C72 130, 68 145, 65 160 C62 175, 60 190, 62 200" strokeWidth="1.1" />
        <path d="M90 118 C95 128, 100 145, 102 160 C104 175, 104 190, 100 200" strokeWidth="1.1" />
        {/* Body feather hatching — denser */}
        {Array.from({ length: 14 }).map((_, i) => {
          const y = 122 + i * 5.5
          const x1 = 72 - i * 0.4
          const x2 = 94 + i * 0.5
          return (
            <path
              key={`bh-${i}`}
              d={`M${x1} ${y} C${x1 + 4} ${y + 2}, ${x2 - 4} ${y + 2}, ${x2} ${y}`}
              strokeWidth="0.35"
              opacity={0.25 + (i % 3) * 0.08}
            />
          )
        })}

        {/* Breast stippling for shadow */}
        <ellipse cx="82" cy="160" rx="14" ry="30" fill="url(#stipple)" stroke="none" opacity="0.6" />

        {/* Tail feathers */}
        <path d="M62 200 C58 208, 55 215, 52 218" strokeWidth="0.8" />
        <path d="M70 200 C68 208, 65 214, 62 218" strokeWidth="0.8" />
        <path d="M80 200 C78 208, 76 214, 74 218" strokeWidth="0.8" />
        <path d="M90 200 C88 208, 86 214, 84 218" strokeWidth="0.8" />
        <path d="M100 200 C98 208, 96 214, 94 218" strokeWidth="0.8" />

        {/* Feet / perch suggestion */}
        <path d="M70 195 C65 198, 58 200, 50 198" strokeWidth="0.8" />
        <path d="M88 195 C92 198, 98 200, 105 198" strokeWidth="0.8" />
        {/* Branch */}
        <path d="M40 198 C55 196, 75 195, 95 196 C105 197, 115 198, 120 196" strokeWidth="1.5" />
        <path d="M40 200 C55 198, 75 197, 95 198 C105 199, 115 200, 120 198" strokeWidth="1" />
      </svg>
    </Wrapper>
  )
}

/* ═══════════════════════════════════════════════
   BOTANICAL FERN — rich engraving
   ═══════════════════════════════════════════════ */

export function FernFrond(props: IllustrationProps) {
  return (
    <Wrapper {...props}>
      <svg width="180" height="260" viewBox="0 0 180 260" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <EngravingDefs />
        {/* Main rachis — thick tapered */}
        <path d="M90 250 C88 220, 86 180, 84 140 C82 100, 80 60, 85 25" strokeWidth="1.8" />
        <path d="M90 250 C91 230, 89 200, 87 170" strokeWidth="0.8" opacity="0.4" />

        {/* Left pinnae — with detailed sub-pinnae */}
        {[
          { y: 220, x: 30, len: 55 },
          { y: 200, x: 22, len: 60 },
          { y: 180, x: 16, len: 65 },
          { y: 160, x: 14, len: 66 },
          { y: 140, x: 18, len: 62 },
          { y: 120, x: 24, len: 56 },
          { y: 100, x: 32, len: 48 },
          { y: 82, x: 40, len: 38 },
          { y: 66, x: 48, len: 28 },
          { y: 52, x: 56, len: 18 },
        ].map((p, i) => {
          const startX = 85 - (10 - i) * 0.4
          return (
            <g key={`lp-${i}`}>
              {/* Main pinna */}
              <path d={`M${startX} ${p.y} C${startX - 10} ${p.y - 4}, ${p.x + 15} ${p.y - 6}, ${p.x} ${p.y - 2}`} strokeWidth="0.9" />
              {/* Sub-pinnae leaflets */}
              {Array.from({ length: Math.floor(p.len / 10) }).map((_, j) => {
                const frac = (j + 1) / (p.len / 10 + 1)
                const cx = startX - frac * (startX - p.x)
                const cy = p.y - frac * 4
                return (
                  <g key={`sl-${j}`}>
                    <path d={`M${cx} ${cy} C${cx - 3} ${cy - 5}, ${cx - 6} ${cy - 7}, ${cx - 8} ${cy - 4}`} strokeWidth="0.5" />
                    <path d={`M${cx} ${cy} L${cx - 5} ${cy - 5}`} strokeWidth="0.3" opacity="0.4" />
                  </g>
                )
              })}
              {/* Hatching along pinna */}
              <path d={`M${startX - 5} ${p.y - 1} C${startX - 15} ${p.y - 3}, ${p.x + 20} ${p.y - 5}, ${p.x + 8} ${p.y - 3}`} strokeWidth="0.3" opacity="0.3" />
            </g>
          )
        })}

        {/* Right pinnae — mirrored */}
        {[
          { y: 220, x: 150, len: 55 },
          { y: 200, x: 158, len: 60 },
          { y: 180, x: 164, len: 65 },
          { y: 160, x: 166, len: 66 },
          { y: 140, x: 162, len: 62 },
          { y: 120, x: 156, len: 56 },
          { y: 100, x: 148, len: 48 },
          { y: 82, x: 140, len: 38 },
          { y: 66, x: 132, len: 28 },
          { y: 52, x: 124, len: 18 },
        ].map((p, i) => {
          const startX = 85 + (10 - i) * 0.4
          return (
            <g key={`rp-${i}`}>
              <path d={`M${startX} ${p.y} C${startX + 10} ${p.y - 4}, ${p.x - 15} ${p.y - 6}, ${p.x} ${p.y - 2}`} strokeWidth="0.9" />
              {Array.from({ length: Math.floor(p.len / 10) }).map((_, j) => {
                const frac = (j + 1) / (p.len / 10 + 1)
                const cx = startX + frac * (p.x - startX)
                const cy = p.y - frac * 4
                return (
                  <g key={`sr-${j}`}>
                    <path d={`M${cx} ${cy} C${cx + 3} ${cy - 5}, ${cx + 6} ${cy - 7}, ${cx + 8} ${cy - 4}`} strokeWidth="0.5" />
                    <path d={`M${cx} ${cy} L${cx + 5} ${cy - 5}`} strokeWidth="0.3" opacity="0.4" />
                  </g>
                )
              })}
              <path d={`M${startX + 5} ${p.y - 1} C${startX + 15} ${p.y - 3}, ${p.x - 20} ${p.y - 5}, ${p.x - 8} ${p.y - 3}`} strokeWidth="0.3" opacity="0.3" />
            </g>
          )
        })}

        {/* Fiddlehead curl */}
        <path d="M85 25 C84 18, 86 12, 90 8 C94 5, 97 7, 96 12 C95 16, 92 18, 88 18" strokeWidth="1.2" />
        <path d="M90 10 C92 8, 94 9, 93 12" strokeWidth="0.4" opacity="0.5" />
      </svg>
    </Wrapper>
  )
}

/* ═══════════════════════════════════════════════
   SEAHORSE — engraved marine specimen
   ═══════════════════════════════════════════════ */

export function Seahorse(props: IllustrationProps) {
  return (
    <Wrapper {...props}>
      <svg width="100" height="200" viewBox="0 0 100 200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <EngravingDefs />
        {/* Crown/coronet */}
        <path d="M52 18 C50 10, 48 5, 52 2 C56 0, 58 4, 56 10" strokeWidth="1" />
        <path d="M48 16 C46 12, 50 8, 54 8" strokeWidth="0.5" opacity="0.5" />

        {/* Head */}
        <path d="M56 18 C62 20, 68 24, 70 30 C72 36, 68 40, 62 42" strokeWidth="1.2" />
        <path d="M42 18 C38 20, 34 26, 34 32 C34 38, 38 42, 44 44" strokeWidth="1.2" />
        {/* Snout */}
        <path d="M62 42 C68 42, 76 40, 82 38" strokeWidth="1.1" />
        <path d="M62 44 C68 44, 76 44, 82 42" strokeWidth="0.8" />
        <path d="M82 38 C84 39, 84 41, 82 42" strokeWidth="0.8" />
        {/* Eye */}
        <circle cx="55" cy="28" r="4" strokeWidth="0.8" />
        <circle cx="55" cy="28" r="2" fill="currentColor" />
        <circle cx="54" cy="27" r="0.6" fill="var(--card-bg)" />

        {/* Body — armored segments with ridges */}
        <path d="M44 44 C40 50, 36 60, 34 70 C32 80, 32 92, 34 100" strokeWidth="1.2" />
        <path d="M56 44 C60 50, 64 60, 66 70 C68 80, 68 92, 66 100" strokeWidth="1.2" />

        {/* Body segment ridges */}
        {Array.from({ length: 10 }).map((_, i) => {
          const y = 48 + i * 5.5
          const expand = Math.sin((i / 9) * Math.PI) * 4
          return (
            <g key={`seg-${i}`}>
              <path d={`M${38 - expand} ${y} L${62 + expand} ${y}`} strokeWidth="0.5" opacity="0.4" />
              {/* Spike on left */}
              <path d={`M${38 - expand} ${y} L${34 - expand - 2} ${y - 1.5}`} strokeWidth="0.6" opacity="0.5" />
              {/* Spike on right */}
              <path d={`M${62 + expand} ${y} L${66 + expand + 2} ${y - 1.5}`} strokeWidth="0.6" opacity="0.5" />
            </g>
          )
        })}

        {/* Belly texture — stippling */}
        <rect x="40" y="50" width="20" height="45" rx="8" fill="url(#stipple)" stroke="none" opacity="0.5" />

        {/* Lower body curving into tail */}
        <path d="M34 100 C32 110, 30 120, 32 130 C34 140, 40 148, 48 152" strokeWidth="1.1" />
        <path d="M66 100 C68 108, 68 116, 64 124 C60 132, 54 140, 50 148" strokeWidth="1.1" />

        {/* Tail curl — signature spiral */}
        <path d="M48 152 C52 156, 54 162, 50 168 C46 174, 38 176, 34 172 C30 168, 32 162, 38 158 C42 155, 46 156, 48 160 C49 163, 47 166, 44 166" strokeWidth="1.1" />

        {/* Tail segment ridges */}
        {Array.from({ length: 8 }).map((_, i) => {
          const t = i / 7
          const y = 104 + t * 50
          const shrink = t * 8
          return (
            <path key={`ts-${i}`} d={`M${36 + shrink} ${y} L${64 - shrink} ${y}`} strokeWidth="0.4" opacity="0.3" />
          )
        })}

        {/* Dorsal fin */}
        <path d="M64 65 C72 60, 78 55, 76 62 C74 68, 68 72, 66 72" strokeWidth="0.8" />
        {/* Fin rays */}
        <path d="M66 66 C70 62, 74 58, 74 62" strokeWidth="0.35" opacity="0.4" />
        <path d="M66 68 C70 65, 74 62, 74 65" strokeWidth="0.35" opacity="0.4" />
        <path d="M66 70 C70 68, 74 66, 74 68" strokeWidth="0.35" opacity="0.4" />

        {/* Small pectoral fin */}
        <path d="M36 55 C30 52, 26 50, 28 56 C30 60, 34 60, 36 58" strokeWidth="0.7" />
      </svg>
    </Wrapper>
  )
}

/* ═══════════════════════════════════════════════
   BEETLE — detailed entomological plate
   ═══════════════════════════════════════════════ */

export function Beetle(props: IllustrationProps) {
  return (
    <Wrapper {...props}>
      <svg width="100" height="120" viewBox="0 0 100 120" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <EngravingDefs />
        {/* Head */}
        <path d="M42 30 C42 22, 50 16, 58 16 C66 16, 74 22, 74 30" strokeWidth="1.1" />
        {/* Mandibles */}
        <path d="M48 20 C44 14, 38 10, 34 8" strokeWidth="0.9" />
        <path d="M34 8 C36 10, 38 12, 42 16" strokeWidth="0.5" opacity="0.4" />
        <path d="M68 20 C72 14, 78 10, 82 8" strokeWidth="0.9" />
        <path d="M82 8 C80 10, 78 12, 74 16" strokeWidth="0.5" opacity="0.4" />
        {/* Antennae */}
        <path d="M46 18 C42 12, 36 6, 28 4 C24 3, 20 5, 18 8" strokeWidth="0.8" />
        <path d="M70 18 C74 12, 80 6, 88 4 C92 3, 96 5, 98 8" strokeWidth="0.8" />
        {/* Antenna segments */}
        <path d="M28 4 C26 4, 24 4, 22 5" strokeWidth="0.5" />
        <path d="M88 4 C90 4, 92 4, 94 5" strokeWidth="0.5" />
        {/* Eyes */}
        <ellipse cx="46" cy="24" rx="3" ry="4" fill="currentColor" opacity="0.7" />
        <ellipse cx="70" cy="24" rx="3" ry="4" fill="currentColor" opacity="0.7" />
        <ellipse cx="45.5" cy="23.5" rx="1" ry="1.5" fill="var(--card-bg)" opacity="0.5" />
        <ellipse cx="69.5" cy="23.5" rx="1" ry="1.5" fill="var(--card-bg)" opacity="0.5" />

        {/* Pronotum (thorax shield) */}
        <path d="M42 30 C38 32, 32 36, 30 42 C28 48, 32 52, 42 54" strokeWidth="1.1" />
        <path d="M74 30 C78 32, 84 36, 86 42 C88 48, 84 52, 74 54" strokeWidth="1.1" />
        {/* Pronotum midline */}
        <path d="M58 30 L58 54" strokeWidth="0.5" opacity="0.4" />
        {/* Pronotum hatching */}
        <ellipse cx="58" cy="42" rx="22" ry="10" fill="url(#crosshatch)" stroke="none" opacity="0.3" />

        {/* Elytra (wing covers) */}
        <path d="M42 54 C36 58, 28 68, 24 80 C20 92, 22 104, 30 110 C38 115, 50 116, 58 116" strokeWidth="1.2" />
        <path d="M74 54 C80 58, 88 68, 92 80 C96 92, 94 104, 86 110 C78 115, 66 116, 58 116" strokeWidth="1.2" />
        {/* Elytra midline suture */}
        <path d="M58 54 L58 116" strokeWidth="0.8" />

        {/* Elytra hatching — fine engraving lines */}
        {Array.from({ length: 8 }).map((_, i) => {
          const y = 60 + i * 7
          const spread = 8 + i * 2.5
          return (
            <g key={`eh-${i}`}>
              <path d={`M${58 - spread} ${y} C${58 - spread + 4} ${y + 3}, ${56} ${y + 3}, ${58} ${y}`} strokeWidth="0.3" opacity="0.3" />
              <path d={`M${58 + spread} ${y} C${58 + spread - 4} ${y + 3}, ${60} ${y + 3}, ${58} ${y}`} strokeWidth="0.3" opacity="0.3" />
            </g>
          )
        })}

        {/* Elytra dots (punctae) */}
        {Array.from({ length: 6 }).map((_, i) => (
          <g key={`pd-${i}`}>
            <circle cx={42 + i * 2} cy={70 + i * 6} r="0.6" fill="currentColor" opacity="0.25" />
            <circle cx={74 - i * 2} cy={70 + i * 6} r="0.6" fill="currentColor" opacity="0.25" />
          </g>
        ))}

        {/* Legs — 3 pairs */}
        {/* Front legs */}
        <path d="M36 38 C28 36, 18 34, 10 38 C6 40, 4 44, 6 46" strokeWidth="0.9" />
        <path d="M80 38 C88 36, 98 34, 106 38 C110 40, 112 44, 110 46" strokeWidth="0.9" />
        {/* Middle legs */}
        <path d="M32 52 C24 56, 14 60, 6 64 C2 66, 0 70, 2 72" strokeWidth="0.9" />
        <path d="M84 52 C92 56, 102 60, 110 64 C114 66, 116 70, 114 72" strokeWidth="0.9" />
        {/* Hind legs */}
        <path d="M30 74 C22 80, 12 88, 6 94 C2 98, 2 102, 4 104" strokeWidth="0.9" />
        <path d="M86 74 C94 80, 104 88, 110 94 C114 98, 114 102, 112 104" strokeWidth="0.9" />
        {/* Leg segments */}
        <path d="M10 38 L8 42" strokeWidth="0.5" />
        <path d="M106 38 L108 42" strokeWidth="0.5" />
        <path d="M6 64 L4 68" strokeWidth="0.5" />
        <path d="M110 64 L112 68" strokeWidth="0.5" />
      </svg>
    </Wrapper>
  )
}

/* ═══════════════════════════════════════════════
   OWL — natural history plate
   ═══════════════════════════════════════════════ */

export function Owl(props: IllustrationProps) {
  return (
    <Wrapper {...props}>
      <svg width="160" height="200" viewBox="0 0 160 200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <EngravingDefs />
        {/* Ear tufts */}
        <path d="M55 30 C52 20, 48 10, 42 4" strokeWidth="0.9" />
        <path d="M58 30 C56 22, 54 14, 50 8" strokeWidth="0.6" opacity="0.5" />
        <path d="M105 30 C108 20, 112 10, 118 4" strokeWidth="0.9" />
        <path d="M102 30 C104 22, 106 14, 110 8" strokeWidth="0.6" opacity="0.5" />

        {/* Head outline */}
        <path d="M42 30 C35 35, 28 45, 28 55 C28 65, 35 72, 45 75" strokeWidth="1.2" />
        <path d="M118 30 C125 35, 132 45, 132 55 C132 65, 125 72, 115 75" strokeWidth="1.2" />
        <path d="M42 30 C55 28, 65 26, 80 26 C95 26, 105 28, 118 30" strokeWidth="1" />

        {/* Facial disc */}
        <path d="M45 40 C50 38, 60 36, 80 36 C100 36, 110 38, 115 40 C118 52, 116 65, 110 72 C100 78, 80 80, 60 78 C50 72, 42 65, 42 52 Z" strokeWidth="0.6" />
        {/* Facial disc feather lines */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * 22.5 - 90) * Math.PI / 180
          return (
            <path key={`fd-${i}`}
              d={`M80 58 L${80 + 28 * Math.cos(a)} ${58 + 20 * Math.sin(a)}`}
              strokeWidth="0.3" opacity="0.25"
            />
          )
        })}

        {/* Eyes — large */}
        <circle cx="65" cy="52" r="10" strokeWidth="1" />
        <circle cx="95" cy="52" r="10" strokeWidth="1" />
        <circle cx="65" cy="52" r="6" fill="currentColor" opacity="0.8" />
        <circle cx="95" cy="52" r="6" fill="currentColor" opacity="0.8" />
        <circle cx="63" cy="50" r="2" fill="var(--card-bg)" />
        <circle cx="93" cy="50" r="2" fill="var(--card-bg)" />

        {/* Beak */}
        <path d="M76 62 L80 70 L84 62" strokeWidth="0.9" />
        <path d="M78 64 L80 68 L82 64" strokeWidth="0.4" opacity="0.5" />

        {/* Body */}
        <path d="M45 75 C38 85, 32 100, 30 120 C28 140, 32 160, 40 175" strokeWidth="1.2" />
        <path d="M115 75 C122 85, 128 100, 130 120 C132 140, 128 160, 120 175" strokeWidth="1.2" />

        {/* Body feather rows — scalloped pattern */}
        {Array.from({ length: 12 }).map((_, i) => {
          const y = 80 + i * 8
          const w = 20 + Math.sin((i / 11) * Math.PI) * 18
          return (
            <g key={`bf-${i}`}>
              <path d={`M${80 - w} ${y} C${80 - w + 8} ${y + 5}, ${80 - 4} ${y + 5}, ${80} ${y}`} strokeWidth="0.4" opacity="0.35" />
              <path d={`M${80 + w} ${y} C${80 + w - 8} ${y + 5}, ${80 + 4} ${y + 5}, ${80} ${y}`} strokeWidth="0.4" opacity="0.35" />
            </g>
          )
        })}

        {/* Breast stippling */}
        <ellipse cx="80" cy="130" rx="30" ry="40" fill="url(#stipple)" stroke="none" opacity="0.4" />

        {/* Feet */}
        <path d="M60 175 C55 180, 48 184, 42 185" strokeWidth="0.9" />
        <path d="M60 175 C58 182, 55 188, 50 192" strokeWidth="0.9" />
        <path d="M60 175 C62 182, 64 188, 68 192" strokeWidth="0.9" />
        <path d="M100 175 C105 180, 112 184, 118 185" strokeWidth="0.9" />
        <path d="M100 175 C102 182, 105 188, 110 192" strokeWidth="0.9" />
        <path d="M100 175 C98 182, 96 188, 92 192" strokeWidth="0.9" />
        {/* Talons */}
        <path d="M42 185 C40 187, 39 189, 40 190" strokeWidth="0.6" />
        <path d="M50 192 C49 194, 48 196, 49 197" strokeWidth="0.6" />
        <path d="M118 185 C120 187, 121 189, 120 190" strokeWidth="0.6" />
        <path d="M110 192 C111 194, 112 196, 111 197" strokeWidth="0.6" />

        {/* Branch */}
        <path d="M30 185 C45 182, 70 180, 90 182 C110 184, 130 185, 140 182" strokeWidth="1.6" />
        <path d="M30 187 C45 184, 70 182, 90 184 C110 186, 130 187, 140 184" strokeWidth="0.9" opacity="0.5" />
      </svg>
    </Wrapper>
  )
}

/* ═══════════════════════════════════════════════
   COMPASS ROSE — ornate cartographic
   ═══════════════════════════════════════════════ */

export function CompassRose(props: IllustrationProps) {
  return (
    <Wrapper {...props}>
      <svg width="140" height="140" viewBox="0 0 140 140" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <EngravingDefs />
        {/* Outer decorative ring */}
        <circle cx="70" cy="70" r="62" strokeWidth="1.2" />
        <circle cx="70" cy="70" r="60" strokeWidth="0.4" />
        <circle cx="70" cy="70" r="56" strokeWidth="0.8" />

        {/* Degree tick marks */}
        {Array.from({ length: 72 }).map((_, i) => {
          const angle = (i * 5) * Math.PI / 180
          const r1 = i % 2 === 0 ? (i % 10 === 0 ? 56 : 58) : 59.5
          const r2 = 60
          return (
            <line key={i}
              x1={70 + r1 * Math.sin(angle)} y1={70 - r1 * Math.cos(angle)}
              x2={70 + r2 * Math.sin(angle)} y2={70 - r2 * Math.cos(angle)}
              strokeWidth={i % 10 === 0 ? '0.8' : '0.3'} opacity={i % 10 === 0 ? '0.6' : '0.3'}
            />
          )
        })}

        {/* Inner ring */}
        <circle cx="70" cy="70" r="44" strokeWidth="0.5" />
        <circle cx="70" cy="70" r="42" strokeWidth="0.3" opacity="0.4" />

        {/* Cardinal points — elongated diamonds with shading */}
        {/* North */}
        <path d="M70 8 L74 54 L70 48 L66 54 Z" strokeWidth="0.8" />
        <path d="M70 8 L70 48" strokeWidth="0.3" opacity="0.2" />
        <path d="M68 40 L70 8 L70 48" fill="url(#crosshatch)" stroke="none" opacity="0.4" />
        {/* South */}
        <path d="M70 132 L74 86 L70 92 L66 86 Z" strokeWidth="0.8" />
        <path d="M72 92 L70 132 L70 92" fill="url(#crosshatch)" stroke="none" opacity="0.3" />
        {/* East */}
        <path d="M132 70 L86 74 L92 70 L86 66 Z" strokeWidth="0.8" />
        <path d="M92 72 L132 70 L92 70" fill="url(#crosshatch)" stroke="none" opacity="0.3" />
        {/* West */}
        <path d="M8 70 L54 74 L48 70 L54 66 Z" strokeWidth="0.8" />
        <path d="M48 68 L8 70 L48 70" fill="url(#crosshatch)" stroke="none" opacity="0.4" />

        {/* Intercardinal points — thinner */}
        <path d="M114 26 L78 62 L80 60 L78 58 Z" strokeWidth="0.6" />
        <path d="M26 26 L62 62 L60 60 L62 58 Z" strokeWidth="0.6" />
        <path d="M114 114 L78 78 L80 80 L78 82 Z" strokeWidth="0.6" />
        <path d="M26 114 L62 78 L60 80 L62 82 Z" strokeWidth="0.6" />

        {/* Center ornament */}
        <circle cx="70" cy="70" r="5" strokeWidth="0.8" />
        <circle cx="70" cy="70" r="3" strokeWidth="0.5" />
        <circle cx="70" cy="70" r="1.5" fill="currentColor" />

        {/* Cardinal letters — larger, serif */}
        <text x="70" y="7" textAnchor="middle" fill="currentColor" stroke="none" fontSize="8" fontFamily="var(--font-display)" fontWeight="700" letterSpacing="0.05em">N</text>
        <text x="70" y="139" textAnchor="middle" fill="currentColor" stroke="none" fontSize="8" fontFamily="var(--font-display)" fontWeight="700" letterSpacing="0.05em">S</text>
        <text x="138" y="73" textAnchor="middle" fill="currentColor" stroke="none" fontSize="8" fontFamily="var(--font-display)" fontWeight="700" letterSpacing="0.05em">E</text>
        <text x="3" y="73" textAnchor="middle" fill="currentColor" stroke="none" fontSize="8" fontFamily="var(--font-display)" fontWeight="700" letterSpacing="0.05em">W</text>
      </svg>
    </Wrapper>
  )
}

/* ═══════════════════════════════════════════════
   BUTTERFLY — detailed entomological engraving
   ═══════════════════════════════════════════════ */

export function Butterfly(props: IllustrationProps) {
  return (
    <Wrapper {...props}>
      <svg width="140" height="160" viewBox="0 0 140 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <EngravingDefs />
        {/* Body — segmented thorax + abdomen */}
        <path d="M70 40 L70 120" strokeWidth="1.8" />
        {/* Thorax segments */}
        <ellipse cx="70" cy="48" rx="4" ry="6" strokeWidth="0.8" />
        {/* Abdomen segments */}
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={`as-${i}`} d={`M67 ${58 + i * 7} L73 ${58 + i * 7}`} strokeWidth="0.4" opacity="0.4" />
        ))}
        {/* Abdomen hatching */}
        <rect x="68" y="55" width="4" height="60" rx="2" fill="url(#crosshatch-dense)" stroke="none" opacity="0.3" />

        {/* Head */}
        <ellipse cx="70" cy="36" rx="4" ry="5" strokeWidth="1" />
        <circle cx="68" cy="34" r="1.2" fill="currentColor" />
        <circle cx="72" cy="34" r="1.2" fill="currentColor" />

        {/* Antennae — curled */}
        <path d="M66 32 C58 18, 44 6, 32 4 C28 3, 26 6, 28 8" strokeWidth="0.8" />
        <path d="M74 32 C82 18, 96 6, 108 4 C112 3, 114 6, 112 8" strokeWidth="0.8" />
        <circle cx="28" cy="8" r="2" strokeWidth="0.6" />
        <circle cx="112" cy="8" r="2" strokeWidth="0.6" />

        {/* Upper wings — large, detailed */}
        <path d="M70 46 C58 32, 28 16, 10 22 C2 26, 2 36, 8 44 C16 54, 40 60, 70 56" strokeWidth="1.2" />
        <path d="M70 46 C82 32, 112 16, 130 22 C138 26, 138 36, 132 44 C124 54, 100 60, 70 56" strokeWidth="1.2" />

        {/* Upper wing veins — detailed network */}
        <path d="M70 48 C56 38, 30 26, 14 30" strokeWidth="0.5" opacity="0.5" />
        <path d="M70 50 C56 42, 28 34, 10 36" strokeWidth="0.5" opacity="0.5" />
        <path d="M70 52 C56 48, 32 44, 12 42" strokeWidth="0.5" opacity="0.4" />
        <path d="M70 54 C58 52, 40 52, 20 50" strokeWidth="0.4" opacity="0.3" />
        {/* Right wing veins */}
        <path d="M70 48 C84 38, 110 26, 126 30" strokeWidth="0.5" opacity="0.5" />
        <path d="M70 50 C84 42, 112 34, 130 36" strokeWidth="0.5" opacity="0.5" />
        <path d="M70 52 C84 48, 108 44, 128 42" strokeWidth="0.5" opacity="0.4" />
        <path d="M70 54 C82 52, 100 52, 120 50" strokeWidth="0.4" opacity="0.3" />

        {/* Wing eyespots */}
        <circle cx="32" cy="34" r="6" strokeWidth="0.6" />
        <circle cx="32" cy="34" r="3.5" strokeWidth="0.4" />
        <circle cx="32" cy="34" r="1.5" fill="currentColor" opacity="0.5" />
        <circle cx="108" cy="34" r="6" strokeWidth="0.6" />
        <circle cx="108" cy="34" r="3.5" strokeWidth="0.4" />
        <circle cx="108" cy="34" r="1.5" fill="currentColor" opacity="0.5" />

        {/* Wing edge pattern — scalloped */}
        <path d="M10 22 C8 24, 6 26, 4 30 C4 34, 6 36, 8 38" strokeWidth="0.4" opacity="0.4" />
        <path d="M130 22 C132 24, 134 26, 136 30 C136 34, 134 36, 132 38" strokeWidth="0.4" opacity="0.4" />

        {/* Wing hatching fills */}
        <path d="M30 24 C28 28, 26 32, 24 36" strokeWidth="0.25" opacity="0.2" />
        <path d="M22 26 C20 30, 18 34, 16 38" strokeWidth="0.25" opacity="0.2" />
        <path d="M110 24 C112 28, 114 32, 116 36" strokeWidth="0.25" opacity="0.2" />
        <path d="M118 26 C120 30, 122 34, 124 38" strokeWidth="0.25" opacity="0.2" />

        {/* Lower wings */}
        <path d="M70 68 C56 64, 28 68, 16 80 C8 90, 12 104, 22 108 C34 112, 54 100, 70 85" strokeWidth="1.2" />
        <path d="M70 68 C84 64, 112 68, 124 80 C132 90, 128 104, 118 108 C106 112, 86 100, 70 85" strokeWidth="1.2" />

        {/* Lower wing veins */}
        <path d="M70 72 C56 70, 34 74, 22 84" strokeWidth="0.5" opacity="0.4" />
        <path d="M70 76 C58 76, 38 82, 26 92" strokeWidth="0.4" opacity="0.3" />
        <path d="M70 72 C84 70, 106 74, 118 84" strokeWidth="0.5" opacity="0.4" />
        <path d="M70 76 C82 76, 102 82, 114 92" strokeWidth="0.4" opacity="0.3" />

        {/* Lower wing spots */}
        <circle cx="34" cy="86" r="4" strokeWidth="0.5" />
        <circle cx="34" cy="86" r="1.5" fill="currentColor" opacity="0.4" />
        <circle cx="106" cy="86" r="4" strokeWidth="0.5" />
        <circle cx="106" cy="86" r="1.5" fill="currentColor" opacity="0.4" />

        {/* Lower wing tails */}
        <path d="M22 108 C18 114, 16 120, 20 124" strokeWidth="0.8" />
        <path d="M118 108 C122 114, 124 120, 120 124" strokeWidth="0.8" />

        {/* Legs */}
        <path d="M68 56 C60 62, 52 68, 48 72" strokeWidth="0.5" />
        <path d="M72 56 C80 62, 88 68, 92 72" strokeWidth="0.5" />
        <path d="M68 64 C62 70, 56 76, 52 80" strokeWidth="0.5" />
        <path d="M72 64 C78 70, 84 76, 88 80" strokeWidth="0.5" />
      </svg>
    </Wrapper>
  )
}

/* ═══════════════════════════════════════════════
   BOTANICAL HERB — richer detail
   ═══════════════════════════════════════════════ */

export function BotanicalHerb(props: IllustrationProps) {
  return (
    <Wrapper {...props}>
      <svg width="140" height="220" viewBox="0 0 140 220" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <EngravingDefs />
        {/* Roots — detailed */}
        <path d="M70 210 C68 200, 64 195, 58 190 C52 186, 46 184, 38 186" strokeWidth="0.8" />
        <path d="M70 210 C72 200, 76 195, 82 190 C88 186, 94 184, 102 186" strokeWidth="0.8" />
        <path d="M70 210 C66 202, 60 198, 52 196 C44 195, 36 197, 30 200" strokeWidth="0.6" />
        <path d="M70 210 C74 202, 80 198, 88 196 C96 195, 104 197, 110 200" strokeWidth="0.6" />
        {/* Root hairs */}
        <path d="M38 186 C36 184, 34 186, 32 185" strokeWidth="0.4" opacity="0.5" />
        <path d="M102 186 C104 184, 106 186, 108 185" strokeWidth="0.4" opacity="0.5" />

        {/* Main stem */}
        <path d="M70 190 L70 55" strokeWidth="1.4" />
        <path d="M71 190 L71 55" strokeWidth="0.4" opacity="0.3" />

        {/* Lower leaves — large compound */}
        <path d="M70 170 C56 162, 34 158, 18 168 C14 172, 20 176, 30 174 C42 172, 56 168, 70 170" strokeWidth="1" />
        {/* Leaf veins */}
        <path d="M70 170 L34 164" strokeWidth="0.4" opacity="0.4" />
        <path d="M50 166 L38 160" strokeWidth="0.3" opacity="0.3" />
        <path d="M58 167 L48 162" strokeWidth="0.3" opacity="0.3" />
        {/* Leaf hatching */}
        <path d="M28 170 C34 168, 42 166, 50 166" strokeWidth="0.3" opacity="0.2" />
        <path d="M24 172 C32 170, 40 168, 48 168" strokeWidth="0.3" opacity="0.2" />

        {/* Right lower leaf */}
        <path d="M70 170 C84 162, 106 158, 122 168 C126 172, 120 176, 110 174 C98 172, 84 168, 70 170" strokeWidth="1" />
        <path d="M70 170 L106 164" strokeWidth="0.4" opacity="0.4" />
        <path d="M90 166 L102 160" strokeWidth="0.3" opacity="0.3" />

        {/* Middle leaves */}
        <path d="M70 138 C54 130, 30 128, 16 138 C12 142, 20 144, 32 142 C46 140, 60 137, 70 138" strokeWidth="0.9" />
        <path d="M70 138 L28 134" strokeWidth="0.3" opacity="0.4" />
        <path d="M70 138 C86 130, 110 128, 124 138 C128 142, 120 144, 108 142 C94 140, 80 137, 70 138" strokeWidth="0.9" />
        <path d="M70 138 L112 134" strokeWidth="0.3" opacity="0.4" />

        {/* Upper leaves — smaller */}
        <path d="M70 108 C60 102, 44 100, 34 106 C32 110, 38 112, 48 110 C58 108, 66 106, 70 108" strokeWidth="0.8" />
        <path d="M70 108 C80 102, 96 100, 106 106 C108 110, 102 112, 92 110 C82 108, 74 106, 70 108" strokeWidth="0.8" />

        <path d="M70 82 C64 78, 52 78, 46 82" strokeWidth="0.7" />
        <path d="M70 82 C76 78, 88 78, 94 82" strokeWidth="0.7" />

        {/* Flower head — umbel with detailed florets */}
        <path d="M70 55 C64 44, 54 34, 44 26" strokeWidth="0.7" />
        <path d="M70 55 C66 42, 60 30, 52 20" strokeWidth="0.7" />
        <path d="M70 55 C70 42, 70 28, 70 16" strokeWidth="0.7" />
        <path d="M70 55 C74 42, 80 30, 88 20" strokeWidth="0.7" />
        <path d="M70 55 C76 44, 86 34, 96 26" strokeWidth="0.7" />

        {/* Florets — detailed small flowers */}
        {[
          { cx: 44, cy: 24 },
          { cx: 52, cy: 18 },
          { cx: 70, cy: 14 },
          { cx: 88, cy: 18 },
          { cx: 96, cy: 24 },
        ].map((f, i) => (
          <g key={`fl-${i}`}>
            <circle cx={f.cx} cy={f.cy} r="5" strokeWidth="0.7" />
            {/* Petals */}
            {Array.from({ length: 5 }).map((_, j) => {
              const a = (j * 72 - 90) * Math.PI / 180
              return (
                <ellipse key={j}
                  cx={f.cx + 3.5 * Math.cos(a)}
                  cy={f.cy + 3.5 * Math.sin(a)}
                  rx="2" ry="1"
                  transform={`rotate(${j * 72 - 90} ${f.cx + 3.5 * Math.cos(a)} ${f.cy + 3.5 * Math.sin(a)})`}
                  strokeWidth="0.4"
                />
              )
            })}
            <circle cx={f.cx} cy={f.cy} r="1.5" fill="currentColor" opacity="0.3" />
          </g>
        ))}
      </svg>
    </Wrapper>
  )
}

/* ═══════════════════════════════════════════════
   DECORATIVE BORDER PATTERNS
   (for use inside BookPage frames)
   ═══════════════════════════════════════════════ */

/** Chevron / triangle repeating border (like the Alambique ▲▼▲▼) */
export function ChevronBorder({ width, height = 12, className }: { width: number; height?: number; className?: string }) {
  const triSize = height * 0.7
  const count = Math.floor(width / triSize)
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} style={{ color: 'var(--border-pattern)' }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = i * triSize + triSize / 2
        return (
          <polygon
            key={i}
            points={`${x - triSize / 2},${height} ${x},${height * 0.15} ${x + triSize / 2},${height}`}
            fill="currentColor"
            stroke="none"
          />
        )
      })}
    </svg>
  )
}

/** Greek key / meander border */
export function GreekKeyBorder({ width, height = 10, className }: { width: number; height?: number; className?: string }) {
  const unit = height
  const count = Math.floor(width / (unit * 2))
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} style={{ color: 'var(--border-pattern)' }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = i * unit * 2
        return (
          <path
            key={i}
            d={`M${x} 0 L${x} ${height * 0.7} L${x + unit * 0.7} ${height * 0.7} L${x + unit * 0.7} ${height * 0.3} L${x + unit * 1.3} ${height * 0.3} L${x + unit * 1.3} ${height} L${x + unit * 2} ${height} L${x + unit * 2} 0`}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
          />
        )
      })}
    </svg>
  )
}

/** Ornamental flourish / scrollwork divider */
export function Flourish({ width = 200, className }: { width?: number; className?: string }) {
  return (
    <svg width={width} height="24" viewBox="0 0 200 24" className={className} style={{ color: 'var(--border-pattern)' }} fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round">
      {/* Center ornament */}
      <path d="M100 12 C96 6, 88 4, 84 8 C80 12, 84 16, 90 14 C94 13, 96 12, 100 12" />
      <path d="M100 12 C104 6, 112 4, 116 8 C120 12, 116 16, 110 14 C106 13, 104 12, 100 12" />
      {/* Left scroll */}
      <path d="M84 10 C74 6, 60 4, 46 6 C36 8, 28 12, 20 10 C14 8, 10 6, 4 8" />
      <path d="M4 8 C6 10, 10 12, 16 12" strokeWidth="0.5" />
      {/* Right scroll */}
      <path d="M116 10 C126 6, 140 4, 154 6 C164 8, 172 12, 180 10 C186 8, 190 6, 196 8" />
      <path d="M196 8 C194 10, 190 12, 184 12" strokeWidth="0.5" />
      {/* Center dot */}
      <circle cx="100" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Dotted separator line */
export function DottedRule({ width = 200, className }: { width?: number; className?: string }) {
  const count = Math.floor(width / 4)
  return (
    <svg width={width} height="2" viewBox={`0 0 ${width} 2`} className={className} style={{ color: 'var(--border-pattern)' }}>
      {Array.from({ length: count }).map((_, i) => (
        <circle key={i} cx={i * 4 + 2} cy="1" r="0.5" fill="currentColor" />
      ))}
    </svg>
  )
}

/** Decorative cartouche / title frame */
export function Cartouche({ text, width = 200, className }: { text: string; width?: number; className?: string }) {
  return (
    <svg width={width} height="32" viewBox={`0 0 ${width} 32`} className={className} style={{ color: 'var(--border-pattern)' }} fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round">
      {/* Outer frame with bracket ends */}
      <path d={`M8 4 L${width - 8} 4`} />
      <path d={`M8 28 L${width - 8} 28`} />
      {/* Left bracket */}
      <path d="M8 4 C4 4, 2 8, 2 12 L2 20 C2 24, 4 28, 8 28" />
      {/* Right bracket */}
      <path d={`M${width - 8} 4 C${width - 4} 4, ${width - 2} 8, ${width - 2} 12 L${width - 2} 20 C${width - 2} 24, ${width - 4} 28, ${width - 8} 28`} />
      {/* Dotted line */}
      {Array.from({ length: Math.floor((width - 40) / 4) }).map((_, i) => (
        <circle key={i} cx={20 + i * 4} cy="4" r="0.4" fill="currentColor" stroke="none" />
      ))}
      {Array.from({ length: Math.floor((width - 40) / 4) }).map((_, i) => (
        <circle key={`b-${i}`} cx={20 + i * 4} cy="28" r="0.4" fill="currentColor" stroke="none" />
      ))}
      <text x={width / 2} y="20" textAnchor="middle" fill="currentColor" stroke="none"
        fontSize="9" fontFamily="var(--font-display)" fontWeight="700" letterSpacing="0.15em"
        style={{ textTransform: 'uppercase' } as React.CSSProperties}>
        {text}
      </text>
    </svg>
  )
}

/* Re-export items needed by BookPage that were formerly here */
export { type IllustrationProps }
