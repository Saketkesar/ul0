"use client"

import { useState, useEffect } from "react"

interface ProductLogoProps {
  src?: string;
  name: string;
  className?: string;
}

const BRAND_DOMAINS: Record<string, string> = {
  chatgpt: "openai.com",
  claude: "anthropic.com",
  gemini: "google.com",
  perplexity: "perplexity.ai",
  grok: "x.ai",
  react: "react.dev",
  vue: "vuejs.org",
  nextjs: "nextjs.org",
  hostinger: "hostinger.com",
  bluehost: "bluehost.com",
  netflix: "netflix.com",
  youtube: "youtube.com",
  apple: "apple.com",
  samsung: "samsung.com"
};

// Client-side helper to check/extract YouTube ID
function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function ProductLogo({ src, name, className = "" }: ProductLogoProps) {
  const [stage, setStage] = useState<number>(0);

  // If src or name changes, reset the stage back to 0
  useEffect(() => {
    setStage(0);
  }, [src, name]);

  const isPollinations = src && src.includes("image.pollinations.ai");
  const isBrokenSrc = !src || src.trim() === "" || isPollinations;

  // Resolve YouTube thumbnail on client-side if src is a YouTube URL
  let initialUrl = src || "";
  const youtubeId = getYouTubeId(initialUrl);
  if (youtubeId) {
    initialUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }

  const getBrandLogoUrl = (n: string) => {
    const cleanName = n.toLowerCase().trim();
    for (const [key, domain] of Object.entries(BRAND_DOMAINS)) {
      if (cleanName.includes(key)) {
        return `https://logo.clearbit.com/${domain}`;
      }
    }
    return null;
  };

  const clearbitUrl = getBrandLogoUrl(name);
  const placeholderUrl = `https://placehold.co/100x100/fafafa/111827.png?text=${encodeURIComponent(name)}`;

  const getInitials = (n: string) => {
    const clean = n.replace(/https?:\/\/(www\.)?/i, "").toUpperCase();
    if (clean.length >= 2) {
      return clean.substring(0, 2);
    }
    return clean || "??";
  };

  const getAvatarStyle = (n: string) => {
    const charCode = n.charCodeAt(0) || 0;
    if (charCode % 3 === 0) return "bg-gray-50 border-gray-200 text-gray-800";
    if (charCode % 3 === 1) return "bg-slate-50 border-slate-200 text-slate-800";
    return "bg-zinc-50 border-zinc-200 text-zinc-800";
  };

  const renderInitials = () => (
    <div className={`w-14 h-14 rounded-xl border flex items-center justify-center text-sm font-semibold shrink-0 select-none ${getAvatarStyle(name)} ${className}`}>
      {getInitials(name)}
    </div>
  );

  const getUrlForStage = (stageNum: number): string | null => {
    if (stageNum === 0) {
      return (!isBrokenSrc || youtubeId) ? initialUrl : null;
    }
    if (stageNum === 1) {
      return clearbitUrl;
    }
    if (stageNum === 2) {
      return placeholderUrl;
    }
    return null;
  };

  // Find the first stage from current stage state that returns a non-null URL
  let activeUrl: string | null = null;
  let activeStage = stage;

  while (activeStage <= 2) {
    const url = getUrlForStage(activeStage);
    if (url) {
      activeUrl = url;
      break;
    }
    activeStage++;
  }

  const handleError = () => {
    setStage(activeStage + 1);
  };

  if (!activeUrl || activeStage >= 3) {
    return renderInitials();
  }

  return (
    <img
      src={activeUrl}
      alt={`${name} logo`}
      onError={handleError}
      className={`w-14 h-14 rounded-xl border border-gray-200 bg-white p-2 object-contain shrink-0 ${className}`}
    />
  );
}
