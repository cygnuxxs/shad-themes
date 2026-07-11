import { memo, useCallback } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Droplets } from "lucide-react"

interface IntensitySliderProps {
  value: number
  onChange: (value: number) => void
}

/** Min/max multiplier range — 0.1× (near-gray) to 3× (hyper-saturated) */
const MIN = 0.1
const MAX = 3.0
const STEP = 0.05
const DEFAULT = 1.0

function intensityLabel(v: number): string {
  if (v < 0.4) return "Washed"
  if (v < 0.7) return "Muted"
  if (v < 0.9) return "Soft"
  if (v <= 1.1) return "Natural"
  if (v <= 1.5) return "Vivid"
  if (v <= 2.0) return "Intense"
  return "Hyper"
}

export const IntensitySlider = memo(({ value, onChange }: IntensitySliderProps) => {
  const handleChange = useCallback(
    (vals: number[]) => onChange(vals[0]),
    [onChange]
  )

  const handleReset = useCallback(() => onChange(DEFAULT), [onChange])

  const pct = ((value - MIN) / (MAX - MIN)) * 100

  return (
    <div className="space-y-2.5 pt-1 border-t border-border/50">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Droplets className="h-3 w-3" />
          Color Intensity
        </Label>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-primary bg-primary/10 rounded px-1.5 py-0.5">
            {intensityLabel(value)}
          </span>
          <button
            onClick={handleReset}
            title="Reset to natural (1×)"
            className="text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors tabular-nums"
          >
            {value.toFixed(2)}×
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Gradient track background hint */}
        <div
          className="absolute inset-y-0 left-0 right-0 flex items-center pointer-events-none"
          aria-hidden
        >
          <div className="h-1.5 w-full rounded-full opacity-20"
            style={{
              background: "linear-gradient(to right, oklch(0.7 0 0), oklch(0.55 var(--primary-c, 0.15) var(--primary-h, 260)), oklch(0.5 0.35 var(--primary-h, 260)))"
            }}
          />
        </div>

        <Slider
          min={MIN}
          max={MAX}
          step={STEP}
          value={[value]}
          onValueChange={handleChange}
          aria-label="Color intensity"
          className="relative z-10"
        />
      </div>

      {/* Scale markers */}
      <div className="flex justify-between text-[9px] text-muted-foreground/60 font-mono px-0.5 select-none">
        <span>Muted</span>
        <span
          className="cursor-pointer hover:text-muted-foreground transition-colors"
          onClick={handleReset}
          title="Reset to 1×"
        >
          1×
        </span>
        <span>Hyper</span>
      </div>
    </div>
  )
})
IntensitySlider.displayName = "IntensitySlider"
