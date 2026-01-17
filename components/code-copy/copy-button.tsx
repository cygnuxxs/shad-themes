"use client";

import * as React from "react";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCopyToClipboard } from "@/hooks/use-clipboard";

interface CopyButtonProps extends React.ComponentProps<typeof Button> {
  value: string;
  tooltip?: string;
}

export function CopyButton({
  value,
  className,
  variant = "ghost",
  tooltip = "Copy to Clipboard",
  ...props
}: CopyButtonProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size="icon"
          className={cn("h-7 w-7", className)}
          onClick={() => copyToClipboard(value)}
          {...props}
        >
          <span className="sr-only">Copy</span>
          {isCopied ? (
            <IconCheck className="h-4 w-4" />
          ) : (
            <IconCopy className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        {isCopied ? "Copied!" : tooltip}
      </TooltipContent>
    </Tooltip>
  );
}