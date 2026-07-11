"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { ColorEngine, ExtractedColor, ThemeType } from "@/lib/color-engine"
import { useThemeStore } from "@/lib/theme-store"
import { Loader2 } from "lucide-react"
import { ColorPalette } from "./theme-injector/color-palette"
import { StyleSelector } from "./theme-injector/style-selector"
import { IntensitySlider } from "./theme-injector/intensity-slider"
import { useThemeShortcuts } from "./theme-injector/use-theme-shortcuts"

export function ThemeInjector({ imageUrl }: { imageUrl: string }) {
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([])
  const [selectedColor, setSelectedColor]     = useState<ExtractedColor | null>(null)
  const [selectedStrategy, setSelectedStrategy] = useState<ThemeType>("vivid")
  const [chromaMultiplier, setChromaMultiplier] = useState(1)
  const [isExtracting, setIsExtracting]       = useState(false)

  const { setThemeCSS } = useThemeStore()

  const engine = useMemo(() => {
    if (!imageUrl) return null
    return new ColorEngine(imageUrl)
  }, [imageUrl])

  useEffect(() => {
    if (!engine) {
      setExtractedColors([])
      return
    }

    let isMounted = true
    setIsExtracting(true)

    const extract = async () => {
      try {
        const extracted = await engine.extractColors()
        if (isMounted) {
          setExtractedColors(extracted)
          if (extracted.length > 0) {
            setSelectedColor((prev) =>
              prev && extracted.find((ec) => ec.oklch === prev.oklch)
                ? prev
                : extracted[0]
            )
          }
        }
      } catch (error) {
        console.error("Failed to extract colors:", error)
      } finally {
        if (isMounted) setIsExtracting(false)
      }
    }

    extract()
    return () => { isMounted = false }
  }, [engine])

  const themeCSS = useMemo(() => {
    if (!engine || !selectedColor) return ""
    const themes = engine.generateThemes(selectedColor.oklch, chromaMultiplier)
    return themes[selectedStrategy] || ""
  }, [engine, selectedColor, selectedStrategy, chromaMultiplier])

  useEffect(() => {
    if (themeCSS) setThemeCSS(themeCSS)
  }, [themeCSS, setThemeCSS])

  useThemeShortcuts(setSelectedStrategy)

  if (!imageUrl) return null

  return (
    <div className="w-full max-w-md rounded-xl border bg-card/50 p-4 shadow-sm backdrop-blur-sm transition-all animate-in fade-in slide-in-from-bottom-2">

      {isExtracting && extractedColors.length === 0 ? (
        <div className="flex h-28 items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="ml-2 text-sm">Extracting palette…</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ColorPalette
              colors={extractedColors}
              selectedColor={selectedColor}
              onSelect={setSelectedColor}
            />
            <StyleSelector
              selectedStrategy={selectedStrategy}
              selectedColor={selectedColor?.oklch ?? null}
              onSelect={setSelectedStrategy}
            />
          </div>
          <IntensitySlider
            value={chromaMultiplier}
            onChange={setChromaMultiplier}
          />
        </div>
      )}
    </div>
  )
}