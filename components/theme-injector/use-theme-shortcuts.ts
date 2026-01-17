import { useEffect, useCallback } from "react"
import { ThemeType } from "@/lib/color-engine"
import { THEME_STYLES } from "./style-selector"

/**
 * Hook to handle keyboard shortcuts for theme switching.
 */
export function useThemeShortcuts(onSelect: (strategy: ThemeType) => void) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) return
      if (
        e.target instanceof HTMLElement &&
        (e.target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName))
      )
        return

      const key = e.key.toLowerCase()
      const match = THEME_STYLES.find((s) => s.kbd.toLowerCase() === key)

      if (match) {
        e.preventDefault()
        onSelect(match.id)
      }
    },
    [onSelect]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])
}
