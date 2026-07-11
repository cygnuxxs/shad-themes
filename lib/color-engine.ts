import { extractColors } from "extract-colors";

// ─── Public Types ────────────────────────────────────────────────────────────

export type ThemeType = "standard" | "vivid" | "minimal" | "professional";

/** A single color extracted from an image, with all representations. */
export interface ExtractedColor {
  /** OKLCH CSS string, e.g. "oklch(0.55 0.14 260.000)" */
  oklch: string;
  /** sRGB hex string, e.g. "#4a6ef5" */
  hex: string;
  /** Raw channel values 0–255 */
  r: number;
  g: number;
  b: number;
  /** Human-readable hue name, e.g. "Indigo", "Coral" */
  label: string;
}

// ─── Internal Types ──────────────────────────────────────────────────────────

interface OklchColor {
  l: number;
  c: number;
  h: number;
}

interface ThemeStrategyConfig {
  name: ThemeType;
  chromaScale: number;
  lightnessOffset: number;
  /** Hue offset for the accent relative to primary (degrees) */
  accentHueShift: number;
  cardSaturation: number;
  /** Chart hue scheme to use */
  chartScheme: "analogous" | "triadic" | "split-complementary";
}

// ─── Strategy Definitions ────────────────────────────────────────────────────

const STRATEGIES: Record<ThemeType, ThemeStrategyConfig> = {
  standard: {
    name: "standard",
    chromaScale: 1,
    lightnessOffset: 0,
    accentHueShift: 30,           // Slight analogous shift
    cardSaturation: 0.01,
    chartScheme: "analogous",
  },
  vivid: {
    name: "vivid",
    chromaScale: 1.3,
    lightnessOffset: 0,
    accentHueShift: 60,           // Split-complementary — pops against primary
    cardSaturation: 0.02,
    chartScheme: "split-complementary",
  },
  minimal: {
    name: "minimal",
    chromaScale: 0.6,
    lightnessOffset: 0.1,
    accentHueShift: 0,            // Same hue family — keep muted
    cardSaturation: 0,
    chartScheme: "analogous",
  },
  professional: {
    name: "professional",
    chromaScale: 0.9,
    lightnessOffset: -0.05,
    accentHueShift: 180,          // True complementary — authoritative contrast
    cardSaturation: 0.02,
    chartScheme: "triadic",
  },
};

// ─── Hue → Color Name ────────────────────────────────────────────────────────

/**
 * Maps an OKLCH hue angle (0–360) to a human-readable color name.
 * Uses the standard color wheel with extra detail in warm tones.
 */
function hueToLabel(h: number, chroma: number): string {
  if (chroma < 0.015) return "Gray";
  const hue = ((h % 360) + 360) % 360;
  if (hue < 15)   return "Red";
  if (hue < 35)   return "Red-Orange";
  if (hue < 50)   return "Orange";
  if (hue < 65)   return "Amber";
  if (hue < 85)   return "Yellow";
  if (hue < 115)  return "Yellow-Green";
  if (hue < 145)  return "Green";
  if (hue < 165)  return "Emerald";
  if (hue < 195)  return "Teal";
  if (hue < 220)  return "Cyan";
  if (hue < 245)  return "Sky";
  if (hue < 265)  return "Blue";
  if (hue < 285)  return "Indigo";
  if (hue < 305)  return "Violet";
  if (hue < 325)  return "Purple";
  if (hue < 345)  return "Pink";
  return "Red";
}

// ─── Color Theory: Chart Palette Schemes ─────────────────────────────────────

/**
 * Returns 5 hue offsets (in degrees) from the base hue
 * following the given color-theory scheme.
 */
function chartHueOffsets(scheme: ThemeStrategyConfig["chartScheme"]): number[] {
  switch (scheme) {
    case "triadic":
      // 0°, 120°, 240°, then fill gaps with intermediates
      return [0, 120, 240, 60, 180];
    case "split-complementary":
      // 0°, 150°, 210°, 30°, 330°
      return [0, 150, 210, 30, 330];
    case "analogous":
    default:
      // 0°, +30°, +60°, −30°, −60°
      return [0, 30, 60, -30, -60];
  }
}

// ─── ColorEngine Class ───────────────────────────────────────────────────────

export class ColorEngine {
  constructor(private readonly src: string) {}

  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * Extracts dominant colors from the image and returns structured `ExtractedColor` objects,
   * deduplicated by hue bucket and sorted by visual prominence.
   */
  public async extractColors(): Promise<ExtractedColor[]> {
    try {
      const palette = await extractColors(this.src);

      const raw = palette
        .sort((a, b) => b.area - a.area)
        .map((s) => this.buildExtractedColor(s.red, s.green, s.blue));

      return this.deduplicateColors(raw);
    } catch {
      // No fallback — return empty so the UI can handle it gracefully
      return [];
    }
  }

  /**
   * Generates all 4 theme CSS strings from a given OKLCH base color string.
   * @param chromaMultiplier - Optional intensity override (0 = gray, 1 = exact, 2 = double saturation).
   */
  public generateThemes(
    baseColor: string,
    chromaMultiplier = 1
  ): Record<ThemeType, string> {
    return {
      standard:     this.createTheme(baseColor, STRATEGIES.standard,     chromaMultiplier),
      vivid:        this.createTheme(baseColor, STRATEGIES.vivid,         chromaMultiplier),
      minimal:      this.createTheme(baseColor, STRATEGIES.minimal,       chromaMultiplier),
      professional: this.createTheme(baseColor, STRATEGIES.professional,  chromaMultiplier),
    };
  }

  // ── Color Building ─────────────────────────────────────────────────────────

  /**
   * Converts an sRGB triplet (0–255) to a full `ExtractedColor` object.
   */
  private buildExtractedColor(r: number, g: number, b: number): ExtractedColor {
    const { L, C, H } = this.rgbToOklchValues(r, g, b);
    const oklch = this.formatOklch(L, C, H);
    const hex = this.rgbToHex(r, g, b);
    const label = hueToLabel(H, C);
    return { oklch, hex, r, g, b, label };
  }

  // ── Theme Generation ───────────────────────────────────────────────────────

  private createTheme(
    baseColor: string,
    strategy: ThemeStrategyConfig,
    chromaMultiplier = 1
  ): string {
    const base = this.parseOklch(baseColor);

    // Treat as achromatic only if truly gray (very low chroma)
    const isAchromatic = base.c < 0.012;

    const primaryHue = isAchromatic ? 0 : base.h;
    const accentHue  = isAchromatic
      ? 0
      : (primaryHue + strategy.accentHueShift) % 360;

    // Use the EXACT extracted chroma — scaled by strategy + user intensity slider
    const primaryChroma = isAchromatic
      ? 0
      : clamp(0, 0.40, base.c * strategy.chromaScale * chromaMultiplier);

    // Tinted neutrals — warm/cool grays derived from the base hue
    const neutralChroma = isAchromatic
      ? 0
      : Math.min(base.c * 0.2, 0.015);

    const neutralHue = strategy.name === "minimal" ? 0 : primaryHue;

    // ── Light & Dark primaries ─────────────────────────────────────────────
    // Use the exact extracted lightness (base.l), only apply the strategy offset
    const lightPrimary: OklchColor = {
      l: clamp(0.30, 0.80, base.l + strategy.lightnessOffset),
      c: primaryChroma,
      h: primaryHue,
    };
    const darkPrimary: OklchColor = {
      // In dark mode, lift lightness slightly so the color pops on a dark bg
      l: clamp(0.50, 0.85, base.l + 0.08 + strategy.lightnessOffset),
      c: primaryChroma * 0.92,
      h: primaryHue,
    };

    // ── Accent chroma — slightly boosted over primary ────────────────────
    const accentChroma = isAchromatic
      ? 0
      : clamp(0, 0.40, primaryChroma * 1.1);

    // ── Light palette ──────────────────────────────────────────────────────
    const lightVals: Record<string, OklchColor> = {
      bg:          { l: 0.97,  c: neutralChroma * 0.1,  h: neutralHue },
      card:        { l: 1.00,  c: neutralChroma * 0.25, h: neutralHue },
      popover:     { l: 0.99,  c: isAchromatic ? 0 : strategy.cardSaturation, h: neutralHue },
      muted:       { l: 0.94,  c: neutralChroma * 0.5,  h: neutralHue },
      border:      { l: 0.87,  c: neutralChroma * 0.1,  h: neutralHue },
      input:       { l: 0.87,  c: neutralChroma * 2,    h: neutralHue },
      primary:     lightPrimary,
      secondary:   { l: 0.95,  c: primaryChroma * 0.1,  h: neutralHue },
      accent:      { l: 0.88,  c: accentChroma * 0.15,  h: accentHue },
      destructive: { l: 0.55,  c: 0.22, h: 25 },
      ring:        { ...lightPrimary },
    };

    // ── Dark palette ───────────────────────────────────────────────────────
    const darkVals: Record<string, OklchColor> = {
      bg:          { l: 0.09,  c: neutralChroma * 1.5,  h: neutralHue },
      card:        { l: 0.13,  c: neutralChroma * 0.1,  h: neutralHue },
      popover:     { l: 0.13,  c: isAchromatic ? 0 : strategy.cardSaturation, h: neutralHue },
      muted:       { l: 0.20,  c: neutralChroma * 1.5,  h: neutralHue },
      border:      { l: 0.26,  c: neutralChroma * 0.1,  h: neutralHue },
      input:       { l: 0.32,  c: neutralChroma * 0.05, h: neutralHue },
      primary:     darkPrimary,
      secondary:   { l: 0.22,  c: primaryChroma * 0.3,  h: primaryHue },
      accent:      { l: 0.28,  c: accentChroma * 0.6,   h: accentHue },
      destructive: { l: 0.50,  c: 0.22, h: 25 },
      ring:        { ...darkPrimary },
    };

    const p = (c: OklchColor) =>
      `oklch(${c.l.toFixed(3)} ${c.c.toFixed(3)} ${c.h.toFixed(2)})`;

    const getFg = (bg: OklchColor) =>
      bg.l > 0.60
        ? `oklch(0.14 ${neutralChroma.toFixed(4)} ${neutralHue.toFixed(2)})`
        : `oklch(0.98 ${neutralChroma.toFixed(4)} ${neutralHue.toFixed(2)})`;

    const chartLight = this.generateChartColors(lightPrimary, false, strategy.chartScheme);
    const chartDark  = this.generateChartColors(darkPrimary,  true,  strategy.chartScheme);

    return `
:root {
  --background: ${p(lightVals.bg)};
  --foreground: ${getFg(lightVals.bg)};
  --card: ${p(lightVals.card)};
  --card-foreground: ${getFg(lightVals.card)};
  --popover: ${p(lightVals.popover)};
  --popover-foreground: ${getFg(lightVals.popover)};
  --primary: ${p(lightVals.primary)};
  --primary-foreground: ${getFg(lightVals.primary)};
  --secondary: ${p(lightVals.secondary)};
  --secondary-foreground: ${getFg(lightVals.secondary)};
  --muted: ${p(lightVals.muted)};
  --muted-foreground: oklch(0.40 ${neutralChroma.toFixed(4)} ${neutralHue.toFixed(2)});
  --accent: ${p(lightVals.accent)};
  --accent-foreground: ${getFg(lightVals.accent)};
  --destructive: ${p(lightVals.destructive)};
  --destructive-foreground: oklch(0.98 0 0);
  --border: ${p(lightVals.border)};
  --input: ${p(lightVals.input)};
  --ring: ${p(lightVals.ring)};
  --radius: 0.5rem;
  --sidebar: ${p(lightVals.bg)};
  --sidebar-foreground: ${getFg(lightVals.bg)};
  --sidebar-primary: ${p(lightVals.primary)};
  --sidebar-primary-foreground: ${getFg(lightVals.primary)};
  --sidebar-accent: ${p(lightVals.muted)};
  --sidebar-accent-foreground: ${getFg(lightVals.muted)};
  --sidebar-border: ${p(lightVals.border)};
  --sidebar-ring: ${p(lightVals.ring)};
${chartLight}
}

.dark {
  --background: ${p(darkVals.bg)};
  --foreground: ${getFg(darkVals.bg)};
  --card: ${p(darkVals.card)};
  --card-foreground: ${getFg(darkVals.card)};
  --popover: ${p(darkVals.popover)};
  --popover-foreground: ${getFg(darkVals.popover)};
  --primary: ${p(darkVals.primary)};
  --primary-foreground: ${getFg(darkVals.primary)};
  --secondary: ${p(darkVals.secondary)};
  --secondary-foreground: ${getFg(darkVals.secondary)};
  --muted: ${p(darkVals.muted)};
  --muted-foreground: oklch(0.70 ${neutralChroma.toFixed(4)} ${neutralHue.toFixed(2)});
  --accent: ${p(darkVals.accent)};
  --accent-foreground: ${getFg(darkVals.accent)};
  --destructive: ${p(darkVals.destructive)};
  --destructive-foreground: oklch(0.98 0 0);
  --border: ${p(darkVals.border)};
  --input: ${p(darkVals.input)};
  --ring: ${p(darkVals.ring)};
  --sidebar: ${p(darkVals.bg)};
  --sidebar-foreground: ${getFg(darkVals.bg)};
  --sidebar-primary: ${p(darkVals.primary)};
  --sidebar-primary-foreground: ${getFg(darkVals.primary)};
  --sidebar-accent: ${p(darkVals.muted)};
  --sidebar-accent-foreground: ${getFg(darkVals.muted)};
  --sidebar-border: ${p(darkVals.border)};
  --sidebar-ring: ${p(darkVals.ring)};
${chartDark}
}`.trim();
  }

  // ── Chart Color Generation ─────────────────────────────────────────────────

  /**
   * Generates 5 chart colors using a proper color-theory scheme.
   * Achromatic palettes fall back to lightness steps.
   */
  private generateChartColors(
    primary: OklchColor,
    isDark: boolean,
    scheme: ThemeStrategyConfig["chartScheme"]
  ): string {
    const isAchromatic = primary.c < 0.02;
    const offsets = chartHueOffsets(scheme);

    return offsets
      .map((offset, i) => {
        let l: number, c: number, h: number;

        if (isAchromatic) {
          // Luminance-stepped grays
          l = isDark ? 0.30 + i * 0.12 : 0.80 - i * 0.12;
          c = 0;
          h = 0;
        } else {
          // Place colors at perceptually good lightness for readability
          if (isDark) {
            l = clamp(0.50, 0.80, 0.60 + i * 0.04);
            // Desaturate progressively to prevent neon clash in charts
            c = clamp(0.06, 0.30, primary.c * (1 - i * 0.06));
          } else {
            l = clamp(0.35, 0.70, 0.55 - i * 0.04);
            c = clamp(0.06, 0.30, primary.c);
          }
          h = ((primary.h + offset) % 360 + 360) % 360;
        }

        return `  --chart-${i + 1}: oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(2)});`;
      })
      .join("\n");
  }

  // ── Conversions ────────────────────────────────────────────────────────────

  /**
   * Converts sRGB (0–255) to OKLCH channel values (no string formatting).
   */
  private rgbToOklchValues(r: number, g: number, b: number): { L: number; C: number; H: number } {
    const toLinear = (v: number) => {
      v /= 255;
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };

    const lr = toLinear(r);
    const lg = toLinear(g);
    const lb = toLinear(b);

    // XYZ-D65 → OKLab (Björn Ottosson's matrix)
    const l_ = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
    const m_ = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
    const s_ = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

    const L =  0.2104542553 * l_ + 0.793617785  * m_ - 0.0040720468 * s_;
    const A =  1.9779984951 * l_ - 2.428592205  * m_ + 0.4505937099 * s_;
    const B =  0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766  * s_;

    const C = Math.hypot(A, B);
    const H = (((Math.atan2(B, A) * 180) / Math.PI) % 360 + 360) % 360;

    return { L, C, H };
  }

  /**
   * Converts sRGB (0–255) to an OKLCH CSS string.
   */
  private formatOklch(L: number, C: number, H: number): string {
    return `oklch(${L.toFixed(3)} ${clamp(0, 0.35, C).toFixed(3)} ${H.toFixed(2)})`;
  }

  /**
   * Converts sRGB (0–255) to a lowercase hex string, e.g. "#4a6ef5".
   */
  private rgbToHex(r: number, g: number, b: number): string {
    return (
      "#" +
      [r, g, b]
        .map((v) => Math.round(clamp(0, 255, v)).toString(16).padStart(2, "0"))
        .join("")
    );
  }

  /**
   * Parses an OKLCH CSS string back to channel values.
   */
  private parseOklch(color: string): OklchColor {
    const m = color.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
    return m ? { l: +m[1], c: +m[2], h: +m[3] } : { l: 0.55, c: 0.14, h: 260 };
  }

  // ── Deduplication ──────────────────────────────────────────────────────────

  /**
   * Removes perceptually similar colors by grouping into 20° hue buckets.
   * Returns at most 5 colors, ordered by prominence.
   */
  private deduplicateColors(colors: ExtractedColor[]): ExtractedColor[] {
    const seen = new Set<number>();
    return colors
      .filter((ec) => {
        const { H } = this.rgbToOklchValues(ec.r, ec.g, ec.b);
        const bucket = Math.round(H / 20) * 20;
        if (seen.has(bucket)) return false;
        seen.add(bucket);
        return true;
      })
      .slice(0, 5);
  }
  // ── Public Color Parsing ──────────────────────────────────────────────────

  /**
   * Parses a user-entered color string into an ExtractedColor.
   * Accepts: `#rrggbb`, `#rgb`, `rgb(r,g,b)`, `rgb(r g b)`, `oklch(L C H)`.
   * Returns `null` if the input is not a valid color.
   */
  public parseColorInput(input: string): ExtractedColor | null {
    const s = input.trim();

    // ── Hex: #rgb or #rrggbb ─────────────────────────────────────────────
    const hexMatch = s.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
    if (hexMatch) {
      let hex = hexMatch[1];
      if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return this.buildExtractedColor(r, g, b);
    }

    // ── RGB: rgb(r, g, b) or rgb(r g b) ─────────────────────────────────
    const rgbMatch = s.match(/^rgb\(\s*(\d{1,3})[,\s]\s*(\d{1,3})[,\s]\s*(\d{1,3})\s*\)$/i);
    if (rgbMatch) {
      const r = clamp(0, 255, parseInt(rgbMatch[1]));
      const g = clamp(0, 255, parseInt(rgbMatch[2]));
      const b = clamp(0, 255, parseInt(rgbMatch[3]));
      return this.buildExtractedColor(r, g, b);
    }

    // ── OKLCH: oklch(L C H) — L may be % ────────────────────────────────
    const oklchMatch = s.match(/^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)/i);
    if (oklchMatch) {
      let L = parseFloat(oklchMatch[1]);
      if (oklchMatch[1].endsWith("%")) L /= 100;
      const C = parseFloat(oklchMatch[2]);
      const H = parseFloat(oklchMatch[3]);
      if (isNaN(L) || isNaN(C) || isNaN(H)) return null;
      const { r, g, b } = this.oklchToRgb(L, C, H);
      return this.buildExtractedColor(r, g, b);
    }

    return null;
  }

  /**
   * Converts OKLCH → linear sRGB (0–255), clamped.
   * Uses Björn Ottosson's inverse OKLab matrix.
   */
  private oklchToRgb(L: number, C: number, H: number): { r: number; g: number; b: number } {
    const h = (H * Math.PI) / 180;
    const a = C * Math.cos(h);
    const b = C * Math.sin(h);

    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

    const lc = l_ * l_ * l_;
    const mc = m_ * m_ * m_;
    const sc = s_ * s_ * s_;

    const lr =  4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc;
    const lg = -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc;
    const lb = -0.0041960863 * lc - 0.7034186147 * mc + 1.7076147010 * sc;

    const toSRGB = (v: number) => {
      const g = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(Math.max(0, v), 1 / 2.4) - 0.055;
      return Math.round(clamp(0, 1, g) * 255);
    };

    return { r: toSRGB(lr), g: toSRGB(lg), b: toSRGB(lb) };
  }
}

// ─── Standalone Utility ───────────────────────────────────────────────────────

/** Pure clamp — avoids the need for a `Math` prototype extension. */
function clamp(min: number, max: number, value: number): number {
  return Math.min(max, Math.max(min, value));
}