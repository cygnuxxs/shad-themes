"use client"

import * as React from "react"
import { FileCode } from "lucide-react"
import { CopyButton } from "./copy-button"

interface CodeViewerContentProps {
  highlightedCode: string
  themeCSS: string
}

export function CodeViewerContent({
  highlightedCode,
  themeCSS,
}: CodeViewerContentProps) {
  return (
      <figure
        data-rehype-pretty-code-figure=""
        className="flex flex-1 flex-col overflow-hidden"
      >
        <figcaption
          data-language="css"
          className="flex h-12 py-1 items-center gap-2 border-b bg-muted/30 px-4 text-sm font-medium"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileCode className="size-4" />
            <span>theme.css</span>
          </div>
          <CopyButton value={themeCSS} />
        </figcaption>
        <div
          className="no-scrollbar overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </figure>
  )
}
