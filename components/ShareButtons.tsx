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
    <Card className="mt-4 shadow-md">
      <CardHeader>
        <CardTitle>Share this Property</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-3 flex-wrap">
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              className="flex items-center gap-2 text-blue-200 hover:bg-blue-50 border rounded px-3 py-2 outline outline-1 outline-blue-200"
              href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon className="w-5 h-5" />
              Facebook
            </a>

          </TooltipTrigger>
          <TooltipContent>Share on Facebook</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <a
              className="flex items-center gap-2 text-blue-200 hover:bg-blue-50 border rounded px-3 py-2 outline outline-1 outline-blue-200"
              href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
              target="_blank"
              rel="noopener noreferrer"
            >

              <LinkedinIcon className="w-5 h-5" />
              LinkedIn
            </a>
          </TooltipTrigger>
          <TooltipContent>Share on LinkedIn</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <a
              className="flex items-center gap-2 text-blue-200 hover:bg-blue-50 border rounded px-3 py-2 outline outline-1 outline-blue-200"
              href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
              target="_blank"
              rel="noopener noreferrer"
            >

              <TwitterIcon className="w-5 h-5" />
              Twitter
            </a>
          </TooltipTrigger>
          <TooltipContent>Share on Twitter</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
              onClick={handleCopy}
            >
              <Link2Icon className="w-5 h-5" />
              Copy Link
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy link to clipboard</TooltipContent>
        </Tooltip>
      </CardContent>
    </Card>
  );
}
