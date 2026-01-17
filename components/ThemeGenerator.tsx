import { Label } from "@/components/ui/label";
import { RootComponents } from "./blocks";
import CodeCopy from "./code-copy";
import ThemeControl from "./theme-control";

export default function ThemeGenerator() {

  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-700 ease-in-out">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col gap-2 md:text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
            Generate your Theme
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl md:mx-auto">
            Upload an image to extract a color palette instantly.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-start">
          <div className="md:sticky md:top-16 self-start space-y-2 max-h-[calc(100vh-4rem)] overflow-scroll w-full md:max-w-md py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="image-url">Image</Label>
              <CodeCopy />
            </div>
            <ThemeControl />
          </div>
          <RootComponents />
        </div>
      </div>
    </div>
  );
}
