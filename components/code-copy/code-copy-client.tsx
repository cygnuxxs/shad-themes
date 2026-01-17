"use client";

import { useEffect, useState } from "react";
import { useImageStore, useThemeStore } from "@/lib/theme-store";
import { ThemeCodeViewer } from "./view-code";
import { CopyButton } from "./copy-button";
import { highlightCode } from "@/lib/highlight-code";

export const CodeCopyClient = () => {
  const { themeCSS } = useThemeStore();
  const { url } = useImageStore();
  const [highlightedCode, setHighlightedCode] = useState<string>("");

  useEffect(() => {
    highlightCode(themeCSS, "css").then((code) => setHighlightedCode(code));
  }, [themeCSS]);

  return (
    <div className="flex gap-2 items-center">
      {url && (
        <>
          <CopyButton value={themeCSS} />
          <ThemeCodeViewer
            highlightedCode={highlightedCode}
            themeCSS={themeCSS}
          />
        </>
      )}
    </div>
  );
};
