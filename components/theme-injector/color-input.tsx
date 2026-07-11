"use client"

import {
  useState,
  useRef,
  useCallback,
  useTransition,
  type ChangeEvent,
  type KeyboardEvent,
} from "react"
import { Check, X, Plus, Hash, Blend, Sliders } from "lucide-react"
import { cn } from "@/lib/utils"
import { ColorEngine, ExtractedColor } from "@/lib/color-engine"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface ColorInputProps {
  engine: ColorEngine
  onAdd: (color: ExtractedColor) => void
}

type ValidationState = "idle" | "valid" | "invalid"
type FormatTab = "hex" | "rgb" | "oklch"

// ── Per-format config ─────────────────────────────────────────────────────────

const FORMAT_CONFIG: Record<
  FormatTab,
  { label: string; icon: React.ReactNode; placeholder: string; hint: string }
> = {
  hex: {
    label: "HEX",
    icon: <Hash className="h-3 w-3" />,
    placeholder: "#e63946",
    hint: "3 or 6 hex digits, e.g. #abc or #aabbcc",
  },
  rgb: {
    label: "RGB",
    icon: <Blend className="h-3 w-3" />,
    placeholder: "rgb(72, 149, 239)",
    hint: "Comma or space separated, values 0–255",
  },
  oklch: {
    label: "OKLCH",
    icon: <Sliders className="h-3 w-3" />,
    placeholder: "oklch(0.65 0.18 240)",
    hint: "L: 0–1, C: 0–0.4, H: 0–360",
  },
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ColorInput({ engine, onAdd }: ColorInputProps) {
  const [activeFormat, setActiveFormat] = useState<FormatTab>("hex")
  const [inputs, setInputs] = useState<Record<FormatTab, string>>({
    hex: "",
    rgb: "",
    oklch: "",
  })
  const [parsed, setParsed]     = useState<ExtractedColor | null>(null)
  const [state, setState]       = useState<ValidationState>("idle")
  const [added, setAdded]       = useState(false)
  const [, startTransition]     = useTransition()
  const inputRef                = useRef<HTMLInputElement>(null)

  const validate = useCallback(
    (raw: string) => {
      const trimmed = raw.trim()
      if (!trimmed) {
        setState("idle")
        setParsed(null)
        return
      }
      const result = engine.parseColorInput(trimmed)
      if (result) {
        setParsed(result)
        setState("valid")
      } else {
        setParsed(null)
        setState("invalid")
      }
    },
    [engine]
  )

  const handleChange = useCallback(
    (fmt: FormatTab) => (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setInputs((prev) => ({ ...prev, [fmt]: val }))
      setAdded(false)
      startTransition(() => validate(val))
    },
    [validate]
  )

  const handleAdd = useCallback(() => {
    if (!parsed) return
    onAdd(parsed)
    setAdded(true)
    setTimeout(() => {
      setInputs((prev) => ({ ...prev, [activeFormat]: "" }))
      setParsed(null)
      setState("idle")
      setAdded(false)
    }, 900)
  }, [parsed, onAdd, activeFormat])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && state === "valid") handleAdd()
      if (e.key === "Escape") {
        setInputs((prev) => ({ ...prev, [activeFormat]: "" }))
        setParsed(null)
        setState("idle")
        inputRef.current?.blur()
      }
    },
    [state, handleAdd, activeFormat]
  )

  const handleTabChange = (fmt: string) => {
    setActiveFormat(fmt as FormatTab)
    // Re-validate what's already in the new tab's input
    startTransition(() => validate(inputs[fmt as FormatTab]))
  }

  const currentValue = inputs[activeFormat]
  const config = FORMAT_CONFIG[activeFormat]

  return (
    <div className="space-y-3">
      <Tabs value={activeFormat} onValueChange={handleTabChange}>
        {/* Format Tabs */}
        <TabsList className="w-full h-8 p-0.5 grid grid-cols-3">
          {(Object.keys(FORMAT_CONFIG) as FormatTab[]).map((fmt) => (
            <TabsTrigger
              key={fmt}
              value={fmt}
              className="flex items-center gap-1.5 text-[11px] h-full"
            >
              {FORMAT_CONFIG[fmt].icon}
              {FORMAT_CONFIG[fmt].label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* All three share the same input UI — content drives only placeholder & hint */}
        {(Object.keys(FORMAT_CONFIG) as FormatTab[]).map((fmt) => (
          <TabsContent key={fmt} value={fmt} className="mt-3 space-y-2">
            {/* Input row */}
            <div className="flex items-center gap-2">
              {/* Live color swatch */}
              <div
                aria-hidden
                className={cn(
                  "h-9 w-9 shrink-0 rounded-lg border shadow-sm transition-all duration-200",
                  state === "valid" && fmt === activeFormat
                    ? "ring-2 ring-primary/40 border-primary/30"
                    : "bg-muted/40 border-border"
                )}
                style={
                  parsed && fmt === activeFormat
                    ? { backgroundColor: parsed.oklch }
                    : undefined
                }
              />

              {/* Text input */}
              <div className="relative flex-1">
                <input
                  ref={fmt === activeFormat ? inputRef : undefined}
                  type="text"
                  value={inputs[fmt]}
                  onChange={handleChange(fmt)}
                  onKeyDown={handleKeyDown}
                  placeholder={FORMAT_CONFIG[fmt].placeholder}
                  spellCheck={false}
                  autoComplete="off"
                  aria-label={`Enter ${FORMAT_CONFIG[fmt].label} color`}
                  className={cn(
                    "w-full rounded-lg border bg-background px-3 py-2 pr-8 text-xs font-mono",
                    "placeholder:text-muted-foreground/40 outline-none transition-all duration-150",
                    "focus:ring-2",
                    fmt === activeFormat && state === "valid"
                      && "border-green-500/50 focus:ring-green-500/25 text-foreground",
                    fmt === activeFormat && state === "invalid"
                      && "border-destructive/50 focus:ring-destructive/25 text-destructive",
                    (fmt !== activeFormat || state === "idle")
                      && "border-border focus:ring-primary/30 text-foreground"
                  )}
                />

                {/* Validation icon */}
                {fmt === activeFormat && state !== "idle" && (
                  <span
                    className={cn(
                      "absolute right-2.5 top-1/2 -translate-y-1/2",
                      state === "valid"   && "text-green-500",
                      state === "invalid" && "text-destructive"
                    )}
                  >
                    {state === "valid"
                      ? <Check className="h-3 w-3" strokeWidth={3} />
                      : <X     className="h-3 w-3" strokeWidth={3} />
                    }
                  </span>
                )}
              </div>

              {/* Add button */}
              <button
                onClick={handleAdd}
                disabled={fmt !== activeFormat || state !== "valid"}
                title="Add to palette (Enter)"
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-150",
                  added && fmt === activeFormat
                    ? "bg-green-500 border-green-400 text-white scale-95"
                    : fmt === activeFormat && state === "valid"
                      ? "bg-primary border-primary text-primary-foreground hover:bg-primary/90 hover:scale-105"
                      : "bg-muted/30 border-border text-muted-foreground cursor-not-allowed opacity-40"
                )}
              >
                {added && fmt === activeFormat
                  ? <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  : <Plus  className="h-3.5 w-3.5" strokeWidth={2.5} />
                }
              </button>
            </div>

            {/* Hint text */}
            <p className="text-[10px] text-muted-foreground/60 px-0.5">
              {FORMAT_CONFIG[fmt].hint}
            </p>
          </TabsContent>
        ))}
      </Tabs>

      {/* Parsed result row — shown when valid */}
      {parsed && state === "valid" && (
        <div className="flex items-center gap-2 rounded-lg bg-muted/30 border border-border/50 px-3 py-2 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Swatch */}
          <div
            className="h-5 w-5 shrink-0 rounded border shadow-sm"
            style={{ backgroundColor: parsed.oklch }}
            aria-hidden
          />
          <span className="text-[11px] font-semibold text-foreground">{parsed.label}</span>
          <span className="text-[10px] font-mono text-muted-foreground uppercase">{parsed.hex}</span>
          <span className="text-[10px] text-muted-foreground/60 truncate ml-auto hidden sm:block">
            {parsed.oklch}
          </span>
        </div>
      )}

      {/* Invalid hint */}
      {state === "invalid" && currentValue.length > 2 && (
        <p className="text-[10px] text-destructive/80 px-0.5 animate-in fade-in duration-100">
          Not a valid {config.label} color — try: <span className="font-mono">{config.placeholder}</span>
        </p>
      )}
    </div>
  )
}
