import { memo } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { ExtractedColor } from "@/lib/color-engine"

interface ColorPaletteProps {
  colors: ExtractedColor[]
  selectedColor: ExtractedColor | null
  onSelect: (color: ExtractedColor) => void
}

export const ColorPalette = memo(
  ({ colors, selectedColor, onSelect }: ColorPaletteProps) => (
    <div className="space-y-2.5">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Extracted Colors
      </Label>

      <div className="flex flex-col gap-2">
        {colors.map((ec, idx) => {
          const isActive = selectedColor?.oklch === ec.oklch
          return (
            <button
              key={`${ec.oklch}-${idx}`}
              onClick={() => onSelect(ec)}
              title={`${ec.label} — ${ec.hex}\n${ec.oklch}`}
              className={cn(
                "group flex items-center gap-2.5 rounded-lg border px-2.5 py-1.5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive
                  ? "border-primary bg-primary/8 shadow-sm"
                  : "border-transparent bg-muted/40 hover:border-border hover:bg-muted/70"
              )}
              aria-label={`Select ${ec.label} (${ec.hex})`}
              aria-pressed={isActive}
            >
              {/* Swatch */}
              <span
                className={cn(
                  "relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border shadow-sm transition-transform",
                  isActive ? "scale-110 ring-2 ring-primary ring-offset-2" : "group-hover:scale-105"
                )}
                style={{ backgroundColor: ec.oklch }}
              >
                {isActive && (
                  <Check
                    className="h-3.5 w-3.5"
                    strokeWidth={3.5}
                    style={{ color: "white", mixBlendMode: "difference" }}
                  />
                )}
              </span>

              {/* Labels */}
              <div className="min-w-0 flex-1">
                <p className={cn(
                  "text-xs font-semibold leading-tight truncate",
                  isActive ? "text-primary" : "text-foreground"
                )}>
                  {ec.label}
                </p>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">
                  {ec.hex}
                </p>
              </div>

              {/* Active indicator dot */}
              {isActive && (
                <span
                  className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: ec.oklch }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
)
ColorPalette.displayName = "ColorPalette"
