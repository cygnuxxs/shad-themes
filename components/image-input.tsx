"use client";

import { RefObject, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { FileUpload } from "./ui/file-upload";
import { toast } from "sonner";
import { useImageStore } from "@/lib/theme-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <TabsTrigger className="w-1/2" value="url">
          Image URL
        </TabsTrigger>
        <TabsTrigger className="w-1/2" value="upload">
          Upload Image
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
    </Tabs>
  );
};

export default ImageInput;
