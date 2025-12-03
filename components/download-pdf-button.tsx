"use client";

import { Download } from "lucide-react";

interface DownloadPdfButtonProps {
  userId: string;
}

export function DownloadPdfButton({ userId }: DownloadPdfButtonProps) {
  const handleDownload = () => {
    window.open(`/api/pdf?userId=${userId}`, "_blank");
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
    >
      <Download className="h-4 w-4" />
      <span>Download PDF</span>
    </button>
  );
}
