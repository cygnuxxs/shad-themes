"use client"

import * as React from "react"
import { FileCode } from "lucide-react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CodeViewerContent } from "./code-viewer-content"

export function ThemeCodeViewer({
  className,
  highlightedCode,
  themeCSS,
}: React.ComponentProps<"div"> & {
  highlightedCode: string
  themeCSS: string
}) {
  const [mounted, setMounted] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const TriggerButton = (
    <Button
      size="sm"
      variant="outline"
      disabled={!highlightedCode}
      className="h-7 gap-1.5 rounded-md px-3 text-xs shadow-sm"
    >
      <FileCode className="h-3.5 w-3.5" />
      View CSS
    </Button>
  )

  const Content = (
    <CodeViewerContent
      highlightedCode={highlightedCode}
      themeCSS={themeCSS}
    />
  )

  if (!mounted) {
    return TriggerButton
  }

  if (!isDesktop) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
        <DrawerContent className={cn("flex max-h-[80vh] flex-col", className)}>
          <DrawerHeader className="sr-only">
            <DrawerTitle>Theme CSS</DrawerTitle>
            <DrawerDescription>
              View and copy the generated CSS
            </DrawerDescription>
          </DrawerHeader>
          {Content}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{TriggerButton}</SheetTrigger>
      <SheetContent
        side="right"
        className={cn(
          "sm:max-w-sm md:max-w-175 p-0 *:mt-0 [&>button]:top-2   *:py-3 *:mx-0",
          className
        )}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Theme CSS</SheetTitle>
          <SheetDescription>View and copy the generated CSS</SheetDescription>
        </SheetHeader>
        {Content}
      </SheetContent>
    </Sheet>
  )
}