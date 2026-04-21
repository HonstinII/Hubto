import React from 'react';

export function MeshGradientBackground({
  children,
  className = '',
  showDots = false,
  showVideo = false,
}: {
  children: React.ReactNode;
  className?: string;
  showDots?: boolean;
  showVideo?: boolean;
}) {
  return (
    <div className={`relative min-h-screen w-full overflow-hidden bg-black ${className}`}>
      {showVideo && (
        <div className="fixed inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover opacity-100"
          >
            <source
              src="https://storage.googleapis.com/gweb-gemini-cdn/gemini/uploads/89e9004d716a7803fc7c9aab18c985af783f5a36.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-black/10" />
        </div>
      )}

      {showDots && (
        <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(rgba(255,255,255,0.24)_1px,transparent_1px)] bg-[size:18px_18px] opacity-70" />
      )}

      {showVideo && (
        <div className="pointer-events-none fixed inset-0 z-[2] bg-[radial-gradient(circle_at_50%_20%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.04)_20%,rgba(0,0,0,0.3)_46%,rgba(0,0,0,0.92)_80%)]" />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
