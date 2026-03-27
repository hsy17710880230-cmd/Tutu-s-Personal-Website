"use client";

import { useEffect, useState } from "react";

export default function LandscapeGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLandscape, setIsLandscape] = useState(true);

  useEffect(() => {
    function checkOrientation() {
      const isMobile = window.innerWidth < 900;
      const landscape = window.innerWidth > window.innerHeight;
      setIsLandscape(!isMobile || landscape);
    }

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  if (!isLandscape) {
    return (
      <div className="fixed inset-0 flex items-center justify-center px-6 text-center">
        
        {/* Storybook card */}
        <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-hero border-2 border-white p-10 flex flex-col items-center gap-6">
          
          {/* Cute rotate icon */}
          <div className="text-6xl animate-bounce">
            📱🔄
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold">
            Turn your device!
          </h1>

          {/* Subtitle */}
          <p className="text-lg opacity-80">
            This little gallery works best in landscape mode ✨
          </p>

          {/* Decorative dots */}
          <div className="flex gap-3 mt-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
