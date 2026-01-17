import { memo } from "react"
import { ThemeType } from "@/lib/color-engine"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Kbd } from "@/components/ui/kbd"

const THEME_STYLES: { id: ThemeType; label: string; kbd: string }[] = [
  { id: "standard", label: "Standard", kbd: "S" },
  { id: "vivid", label: "Vivid", kbd: "V" },
  { id: "minimal", label: "Minimal", kbd: "M" },
  { id: "professional", label: "Pro", kbd: "P" },
]

interface StyleSelectorProps {
  selectedStrategy: ThemeType
  selectedColor: string | null
  onSelect: (id: ThemeType) => void
}

export const StyleSelector = memo(
  ({ selectedStrategy, selectedColor, onSelect }: StyleSelectorProps) => (
    <div className="space-y-2.5">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Style
      </Label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 md:grid-cols-2">
        {THEME_STYLES.map((style) => {
          const isActive = selectedStrategy === style.id
          return (
            <Button
              key={style.id}
              onClick={() => onSelect(style.id)}
              variant="outline"
              size="sm"
              className={cn(
                "relative flex h-auto items-center justify-between gap-1 px-2 py-2 text-xs font-medium transition-all sm:px-3",
                isActive
                  ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                  : "bg-background hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center min-w-0">
                <div
                  className={cn(
                    "mr-1.5 h-2 w-2 shrink-0 rounded-full sm:mr-2 transition-opacity",
                    isActive ? "opacity-100" : "opacity-30"
                  )}
                  style={{ backgroundColor: selectedColor || "currentColor" }}
                />
                <span className="truncate">{style.label}</span>
              </div>
              <Kbd className="ml-auto shrink-0">{style.kbd}</Kbd>
            </Button>
          )
        })}
      </div>
    </div>
  )
)
StyleSelector.displayName = "StyleSelector"

export { THEME_STYLES }
