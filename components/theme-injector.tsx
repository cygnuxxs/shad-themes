"use client"

import { useEffect, useState, useMemo } from "react"
import { ColorEngine, ThemeType } from "@/lib/color-engine"
import { useThemeStore } from "@/lib/theme-store"
import { Loader2 } from "lucide-react"
import { ColorPalette } from "./theme-injector/color-palette"
import { StyleSelector } from "./theme-injector/style-selector"
import { useThemeShortcuts } from "./theme-injector/use-theme-shortcuts"

export function ThemeInjector({ imageUrl }: { imageUrl: string }) {
  const [colors, setColors] = useState<string[]>([])
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedStrategy, setSelectedStrategy] = useState<ThemeType>("vivid")
  const [isExtracting, setIsExtracting] = useState(false)

  const { setThemeCSS } = useThemeStore()

  // 1. Memoize Engine creation
  const engine = useMemo(() => {
    if (!imageUrl) return null
    return new ColorEngine(imageUrl)
  }, [imageUrl])

  // 2. Handle Color Extraction (Async with Cleanup)
  useEffect(() => {
    if (!engine) {
      setColors([])
      return
    }

    let isMounted = true
    setIsExtracting(true)

    const extract = async () => {
      try {
        const extractedColors = await engine.extractColors()
        if (isMounted) {
          setColors(extractedColors)
          // Auto-select the first color if none selected or previous selection invalid
          if (extractedColors.length > 0) {
            setSelectedColor((prev) =>
              prev && extractedColors.includes(prev) ? prev : extractedColors[0]
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

    return () => {
      isMounted = false
    }
  }, [engine])

  // 3. Generate CSS (Pure Calculation)
  const themeCSS = useMemo(() => {
    if (!engine || !selectedColor) return ""
    const themes = engine.generateThemes(selectedColor)
    return themes[selectedStrategy] || ""
  }, [engine, selectedColor, selectedStrategy])

  // 4. Inject CSS (Side Effect)
  useEffect(() => {
    if (themeCSS) {
      setThemeCSS(themeCSS)
    }
  }, [themeCSS, setThemeCSS])

  // 5. Setup Keyboard Shortcuts
  useThemeShortcuts(setSelectedStrategy)

  if (!imageUrl) return null

  return (
    <div className="w-full max-w-md rounded-xl border bg-card/50 p-4 shadow-sm backdrop-blur-sm transition-all animate-in fade-in slide-in-from-bottom-2">
      {/* Inject Style locally for immediate feedback, while Store handles global */}
      {themeCSS && (
        <style
          id="dynamic-theme-local"
          dangerouslySetInnerHTML={{ __html: themeCSS }}
        />
      )}

      {isExtracting && colors.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2 text-sm">Extracting palette...</span>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <ColorPalette
            colors={colors}
            selectedColor={selectedColor}
            onSelect={setSelectedColor}
          />
          <StyleSelector
            selectedStrategy={selectedStrategy}
            selectedColor={selectedColor}
            onSelect={setSelectedStrategy}
          />
        </div>
      )}
    </div>
  )
}