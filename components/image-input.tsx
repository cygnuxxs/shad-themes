"use client";

import { RefObject, useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Input } from "./ui/input";
import { FileUpload } from "./ui/file-upload";
import { toast } from "sonner";
import { useImageStore, useThemeStore } from "@/lib/theme-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorEngine, ExtractedColor, ThemeType } from "@/lib/color-engine";
import { ColorInput } from "./theme-injector/color-input";
import { StyleSelector } from "./theme-injector/style-selector";
import { IntensitySlider } from "./theme-injector/intensity-slider";
import { useThemeShortcuts } from "./theme-injector/use-theme-shortcuts";
import { Link2, Upload, Pipette } from "lucide-react";

// ── Standalone color panel (no image required) ────────────────────────────────

function StandaloneColorPanel() {
  // A dummy engine — we only use it for parseColorInput + generateThemes (no image src needed)
  const engine = useMemo(() => new ColorEngine(""), []);

  const [selectedColor, setSelectedColor] = useState<ExtractedColor | null>(null);
  const [customColors, setCustomColors]   = useState<ExtractedColor[]>([]);
  const [strategy, setStrategy]           = useState<ThemeType>("vivid");
  const [intensity, setIntensity]         = useState(1);
  const { setThemeCSS } = useThemeStore();

  // Keyboard shortcuts: S=standard, V=vivid, M=minimal, P=professional
  useThemeShortcuts(setStrategy);

  const handleAdd = useCallback((color: ExtractedColor) => {
    setCustomColors((prev) =>
      prev.some((c) => c.oklch === color.oklch) ? prev : [color, ...prev]
    );
    setSelectedColor(color);
  }, []);

  // Regenerate theme whenever color / strategy / intensity changes
  useEffect(() => {
    if (!selectedColor) return;
    const themes = engine.generateThemes(selectedColor.oklch, intensity);
    const css = themes[strategy];
    if (css) setThemeCSS(css);
  }, [engine, selectedColor, strategy, intensity, setThemeCSS]);

  return (
    <div className="space-y-4">
      {/* Color input with format tabs */}
      <ColorInput engine={engine} onAdd={handleAdd} />

      {/* Added colors pill list */}
      {customColors.length > 0 && (
        <div className="space-y-2 pt-1 border-t border-border/50">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Added colors
          </p>
          <div className="flex flex-wrap gap-1.5">
            {customColors.map((ec, i) => (
              <button
                key={`${ec.oklch}-${i}`}
                onClick={() => setSelectedColor(ec)}
                title={`${ec.label} — ${ec.hex}`}
                className={`flex items-center gap-1.5 rounded-full border pl-1 pr-2.5 py-1 text-[10px] font-medium transition-all ${
                  selectedColor?.oklch === ec.oklch
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span
                  className="h-4 w-4 shrink-0 rounded-full border border-black/10 shadow-sm"
                  style={{ backgroundColor: ec.oklch }}
                />
                <span className="font-mono uppercase">{ec.hex}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Strategy + Intensity — only shown once a color is chosen */}
      {selectedColor && (
        <div className="space-y-4 pt-1 border-t border-border/50">
          <StyleSelector
            selectedStrategy={strategy}
            selectedColor={selectedColor.oklch}
            onSelect={setStrategy}
          />
          <IntensitySlider value={intensity} onChange={setIntensity} />
        </div>
      )}
    </div>
  );
}

// ── Main ImageInput component ──────────────────────────────────────────────────

const ImageInput = ({
  inputRef,
}: {
  inputRef: RefObject<HTMLInputElement | null>;
}) => {
  const { url, setUrl } = useImageStore();
  const objectUrlRef = useRef<string | null>(null);

  const handleFileChange = (files: File[]) => {
    if (!files?.length) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Selected file is not an image");
      return;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const blobUrl = URL.createObjectURL(file);
    objectUrlRef.current = blobUrl;
    setUrl(blobUrl);
  };

  useEffect(() => {
    if (url?.startsWith("blob:")) {
      const img = new Image();
      img.onerror = () => setUrl("");
      img.src = url;
    }
  }, [url, setUrl]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  return (
    <Tabs defaultValue="url" className="w-full">
      <TabsList className="mb-2 w-full">
        <TabsTrigger className="flex-1 gap-1.5" value="url">
          <Link2 className="h-3.5 w-3.5" />
          Image URL
        </TabsTrigger>
        <TabsTrigger className="flex-1 gap-1.5" value="upload">
          <Upload className="h-3.5 w-3.5" />
          Upload
        </TabsTrigger>
        <TabsTrigger className="flex-1 gap-1.5" value="color">
          <Pipette className="h-3.5 w-3.5" />
          Color
        </TabsTrigger>
      </TabsList>

      <TabsContent value="url">
        <Input
          ref={inputRef}
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-background/50 font-mono text-sm"
          placeholder="https://images.unsplash.com/..."
        />
      </TabsContent>

      <TabsContent value="upload">
        <FileUpload onChange={handleFileChange} />
      </TabsContent>

      <TabsContent value="color">
        <StandaloneColorPanel />
      </TabsContent>
    </Tabs>
  );
};

export default ImageInput;
