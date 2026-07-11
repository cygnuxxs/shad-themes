"use client"

import { useEffect } from "react"
import { useThemeStore } from "@/lib/theme-store"

/**
 * Reads themeCSS from the global store and injects it as a <style> tag
 * into document.head — so it applies to the entire app regardless of
 * which panel (image or custom color) generated it.
 */
export function GlobalThemeInjector() {
  const themeCSS = useThemeStore((s) => s.themeCSS)

  useEffect(() => {
    let tag = document.getElementById("dynamic-theme-global") as HTMLStyleElement | null

    if (!tag) {
      tag = document.createElement("style")
      tag.id = "dynamic-theme-global"
      document.head.appendChild(tag)
    }

    tag.textContent = themeCSS
  }, [themeCSS])

  return null
}
