import React, { useState, useRef } from 'react';
import { ChromeToothLoop } from './ChromeToothLoop';
import { Implant3D } from './Implant3D';
import { Video, Film, Eye, Sparkles, Upload, Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface HeroVideoCenterProps {
  onInspect?: () => void;
}

export const HeroVideoCenter: React.FC<HeroVideoCenterProps> = ({ onInspect }) => {
  // Modes: 'chrome3d' | 'video' | 'implant'
  const [activeDisplay, setActiveDisplay] = useState<'chrome3d' | 'video' | 'implant'>('chrome3d');
  
  // Custom video state
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setActiveDisplay('video');
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }, 100);
    }
  };

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

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      {/* Top Display Mode Switcher (Seamless Studio Tabs) */}
      <div className="z-30 mb-3 flex items-center gap-1.5 p-1 bg-black/60 backdrop-blur-md rounded-full border border-white/15 text-xs shadow-xl">
        <button
          onClick={() => setActiveDisplay('chrome3d')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium transition-all ${
            activeDisplay === 'chrome3d'
              ? 'bg-gradient-to-r from-slate-100 to-white text-black font-semibold shadow-md'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#ff9248]" />
          <span>Chrome Tooth 3D Loop</span>
        </button>

        <button
          onClick={() => setActiveDisplay('video')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium transition-all ${
            activeDisplay === 'video'
              ? 'bg-[#ec5b24] text-white font-semibold shadow-md'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Video Player Loop</span>
        </button>

        <button
          onClick={() => setActiveDisplay('implant')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium transition-all ${
            activeDisplay === 'implant'
              ? 'bg-white/20 text-white font-semibold shadow-md'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>Guided Implant 3D</span>
        </button>
      </div>

      {/* Main Display Container */}
      <div className="relative w-full min-h-[480px] sm:min-h-[540px] lg:min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* MODE 1: Chrome Tooth 3D Loop (Live WebGL with 360° rotation) */}
        {activeDisplay === 'chrome3d' && (
          <div className="w-full h-full animate-fade-in">
            <ChromeToothLoop onInspect={onInspect} materialFinish="chrome" />
          </div>
        )}

        {/* MODE 2: Native HTML5 Video Loop Player */}
        {activeDisplay === 'video' && (
          <div className="relative w-full h-[480px] sm:h-[540px] lg:h-[600px] rounded-3xl overflow-hidden bg-black/80 border border-white/15 flex flex-col items-center justify-center shadow-2xl animate-fade-in group">
            {videoSrc ? (
              <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-contain"
              />
            ) : (
              /* Fallback & Custom Video Dropzone */
              <div className="p-8 text-center max-w-md space-y-5">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#ff9248] shadow-lg">
                  <Film className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-base font-semibold text-white">
                    Load Tooth Loop Video
                  </h4>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Upload your video file (MP4, WebM, MOV) to play continuously in a seamless loop right here in the hero section.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#ec5b24] hover:bg-[#ff6f38] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Video File</span>
                  </button>

                  <button
                    onClick={() => setActiveDisplay('chrome3d')}
                    className="w-full sm:w-auto px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-xl transition-colors"
                  >
                    Use 3D Chrome Engine
                  </button>
                </div>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="video/mp4,video/webm,video/quicktime,video/*"
              className="hidden"
            />

            {/* Video Player Floating Overlay Controls */}
            {videoSrc && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-xs text-white shadow-xl opacity-90 hover:opacity-100 transition-opacity">
                <button
                  onClick={togglePlay}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <span className="text-white/30 text-xs">|</span>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-[11px] hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors"
                >
                  Change Video
                </button>
              </div>
            )}
          </div>
        )}

        {/* MODE 3: Guided Implant 3D */}
        {activeDisplay === 'implant' && (
          <div className="w-full h-full animate-fade-in">
            <Implant3D onInspect={onInspect} />
          </div>
        )}
      </div>
    </div>
  );
};
