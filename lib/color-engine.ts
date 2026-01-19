import { extractColors } from "extract-colors";

export type ThemeType = "standard" | "vivid" | "minimal" | "professional";

interface ThemeStrategyConfig {
  name: ThemeType;
  chromaScale: number;
  lightnessOffset: number;
  useComplementary: boolean;
  cardSaturation: number;
}

interface OklchColor {
  l: number;
  c: number;
  h: number;
}

const strategies: Record<ThemeType, ThemeStrategyConfig> = {
  standard: {
    name: "standard",
    chromaScale: 1,
    lightnessOffset: 0,
    useComplementary: false,
    cardSaturation: 0.01,
  },
  vivid: {
    name: "vivid",
    chromaScale: 1.3, // Bumped slightly for better separation
    lightnessOffset: 0,
    useComplementary: false,
    cardSaturation: 0.02,
  },
  minimal: {
    name: "minimal",
    chromaScale: 0.6, // Minimal shouldn't be zero, just muted
    lightnessOffset: 0.1,
    useComplementary: false,
    cardSaturation: 0,
  },
  professional: {
    name: "professional",
    chromaScale: 0.9,
    lightnessOffset: -0.05,
    useComplementary: false,
    cardSaturation: 0.02,
  },
};

export class ColorEngine {
  constructor(private readonly src: string) {}

  public async extractColors(): Promise<string[]> {
    try {
      const palette = await extractColors(this.src);
      // Sort by area (prominence) first, then saturation
      const colors = palette
        .sort((a, b) => b.area - a.area)
        .map((s) => this.rgbToOklchString(s.red, s.green, s.blue));

      return this.deduplicateColors(colors);
    } catch {
      return ["oklch(0.55 0.14 260)"];
    }
  }

  public generateThemes(baseColor: string): Record<ThemeType, string> {
    return {
      standard: this.createTheme(baseColor, strategies.standard),
      vivid: this.createTheme(baseColor, strategies.vivid),
      minimal: this.createTheme(baseColor, strategies.minimal),
      professional: this.createTheme(baseColor, strategies.professional),
    };
  }

  private generateChartColors(
    inputColor: OklchColor,
    isDark: boolean
  ): string {
    const steps: string[] = [];
    const isAchromatic = inputColor.c < 0.02;

    for (let i = 0; i < 5; i++) {
      let l: number, c: number, h: number;

      // Dynamic Logic:
      // If achromatic, use luminance steps.
      // If chromatic, rotate hue and maintain distinctiveness.
      if (isAchromatic) {
        h = 0;
        c = 0;
        l = isDark ? 0.3 + i * 0.12 : 0.8 - i * 0.12;
      } else {
        if (isDark) {
          l = 0.55 + i * 0.06; // Brighter charts on dark bg
          // Slightly desaturate successive chart colors to prevent neon-clash
          c = Math.max(0.08, inputColor.c * (1 - i * 0.05));
        } else {
          l = 0.55 - i * 0.06; // Darker charts on light bg
          c = Math.max(0.08, inputColor.c);
        }
        // Analogous palette usually looks better for charts than rotating too far
        h = (inputColor.h + i * 30) % 360;
      }

      steps.push(
        `  --chart-${i + 1}: oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(3)});`
      );
    }
    return steps.join("\n");
  }

  private createTheme(
    baseColor: string,
    strategy: ThemeStrategyConfig
  ): string {
    const base = this.parseOklch(baseColor);

    // 1. Noise Floor: Only treat as "Dead Gray" if strictly below 0.012
    const isAchromatic = base.c < 0.012;

    // 2. Hue Preservation: Even low chroma colors (0.02) have a hue (warm/cool). Keep it.
    const primaryHue = isAchromatic ? 0 : base.h;

    // 3. Accent Strategy
    const accentHue =
      strategy.name === "vivid" || isAchromatic
        ? primaryHue
        : strategy.useComplementary
        ? (primaryHue + 180) % 360
        : (primaryHue + 30) % 360; // Default to slight analogous shift for interest

    // 4. Chroma Optimization (The "Fix")
    // If base.c is 0.03 (Low Chroma), we bump Primary to ~0.11 so it looks like a color.
    // If base.c is 0.20 (High Chroma), we keep it around 0.20.
    const safePrimaryChroma = isAchromatic
        ? 0
        : Math.max(base.c, 0.11) * strategy.chromaScale;

    // 5. Tinted Neutrals
    // Instead of 0 chroma, we take a fraction (1/5th) of the base chroma.
    // This creates "Warm Grays" or "Cool Grays" automatically.
    const neutralChroma = isAchromatic
        ? 0
        : Math.min(base.c * 0.2, 0.015); // Cap at 0.015 to prevent colored backgrounds

    const neutralHue = strategy.name === "minimal" ? 0 : primaryHue;

    const lightPrimary = {
      l: Math.clamp(0.45, 0.65, 0.55 + strategy.lightnessOffset),
      c: safePrimaryChroma,
      h: primaryHue,
    };

    const darkPrimary = {
      l: Math.clamp(0.55, 0.75, 0.63 + strategy.lightnessOffset),
      c: safePrimaryChroma * 0.9, // Slightly less chroma in dark mode to reduce eye strain
      h: primaryHue,
    };

    // Calculate Accent separately to ensure it pops against Primary
    const accentChroma = isAchromatic ? 0 : Math.max(safePrimaryChroma, 0.12);

    const lightVals: Record<string, OklchColor> = {
      bg: { l: 0.96, c: neutralChroma * 0.15, h: neutralHue },
      card: {
        l: 1,
        c: neutralChroma * 0.3,
        h: neutralHue,
      },
      popover: {
        l: 0.99,
        c: isAchromatic ? 0 : strategy.cardSaturation,
        h: neutralHue,
      },
      muted: { l: 0.94, c: neutralChroma * 0.5, h: neutralHue }, // Slightly more tinted
      border: { l: 0.87, c: neutralChroma * 0.1, h: neutralHue },
      input: { l: 0.87, c: neutralChroma * 2, h: neutralHue },
      primary: lightPrimary,
      secondary: { l: 0.95, c: safePrimaryChroma * 0.1, h: neutralHue }, // Tinted secondary
      accent: {
        l: 0.9,
        c: safePrimaryChroma * 0.08,
        h: neutralHue,
      },
      destructive: { l: 0.55, c: 0.22, h: 25 },
      ring: {
        l: lightPrimary.l,
        c: lightPrimary.c,
        h: lightPrimary.h,
      },
    };

    const darkVals: Record<string, OklchColor> = {
      bg: { l: 0.09, c: neutralChroma * 2, h: neutralHue },
      card: { l: 0.20, c: neutralChroma * 0.1, h: neutralHue },
      popover: {
        l: 0.13,
        c: isAchromatic ? 0 : strategy.cardSaturation,
        h: neutralHue,
      },
      muted: { l: 0.20, c: neutralChroma * 2, h: neutralHue },
      border: { l: 0.26, c: neutralChroma * 0.1, h: neutralHue },
      input: { l: 0.4, c: neutralChroma * 0.05, h: neutralHue },
      primary: darkPrimary,
      secondary: { l: 0.22, c: safePrimaryChroma * 0.3, h: primaryHue },
      accent: {
        l: 0.25,
        c: accentChroma * 0.5,
        h: accentHue,
      },
      destructive: { l: 0.45, c: 0.22, h: 25 },
      ring: {
        l: darkPrimary.l,
        c: darkPrimary.c,
        h: darkPrimary.h,
      },
    };

    const p = (c: OklchColor) =>
      `oklch(${c.l.toFixed(3)} ${c.c.toFixed(3)} ${c.h.toFixed(3)})`;

    // Optimized Foreground Contrast
    const getFg = (bg: OklchColor) =>
      bg.l > 0.70 ? `oklch(0.14 ${neutralChroma.toFixed(3)} ${neutralHue.toFixed(3)})` : `oklch(0.98 ${neutralChroma.toFixed(3)} ${neutralHue.toFixed(3)})`;

    const chartLight = this.generateChartColors(lightVals.primary, false);
    const chartDark = this.generateChartColors(darkVals.primary, true);

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
  --muted-foreground: oklch(0.40 ${neutralChroma} ${neutralHue});
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
  --muted-foreground: oklch(0.70 ${neutralChroma} ${neutralHue});
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
}
`.trim();
  }

  private parseOklch(color: string): OklchColor {
    const m = color.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
    return m ? { l: +m[1], c: +m[2], h: +m[3] } : { l: 0.5, c: 0.1, h: 0 };
  }

  private oklch(l: number, c: number, h: number): string {
    // Sanity clamp on chroma to prevent neon artifacts
    return `oklch(${l.toFixed(3)} ${Math.min(c, 0.35).toFixed(3)} ${h.toFixed(
      2
    )})`;
  }

  private deduplicateColors(colors: string[]): string[] {
    const seen = new Set<number>();
    return colors
      .filter((c) => {
        // Group broadly by hue bucket to ensure variety
        const h = this.parseOklch(c).h;
        const bucket = Math.round(h / 15) * 15;
        if (seen.has(bucket)) return false;
        seen.add(bucket);
        return true;
      })
      .slice(0, 5);
  }

  private rgbToOklchString(r: number, g: number, b: number): string {
    const toLinear = (c: number) => {
      c /= 255;
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };

    const lr = toLinear(r);
    const lg = toLinear(g);
    const lb = toLinear(b);

    const l = Math.cbrt(
      0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
    );
    const m = Math.cbrt(
      0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
    );
    const s = Math.cbrt(
      0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb
    );

    const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
    const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
    const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

    const C = Math.hypot(A, B);
    const H = (Math.atan2(B, A) * 180) / Math.PI + 360;

    return this.oklch(L, C, H % 360);
  }
}
declare global {
  interface Math {
    clamp(min: number, max: number, value: number): number;
  }
}

Math.clamp = (min: number, max: number, value: number) =>
  Math.min(max, Math.max(min, value));