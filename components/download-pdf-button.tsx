"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface DownloadPdfButtonProps {
  userId: string;
}

export function DownloadPdfButton({ userId }: DownloadPdfButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/pdf?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to generate PDF");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = response.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="([^"]+)"/);
      a.download = match?.[1] ?? "CV.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      className="ios-press flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80 transition-opacity cursor-pointer shrink-0 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      <span>{isLoading ? "Generating..." : "Download PDF"}</span>
    </button>
  );
}
