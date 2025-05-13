import { useEffect, useRef } from "react";
import Hls from "hls.js";

const LiveStream = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const streamUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

    if (video) {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // 原生支援 HLS（如 Safari）
        video.src = streamUrl;
      } else if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        console.error("This browser does not support HLS.");
      }
    }
  }, []);

 return (
    <div className="min-h-screen bg-black flex flex-col mt-[60px] items-center justify-center px-4 py-10 text-white">
      <h1 className="text-4xl font-bold mb-6 text-neon">Live Stream Demo</h1>

      <div className="relative w-full max-w-3xl aspect-video bg-gray-900 rounded-3xl shadow-[0_8px_30px_rgba(0,255,255,0.3)] overflow-hidden border-[12px] border-gray-700">
        <div className="absolute top-4 right-4 w-[20px] h-[20px] bg-gray-800 rounded-full border-2 border-gray-600 shadow-inner"></div>
        <div className="absolute bottom-4 right-4 w-[20px] h-[20px] bg-gray-800 rounded-full border-2 border-gray-600 shadow-inner"></div>
        <div className="absolute inset-4 rounded-2xl bg-black overflow-hidden neon-scan-bg">
          <video
            ref={videoRef}
            controls
            autoPlay
            muted
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default LiveStream;