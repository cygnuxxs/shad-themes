import { memo } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface ColorPaletteProps {
  colors: string[]
  selectedColor: string | null
  onSelect: (color: string) => void
}

export const ColorPalette = memo(
  ({ colors, selectedColor, onSelect }: ColorPaletteProps) => (
    <div className="space-y-2.5">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Primary Color
      </Label>
      <div className="flex flex-wrap gap-2">
        {colors.map((color, idx) => {
          const isActive = selectedColor === color
          return (
            <button
              key={`${color}-${idx}`}
              onClick={() => onSelect(color)}
              className={cn(
                "relative h-8 w-8 rounded-full border shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                isActive
                  ? "scale-110 ring-2 ring-offset-2 ring-primary"
                  : "opacity-80 hover:scale-110 hover:opacity-100"
              )}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            >
              {isActive && (
                <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow-md">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
)
ColorPalette.displayName = "ColorPalette"
