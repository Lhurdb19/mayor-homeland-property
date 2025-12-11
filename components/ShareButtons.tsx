"use client";

import { FacebookIcon, LinkedinIcon, TwitterIcon, Link2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const url = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  return (
    <Card className="mt-4 shadow-md text-black/80">
      <CardHeader>
        <CardTitle>Share this Property</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-3 flex-wrap">
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              className="flex items-center text-[10px] gap-2 text-blue-500 hover:bg-blue-50 border rounded px-2 outline outline-blue-500"
              href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon className="w-3 h-3" />
              Facebook
            </a>

          </TooltipTrigger>
          <TooltipContent className="text-black/50 text-[10px]">Share on Facebook</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <a
              className="flex items-center text-[10px] gap-2 text-blue-500 hover:bg-blue-50 border rounded px-2 outline outline-blue-500"
              href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
              target="_blank"
              rel="noopener noreferrer"
            >

              <LinkedinIcon className="w-3 h-3" />
              LinkedIn
            </a>
          </TooltipTrigger>
          <TooltipContent className="text-black/50 text-[10px]">Share on LinkedIn</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <a
              className="flex items-center text-[10px] gap-2 text-blue-500 hover:bg-blue-50 border rounded px-2 outline outline-blue-500"
              href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
              target="_blank"
              rel="noopener noreferrer"
            >

              <TwitterIcon className="w-3 h-3" />
              Twitter
            </a>
          </TooltipTrigger>
          <TooltipContent className="text-black/50 text-[10px]">Share on Twitter</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center text-[10px] gap-2 text-blue-500 border rounded px-2 outline outline-blue-500"
              onClick={handleCopy}
            >
              <Link2Icon className="w-3 h-3" />
              Copy Link
            </Button>
          </TooltipTrigger>
          <TooltipContent className="text-black/50 text-[10px]">Copy link to clipboard</TooltipContent>
        </Tooltip>
      </CardContent>
    </Card>
  );
}
