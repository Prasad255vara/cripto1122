import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface HeroVideoPlayerProps {
  onInspect?: () => void;
}

export const HeroVideoPlayer: React.FC<HeroVideoPlayerProps> = ({ onInspect }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative w-full h-[500px] sm:h-[580px] lg:h-[660px] flex items-center justify-center select-none">
      {/* Ambient Depth Glow behind the rotating tooth */}
      <div className="absolute inset-0 bg-radial-gradient from-white/[0.04] via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />

      {/* Pure Video Loop */}
      <div className="relative w-full h-full flex items-center justify-center group">
        <video
          ref={videoRef}
          src="/videos/tooth-loop.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          controls={false}
          className="w-full h-full max-h-[560px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] filter contrast-105"
        />

        {/* Minimalist Floating Play/Pause Controls on hover */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs text-white shadow-2xl opacity-70 hover:opacity-100 transition-opacity">
          <button
            onClick={togglePlay}
            className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title={isPlaying ? 'Pause Loop' : 'Play Loop'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <span className="text-white/20 text-xs">|</span>

          <span className="text-[11px] font-mono text-white/80 tracking-wide">
            360° Chrome Loop
          </span>
        </div>
      </div>
    </div>
  );
};

