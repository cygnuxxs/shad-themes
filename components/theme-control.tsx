"use client";

import { useImageStore } from "@/lib/theme-store";
import { useRef, useEffect } from "react";
import { ThemeInjector } from "./theme-injector";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import ImageInput from "./image-input";

const ThemeControl = () => {
  const { url } = useImageStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        (e.target instanceof HTMLElement && e.target.isContentEditable) ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      if (key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <ImageInput inputRef={inputRef} />
      <div className="relative h-56 w-full shrink-0 overflow-hidden rounded-lg border border-border bg-muted/30 shadow-inner group">
        {url ? (
          <Image
            src={url}
            alt="Theme Source"
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized // Useful if handling external URLs without Next.js config
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground/40">
            <div className="animate-pulse flex flex-col items-center gap-3">
              <ImageIcon className="h-10 w-10" />
              <span className="text-xs font-medium uppercase tracking-widest">
                No Image Source
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6 w-full h-full md:sticky md:top-8">
        <ThemeInjector imageUrl={url} />
        {url && (
          <p className="text-xs text-center text-muted-foreground animate-in fade-in slide-in-from-bottom-2">
            Changes apply globally to all UI components.
          </p>
        )}
      </div>
    </>
  );
};

export default ThemeControl;
