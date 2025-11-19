"use client";

import { useState, useRef } from "react";
import { trackEvent } from "./Analytics";

interface VideoPlayerProps {
  videoUrl: string;
  onDownload?: () => void;
  onShare?: () => void;
}

export default function VideoPlayer({ videoUrl, onDownload, onShare }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Validate URL is from trusted domain
  const isValidVideoUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      // Allow Supabase storage and Replicate CDN
      const trustedDomains = [
        '.supabase.co',
        'supabase.co',
        'replicate.delivery',
        'pbxt.replicate.delivery',
      ];
      return trustedDomains.some(domain =>
        parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(domain)
      );
    } catch {
      return false;
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleDownload = async () => {
    // Validate URL before download
    if (!isValidVideoUrl(videoUrl)) {
      console.error("Invalid video URL for download");
      alert("Unable to download: Invalid video URL");
      return;
    }

    try {
      // Use simple link download instead of fetch for better performance
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = `viralfaces-${Date.now()}.mp4`;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Track analytics
      trackEvent("video_download", { url: videoUrl });

      if (onDownload) onDownload();
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try right-clicking the video and selecting 'Save Video As'");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My ViralFaces Video",
          text: "Check out my viral video created with ViralFaces AI!",
          url: videoUrl,
        });

        // Track analytics
        trackEvent("video_share", { method: "native", url: videoUrl });

        if (onShare) onShare();
      } catch (error) {
        console.log("Share cancelled or failed:", error);
      }
    } else {
      // Fallback: Copy link
      try {
        await navigator.clipboard.writeText(videoUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        // Track analytics
        trackEvent("video_share", { method: "clipboard", url: videoUrl });
      } catch (error) {
        console.error("Clipboard write failed:", error);
        alert("Unable to copy link. Please copy it manually: " + videoUrl);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative rounded-2xl overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full aspect-video"
          loop
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Video Controls Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition flex items-end p-6">
          <div className="flex items-center gap-4 w-full">
            <button
              onClick={handlePlayPause}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition"
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="white" viewBox="0 0 20 20">
                  <path d="M6 4h2v12H6V4zm6 0h2v12h-2V4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="white" viewBox="0 0 20 20">
                  <path d="M6 4l10 6-10 6V4z" />
                </svg>
              )}
            </button>

            <button
              onClick={handleMuteToggle}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition"
            >
              {isMuted ? (
                <svg className="w-6 h-6" fill="white" viewBox="0 0 20 20">
                  <path d="M9 4L5 8H2v4h3l4 4V4zm7 1l-1.5 1.5L16 8l-1.5 1.5L16 11l-1.5 1.5L16 14l1.5-1.5L19 14l-1.5-1.5L19 11l-1.5-1.5L19 8l-1.5-1.5L19 5l-1.5 1.5z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="white" viewBox="0 0 20 20">
                  <path d="M9 4L5 8H2v4h3l4 4V4zm6 6c0-1.1-.6-2-1.5-2.5v5c.9-.5 1.5-1.4 1.5-2.5zm1.5-5v1.5C18 7.9 19 9.8 19 12s-1 4.1-2.5 5.5V19c2.5-1.5 4-4.2 4-7s-1.5-5.5-4-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-semibold hover:brightness-110 transition"
        >
          <svg className="w-5 h-5" fill="white" viewBox="0 0 20 20">
            <path d="M10 12l-4-4h2.5V4h3v4H14l-4 4zm-6 5h12v2H4v-2z" />
          </svg>
          Download Video
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold hover:brightness-110 transition"
        >
          <svg className="w-5 h-5" fill="white" viewBox="0 0 20 20">
            <path d="M15 8a3 3 0 11-2-2.82V4H9a5 5 0 00-4 2.01V8a3 3 0 11-2 0V6.01A7 7 0 019 2h4V.18A3 3 0 1115 5v3z" />
          </svg>
          {copied ? "Link Copied!" : "Share"}
        </button>
      </div>

      {/* Watermark Notice */}
      <div className="p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-xl text-center">
        <p className="text-sm text-yellow-200">
          💎 Remove watermark and get HD quality for just $9
        </p>
        <a
          href="/pricing"
          className="inline-block mt-2 text-yellow-400 font-semibold hover:underline"
        >
          Upgrade Now →
        </a>
      </div>
    </div>
  );
}
